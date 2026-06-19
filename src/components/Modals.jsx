import React, { useState } from 'react';
import { X, AlertTriangle, ShieldCheck, Mail, Phone, Lock, MessageSquare } from 'lucide-react';
import { Input, Select } from './FormComponents';

// Compliance Modal: Request More Info
export function RequestInfoModal({ isOpen, onClose, onSubmit, docFields = [] }) {
  const [selectedSection, setSelectedSection] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedSection) {
      setError('Please select a section needing update.');
      return;
    }
    if (!message.trim()) {
      setError('Please enter a message explaining what is required.');
      return;
    }
    setError('');
    onSubmit(selectedSection, message);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-nile-dark/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl border border-nile-border w-full max-w-lg shadow-2xl p-6 animate-scale-in">
        <div className="flex justify-between items-center border-b border-nile-border pb-3 mb-4">
          <h3 className="text-lg font-bold text-nile-dark flex items-center gap-2">
            <MessageSquare className="text-amber-500" size={20} />
            <span>Request Information</span>
          </h3>
          <button onClick={onClose} className="text-nile-muted hover:text-nile-dark"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Select
            label="Section Needing Update"
            name="section"
            value={selectedSection}
            onChange={(e) => setSelectedSection(e.target.value)}
            options={docFields}
            required
            error={!selectedSection && error ? error : ''}
          />

          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-nile-dark">
              Message to Merchant <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="e.g. Please upload a clear copy of your Certificate of Incorporation. The previous document was cut off."
              className="block w-full rounded-xl border border-nile-border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-nile-softmint focus:border-nile-darkgreen bg-white text-nile-dark"
            />
          </div>

          {error && <p className="text-xs text-nile-error font-medium">{error}</p>}

          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-nile-border">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-nile-border text-sm font-semibold text-nile-muted hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2.5 rounded-xl bg-nile-darkgreen text-white hover:bg-[#1f5643] text-sm font-semibold transition"
            >
              Send Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Compliance Modal: Approve Application Confirmation
export function ApprovalModal({ isOpen, onClose, onConfirm, businessName }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-nile-dark/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl border border-nile-border w-full max-w-md shadow-2xl p-6 text-center animate-scale-in">
        <div className="mx-auto w-12 h-12 bg-nile-softmint text-nile-darkgreen rounded-full flex items-center justify-center mb-4">
          <ShieldCheck size={28} />
        </div>
        <h3 className="text-lg font-bold text-nile-dark mb-2">Approve Application</h3>
        <p className="text-sm text-nile-muted mb-6">
          Are you sure you want to approve the application for <strong className="text-nile-dark">{businessName}</strong>? 
          After approval, Nile will automatically create/open the merchant account with the payment infrastructure partner and activate website payments.
        </p>

        <div className="flex items-center justify-center space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-nile-border text-sm font-semibold text-nile-muted hover:bg-slate-50 transition"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => { onConfirm(); onClose(); }}
            className="px-5 py-2.5 rounded-xl bg-nile-darkgreen text-white hover:bg-[#1f5643] text-sm font-semibold transition shadow-md"
          >
            Approve & Activate
          </button>
        </div>
      </div>
    </div>
  );
}

