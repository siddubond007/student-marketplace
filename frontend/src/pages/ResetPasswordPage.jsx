import React, { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { AlertTriangle, CheckCircle2, Eye, EyeOff, KeyRound, LockKeyhole } from 'lucide-react';
import API from '../services/api';

const RULES = [
  { key: 'length', label: 'At least 8 characters', test: value => value.length >= 8 },
  { key: 'upper', label: 'One uppercase letter', test: value => /[A-Z]/.test(value) },
  { key: 'lower', label: 'One lowercase letter', test: value => /[a-z]/.test(value) },
  { key: 'number', label: 'One number', test: value => /[0-9]/.test(value) },
  { key: 'special', label: 'One special character', test: value => /[!@#$%^&*(),.?":{}|<>]/.test(value) }
];

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [show, setShow] = useState({ next: false, confirm: false });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const rules = useMemo(() => Object.fromEntries(
    RULES.map(rule => [rule.key, rule.test(newPassword)])
  ), [newPassword]);

  const allRulesPassed = Object.values(rules).every(Boolean);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus({ type: '', message: '' });

    if (!token) {
      setStatus({ type: 'error', message: 'This reset link is missing its token. Please request a new one.' });
      return;
    }

    if (!allRulesPassed) {
      setStatus({ type: 'error', message: 'Please satisfy every password requirement.' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setStatus({ type: 'error', message: 'New password and confirmation do not match.' });
      return;
    }

    setLoading(true);
    try {
      const res = await API.post('/auth/reset-password', {
        token,
        newPassword,
        confirmPassword
      });
      setStatus({ type: 'success', message: res.data?.message || 'Password reset successfully.' });
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      setStatus({
        type: 'error',
        message: error.response?.data?.error || 'Unable to reset your password.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-8">
      <div className="neon-border-box max-w-xl w-full p-8 shadow-2xl">
        <div className="w-12 h-12 rounded-2xl bg-indigo-500/15 border border-indigo-500/25 flex items-center justify-center">
          <LockKeyhole className="w-6 h-6 text-indigo-300" />
        </div>
        <h1 className="text-3xl font-black text-white mt-5">Create a new password</h1>
        <p className="text-sm text-slate-400 mt-2 leading-relaxed">
          Choose a password that meets every security requirement.
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

        <form onSubmit={handleSubmit} className="space-y-4 mt-6">
          {[
            { key: 'new', value: newPassword, setter: setNewPassword, label: 'New password' },
            { key: 'confirm', value: confirmPassword, setter: setConfirmPassword, label: 'Confirm new password' }
          ].map(field => (
            <div key={field.key}>
              <label className="block text-[11px] uppercase tracking-wider font-black text-slate-400 mb-1.5">{field.label}</label>
              <div className="relative">
                <input
                  required
                  type={show[field.key] ? 'text' : 'password'}
                  value={field.value}
                  onChange={event => field.setter(event.target.value)}
                  className="w-full px-4 py-3.5 pr-12 bg-slate-950 border border-slate-800 rounded-2xl text-sm text-white outline-none focus:border-indigo-500"
                />
                <button
                  type="button"
                  onClick={() => setShow(prev => ({ ...prev, [field.key]: !prev[field.key] }))}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                  aria-label={show[field.key] ? 'Hide password' : 'Show password'}
                >
                  {show[field.key] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          ))}

          <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
            <p className="text-[10px] uppercase tracking-widest font-black text-slate-500 mb-3">Password requirements</p>
            <div className="grid sm:grid-cols-2 gap-2">
              {RULES.map(rule => (
                <div key={rule.key} className={`text-xs flex items-center gap-2 ${rules[rule.key] ? 'text-emerald-300' : 'text-slate-500'}`}>
                  <span className={`w-4 h-4 rounded-full border flex items-center justify-center ${rules[rule.key] ? 'border-emerald-400 bg-emerald-400/10' : 'border-slate-700'}`}>
                    {rules[rule.key] ? '✓' : ''}
                  </span>
                  {rule.label}
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-black uppercase tracking-wider transition"
          >
            {loading ? 'Resetting password...' : 'Reset password'}
          </button>
        </form>

        <p className="text-xs text-slate-500 text-center mt-5">
          Already remember your password? <Link to="/login" className="text-indigo-400 hover:underline">Return to sign in</Link>
        </p>
      </div>
    </div>
  );
}
