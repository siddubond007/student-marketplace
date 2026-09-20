import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, ArrowLeft, CheckCircle2, Eye, EyeOff, LockKeyhole, ShieldCheck } from 'lucide-react';
import API from '../services/api';

const PASSWORD_RULES = [
  { key: 'hasMinLength', label: 'At least 8 characters', test: value => value.length >= 8 },
  { key: 'hasUpper', label: 'One uppercase letter', test: value => /[A-Z]/.test(value) },
  { key: 'hasLower', label: 'One lowercase letter', test: value => /[a-z]/.test(value) },
  { key: 'hasNumber', label: 'One number', test: value => /[0-9]/.test(value) },
  { key: 'hasSpecial', label: 'One special character', test: value => /[!@#$%^&*(),.?":{}|<>]/.test(value) }
];

export default function AccountSecurityPage({ currentUser }) {
  const [form, setForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    next: false,
    confirm: false
  });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const rules = useMemo(
    () => Object.fromEntries(PASSWORD_RULES.map(rule => [rule.key, rule.test(form.newPassword)])),
    [form.newPassword]
  );

  const allRulesPassed = Object.values(rules).every(Boolean);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus({ type: '', message: '' });

    if (!currentUser) {
      setStatus({ type: 'error', message: 'Please sign in before changing your password.' });
      return;
    }

    if (!allRulesPassed) {
      setStatus({ type: 'error', message: 'Please satisfy every password requirement.' });
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      setStatus({ type: 'error', message: 'New password and confirmation do not match.' });
      return;
    }

    setLoading(true);

    try {
      const res = await API.post('/auth/change-password', form);
      setStatus({ type: 'success', message: res.data?.message || 'Password changed successfully.' });
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      setStatus({
        type: 'error',
        message: error.response?.data?.error || 'Unable to change your password.'
      });
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) {
    return (
      <div className="max-w-3xl mx-auto min-h-[60vh] flex items-center justify-center">
        <div className="w-full bg-slate-900/80 border border-slate-800 rounded-3xl p-8 text-center shadow-2xl">
          <LockKeyhole className="w-10 h-10 text-indigo-400 mx-auto mb-4" />
          <h1 className="text-2xl font-black text-white">Account Security</h1>
          <p className="text-sm text-slate-400 mt-2 mb-6">Sign in to manage your account password.</p>
          <Link to="/login" className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 text-white text-sm font-black hover:bg-indigo-500 transition">
            Sign in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-6">
      <Link to="/" className="inline-flex items-center gap-2 text-xs font-black text-slate-400 hover:text-white transition mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to SkillLaunch
      </Link>

      <div className="grid lg:grid-cols-[0.85fr_1.15fr] gap-6">
        <section className="bg-slate-900/80 border border-slate-800 rounded-3xl p-7 shadow-2xl">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/15 border border-indigo-500/25 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6 text-indigo-300" />
          </div>
          <h1 className="text-3xl font-black text-white mt-5">Account Security</h1>
          <p className="text-sm text-slate-400 mt-2 leading-relaxed">
            Update the password used to access your SkillLaunch account.
          </p>

          <div className="mt-8 p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
            <p className="text-[10px] uppercase tracking-widest font-black text-slate-500">Signed in as</p>
            <p className="text-sm font-bold text-white mt-1">{currentUser.fullName || currentUser.email}</p>
            <p className="text-xs text-slate-500 mt-1">{currentUser.email}</p>
          </div>

          <div className="mt-6 text-xs text-slate-500 leading-relaxed">
            Changing your password updates the credential stored for future sign-ins. Your current session remains active.
          </div>
        </section>

        <section className="bg-slate-900/80 border border-slate-800 rounded-3xl p-7 shadow-2xl">
          <div className="flex items-center gap-3 mb-6">
            <LockKeyhole className="w-5 h-5 text-indigo-300" />
            <div>
              <h2 className="text-lg font-black text-white">Change password</h2>
              <p className="text-xs text-slate-500">Verify your current password first.</p>
            </div>
          </div>

          {status.message && (
            <div className={`mb-5 p-4 rounded-2xl border flex items-start gap-3 ${status.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
              : 'bg-red-500/10 border-red-500/30 text-red-300'}`}>
              {status.type === 'success'
                ? <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
                : <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />}
              <span className="text-xs font-bold leading-relaxed">{status.message}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { key: 'currentPassword', label: 'Current password', show: 'current', placeholder: 'Enter your current password' },
              { key: 'newPassword', label: 'New password', show: 'next', placeholder: 'Create a stronger password' },
              { key: 'confirmPassword', label: 'Confirm new password', show: 'confirm', placeholder: 'Enter the new password again' }
            ].map(field => (
              <div key={field.key}>
                <label className="block text-[11px] uppercase tracking-wider font-black text-slate-400 mb-1.5">
                  {field.label}
                </label>
                <div className="relative">
                  <input
                    required
                    type={showPasswords[field.show] ? 'text' : 'password'}
                    value={form[field.key]}
                    onChange={event => setForm(prev => ({ ...prev, [field.key]: event.target.value }))}
                    placeholder={field.placeholder}
                    className="w-full px-4 py-3.5 pr-12 bg-slate-950 border border-slate-800 rounded-2xl text-sm text-white outline-none focus:border-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords(prev => ({ ...prev, [field.show]: !prev[field.show] }))}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                    aria-label={`${showPasswords[field.show] ? 'Hide' : 'Show'} ${field.label}`}
                  >
                    {showPasswords[field.show] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            ))}

            <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
              <p className="text-[10px] uppercase tracking-widest font-black text-slate-500 mb-3">Password requirements</p>
              <div className="grid sm:grid-cols-2 gap-2">
                {PASSWORD_RULES.map(rule => (
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
              {loading ? 'Updating password...' : 'Change password'}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
