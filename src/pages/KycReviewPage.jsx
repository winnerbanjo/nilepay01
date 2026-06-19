import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useNilePay } from '../context/NilePayContext';
import { KYCSectionCard, DetailRow } from '../components/FormComponents';
import { ShieldCheck, ArrowRight, AlertCircle, ArrowLeft } from 'lucide-react';

export default function KycReviewPage() {
  const { activeApp, submitToCompliance } = useNilePay();
  const navigate = useNavigate();

  if (!activeApp || !activeApp.kycData) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 bg-white border rounded-2xl text-center space-y-4">
        <AlertCircle size={40} className="text-amber-500 mx-auto" />
        <h3 className="text-lg font-bold text-nile-dark">No application draft found</h3>
        <p className="text-xs text-nile-muted">Please select an account type first to start your KYC onboarding.</p>
        <Link to="/account-type" className="inline-block py-2 px-4 bg-nile-darkgreen text-white rounded-xl text-xs font-bold">
          Start onboarding
        </Link>
      </div>
    );
  }

  const { kycData, accountType } = activeApp;
  const isCorporate = accountType === 'corporate';

  const handleSubmit = () => {
    submitToCompliance(activeApp.id, kycData);
    navigate('/kyc/submitted');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
      
      {/* Title */}
      <div className="space-y-2 text-left">
        <Link to={isCorporate ? "/kyc/corporate" : "/kyc/individual"} className="inline-flex items-center gap-1 text-xs font-bold text-nile-darkgreen hover:underline">
          <ArrowLeft size={14} /> Back to edit form
        </Link>
        <h2 className="text-2xl sm:text-3xl font-black text-nile-darkgreen tracking-tight mt-2">
          Review Nile Pay Application
        </h2>
        <p className="text-sm text-nile-muted">
          Please confirm that all business details and uploaded compliance files are accurate before final submission.
        </p>
      </div>

      {/* Info notification */}
      <div className="bg-nile-softmint/40 border border-nile-border p-4 rounded-2xl flex items-start gap-3 text-xs text-nile-darkgreen text-left">
        <ShieldCheck size={18} className="shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold">Nile Compliance Regulatory Review</p>
          <p className="text-[11px] text-nile-muted mt-0.5">
            Your registration will be checked against official business registries (CAC/TIN databases). Errors or mismatches may cause verification delays or rejection.
          </p>
        </div>
      </div>

      {/* Review details */}
      <div className="space-y-6 text-left">
        
        {/* Section 1: Contact / Representative details */}
        <KYCSectionCard title={isCorporate ? "Representative Details" : "Personal Details"} editAction={() => navigate(isCorporate ? '/kyc/corporate' : '/kyc/individual')}>
          <DetailRow label="First Name" value={kycData.firstName} />
          <DetailRow label="Last Name" value={kycData.lastName} />
          <DetailRow label="Email Address" value={kycData.email} />
          <DetailRow label="Phone Number" value={kycData.phone} />
          <DetailRow label="Date of Birth" value={kycData.dob} />
          {kycData.bvn && <DetailRow label="BVN (Nigerian Users)" value={kycData.bvn} />}
        </KYCSectionCard>

        {/* Section 2: Business details */}
        <KYCSectionCard title="Business details" editAction={() => navigate(isCorporate ? '/kyc/corporate' : '/kyc/individual')}>
          <DetailRow label="Business Name" value={kycData.businessName} />
          {isCorporate && <DetailRow label="Trade Name" value={kycData.tradeName} />}
          <DetailRow label="Company Type" value={kycData.companyType} />
          <DetailRow label="Industry" value={kycData.industry} />
          {kycData.rcNumber && <DetailRow label="CAC Registration Number" value={kycData.rcNumber} />}
          {kycData.taxId && <DetailRow label="Tax Identification Number" value={kycData.taxId} />}
          <DetailRow label="Website Link" value={kycData.website} />
          {isCorporate && <DetailRow label="Social URL" value={kycData.socialUrl} />}
          <div className="col-span-1 md:col-span-2">
            <DetailRow label="Business Description" value={kycData.businessDesc} />
          </div>
        </KYCSectionCard>

        {/* Section 3: Address verification */}
        <KYCSectionCard title="Address verification" editAction={() => navigate(isCorporate ? '/kyc/corporate' : '/kyc/individual')}>
          <div className="col-span-1 md:col-span-2">
            <DetailRow label="Registered Business Address" value={kycData.address} />
          </div>
          <DetailRow label="City" value={kycData.city} />
          <DetailRow label="State / Province" value={kycData.state} />
          <DetailRow label="Country" value={kycData.country} />
          <DetailRow label="Utility Bill Document" value={kycData.utilityFile} isFile />
        </KYCSectionCard>

        {/* Section 4: ID Documents */}
        {!isCorporate && (
          <KYCSectionCard title="Identity Documents" editAction={() => navigate('/kyc/individual')}>
            <DetailRow label="Government ID Type" value={kycData.idType} />
            <DetailRow label="Government ID Document" value={kycData.idFile} isFile />
          </KYCSectionCard>
        )}

        {/* Section 5: Incorporation & AML (Corporate only) */}
        {isCorporate && (
          <>
            <KYCSectionCard title="Incorporation Documents" editAction={() => navigate('/kyc/corporate')}>
              <DetailRow label="Certificate of Incorporation" value={kycData.cacCertFile} isFile />
              <DetailRow label="MEMART Document" value={kycData.memartFile} isFile />
              <DetailRow label="Status Report / Form 1.1" value={kycData.statusReportFile} isFile />
              <DetailRow label="Board Resolution" value={kycData.boardResolutionFile} isFile />
            </KYCSectionCard>

            <KYCSectionCard title="AML / CFT compliance" editAction={() => navigate('/kyc/corporate')}>
              <DetailRow label="AML Questionnaire" value={kycData.amlQuestionnaireFile} isFile />
              <DetailRow label="AML Policy" value={kycData.amlPolicyFile} isFile />
              <DetailRow label="KYC Policy" value={kycData.kycPolicyFile} isFile />
            </KYCSectionCard>
          </>
        )}

        {/* Section 6: Payout / Bank Account (Individual only) */}
        {!isCorporate && (
          <KYCSectionCard title="Payout / Bank Account" editAction={() => navigate('/kyc/individual')}>
            <DetailRow label="Payout Method" value={kycData.payoutMethod} />
            <DetailRow label="Bank / Mobile Money Provider" value={kycData.bankName} />
            <DetailRow label="Account / Mobile Money Number" value={kycData.accountNumber} />
            <DetailRow label="Resolved Account Name" value={kycData.accountName} />
          </KYCSectionCard>
        )}

      </div>

      {/* Submit Button */}
      <div className="flex items-center justify-end border-t border-nile-border pt-6">
        <button
          onClick={handleSubmit}
          className="flex items-center gap-2 bg-nile-darkgreen hover:bg-[#1f5643] text-white text-base font-bold px-10 py-4 rounded-xl shadow-md transition glow-btn"
        >
          <span>Submit application to compliance</span>
          <ArrowRight size={18} />
        </button>
      </div>

    </div>
  );
}
