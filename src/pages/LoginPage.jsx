import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useNilePay } from '../context/NilePayContext';
import { Input } from '../components/FormComponents';
import { ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const { login } = useNilePay();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
      login(email, password, 'merchant');
      navigate('/dashboard');
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

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email or Phone number"
            type="text"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
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
