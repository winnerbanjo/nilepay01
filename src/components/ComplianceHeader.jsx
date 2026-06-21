import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, ShieldCheck } from 'lucide-react';
import { useNilePay } from '../context/NilePayContext';

export default function ComplianceHeader() {
  const { currentUser, logout } = useNilePay();
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate('/internal/compliance/login', { replace: true });
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="max-w-7xl mx-auto h-16 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <Link to="/admin/compliance" className="flex items-center gap-2 text-nile-darkgreen">
          <span className="w-9 h-9 rounded-xl bg-nile-darkgreen text-white grid place-items-center"><ShieldCheck size={18} /></span>
          <span><span className="block text-sm font-black leading-tight">Nile Pay</span><span className="block text-[10px] font-bold uppercase tracking-wider text-nile-muted">Compliance office</span></span>
        </Link>
        <div className="flex items-center gap-3">
          <div className="hidden sm:block text-right"><p className="text-xs font-bold text-nile-dark">{currentUser?.name || 'Compliance Officer'}</p><p className="text-[10px] text-nile-muted">Internal access</p></div>
          <button type="button" onClick={handleLogout} className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"><LogOut size={14} /> Sign out</button>
        </div>
      </div>
    </header>
  );
}
