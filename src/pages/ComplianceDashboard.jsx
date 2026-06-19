import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNilePay } from '../context/NilePayContext';
import { Search, Filter, ShieldCheck, Eye, RefreshCw, Layers } from 'lucide-react';

export default function ComplianceDashboard() {
  const { applications, startReview, backendStatus } = useNilePay();
  const navigate = useNavigate();

  // Search and filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [countryFilter, setCountryFilter] = useState('');
  const [industryFilter, setIndustryFilter] = useState('');

  // Compute stat boxes
  const total = applications.length;
  const pending = applications.filter(a => a.status === 'Submitted' || a.status === 'Under Review').length;
  const moreInfo = applications.filter(a => a.status === 'More Info Required').length;
  const approved = applications.filter(a => a.status === 'Approved' || a.status === 'Account Created').length;
  const rejected = applications.filter(a => a.status === 'Rejected').length;
  const activated = applications.filter(a => a.status === 'Payment Activated').length;

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
      app.website?.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesStatus = statusFilter ? app.status === statusFilter : true;
    const matchesType = typeFilter ? app.accountType === typeFilter : true;
    const matchesCountry = countryFilter ? app.country === countryFilter : true;
    const matchesIndustry = industryFilter ? app.industry === industryFilter : true;

    return matchesSearch && matchesStatus && matchesType && matchesCountry && matchesIndustry;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 text-left">
      
      {/* Page Header */}
      <div className="flex justify-between items-center border-b border-nile-border pb-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-nile-darkgreen tracking-tight flex items-center gap-2">
            <ShieldCheck size={28} className="text-nile-darkgreen" />
            <span>Nile Pay Compliance Queue</span>
          </h2>
          <p className="text-sm text-nile-muted">
            Internal auditing console for verifying merchant KYC credentials and activating checkout gateways.
          </p>
        </div>
        <span className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${
          backendStatus === 'connected'
            ? 'bg-green-50 text-green-700 border-green-200'
            : backendStatus === 'connecting'
            ? 'bg-amber-50 text-amber-800 border-amber-200'
            : 'bg-red-50 text-red-700 border-red-200'
        }`}>
          <span className={`w-2 h-2 rounded-full ${backendStatus === 'connected' ? 'bg-green-500' : backendStatus === 'connecting' ? 'bg-amber-500' : 'bg-red-500'}`} />
          Backend {backendStatus}
        </span>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Stat Card 1 */}
        <div className="bg-white border border-nile-border p-4.5 rounded-2xl shadow-sm text-left">
          <p className="text-[10px] font-bold uppercase tracking-wider text-nile-muted">Total Profiles</p>
          <p className="text-2xl font-black text-nile-darkgreen mt-1">{total}</p>
        </div>
        {/* Stat Card 2 */}
        <div className="bg-white border border-nile-border p-4.5 rounded-2xl shadow-sm text-left">
          <p className="text-[10px] font-bold uppercase tracking-wider text-nile-muted">Pending Review</p>
          <p className="text-2xl font-black text-blue-700 mt-1">{pending}</p>
        </div>
        {/* Stat Card 3 */}
        <div className="bg-white border border-nile-border p-4.5 rounded-2xl shadow-sm text-left">
          <p className="text-[10px] font-bold uppercase tracking-wider text-nile-muted">More Info Requested</p>
          <p className="text-2xl font-black text-amber-700 mt-1">{moreInfo}</p>
        </div>
        {/* Stat Card 4 */}
        <div className="bg-white border border-nile-border p-4.5 rounded-2xl shadow-sm text-left">
          <p className="text-[10px] font-bold uppercase tracking-wider text-nile-muted">Approved (Pending setup)</p>
          <p className="text-2xl font-black text-emerald-700 mt-1">{approved}</p>
        </div>
        {/* Stat Card 5 */}
        <div className="bg-white border border-nile-border p-4.5 rounded-2xl shadow-sm text-left">
          <p className="text-[10px] font-bold uppercase tracking-wider text-nile-muted">Rejected</p>
          <p className="text-2xl font-black text-red-700 mt-1">{rejected}</p>
        </div>
        {/* Stat Card 6 */}
        <div className="bg-white border border-nile-border p-4.5 rounded-2xl shadow-sm text-left">
          <p className="text-[10px] font-bold uppercase tracking-wider text-nile-muted">Payment Activated</p>
          <p className="text-2xl font-black text-nile-darkgreen mt-1">{activated}</p>
        </div>
      </div>

      {/* Filters & Search Panel */}
      <div className="bg-white border border-nile-border rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          
          {/* Search box */}
          <div className="relative w-full md:max-w-md">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
              <Search size={18} />
            </span>
            <input
              type="text"
              placeholder="Search by merchant, business name, or domain..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full rounded-xl border border-nile-border pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-nile-softmint focus:border-nile-darkgreen bg-white text-nile-dark"
            />
          </div>

          {/* Quick Clear Filter */}
          {(statusFilter || typeFilter || countryFilter || industryFilter || searchQuery) && (
            <button
              onClick={() => {
                setStatusFilter('');
                setTypeFilter('');
                setCountryFilter('');
                setIndustryFilter('');
                setSearchQuery('');
              }}
              className="text-xs text-red-600 font-bold hover:underline flex items-center gap-1 self-end md:self-center"
            >
              <RefreshCw size={12} /> Clear all filters
            </button>
          )}

        </div>

        {/* Filter selects */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div>
            <label className="block text-[10px] font-bold text-nile-muted uppercase tracking-wider mb-1">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="block w-full border border-nile-border rounded-lg p-2 bg-slate-50 text-nile-dark font-medium focus:outline-none focus:ring-1 focus:ring-nile-darkgreen"
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
          </div>

          <div>
            <label className="block text-[10px] font-bold text-nile-muted uppercase tracking-wider mb-1">Account Type</label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="block w-full border border-nile-border rounded-lg p-2 bg-slate-50 text-nile-dark font-medium focus:outline-none focus:ring-1 focus:ring-nile-darkgreen"
            >
              <option value="">All Types</option>
              <option value="individual">Individual / SME</option>
              <option value="corporate">Registered Business</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-nile-muted uppercase tracking-wider mb-1">Country</label>
            <select
              value={countryFilter}
              onChange={(e) => setCountryFilter(e.target.value)}
              className="block w-full border border-nile-border rounded-lg p-2 bg-slate-50 text-nile-dark font-medium focus:outline-none focus:ring-1 focus:ring-nile-darkgreen"
            >
              <option value="">All Countries</option>
              <option value="Nigeria">Nigeria</option>
              <option value="Ghana">Ghana</option>
              <option value="Kenya">Kenya</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-nile-muted uppercase tracking-wider mb-1">Industry</label>
            <select
              value={industryFilter}
              onChange={(e) => setIndustryFilter(e.target.value)}
              className="block w-full border border-nile-border rounded-lg p-2 bg-slate-50 text-nile-dark font-medium focus:outline-none focus:ring-1 focus:ring-nile-darkgreen"
            >
              <option value="">All Industries</option>
              <option value="Fashion & Apparel">Fashion & Apparel</option>
              <option value="Cosmetics & Beauty">Cosmetics & Beauty</option>
              <option value="E-commerce Retail">E-commerce Retail</option>
              <option value="Betting / Lottery">Betting / Lottery</option>
              <option value="Lending / Loans">Lending / Loans</option>
              <option value="Fintech / Wallet / Remittance">Fintech / Wallet</option>
            </select>
          </div>
        </div>

      </div>

      {/* Applications Table Card */}
      <div className="bg-white border border-nile-border rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-nile-border">
            <thead className="bg-slate-50 text-left text-xs font-bold text-nile-muted uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Merchant & Business</th>
                <th className="px-6 py-4">Website</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Country</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Submitted Date</th>
                <th className="px-6 py-4">Reviewer</th>
                <th className="px-6 py-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-nile-border text-sm">
              {filteredApps.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-12 text-center text-nile-muted italic">
                    No matching merchant applications found in queue.
                  </td>
                </tr>
              ) : (
                filteredApps.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50 transition duration-150">
                    <td className="px-6 py-4">
                      <div className="font-bold text-nile-dark">{app.businessName}</div>
                      <div className="text-xs text-nile-muted font-normal">{app.merchantName} ({app.kycData?.email})</div>
                    </td>
                    <td className="px-6 py-4 font-semibold text-nile-darkgreen text-xs">
                      {app.website}
                    </td>
                    <td className="px-6 py-4 text-xs font-medium">
                      <span className="capitalize">{app.accountType || 'Draft'}</span>
                    </td>
                    <td className="px-6 py-4 text-xs text-nile-dark">
                      {app.country}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold ${
                        app.status === 'Payment Activated' ? 'bg-green-100 text-green-800' :
                        app.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' :
                        app.status === 'Submitted' ? 'bg-blue-100 text-blue-800' :
                        app.status === 'Under Review' ? 'bg-orange-100 text-orange-800' :
                        app.status === 'More Info Required' ? 'bg-amber-100 text-amber-900 border border-amber-200' :
                        app.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-nile-muted">
                      {app.submittedDate}
                    </td>
                    <td className="px-6 py-4 text-xs text-nile-dark">
                      {app.assignedReviewer || <span className="text-slate-400 italic">Unassigned</span>}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleReviewClick(app)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-nile-softmint text-nile-darkgreen hover:bg-[#c9ebd6] text-xs font-bold rounded-lg transition"
                      >
                        <Eye size={12} />
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
