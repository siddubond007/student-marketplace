import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Calendar, AlertTriangle, CheckCircle, Ban, Eye, EyeOff, User, ArrowRight, ArrowLeft, ShieldCheck, Briefcase } from 'lucide-react';
import API from '../services/api';

export default function RegisterPage({ onLoginSuccess }) {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  // Form State with Clean Empty Defaults
  const [form, setForm] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    email: '',
    password: '',
    username: '',
    role: 'STUDENT_FREELANCER',
    dobDay: '15',
    dobMonth: '05',
    dobYear: '2006',
    hasParentConsent: false
  });

  const [calculatedAge, setCalculatedAge] = useState(20);
  const [isBlockedAge, setIsBlockedAge] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Letters-Only Sanitizer (Rejects numbers & special symbols)
  const sanitizeTextOnly = (val) => {
    return val.replace(/[^a-zA-Z\s]/g, '');
  };

  // Recalculate Age from Date Selectors
  const updateDob = (day, month, year) => {
    const birthDate = new Date(`${year}-${month}-${day}`);
    const today = new Date('2026-08-20');
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    setCalculatedAge(age);
    setIsBlockedAge(age < 16);
  };

  // Password Quality Check
  const password = form.password || '';
  const passwordCriteria = {
    hasMinLength: password.length >= 8,
    hasUpper: /[A-Z]/.test(password),
    hasLower: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password)
  };
  const passedCriteriaCount = Object.values(passwordCriteria).filter(Boolean).length;

  // Step 1 Validation -> Move to Step 2
  const handleStep1Next = (e) => {
    e.preventDefault();
    setError('');

    if (!form.firstName.trim() || !form.lastName.trim()) {
      setError('Please enter valid first and last names (letters only).');
      return;
    }

    if (calculatedAge < 16) {
      setError('Registration blocked: You must be at least 16 years old to join SkillLaunch.');
      return;
    }

    if (calculatedAge < 18 && !form.hasParentConsent) {
      setError('Please confirm parental/guardian consent.');
      return;
    }

    if (passedCriteriaCount < 5) {
      setError('Please ensure your password satisfies all 5 security criteria.');
      return;
    }

    // Auto-generate clean username suggestion
    const cleanFirst = form.firstName.toLowerCase().replace(/[^a-z0-9]/g, '');
    const cleanLast = form.lastName.toLowerCase().replace(/[^a-z0-9]/g, '');
    const defaultUsername = `${cleanFirst}${cleanLast}${Math.floor(100 + Math.random() * 900)}`;
    setForm(prev => ({ ...prev, username: prev.username || defaultUsername }));

    setStep(2);
  };

  // Final Registration Call
  const handleCompleteRegistration = async (selectedRole) => {
    setError('');
    setLoading(true);

    const dobString = `${form.dobYear}-${form.dobMonth}-${form.dobDay}`;

    try {
      const res = await API.post('/auth/register', {
        firstName: form.firstName.trim(),
        middleName: form.middleName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim(),
        password: form.password,
        username: form.username,
        role: selectedRole || form.role,
        age: calculatedAge,
        dob: dobString
      });

      localStorage.setItem('token', res.data.token);
      onLoginSuccess(res.data.user);

      if (selectedRole === 'STUDENT_FREELANCER') {
        navigate(`/u/${res.data.user.username}`);
      } else {
        navigate('/client/portal');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed.');
      setStep(1);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-8">
      <div className="neon-border-box max-w-xl w-full p-8 sm:p-10 shadow-2xl relative">
        
        {/* Step Indicator */}
        <div className="flex items-center justify-between mb-6 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-2xl font-black text-white">
              {step === 1 && "Create Your Free Account"}
              {step === 2 && "Choose Your Username"}
              {step === 3 && "Select Account Type"}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">Step {step} of 3 • SkillLaunch Student Hub</p>
          </div>
          {step > 1 && (
            <button onClick={() => setStep(step - 1)} className="p-2 text-slate-400 hover:text-white flex items-center space-x-1 text-xs font-bold">
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          )}
        </div>

        {error && (
          <div className="p-3.5 bg-red-500/15 border border-red-500/40 rounded-2xl text-xs text-red-300 flex items-start space-x-2.5 mb-5">
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span className="leading-relaxed font-bold">{error}</span>
          </div>
        )}

        {/* ─── STEP 1: NAME (LETTERS ONLY), EMAIL, GRAPHICAL CALENDAR & PASSWORD ─── */}
        {step === 1 && (
          <form onSubmit={handleStep1Next} className="space-y-4">
            
            {/* First, Middle, Last Name Inputs (Letters Only Filter) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-wider mb-1">First Name</label>
                <input 
                  required 
                  type="text" 
                  value={form.firstName} 
                  onChange={e => setForm({...form, firstName: sanitizeTextOnly(e.target.value)})} 
                  placeholder="e.g. Aarav" 
                  className="w-full px-3.5 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-indigo-500" 
                />
              </div>
              <div>
                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-wider mb-1">Middle Name <span className="text-[9px] text-slate-500 font-normal">(Optional)</span></label>
                <input 
                  type="text" 
                  value={form.middleName} 
                  onChange={e => setForm({...form, middleName: sanitizeTextOnly(e.target.value)})} 
                  placeholder="e.g. Kumar" 
                  className="w-full px-3.5 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-indigo-500" 
                />
              </div>
              <div>
                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-wider mb-1">Last Name</label>
                <input 
                  required 
                  type="text" 
                  value={form.lastName} 
                  onChange={e => setForm({...form, lastName: sanitizeTextOnly(e.target.value)})} 
                  placeholder="e.g. Sharma" 
                  className="w-full px-3.5 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-indigo-500" 
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-[11px] font-black text-slate-400 uppercase tracking-wider mb-1">Email Address</label>
              <input 
                required 
                type="email" 
                value={form.email} 
                onChange={e => setForm({...form, email: e.target.value})} 
                placeholder="name@college.edu or personal@gmail.com" 
                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-2xl text-xs text-white outline-none focus:border-indigo-500" 
              />
            </div>

            {/* High-Contrast Graphical DOB Picker */}
            <div className="p-4 bg-slate-900/90 rounded-2xl border border-indigo-500/30 space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-xs font-black text-white flex items-center space-x-1.5">
                  <Calendar className="w-4 h-4 text-indigo-400" />
                  <span>Date of Birth (DOB)</span>
                </label>
                <span className="text-xs font-black text-indigo-300 bg-indigo-500/20 px-3 py-0.5 rounded-full border border-indigo-500/40">
                  Age: {calculatedAge} Years Old
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-xs">
                {/* Day */}
                <div>
                  <span className="text-[10px] text-slate-400 block mb-1 font-bold">Day</span>
                  <select 
                    value={form.dobDay}
                    onChange={e => {
                      const d = e.target.value;
                      setForm({...form, dobDay: d});
                      updateDob(d, form.dobMonth, form.dobYear);
                    }}
                    className="w-full p-2.5 bg-slate-950 border-2 border-indigo-500/40 rounded-xl text-white font-black outline-none cursor-pointer"
                  >
                    {Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0')).map(d => (
                      <option key={d} value={d} className="bg-slate-900 text-white">{d}</option>
                    ))}
                  </select>
                </div>

                {/* Month */}
                <div>
                  <span className="text-[10px] text-slate-400 block mb-1 font-bold">Month</span>
                  <select 
                    value={form.dobMonth}
                    onChange={e => {
                      const m = e.target.value;
                      setForm({...form, dobMonth: m});
                      updateDob(form.dobDay, m, form.dobYear);
                    }}
                    className="w-full p-2.5 bg-slate-950 border-2 border-indigo-500/40 rounded-xl text-white font-black outline-none cursor-pointer"
                  >
                    {['01 - Jan', '02 - Feb', '03 - Mar', '04 - Apr', '05 - May', '06 - Jun', '07 - Jul', '08 - Aug', '09 - Sep', '10 - Oct', '11 - Nov', '12 - Dec'].map((m, idx) => (
                      <option key={idx} value={String(idx + 1).padStart(2, '0')} className="bg-slate-900 text-white">{m}</option>
                    ))}
                  </select>
                </div>

                {/* Year */}
                <div>
                  <span className="text-[10px] text-slate-400 block mb-1 font-bold">Year</span>
                  <select 
                    value={form.dobYear}
                    onChange={e => {
                      const y = e.target.value;
                      setForm({...form, dobYear: y});
                      updateDob(form.dobDay, form.dobMonth, y);
                    }}
                    className="w-full p-2.5 bg-slate-950 border-2 border-indigo-500/40 rounded-xl text-white font-black outline-none cursor-pointer"
                  >
                    {Array.from({ length: 18 }, (_, i) => String(2012 - i)).map(y => (
                      <option key={y} value={y} className="bg-slate-900 text-white">{y}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Under 16 Warning */}
            {isBlockedAge && (
              <div className="p-4 bg-red-500/15 border border-red-500/40 rounded-2xl text-xs text-red-300 space-y-1">
                <div className="font-black flex items-center space-x-1.5 text-red-400">
                  <Ban className="w-4 h-4 text-red-400" />
                  <span>Age Blocked ({calculatedAge} Years Old)</span>
                </div>
                <p className="text-[11px] text-red-200/90 leading-relaxed">
                  SkillLaunch requires members to be at least 16 years of age.
                </p>
              </div>
            )}

            {/* Minor 16-17 Consent */}
            {!isBlockedAge && calculatedAge < 18 && (
              <div className="p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-xs text-amber-300 space-y-2">
                <span className="font-bold block text-amber-400">Minor Compliance Protocol (Under 18)</span>
                <label className="flex items-center space-x-2 text-[11px] font-bold text-slate-200 cursor-pointer">
                  <input 
                    type="checkbox" 
                    required 
                    checked={form.hasParentConsent} 
                    onChange={e => setForm({ ...form, hasParentConsent: e.target.checked })} 
                    className="rounded accent-indigo-500 w-4 h-4" 
                  />
                  <span>I confirm I have parental/guardian consent</span>
                </label>
              </div>
            )}

            {/* Password Input */}
            <div>
              <label className="block text-[11px] font-black text-slate-400 uppercase tracking-wider mb-1">Password</label>
              <div className="relative">
                <input 
                  required 
                  type={showPassword ? 'text' : 'password'} 
                  value={form.password} 
                  onChange={e => setForm({...form, password: e.target.value})} 
                  placeholder="••••••••" 
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-2xl text-xs text-white outline-none focus:border-indigo-500 pr-11" 
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Security Checklist */}
              {password.length > 0 && (
                <div className="grid grid-cols-2 gap-1.5 pt-2 text-[10px] font-bold">
                  {[
                    { label: '8+ Characters', valid: passwordCriteria.hasMinLength },
                    { label: 'Uppercase (A-Z)', valid: passwordCriteria.hasUpper },
                    { label: 'Lowercase (a-z)', valid: passwordCriteria.hasLower },
                    { label: 'Number (0-9)', valid: passwordCriteria.hasNumber },
                    { label: 'Special Symbol (!@#$)', valid: passwordCriteria.hasSpecial }
                  ].map((crit, idx) => (
                    <div key={idx} className={`flex items-center space-x-1.5 ${crit.valid ? 'text-emerald-400' : 'text-slate-500'}`}>
                      {crit.valid ? <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> : <span>·</span>}
                      <span>{crit.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button 
              type="submit" 
              disabled={isBlockedAge}
              className={`w-full py-3.5 rounded-2xl text-xs font-black uppercase tracking-wider transition mt-4 ${
                isBlockedAge ? 'bg-slate-800 text-slate-500 cursor-not-allowed opacity-50' : 'neon-airflow-btn text-white'
              }`}
            >
              Continue to Step 2 →
            </button>
          </form>
        )}

        {/* ─── STEP 2: CHOOSE USERNAME ─── */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="block text-xs font-black text-white uppercase tracking-wider">Choose a username</label>
              <p className="text-xs text-slate-400">Please note that a username cannot be changed once chosen.</p>
              
              <input 
                type="text" 
                value={form.username} 
                onChange={e => setForm({...form, username: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '')})}
                className="w-full px-4 py-3.5 bg-slate-950 border-2 border-indigo-500/50 rounded-2xl text-sm font-black text-white outline-none focus:border-indigo-400" 
              />

              <div className="text-xs text-slate-400 pt-1">
                <span className="font-bold text-slate-500">Suggestions: </span>
                <span onClick={() => setForm({...form, username: `${form.firstName.toLowerCase()}${Math.floor(100+Math.random()*900)}`})} className="text-indigo-400 hover:underline cursor-pointer mr-2">
                  {form.firstName.toLowerCase()}{Math.floor(100+Math.random()*900)}
                </span>
                <span onClick={() => setForm({...form, username: `${form.firstName.toLowerCase()}_${form.lastName.toLowerCase()}`})} className="text-indigo-400 hover:underline cursor-pointer">
                  {form.firstName.toLowerCase()}_{form.lastName.toLowerCase()}
                </span>
              </div>
            </div>

            <button 
              onClick={() => setStep(3)}
              className="w-full py-3.5 neon-airflow-btn text-white text-xs font-black uppercase tracking-wider rounded-2xl shadow-xl"
            >
              Next (Select Account Type) →
            </button>
          </div>
        )}

        {/* ─── STEP 3: SELECT ACCOUNT TYPE ─── */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="space-y-1">
              <h3 className="text-base font-black text-white">Select account type</h3>
              <p className="text-xs text-slate-400">Don't worry, this can be changed later in settings.</p>
            </div>

            <div className="space-y-4">
              <div 
                onClick={() => handleCompleteRegistration('STUDENT_FREELANCER')}
                className="p-6 glass-panel rounded-3xl border-2 border-slate-800 hover:border-indigo-500 hover:bg-slate-900/80 cursor-pointer transition flex items-center space-x-5 group shadow-xl"
              >
                <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition shrink-0">
                  <User className="w-7 h-7" />
                </div>
                <div>
                  <h4 className="text-base font-black text-white group-hover:text-indigo-300 transition">Earn money freelancing</h4>
                  <p className="text-xs text-slate-400 mt-1">I am a student looking to complete projects, earn income, and build my verified portfolio.</p>
                </div>
              </div>

              <div 
                onClick={() => handleCompleteRegistration('CLIENT')}
                className="p-6 glass-panel rounded-3xl border-2 border-slate-800 hover:border-pink-500 hover:bg-slate-900/80 cursor-pointer transition flex items-center space-x-5 group shadow-xl"
              >
                <div className="w-14 h-14 rounded-2xl bg-pink-500/10 border border-pink-500/30 flex items-center justify-center text-pink-400 group-hover:scale-110 transition shrink-0">
                  <Briefcase className="w-7 h-7" />
                </div>
                <div>
                  <h4 className="text-base font-black text-white group-hover:text-pink-300 transition">Hire a student freelancer</h4>
                  <p className="text-xs text-slate-400 mt-1">I am a client looking to hire talented students at honest rates for projects.</p>
                </div>
              </div>
            </div>

            {loading && <p className="text-xs text-indigo-400 font-bold text-center animate-pulse">Creating your verified profile in database...</p>}
          </div>
        )}

        <p className="text-xs text-slate-400 text-center mt-6">
          Already have an account? <Link to="/login" className="text-indigo-400 font-bold hover:underline">Sign In</Link>
        </p>
      </div>
    </div>
  );
}
