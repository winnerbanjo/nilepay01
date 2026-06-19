import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

  const menuItems = [
    { label: 'Card payments', href: '/#card-payments' },
    { label: 'How it works', href: '/#how-it-works' },
    { label: 'Compliance', href: '/#compliance' },
    { label: 'Help', href: 'mailto:payments@nile.ng', external: true },
  ];

  const linkClass = (href) => {
    const active = isHome && (href === '/#card-payments' || location.hash === href.replace('/', ''));
    return `relative py-2 text-sm font-semibold transition ${
      active ? 'text-white' : 'text-slate-300 hover:text-white'
    } after:absolute after:left-0 after:right-0 after:-bottom-1 after:h-0.5 after:rounded-full after:bg-nile-brightgreen after:transition-transform ${
      active ? 'after:scale-x-100' : 'after:scale-x-0 hover:after:scale-x-100'
    }`;
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-nile-darkgreen border-b border-nile-darkgreen/10 text-white shadow-sm glassmorphism">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-xl font-bold tracking-tight text-white flex items-center">
                nile<span className="text-nile-brightgreen ml-0.5">pay</span>
              </span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden lg:flex items-center space-x-7">
            {menuItems.map((item) => (
              <a key={item.label} href={item.href} className={linkClass(item.href)}>
                {item.label}
              </a>
            ))}
          </div>

          {/* External Login & Local Signup */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <a 
              href="https://app.nile.ng/" 
              className="text-sm font-semibold hover:text-nile-brightgreen transition py-2 px-3 text-slate-300"
            >
              Log in
            </a>
            <Link 
              to="/signup" 
              className="bg-nile-brightgreen text-nile-darkgreen hover:bg-[#b0f782] text-sm font-bold py-2.5 px-4 rounded-xl transition glow-btn btn-stripe-style"
            >
              <span className="sm:hidden">Get paid</span>
              <span className="hidden sm:inline">Set up payments</span>
            </Link>
            <button
              type="button"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((open) => !open)}
              className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-xl border border-white/10 bg-white/5 text-white hover:bg-white/10 transition"
            >
              {menuOpen ? <X size={19} /> : <Menu size={19} />}
            </button>
          </div>

        </div>

        {menuOpen && (
          <div className="lg:hidden pb-4 pt-2 border-t border-white/10 grid grid-cols-2 gap-2">
            {menuItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="text-sm font-semibold text-slate-200 hover:text-white hover:bg-white/10 rounded-xl px-3 py-3 transition"
              >
                {item.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
