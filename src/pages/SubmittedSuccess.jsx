import React from 'react';
import { CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';

export default function SubmittedSuccess() {
  return (
    <div className="min-h-[80svh] flex flex-col justify-center items-center px-4 py-12 bg-nile-bg">
      <div className="w-full max-w-xl bg-white border border-nile-border rounded-3xl p-8 sm:p-12 shadow-xl text-center space-y-8 animate-scale-in">
        
        {/* Success Icon */}
        <div className="mx-auto w-16 h-16 bg-nile-softmint text-nile-success rounded-full flex items-center justify-center shadow-inner">
          <CheckCircle2 size={36} className="text-nile-darkgreen" />
        </div>

        {/* Title */}
        <div className="space-y-3">
          <span className="text-xs font-bold text-nile-darkgreen uppercase bg-nile-softmint px-3.5 py-1.5 rounded-full border border-nile-border">
            Status: Document Verification
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-nile-darkgreen tracking-tight pt-2">
            Application Submitted
          </h2>
          <p className="text-sm text-nile-muted max-w-md mx-auto leading-relaxed">
            We'll notify you once your compliance is approved.
          </p>
        </div>

        {/* Informational banner */}
        <div className="border border-nile-border rounded-2xl p-6 bg-slate-50 text-left space-y-3 text-xs leading-relaxed text-nile-muted">
          <div className="flex gap-2 text-nile-dark font-semibold items-center mb-1">
            <ShieldCheck size={16} className="text-nile-darkgreen" />
            <span>Compliance Review Queue</span>
          </div>
          <p>Our regulatory auditing team checks documents for name matching and registry alignment.</p>
          <p>If any verification document is flagged as blurry or incorrect, we will request an update. Otherwise, your merchant account will be created and payment collection will be activated automatically.</p>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <a
            href="https://app.nile.ng/"
            className="w-full py-4 bg-nile-darkgreen hover:bg-[#1f5643] text-white text-sm font-bold rounded-xl transition shadow-md flex justify-center items-center gap-1.5 glow-btn btn-stripe-style"
          >
            <span>Return to Nile Core</span>
            <ArrowRight size={16} />
          </a>
        </div>

      </div>
    </div>
  );
}
