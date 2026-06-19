import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNilePay } from '../context/NilePayContext';
import { Input, Select, FileUploadCard, ProgressStepper } from '../components/FormComponents';
import { ArrowLeft, ArrowRight, Save, CheckCircle } from 'lucide-react';

const STEPS = [
  'Personal details',
  'Identity verification',
  'Business information',
  'Address verification',
  'Payout account',
  'Review and submit'
];

export default function IndividualKycForm() {
  const { activeApp, saveDraft, submitToCompliance } = useNilePay();
  const navigate = useNavigate();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Load existing KYC data if available
  useEffect(() => {
    if (activeApp && activeApp.kycData) {
      setFormData(activeApp.kycData);
    }
  }, [activeApp]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error
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
    saveDraft(activeApp.id, formData, `${currentStep + 1} of 6 sections completed`);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const validateStep = (step) => {
    const tempErrors = {};
    const emailRegex = /\S+@\S+\.\S+/;

    if (step === 0) {
      if (!formData.firstName?.trim()) tempErrors.firstName = 'First name is required.';
      if (!formData.lastName?.trim()) tempErrors.lastName = 'Last name is required.';
      if (!formData.email) {
        tempErrors.email = 'Email address is required.';
      } else if (!emailRegex.test(formData.email)) {
        tempErrors.email = 'Please enter a valid email.';
      }
      if (!formData.phone?.trim()) tempErrors.phone = 'Phone number is required.';
      if (!formData.country) tempErrors.country = 'Country is required.';
      
      if (formData.country === 'Nigeria') {
        if (!formData.bvn) {
          tempErrors.bvn = 'BVN is required for Nigerian merchants.';
        } else if (formData.bvn.length !== 11 || isNaN(formData.bvn)) {
          tempErrors.bvn = 'BVN must be exactly 11 digits.';
        }
      }
    }

    if (step === 1) {
      if (!formData.idType) tempErrors.idType = 'ID Type is required.';
      if (!formData.idFile) tempErrors.idFile = 'Please upload a valid Government ID.';
    }

    if (step === 2) {
      if (!formData.companyType) tempErrors.companyType = 'Company type is required.';
      if (!formData.rcNumber?.trim()) tempErrors.rcNumber = formData.country === 'Nigeria' ? 'RC number is required.' : 'Business registration number is required.';
      if (!formData.businessName?.trim()) tempErrors.businessName = 'Business name is required.';
      if (!formData.industry) tempErrors.industry = 'Industry is required.';
      if (!formData.businessDesc?.trim()) tempErrors.businessDesc = 'Business description is required.';
      if (!formData.supportPhone?.trim()) tempErrors.supportPhone = 'Support phone is required.';
      if (!formData.supportEmail) {
        tempErrors.supportEmail = 'Support email is required.';
      } else if (!emailRegex.test(formData.supportEmail)) {
        tempErrors.supportEmail = 'Please enter a valid support email.';
      }
      if (!formData.website) {
        tempErrors.website = 'Website is required.';
      } else if (!formData.website.includes('.nile.ng') && !formData.website.includes('http')) {
        tempErrors.website = 'Website URL must be valid (e.g. yourbrand.nile.ng).';
      }
    }

    if (step === 3) {
      if (!formData.address?.trim()) tempErrors.address = 'Business address is required.';
      if (!formData.state?.trim()) tempErrors.state = 'State / Region is required.';
      if (!formData.city?.trim()) tempErrors.city = 'City is required.';
      if (!formData.utilityFile) tempErrors.utilityFile = 'Please upload a utility bill for address verification.';
    }

    if (step === 4) {
      if (!formData.payoutMethod) tempErrors.payoutMethod = 'Payout method is required.';
      if (!formData.bankName) tempErrors.bankName = 'Provider / Bank name is required.';
      if (!formData.accountNumber) {
        tempErrors.accountNumber = 'Account number is required.';
      } else if (isNaN(formData.accountNumber)) {
        tempErrors.accountNumber = 'Account number must be numeric.';
      }
      if (!formData.accountName?.trim()) tempErrors.accountName = 'Account holder name is required.';
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, STEPS.length - 1));
      // Save draft automatically on step transition
      saveDraft(activeApp.id, formData, `${Math.min(currentStep + 2, 6)} of 6 completed`);
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateStep(0) || !validateStep(1) || !validateStep(2) || !validateStep(3) || !validateStep(4)) {
      alert('Some required fields are missing. Please review previous steps.');
      return;
    }
    
    // Submit KYC to context
    submitToCompliance(activeApp.id, formData);
    navigate('/kyc/submitted');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Sidebar Stepper */}
        <ProgressStepper steps={STEPS} currentStep={currentStep} />

        {/* Form Content */}
        <div className="flex-1 bg-white rounded-3xl border border-nile-border p-6 sm:p-10 shadow-sm space-y-8">
          
          {/* Header */}
          <div className="flex justify-between items-center border-b border-nile-border pb-4">
            <div>
              <span className="text-xs font-bold text-nile-muted uppercase tracking-wider">
                Individual / SME Onboarding
              </span>
              <h2 className="text-xl font-bold text-nile-darkgreen mt-1">{STEPS[currentStep]}</h2>
            </div>
            
            {/* Draft Save Actions */}
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
            
            {/* STEP 1: Personal Details */}
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
                    label="Email address"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    error={errors.email}
                  />
                  <Input
                    label="Phone number"
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    error={errors.phone}
                  />
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <Select
                    label="Country"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    options={['Nigeria', 'Ghana', 'Kenya', 'South Africa']}
                    required
                    error={errors.country}
                  />
                </div>

                {formData.country === 'Nigeria' && (
                  <Input
                    label="Bank Verification Number (BVN)"
                    name="bvn"
                    maxLength={11}
                    value={formData.bvn}
                    onChange={handleChange}
                    placeholder="22244455566"
                    required
                    error={errors.bvn}
                    note="For Nigerian users only. Your BVN will be checked manually by the compliance team after submission."
                  />
                )}
              </div>
            )}

            {/* STEP 2: Identity Verification */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <Select
                  label="Valid ID Type"
                  name="idType"
                  value={formData.idType}
                  onChange={handleChange}
                  options={['National ID', 'International Passport', 'Driver’s License', 'Voter’s Card']}
                  required
                  error={errors.idType}
                />
                
                <FileUploadCard
                  label="Upload Government ID"
                  required
                  value={formData.idFile}
                  onChange={(file, err) => handleFileChange('idFile', file, err)}
                  error={errors.idFile}
                />
              </div>
            )}

            {/* STEP 3: Business Information */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Select
                    label="Type of company"
                    name="companyType"
                    value={formData.companyType}
                    onChange={handleChange}
                    options={['Individual Merchant', 'Sole Proprietorship', 'Partnership (Informal)', 'SME Retail']}
                    required
                    error={errors.companyType}
                  />
                  <Input
                    label="Business name"
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleChange}
                    required
                    error={errors.businessName}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Select
                    label="Industry"
                    name="industry"
                    value={formData.industry}
                    onChange={handleChange}
                    options={['Fashion & Apparel', 'Cosmetics & Beauty', 'Food & Beverages', 'Digital Services', 'Electronics', 'Others']}
                    required
                    error={errors.industry}
                  />
                  <Input
                    label={formData.country === 'Nigeria' ? 'Business registration number (RC number)' : 'Business registration number'}
                    name="rcNumber"
                    value={formData.rcNumber}
                    onChange={handleChange}
                    placeholder="e.g. RC-123456"
                    required
                    error={errors.rcNumber}
                  />
                </div>

                <Input
                  label="Business description"
                  name="businessDesc"
                  value={formData.businessDesc}
                  onChange={handleChange}
                  placeholder="Describe what products you sell on your website..."
                  required
                  error={errors.businessDesc}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Customer support phone"
                    name="supportPhone"
                    value={formData.supportPhone}
                    onChange={handleChange}
                    required
                    error={errors.supportPhone}
                  />
                  <Input
                    label="Customer support email"
                    name="supportEmail"
                    value={formData.supportEmail}
                    onChange={handleChange}
                    required
                    error={errors.supportEmail}
                  />
                </div>

                <Input
                  label="Website URL"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  placeholder="brandname.nile.ng"
                  required
                  error={errors.website}
                  note="Enter the Nile website URL where you want to activate payments."
                />
              </div>
            )}

            {/* STEP 4: Address Verification */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <Input
                  label="Business Address"
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
                    label="State / Region"
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

                <FileUploadCard
                  label="Upload Utility Bill (Address proof)"
                  required
                  value={formData.utilityFile}
                  onChange={(file, err) => handleFileChange('utilityFile', file, err)}
                  error={errors.utilityFile}
                />
              </div>
            )}

            {/* STEP 5: Payout Account */}
            {currentStep === 4 && (
              <div className="space-y-4">
                <Select
                  label="Payout Method"
                  name="payoutMethod"
                  value={formData.payoutMethod}
                  onChange={handleChange}
                  options={['Bank Account', 'Mobile Money']}
                  required
                  error={errors.payoutMethod}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label={formData.payoutMethod === 'Mobile Money' ? 'Mobile Money Provider' : 'Bank Name'}
                    name="bankName"
                    value={formData.bankName}
                    onChange={handleChange}
                    placeholder={formData.payoutMethod === 'Mobile Money' ? 'e.g. MTN MoMo' : 'e.g. GTBank'}
                    required
                    error={errors.bankName}
                  />
                  <Input
                    label={formData.payoutMethod === 'Mobile Money' ? 'Mobile Money Number' : 'Account Number'}
                    name="accountNumber"
                    value={formData.accountNumber}
                    onChange={handleChange}
                    required
                    error={errors.accountNumber}
                  />
                </div>

                <Input
                  label="Account Holder Name"
                  name="accountName"
                  value={formData.accountName}
                  onChange={handleChange}
                  placeholder="e.g. JOHN DOE ENTERPRISE"
                  required
                  error={errors.accountName}
                  note="Must match the registered merchant profile name."
                />
              </div>
            )}

            {/* STEP 6: Review Summary */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <div className="bg-nile-softmint/30 border border-nile-border p-4 rounded-xl text-xs text-nile-darkgreen">
                  <p className="font-semibold">Review your information carefully before submitting.</p>
                  <p className="mt-1">Once submitted to Nile compliance, your application is locked and cannot be edited unless requested by a reviewer.</p>
                </div>

                <div className="space-y-4 text-left">
                  {/* Personal details review */}
                  <div className="border border-nile-border rounded-xl p-4 space-y-2">
                    <h4 className="text-xs font-bold text-nile-darkgreen uppercase border-b pb-1">Personal Details</h4>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>Name: <strong>{formData.firstName} {formData.lastName}</strong></div>
                      <div>Email: <strong>{formData.email}</strong></div>
                      <div>Phone: <strong>{formData.phone}</strong></div>
                      <div>Country: <strong>{formData.country}</strong></div>
                      {formData.bvn && <div>BVN: <strong>{formData.bvn}</strong></div>}
                    </div>
                  </div>

                  {/* ID verification review */}
                  <div className="border border-nile-border rounded-xl p-4 space-y-2">
                    <h4 className="text-xs font-bold text-nile-darkgreen uppercase border-b pb-1">Identity verification</h4>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>ID Type: <strong>{formData.idType}</strong></div>
                      <div>Document: <strong>{formData.idFile?.name}</strong></div>
                    </div>
                  </div>

                  {/* Business info review */}
                  <div className="border border-nile-border rounded-xl p-4 space-y-2">
                    <h4 className="text-xs font-bold text-nile-darkgreen uppercase border-b pb-1">Business information</h4>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>Business: <strong>{formData.businessName}</strong></div>
                      <div>Company Type: <strong>{formData.companyType}</strong></div>
                      <div>Industry: <strong>{formData.industry}</strong></div>
                      <div>Website: <strong className="underline text-nile-darkgreen">{formData.website}</strong></div>
                      <div className="col-span-2">Support: <strong>{formData.supportPhone} / {formData.supportEmail}</strong></div>
                    </div>
                  </div>

                  {/* Address review */}
                  <div className="border border-nile-border rounded-xl p-4 space-y-2">
                    <h4 className="text-xs font-bold text-nile-darkgreen uppercase border-b pb-1">Address verification</h4>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="col-span-2">Address: <strong>{formData.address}, {formData.city}, {formData.state}</strong></div>
                      <div>Utility Bill: <strong>{formData.utilityFile?.name}</strong></div>
                    </div>
                  </div>

                  {/* Payout review */}
                  <div className="border border-nile-border rounded-xl p-4 space-y-2">
                    <h4 className="text-xs font-bold text-nile-darkgreen uppercase border-b pb-1">Payout / Bank Account</h4>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>Method: <strong>{formData.payoutMethod}</strong></div>
                      <div>Provider: <strong>{formData.bankName}</strong></div>
                      <div>Account: <strong>{formData.accountNumber}</strong></div>
                      <div>Name: <strong>{formData.accountName}</strong></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Stepper Navigation Buttons */}
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
