import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useNilePay } from '../context/NilePayContext';
import { DetailRow } from '../components/FormComponents';
import { RequestInfoModal, ApprovalModal, RejectionModal } from '../components/Modals';
import { ArrowLeft, Check, X, ShieldAlert, MessageSquare, AlertCircle, Sparkles } from 'lucide-react';

export default function ComplianceReviewPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { 
    applications, 
    verifyDocument, 
    requestMoreInformation, 
    updateApplicationStatus 
  } = useNilePay();

  const app = applications.find(a => a.id === id);

  // Modal open states
  const [requestModalOpen, setRequestModalOpen] = useState(false);
  const [approveModalOpen, setApproveModalOpen] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);

  // Document rejection reason helper
  const [rejectionReasons, setRejectionReasons] = useState({});

  if (!app) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 bg-white border border-nile-border rounded-2xl text-center space-y-4">
        <AlertCircle size={40} className="text-red-600 mx-auto" />
        <h3 className="text-lg font-bold text-nile-dark">Application not found</h3>
        <p className="text-xs text-nile-muted">The requested application ID does not exist in the queue.</p>
        <Link to="/admin/compliance" className="inline-block py-2 px-4 bg-nile-darkgreen text-white rounded-xl text-xs font-bold">
          Back to Queue
        </Link>
      </div>
    );
  }

  const { status, accountType, kycData, documentVerification, timeline, assignedReviewer } = app;
  const isCorporate = accountType === 'corporate';

  // Handle Document Audit Approve
  const handleDocApprove = (docKey) => {
    verifyDocument(app.id, docKey, 'approved');
  };

  // Handle Document Audit Reject
  const handleDocReject = (docKey) => {
    const reason = rejectionReasons[docKey] || '';
    if (!reason.trim()) {
      alert('Please enter a rejection reason before flagging the document.');
      return;
    }
    verifyDocument(app.id, docKey, 'rejected', reason);
    // Clear temp input
    setRejectionReasons({ ...rejectionReasons, [docKey]: '' });
  };

  // Handle Compliance Actions
  const handleMarkUnderReview = () => {
    updateApplicationStatus(app.id, 'Under Review', 'Auditor started intensive review of registry credentials.');
  };

  const handleRequestInfoSubmit = (section, msg) => {
    requestMoreInformation(app.id, msg, section);
  };

  const handleApproveConfirm = () => {
    updateApplicationStatus(app.id, 'Approved', 'Compliance review cleared. Ready for merchant account creation.');
  };

  const handleRejectConfirm = (reason, internalNote) => {
    updateApplicationStatus(app.id, 'Rejected', `Compliance check failed: ${reason}. Internal audit: ${internalNote}`);
  };

  const handleMarkAccountCreated = () => {
    updateApplicationStatus(app.id, 'Account Created', 'Merchant account successfully created after approval.');
  };

  const handleMarkPaymentActivated = () => {
    updateApplicationStatus(app.id, 'Payment Activated', 'Sub-merchant credentials mapped. Website payments activated.');
  };

  // Helper list of doc keys for the Request Info dropdown
  const getDocumentFields = () => {
    const fields = [
      { value: 'phoneNumber', label: 'Phone number verification' },
      { value: 'utilityBill', label: 'Utility Bill (Address verification)' }
    ];
    if (kycData.country === 'Nigeria' && kycData.bvn) {
      fields.push({ value: 'bvn', label: 'BVN verification' });
    }
    if (isCorporate) {
      fields.push(
        { value: 'cacCertFile', label: 'Certificate of Incorporation' },
        { value: 'memartFile', label: 'MEMART document' },
        { value: 'amlQuestionnaire', label: 'AML/CFT Questionnaire' }
      );
    } else {
      fields.push(
        { value: 'governmentId', label: 'Government ID' }
      );
    }
    return fields;
  };

  // Render file audit card
  const renderDocumentAuditCard = (label, docKey, fileObj) => {
    if (!fileObj) return null;
    const docState = documentVerification?.[docKey] || { status: 'pending' };
    const tempReason = rejectionReasons[docKey] || '';

    return (
      <div className="border border-nile-border rounded-xl p-4 bg-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1 text-left">
          <p className="text-xs font-bold text-nile-dark">{label}</p>
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-nile-darkgreen bg-nile-softmint px-2 py-0.5 rounded-lg border border-nile-softmint">
              {fileObj.name}
            </span>
            <span className="text-[10px] text-nile-muted">{fileObj.size || 'Size check ok'}</span>
          </div>
          {docState.status === 'rejected' && (
            <p className="text-xs text-red-600 font-semibold bg-red-50 p-2 rounded-lg mt-1 border border-red-100">
              Flagged: {docState.rejectionReason}
            </p>
          )}
        </div>

        {/* Audit Actions */}
        <div className="flex flex-wrap items-center gap-2">
          {docState.status === 'approved' ? (
            <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-green-100 text-green-800">
              <Check size={14} /> Document Approved
            </span>
          ) : docState.status === 'rejected' ? (
            <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-red-100 text-red-800">
              <X size={14} /> Document Flagged
            </span>
          ) : (
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              {/* Approve */}
              <button
                type="button"
                onClick={() => handleDocApprove(docKey)}
                className="bg-nile-darkgreen hover:bg-[#1f5643] text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition"
              >
                <Check size={12} /> Approve file
              </button>

              {/* Rejection input and trigger */}
              <div className="flex items-center border border-nile-border rounded-lg overflow-hidden bg-slate-50">
                <input
                  type="text"
                  placeholder="Enter rejection reason..."
                  value={tempReason}
                  onChange={(e) => setRejectionReasons({ ...rejectionReasons, [docKey]: e.target.value })}
                  className="bg-transparent border-0 px-2.5 py-1 text-xs focus:outline-none w-44"
                />
                <button
                  type="button"
                  onClick={() => handleDocReject(docKey)}
                  className="bg-red-600 hover:bg-red-700 text-white px-2.5 py-1.5 text-xs font-bold transition flex items-center justify-center gap-1"
                >
                  <X size={12} /> Flag
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderManualCheckCard = (label, docKey, value) => {
    if (!value) return null;
    const checkState = documentVerification?.[docKey] || { status: 'pending' };
    const tempReason = rejectionReasons[docKey] || '';

    return (
      <div className="border border-nile-border rounded-xl p-4 bg-slate-50 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <p className="text-xs font-bold text-nile-dark">{label}</p>
            <p className="text-sm font-semibold text-nile-darkgreen mt-0.5">{value}</p>
          </div>
          {checkState.status === 'approved' ? (
            <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-green-100 text-green-800"><Check size={14} /> Manually verified</span>
          ) : checkState.status === 'rejected' ? (
            <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-red-100 text-red-800"><X size={14} /> Verification failed</span>
          ) : (
            <button type="button" onClick={() => handleDocApprove(docKey)} className="bg-nile-darkgreen hover:bg-[#1f5643] text-white px-3 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition">
              <Check size={12} /> Mark verified
            </button>
          )}
        </div>
        {checkState.status !== 'approved' && (
          <div className="flex items-center border border-nile-border rounded-lg overflow-hidden bg-white">
            <input
              type="text"
              placeholder="Reason verification failed..."
              value={tempReason}
              onChange={(e) => setRejectionReasons({ ...rejectionReasons, [docKey]: e.target.value })}
              className="bg-transparent border-0 px-3 py-2 text-xs focus:outline-none flex-1"
            />
            <button type="button" onClick={() => handleDocReject(docKey)} className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 text-xs font-bold transition">Flag</button>
          </div>
        )}
        {checkState.rejectionReason && <p className="text-xs text-red-600 font-semibold">Reason: {checkState.rejectionReason}</p>}
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 text-left">
      
      {/* Back button & Header */}
      <div className="space-y-4">
        <Link to="/admin/compliance" className="inline-flex items-center gap-1 text-xs font-bold text-nile-darkgreen hover:underline">
          <ArrowLeft size={14} /> Back to compliance queue
        </Link>

        {/* Application Header Visual */}
        <div className="bg-white border border-nile-border rounded-3xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <h2 className="text-xl sm:text-2xl font-black text-nile-dark">{kycData.businessName}</h2>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                status === 'Payment Activated' ? 'bg-green-50 text-green-700 border-green-200' :
                status === 'Approved' || status === 'Account Created' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                status === 'Submitted' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                status === 'Under Review' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                status === 'More Info Required' ? 'bg-amber-50 text-amber-900 border-amber-200' :
                'bg-slate-50 text-slate-600 border-slate-200'
              }`}>
                {status}
              </span>
            </div>
            <p className="text-xs text-nile-muted">
              Merchant: <strong className="text-nile-dark">{kycData.firstName} {kycData.lastName}</strong> • 
              Website: <strong className="text-nile-darkgreen underline">{kycData.website}</strong> • 
              Auditor: <strong className="text-nile-dark">{assignedReviewer || 'Unassigned'}</strong>
            </p>
          </div>

          {/* Quick status actions header */}
          <div className="flex flex-wrap gap-2">
            {status === 'Submitted' && (
              <button
                onClick={handleMarkUnderReview}
                className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-lg transition"
              >
                Mark Under Review
              </button>
            )}
            <button
              onClick={() => setRequestModalOpen(true)}
              className="px-4 py-2 border border-nile-border hover:bg-slate-50 text-nile-dark text-xs font-bold rounded-lg transition flex items-center gap-1"
            >
              <MessageSquare size={13} /> Request More Info
            </button>
            {status !== 'Approved' && status !== 'Account Created' && status !== 'Payment Activated' && (
              <>
                <button
                  onClick={() => setRejectModalOpen(true)}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg transition"
                >
                  Reject Application
                </button>
                <button
                  onClick={() => setApproveModalOpen(true)}
                  className="px-4 py-2 bg-nile-darkgreen hover:bg-[#1f5643] text-white text-xs font-bold rounded-lg transition shadow-sm"
                >
                  Approve KYC
                </button>
              </>
            )}
            
            {status === 'Approved' && (
              <button
                onClick={handleMarkAccountCreated}
                className="px-4 py-2 bg-nile-darkgreen hover:bg-[#1f5643] text-white text-xs font-bold rounded-lg transition shadow-md animate-bounce"
              >
                Mark Account Created
              </button>
            )}

            {status === 'Account Created' && (
              <button
                onClick={handleMarkPaymentActivated}
                className="px-4 py-2 bg-nile-brightgreen text-nile-darkgreen hover:bg-[#b0f782] text-xs font-bold rounded-lg transition shadow-md animate-bounce"
              >
                Mark Payment Activated
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Area: Detail Sections & Document Audits */}
        <div className="lg:col-span-8 space-y-6">

          {/* Merchant / Representative identity */}
          <div className="bg-white border border-nile-border rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-nile-darkgreen uppercase border-b pb-2">{isCorporate ? 'Representative Information' : 'Personal Information'}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <DetailRow label="First Name" value={kycData.firstName} />
              <DetailRow label="Last Name" value={kycData.lastName} />
              <DetailRow label="Email Address" value={kycData.email} />
              <DetailRow label="Contact Number" value={kycData.phone} />
              <DetailRow label="Country" value={kycData.country} />
              {!isCorporate && <DetailRow label="Valid ID Type" value={kycData.idType} />}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
              {renderManualCheckCard('Phone number', 'phoneNumber', kycData.phone)}
              {kycData.country === 'Nigeria' && renderManualCheckCard('Bank Verification Number (BVN)', 'bvn', kycData.bvn)}
            </div>
          </div>
          
          {/* Section 1: Business Profile details */}
          <div className="bg-white border border-nile-border rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-nile-darkgreen uppercase border-b pb-2">Business Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <DetailRow label="Registered Business Name" value={kycData.businessName} />
              <DetailRow label="Trade Name" value={kycData.tradeName || 'N/A'} />
              <DetailRow label="Company Type" value={kycData.companyType} />
              <DetailRow label="Industry" value={kycData.industry} />
              <DetailRow label="Registration Number" value={kycData.rcNumber || 'N/A'} />
              <DetailRow label="Tax Identification Number (TIN)" value={kycData.taxId || 'N/A'} />
              <DetailRow label="Website URL" value={kycData.website} />
              <DetailRow label="Social URL" value={kycData.socialUrl || 'N/A'} />
              <DetailRow label="Support Phone" value={kycData.supportPhone || 'N/A'} />
              <DetailRow label="Support Email" value={kycData.supportEmail || 'N/A'} />
              <DetailRow label="Type of Business" value={kycData.businessType || 'N/A'} />
              <DetailRow label="Nature of Business" value={kycData.businessNature || 'N/A'} />
              <div className="col-span-1 md:col-span-2">
                <DetailRow label="Business Description / Purpose" value={kycData.businessPurpose || kycData.businessDesc} />
              </div>
            </div>
          </div>

          {/* Section 2: Address Verification */}
          <div className="bg-white border border-nile-border rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-nile-darkgreen uppercase border-b pb-2">Registered Address</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="col-span-1 md:col-span-3">
                <DetailRow label="Address" value={kycData.address} />
              </div>
              <DetailRow label="City" value={kycData.city} />
              <DetailRow label="State / Province" value={kycData.state} />
              <DetailRow label="Country" value={kycData.country} />
              {kycData.operationalAddress && (
                <div className="col-span-1 md:col-span-3">
                  <DetailRow label="Operational Address" value={kycData.operationalAddress} />
                </div>
              )}
            </div>
          </div>

          {/* Section 3: Document Verification (THE CRITICAL AUDIT AREA) */}
          <div className="bg-white border border-nile-border rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-nile-darkgreen uppercase border-b pb-2">Verify Uploaded Files</h3>
            <div className="space-y-3">
              {/* Government ID for Individual */}
              {!isCorporate && renderDocumentAuditCard('Government ID', 'governmentId', kycData.idFile)}
              
              {/* Utility Bill (Both corporate and individual) */}
              {renderDocumentAuditCard('Business Utility Bill', 'utilityBill', kycData.utilityFile)}
              
              {/* Corporate documents */}
              {isCorporate && (
                <>
                  {renderDocumentAuditCard('Certificate of Incorporation', 'cacCertFile', kycData.cacCertFile)}
                  {renderDocumentAuditCard('MEMART document', 'memartFile', kycData.memartFile)}
                  {renderDocumentAuditCard('CAC Form 1.1 / Status Report', 'statusReportFile', kycData.statusReportFile)}
                  {renderDocumentAuditCard('Board Resolution', 'boardResolutionFile', kycData.boardResolutionFile)}
                  {renderDocumentAuditCard('AML/CFT Questionnaire', 'amlQuestionnaire', kycData.amlQuestionnaireFile)}
                  {renderDocumentAuditCard('AML Policy', 'amlPolicy', kycData.amlPolicyFile)}
                  {renderDocumentAuditCard('KYC Policy', 'kycPolicy', kycData.kycPolicyFile)}
                  {renderDocumentAuditCard('UBO Documents', 'uboDocsFile', kycData.uboDocsFile)}
                  {renderDocumentAuditCard('Betting License (NLRC)', 'bettingLicenseFile', kycData.bettingLicenseFile)}
                  {renderDocumentAuditCard('Money Lending License', 'lendingLicenseFile', kycData.lendingLicenseFile)}
                  {renderDocumentAuditCard('CBN License / Application Letter', 'cbnLicenseFile', kycData.cbnLicenseFile)}
                  {renderDocumentAuditCard('SCUML Certificate', 'scumlCertFile', kycData.scumlCertFile)}
                </>
              )}
            </div>
          </div>

          {/* Section 4: Authorisers & Invitees (If corporate) */}
          {isCorporate && (
            <div className="bg-white border border-nile-border rounded-2xl p-6 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-nile-darkgreen uppercase border-b pb-2">Company Directors & Authorisers</h3>
              
              <div className="space-y-4">
                {/* Authorisers */}
                <div className="space-y-2 text-xs">
                  <p className="font-bold text-nile-dark">Registered Signees ({kycData.authorisers?.length || 0})</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {kycData.authorisers?.map((a, i) => (
                      <div key={i} className="border border-nile-border p-3 rounded-xl bg-slate-50 space-y-1">
                        <p className="font-bold text-nile-dark">{a.firstName} {a.lastName} ({a.type})</p>
                        <p className="text-nile-muted">Phone: {a.phone} {a.bvn ? `• BVN: ${a.bvn}` : ''}</p>
                        <p className="text-nile-muted">Nationality: {a.nationality || 'Not provided'}</p>
                        <p className="text-nile-muted">ID: {a.idType} ({a.idFile?.name || 'File check ok'})</p>
                        {a.residentPermitFile && <p className="text-nile-muted">Resident Permit: {a.residentPermitFile.name}</p>}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Invitees */}
                <div className="space-y-2 text-xs">
                  <p className="font-bold text-nile-dark">Invited Key Controllers ({kycData.invitees?.length || 0})</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {kycData.invitees?.map((a, i) => (
                      <div key={i} className="border border-nile-border p-3 rounded-xl bg-slate-50">
                        <p className="font-bold text-nile-dark">{a.name} ({a.role})</p>
                        <p className="text-nile-muted">Email: {a.email}</p>
                        <p className="text-nile-muted">Ultimate Beneficial Owner: {a.isUbo}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Section 5: Payout Account (If individual) */}
          {!isCorporate && (
            <div className="bg-white border border-nile-border rounded-2xl p-6 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-nile-darkgreen uppercase border-b pb-2">Payout Method</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <DetailRow label="Payout Method" value={kycData.payoutMethod} />
                <DetailRow label="Bank / Mobile Money Provider" value={kycData.bankName} />
                <DetailRow label="Account / Mobile Money Number" value={kycData.accountNumber} />
                <DetailRow label="Resolved Account Name" value={kycData.accountName} />
              </div>
            </div>
          )}

        </div>

        {/* Right Area: Notes & Activity Timeline */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Notes */}
          <div className="bg-white border border-nile-border rounded-2xl p-6 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-nile-dark">Audit log notes</h3>
            <textarea
              rows={4}
              readOnly
              value={app.notes || 'No compliance log notes recorded.'}
              className="w-full bg-slate-50 border border-nile-border rounded-xl p-3 text-xs text-nile-dark focus:outline-none"
            />
            <p className="text-[10px] text-nile-muted">Notes append automatically during state triggers.</p>
          </div>

          {/* Onboarding Timeline */}
          <div className="bg-white border border-nile-border rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-nile-dark border-b pb-2">Activity History</h3>
            
            <div className="flow-root">
              <ul className="-mb-8">
                {timeline.map((event, idx) => (
                  <li key={idx}>
                    <div className="relative pb-8">
                      {idx < timeline.length - 1 && (
                        <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-slate-200" aria-hidden="true" />
                      )}
                      <div className="relative flex space-x-3">
                        <div>
                          <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white text-[10px] font-bold ${
                            event.user === 'System' || event.user === 'Partner API' ? 'bg-nile-softmint text-nile-darkgreen' :
                            event.user === 'Merchant' ? 'bg-blue-50 text-blue-700' :
                            'bg-amber-50 text-amber-800'
                          }`}>
                            {idx + 1}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0 pt-1.5 text-xs text-left">
                          <p className="font-bold text-nile-dark flex justify-between gap-1">
                            <span>{event.title}</span>
                            <span className="text-[9px] text-nile-muted font-normal">{event.time.split(' ')[0]}</span>
                          </p>
                          <p className="text-[11px] text-nile-muted mt-0.5">{event.description}</p>
                          <p className="text-[9px] text-slate-400 mt-0.5">By: {event.user}</p>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>

      </div>

      {/* Compliance Request Modals */}
      <RequestInfoModal
        isOpen={requestModalOpen}
        onClose={() => setRequestModalOpen(false)}
        onSubmit={handleRequestInfoSubmit}
        docFields={getDocumentFields()}
      />

      <ApprovalModal
        isOpen={approveModalOpen}
        onClose={() => setApproveModalOpen(false)}
        onConfirm={handleApproveConfirm}
        businessName={kycData.businessName}
      />

      <RejectionModal
        isOpen={rejectModalOpen}
        onClose={() => setRejectModalOpen(false)}
        onConfirm={handleRejectConfirm}
        businessName={kycData.businessName}
      />

    </div>
  );
}
