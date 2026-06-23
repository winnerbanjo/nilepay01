import { createContext, useContext, useState, useEffect } from 'react';

const NilePayContext = createContext(null);

const defaultApplications = [];

export const NilePayProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('nilepay_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [applications, setApplications] = useState(() => {
    const saved = localStorage.getItem('nilepay_applications');
    return saved ? JSON.parse(saved) : defaultApplications;
  });
  const [backendReady, setBackendReady] = useState(false);
  const [backendStatus, setBackendStatus] = useState('connecting');

  const [activeMerchantAppId, setActiveMerchantAppId] = useState(() => {
    const saved = localStorage.getItem('nilepay_active_merchant_appid');
    return saved || 'house-of-tosi'; // default merchant context
  });

  useEffect(() => {
    localStorage.setItem('nilepay_applications', JSON.stringify(applications));
  }, [applications]);

  useEffect(() => {
    let cancelled = false;

    const loadApplications = async () => {
      try {
        const response = await fetch('/api/applications');
        if (!response.ok) throw new Error('Compliance API unavailable.');
        const payload = await response.json();
        let serverApplications = payload.applications || [];

        if (serverApplications.length === 0) {
          const bootstrapResponse = await fetch('/api/bootstrap', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ applications }),
          });
          if (!bootstrapResponse.ok) throw new Error('Could not initialise compliance records.');
          const bootstrapPayload = await bootstrapResponse.json();
          serverApplications = bootstrapPayload.applications || applications;
        }

        if (!cancelled) {
          setApplications(prev => {
            const serverIds = new Set(serverApplications.map(a => a.id));
            return [
              ...serverApplications,
              ...prev.filter(a => !serverIds.has(a.id))
            ];
          });
          setBackendStatus('connected');
          setBackendReady(true);
        }
      } catch {
        if (!cancelled) {
          setBackendStatus('offline');
          setBackendReady(false);
        }
      }
    };

    loadApplications();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!backendReady) return undefined;

    const syncTimer = setTimeout(async () => {
      try {
        const response = await fetch('/api/applications', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            applications,
            actor: currentUser?.name || currentUser?.email || 'Nile Pay app',
          }),
        });
        if (!response.ok) throw new Error('Sync failed.');
        setBackendStatus('connected');
      } catch {
        setBackendStatus('offline');
      }
    }, 250);

    return () => clearTimeout(syncTimer);
  }, [applications, backendReady, currentUser]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('nilepay_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('nilepay_current_user');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('nilepay_active_merchant_appid', activeMerchantAppId);
  }, [activeMerchantAppId]);

  // Login handler
  const login = (email, password, role) => {
    if (role === 'admin') {
      const adminUser = { email, role: 'admin', name: 'Nile Review Team' };
      setCurrentUser(adminUser);
      return adminUser;
    } else {
      let existingApp = applications.find(a => a.kycData?.email?.toLowerCase() === email.toLowerCase());
      
      if (!existingApp) {
        const newId = email.split('@')[0].replace(/[^a-zA-Z0-9]/g, '-') + '-brand';
        existingApp = {
          id: newId,
          merchantName: email.split('@')[0],
          businessName: email.split('@')[0] + ' Store',
          website: `${email.split('@')[0]}.nile.ng`,
          accountType: null,
          status: 'Draft',
          country: 'Nigeria',
          submittedDate: '-',
          assignedReviewer: null,
          industry: 'Retail',
          notes: '',
          progress: 'Not started',
          created_at: new Date().toISOString(),
          kycData: {
            firstName: '',
            lastName: '',
            email: email,
            phone: '',
            country: 'Nigeria'
          },
          documentVerification: {},
          timeline: [
            { time: new Date().toISOString().replace('T', ' ').substring(0, 16), title: 'Profile Created', description: 'Merchant registered on Nile Pay', user: 'Merchant' }
          ]
        };
        setApplications(prev => [...prev, existingApp]);
      }
      
      const merchantUser = { email, role: 'merchant', appId: existingApp.id, name: existingApp.merchantName };
      setCurrentUser(merchantUser);
      setActiveMerchantAppId(existingApp.id);
      return merchantUser;
    }
  };

  // Sign up handler
  const signup = (signupData) => {
    const newId = signupData.email.split('@')[0].replace(/[^a-zA-Z0-9]/g, '-') + '-app';
    const newApp = {
      id: newId,
      merchantName: `${signupData.firstName} ${signupData.lastName}`,
      businessName: `${signupData.firstName}’s Nile Shop`,
      website: `${signupData.firstName.toLowerCase()}${signupData.lastName.toLowerCase()}.nile.ng`,
      accountType: null,
      status: 'Draft',
      country: signupData.country || 'Nigeria',
      submittedDate: '-',
      assignedReviewer: null,
      industry: 'Retail',
      notes: '',
      progress: 'Profile completed',
      created_at: new Date().toISOString(),
      kycData: {
        firstName: signupData.firstName,
        lastName: signupData.lastName,
        email: signupData.email,
        phone: signupData.phone,
        country: signupData.country || 'Nigeria',
        bvn: '',
        dob: ''
      },
      documentVerification: {},
      timeline: [
        { time: new Date().toISOString().replace('T', ' ').substring(0, 16), title: 'Profile Created', description: 'Sign-up completed and profile initialized.', user: 'Merchant' },
        { time: new Date().toISOString().replace('T', ' ').substring(0, 16), title: 'Contact Details Submitted', description: 'Phone number queued for manual compliance verification.', user: 'Merchant' }
      ]
    };

    setApplications(prev => [...prev, newApp]);
    const merchantUser = { email: signupData.email, role: 'merchant', appId: newId, name: newApp.merchantName };
    setCurrentUser(merchantUser);
    setActiveMerchantAppId(newId);
    return merchantUser;
  };

  // Direct Immediate Backend Sync Helper
  const syncWithBackend = async (updatedApps) => {
    try {
      await fetch('/api/applications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          applications: updatedApps,
          actor: currentUser?.name || currentUser?.email || 'Nile Pay app',
        }),
      });
      setBackendStatus('connected');
    } catch (err) {
      console.error('Immediate sync failed:', err);
      setBackendStatus('offline');
    }
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const selectActiveMerchantApp = (id) => {
    setActiveMerchantAppId(id);
    const app = applications.find(a => a.id === id);
    if (app && currentUser && currentUser.role === 'merchant') {
      setCurrentUser(prev => ({
        ...prev,
        appId: id,
        name: app.merchantName,
        email: app.kycData?.email || prev.email
      }));
    }
  };

  // Guest signup initiator
  const startNewSignup = (type) => {
    const newId = 'np-' + Math.random().toString(36).substring(2, 11);
    const newApp = {
      id: newId,
      merchantName: 'New Merchant',
      businessName: 'Pending Onboarding',
      website: 'pending.nile.ng',
      accountType: type,
      status: 'Draft',
      country: 'Nigeria',
      submittedDate: '-',
      assignedReviewer: null,
      industry: 'Retail',
      notes: '',
      progress: 'Account type selected',
      created_at: new Date().toISOString(),
      kycData: {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        country: 'Nigeria'
      },
      documentVerification: {},
      timeline: [
        { time: new Date().toISOString().replace('T', ' ').substring(0, 16), title: 'Draft Initialized', description: `Started ${type} onboarding flow.`, user: 'Merchant' }
      ]
    };

    const updated = [...applications.filter(a => a.id !== newId), newApp];
    setApplications(updated);
    setActiveMerchantAppId(newId);
    syncWithBackend(updated);
    return newApp;
  };

  const saveDraft = (id, data, progressString) => {
    const updated = applications.map(app => {
      if (app.id === id) {
        const merchantName = (data.firstName && data.lastName) 
          ? `${data.firstName} ${data.lastName}` 
          : app.merchantName;
        const businessName = data.businessName || app.businessName;
        const website = data.website || app.website;

        return {
          ...app,
          merchantName,
          businessName,
          website,
          kycData: { ...app.kycData, ...data },
          progress: progressString || app.progress,
          timeline: [
            ...app.timeline,
            {
              time: new Date().toISOString().replace('T', ' ').substring(0, 16),
              title: 'Draft Saved',
              description: `Onboarding progress saved: ${progressString}`,
              user: 'Merchant'
            }
          ]
        };
      }
      return app;
    });
    setApplications(updated);
    syncWithBackend(updated);
  };

  const selectAccountType = (id, type) => {
    const updated = applications.map(app => {
      if (app.id === id) {
        return {
          ...app,
          accountType: type,
          progress: '1 of 6 sections completed',
          timeline: [
            ...app.timeline,
            {
              time: new Date().toISOString().replace('T', ' ').substring(0, 16),
              title: 'Account Type Selected',
              description: `Selected: ${type === 'individual' ? 'Individual / SME' : 'Registered Business / Corporate Entity'}`,
              user: 'Merchant'
            }
          ]
        };
      }
      return app;
    });
    setApplications(updated);
    syncWithBackend(updated);
  };

  const checkApplicationUniqueness = (appId, data) => {
    const email = data.email?.trim().toLowerCase();
    const bvn = data.bvn?.trim();
    const rcNumber = data.rcNumber?.trim();
    const taxId = data.taxId?.trim();

    for (const app of applications) {
      if (app.id === appId) continue;
      
      const isActive = ['Submitted', 'Under Review', 'Approved', 'Account Created', 'Payment Activated', 'More Info Required'].includes(app.status);
      if (!isActive) continue;

      if (email && app.kycData?.email?.trim().toLowerCase() === email) {
        return { valid: false, reason: `Email address (${email}) is already registered under another active merchant profile.` };
      }
      if (bvn && app.kycData?.bvn?.trim() === bvn) {
        return { valid: false, reason: `Bank Verification Number (BVN) is already registered under another active merchant profile.` };
      }
      if (rcNumber && app.kycData?.rcNumber?.trim() === rcNumber) {
        return { valid: false, reason: `Registration Number / CAC RC Number (${rcNumber}) is already registered under another active merchant profile.` };
      }
      if (taxId && app.kycData?.taxId?.trim() === taxId) {
        return { valid: false, reason: `Tax Identification Number (TIN) is already registered under another active merchant profile.` };
      }
    }
    return { valid: true };
  };

  const submitToCompliance = (id, completeData) => {
    const uniqueness = checkApplicationUniqueness(id, completeData);
    if (!uniqueness.valid) {
      alert(uniqueness.reason);
      return { success: false, error: uniqueness.reason };
    }

    const timeStr = new Date().toISOString().replace('T', ' ').substring(0, 16);
    const updated = applications.map(app => {
      if (app.id === id) {
        const docVerification = {};
        if (completeData.idFile) docVerification.governmentId = { status: 'pending', fileName: completeData.idFile.name };
        if (completeData.utilityFile) docVerification.utilityBill = { status: 'pending', fileName: completeData.utilityFile.name };
        if (completeData.cacCertFile) docVerification.cacCertFile = { status: 'pending', fileName: completeData.cacCertFile.name };
        if (completeData.memartFile) docVerification.memartFile = { status: 'pending', fileName: completeData.memartFile.name };
        if (completeData.statusReportFile) docVerification.statusReportFile = { status: 'pending', fileName: completeData.statusReportFile.name };
        if (completeData.amlQuestionnaireFile) docVerification.amlQuestionnaire = { status: 'pending', fileName: completeData.amlQuestionnaireFile.name };

        const merchantName = (completeData.firstName && completeData.lastName) 
          ? `${completeData.firstName} ${completeData.lastName}` 
          : app.merchantName;
        const businessName = completeData.businessName || app.businessName;
        const website = completeData.website || app.website;

        return {
          ...app,
          merchantName,
          businessName,
          website,
          status: 'Submitted',
          submittedDate: timeStr.split(' ')[0],
          progress: '100% completed',
          kycData: { ...app.kycData, ...completeData },
          documentVerification: docVerification,
          timeline: [
            ...app.timeline,
            {
              time: timeStr,
              title: 'Application Submitted',
              description: 'KYC application sent to compliance team',
              user: 'Merchant'
            }
          ]
        };
      }
      return app;
    });
    setApplications(updated);
    syncWithBackend(updated);
    return { success: true };
  };

  const startReview = (id, reviewerName) => {
    const timeStr = new Date().toISOString().replace('T', ' ').substring(0, 16);
    const updated = applications.map(app => {
      if (app.id === id) {
        return {
          ...app,
          status: 'Under Review',
          assignedReviewer: reviewerName,
          timeline: [
            ...app.timeline,
            {
              time: timeStr,
              title: 'Review Started',
              description: `Compliance officer ${reviewerName} started review`,
              user: reviewerName
            }
          ]
        };
      }
      return app;
    });
    setApplications(updated);
    syncWithBackend(updated);
  };

  const verifyDocument = (appId, docKey, reviewStatus, rejectionReason = '') => {
    const timeStr = new Date().toISOString().replace('T', ' ').substring(0, 16);
    const updated = applications.map(app => {
      if (app.id === appId) {
        const docVerification = { ...app.documentVerification };
        docVerification[docKey] = {
          ...docVerification[docKey],
          status: reviewStatus,
          rejectionReason: reviewStatus === 'rejected' ? rejectionReason : undefined
        };
        
        const docLabel = docKey === 'governmentId' ? 'Government ID' 
                       : docKey === 'utilityBill' ? 'Utility Bill' 
                       : docKey === 'cacCertFile' ? 'CAC Certificate' 
                       : docKey === 'memartFile' ? 'MEMART Document' 
                       : 'Compliance Document';
                       
        return {
          ...app,
          documentVerification: docVerification,
          timeline: [
            ...app.timeline,
            {
              time: timeStr,
              title: reviewStatus === 'approved' ? `${docLabel} Approved` : `${docLabel} Flagged`,
              description: reviewStatus === 'approved' 
                ? `${docLabel} successfully verified.` 
                : `${docLabel} rejected: ${rejectionReason}`,
              user: currentUser?.name || 'Compliance Officer'
            }
          ]
        };
      }
      return app;
    });
    setApplications(updated);
    syncWithBackend(updated);
  };

  const requestMoreInformation = (id, message, missingDocLabel) => {
    const timeStr = new Date().toISOString().replace('T', ' ').substring(0, 16);
    const updated = applications.map(app => {
      if (app.id === id) {
        return {
          ...app,
          status: 'More Info Required',
          notes: `${app.notes}\n[Requested info on ${timeStr.split(' ')[0]}]: ${message}`,
          timeline: [
            ...app.timeline,
            {
              time: timeStr,
              title: 'Information Requested',
              description: `Requested: ${missingDocLabel}. Details: "${message}"`,
              user: currentUser?.name || 'Compliance Officer'
            }
          ]
        };
      }
      return app;
    });
    setApplications(updated);
    syncWithBackend(updated);
  };

  const updateApplicationStatus = (id, nextStatus, note = '') => {
    const timeStr = new Date().toISOString().replace('T', ' ').substring(0, 16);
    const updated = applications.map(app => {
      if (app.id === id) {
        let timelineEvent = {
          time: timeStr,
          title: `Status Changed to ${nextStatus}`,
          description: note || `Application updated to ${nextStatus}`,
          user: currentUser?.name || 'Compliance Officer'
        };

        if (nextStatus === 'Approved') {
          timelineEvent = {
            time: timeStr,
            title: 'Application Approved',
            description: 'Compliance checks passed successfully.',
            user: currentUser?.name || 'Compliance Officer'
          };
        } else if (nextStatus === 'Rejected') {
          timelineEvent = {
            time: timeStr,
            title: 'Application Rejected',
            description: `Reason: ${note}`,
            user: currentUser?.name || 'Compliance Officer'
          };
        } else if (nextStatus === 'Account Created') {
          timelineEvent = {
            time: timeStr,
            title: 'Merchant Account Created',
            description: 'Merchant account created after compliance approval.',
            user: 'Partner API'
          };
        } else if (nextStatus === 'Payment Activated') {
          timelineEvent = {
            time: timeStr,
            title: 'Payment Activated',
            description: `Payment gateway configured and activated for ${app.website}`,
            user: 'System'
          };
        }

        return {
          ...app,
          status: nextStatus,
          notes: note ? `${app.notes}\n[Status ${nextStatus}]: ${note}` : app.notes,
          timeline: [...app.timeline, timelineEvent]
        };
      }
      return app;
    });
    setApplications(updated);
    syncWithBackend(updated);
  };

  const resetDemo = () => {
    setApplications(defaultApplications);
    localStorage.setItem('nilepay_applications', JSON.stringify(defaultApplications));
  };

  const activeApp = currentUser?.role === 'merchant'
    ? applications.find(a => a.id === currentUser.appId)
    : (applications.find(a => a.id === activeMerchantAppId) || null);

  return (
    <NilePayContext.Provider value={{
      currentUser,
      applications,
      backendStatus,
      activeMerchantAppId,
      activeApp,
      login,
      signup,
      logout,
      selectActiveMerchantApp,
      saveDraft,
      selectAccountType,
      submitToCompliance,
      startReview,
      verifyDocument,
      requestMoreInformation,
      updateApplicationStatus,
      resetDemo,
      startNewSignup,
      checkApplicationUniqueness
    }}>
      {children}
    </NilePayContext.Provider>
  );
};

export const useNilePay = () => {
  const context = useContext(NilePayContext);
  if (!context) {
    throw new Error('useNilePay must be used within a NilePayProvider');
  }
  return context;
};
