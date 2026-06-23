import React, { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight, LockKeyhole, ShieldCheck } from 'lucide-react';
import { useNilePay } from '../context/NilePayContext';
import { Input } from '../components/FormComponents';

export default function ComplianceLoginPage() {
  const { currentUser, login } = useNilePay();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (currentUser?.role === 'admin') {
    return <Navigate to="/admin/compliance" replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!email.trim() || password.length < 6) {
      setError('Enter your compliance email and password.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passcode: password })
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        setError(data.error || 'Invalid compliance passcode.');
        setIsLoading(false);
        return;
      }

      const user = login(email.trim(), password, 'admin');
      setIsLoading(false);

      if (user?.role !== 'admin') {
        setError('This account does not have compliance access.');
        return;
      }

      navigate(location.state?.from || '/admin/compliance', { replace: true });
    } catch (err) {
      setError('Connection to compliance server failed.');
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 grid place-items-center">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center text-white">
          <span className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-nile-brightgreen text-nile-darkgreen">
            <ShieldCheck size={24} />
          </span>
          <h1 className="text-2xl font-black">Compliance office</h1>
          <p className="mt-1 text-sm text-slate-400">Restricted access for authorised Nile Pay reviewers.</p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white p-7 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Work email"
              type="email"
              name="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="name@nile.ng"
              required
            />
            <Input
              label="Password"
              type="password"
              name="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
              required
            />

            {error && (
              <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-xs font-semibold text-red-700">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-xl bg-nile-darkgreen px-4 py-3.5 text-sm font-bold text-white transition hover:bg-[#1f5643] disabled:cursor-wait disabled:opacity-70 flex items-center justify-center gap-2"
            >
              <LockKeyhole size={15} />
              {isLoading ? 'Checking access…' : 'Enter compliance workspace'}
              {!isLoading && <ArrowRight size={15} />}
            </button>
          </form>
        </div>

        <p className="mt-5 text-center text-xs text-slate-500">This portal is not linked from the public Nile Pay website.</p>
      </div>
    </main>
  );
}
