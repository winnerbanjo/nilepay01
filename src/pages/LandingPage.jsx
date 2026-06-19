import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Sparkles, CheckCircle2, ArrowRight, Activity, Globe, Lock } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="bg-nile-bg min-h-screen flex flex-col font-sans overflow-hidden">
      
      {/* Hero Section */}
      <section id="card-payments" className="relative scroll-mt-16 pt-24 pb-28 md:pt-36 md:pb-40 stripe-dark-gradient text-white">
        
        {/* Soft floating background blobs */}
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-nile-brightgreen/10 rounded-full blur-[120px] pointer-events-none transform animate-pulse duration-[8s]" />
        <div className="absolute bottom-[-15%] left-[-10%] w-[450px] h-[450px] bg-nile-softmint/10 rounded-full blur-[100px] pointer-events-none transform animate-pulse duration-[10s]" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-10 items-center">
            
            {/* Left Column: Headline & CTAs */}
            <div className="lg:col-span-8 space-y-8 text-left animate-fade-in-up">
              
              {/* Micro-badge */}
              <span className="eyebrow-type inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-nile-brightgreen/10 text-nile-brightgreen border border-nile-brightgreen/25 backdrop-blur-sm">
                <Sparkles size={13} className="animate-spin duration-300" />
                <span>Built for Nile sellers</span>
              </span>
              
              {/* Title */}
              <h1 className="display-type text-white max-w-5xl">
                Get paid. Stay focused.{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-nile-brightgreen via-emerald-300 to-nile-brightgreen bg-size-200">
                  We’ll handle the setup.
                </span>
              </h1>
              
              <p className="editorial-copy text-slate-300 max-w-2xl font-normal">
                Drop your business details, send your docs, and we’ll take it from there. Once compliance gives the green light, your merchant account goes live in Nile.
              </p>
              
              {/* Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
                <Link
                  to="/signup"
                  className="bg-nile-brightgreen hover:bg-[#b0f782] text-nile-darkgreen text-center font-bold px-8 py-4 rounded-xl transition duration-300 shadow-lg hover-glow btn-stripe-style text-sm"
                >
                  Set up card payments
                </Link>
                <a
                  href="https://app.nile.ng/"
                  className="bg-white/10 hover:bg-white/15 border border-white/10 text-white text-center font-bold px-8 py-4 rounded-xl transition duration-300 text-sm"
                >
                  Pick up where I left off
                </a>
              </div>

              {/* Security Subtext */}
              <div className="flex items-center gap-2 pt-1 text-xs text-slate-400">
                <Shield size={14} className="text-nile-brightgreen" />
                <span>No tech maze. No chasing updates. Just one clean setup.</span>
              </div>
            </div>

            {/* Right Column: Floating Dashboard Mockup Card */}
            <div className="lg:col-span-4 flex justify-center animate-slide-in-right">
              <div className="w-full max-w-sm rounded-3xl bg-white border border-nile-border p-6 shadow-2xl text-nile-dark text-left relative overflow-hidden animate-float">
                
                {/* Card Header */}
                <div className="flex items-center justify-between border-b border-nile-border pb-4 mb-4">
                  <div>
                    <h4 className="text-sm font-bold text-nile-darkgreen">House of Tosi</h4>
                    <p className="text-[11px] text-nile-muted flex items-center gap-0.5 mt-0.5">
                      <Globe size={10} /> houseoftosi.nile.ng
                    </p>
                  </div>
                  <span className="text-[10px] px-2.5 py-1 rounded-full font-bold bg-amber-100 text-amber-900 border border-amber-200 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                    In review
                  </span>
                </div>

                {/* Content rows */}
                <div className="space-y-4">
                  
                  {/* Status 1 */}
                  <div className="flex justify-between items-center bg-slate-50 p-3 rounded-2xl border border-slate-100 hover:border-nile-border/40 transition">
                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-wider text-nile-muted">Card payments</p>
                      <p className="text-xs font-bold text-red-600">Locked until approval</p>
                    </div>
                    <Lock size={15} className="text-red-500" />
                  </div>

                  {/* Status 2 */}
                  <div className="flex justify-between items-center bg-slate-50 p-3 rounded-2xl border border-slate-100 hover:border-nile-border/40 transition">
                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-wider text-nile-muted">Merchant account</p>
                      <p className="text-xs font-bold text-amber-600">Pending confirmation</p>
                    </div>
                    <Activity size={15} className="text-amber-500 animate-pulse" />
                  </div>

                  {/* Visual Stepper */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs font-bold">
                      <span className="text-nile-dark">KYC Document Uploads</span>
                      <span className="text-nile-darkgreen">4 of 6 completed</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div className="bg-nile-darkgreen h-2 rounded-full transition-all duration-1000" style={{ width: '66%' }} />
                    </div>
                  </div>

                  {/* Informational Message */}
                  <div className="border border-nile-border/50 p-3.5 rounded-2xl bg-nile-softmint/45 flex items-start gap-2.5 text-xs text-nile-darkgreen leading-relaxed">
                    <CheckCircle2 size={16} className="shrink-0 mt-0.5" />
                    <span>Your docs are with the Nile team. We’ll keep you posted.</span>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Trust Grid Section */}
      <section id="compliance" className="scroll-mt-16 py-28 md:py-36 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-5xl mx-auto text-center mb-20 space-y-6">
            <span className="eyebrow-type text-nile-muted">The whole setup, handled</span>
            <h2 className="section-display text-nile-darkgreen">
              From “I’m interested” to “payment received.”
            </h2>
            <p className="editorial-copy text-nile-muted max-w-2xl mx-auto">
              You bring the business. We’ll guide the paperwork, review the details, create your merchant account, and get you ready to collect.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Card 1 */}
            <div className="bg-white border border-nile-border p-7 rounded-3xl text-left shadow-sm hover:shadow-md card-hover-effect space-y-4">
              <div className="w-10 h-10 rounded-2xl bg-nile-softmint text-nile-darkgreen flex items-center justify-center font-bold text-sm">
                01
              </div>
              <h3 className="text-lg font-semibold tracking-[-0.025em] text-nile-darkgreen">Tell us what you sell</h3>
              <p className="text-sm text-nile-muted leading-relaxed">
                A quick business profile so we know who’s getting paid. Nothing dramatic.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white border border-nile-border p-7 rounded-3xl text-left shadow-sm hover:shadow-md card-hover-effect space-y-4">
              <div className="w-10 h-10 rounded-2xl bg-nile-softmint text-nile-darkgreen flex items-center justify-center font-bold text-sm">
                02
              </div>
              <h3 className="text-lg font-semibold tracking-[-0.025em] text-nile-darkgreen">Drop your docs</h3>
              <p className="text-sm text-nile-muted leading-relaxed">
                Send your KYC and business files once. If anything’s missing, we’ll tell you exactly what.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white border border-nile-border p-7 rounded-3xl text-left shadow-sm hover:shadow-md card-hover-effect space-y-4">
              <div className="w-10 h-10 rounded-2xl bg-nile-softmint text-nile-darkgreen flex items-center justify-center font-bold text-sm">
                03
              </div>
              <h3 className="text-lg font-semibold tracking-[-0.025em] text-nile-darkgreen">We do the serious bit</h3>
              <p className="text-sm text-nile-muted leading-relaxed">
                Our team reviews everything manually. Once you’re approved, we create your merchant account.
              </p>
            </div>

            {/* Card 4 */}
            <div className="bg-white border border-nile-border p-7 rounded-3xl text-left shadow-sm hover:shadow-md card-hover-effect space-y-4">
              <div className="w-10 h-10 rounded-2xl bg-nile-softmint text-nile-darkgreen flex items-center justify-center font-bold text-sm">
                04
              </div>
              <h3 className="text-lg font-semibold tracking-[-0.025em] text-nile-darkgreen">Go live and get paid</h3>
              <p className="text-sm text-nile-muted leading-relaxed">
                Card payments switch on in the main Nile app. Your customers tap, pay, done.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="scroll-mt-16 py-28 md:py-36 bg-nile-softmint/45 border-y border-nile-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-5xl mx-auto text-center mb-20 space-y-6">
            <span className="eyebrow-type text-nile-muted">How it goes</span>
            <h2 className="section-display text-nile-darkgreen">
              Five steps. Zero side quests.
            </h2>
            <p className="editorial-copy text-nile-muted max-w-2xl mx-auto">
              One straight line from business details to your first customer payment.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
            
            {/* Step 1 */}
            <div className="space-y-4 text-left p-2 rounded-2xl hover:bg-white/50 transition duration-200">
              <div className="w-8 h-8 rounded-full bg-nile-darkgreen text-white font-bold flex items-center justify-center text-sm">1</div>
              <h4 className="text-sm font-bold text-nile-dark">Register for card payments</h4>
              <p className="text-sm text-nile-muted leading-relaxed">Create your profile and tell us about the business getting paid.</p>
            </div>

            {/* Step 2 */}
            <div className="space-y-4 text-left p-2 rounded-2xl hover:bg-white/50 transition duration-200">
              <div className="w-8 h-8 rounded-full bg-nile-darkgreen text-white font-bold flex items-center justify-center text-sm">2</div>
              <h4 className="text-base font-semibold text-nile-dark">Pick your business type</h4>
              <p className="text-sm text-nile-muted leading-relaxed">Individual / SME or registered business. Choose what fits.</p>
            </div>

            {/* Step 3 */}
            <div className="space-y-4 text-left p-2 rounded-2xl hover:bg-white/50 transition duration-200">
              <div className="w-8 h-8 rounded-full bg-nile-darkgreen text-white font-bold flex items-center justify-center text-sm">3</div>
              <h4 className="text-base font-semibold text-nile-dark">Send the essentials</h4>
              <p className="text-sm text-nile-muted leading-relaxed">Add your details, payout account, and the documents we need.</p>
            </div>

            {/* Step 4 */}
            <div className="space-y-4 text-left p-2 rounded-2xl hover:bg-white/50 transition duration-200">
              <div className="w-8 h-8 rounded-full bg-nile-darkgreen text-white font-bold flex items-center justify-center text-sm">4</div>
              <h4 className="text-base font-semibold text-nile-dark">We check everything</h4>
              <p className="text-sm text-nile-muted leading-relaxed">Our compliance team reviews manually and keeps your status updated.</p>
            </div>

            {/* Step 5 */}
            <div className="space-y-4 text-left p-2 rounded-2xl hover:bg-white/50 transition duration-200">
              <div className="w-8 h-8 rounded-full bg-nile-darkgreen text-white font-bold flex items-center justify-center text-sm">5</div>
              <h4 className="text-base font-semibold text-nile-dark">You’re live</h4>
              <p className="text-sm text-nile-muted leading-relaxed">We create your account, switch on card payments, and you start collecting.</p>
            </div>

          </div>
        </div>
      </section>

      {/* One Flow Focus Section */}
      <section className="py-28 md:py-36 bg-white relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-7">
          <span className="text-xs font-bold text-nile-darkgreen uppercase bg-nile-softmint px-3.5 py-1.5 rounded-full border border-nile-border">
            All signal. No side quests.
          </span>
          
          <h2 className="section-display text-nile-darkgreen">
            One clean route to getting paid.
          </h2>
          
          <p className="editorial-copy text-nile-muted max-w-2xl mx-auto">
            Nile Pay stays focused on the bit that matters: getting your business approved, activated, and ready to collect in the main Nile app.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 pt-6 max-w-2xl mx-auto text-xs font-bold text-slate-400">
            <div className="border border-nile-border p-3 rounded-2xl bg-nile-softmint/50 text-nile-darkgreen">Registration</div>
            <div className="border border-nile-border p-3 rounded-2xl bg-nile-softmint/50 text-nile-darkgreen">KYC</div>
            <div className="border border-nile-border p-3 rounded-2xl bg-nile-softmint/50 text-nile-darkgreen">Card payments</div>
            <div className="border border-nile-border p-3 rounded-2xl bg-nile-softmint/50 text-nile-darkgreen">Merchant account</div>
            <div className="col-span-2 md:col-span-1 border border-nile-border p-3 rounded-2xl bg-nile-softmint/50 text-nile-darkgreen">Go live</div>
          </div>
        </div>
      </section>

      {/* Stripe-style CTA Section */}
      <section className="py-28 md:py-36 stripe-dark-gradient text-white text-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 w-[550px] h-[550px] bg-nile-brightgreen/5 rounded-full blur-[100px] pointer-events-none transform -translate-x-1/2 -translate-y-1/2" />
        
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-7">
          <span className="eyebrow-type text-nile-brightgreen">Your move</span>
          <h2 className="section-display text-white">
            Your customers are ready. You?
          </h2>
          <p className="editorial-copy text-slate-300 max-w-xl mx-auto">
            Set up once. We’ll handle the checks and get your business ready to collect.
          </p>
          <div className="pt-2">
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 bg-nile-brightgreen hover:bg-[#b0f782] text-nile-darkgreen font-bold px-8 py-4 rounded-xl transition duration-300 shadow-lg hover-glow btn-stripe-style text-sm"
            >
              <span>Let’s get you paid</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
      
    </div>
  );
}
