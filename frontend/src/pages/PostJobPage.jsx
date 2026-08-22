import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Briefcase, FileText, Layers, DollarSign, Paperclip, 
  Sliders, CheckCircle2, ArrowLeft, ArrowRight, Save, 
  Sparkles, Check, Lock, AlertCircle, Clock, Repeat
} from 'lucide-react';

const STEPS = [
  { id: 1, name: 'Basics', label: 'Basic Information', icon: Briefcase, desc: 'Title, category, and project scope' },
  { id: 2, name: 'Description', label: 'Project Description', icon: FileText, desc: 'Detailed requirements & deliverables' },
  { id: 3, name: 'Skills', label: 'Skills & Experience', icon: Layers, desc: 'Required tech stack & student level' },
  { id: 4, name: 'Budget', label: 'Budget & Timeline', icon: DollarSign, desc: 'Pricing structure & expected deadline' },
  { id: 5, name: 'Files', label: 'Files & References', icon: Paperclip, desc: 'Attachments, mockups, or documents' },
  { id: 6, name: 'Options', label: 'Additional Options', icon: Sliders, desc: 'Screening questions & visibility' },
  { id: 7, name: 'Review', label: 'Review & Publish', icon: CheckCircle2, desc: 'Final check before posting' }
];

const CATEGORIES_DATA = {
  "Web Development": ["Frontend Development", "Backend Development", "Full Stack Development", "WordPress", "E-commerce", "Landing Page", "Web Application", "Website Maintenance"],
  "Mobile Development": ["iOS App Development", "Android App Development", "Cross-Platform (Flutter / React Native)", "Mobile UI Implementation", "App Bug Fixes & Updates"],
  "UI/UX Design": ["Web UI Design", "Mobile App UI Design", "Wireframing & Prototyping", "Design Systems", "User Research & UX Audit"],
  "Graphic Design": ["Logo & Brand Identity", "Social Media Graphics", "Banner & Poster Design", "Illustrations", "Packaging Design"],
  "Video & Animation": ["Video Editing", "2D/3D Animation", "Motion Graphics", "YouTube & Social Media Reels", "Explainer Videos"],
  "Writing & Translation": ["Technical Writing", "Blog & Article Writing", "Copywriting", "Content Creation", "Translation & Proofreading"],
  "Digital Marketing": ["Social Media Marketing (SMM)", "Search Engine Optimization (SEO)", "Email Marketing", "Content Marketing", "Ads Campaign Management"],
  "AI & Machine Learning": ["LLM & Chatbot Integration", "Machine Learning Models", "Computer Vision", "Natural Language Processing", "AI Automation & Workflows"],
  "Data Science": ["Data Analytics & Visualization", "Data Cleaning & Preprocessing", "Python Data Analysis", "Excel & PowerBI Dashboards", "Statistical Modeling"],
  "Cybersecurity": ["Vulnerability Assessment", "Web Application Security", "Penetration Testing", "Security Audit & Hardening"],
  "Business": ["Business Plans & Market Research", "Financial Modeling & Pitch Decks", "Virtual Assistance", "Resume & Career Consulting"],
  "Other": ["General Tech Support", "Custom Scripting & Automation", "Other Specialized Work"]
};

