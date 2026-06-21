import React, { createContext, useContext, useState, useEffect } from 'react';

const NilePayContext = createContext(null);

const defaultApplications = [
  {
    id: 'house-of-tosi',
    merchantName: 'Tosi Adegoke',
    businessName: 'House of Tosi',
    website: 'houseoftosi.nile.ng',
    accountType: 'individual',
    status: 'Under Review',
    country: 'Nigeria',
    submittedDate: '2026-06-18',
    assignedReviewer: 'Amara Nwosu',
    industry: 'Fashion & Apparel',
    notes: 'Checking BVN match with government ID database. Address looks valid.',
    progress: '100% completed',
    kycData: {
      firstName: 'Tosi',
      lastName: 'Adegoke',
      email: 'tosi@houseoftosi.ng',
      phone: '+234 812 345 6789',
      country: 'Nigeria',
      bvn: '22244455566',
      dob: '1992-04-12',
      idType: 'Driver’s License',
      idFile: { name: 'tosi_license.png', size: '1.2MB', type: 'image/png' },
      companyType: 'SME Retail',
      rcNumber: '',
      businessName: 'House of Tosi',
      industry: 'Fashion & Apparel',
      businessDesc: 'Luxury ready-to-wear African prints and customized tailoring.',
      supportPhone: '+234 812 345 6789',
      supportEmail: 'hello@houseoftosi.ng',
      website: 'houseoftosi.nile.ng',
      address: '12 Joel Ogunnaike St, Ikeja GRA',
      state: 'Lagos',
      city: 'Ikeja',
      utilityFile: { name: 'lawma_bill_may2026.pdf', size: '2.4MB', type: 'application/pdf' },
      payoutMethod: 'Bank Account',
      bankName: 'Guaranty Trust Bank (GTBank)',
      accountNumber: '0123456789',
      accountName: 'TOSI ADEGOKE RETAIL'
    },
    documentVerification: {
      governmentId: { status: 'approved', fileName: 'tosi_license.png' },
      utilityBill: { status: 'pending', fileName: 'lawma_bill_may2026.pdf' }
    },
    timeline: [
      { time: '2026-06-18 10:00', title: 'Profile Created', description: 'Tosi Adegoke registered on Nile Pay', user: 'Merchant' },
      { time: '2026-06-18 10:15', title: 'Phone Verified', description: 'OTP verification complete', user: 'System' },
      { time: '2026-06-18 11:20', title: 'Documents Uploaded', description: 'Driver License and Utility Bill uploaded', user: 'Merchant' },
      { time: '2026-06-18 11:45', title: 'Submitted to Compliance', description: 'Onboarding application queued for review', user: 'Merchant' },
      { time: '2026-06-18 14:00', title: 'Compliance Review Started', description: 'Application assigned to Amara Nwosu', user: 'Amara Nwosu' }
    ]
  },
  {
    id: 'beach-boiz',
    merchantName: 'Kofi Mensah',
    businessName: 'Beach Boiz',
    website: 'beachboiz.nile.ng',
    accountType: 'individual',
    status: 'More Info Required',
    country: 'Ghana',
    submittedDate: '2026-06-17',
    assignedReviewer: 'Amara Nwosu',
    industry: 'Tourism & Leisure',
    notes: 'ID verified. Utility bill is completely blurry and needs replacement.',
    progress: '80% completed',
    kycData: {
      firstName: 'Kofi',
      lastName: 'Mensah',
      email: 'kofi@beachboiz.com',
      phone: '+233 24 123 4567',
      country: 'Ghana',
      bvn: '', // No BVN in Ghana
      dob: '1988-09-25',
      idType: 'International Passport',
      idFile: { name: 'kofi_passport.jpg', size: '3.1MB', type: 'image/jpeg' },
      companyType: 'Individual Merchant',
      rcNumber: '',
      businessName: 'Beach Boiz Tours',
      industry: 'Tourism & Leisure',
      businessDesc: 'Accra beach tourism, surf rentals, and guided coastal tours.',
      supportPhone: '+233 24 123 4567',
      supportEmail: 'bookings@beachboiz.com',
      website: 'beachboiz.nile.ng',
      address: 'Plot 4, Labadi Beach Road',
      state: 'Greater Accra',
      city: 'Accra',
      utilityFile: { name: 'electricity_bill.png', size: '4.8MB', type: 'image/png' },
      payoutMethod: 'Mobile Money',
      bankName: 'MTN Mobile Money',
      accountNumber: '0241234567',
      accountName: 'KOFI MENSAH'
    },
    documentVerification: {
      governmentId: { status: 'approved', fileName: 'kofi_passport.jpg' },
      utilityBill: { status: 'rejected', fileName: 'electricity_bill.png', rejectionReason: 'The bill scan is extremely low-resolution and blurry. The address and name cannot be read.' }
    },
    timeline: [
      { time: '2026-06-17 08:30', title: 'Profile Created', description: 'Kofi Mensah registered on Nile Pay', user: 'Merchant' },
      { time: '2026-06-17 09:40', title: 'Submitted to Compliance', description: 'Application submitted', user: 'Merchant' },
      { time: '2026-06-17 13:10', title: 'Compliance Review Started', description: 'Review started by Amara Nwosu', user: 'Amara Nwosu' },
      { time: '2026-06-17 15:30', title: 'Information Requested', description: 'More info requested: Blurry Utility Bill', user: 'Amara Nwosu' }
    ]
  },
  {
    id: 'dripforge-luxury',
    merchantName: 'Emeka Obi',
    businessName: 'Dripforge Luxury',
    website: 'dripforgeluxury.nile.ng',
    accountType: 'corporate',
    status: 'Submitted',
    country: 'Nigeria',
    submittedDate: '2026-06-19',
    assignedReviewer: null,
    industry: 'E-commerce Retail',
    notes: '',
    progress: '100% completed',
    kycData: {
      firstName: 'Emeka',
      lastName: 'Obi',
      email: 'emeka@dripforge.luxury',
      phone: '+234 901 234 5678',
      companyType: 'LLC',
      rcNumber: 'RC-998822',
      businessName: 'Dripforge Luxury',
      tradeName: 'Dripforge',
      industry: 'E-commerce Retail',
      businessDesc: 'Imported luxury designer footwear, wristwatches, and apparel.',
      taxId: 'TIN-445566-009',
      supportPhone: '+234 901 234 5678',
      supportEmail: 'sales@dripforge.luxury',
      website: 'dripforgeluxury.nile.ng',
      socialUrl: 'https://instagram.com/dripforge.luxury',
      address: '88 Awolowo Road',
      state: 'Lagos',
      city: 'Ikoyi',
      country: 'Nigeria',
      utilityFile: { name: 'electric_bill_dripforge.pdf', size: '1.8MB', type: 'application/pdf' },
      cacCertFile: { name: 'cac_incorporation_cert.pdf', size: '2.1MB', type: 'application/pdf' },
      memartFile: { name: 'memart_dripforge.pdf', size: '4.5MB', type: 'application/pdf' },
      statusReportFile: { name: 'status_report_cac.pdf', size: '1.5MB', type: 'application/pdf' },
      boardResolutionFile: { name: 'board_res_payouts.pdf', size: '1.1MB', type: 'application/pdf' },
      amlQuestionnaireFile: { name: 'aml_questionnaire_filled.pdf', size: '1.3MB', type: 'application/pdf' },
      amlPolicyFile: { name: 'aml_policy_signed.pdf', size: '2.7MB', type: 'application/pdf' },
      kycPolicyFile: { name: 'kyc_policy_dripforge.pdf', size: '1.9MB', type: 'application/pdf' },
      authorisers: [
        { type: 'Director', bvn: '11122233344', firstName: 'Emeka', lastName: 'Obi', phone: '+234 901 234 5678', idType: 'National ID', idFile: { name: 'emeka_nin.jpg', size: '1.4MB' } }
      ],
      invitees: [
        { name: 'Sandra Obi', email: 'sandra@dripforge.luxury', role: 'Director', isUbo: 'Yes' }
      ]
    },
    documentVerification: {
      cacCertFile: { status: 'pending', fileName: 'cac_incorporation_cert.pdf' },
      memartFile: { status: 'pending', fileName: 'memart_dripforge.pdf' },
      utilityBill: { status: 'pending', fileName: 'electric_bill_dripforge.pdf' },
      amlQuestionnaire: { status: 'pending', fileName: 'aml_questionnaire_filled.pdf' }
    },
    timeline: [
      { time: '2026-06-19 09:00', title: 'Profile Created', description: 'Emeka Obi created corporate profile', user: 'Merchant' },
      { time: '2026-06-19 12:15', title: 'All KYC Documents Uploaded', description: 'CAC Cert, MEMART, AML policies uploaded', user: 'Merchant' },
      { time: '2026-06-19 12:30', title: 'Submitted to Compliance', description: 'Application submitted', user: 'Merchant' }
    ]
  },
  {
    id: 'sorelia-beauty',
    merchantName: 'Aisha Bello',
    businessName: 'Sorelia Beauty',
    website: 'soreliabeauty.nile.ng',
    accountType: 'corporate',
    status: 'Payment Activated',
    country: 'Nigeria',
    submittedDate: '2026-06-10',
    assignedReviewer: 'Amara Nwosu',
    industry: 'Cosmetics & Beauty',
    notes: 'All documents in order. Checked CAC registration and TIN. Approved.',
    progress: '100% completed',
    kycData: {
      firstName: 'Aisha',
      lastName: 'Bello',
      email: 'aisha@sorelia.com',
      phone: '+234 703 123 4567',
      companyType: 'LLC',
      rcNumber: 'RC-112233',
      businessName: 'Sorelia Beauty',
      tradeName: 'Sorelia',
      industry: 'Cosmetics & Beauty',
      businessDesc: 'Locally formulated skincare and cosmetics retailer.',
      taxId: 'TIN-332211-008',
      supportPhone: '+234 703 123 4567',
      supportEmail: 'support@sorelia.com',
      website: 'soreliabeauty.nile.ng',
      socialUrl: 'https://twitter.com/soreliabeauty',
      address: '22 Admiralty Way',
      state: 'Lagos',
      city: 'Lekki Phase 1',
      country: 'Nigeria',
      utilityFile: { name: 'ekedc_bill_sorelia.pdf', size: '2.1MB' },
      cacCertFile: { name: 'cac_sorelia.pdf', size: '1.9MB' },
      memartFile: { name: 'memart_sorelia.pdf', size: '3.4MB' },
      statusReportFile: { name: 'cac_status_report.pdf', size: '1.2MB' },
      boardResolutionFile: { name: 'board_res_sorelia.pdf', size: '1.0MB' },
      amlQuestionnaireFile: { name: 'aml_questionnaire_sorelia.pdf', size: '1.4MB' },
      amlPolicyFile: { name: 'aml_policy_sorelia.pdf', size: '2.1MB' },
      kycPolicyFile: { name: 'kyc_policy_sorelia.pdf', size: '1.7MB' },
      authorisers: [
        { type: 'Director', bvn: '55566677788', firstName: 'Aisha', lastName: 'Bello', phone: '+234 703 123 4567', idType: 'International Passport', idFile: { name: 'aisha_passport.jpg', size: '2.8MB' } }
      ],
      invitees: []
    },
    documentVerification: {
      cacCertFile: { status: 'approved', fileName: 'cac_sorelia.pdf' },
      memartFile: { status: 'approved', fileName: 'memart_sorelia.pdf' },
      utilityBill: { status: 'approved', fileName: 'ekedc_bill_sorelia.pdf' },
      amlQuestionnaire: { status: 'approved', fileName: 'aml_questionnaire_sorelia.pdf' }
    },
    timeline: [
      { time: '2026-06-10 09:00', title: 'Submitted to Compliance', description: 'Application submitted', user: 'Merchant' },
      { time: '2026-06-10 11:00', title: 'Review Started', description: 'Review assigned to Amara Nwosu', user: 'Amara Nwosu' },
      { time: '2026-06-10 14:30', title: 'Approved by Compliance', description: 'All KYC checks completed successfully', user: 'Amara Nwosu' },
      { time: '2026-06-10 15:00', title: 'Merchant Account Created', description: 'Merchant account created after compliance approval', user: 'System' },
      { time: '2026-06-10 16:30', title: 'Payment Activated', description: 'Nile website payments activated for soreliabeauty.nile.ng', user: 'System' }
    ]
  },
  {
    id: 'cheche-wears',
    merchantName: 'Cheche Nduta',
    businessName: 'Cheche Wears',
    website: 'chechewears.nile.ng',
    accountType: 'individual',
    status: 'Draft',
    country: 'Kenya',
    submittedDate: '-',
    assignedReviewer: null,
    industry: 'Fashion & Apparel',
    notes: '',
    progress: 'Personal details complete',
    kycData: {
      firstName: 'Cheche',
      lastName: 'Nduta',
      email: 'cheche@chechewears.co.ke',
      phone: '+254 712 345 678',
      country: 'Kenya',
      bvn: '',
      dob: '1995-12-05',
      idType: '',
      companyType: 'SME Retail',
      businessName: 'Cheche Wears',
      industry: 'Fashion & Apparel',
      website: 'chechewears.nile.ng'
    },
    documentVerification: {},
    timeline: [
      { time: '2026-06-19 14:10', title: 'Draft Initiated', description: 'Merchant started filling out registration details', user: 'Merchant' }
    ]
  }
];

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
          setApplications(serverApplications);
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
      const adminUser = { email, role: 'admin', name: 'Amara Nwosu' };
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

  const saveDraft = (id, data, progressString) => {
    setApplications(prev => prev.map(app => {
      if (app.id === id) {
        return {
          ...app,
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
    }));
  };

  const selectAccountType = (id, type) => {
    setApplications(prev => prev.map(app => {
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
    }));
  };

  const submitToCompliance = (id, completeData) => {
    const timeStr = new Date().toISOString().replace('T', ' ').substring(0, 16);
    setApplications(prev => prev.map(app => {
      if (app.id === id) {
        const docVerification = {};
        if (completeData.idFile) docVerification.governmentId = { status: 'pending', fileName: completeData.idFile.name };
        if (completeData.utilityFile) docVerification.utilityBill = { status: 'pending', fileName: completeData.utilityFile.name };
        if (completeData.cacCertFile) docVerification.cacCertFile = { status: 'pending', fileName: completeData.cacCertFile.name };
        if (completeData.memartFile) docVerification.memartFile = { status: 'pending', fileName: completeData.memartFile.name };
        if (completeData.statusReportFile) docVerification.statusReportFile = { status: 'pending', fileName: completeData.statusReportFile.name };
        if (completeData.amlQuestionnaireFile) docVerification.amlQuestionnaire = { status: 'pending', fileName: completeData.amlQuestionnaireFile.name };

        return {
          ...app,
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
    }));
  };

  const startReview = (id, reviewerName) => {
    const timeStr = new Date().toISOString().replace('T', ' ').substring(0, 16);
    setApplications(prev => prev.map(app => {
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
    }));
  };

  const verifyDocument = (appId, docKey, reviewStatus, rejectionReason = '') => {
    setApplications(prev => prev.map(app => {
      if (app.id === appId) {
        const docVerification = { ...app.documentVerification };
        docVerification[docKey] = {
          ...docVerification[docKey],
          status: reviewStatus,
          rejectionReason: reviewStatus === 'rejected' ? rejectionReason : undefined
        };
        
        const timeStr = new Date().toISOString().replace('T', ' ').substring(0, 16);
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
    }));
  };

  const requestMoreInformation = (id, message, missingDocLabel) => {
    const timeStr = new Date().toISOString().replace('T', ' ').substring(0, 16);
    setApplications(prev => prev.map(app => {
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
    }));
  };

  const updateApplicationStatus = (id, nextStatus, note = '') => {
    const timeStr = new Date().toISOString().replace('T', ' ').substring(0, 16);
    setApplications(prev => prev.map(app => {
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
    }));
  };

  const resetDemo = () => {
    setApplications(defaultApplications);
    localStorage.setItem('nilepay_applications', JSON.stringify(defaultApplications));
  };

  const activeApp = applications.find(a => a.id === activeMerchantAppId) || applications[0];

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
      resetDemo
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
