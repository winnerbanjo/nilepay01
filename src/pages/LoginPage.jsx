import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useNilePay } from '../context/NilePayContext';
import { Input } from '../components/FormComponents';
import { ShieldCheck, Mail, Lock, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const { login } = useNilePay();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [roleSelection, setRoleSelection] = useState('merchant'); // 'merchant' or 'admin'
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    const tempErrors = {};
    if (!email) {
      tempErrors.email = 'Email address or phone number is required.';
    } else if (!/\S+@\S+\.\S+/.test(email) && isNaN(email)) {
      tempErrors.email = 'Please enter a valid email or phone number.';
    }
    if (!password) {
      tempErrors.password = 'Password is required.';
    } else if (password.length < 6) {
      tempErrors.password = 'Password must be at least 6 characters.';
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);

    // Mock network lag
    setTimeout(() => {
      setIsLoading(false);
      const user = login(email, password, roleSelection);
      if (user.role === 'admin') {
        navigate('/admin/compliance');
      } else {
        navigate('/dashboard');
      }
    }, 1000);
  };

  return (
    <div className="min-h-[80svh] flex items-center justify-center px-4 py-12 bg-nile-bg">
      <div className="w-full max-w-md bg-white rounded-3xl border border-nile-border shadow-lg overflow-hidden p-8 space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-block text-2xl font-bold tracking-tight text-nile-darkgreen">
            nile<span className="text-nile-brightgreen">pay</span>
          </Link>
          <h2 className="text-xl font-bold text-nile-dark">Log in to your account</h2>
          <p className="text-sm text-nile-muted">
            Manage your Nile website payment activation and KYC status.
          </p>
        </div>

        {/* Role Toggle Tab */}
        <div className="flex border-b border-nile-border pb-1">
          <button
            type="button"
            onClick={() => setRoleSelection('merchant')}
            className={`flex-1 text-center pb-2.5 text-sm font-bold border-b-2 transition ${
              roleSelection === 'merchant'
                ? 'border-nile-darkgreen text-nile-darkgreen'
                : 'border-transparent text-nile-muted hover:text-nile-dark'
            }`}
          >
            Merchant portal
          </button>
          <button
            type="button"
            onClick={() => setRoleSelection('admin')}
            className={`flex-1 text-center pb-2.5 text-sm font-bold border-b-2 transition ${
              roleSelection === 'admin'
                ? 'border-nile-darkgreen text-nile-darkgreen'
                : 'border-transparent text-nile-muted hover:text-nile-dark'
            }`}
          >
            Compliance portal
          </button>
        </div>

        {/* Info Banner for easy review */}
        <div className="bg-nile-softmint/40 border border-nile-border p-3.5 rounded-xl text-xs text-nile-darkgreen space-y-1">
          <p className="font-semibold flex items-center gap-1"><ShieldCheck size={13} className="text-nile-darkgreen" /> Reviewers Note:</p>
          {roleSelection === 'merchant' ? (
            <p>Use <strong className="underline">tosi@houseoftosi.ng</strong> to inspect the "Under Review" merchant dashboard.</p>
          ) : (
            <p>Use <strong className="underline">admin@nile.ng</strong> to enter the Compliance Admin dashboard.</p>
          )}
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email or Phone number"
            type="text"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={roleSelection === 'admin' ? 'admin@nile.ng' : 'you@example.com'}
            required
            error={errors.email}
          />

          <div className="space-y-1">
            <Input
              label="Password"
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              error={errors.password}
            />
            <div className="text-right">
              <a href="#" className="text-xs font-bold text-nile-darkgreen hover:underline">
                Forgot password?
              </a>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-4 bg-nile-darkgreen hover:bg-[#1f5643] text-white text-sm font-bold rounded-xl transition shadow-md flex justify-center items-center gap-2 glow-btn"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Logging in...</span>
              </>
            ) : (
              <>
                <span>Log in</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        {/* Register footer link */}
        <div className="text-center text-xs text-nile-muted border-t border-nile-border pt-4">
          Don't have a Nile Pay account yet?{' '}
          <Link to="/signup" className="text-nile-darkgreen font-bold hover:underline">
            Sign up here
          </Link>
        </div>
      </div>
    </div>
  );
}
