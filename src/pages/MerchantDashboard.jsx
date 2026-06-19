import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useNilePay } from '../context/NilePayContext';
import { ShieldAlert, CheckCircle, Clock, ExternalLink, ArrowRight, Phone, HelpCircle, FileCheck, CheckCircle2 } from 'lucide-react';

export default function MerchantDashboard() {
  const { activeApp, updateApplicationStatus } = useNilePay();
  const navigate = useNavigate();

  if (!activeApp) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 bg-white border border-nile-border rounded-2xl text-center space-y-4">
        <ShieldAlert size={40} className="text-amber-500 mx-auto" />
        <h3 className="text-lg font-bold text-nile-dark">No merchant profile active</h3>
        <p className="text-xs text-nile-muted">Please log in to inspect your merchant dashboard.</p>
        <Link to="/login" className="inline-block py-2.5 px-4 bg-nile-darkgreen text-white rounded-xl text-xs font-bold">
          Log in
        </Link>
      </div>
    );
  }

  const { status, website, accountType, progress, timeline, id, kycData, documentVerification } = activeApp;

  // Compute status metrics based on context status
  const getPaymentStatus = () => {
    switch (status) {
      case 'Draft': return { label: 'Not started', color: 'text-slate-400 bg-slate-100 border-slate-200' };
      case 'Submitted':
      case 'Under Review':
      case 'More Info Required':
      case 'Rejected':
        return { label: 'Locked until approval', color: 'text-red-700 bg-red-50 border-red-200' };
      case 'Approved':
      case 'Account Created':
        return { label: 'Ready for activation', color: 'text-amber-700 bg-amber-50 border-amber-200 animate-pulse' };
      case 'Payment Activated':
        return { label: 'Activated', color: 'text-nile-darkgreen bg-nile-brightgreen/30 border-nile-brightgreen/40' };
      default: return { label: 'Not started', color: 'text-slate-400' };
    }
  };

  const getPayoutStatus = () => {
    switch (status) {
      case 'Draft': return { label: 'Not added', color: 'text-slate-400 bg-slate-100' };
      case 'Submitted':
      case 'Under Review':
      case 'More Info Required':
        return { label: 'Pending confirmation', color: 'text-amber-700 bg-amber-50' };
      case 'Approved':
      case 'Account Created':
      case 'Payment Activated':
        return { label: 'Verified', color: 'text-nile-darkgreen bg-nile-brightgreen/20' };
      default: return { label: 'Not added', color: 'text-slate-400' };
    }
  };

  const paymentActivation = getPaymentStatus();
  const payoutAccount = getPayoutStatus();

  // Primary action button depending on status
  const getPrimaryAction = () => {
    switch (status) {
      case 'Draft':
        return (
          <button
            onClick={() => navigate(accountType === 'corporate' ? '/kyc/corporate' : '/kyc/individual')}
            className="flex items-center gap-1.5 px-6 py-3 bg-nile-darkgreen hover:bg-[#1f5643] text-white text-sm font-bold rounded-xl transition shadow-md glow-btn"
          >
            <span>Continue KYC onboarding</span>
            <ArrowRight size={16} />
          </button>
        );
      case 'More Info Required':
        return (
          <button
            onClick={() => navigate(accountType === 'corporate' ? '/kyc/corporate' : '/kyc/individual')}
            className="flex items-center gap-1.5 px-6 py-3 bg-[#e05436] hover:bg-[#ca4427] text-white text-sm font-bold rounded-xl transition shadow-md"
          >
            <span>Upload missing document</span>
            <ArrowRight size={16} />
          </button>
        );
      case 'Approved':
        return (
          <button
            onClick={() => {
              updateApplicationStatus(id, 'Account Created', 'Merchant account created after compliance approval.');
              alert('Nile created your merchant account! Now proceeding to payment activation.');
            }}
            className="flex items-center gap-1.5 px-6 py-3 bg-nile-darkgreen hover:bg-[#1f5643] text-white text-sm font-bold rounded-xl transition shadow-md animate-bounce"
          >
            <span>Create merchant account</span>
            <ArrowRight size={16} />
          </button>
        );
      case 'Account Created':
        return (
          <button
            onClick={() => {
              updateApplicationStatus(id, 'Payment Activated', 'Checkout gateway successfully enabled on website.');
              alert('Payment gateway activated! Checkouts now functional.');
            }}
            className="flex items-center gap-1.5 px-6 py-3 bg-nile-darkgreen hover:bg-[#1f5643] text-white text-sm font-bold rounded-xl transition shadow-md animate-bounce"
          >
            <span>Configure checkout gateway</span>
            <ArrowRight size={16} />
          </button>
        );
      default:
        return (
          <button
            onClick={() => navigate('/kyc/review')}
            className="flex items-center gap-1.5 px-6 py-3 border border-nile-border hover:bg-slate-50 text-nile-dark text-sm font-bold rounded-xl transition"
          >
            <span>View submitted details</span>
          </button>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-nile-border pb-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-nile-darkgreen tracking-tight">
            Hello, {activeApp.merchantName}
          </h2>
          <p className="text-sm text-nile-muted">
            Manage your Nile website checkout verification profile.
          </p>
        </div>
        
        {/* Support quick link */}
        <div className="flex items-center gap-2">
          <a
            href="mailto:compliance@nile.ng"
            className="flex items-center gap-1.5 text-xs font-bold text-nile-darkgreen bg-nile-softmint px-3.5 py-2 rounded-xl border border-nile-border hover:bg-nile-softmint/60 transition"
          >
            <HelpCircle size={14} />
            <span>Contact compliance support</span>
          </a>
        </div>
      </div>

      {/* Five status cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        
        {/* Card 1: KYC Status */}
        <div className="bg-white border border-nile-border p-5 rounded-2xl shadow-sm text-left flex flex-col justify-between h-36">
          <p className="text-[10px] font-bold uppercase tracking-wider text-nile-muted">KYC Status</p>
          <div className="mt-2">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${
              status === 'Payment Activated' || status === 'Approved' || status === 'Account Created' ? 'bg-green-50 text-green-700 border-green-200' :
              status === 'Submitted' || status === 'Under Review' ? 'bg-blue-50 text-blue-700 border-blue-200' :
              status === 'More Info Required' ? 'bg-amber-50 text-amber-900 border-amber-200 animate-pulse' :
              status === 'Rejected' ? 'bg-red-50 text-red-700 border-red-200' :
              'bg-slate-50 text-slate-600 border-slate-200'
            }`}>
              {status}
            </span>
          </div>
          <p className="text-[10px] text-nile-muted mt-2">Compliance audit phase</p>
        </div>

        {/* Card 2: Website URL */}
        <div className="bg-white border border-nile-border p-5 rounded-2xl shadow-sm text-left flex flex-col justify-between h-36">
          <p className="text-[10px] font-bold uppercase tracking-wider text-nile-muted">Website</p>
          <p className="text-xs font-semibold text-nile-darkgreen truncate underline flex items-center gap-0.5 mt-2">
            {website} <ExternalLink size={12} />
          </p>
          <p className="text-[10px] text-nile-muted mt-2">Nile Checkout target</p>
        </div>

        {/* Card 3: Payment Activation */}
        <div className="bg-white border border-nile-border p-5 rounded-2xl shadow-sm text-left flex flex-col justify-between h-36">
          <p className="text-[10px] font-bold uppercase tracking-wider text-nile-muted">Payment Activation</p>
          <div className="mt-2">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${paymentActivation.color}`}>
              {paymentActivation.label}
            </span>
          </div>
          <p className="text-[10px] text-nile-muted mt-2">Website gateway status</p>
        </div>

        {/* Card 4: Payout Account */}
        <div className="bg-white border border-nile-border p-5 rounded-2xl shadow-sm text-left flex flex-col justify-between h-36">
          <p className="text-[10px] font-bold uppercase tracking-wider text-nile-muted">Payout Account</p>
          <div className="mt-2">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${payoutAccount.color}`}>
              {payoutAccount.label}
            </span>
          </div>
          <p className="text-[10px] text-nile-muted mt-2">Resolved bank profile</p>
        </div>

        {/* Card 5: Application Progress */}
        <div className="bg-white border border-nile-border p-5 rounded-2xl shadow-sm text-left flex flex-col justify-between h-36">
          <p className="text-[10px] font-bold uppercase tracking-wider text-nile-muted">Application Progress</p>
          <p className="text-sm font-bold text-nile-darkgreen mt-2">{progress}</p>
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2">
            <div 
              className="bg-nile-darkgreen h-1.5 rounded-full transition-all duration-300"
              style={{ width: status === 'Payment Activated' || status === 'Approved' || status === 'Account Created' || status === 'Submitted' || status === 'Under Review' ? '100%' : status === 'More Info Required' ? '80%' : '20%' }}
            ></div>
          </div>
        </div>

      </div>

      {/* Main Action Block & Compliance Messages */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: KYC Onboarding checklist status */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Action Card */}
          <div className="bg-white border border-nile-border rounded-3xl p-6 sm:p-8 shadow-sm text-left space-y-4">
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-nile-dark">Onboarding action checklist</h3>
              <p className="text-xs text-nile-muted">Complete these actions to launch credit card, USSD, and bank transfer collections on your Nile website.</p>
            </div>

            {/* Checklist elements */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3 text-sm">
                <CheckCircle2 size={18} className="text-nile-success" />
                <span className="text-nile-dark font-medium">Create your Nile Pay profile & verify phone number</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                {accountType ? <CheckCircle2 size={18} className="text-nile-success" /> : <div className="w-[18px] h-[18px] border border-nile-border rounded-full"></div>}
                <span className={accountType ? "text-nile-dark font-medium" : "text-nile-muted"}>Select account type ({accountType || 'Pending'})</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                {['Submitted', 'Under Review', 'More Info Required', 'Approved', 'Account Created', 'Payment Activated'].includes(status) ? (
                  <CheckCircle2 size={18} className="text-nile-success" />
                ) : (
                  <div className="w-[18px] h-[18px] border border-nile-border rounded-full"></div>
                )}
                <span className={['Submitted', 'Under Review', 'More Info Required', 'Approved', 'Account Created', 'Payment Activated'].includes(status) ? "text-nile-dark font-medium" : "text-nile-muted"}>Submit KYC documents for review</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                {['Approved', 'Account Created', 'Payment Activated'].includes(status) ? (
                  <CheckCircle2 size={18} className="text-nile-success" />
                ) : (
                  <div className="w-[18px] h-[18px] border border-nile-border rounded-full"></div>
                )}
                <span className={['Approved', 'Account Created', 'Payment Activated'].includes(status) ? "text-nile-dark font-medium" : "text-nile-muted"}>Compliance approval</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                {['Account Created', 'Payment Activated'].includes(status) ? (
                  <CheckCircle2 size={18} className="text-nile-success" />
                ) : (
                  <div className="w-[18px] h-[18px] border border-nile-border rounded-full"></div>
                )}
                <span className={['Account Created', 'Payment Activated'].includes(status) ? "text-nile-dark font-medium" : "text-nile-muted"}>Merchant account creation</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                {status === 'Payment Activated' ? (
                  <CheckCircle2 size={18} className="text-nile-success" />
                ) : (
                  <div className="w-[18px] h-[18px] border border-nile-border rounded-full"></div>
                )}
                <span className={status === 'Payment Activated' ? "text-nile-dark font-medium" : "text-nile-muted"}>Payment gateway activation</span>
              </div>
            </div>

            {/* Compliance message if More Info Required */}
            {status === 'More Info Required' && (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 space-y-1.5 mt-4">
                <p className="font-bold flex items-center gap-1">
                  <ShieldAlert size={14} className="text-amber-500" />
                  Compliance Feedback: Action Required
                </p>
                <p className="leading-relaxed">
                  {documentVerification?.utilityBill?.rejectionReason || 
                   activeApp.notes.split('\n').filter(l => l.includes('[Requested info')).slice(-1)[0] ||
                   'One of your verification documents has been flagged by compliance. Please review your uploads and provide a corrected file.'}
                </p>
              </div>
            )}

            {/* CTA action trigger */}
            <div className="pt-4 border-t border-nile-border flex justify-end">
              {getPrimaryAction()}
            </div>
          </div>

        </div>

        {/* Right Side: Onboarding Timeline */}
        <div className="lg:col-span-4 bg-white border border-nile-border rounded-3xl p-6 shadow-sm text-left space-y-4">
          <h3 className="text-sm font-bold text-nile-dark border-b pb-2">Verification timeline</h3>
          
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
                      <div className="flex-1 min-w-0 pt-1.5">
                        <p className="text-xs font-bold text-nile-dark flex justify-between gap-2">
                          <span>{event.title}</span>
                          <span className="text-[10px] text-nile-muted font-normal">{event.time.split(' ')[0]}</span>
                        </p>
                        <p className="text-[11px] text-nile-muted mt-0.5">{event.description}</p>
                        <p className="text-[9px] text-nile-muted mt-0.5 italic">By: {event.user}</p>
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
  );
}
