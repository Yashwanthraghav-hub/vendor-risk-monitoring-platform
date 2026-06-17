import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, KeyRound, Mail, AlertCircle } from 'lucide-react';

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    
    const res = await login(email, password);
    if (!res.success) {
      setError(res.error);
      setSubmitting(false);
    }
  };

  // Quick fill tester credentials
  const fillCredentials = (type) => {
    setPassword('password123');
    if (type === 'admin') {
      setEmail('admin@vendorrisk.com');
    } else if (type === 'manager') {
      setEmail('procurement@vendorrisk.com');
    } else if (type === 'analyst') {
      setEmail('analyst@vendorrisk.com');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white p-6 font-sans relative overflow-hidden">
      
      {/* Decorative background radial glows */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl -translate-x-1/3 -translate-y-1/3 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3 pointer-events-none" />

      <div className="w-full max-w-md bg-slate-950 border border-white/5 rounded-3xl p-8 shadow-2xl relative z-10 space-y-6">
        
        {/* Header Logo */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex p-3 bg-brand-500/10 border border-brand-500/20 rounded-2xl mb-1 hover:scale-105 transition-transform">
            <Shield className="h-8 w-8 text-brand-400" />
          </Link>
          <h2 className="text-2xl font-extrabold font-sans tracking-tight">Enterprise Console</h2>
          <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Vendor Risk Monitoring Platform</p>
        </div>

        {error && (
          <div className="p-3.5 bg-red-500/15 border border-red-500/20 rounded-xl flex items-center space-x-2.5 text-xs text-red-300 font-semibold">
            <AlertCircle className="h-4.5 w-4.5 text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Work Email</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all font-semibold"
                placeholder="name@company.com"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Password</label>
              <Link to="/forgot-password" className="text-[10px] text-brand-400 hover:text-brand-300 font-bold transition-all">Forgot Password?</Link>
            </div>
            <div className="relative">
              <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all font-semibold"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-brand-500 hover:bg-brand-600 disabled:opacity-50 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-brand-500/20 hover:scale-102 active:scale-98 transition-all text-sm uppercase tracking-wider"
          >
            {submitting ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        {/* Quick Credentials Seeder for Demo */}
        <div className="border-t border-white/5 pt-5 space-y-3">
          <p className="text-[10px] font-bold text-center text-slate-500 uppercase tracking-widest">Quick Sandbox Login</p>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => fillCredentials('admin')}
              className="px-1.5 py-2 text-[9px] font-bold rounded-lg border border-white/5 bg-white/5 hover:bg-white/10 transition-all uppercase tracking-wider text-slate-300"
            >
              Admin
            </button>
            <button
              onClick={() => fillCredentials('manager')}
              className="px-1.5 py-2 text-[9px] font-bold rounded-lg border border-white/5 bg-white/5 hover:bg-white/10 transition-all uppercase tracking-wider text-slate-300"
            >
              Manager
            </button>
            <button
              onClick={() => fillCredentials('analyst')}
              className="px-1.5 py-2 text-[9px] font-bold rounded-lg border border-white/5 bg-white/5 hover:bg-white/10 transition-all uppercase tracking-wider text-slate-300"
            >
              Analyst
            </button>
          </div>
        </div>

        <div className="text-center pt-2">
          <p className="text-xs text-slate-400">
            Don't have access?{' '}
            <Link to="/register" className="text-brand-400 hover:text-brand-300 font-bold transition-all">Request Registry</Link>
          </p>
        </div>

      </div>
    </div>
  );
}

export default Login;
