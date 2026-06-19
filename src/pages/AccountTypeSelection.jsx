import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useNilePay } from '../context/NilePayContext';
import { User, Building2, ShieldCheck, ArrowRight } from 'lucide-react';

export default function AccountTypeSelection() {
  const { selectAccountType, activeApp } = useNilePay();
  const navigate = useNavigate();

  const handleSelection = (type) => {
    selectAccountType(activeApp.id, type);
    if (type === 'individual') {
      navigate('/kyc/individual');
    } else {
      navigate('/kyc/corporate');
    }
  };

  return (
    <div className="min-h-[80svh] flex flex-col justify-center items-center px-4 py-12 bg-nile-bg">
      <div className="w-full max-w-3xl space-y-8">
        
        {/* Title */}
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-nile-darkgreen tracking-tight">
            Choose your Nile Pay account type
          </h2>
          <p className="text-sm text-nile-muted max-w-md mx-auto">
            Select the profile type that fits your business structure. This decides what documentation compliance will require.
          </p>
        </div>

        {/* Account Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Individual / SME Card */}
          <button
            onClick={() => handleSelection('individual')}
            className="bg-white hover:bg-slate-50 border border-nile-border hover:border-nile-darkgreen p-8 rounded-3xl text-left shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group h-80 focus:outline-none focus:ring-2 focus:ring-nile-softmint"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-nile-softmint text-nile-darkgreen flex items-center justify-center transition group-hover:scale-110">
                <User size={24} />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-nile-dark">Individual / SME</h3>
                <p className="text-xs text-nile-muted leading-relaxed">
                  For freelancers, sole proprietors, small merchants, and informal business owners that want to activate payment collection on their Nile website under personal identity.
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-1 text-xs font-bold text-nile-darkgreen group-hover:text-[#1f5643] pt-4">
              <span>Continue as Individual / SME</span>
              <ArrowRight size={14} className="transform group-hover:translate-x-1 transition" />
            </div>
          </button>

          {/* Corporate / Registered Business Card */}
          <button
            onClick={() => handleSelection('corporate')}
            className="bg-white hover:bg-slate-50 border border-nile-border hover:border-nile-darkgreen p-8 rounded-3xl text-left shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group h-80 focus:outline-none focus:ring-2 focus:ring-nile-softmint"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-nile-softmint text-nile-darkgreen flex items-center justify-center transition group-hover:scale-110">
                <Building2 size={24} />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-nile-dark">Registered Business</h3>
                <p className="text-xs text-nile-muted leading-relaxed">
                  For CAC-registered companies (LLC, PLC, partnerships, unlimited) and larger enterprises. Requires corporate documents, AML policies, and ultimate beneficial owner declarations.
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-1 text-xs font-bold text-nile-darkgreen group-hover:text-[#1f5643] pt-4">
              <span>Continue as Registered Business</span>
              <ArrowRight size={14} className="transform group-hover:translate-x-1 transition" />
            </div>
          </button>

        </div>

        {/* Security badge footer */}
        <div className="flex items-center justify-center gap-2 text-xs text-nile-muted text-center pt-2">
          <ShieldCheck size={16} className="text-nile-success" />
          <span>Your compliance files are stored securely and checked by the Nile Compliance audit team.</span>
        </div>

      </div>
    </div>
  );
}