// Compliance Modal: Reject Application
export function RejectionModal({ isOpen, onClose, onConfirm, businessName }) {
  const [reason, setReason] = useState('');
  const [internalNote, setInternalNote] = useState('');
  const [notifyMerchant, setNotifyMerchant] = useState(true);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!reason.trim()) {
      setError('Please provide a rejection reason.');
      return;
    }
    setError('');
    onConfirm(reason, internalNote, notifyMerchant);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-nile-dark/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl border border-nile-border w-full max-w-lg shadow-2xl p-6 animate-scale-in">
        <div className="flex justify-between items-center border-b border-nile-border pb-3 mb-4">
          <h3 className="text-lg font-bold text-nile-dark flex items-center gap-2">
            <AlertTriangle className="text-red-500" size={20} />
            <span>Reject Application</span>
          </h3>
          <button onClick={onClose} className="text-nile-muted hover:text-nile-dark"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <p className="text-sm text-nile-muted">
            You are rejecting the onboarding application for <strong className="text-nile-dark">{businessName}</strong>. 
            This action cannot be easily undone.
          </p>

          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-nile-dark">
              Rejection Reason (Sent to merchant) <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. KYC document verification failed: The uploaded business registration could not be verified in the CAC portal."
              className="block w-full rounded-xl border border-nile-border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-nile-softmint focus:border-nile-darkgreen bg-white text-nile-dark"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-nile-dark">
              Internal Compliance Note (Private)
            </label>
            <textarea
              rows={2}
              value={internalNote}
              onChange={(e) => setInternalNote(e.target.value)}
              placeholder="Private notes for the compliance audit log..."
              className="block w-full rounded-xl border border-nile-border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-nile-softmint focus:border-nile-darkgreen bg-white text-nile-dark"
            />
          </div>

          <div className="flex items-center space-x-2 py-1">
            <input
              type="checkbox"
              id="notify"
              checked={notifyMerchant}
              onChange={(e) => setNotifyMerchant(e.target.checked)}
              className="rounded text-nile-darkgreen focus:ring-nile-softmint h-4 w-4 border-nile-border"
            />
            <label htmlFor="notify" className="text-sm text-nile-dark font-medium">
              Notify merchant via email
            </label>
          </div>

          {error && <p className="text-xs text-nile-error font-medium">{error}</p>}

          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-nile-border">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-nile-border text-sm font-semibold text-nile-muted hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-semibold transition"
            >
              Reject Application
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Phone OTP Verification Modal
export function OTPVerificationModal({ isOpen, onClose, onVerify, phoneNumber }) {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false;

    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

    // Focus next input
    if (element.nextSibling && element.value) {
      element.nextSibling.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    // Backspace to previous input
    if (e.key === 'Backspace' && !otp[index] && e.target.previousSibling) {
      e.target.previousSibling.focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const otpCode = otp.join('');
    if (otpCode.length < 6) {
      setError('Please enter all 6 digits.');
      return;
    }
    setError('');
    setIsSubmitting(true);
    
    // Mock network call
    setTimeout(() => {
      setIsSubmitting(false);
      onVerify();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-nile-dark/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl border border-nile-border w-full max-w-md shadow-2xl p-6 text-center animate-scale-in">
        <div className="mx-auto w-12 h-12 bg-nile-softmint text-nile-darkgreen rounded-full flex items-center justify-center mb-4">
          <Phone size={24} />
        </div>
        
        <h3 className="text-xl font-bold text-nile-dark mb-1">Verify your phone</h3>
        <p className="text-sm text-nile-muted mb-6">
          We sent a 6-digit verification code to <span className="text-nile-dark font-medium">{phoneNumber || '+234 812 *** 6789'}</span>
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-center space-x-2">
            {otp.map((data, index) => (
              <input
                key={index}
                type="text"
                maxLength="1"
                value={data}
                onChange={(e) => handleChange(e.target, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="w-12 h-12 text-center text-lg font-bold border border-nile-border rounded-xl focus:border-nile-darkgreen focus:ring-2 focus:ring-nile-softmint outline-none bg-slate-50 transition"
              />
            ))}
          </div>

          {error && <p className="text-xs text-nile-error font-medium">{error}</p>}

          <div className="space-y-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 bg-nile-darkgreen hover:bg-[#1f5643] text-white text-sm font-bold rounded-xl transition shadow-md flex justify-center items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Verifying...</span>
                </>
              ) : (
                'Verify phone number'
              )}
            </button>
            
            <p className="text-xs text-nile-muted">
              Didn't receive the code?{' '}
              <button
                type="button"
                onClick={() => alert('Verification code resent!')}
                className="text-nile-darkgreen font-bold hover:underline"
              >
                Resend code
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
