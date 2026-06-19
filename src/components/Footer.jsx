import React from 'react';
import { ShieldCheck, Globe, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-nile-darkgreen text-white pt-16 pb-8 px-4 sm:px-6 lg:px-8 border-t border-white/10 mt-auto">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Top Section: Link Columns */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          
          {/* Column 1: Wise/Nile Pay Business */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-nile-brightgreen uppercase tracking-wider">Nile Pay Business</h4>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li><a href="#" className="hover:text-nile-brightgreen transition">Merchant Onboarding</a></li>
              <li><a href="#" className="hover:text-nile-brightgreen transition">Payment Collection MVP</a></li>
              <li><a href="#" className="hover:text-nile-brightgreen transition">Merchant Payment Accounts</a></li>
              <li><a href="#" className="hover:text-nile-brightgreen transition">Nile Core Shop Integration</a></li>
              <li><a href="#" className="hover:text-nile-brightgreen transition">Compliance Review Guidelines</a></li>
              <li><a href="#" className="hover:text-nile-brightgreen transition">API Documentation (Future)</a></li>
            </ul>
          </div>

          {/* Column 2: Parent Brand Nile */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-nile-brightgreen uppercase tracking-wider">Nile Ecosystem</h4>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li><a href="https://nile.ng" target="_blank" className="hover:text-nile-brightgreen transition flex items-center gap-1">Nile Website Builder <ExternalLink size={10} /></a></li>
              <li><a href="#" className="hover:text-nile-brightgreen transition">Nile E-commerce Store</a></li>
              <li><a href="#" className="hover:text-nile-brightgreen transition">Nile Logistics & Shipping</a></li>
              <li><a href="#" className="hover:text-nile-brightgreen transition">Nile Capital & Loans</a></li>
              <li><a href="#" className="hover:text-nile-brightgreen transition">Nile Creator Hub</a></li>
              <li><a href="#" className="hover:text-nile-brightgreen transition">Merchant Case Studies</a></li>
            </ul>
          </div>

          {/* Column 3: Company */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-nile-brightgreen uppercase tracking-wider">Company</h4>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li><a href="#" className="hover:text-nile-brightgreen transition">About Nile Pay</a></li>
              <li><a href="#" className="hover:text-nile-brightgreen transition">Compliance & Safety</a></li>
              <li><a href="#" className="hover:text-nile-brightgreen transition">Careers at Nile</a></li>
              <li><a href="#" className="hover:text-nile-brightgreen transition">Press Relations</a></li>
              <li><a href="#" className="hover:text-nile-brightgreen transition">Sustainability Statement</a></li>
              <li><a href="#" className="hover:text-nile-brightgreen transition">Partnerships Team</a></li>
            </ul>
          </div>

          {/* Column 4: Help & Resources */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-nile-brightgreen uppercase tracking-wider">Help & Resources</h4>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li><a href="#" className="hover:text-nile-brightgreen transition">Onboarding Help Center</a></li>
              <li><a href="#" className="hover:text-nile-brightgreen transition">KYC Document Requirements</a></li>
              <li><a href="#" className="hover:text-nile-brightgreen transition">BVN Verification FAQ</a></li>
              <li><a href="#" className="hover:text-nile-brightgreen transition">CAC Filing Instructions</a></li>
              <li><a href="#" className="hover:text-nile-brightgreen transition">Contact Compliance Auditors</a></li>
              <li><a href="#" className="hover:text-nile-brightgreen transition">System Status</a></li>
            </ul>
          </div>

          {/* Column 5: Store Badges & Legal links */}
          <div className="col-span-2 md:col-span-1 space-y-4">
            <h4 className="text-xs font-bold text-nile-brightgreen uppercase tracking-wider">Get the Nile App</h4>
            
            {/* App Store Badge Mocks */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-2">
              <a href="#" className="bg-black hover:bg-slate-900 border border-white/10 rounded-xl px-3 py-2 flex items-center gap-2 w-full max-w-[170px] text-left transition">
                <span className="text-lg"></span>
                <div>
                  <p className="text-[8px] text-slate-400 uppercase tracking-tight">Download on the</p>
                  <p className="text-xs font-bold text-white leading-none">App Store</p>
                </div>
              </a>
              <a href="#" className="bg-black hover:bg-slate-900 border border-white/10 rounded-xl px-3 py-2 flex items-center gap-2 w-full max-w-[170px] text-left transition">
                <span className="text-sm">🤖</span>
                <div>
                  <p className="text-[8px] text-slate-400 uppercase tracking-tight">Get it on</p>
                  <p className="text-xs font-bold text-white leading-none">Google Play</p>
                </div>
              </a>
            </div>
            
            {/* Social Icons (using fail-proof SVGs) */}
            <div className="flex items-center space-x-3.5 pt-2">
              {/* Twitter/X */}
              <a href="#" className="text-slate-400 hover:text-white transition">
                <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              {/* LinkedIn */}
              <a href="#" className="text-slate-400 hover:text-white transition">
                <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              {/* Facebook */}
              <a href="#" className="text-slate-400 hover:text-white transition">
                <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24">
                  <path d="M22.675 0h-21.35C.597 0 0 .597 0 1.336v21.328C0 23.403.597 24 1.325 24H12.82v-9.294H9.692V11.08h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.309h3.587l-.467 3.625h-3.12V24h6.116c.73 0 1.325-.597 1.325-1.336V1.336C24 .597 23.403 0 22.675 0z"/>
                </svg>
              </a>
              {/* GitHub */}
              <a href="#" className="text-slate-400 hover:text-white transition">
                <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
                </svg>
              </a>
            </div>
          </div>

        </div>

        {/* Middle Section: Regulation Badges & Language bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          
          {/* Trust badges */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xl font-bold tracking-tight text-white">
              nile<span className="text-nile-brightgreen">pay</span>
            </span>
            <span className="h-4 w-px bg-white/20 hidden sm:inline" />
            <div className="flex items-center gap-1.5 text-[11px] text-nile-brightgreen bg-white/5 border border-white/10 px-3 py-1 rounded-xl">
              <ShieldCheck size={13} />
              <span>Merchant card-payment activation</span>
            </div>
          </div>

          {/* Language Selector */}
          <div className="flex items-center gap-4 text-slate-300">
            <button className="flex items-center gap-1 hover:text-white transition">
              <Globe size={13} />
              <span>Nigeria (English)</span>
            </button>
            <span className="h-4 w-px bg-white/20" />
            <span className="text-slate-400">PSSP Regulated Agent</span>
          </div>

        </div>

        {/* Bottom Section: Massive Regulatory Disclosure Text */}
        <div className="border-t border-white/10 pt-8 text-[10px] text-slate-400 space-y-4 leading-relaxed text-left">
          <p>
            Nile Pay is a digital merchant onboarding product developed by Nile Inc. Payment processing, merchant accounts, settlement infrastructure, and payout services are supported by our regulated banking and payment infrastructure partners, including Providus Bank PLC and other Central Bank of Nigeria (CBN) licensed payment service partners.
          </p>
          <p>
            Nile Pay operates strictly as a Payment Solution Service Provider (PSSP) agent under Nile Core Technologies. Submission of your Bank Verification Number (BVN), Certificate of Incorporation, Memorandum and Articles of Association (MEMART), and Anti-Money Laundering (AML/CFT) policies is a regulatory requirement under the CBN KYC guidelines to prevent fraudulent checkouts.
          </p>
          <p>
            By onboarding on Nile Pay, you acknowledge that payment activation on your nile.ng website domain is subject to compliance verification review. Nile reserves the right to lock checkout capabilities, restrict merchant accounts, or reject applications that fail registry audits. Payout times are subject to standard settlement periods and partner bank gateway functional uptimes.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-between text-[9px] text-slate-500 pt-4 border-t border-white/5">
            <p>© 2026 Nile Pay Inc. All rights reserved.</p>
            <div className="flex space-x-4 mt-2 sm:mt-0">
              <a href="#" className="hover:underline">Privacy Policy</a>
              <a href="#" className="hover:underline">Terms of Service</a>
              <a href="#" className="hover:underline">Cookie Settings</a>
              <a href="#" className="hover:underline">Filing Disclaimers</a>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
}