export default function PostJobPage({ currentUser }) {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const isAuthenticated = Boolean(currentUser || token);

  const [currentStep, setCurrentStep] = useState(1);
  const [saveStatus, setSaveStatus] = useState('');
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    title: '',
    category: '',
    subcategory: '',
    projectType: 'ONE_TIME',
    description: '',
    deliverables: '',
    requiredSkills: [],
    experienceLevel: 'INTERMEDIATE',
    pricingType: 'FIXED',
    budget: '',
    duration: '1_TO_3_MONTHS',
    attachments: [],
    referenceLinks: '',
    visibility: 'PUBLIC',
    screeningQuestions: []
  });

  useEffect(() => {
    try {
      const savedDraft = localStorage.getItem('marketplace_job_draft');
      if (savedDraft) {
        const parsed = JSON.parse(savedDraft);
        if (parsed.formData) setFormData(parsed.formData);
        if (parsed.currentStep) setCurrentStep(parsed.currentStep);
      }
    } catch (e) {
      console.error('Failed to load draft:', e);
    }
  }, []);

  const handleFieldChange = (field, value) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      if (field === 'category') updated.subcategory = '';
      return updated;
    });
    if (errors[field]) {
      setErrors(prev => {
        const copy = { ...prev };
        delete copy[field];
        return copy;
      });
    }
  };

  const validateCurrentStep = (step) => {
    const stepErrors = {};
    if (step === 1) {
      const trimmedTitle = (formData.title || '').trim();
      if (!trimmedTitle) {
        stepErrors.title = 'Job title is required';
      } else if (trimmedTitle.length < 10) {
        stepErrors.title = 'Title must be at least 10 characters long';
      } else if (trimmedTitle.length > 100) {
        stepErrors.title = 'Title cannot exceed 100 characters';
      }

      if (!formData.category) {
        stepErrors.category = 'Please select a primary category';
      }

      if (formData.category && !formData.subcategory) {
        stepErrors.subcategory = 'Please select a subcategory for your project';
      }

      if (!formData.projectType) {
        stepErrors.projectType = 'Please select a project type';
      }
    }
    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const handleNext = () => {
    if (validateCurrentStep(currentStep)) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setCurrentStep(prev => Math.min(prev + 1, STEPS.length));
    }
  };

  const handleBack = () => {
    setErrors({});
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSaveDraft = () => {
    try {
      localStorage.setItem('marketplace_job_draft', JSON.stringify({ formData, currentStep, lastSaved: new Date().toISOString() }));
      setSaveStatus('Draft saved successfully!');
      setTimeout(() => setSaveStatus(''), 3000);
    } catch (e) {
      setSaveStatus('Failed to save draft.');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-16 h-16 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-3xl flex items-center justify-center mx-auto shadow-xl">
          <Lock className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-white">Client Authentication Required</h2>
          <p className="text-slate-400 text-sm">You must be signed in to create and post student projects.</p>
        </div>
        <div className="flex justify-center gap-4 pt-2">
          <Link to="/login" className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black rounded-xl transition shadow-lg shadow-indigo-500/25">
            Sign In to Account
          </Link>
          <Link to="/register" className="px-6 py-3 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-200 text-xs font-black rounded-xl transition">
            Create Client Account
          </Link>
        </div>
      </div>
    );
  }

  const availableSubcategories = formData.category ? CATEGORIES_DATA[formData.category] || [] : [];

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4" />
              <span>Client Project Hub</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">Post a Job</h1>
            <p className="text-sm text-slate-400 mt-1">Hire verified college talent, developers, and creators for your project.</p>
          </div>
          <div className="flex items-center gap-3">
            <button type="button" onClick={handleSaveDraft} className="px-4 py-2.5 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs font-bold rounded-xl flex items-center gap-2 transition">
              <Save className="w-4 h-4 text-indigo-400" />
              <span>Save Draft</span>
            </button>
            {saveStatus && <span className="text-xs text-emerald-400 font-semibold">{saveStatus}</span>}
          </div>
        </div>

        {/* Progress Stepper */}
        <div className="glass-panel p-4 sm:p-6 rounded-3xl border border-slate-800 shadow-xl space-y-4">
          <div className="md:hidden flex justify-between items-center text-xs font-bold">
            <span className="text-indigo-400 uppercase tracking-wider">Step {currentStep} of {STEPS.length}</span>
            <span className="text-white">{STEPS[currentStep - 1].label}</span>
          </div>
          <div className="hidden md:grid grid-cols-7 gap-2">
            {STEPS.map((step) => {
              const isCompleted = step.id < currentStep;
              const isCurrent = step.id === currentStep;
              const Icon = step.icon;
              return (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => { if (step.id < currentStep) setCurrentStep(step.id); }}
                  disabled={step.id > currentStep}
                  className={`flex flex-col items-center text-center p-2 rounded-2xl transition-all ${
                    isCurrent ? 'bg-indigo-600/20 border border-indigo-500/40 text-white' : isCompleted ? 'text-emerald-400 hover:bg-slate-900/60 cursor-pointer' : 'text-slate-600 opacity-60 cursor-not-allowed'
                  }`}
                >
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-black mb-1.5 transition-all ${
                    isCurrent ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30 ring-2 ring-indigo-400/50' : isCompleted ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-400' : 'bg-slate-950 border border-slate-800 text-slate-500'
                  }`}>
                    {isCompleted ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                  </div>
                  <span className={`text-[11px] font-bold tracking-tight ${isCurrent ? 'text-white' : isCompleted ? 'text-slate-300' : 'text-slate-500'}`}>
                    {step.name}
                  </span>
                </button>
              );
            })}
          </div>
          <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
            <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 h-full transition-all duration-300 rounded-full" style={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }} />
          </div>
        </div>

        {/* Step 1 Container */}
        <div className="glass-panel p-6 sm:p-10 rounded-3xl border border-slate-800 shadow-2xl space-y-8 min-h-[400px]">
          <div className="space-y-1">
            <div className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Step {currentStep}</div>
            <h2 className="text-2xl font-black text-white">{STEPS[currentStep - 1].label}</h2>
            <p className="text-xs sm:text-sm text-slate-400">{STEPS[currentStep - 1].desc}</p>
          </div>

          {currentStep === 1 && (
            <div className="space-y-8">
              {/* 1. Job Title */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-300">
                    What do you need help with? <span className="text-pink-500">*</span>
                  </label>
                  <span className={`text-[11px] font-semibold ${formData.title.length > 100 ? 'text-red-400' : 'text-slate-500'}`}>
                    {formData.title.length}/100
                  </span>
                </div>
                <input
                  type="text"
                  maxLength={100}
                  value={formData.title}
                  onChange={(e) => handleFieldChange('title', e.target.value)}
                  placeholder="e.g. Build a responsive e-commerce website"
                  className={`w-full px-4 py-3.5 bg-slate-950 border rounded-2xl text-sm text-white outline-none transition ${
                    errors.title ? 'border-red-500 focus:border-red-400 bg-red-500/5' : 'border-slate-800 focus:border-indigo-500'
                  }`}
                />
                {errors.title ? (
                  <p className="text-xs text-red-400 font-semibold flex items-center gap-1.5 mt-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{errors.title}</span>
                  </p>
                ) : (
                  <p className="text-xs text-slate-500">
                    Use a clear and specific title so freelancers can quickly understand your project.
                  </p>
                )}
              </div>

              {/* 2 & 3. Category & Subcategory */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-300">
                    Category <span className="text-pink-500">*</span>
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleFieldChange('category', e.target.value)}
                    className={`w-full px-4 py-3.5 bg-slate-950 border rounded-2xl text-sm text-white outline-none transition ${
                      errors.category ? 'border-red-500 focus:border-red-400 bg-red-500/5' : 'border-slate-800 focus:border-indigo-500'
                    }`}
                  >
                    <option value="">Select a category...</option>
                    {Object.keys(CATEGORIES_DATA).map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  {errors.category && (
                    <p className="text-xs text-red-400 font-semibold flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{errors.category}</span>
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-300">
                    Subcategory <span className="text-pink-500">*</span>
                  </label>
                  <select
                    value={formData.subcategory}
                    disabled={!formData.category}
                    onChange={(e) => handleFieldChange('subcategory', e.target.value)}
                    className={`w-full px-4 py-3.5 bg-slate-950 border rounded-2xl text-sm outline-none transition ${
                      !formData.category 
                        ? 'opacity-50 cursor-not-allowed border-slate-900 text-slate-600' 
                        : errors.subcategory 
                          ? 'border-red-500 focus:border-red-400 text-white bg-red-500/5' 
                          : 'border-slate-800 focus:border-indigo-500 text-white'
                    }`}
                  >
                    <option value="">
                      {!formData.category ? 'Select a category first...' : 'Select a subcategory...'}
                    </option>
                    {availableSubcategories.map(sub => (
                      <option key={sub} value={sub}>{sub}</option>
                    ))}
                  </select>
                  {errors.subcategory && (
                    <p className="text-xs text-red-400 font-semibold flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{errors.subcategory}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* 4. Project Type */}
              <div className="space-y-3">
                <label className="block text-xs font-black uppercase tracking-wider text-slate-300">
                  What type of project is this? <span className="text-pink-500">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { 
                      id: 'ONE_TIME', 
                      title: 'One-time project', 
                      desc: 'Find a student for a specific project or task with clear deliverables',
                      icon: Clock 
                    },
                    { 
                      id: 'ONGOING', 
                      title: 'Ongoing work', 
                      desc: 'Hire a student on a recurring or long-term basis for ongoing support',
                      icon: Repeat 
                    }
                  ].map(type => {
                    const isSelected = formData.projectType === type.id;
                    const Icon = type.icon;
                    return (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => handleFieldChange('projectType', type.id)}
                        className={`p-5 rounded-2xl text-left border transition-all flex items-start gap-4 ${
                          isSelected
                            ? 'bg-indigo-600/15 border-indigo-500 text-white shadow-lg shadow-indigo-500/10 ring-1 ring-indigo-500/50'
                            : 'bg-slate-950/80 border-slate-800/80 text-slate-400 hover:border-slate-700 hover:bg-slate-900/50'
                        }`}
                      >
                        <div className={`p-2.5 rounded-xl border mt-0.5 ${
                          isSelected ? 'bg-indigo-600 text-white border-indigo-500' : 'bg-slate-900 border-slate-800 text-slate-500'
                        }`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="space-y-1">
                          <div className="text-sm font-bold text-white">{type.title}</div>
                          <div className="text-xs text-slate-400 leading-relaxed">{type.desc}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Placeholders for Steps 2 to 7 */}
          {currentStep > 1 && (
            <div className="py-12 text-center text-slate-400 space-y-2">
              <div className="text-base font-bold text-white">Step {currentStep}: {STEPS[currentStep - 1].label}</div>
              <p className="text-xs text-slate-500">Form fields for this step will be populated in subsequent requirements.</p>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex flex-col-reverse sm:flex-row justify-between items-center gap-4 pt-6 border-t border-slate-800">
            <div>
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={handleBack}
                  className="w-full sm:w-auto px-6 py-3 bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-300 text-xs font-black rounded-xl flex items-center justify-center gap-2 transition"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
              )}
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              {currentStep < STEPS.length ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="w-full sm:w-auto px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black rounded-xl flex items-center justify-center gap-2 transition shadow-lg shadow-indigo-500/25 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 text-white text-xs font-black rounded-xl flex items-center justify-center gap-2 transition shadow-lg shadow-emerald-500/25"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Publish Job</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
