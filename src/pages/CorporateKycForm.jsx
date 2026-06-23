import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNilePay } from '../context/NilePayContext';
import { Input, Select, FileUploadCard, ProgressStepper } from '../components/FormComponents';
import { ArrowLeft, ArrowRight, Save, CheckCircle, Plus, Trash2, Mail } from 'lucide-react';

const STEPS = [
  'Representative details',
  'Business details',
  'Address verification',
  'Incorporation documents',
  'AML / CFT documents',
  'Industry documents',
  'Authorisers',
  'Beneficial owners',
  'Review and submit'
];

export default function CorporateKycForm() {
  const { activeApp, saveDraft, submitToCompliance } = useNilePay();
  const navigate = useNavigate();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    authorisers: [],
    invitees: []
  });
  const [errors, setErrors] = useState({});
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Authoriser sub-form state
  const [newAuth, setNewAuth] = useState({
    type: 'Director', nationality: 'Nigeria', bvn: '', firstName: '', lastName: '', phone: '', idType: 'National ID', idFile: null, residentPermitFile: null
  });
  // Invitee sub-form state
  const [newInv, setNewInv] = useState({
    name: '', email: '', role: 'Beneficial Owner', isUbo: 'Yes'
  });

  useEffect(() => {
    if (activeApp && activeApp.kycData) {
      setFormData({
        authorisers: [],
        invitees: [],
        ...activeApp.kycData
      });
    }
  }, [activeApp]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: null });
    }
  };

  const handleFileChange = (fieldName, file, errorMsg) => {
    if (errorMsg) {
      setErrors({ ...errors, [fieldName]: errorMsg });
      setFormData({ ...formData, [fieldName]: null });
    } else {
      setFormData({ ...formData, [fieldName]: file });
      setErrors({ ...errors, [fieldName]: null });
    }
  };

  const handleSaveDraft = () => {
    saveDraft(activeApp.id, formData, `${currentStep + 1} of 9 sections completed`);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  // Add Authoriser
  const addAuthoriser = () => {
    if (!newAuth.firstName || !newAuth.lastName || !newAuth.phone) {
      alert('Please fill out the authoriser’s name and contact number.');
      return;
    }
    if (newAuth.nationality === 'Nigeria' && (!newAuth.bvn || newAuth.bvn.length !== 11)) {
      alert('Authoriser’s BVN is required and must be 11 digits.');
      return;
    }
    if (!newAuth.idType || !newAuth.idFile) {
      alert('Select a valid ID type and upload the authoriser’s ID.');
      return;
    }
    if (newAuth.nationality !== 'Nigeria' && !newAuth.residentPermitFile) {
      alert('A resident permit is required for non-Nigerian authorisers.');
      return;
    }
    setFormData({
      ...formData,
      authorisers: [...formData.authorisers, { ...newAuth }]
    });
    // Reset authoriser state
    setNewAuth({
      type: 'Director', nationality: 'Nigeria', bvn: '', firstName: '', lastName: '', phone: '', idType: 'National ID', idFile: null, residentPermitFile: null
    });
  };

  const removeAuthoriser = (idx) => {
    setFormData({
      ...formData,
      authorisers: formData.authorisers.filter((_, i) => i !== idx)
    });
  };

  // Invite Beneficial Owner
  const sendInvite = () => {
    if (!newInv.name || !newInv.email) {
      alert('Please fill in the invitee’s name and email.');
      return;
    }
    setFormData({
      ...formData,
      invitees: [...formData.invitees, { ...newInv }]
    });
    alert(`Verification invite sent to ${newInv.email}`);
    setNewInv({
      name: '', email: '', role: 'Beneficial Owner', isUbo: 'Yes'
    });
  };

  const removeInvitee = (idx) => {
    setFormData({
      ...formData,
      invitees: formData.invitees.filter((_, i) => i !== idx)
    });
  };

  const validateStep = (step) => {
    const tempErrors = {};
    const emailRegex = /\S+@\S+\.\S+/;

    if (step === 0) {
      if (!formData.firstName?.trim()) tempErrors.firstName = 'Representative first name is required.';
      if (!formData.lastName?.trim()) tempErrors.lastName = 'Representative last name is required.';
      if (!formData.email) {
        tempErrors.email = 'Representative email is required.';
      } else if (!emailRegex.test(formData.email)) {
        tempErrors.email = 'Please enter a valid representative email.';
      }
      if (!formData.phone?.trim()) tempErrors.phone = 'Representative contact number is required.';
      if (!formData.password) {
        tempErrors.password = 'Password is required.';
      } else if (formData.password.length < 6) {
        tempErrors.password = 'Password must be at least 6 characters.';
      }
      if (formData.password !== formData.confirmPassword) {
        tempErrors.confirmPassword = 'Passwords do not match.';
      }
    }

    if (step === 1) {
      if (!formData.companyType) tempErrors.companyType = 'Company type is required.';
      if (!formData.rcNumber?.trim()) tempErrors.rcNumber = 'Registration / RC number is required.';
      if (!formData.businessName?.trim()) tempErrors.businessName = 'Business name is required.';
      if (!formData.tradeName?.trim()) tempErrors.tradeName = 'Trade name is required.';
      if (!formData.industry) tempErrors.industry = 'Industry is required.';
      if (!formData.businessType?.trim()) tempErrors.businessType = 'Type of business is required.';
      if (!formData.businessNature?.trim()) tempErrors.businessNature = 'Nature of business is required.';
      if (!formData.businessPurpose?.trim()) tempErrors.businessPurpose = 'Purpose of business is required.';
      if (!formData.taxId?.trim()) tempErrors.taxId = 'Tax Identification Number (TIN) is required.';
      if (!formData.supportPhone?.trim()) tempErrors.supportPhone = 'Contact phone is required.';
      
      if (!formData.supportEmail) {
        tempErrors.supportEmail = 'Contact email is required.';
      } else if (!emailRegex.test(formData.supportEmail)) {
        tempErrors.supportEmail = 'Contact email is invalid.';
      }
      
      if (!formData.website) {
        tempErrors.website = 'Website is required.';
      } else if (!formData.website.includes('.nile.ng') && !formData.website.includes('http')) {
        tempErrors.website = 'Website URL must be valid (e.g. brand.nile.ng).';
      }
      if (!formData.socialUrl?.trim()) tempErrors.socialUrl = 'At least one social media profile URL is required.';
    }

    if (step === 2) {
      if (!formData.address?.trim()) tempErrors.address = 'Registered business address is required.';
      if (!formData.country) tempErrors.country = 'Country is required.';
      if (!formData.state?.trim()) tempErrors.state = 'State / Province is required.';
      if (!formData.city?.trim()) tempErrors.city = 'City is required.';
      if (!formData.utilityFile) tempErrors.utilityFile = 'Please upload business utility bill.';
    }

    if (step === 3) {
      if (!formData.cacCertFile) tempErrors.cacCertFile = 'Certificate of Incorporation is required.';
      if (!formData.memartFile) tempErrors.memartFile = 'MEMART document is required.';
      if (!formData.statusReportFile) tempErrors.statusReportFile = 'CAC Status Report is required.';
      if (!formData.boardResolutionFile) tempErrors.boardResolutionFile = 'Board Resolution is required.';
      if (!formData.hasEntityShareholder) tempErrors.hasEntityShareholder = 'Please confirm whether an entity is a shareholder.';
      if (formData.hasEntityShareholder === 'Yes' && !formData.uboDocsFile) {
        tempErrors.uboDocsFile = 'UBO documents are required when an entity is a shareholder.';
      }
    }

    if (step === 4) {
      if (!formData.amlQuestionnaireFile) tempErrors.amlQuestionnaireFile = 'Completed AML/CFT Questionnaire is required.';
      if (!formData.amlPolicyFile) tempErrors.amlPolicyFile = 'Anti-Money Laundering Policy is required.';
      if (!formData.kycPolicyFile) tempErrors.kycPolicyFile = 'KYC Policy is required.';
    }

    if (step === 5) {
      // Conditional checks based on industry
      const ind = formData.industry;
      if (ind === 'Betting / Lottery' && !formData.bettingLicenseFile) {
        tempErrors.bettingLicenseFile = 'Betting License is required.';
      } else if (ind === 'Lending / Loans' && !formData.lendingLicenseFile) {
        tempErrors.lendingLicenseFile = 'Money Lending License is required.';
      } else if (ind === 'Banking / Fintech / Payments / Remittance / Wallet' && !formData.cbnLicenseFile) {
        tempErrors.cbnLicenseFile = 'CBN License / Application Letter is required.';
      } else if (['Crypto', 'Bureau de Change', 'Real Estate', 'Legal', 'Accounting / Audit', 'Consulting'].includes(ind) && !formData.scumlCertFile) {
        tempErrors.scumlCertFile = 'SCUML Certificate is required.';
      }
    }

    if (step === 6) {
      if (formData.authorisers.length === 0) {
        tempErrors.authorisers = 'Please add at least one authoriser (Director/Shareholder).';
      }
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, STEPS.length - 1));
      saveDraft(activeApp.id, formData, `${Math.min(currentStep + 2, 9)} of 9 completed`);
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validate all sections
    for (let i = 0; i < STEPS.length - 1; i++) {
      if (!validateStep(i)) {
        alert(`Required fields are missing in step: ${STEPS[i]}. Please check.`);
        return;
      }
    }
    
    if (!activeApp) {
      alert('Your onboarding session could not be resolved. Please restart the sign-up process.');
      navigate('/signup');
      return;
    }
    
    // Submit corporate KYC
    submitToCompliance(activeApp.id, formData);
    navigate('/kyc/submitted');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Progress Stepper Sidebar */}
        <ProgressStepper steps={STEPS} currentStep={currentStep} />

        {/* Form Container */}
        <div className="flex-1 bg-white rounded-3xl border border-nile-border p-6 sm:p-10 shadow-sm space-y-8">
          
          {/* Header */}
          <div className="flex justify-between items-center border-b border-nile-border pb-4">
            <div>
              <span className="text-xs font-bold text-nile-muted uppercase tracking-wider">
                Corporate Entity Onboarding
              </span>
              <h2 className="text-xl font-bold text-nile-darkgreen mt-1">{STEPS[currentStep]}</h2>
            </div>
            
            {/* Save draft */}
            <div className="flex items-center space-x-3">
              {saveSuccess && (
                <span className="text-xs text-nile-success font-medium flex items-center gap-1">
                  <CheckCircle size={14} /> Draft saved
                </span>
              )}
              <button
                type="button"
                onClick={handleSaveDraft}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-nile-border hover:bg-slate-50 text-xs font-bold text-nile-dark transition"
              >
                <Save size={14} />
                <span>Save draft</span>
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* STEP 1: Representative Details */}
            {currentStep === 0 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="First name"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    error={errors.firstName}
                  />
                  <Input
                    label="Last name"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    error={errors.lastName}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Representative Email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    error={errors.email}
                  />
                  <Input
                    label="Representative Contact number"
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    error={errors.phone}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Password"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    error={errors.password}
                  />
                  <Input
                    label="Confirm Password"
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    error={errors.confirmPassword}
                  />
                </div>
              </div>
            )}

            {/* STEP 2: Business Details */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Select
                    label="Company Type"
                    name="companyType"
                    value={formData.companyType}
                    onChange={handleChange}
                    options={['Partnership', 'LLC', 'PLC', 'Unlimited Company']}
                    required
                    error={errors.companyType}
                  />
                  <Input
                    label="Registration Number / CAC RC Number"
                    name="rcNumber"
                    value={formData.rcNumber}
                    onChange={handleChange}
                    placeholder="e.g. RC-887722"
                    required
                    error={errors.rcNumber}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Registered Business Name"
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleChange}
                    required
                    error={errors.businessName}
                  />
                  <Input
                    label="Trade Name (DBA)"
                    name="tradeName"
                    value={formData.tradeName}
                    onChange={handleChange}
                    placeholder="Trade or Brand name"
                    required
                    error={errors.tradeName}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Select
                    label="Industry Category"
                    name="industry"
                    value={formData.industry}
                    onChange={handleChange}
                    options={[
                      'E-commerce Retail',
                      'Betting / Lottery',
                      'Lending / Loans',
                      'Banking / Fintech / Payments / Remittance / Wallet',
                      'Crypto',
                      'Bureau de Change',
                      'Real Estate',
                      'Legal',
                      'Accounting / Audit',
                      'Consulting',
                      'Cosmetics & Beauty',
                      'Others'
                    ]}
                    required
                    error={errors.industry}
                  />
                  <Input
                    label="Tax Identification Number (TIN)"
                    name="taxId"
                    value={formData.taxId}
                    onChange={handleChange}
                    placeholder="TIN-XXXXXX"
                    required
                    error={errors.taxId}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Type of business"
                    name="businessType"
                    value={formData.businessType}
                    onChange={handleChange}
                    placeholder="e.g. Online retail marketplace"
                    required
                    error={errors.businessType}
                  />
                  <Input
                    label="Nature of business"
                    name="businessNature"
                    value={formData.businessNature}
                    onChange={handleChange}
                    placeholder="Describe your core operations"
                    required
                    error={errors.businessNature}
                  />
                </div>

                <Input
                  label="Purpose of business"
                  name="businessPurpose"
                  value={formData.businessPurpose}
                  onChange={handleChange}
                  placeholder="Explain what the business exists to provide and what customer payments represent"
                  required
                  error={errors.businessPurpose}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Business Contact Phone"
                    name="supportPhone"
                    value={formData.supportPhone}
                    onChange={handleChange}
                    required
                    error={errors.supportPhone}
                  />
                  <Input
                    label="Business Contact Email"
                    name="supportEmail"
                    value={formData.supportEmail}
                    onChange={handleChange}
                    required
                    error={errors.supportEmail}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Website URL"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    placeholder="yourbrand.nile.ng"
                    required
                    error={errors.website}
                  />
                  <Input
                    label="Social Media Profile URL"
                    name="socialUrl"
                    value={formData.socialUrl}
                    onChange={handleChange}
                    placeholder="e.g. https://instagram.com/brand"
                    required
                    error={errors.socialUrl}
                  />
                </div>
              </div>
            )}

            {/* STEP 3: Address Verification */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <Input
                  label="Registered Business Address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  error={errors.address}
                />

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Select
                    label="Country"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    options={['Nigeria', 'Ghana', 'Kenya', 'South Africa']}
                    required
                    error={errors.country}
                  />
                  <Input
                    label="State / Province"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    required
                    error={errors.state}
                  />
                  <Input
                    label="City"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    error={errors.city}
                  />
                </div>

                <Input
                  label="Operational Address (If different from Registered Address) - Optional"
                  name="operationalAddress"
                  value={formData.operationalAddress}
                  onChange={handleChange}
                />

                <FileUploadCard
                  label="Business Utility Bill (Address proof - max 5MB)"
                  required
                  value={formData.utilityFile}
                  onChange={(file, err) => handleFileChange('utilityFile', file, err)}
                  error={errors.utilityFile}
                />
              </div>
            )}

            {/* STEP 4: Incorporation Documents */}
            {currentStep === 3 && (
              <div className="space-y-4 text-left">
                <p className="text-xs text-nile-muted mb-4">Please upload corporate documents registered at CAC or your regional corporate affairs portal.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FileUploadCard
                    label="Certificate of Incorporation"
                    required
                    value={formData.cacCertFile}
                    onChange={(file, err) => handleFileChange('cacCertFile', file, err)}
                    error={errors.cacCertFile}
                  />
                  <FileUploadCard
                    label="MEMART (Memorandum & Articles of Association)"
                    required
                    value={formData.memartFile}
                    onChange={(file, err) => handleFileChange('memartFile', file, err)}
                    error={errors.memartFile}
                  />
                  <FileUploadCard
                    label="Status Report / CAC Form 1.1"
                    required
                    value={formData.statusReportFile}
                    onChange={(file, err) => handleFileChange('statusReportFile', file, err)}
                    error={errors.statusReportFile}
                  />
                  <FileUploadCard
                    label="Board Resolution authorizing payment opening"
                    required
                    value={formData.boardResolutionFile}
                    onChange={(file, err) => handleFileChange('boardResolutionFile', file, err)}
                    error={errors.boardResolutionFile}
                  />
                </div>
                <Select
                  label="Is an entity a shareholder in this business?"
                  name="hasEntityShareholder"
                  value={formData.hasEntityShareholder}
                  onChange={handleChange}
                  options={['No', 'Yes']}
                  required
                  note="UBO documents become mandatory when a company or other entity holds shares."
                  error={errors.hasEntityShareholder}
                />
                <FileUploadCard
                  label={`UBO documents${formData.hasEntityShareholder === 'Yes' ? '' : ' (optional)'}`}
                  required={formData.hasEntityShareholder === 'Yes'}
                  value={formData.uboDocsFile}
                  onChange={(file, err) => handleFileChange('uboDocsFile', file, err)}
                  error={errors.uboDocsFile}
                />
              </div>
            )}

            {/* STEP 5: AML / CFT Documents */}
            {currentStep === 4 && (
              <div className="space-y-4 text-left">
                <p className="text-xs text-nile-muted">Upload AML questionnaire and internal compliance policies to activate high-volume checkouts.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FileUploadCard
                    label="Completed AML/CFT Questionnaire"
                    required
                    value={formData.amlQuestionnaireFile}
                    onChange={(file, err) => handleFileChange('amlQuestionnaireFile', file, err)}
                    error={errors.amlQuestionnaireFile}
                  />
                  <FileUploadCard
                    label="Anti-Money Laundering (AML) Policy"
                    required
                    value={formData.amlPolicyFile}
                    onChange={(file, err) => handleFileChange('amlPolicyFile', file, err)}
                    error={errors.amlPolicyFile}
                  />
                </div>
                <FileUploadCard
                  label="Customer Due Diligence (KYC) Policy"
                  required
                  value={formData.kycPolicyFile}
                  onChange={(file, err) => handleFileChange('kycPolicyFile', file, err)}
                  error={errors.kycPolicyFile}
                />
              </div>
            )}

            {/* STEP 6: Industry-specific Documents (Conditional) */}
            {currentStep === 5 && (
              <div className="space-y-4 text-left">
                <div className="border border-nile-border p-4 bg-slate-50 rounded-xl mb-4 text-xs">
                  Selected Industry: <strong className="text-nile-darkgreen">{formData.industry || 'Not selected'}</strong>
                </div>

                {formData.industry === 'Betting / Lottery' && (
                  <FileUploadCard
                    label="Betting License"
                    required
                    value={formData.bettingLicenseFile}
                    onChange={(file, err) => handleFileChange('bettingLicenseFile', file, err)}
                    error={errors.bettingLicenseFile}
                  />
                )}

                {formData.industry === 'Lending / Loans' && (
                  <FileUploadCard
                    label="Money Lending License"
                    required
                    value={formData.lendingLicenseFile}
                    onChange={(file, err) => handleFileChange('lendingLicenseFile', file, err)}
                    error={errors.lendingLicenseFile}
                  />
                )}

                {formData.industry === 'Banking / Fintech / Payments / Remittance / Wallet' && (
                  <FileUploadCard
                    label="CBN License or regulatory application letter"
                    required
                    value={formData.cbnLicenseFile}
                    onChange={(file, err) => handleFileChange('cbnLicenseFile', file, err)}
                    error={errors.cbnLicenseFile}
                  />
                )}

                {['Crypto', 'Bureau de Change', 'Real Estate', 'Legal', 'Accounting / Audit', 'Consulting'].includes(formData.industry) && (
                  <FileUploadCard
                    label="SCUML Certificate (Special Control Unit Against Money Laundering)"
                    required
                    value={formData.scumlCertFile}
                    onChange={(file, err) => handleFileChange('scumlCertFile', file, err)}
                    error={errors.scumlCertFile}
                  />
                )}

                {!['Betting / Lottery', 'Lending / Loans', 'Banking / Fintech / Payments / Remittance / Wallet', 'Crypto', 'Bureau de Change', 'Real Estate', 'Legal', 'Accounting / Audit', 'Consulting'].includes(formData.industry) && (
                  <div className="p-8 border border-dashed rounded-2xl text-center space-y-2">
                    <p className="text-sm font-semibold text-nile-dark">No extra industry document is required</p>
                    <p className="text-xs text-nile-muted">Your selected industry ("{formData.industry}") does not require secondary licensing for Nile Pay activation.</p>
                  </div>
                )}
              </div>
            )}

            {/* STEP 7: Authorisers */}
            {currentStep === 6 && (
              <div className="space-y-6 text-left">
                <p className="text-xs text-nile-muted">Add corporate signees (Directors or major shareholders holding 25%+ control).</p>
                
                {/* Authoriser sub-form panel */}
                <div className="border border-nile-border p-5 rounded-2xl bg-slate-50 space-y-4">
                  <h4 className="text-sm font-bold text-nile-darkgreen">Add Authoriser Profile</h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Select
                      label="Type"
                      value={newAuth.type}
                      onChange={(e) => setNewAuth({ ...newAuth, type: e.target.value })}
                      options={['Director', 'Shareholder', 'Director & Shareholder', 'Other']}
                    />
                    <Input
                      label="Contact number"
                      type="tel"
                      value={newAuth.phone}
                      onChange={(e) => setNewAuth({ ...newAuth, phone: e.target.value })}
                      placeholder="e.g. +234 812..."
                    />
                  </div>

                  <Select
                    label="Country of nationality"
                    value={newAuth.nationality}
                    onChange={(e) => setNewAuth({ ...newAuth, nationality: e.target.value, bvn: '', residentPermitFile: null })}
                    options={['Nigeria', 'Ghana', 'Kenya', 'South Africa', 'Other']}
                    required
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="First name"
                      value={newAuth.firstName}
                      onChange={(e) => setNewAuth({ ...newAuth, firstName: e.target.value })}
                    />
                    <Input
                      label="Last name"
                      value={newAuth.lastName}
                      onChange={(e) => setNewAuth({ ...newAuth, lastName: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Select
                      label="Valid ID Type"
                      value={newAuth.idType}
                      onChange={(e) => setNewAuth({ ...newAuth, idType: e.target.value })}
                      options={['Driver’s License', 'National ID', 'Voter’s Card', 'International Passport']}
                    />
                    {newAuth.nationality === 'Nigeria' && (
                      <Input
                        label="BVN (11 digits)"
                        maxLength={11}
                        value={newAuth.bvn}
                        onChange={(e) => setNewAuth({ ...newAuth, bvn: e.target.value })}
                        placeholder="22244455566"
                      />
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FileUploadCard
                      label="Upload selected valid ID"
                      required
                      value={newAuth.idFile}
                      onChange={(file, err) => {
                        if (err) alert(err);
                        else setNewAuth({ ...newAuth, idFile: file });
                      }}
                    />
                    {newAuth.nationality !== 'Nigeria' && (
                      <FileUploadCard
                        label="Resident Permit (Non-Nigerian authorisers only)"
                        required
                        value={newAuth.residentPermitFile}
                        onChange={(file, err) => {
                          if (err) alert(err);
                          else setNewAuth({ ...newAuth, residentPermitFile: file });
                        }}
                      />
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={addAuthoriser}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-nile-darkgreen hover:bg-[#1f5643] text-white text-xs font-bold transition shadow-sm"
                  >
                    <Plus size={14} /> Add Authoriser to List
                  </button>
                </div>

                {/* Added list */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-nile-muted uppercase tracking-wider">Added Authorisers ({formData.authorisers.length})</h4>
                  {formData.authorisers.length === 0 ? (
                    <p className="text-xs text-nile-muted italic">No authorisers added yet. Add at least one director.</p>
                  ) : (
                    formData.authorisers.map((auth, idx) => (
                      <div key={idx} className="flex items-center justify-between border border-nile-border p-3.5 rounded-xl bg-white shadow-sm">
                        <div>
                          <p className="text-sm font-semibold text-nile-dark">{auth.firstName} {auth.lastName}</p>
                          <p className="text-xs text-nile-muted">{auth.type} • {auth.phone} {auth.bvn ? `• BVN: ${auth.bvn}` : ''}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeAuthoriser(idx)}
                          className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-slate-50 transition"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))
                  )}
                  {errors.authorisers && <p className="text-xs text-nile-error font-medium">{errors.authorisers}</p>}
                </div>
              </div>
            )}

            {/* STEP 8: Beneficial Owners / Directors Invitation */}
            {currentStep === 7 && (
              <div className="space-y-6 text-left">
                <div className="bg-nile-softmint/30 border border-nile-border p-4 rounded-xl text-xs text-nile-darkgreen">
                  <p className="font-semibold">Invite beneficial owners & key controllers.</p>
                  <p className="mt-1">Invited persons will receive an email checklist link to complete their individual KYC checks separately.</p>
                </div>

                {/* Invitation sub-form panel */}
                <div className="border border-nile-border p-5 rounded-2xl bg-slate-50 space-y-4">
                  <h4 className="text-sm font-bold text-nile-darkgreen">Invite Director / Controller</h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Full name"
                      value={newInv.name}
                      onChange={(e) => setNewInv({ ...newInv, name: e.target.value })}
                      placeholder="e.g. Sandra Obi"
                    />
                    <Input
                      label="Email address"
                      type="email"
                      value={newInv.email}
                      onChange={(e) => setNewInv({ ...newInv, email: e.target.value })}
                      placeholder="sandra@brand.com"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Select
                      label="Role"
                      value={newInv.role}
                      onChange={(e) => setNewInv({ ...newInv, role: e.target.value })}
                      options={['Beneficial Owner', 'Director', 'Controller']}
                    />
                    <Select
                      label="Is this person the Ultimate Beneficial Owner (UBO)?"
                      value={newInv.isUbo}
                      onChange={(e) => setNewInv({ ...newInv, isUbo: e.target.value })}
                      options={['Yes', 'No']}
                    />
                  </div>

                  <button
                    type="button"
                    onClick={sendInvite}
                    className="flex items-center gap-1.5 px-4 py-2.5 bg-nile-darkgreen hover:bg-[#1f5643] text-white text-xs font-bold rounded-xl transition shadow-sm"
                  >
                    <Mail size={14} /> Send verification invite
                  </button>
                </div>

                {/* Invited list */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-nile-muted uppercase tracking-wider">Sent Invites ({formData.invitees.length})</h4>
                  {formData.invitees.length === 0 ? (
                    <p className="text-xs text-nile-muted italic">No verification invites sent yet.</p>
                  ) : (
                    formData.invitees.map((inv, idx) => (
                      <div key={idx} className="flex items-center justify-between border border-nile-border p-3.5 rounded-xl bg-white shadow-sm">
                        <div>
                          <p className="text-sm font-semibold text-nile-dark">{inv.name}</p>
                          <p className="text-xs text-nile-muted">{inv.role} • {inv.email} • UBO: {inv.isUbo}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeInvitee(idx)}
                          className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-slate-50 transition"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* STEP 9: Review and Submit */}
            {currentStep === 8 && (
              <div className="space-y-6 text-left">
                <div className="bg-nile-softmint/30 border border-nile-border p-4 rounded-xl text-xs text-nile-darkgreen">
                  <p className="font-semibold">Review your business compliance files before submission.</p>
                  <p className="mt-1">Confirm that all uploaded CAC forms, MEMARTs, and AML policies match your registered registry profile.</p>
                </div>

                <div className="space-y-4">
                  {/* Representative Details */}
                  <div className="border border-nile-border rounded-xl p-4 space-y-2">
                    <h4 className="text-xs font-bold text-nile-darkgreen uppercase border-b pb-1">Representative Profile</h4>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>Name: <strong>{formData.firstName} {formData.lastName}</strong></div>
                      <div>Contact: <strong>{formData.email} ({formData.phone})</strong></div>
                    </div>
                  </div>

                  {/* Business Details */}
                  <div className="border border-nile-border rounded-xl p-4 space-y-2">
                    <h4 className="text-xs font-bold text-nile-darkgreen uppercase border-b pb-1">Corporate Details</h4>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>Name: <strong>{formData.businessName} ({formData.tradeName})</strong></div>
                      <div>Type: <strong>{formData.companyType} • RC: {formData.rcNumber}</strong></div>
                      <div>TIN: <strong>{formData.taxId}</strong></div>
                      <div>Website: <strong className="underline text-nile-darkgreen">{formData.website}</strong></div>
                      <div>Industry: <strong>{formData.industry}</strong></div>
                      <div>Socials: <strong>{formData.socialUrl}</strong></div>
                      <div>Business type: <strong>{formData.businessType}</strong></div>
                      <div>Nature: <strong>{formData.businessNature}</strong></div>
                      <div className="col-span-2">Purpose: <strong>{formData.businessPurpose}</strong></div>
                    </div>
                  </div>

                  {/* Address & Utility bill */}
                  <div className="border border-nile-border rounded-xl p-4 space-y-2">
                    <h4 className="text-xs font-bold text-nile-darkgreen uppercase border-b pb-1">Registered Address</h4>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="col-span-2">Address: <strong>{formData.address}, {formData.city}, {formData.state}, {formData.country}</strong></div>
                      <div>Utility Bill: <strong>{formData.utilityFile?.name}</strong></div>
                    </div>
                  </div>

                  {/* Corporate Uploads */}
                  <div className="border border-nile-border rounded-xl p-4 space-y-2">
                    <h4 className="text-xs font-bold text-nile-darkgreen uppercase border-b pb-1">Corporate Registry Uploads</h4>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>Certificate: <strong>{formData.cacCertFile?.name}</strong></div>
                      <div>MEMART: <strong>{formData.memartFile?.name}</strong></div>
                      <div>Status Report: <strong>{formData.statusReportFile?.name}</strong></div>
                      <div>Board Resolution: <strong>{formData.boardResolutionFile?.name}</strong></div>
                    </div>
                  </div>

                  {/* AML Uploads */}
                  <div className="border border-nile-border rounded-xl p-4 space-y-2">
                    <h4 className="text-xs font-bold text-nile-darkgreen uppercase border-b pb-1">AML / CFT Files</h4>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>Questionnaire: <strong>{formData.amlQuestionnaireFile?.name}</strong></div>
                      <div>AML Policy: <strong>{formData.amlPolicyFile?.name}</strong></div>
                      <div>KYC Policy: <strong>{formData.kycPolicyFile?.name}</strong></div>
                    </div>
                  </div>

                  {/* Authorisers List review */}
                  <div className="border border-nile-border rounded-xl p-4 space-y-2">
                    <h4 className="text-xs font-bold text-nile-darkgreen uppercase border-b pb-1">Directors & Authorisers ({formData.authorisers.length})</h4>
                    <div className="space-y-1 text-xs">
                      {formData.authorisers.map((a, i) => (
                        <div key={i}>• {a.firstName} {a.lastName} ({a.type})</div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation buttons */}
            <div className="flex items-center justify-between pt-6 border-t border-nile-border">
              {currentStep > 0 ? (
                <button
                  type="button"
                  onClick={handleBack}
                  className="flex items-center gap-1 px-4 py-2.5 rounded-xl border border-nile-border hover:bg-slate-50 text-sm font-semibold text-nile-dark transition"
                >
                  <ArrowLeft size={16} />
                  <span>Back</span>
                </button>
              ) : (
                <div></div>
              )}

              {currentStep < STEPS.length - 1 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex items-center gap-1 px-6 py-2.5 rounded-xl bg-nile-darkgreen hover:bg-[#1f5643] text-white text-sm font-semibold transition shadow-sm"
                >
                  <span>Next step</span>
                  <ArrowRight size={16} />
                </button>
              ) : (
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-8 py-3 rounded-xl bg-nile-darkgreen hover:bg-[#1f5643] text-white text-sm font-bold transition shadow-md glow-btn"
                >
                  <span>Submit to compliance</span>
                </button>
              )}
            </div>

          </form>

        </div>

      </div>
    </div>
  );
}
