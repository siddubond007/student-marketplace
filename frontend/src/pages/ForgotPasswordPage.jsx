import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, KeyRound, Mail, AlertTriangle } from 'lucide-react';
import API from '../services/api';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState({ type: '', message: '', devResetLink: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus({ type: '', message: '', devResetLink: '' });
    setLoading(true);

    try {
      const res = await API.post('/auth/forgot-password', { email });
      setStatus({
        type: 'success',
        message: res.data?.message || 'If an account exists for that email, a password reset link has been prepared.',
        devResetLink: res.data?.devResetLink || ''
      });
    } catch (error) {
      setStatus({
        type: 'error',
        message: error.response?.data?.error || 'Unable to process the password reset request.',
        devResetLink: ''
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-8">
      <div className="neon-border-box max-w-md w-full p-8 shadow-2xl">
        <Link to="/login" className="inline-flex items-center gap-2 text-xs font-black text-slate-400 hover:text-white mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to sign in
        </Link>

        <div className="w-12 h-12 rounded-2xl bg-indigo-500/15 border border-indigo-500/25 flex items-center justify-center">
          <KeyRound className="w-6 h-6 text-indigo-300" />
        </div>

        <h1 className="text-3xl font-black text-white mt-5">Forgot password?</h1>
        <p className="text-sm text-slate-400 mt-2 leading-relaxed">
          Enter the email associated with your SkillLaunch account. We'll prepare a secure password reset link.
        </p>

        {status.message && (
          <div className={`mt-5 p-4 rounded-2xl border flex items-start gap-3 ${status.type === 'success'
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
            : 'bg-red-500/10 border-red-500/30 text-red-300'}`}>
            {status.type === 'success'
              ? <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
              : <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />}
            <span className="text-xs font-bold leading-relaxed">{status.message}</span>
          </div>
        )}

        {status.devResetLink && (
          <div className="mt-4 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30">
            <p className="text-[10px] uppercase tracking-widest font-black text-amber-300">Local development reset link</p>
            <Link to={status.devResetLink.replace(window.location.origin, '')} className="block mt-2 text-xs text-amber-200 break-all hover:underline">
              Open reset link
            </Link>
            <p className="text-[10px] text-amber-300/70 mt-2">This development-only link is not returned in production.</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 mt-6">
          <div>
            <label className="block text-[11px] uppercase tracking-wider font-black text-slate-400 mb-1.5">Email address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                required
                type="email"
                value={email}
                onChange={event => setEmail(event.target.value)}
                placeholder="you@example.com"
                className="w-full pl-11 pr-4 py-3.5 bg-slate-950 border border-slate-800 rounded-2xl text-sm text-white outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-black uppercase tracking-wider transition"
          >
            {loading ? 'Preparing reset link...' : 'Send reset link'}
          </button>
        </form>
      </div>
    </div>
  );
}
