import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNilePay } from '../context/NilePayContext';
import { 
  Search, 
  ShieldCheck, 
  Eye, 
  RefreshCw, 
  Layers, 
  ChevronLeft, 
  ChevronRight, 
  Calendar, 
  AlertCircle, 
  Globe, 
  Briefcase,
  SlidersHorizontal,
  ChevronDown
} from 'lucide-react';

export default function ComplianceDashboard() {
  const { applications, startReview, backendStatus } = useNilePay();
  const navigate = useNavigate();

  // Carousel Slide State
  const [activeSlide, setActiveSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Search, Date and Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [countryFilter, setCountryFilter] = useState('');
  const [industryFilter, setIndustryFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sortBy, setSortBy] = useState('latest_signup');

  // Compute stat boxes
  const total = applications.length;
  const pending = applications.filter(a => a.status === 'Submitted' || a.status === 'Under Review').length;
  const moreInfo = applications.filter(a => a.status === 'More Info Required').length;
  const approved = applications.filter(a => a.status === 'Approved' || a.status === 'Account Created').length;
  const rejected = applications.filter(a => a.status === 'Rejected').length;
  const activated = applications.filter(a => a.status === 'Payment Activated').length;

  // Compute country counts
  const ngCount = applications.filter(a => a.country === 'Nigeria').length;
  const ghCount = applications.filter(a => a.country === 'Ghana').length;
  const keCount = applications.filter(a => a.country === 'Kenya').length;

  // Compute account type counts
  const individualCount = applications.filter(a => a.accountType === 'individual').length;
  const corporateCount = applications.filter(a => a.accountType === 'corporate').length;

  // Compute industry counts
  const fashionCount = applications.filter(a => a.industry === 'Fashion & Apparel').length;
  const cosmeticsCount = applications.filter(a => a.industry === 'Cosmetics & Beauty').length;
  const retailCount = applications.filter(a => a.industry === 'E-commerce Retail' || a.industry === 'Retail').length;
  const otherIndustryCount = total - (fashionCount + cosmeticsCount + retailCount);

  // Autoplay Carousel Effect
  useEffect(() => {
    let interval = null;
    if (!isHovered) {
      interval = setInterval(() => {
        setActiveSlide((prev) => (prev + 1) % 3);
      }, 8000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isHovered]);

  // Helper to extract creation timestamp safely
  const getSignupTime = (app) => {
    if (app.created_at) return new Date(app.created_at).getTime();
    if (app.timeline && app.timeline.length > 0) {
      const firstEvent = app.timeline[0];
      if (firstEvent && firstEvent.time) {
        const formatted = firstEvent.time.includes(' ') 
          ? firstEvent.time.replace(' ', 'T') 
          : firstEvent.time;
        const parsed = Date.parse(formatted);
        if (!isNaN(parsed)) return parsed;
      }
    }
    if (app.submittedDate && app.submittedDate !== '-') {
      const parsed = Date.parse(app.submittedDate);
      if (!isNaN(parsed)) return parsed;
    }
    return app.updated_at ? new Date(app.updated_at).getTime() : 0;
  };

  const getSignupDateString = (app) => {
    const signupTime = getSignupTime(app);
    if (!signupTime) return '-';
    return new Date(signupTime).toISOString().replace('T', ' ').substring(0, 16);
  };

  const getLastUpdatedString = (app) => {
    if (!app.updated_at) return '-';
    return new Date(app.updated_at).toISOString().replace('T', ' ').substring(0, 16);
  };

  const handleReviewClick = (app) => {
    // If not assigned and is submitted, assign to current compliance officer
    if (!app.assignedReviewer && (app.status === 'Submitted')) {
      startReview(app.id, 'Amara Nwosu');
    }
    navigate(`/admin/compliance/applications/${app.id}`);
  };

  // Filter application items
  const filteredApps = applications.filter(app => {
    const matchesSearch = 
      app.businessName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.merchantName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.website?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.kycData?.email?.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesStatus = statusFilter ? app.status === statusFilter : true;
    const matchesType = typeFilter ? app.accountType === typeFilter : true;
    const matchesCountry = countryFilter ? app.country === countryFilter : true;
    const matchesIndustry = industryFilter ? app.industry === industryFilter : true;

    const matchesDate = (() => {
      if (!startDate && !endDate) return true;
      const signupTime = getSignupTime(app);
      if (!signupTime) return false;
      
      const start = startDate ? new Date(startDate).getTime() : 0;
      // End date sets to the very end of the selected day
      const end = endDate ? new Date(endDate + 'T23:59:59.999Z').getTime() : Infinity;
      return signupTime >= start && signupTime <= end;
    })();

    return matchesSearch && matchesStatus && matchesType && matchesCountry && matchesIndustry && matchesDate;
  });

  // Sort application items
  const sortedApps = [...filteredApps].sort((a, b) => {
    switch (sortBy) {
      case 'latest_signup':
        return getSignupTime(b) - getSignupTime(a);
      case 'oldest_signup':
        return getSignupTime(a) - getSignupTime(b);
      case 'latest_updated': {
        const timeA = a.updated_at ? new Date(a.updated_at).getTime() : 0;
        const timeB = b.updated_at ? new Date(b.updated_at).getTime() : 0;
        return timeB - timeA;
      }
      case 'oldest_updated': {
        const timeA = a.updated_at ? new Date(a.updated_at).getTime() : 0;
        const timeB = b.updated_at ? new Date(b.updated_at).getTime() : 0;
        return timeA - timeB;
      }
      case 'merchant_name_asc':
        return (a.merchantName || '').localeCompare(b.merchantName || '');
      case 'business_name_asc':
        return (a.businessName || '').localeCompare(b.businessName || '');
      case 'submitted_newest': {
        const dateA = a.submittedDate && a.submittedDate !== '-' ? new Date(a.submittedDate).getTime() : 0;
        const dateB = b.submittedDate && b.submittedDate !== '-' ? new Date(b.submittedDate).getTime() : 0;
        return dateB - dateA;
      }
      default:
        return 0;
    }
  });

  const nextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % 3);
  };

  const prevSlide = () => {
    setActiveSlide((prev) => (prev - 1 + 3) % 3);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 text-left animate-fade-in-up">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-nile-border pb-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-nile-darkgreen tracking-tight flex items-center gap-2">
            <ShieldCheck size={32} className="text-nile-darkgreen" />
            <span>Compliance Dossier Queue</span>
          </h2>
          <p className="text-sm text-nile-muted">
            Internal auditing console for verifying merchant KYC credentials and activating checkout gateways.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <span className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold border transition-all duration-300 shadow-sm ${
            backendStatus === 'connected'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : backendStatus === 'connecting'
              ? 'bg-amber-50 text-amber-800 border-amber-200 animate-pulse'
              : 'bg-red-50 text-red-800 border-red-200'
          }`}>
            <span className={`w-2.5 h-2.5 rounded-full ${
              backendStatus === 'connected' 
                ? 'bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]' 
                : backendStatus === 'connecting' 
                ? 'bg-amber-500' 
                : 'bg-red-500'
            }`} />
            Backend Sync: {backendStatus === 'connected' ? 'Live' : backendStatus === 'connecting' ? 'Reconnecting...' : 'Offline'}
          </span>
        </div>
      </div>

      {/* Dynamic KPI Dashboard Carousel */}
      <div 
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative bg-slate-950 text-white rounded-[32px] p-6 sm:p-8 shadow-2xl border border-white/5 overflow-hidden stripe-dark-gradient"
      >
        {/* Decorative background gradients */}
        <div className="absolute -left-16 -top-16 w-64 h-64 bg-nile-brightgreen/10 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] pointer-events-none" />

        {/* Carousel controls */}
        <div className="absolute right-6 top-6 sm:right-8 sm:top-8 flex items-center gap-2.5 z-10">
          <button 
            onClick={prevSlide}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all duration-200 hover:scale-105 active:scale-95 focus:outline-none border border-white/5"
            aria-label="Previous metrics slide"
          >
            <ChevronLeft size={16} />
          </button>
          <button 
            onClick={nextSlide}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all duration-200 hover:scale-105 active:scale-95 focus:outline-none border border-white/5"
            aria-label="Next metrics slide"
          >
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Viewport */}
        <div className="relative overflow-hidden w-full mt-2">
          <div 
            className="flex transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${activeSlide * 100}%)` }}
          >
            {/* Slide 0: General Queue Stats */}
            <div className="w-full shrink-0 space-y-4 pr-4">
              <div className="space-y-1">
                <span className="text-[10px] font-bold tracking-wider text-nile-brightgreen uppercase flex items-center gap-1.5">
                  <Layers size={13} className="text-nile-brightgreen" /> Slide 1 of 3: Core Queue KPIs
                </span>
                <h3 className="text-xl font-black text-white tracking-tight">Onboarding Auditing Overview</h3>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 pt-2">
                <div className="bg-white/5 border border-white/10 p-4 rounded-2xl flex flex-col justify-between h-28 card-hover-effect">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Total Profiles</span>
                  <div className="text-3xl font-black text-white">{total}</div>
                  <div className="text-[9px] text-slate-500">In database</div>
                </div>
                
                <div className="bg-blue-500/10 border border-blue-500/25 p-4 rounded-2xl flex flex-col justify-between h-28 card-hover-effect">
                  <span className="text-[9px] font-bold text-blue-300 uppercase tracking-wider">Pending Review</span>
                  <div className="text-3xl font-black text-blue-400">{pending}</div>
                  <div className="text-[9px] text-blue-300/60">Awaiting audit</div>
                </div>
                
                <div className="bg-amber-500/10 border border-amber-500/25 p-4 rounded-2xl flex flex-col justify-between h-28 card-hover-effect">
                  <span className="text-[9px] font-bold text-amber-300 uppercase tracking-wider">More Info</span>
                  <div className="text-3xl font-black text-amber-400">{moreInfo}</div>
                  <div className="text-[9px] text-amber-300/60">Flagged requests</div>
                </div>
                
                <div className="bg-emerald-500/10 border border-emerald-500/25 p-4 rounded-2xl flex flex-col justify-between h-28 card-hover-effect">
                  <span className="text-[9px] font-bold text-emerald-300 uppercase tracking-wider">Approved KYC</span>
                  <div className="text-3xl font-black text-emerald-400">{approved}</div>
                  <div className="text-[9px] text-emerald-300/60">Passed checks</div>
                </div>

                <div className="bg-red-500/10 border border-red-500/25 p-4 rounded-2xl flex flex-col justify-between h-28 card-hover-effect">
                  <span className="text-[9px] font-bold text-red-300 uppercase tracking-wider">Rejected</span>
                  <div className="text-3xl font-black text-red-400">{rejected}</div>
                  <div className="text-[9px] text-red-300/60">Failed audit</div>
                </div>
                
                <div className="bg-nile-brightgreen/10 border border-nile-brightgreen/25 p-4 rounded-2xl flex flex-col justify-between h-28 card-hover-effect">
                  <span className="text-[9px] font-bold text-nile-brightgreen uppercase tracking-wider">Activated</span>
                  <div className="text-3xl font-black text-nile-brightgreen">{activated}</div>
                  <div className="text-[9px] text-nile-brightgreen/70">Gateway active</div>
                </div>
              </div>
            </div>

            {/* Slide 1: Geographical & Account Type Metrics */}
            <div className="w-full shrink-0 space-y-4 pr-4">
              <div className="space-y-1">
                <span className="text-[10px] font-bold tracking-wider text-nile-brightgreen uppercase flex items-center gap-1.5">
                  <Globe size={13} className="text-nile-brightgreen" /> Slide 2 of 3: Demographics & Account Types
                </span>
                <h3 className="text-xl font-black text-white tracking-tight">Regional and Entity Distribution</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                {/* Countries */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">Country Breakdown</h4>
                  <div className="space-y-2">
                    <div>
                      <div className="flex justify-between text-xs font-medium mb-1">
                        <span>Nigeria</span>
                        <span>{ngCount} ({total ? Math.round((ngCount / total) * 100) : 0}%)</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2">
                        <div className="bg-nile-brightgreen h-2 rounded-full transition-all duration-500" style={{ width: `${total ? (ngCount / total) * 100 : 0}%` }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs font-medium mb-1">
                        <span>Ghana</span>
                        <span>{ghCount} ({total ? Math.round((ghCount / total) * 100) : 0}%)</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2">
                        <div className="bg-yellow-400 h-2 rounded-full transition-all duration-500" style={{ width: `${total ? (ghCount / total) * 100 : 0}%` }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs font-medium mb-1">
                        <span>Kenya</span>
                        <span>{keCount} ({total ? Math.round((keCount / total) * 100) : 0}%)</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2">
                        <div className="bg-red-400 h-2 rounded-full transition-all duration-500" style={{ width: `${total ? (keCount / total) * 100 : 0}%` }} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Account Types */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-3 flex flex-col justify-between">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">Account Type Split</h4>
                    <div className="flex items-center justify-around py-2">
                      <div className="text-center">
                        <p className="text-[10px] text-slate-400 uppercase font-semibold">Individual / SME</p>
                        <p className="text-3xl font-black text-nile-brightgreen mt-1">{individualCount}</p>
                      </div>
                      <div className="h-10 w-px bg-white/10" />
                      <div className="text-center">
                        <p className="text-[10px] text-slate-400 uppercase font-semibold">Corporate Entity</p>
                        <p className="text-3xl font-black text-blue-400 mt-1">{corporateCount}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Visual ratio bar */}
                  <div className="w-full bg-white/10 rounded-full h-2.5 flex overflow-hidden">
                    <div className="bg-nile-brightgreen h-2.5 transition-all duration-500" style={{ width: `${total ? (individualCount / total) * 100 : 50}%` }} />
                    <div className="bg-blue-400 h-2.5 transition-all duration-500" style={{ width: `${total ? (corporateCount / total) * 100 : 50}%` }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Slide 2: Industry Breakdown */}
            <div className="w-full shrink-0 space-y-4 pr-4">
              <div className="space-y-1">
                <span className="text-[10px] font-bold tracking-wider text-nile-brightgreen uppercase flex items-center gap-1.5">
                  <Briefcase size={13} className="text-nile-brightgreen" /> Slide 3 of 3: Industry Distribution
                </span>
                <h3 className="text-xl font-black text-white tracking-tight">Onboarding Segment breakdown</h3>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-4">Merchant Industry Spread</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white/5 p-4 rounded-xl text-center border border-white/5">
                    <p className="text-xs font-bold text-slate-400">Fashion & Apparel</p>
                    <p className="text-2xl font-black text-white mt-1">{fashionCount}</p>
                    <p className="text-[9px] text-nile-brightgreen mt-0.5 font-bold">{total ? Math.round((fashionCount / total) * 100) : 0}% share</p>
                  </div>
                  <div className="bg-white/5 p-4 rounded-xl text-center border border-white/5">
                    <p className="text-xs font-bold text-slate-400">Cosmetics & Beauty</p>
                    <p className="text-2xl font-black text-white mt-1">{cosmeticsCount}</p>
                    <p className="text-[9px] text-blue-400 mt-0.5 font-bold">{total ? Math.round((cosmeticsCount / total) * 100) : 0}% share</p>
                  </div>
                  <div className="bg-white/5 p-4 rounded-xl text-center border border-white/5">
                    <p className="text-xs font-bold text-slate-400">E-commerce Retail</p>
                    <p className="text-2xl font-black text-white mt-1">{retailCount}</p>
                    <p className="text-[9px] text-emerald-400 mt-0.5 font-bold">{total ? Math.round((retailCount / total) * 100) : 0}% share</p>
                  </div>
                  <div className="bg-white/5 p-4 rounded-xl text-center border border-white/5">
                    <p className="text-xs font-bold text-slate-400">Other Industries</p>
                    <p className="text-2xl font-black text-white mt-1">{otherIndustryCount}</p>
                    <p className="text-[9px] text-slate-400 mt-0.5 font-bold">{total ? Math.round((otherIndustryCount / total) * 100) : 0}% share</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Slide Indicator Dots */}
        <div className="flex justify-center gap-2 pt-5">
          <button onClick={() => setActiveSlide(0)} className={`h-1.5 rounded-full transition-all duration-300 ${activeSlide === 0 ? 'bg-nile-brightgreen w-6' : 'bg-white/30 w-1.5'}`} aria-label="Slide 1 indicator" />
          <button onClick={() => setActiveSlide(1)} className={`h-1.5 rounded-full transition-all duration-300 ${activeSlide === 1 ? 'bg-nile-brightgreen w-6' : 'bg-white/30 w-1.5'}`} aria-label="Slide 2 indicator" />
          <button onClick={() => setActiveSlide(2)} className={`h-1.5 rounded-full transition-all duration-300 ${activeSlide === 2 ? 'bg-nile-brightgreen w-6' : 'bg-white/30 w-1.5'}`} aria-label="Slide 3 indicator" />
        </div>
      </div>

      {/* Advanced Filters & Search Panel */}
      <div className="bg-white border border-nile-border rounded-[32px] p-6 shadow-sm space-y-6">
        <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between pb-4 border-b border-slate-100">
          
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-nile-softmint text-nile-darkgreen grid place-items-center">
              <SlidersHorizontal size={16} />
            </span>
            <div>
              <h3 className="text-sm font-bold text-nile-dark">Filters & Parameters</h3>
              <p className="text-xs text-nile-muted">Sift through registrations, countries, and review statuses</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Sort Select */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-nile-muted uppercase tracking-wider shrink-0">Sort By</span>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none border border-nile-border rounded-xl pl-3 pr-8 py-2 bg-slate-50 text-xs font-semibold text-nile-dark focus:outline-none focus:ring-2 focus:ring-nile-brightgreen/30 focus:border-nile-darkgreen cursor-pointer"
                >
                  <option value="latest_signup">Latest Signups (Newest)</option>
                  <option value="oldest_signup">Oldest Signups</option>
                  <option value="latest_updated">Latest Updates</option>
                  <option value="oldest_updated">Oldest Updates</option>
                  <option value="merchant_name_asc">Merchant Name (A-Z)</option>
                  <option value="business_name_asc">Business Name (A-Z)</option>
                </select>
                <span className="absolute inset-y-0 right-2 flex items-center pointer-events-none text-slate-400">
                  <ChevronDown size={14} />
                </span>
              </div>
            </div>

            {/* Clear Filters Button */}
            {(statusFilter || typeFilter || countryFilter || industryFilter || startDate || endDate || searchQuery) && (
              <button
                onClick={() => {
                  setStatusFilter('');
                  setTypeFilter('');
                  setCountryFilter('');
                  setIndustryFilter('');
                  setStartDate('');
                  setEndDate('');
                  setSearchQuery('');
                  setSortBy('latest_signup');
                }}
                className="text-xs text-red-600 font-bold hover:underline flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-50 hover:bg-red-100 transition duration-200"
              >
                <RefreshCw size={12} className="animate-spin-once" /> Reset filters
              </button>
            )}
          </div>
        </div>

        {/* Search bar & Filters Grid */}
        <div className="space-y-4">
          {/* Search box */}
          <div className="relative w-full">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
              <Search size={18} />
            </span>
            <input
              type="text"
              placeholder="Search by business name, merchant name, email, or domain..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full rounded-2xl border border-nile-border pl-11 pr-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-nile-brightgreen/30 focus:border-nile-darkgreen bg-white text-nile-dark transition-all duration-200"
            />
          </div>

          {/* Core filters */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 text-xs">
            <div>
              <label className="block text-[10px] font-bold text-nile-muted uppercase tracking-wider mb-1.5">Status</label>
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="block w-full appearance-none border border-nile-border rounded-xl p-2.5 bg-slate-50 text-nile-dark font-semibold focus:outline-none focus:ring-2 focus:ring-nile-brightgreen/30 focus:border-nile-darkgreen cursor-pointer"
                >
                  <option value="">All Statuses</option>
                  <option value="Draft">Draft</option>
                  <option value="Submitted">Submitted</option>
                  <option value="Under Review">Under Review</option>
                  <option value="More Info Required">More Info Required</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                  <option value="Account Created">Account Created</option>
                  <option value="Payment Activated">Payment Activated</option>
                </select>
                <span className="absolute inset-y-0 right-2 flex items-center pointer-events-none text-slate-400">
                  <ChevronDown size={13} />
                </span>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-nile-muted uppercase tracking-wider mb-1.5">Account Type</label>
              <div className="relative">
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="block w-full appearance-none border border-nile-border rounded-xl p-2.5 bg-slate-50 text-nile-dark font-semibold focus:outline-none focus:ring-2 focus:ring-nile-brightgreen/30 focus:border-nile-darkgreen cursor-pointer"
                >
                  <option value="">All Types</option>
                  <option value="individual">Individual / SME</option>
                  <option value="corporate">Registered Corporate</option>
                </select>
                <span className="absolute inset-y-0 right-2 flex items-center pointer-events-none text-slate-400">
                  <ChevronDown size={13} />
                </span>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-nile-muted uppercase tracking-wider mb-1.5">Country</label>
              <div className="relative">
                <select
                  value={countryFilter}
                  onChange={(e) => setCountryFilter(e.target.value)}
                  className="block w-full appearance-none border border-nile-border rounded-xl p-2.5 bg-slate-50 text-nile-dark font-semibold focus:outline-none focus:ring-2 focus:ring-nile-brightgreen/30 focus:border-nile-darkgreen cursor-pointer"
                >
                  <option value="">All Countries</option>
                  <option value="Nigeria">Nigeria</option>
                  <option value="Ghana">Ghana</option>
                  <option value="Kenya">Kenya</option>
                </select>
                <span className="absolute inset-y-0 right-2 flex items-center pointer-events-none text-slate-400">
                  <ChevronDown size={13} />
                </span>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-nile-muted uppercase tracking-wider mb-1.5">Industry</label>
              <div className="relative">
                <select
                  value={industryFilter}
                  onChange={(e) => setIndustryFilter(e.target.value)}
                  className="block w-full appearance-none border border-nile-border rounded-xl p-2.5 bg-slate-50 text-nile-dark font-semibold focus:outline-none focus:ring-2 focus:ring-nile-brightgreen/30 focus:border-nile-darkgreen cursor-pointer"
                >
                  <option value="">All Industries</option>
                  <option value="Fashion & Apparel">Fashion & Apparel</option>
                  <option value="Cosmetics & Beauty">Cosmetics & Beauty</option>
                  <option value="E-commerce Retail">E-commerce Retail</option>
                  <option value="Betting / Lottery">Betting / Lottery</option>
                  <option value="Lending / Loans">Lending / Loans</option>
                  <option value="Fintech / Wallet / Remittance">Fintech / Wallet</option>
                </select>
                <span className="absolute inset-y-0 right-2 flex items-center pointer-events-none text-slate-400">
                  <ChevronDown size={13} />
                </span>
              </div>
            </div>

            {/* Date range filters */}
            <div>
              <label className="block text-[10px] font-bold text-nile-muted uppercase tracking-wider mb-1.5">Start Date</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-2.5 flex items-center text-slate-400 pointer-events-none">
                  <Calendar size={12} />
                </span>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="block w-full border border-nile-border rounded-xl pl-8 pr-2 py-2 bg-slate-50 text-nile-dark font-semibold focus:outline-none focus:ring-2 focus:ring-nile-brightgreen/30 focus:border-nile-darkgreen cursor-pointer"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-nile-muted uppercase tracking-wider mb-1.5">End Date</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-2.5 flex items-center text-slate-400 pointer-events-none">
                  <Calendar size={12} />
                </span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="block w-full border border-nile-border rounded-xl pl-8 pr-2 py-2 bg-slate-50 text-nile-dark font-semibold focus:outline-none focus:ring-2 focus:ring-nile-brightgreen/30 focus:border-nile-darkgreen cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Applications Queue Table Card */}
      <div className="bg-white border border-nile-border rounded-[32px] shadow-sm overflow-hidden animate-fade-in-up">
        <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div>
            <h3 className="text-base font-black text-nile-darkgreen">Onboarding Queue</h3>
            <p className="text-xs text-nile-muted">Displaying {sortedApps.length} of {total} merchant profiles sorted by sign-up date</p>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-nile-border align-middle">
            <thead className="bg-slate-50/70 text-left text-[10px] font-extrabold text-nile-muted uppercase tracking-wider">
              <tr>
                <th className="px-8 py-5">Merchant & Business</th>
                <th className="px-8 py-5">Website</th>
                <th className="px-8 py-5">Account Type</th>
                <th className="px-8 py-5">Country</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5">Timeline</th>
                <th className="px-8 py-5">Reviewer</th>
                <th className="px-8 py-5 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-nile-border text-sm">
              {sortedApps.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-8 py-24 text-center text-nile-muted italic bg-slate-50/10">
                    <div className="max-w-xs mx-auto space-y-3">
                      <AlertCircle size={36} className="text-slate-300 mx-auto" />
                      <p className="text-sm font-semibold text-nile-dark">No records in queue</p>
                      <p className="text-xs text-slate-400">Modify your search query, date boundaries, or filter criteria to find applications.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                sortedApps.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50/50 transition duration-150 group">
                    <td className="px-8 py-5.5 whitespace-nowrap">
                      <div className="font-extrabold text-sm text-nile-dark group-hover:text-nile-darkgreen transition duration-150">{app.businessName || 'Pending Onboarding'}</div>
                      <div className="text-[11px] text-nile-muted font-medium mt-0.5">{app.merchantName || 'New Merchant'} ({app.kycData?.email || 'No email'})</div>
                      <div className="inline-flex items-center px-1.5 py-0.5 mt-1.5 rounded bg-slate-100/80 font-mono text-[9px] text-slate-500 font-semibold border border-slate-200/50">ID: {app.id}</div>
                    </td>
                    <td className="px-8 py-5.5 whitespace-nowrap">
                      {app.website === 'pending.nile.ng' ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded bg-slate-100 text-slate-400 font-bold text-[10px] uppercase border border-slate-200/30">Pending</span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-xl bg-nile-softmint/65 border border-nile-border/40 text-nile-darkgreen text-xs font-bold">{app.website}</span>
                      )}
                    </td>
                    <td className="px-8 py-5.5 whitespace-nowrap text-xs font-medium">
                      <span className={`px-3 py-1 rounded-xl text-[11px] font-black border ${
                        app.accountType === 'corporate' 
                          ? 'bg-blue-50 text-blue-700 border-blue-100' 
                          : app.accountType === 'individual' 
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                          : 'bg-slate-100 text-slate-500'
                      }`}>
                        {app.accountType === 'corporate' ? 'Corporate' : app.accountType === 'individual' ? 'Individual / SME' : 'Not Chosen'}
                      </span>
                    </td>
                    <td className="px-8 py-5.5 whitespace-nowrap text-xs text-nile-dark font-extrabold">
                      {app.country}
                    </td>
                    <td className="px-8 py-5.5 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold border shadow-sm ${
                        app.status === 'Payment Activated' ? 'bg-green-50 text-green-700 border-green-200' :
                        app.status === 'Approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                        app.status === 'Submitted' ? 'bg-blue-50 text-blue-700 border-blue-200 animate-pulse' :
                        app.status === 'Under Review' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                        app.status === 'More Info Required' ? 'bg-amber-50 text-amber-900 border border-amber-200 animate-pulse' :
                        app.status === 'Rejected' ? 'bg-red-50 text-red-700 border-red-200' :
                        'bg-slate-50 text-slate-600 border-slate-200'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          app.status === 'Payment Activated' || app.status === 'Approved' ? 'bg-green-500 shadow-[0_0_6px_rgba(34,197,94,0.4)]' :
                          app.status === 'Submitted' || app.status === 'Under Review' ? 'bg-blue-500 animate-pulse' :
                          app.status === 'More Info Required' ? 'bg-amber-500' :
                          app.status === 'Rejected' ? 'bg-red-500' : 'bg-slate-400'
                        }`} />
                        {app.status}
                      </span>
                    </td>
                    <td className="px-8 py-5.5 whitespace-nowrap text-xs font-medium">
                      <div className="text-nile-dark font-black">{getSignupDateString(app)}</div>
                      <div className="text-[10px] text-nile-muted/90 font-medium mt-1">Updated: {getLastUpdatedString(app)}</div>
                    </td>
                    <td className="px-8 py-5.5 whitespace-nowrap text-xs text-nile-dark font-bold">
                      {app.assignedReviewer ? (
                        <span className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-nile-darkgreen text-white font-black text-[9px] flex items-center justify-center shadow-sm shrink-0">
                            {app.assignedReviewer.split(' ').map(n => n[0]).join('')}
                          </span>
                          {app.assignedReviewer}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-slate-50 text-slate-400 border border-slate-200/40">Unassigned</span>
                      )}
                    </td>
                    <td className="px-8 py-5.5 whitespace-nowrap text-center">
                      <button
                        onClick={() => handleReviewClick(app)}
                        className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-nile-softmint text-nile-darkgreen hover:bg-[#c9ebd6] text-xs font-black rounded-xl transition-all duration-200 shadow-sm hover:shadow hover:-translate-y-0.5 btn-stripe-style"
                      >
                        <Eye size={13} />
                        <span>Audit KYC</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
