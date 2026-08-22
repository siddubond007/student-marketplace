import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Briefcase, FileText, Layers, DollarSign, Paperclip, 
  Sliders, CheckCircle2, ArrowLeft, ArrowRight, Save, 
  Sparkles, Check, Lock, AlertCircle, Clock, Repeat,
  Plus, Trash2, X, Search, Sparkle, Award, Zap, HelpCircle,
  Calendar, IndianRupee, Info, TrendingUp
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

const ALL_SKILLS_DATABASE = [
  "React", "Node.js", "Python", "JavaScript", "TypeScript", "Tailwind CSS", "Next.js", 
  "Express.js", "MongoDB", "PostgreSQL", "HTML5 & CSS3", "Vue.js", "Django", "Flask",
  "UI/UX Design", "Figma", "Adobe XD", "Wireframing", "User Research", "Prototyping",
  "Flutter", "React Native", "iOS (Swift)", "Android (Kotlin)", "Mobile UI",
  "Graphic Design", "Logo Design", "Adobe Photoshop", "Adobe Illustrator", "Canva",
  "Video Editing", "Adobe Premiere Pro", "After Effects", "DaVinci Resolve", "CapCut", "Motion Graphics",
  "Content Writing", "Copywriting", "SEO Writing", "Technical Writing", "Proofreading",
  "Digital Marketing", "SEO", "Google Ads", "Social Media Marketing", "Meta Ads", "Email Marketing",
  "Machine Learning", "Deep Learning", "TensorFlow", "PyTorch", "NLP", "Computer Vision", "LLM & OpenAI API",
  "Data Analysis", "Pandas & NumPy", "PowerBI", "Tableau", "Excel / Spreadsheets", "SQL",
  "Cybersecurity", "Penetration Testing", "Ethical Hacking", "Network Security", "Vulnerability Assessment",
  "Business Analysis", "Financial Modeling", "Market Research", "Pitch Deck Creation", "Virtual Assistance",
  "Git & GitHub", "Docker", "AWS", "Firebase", "Linux", "REST APIs", "GraphQL"
];

const EXPERIENCE_LEVELS = [
  { id: 'BEGINNER', title: 'Beginner', badge: 'Rising Star', desc: 'Suitable for simple projects or clients comfortable with some guidance.', icon: Sparkle },
  { id: 'INTERMEDIATE', title: 'Intermediate', badge: 'Standard', desc: 'Has professional experience and can independently handle most projects.', icon: Zap },
  { id: 'EXPERT', title: 'Expert', badge: 'Top Tier', desc: 'Highly experienced professional suitable for complex projects.', icon: Award },
  { id: 'NOT_SURE', title: "I'm not sure", badge: 'Flexible', desc: 'Let the marketplace recommend suitable freelancers based on proposals.', icon: HelpCircle }
];

const START_PREFERENCES = [
  { id: 'ASAP', label: 'As soon as possible' },
  { id: 'FEW_DAYS', label: 'Within a few days' },
  { id: 'NEXT_WEEK', label: 'Next week' },
  { id: 'FLEXIBLE', label: 'Flexible' },
  { id: 'SPECIFIC_DATE', label: 'Specific date' }
];

const DEADLINE_TYPES = [
  { id: 'ASAP', label: 'As soon as possible' },
  { id: '1_WEEK', label: 'Within 1 week' },
  { id: '2_WEEKS', label: 'Within 2 weeks' },
  { id: '1_MONTH', label: 'Within 1 month' },
  { id: 'SPECIFIC_DATE', label: 'I have a specific deadline' },
  { id: 'FLEXIBLE', label: 'Flexible' }
];

export default function PostJobPage({ currentUser }) {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const isAuthenticated = Boolean(currentUser || token);

  const [currentStep, setCurrentStep] = useState(1);
  const [saveStatus, setSaveStatus] = useState('');
  const [errors, setErrors] = useState({});

  const [skillSearchInput, setSkillSearchInput] = useState('');
  const [showSkillDropdown, setShowSkillDropdown] = useState(false);

  const todayDateString = new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    title: '',
    category: '',
    subcategory: '',
    projectType: 'ONE_TIME',
    description: '',
    deliverables: [''],
    specificRequirements: '',
    requiredSkills: [],
    experienceLevel: 'INTERMEDIATE',
    budgetType: 'RANGE',
    fixedBudget: '',
    minimumBudget: '',
    maximumBudget: '',
    currency: 'INR',
    startPreference: 'ASAP',
    startDate: '',
    deadlineType: '1_MONTH',
    deadlineDate: '',
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
        if (parsed.formData) {
          setFormData(prev => ({
            ...prev,
            ...parsed.formData,
            deliverables: Array.isArray(parsed.formData.deliverables) && parsed.formData.deliverables.length > 0 
              ? parsed.formData.deliverables 
              : [''],
            requiredSkills: Array.isArray(parsed.formData.requiredSkills) 
              ? parsed.formData.requiredSkills 
              : [],
            budgetType: parsed.formData.budgetType || 'RANGE',
            currency: 'INR'
          }));
        }
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

  const handleAddDeliverable = () => {
    setFormData(prev => ({
      ...prev,
      deliverables: [...prev.deliverables, '']
    }));
    if (errors.deliverables) {
      setErrors(prev => {
        const copy = { ...prev };
        delete copy.deliverables;
        return copy;
      });
    }
  };

  const handleDeliverableChange = (index, value) => {
    setFormData(prev => {
      const updated = [...prev.deliverables];
      updated[index] = value;
      return { ...prev, deliverables: updated };
    });
    if (errors.deliverables) {
      setErrors(prev => {
        const copy = { ...prev };
        delete copy.deliverables;
        return copy;
      });
    }
  };

  const handleRemoveDeliverable = (index) => {
    setFormData(prev => {
      const updated = prev.deliverables.filter((_, idx) => idx !== index);
      return { ...prev, deliverables: updated.length > 0 ? updated : [''] };
    });
  };

  const handleAddSkill = (skillToAdd) => {
    const trimmed = (skillToAdd || '').trim();
    if (!trimmed) return;
    
    if (formData.requiredSkills.includes(trimmed)) {
      setSkillSearchInput('');
      setShowSkillDropdown(false);
      return;
    }

    if (formData.requiredSkills.length >= 10) {
      setErrors(prev => ({ ...prev, requiredSkills: 'You can select up to 10 skills maximum' }));
      return;
    }

    setFormData(prev => ({
      ...prev,
      requiredSkills: [...prev.requiredSkills, trimmed]
    }));
    setSkillSearchInput('');
    setShowSkillDropdown(false);

    if (errors.requiredSkills) {
      setErrors(prev => {
        const copy = { ...prev };
        delete copy.requiredSkills;
        return copy;
      });
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setFormData(prev => ({
      ...prev,
      requiredSkills: prev.requiredSkills.filter(s => s !== skillToRemove)
    }));
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
    } else if (step === 2) {
      const trimmedDesc = (formData.description || '').trim();
      if (!trimmedDesc) {
        stepErrors.description = 'Project description is required';
      } else if (trimmedDesc.length < 50) {
        stepErrors.description = 'Description must be at least 50 characters long to provide sufficient detail';
      } else if (trimmedDesc.length > 3000) {
        stepErrors.description = 'Description cannot exceed 3000 characters';
      }

      const validDeliverables = (formData.deliverables || []).filter(d => (d || '').trim().length > 0);
      if (validDeliverables.length === 0) {
        stepErrors.deliverables = 'Please specify at least one project deliverable';
      }
    } else if (step === 3) {
      if (!formData.requiredSkills || formData.requiredSkills.length === 0) {
        stepErrors.requiredSkills = 'Please select at least one required skill for your project';
      }
    } else if (step === 4) {
      if (formData.budgetType === 'FIXED') {
        const fb = Number(formData.fixedBudget);
        if (!formData.fixedBudget || isNaN(fb) || fb <= 0) {
          stepErrors.fixedBudget = 'Please enter a valid fixed budget amount greater than 0';
        }
      } else {
        const minB = Number(formData.minimumBudget);
        const maxB = Number(formData.maximumBudget);

        if (!formData.minimumBudget || isNaN(minB) || minB <= 0) {
          stepErrors.minimumBudget = 'Minimum budget is required and must be greater than 0';
        }
        if (!formData.maximumBudget || isNaN(maxB) || maxB <= 0) {
          stepErrors.maximumBudget = 'Maximum budget is required and must be greater than 0';
        }
        if (!isNaN(minB) && !isNaN(maxB) && minB > 0 && maxB > 0 && maxB < minB) {
          stepErrors.maximumBudget = 'Maximum budget must be greater than or equal to minimum budget';
        }
      }

      if (formData.startPreference === 'SPECIFIC_DATE') {
        if (!formData.startDate) {
          stepErrors.startDate = 'Please select a specific start date';
        } else if (formData.startDate < todayDateString) {
          stepErrors.startDate = 'Start date cannot be in the past';
        }
      }

      if (formData.deadlineType === 'SPECIFIC_DATE') {
        if (!formData.deadlineDate) {
          stepErrors.deadlineDate = 'Please select a specific deadline date';
        } else if (formData.deadlineDate < todayDateString) {
          stepErrors.deadlineDate = 'Deadline date cannot be in the past';
        } else if (formData.startPreference === 'SPECIFIC_DATE' && formData.startDate && formData.deadlineDate < formData.startDate) {
          stepErrors.deadlineDate = 'Project deadline must be on or after the selected start date';
        }
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
  
  const filteredSkillSuggestions = ALL_SKILLS_DATABASE.filter(s => 
    s.toLowerCase().includes(skillSearchInput.toLowerCase().trim()) &&
    !formData.requiredSkills.includes(s)
  ).slice(0, 8);

  const getFormattedBudgetSummary = () => {
    if (formData.budgetType === 'FIXED') {
      return formData.fixedBudget ? `₹${Number(formData.fixedBudget).toLocaleString('en-IN')} (Fixed)` : 'Not set';
    }
    if (formData.minimumBudget && formData.maximumBudget) {
      return `₹${Number(formData.minimumBudget).toLocaleString('en-IN')} — ₹${Number(formData.maximumBudget).toLocaleString('en-IN')}`;
    }
    return 'Not set';
  };

  const getFormattedStartSummary = () => {
    if (formData.startPreference === 'SPECIFIC_DATE') {
      return formData.startDate ? new Date(formData.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Specific date';
    }
    const found = START_PREFERENCES.find(p => p.id === formData.startPreference);
    return found ? found.label : 'As soon as possible';
  };

  const getFormattedDeadlineSummary = () => {
    if (formData.deadlineType === 'SPECIFIC_DATE') {
      return formData.deadlineDate ? new Date(formData.deadlineDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Specific deadline';
    }
    const found = DEADLINE_TYPES.find(d => d.id === formData.deadlineType);
    return found ? found.label : 'Within 1 month';
  };

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

        {/* Step Container */}
        <div className="glass-panel p-6 sm:p-10 rounded-3xl border border-slate-800 shadow-2xl space-y-8 min-h-[400px]">
          <div className="space-y-1">
            <div className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Step {currentStep}</div>
            <h2 className="text-2xl font-black text-white">{STEPS[currentStep - 1].label}</h2>
            <p className="text-xs sm:text-sm text-slate-400">{STEPS[currentStep - 1].desc}</p>
          </div>

          {/* STEP 1: Basic Information */}
          {currentStep === 1 && (
            <div className="space-y-8">
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

          {/* STEP 2: Project Description */}
          {currentStep === 2 && (
            <div className="space-y-8">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-300">
                    Describe your project <span className="text-pink-500">*</span>
                  </label>
                  <span className={`text-[11px] font-semibold ${formData.description.length > 3000 ? 'text-red-400' : 'text-slate-500'}`}>
                    {formData.description.length}/3000
                  </span>
                </div>
                <textarea
                  rows={7}
                  maxLength={3000}
                  value={formData.description}
                  onChange={(e) => handleFieldChange('description', e.target.value)}
                  placeholder="Tell freelancers what you need, what you are trying to achieve, and what the final result should look like."
                  className={`w-full px-4 py-3.5 bg-slate-950 border rounded-2xl text-sm text-white outline-none transition ${
                    errors.description ? 'border-red-500 focus:border-red-400 bg-red-500/5' : 'border-slate-800 focus:border-indigo-500'
                  }`}
                />
                {errors.description ? (
                  <p className="text-xs text-red-400 font-semibold flex items-center gap-1.5 mt-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{errors.description}</span>
                  </p>
                ) : (
                  <p className="text-xs text-slate-500">
                    Detailed descriptions help freelancers submit better and more accurate proposals.
                  </p>
                )}
              </div>

              <div className="p-6 bg-slate-950/70 border border-slate-800 rounded-2xl space-y-4">
                <div className="space-y-1">
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-300">
                    What should the freelancer deliver? <span className="text-pink-500">*</span>
                  </label>
                  <p className="text-xs text-slate-500">
                    List specific deliverables expected upon completion (e.g. Responsive website, Admin dashboard, Source code, Deployment).
                  </p>
                </div>

                <div className="space-y-3">
                  {formData.deliverables.map((deliverable, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="flex-1 relative">
                        <input
                          type="text"
                          value={deliverable}
                          onChange={(e) => handleDeliverableChange(index, e.target.value)}
                          placeholder={`e.g. ${index === 0 ? 'Responsive website' : index === 1 ? 'Source code repository' : index === 2 ? 'Live deployment & documentation' : 'Additional deliverable'}`}
                          className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white outline-none focus:border-indigo-500 transition"
                        />
                      </div>
                      {formData.deliverables.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveDeliverable(index)}
                          className="p-3 bg-slate-900 hover:bg-red-500/20 text-slate-400 hover:text-red-400 rounded-xl border border-slate-800 hover:border-red-500/40 transition"
                          title="Remove deliverable"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <div className="pt-2 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <button
                    type="button"
                    onClick={handleAddDeliverable}
                    className="px-4 py-2.5 bg-slate-900 border border-slate-800 hover:border-indigo-500/50 text-indigo-400 text-xs font-bold rounded-xl flex items-center gap-2 transition"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add deliverable</span>
                  </button>

                  {errors.deliverables && (
                    <p className="text-xs text-red-400 font-semibold flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{errors.deliverables}</span>
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-black uppercase tracking-wider text-slate-300">
                  Are there any specific requirements? <span className="text-xs text-slate-500 font-medium normal-case">(Optional)</span>
                </label>
                <textarea
                  rows={4}
                  value={formData.specificRequirements}
                  onChange={(e) => handleFieldChange('specificRequirements', e.target.value)}
                  placeholder="Describe technology requirements, technical constraints, design guidelines, or specific conditions..."
                  className="w-full px-4 py-3.5 bg-slate-950 border border-slate-800 rounded-2xl text-sm text-white outline-none focus:border-indigo-500 transition"
                />
              </div>
            </div>
          )}

          {/* STEP 3: Skills & Experience */}
          {currentStep === 3 && (
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-slate-300">
                      What skills should the freelancer have? <span className="text-pink-500">*</span>
                    </label>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Select up to 10 key technologies or capabilities required for your project.
                    </p>
                  </div>
                  <span className={`text-[11px] font-semibold ${formData.requiredSkills.length >= 10 ? 'text-amber-400' : 'text-slate-500'}`}>
                    {formData.requiredSkills.length}/10 selected
                  </span>
                </div>

                <div className="min-h-[52px] p-3 bg-slate-950/80 border border-slate-800 rounded-2xl flex flex-wrap items-center gap-2">
                  {formData.requiredSkills.length > 0 ? (
                    formData.requiredSkills.map(skill => (
                      <span
                        key={skill}
                        className="px-3 py-1.5 bg-indigo-600/20 border border-indigo-500/40 text-indigo-200 text-xs font-bold rounded-xl flex items-center gap-2 shadow-sm transition"
                      >
                        <span>{skill}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(skill)}
                          className="text-indigo-300 hover:text-white transition p-0.5 rounded-md hover:bg-indigo-500/30"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-slate-600 italic px-2">
                      No skills selected yet. Search below or pick from recommended skills.
                    </span>
                  )}
                </div>

                <div className="relative">
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={skillSearchInput}
                      onFocus={() => setShowSkillDropdown(true)}
                      onChange={(e) => {
                        setSkillSearchInput(e.target.value);
                        setShowSkillDropdown(true);
                      }}
                      onKeyDown={(e) => {
                        if ((e.key === 'Enter' || e.key === ',') && skillSearchInput.trim()) {
                          e.preventDefault();
                          handleAddSkill(skillSearchInput);
                        }
                      }}
                      placeholder="Search skills (e.g. React, Python, Figma, Tailwind, Node.js)..."
                      className={`w-full pl-11 pr-4 py-3.5 bg-slate-950 border rounded-2xl text-sm text-white outline-none transition ${
                        errors.requiredSkills ? 'border-red-500 focus:border-red-400 bg-red-500/5' : 'border-slate-800 focus:border-indigo-500'
                      }`}
                    />
                  </div>

                  {showSkillDropdown && skillSearchInput.trim() && (
                    <div className="absolute top-full left-0 right-0 z-50 mt-2 max-h-56 overflow-y-auto bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-2 space-y-1">
                      {filteredSkillSuggestions.length > 0 ? (
                        filteredSkillSuggestions.map(skill => (
                          <button
                            key={skill}
                            type="button"
                            onClick={() => handleAddSkill(skill)}
                            className="w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-200 hover:text-white hover:bg-indigo-600/30 flex items-center justify-between transition"
                          >
                            <span>{skill}</span>
                            <Plus className="w-3.5 h-3.5 text-indigo-400" />
                          </button>
                        ))
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleAddSkill(skillSearchInput)}
                          className="w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold text-indigo-300 hover:bg-indigo-600/30 flex items-center justify-between transition"
                        >
                          <span>+ Add custom skill "{skillSearchInput}"</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {errors.requiredSkills && (
                  <p className="text-xs text-red-400 font-semibold flex items-center gap-1.5 mt-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{errors.requiredSkills}</span>
                  </p>
                )}

                <div className="space-y-1.5 pt-1">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Popular Skills:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {["React", "Node.js", "Python", "Tailwind CSS", "Figma", "TypeScript", "UI/UX Design", "Next.js", "PostgreSQL"]
                      .filter(s => !formData.requiredSkills.includes(s))
                      .map(skill => (
                        <button
                          key={skill}
                          type="button"
                          onClick={() => handleAddSkill(skill)}
                          className="px-2.5 py-1 bg-slate-900 border border-slate-800 hover:border-indigo-500/40 text-slate-400 hover:text-indigo-300 text-xs font-medium rounded-lg flex items-center gap-1 transition"
                        >
                          <Plus className="w-3 h-3" />
                          <span>{skill}</span>
                        </button>
                      ))}
                  </div>
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-slate-800">
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-300">
                    What level of freelancer are you looking for?
                  </label>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Select the experience level that best matches your project complexity.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {EXPERIENCE_LEVELS.map(lvl => {
                    const isSelected = formData.experienceLevel === lvl.id;
                    const Icon = lvl.icon;

                    return (
                      <button
                        key={lvl.id}
                        type="button"
                        onClick={() => handleFieldChange('experienceLevel', lvl.id)}
                        className={`p-5 rounded-2xl text-left border transition-all flex items-start gap-4 ${
                          isSelected
                            ? 'bg-indigo-600/15 border-indigo-500 text-white shadow-lg shadow-indigo-500/10 ring-1 ring-indigo-500/50'
                            : 'bg-slate-950/80 border-slate-800/80 text-slate-400 hover:border-slate-700 hover:bg-slate-900/50'
                        }`}
                      >
                        <div className={`p-2.5 rounded-xl border mt-0.5 shrink-0 ${
                          isSelected ? 'bg-indigo-600 text-white border-indigo-500' : 'bg-slate-900 border-slate-800 text-slate-500'
                        }`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-white">{lvl.title}</span>
                            <span className={`text-[10px] font-black px-2 py-0.5 rounded-md ${
                              isSelected ? 'bg-indigo-500/20 text-indigo-300' : 'bg-slate-900 text-slate-500'
                            }`}>
                              {lvl.badge}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 leading-relaxed">{lvl.desc}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Budget & Timeline (INR ₹) */}
          {currentStep === 4 && (
            <div className="space-y-8">
              {/* Section 1 & 2: Budget Type */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-300">
                    What's your budget for this project? <span className="text-pink-500">*</span>
                  </label>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Set a realistic budget to help freelancers decide whether your project is suitable for them (All rates in INR ₹).
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    {
                      id: 'RANGE',
                      title: 'Budget Range (Recommended)',
                      desc: 'Set a flexible minimum and maximum amount you are comfortable spending.',
                      icon: TrendingUp
                    },
                    {
                      id: 'FIXED',
                      title: 'Fixed Budget',
                      desc: 'Set a specific total amount available for the complete project.',
                      icon: IndianRupee
                    }
                  ].map(type => {
                    const isSelected = formData.budgetType === type.id;
                    const Icon = type.icon;
                    return (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => handleFieldChange('budgetType', type.id)}
                        className={`p-5 rounded-2xl text-left border transition-all flex items-start gap-4 ${
                          isSelected
                            ? 'bg-indigo-600/15 border-indigo-500 text-white shadow-lg shadow-indigo-500/10 ring-1 ring-indigo-500/50'
                            : 'bg-slate-950/80 border-slate-800/80 text-slate-400 hover:border-slate-700 hover:bg-slate-900/50'
                        }`}
                      >
                        <div className={`p-2.5 rounded-xl border mt-0.5 shrink-0 ${
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

              {/* Section 3 or 4: Budget Input Form */}
              <div className="p-6 bg-slate-950/70 border border-slate-800 rounded-2xl space-y-4">
                {formData.budgetType === 'FIXED' ? (
                  <div className="space-y-2">
                    <label className="block text-xs font-black uppercase tracking-wider text-slate-300">
                      Total Project Budget <span className="text-pink-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">₹</span>
                      <input
                        type="number"
                        min="1"
                        value={formData.fixedBudget}
                        onChange={(e) => handleFieldChange('fixedBudget', e.target.value)}
                        placeholder="10,000"
                        className={`w-full pl-8 pr-4 py-3.5 bg-slate-900 border rounded-xl text-sm text-white outline-none transition ${
                          errors.fixedBudget ? 'border-red-500 focus:border-red-400 bg-red-500/5' : 'border-slate-800 focus:border-indigo-500'
                        }`}
                      />
                    </div>
                    {errors.fixedBudget ? (
                      <p className="text-xs text-red-400 font-semibold flex items-center gap-1.5 mt-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>{errors.fixedBudget}</span>
                      </p>
                    ) : (
                      <p className="text-xs text-slate-500">
                        This is the total amount you expect to spend on this complete project.
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="block text-xs font-black uppercase tracking-wider text-slate-300">
                          Minimum Budget <span className="text-pink-500">*</span>
                        </label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">₹</span>
                          <input
                            type="number"
                            min="1"
                            value={formData.minimumBudget}
                            onChange={(e) => handleFieldChange('minimumBudget', e.target.value)}
                            placeholder="5,000"
                            className={`w-full pl-8 pr-4 py-3.5 bg-slate-900 border rounded-xl text-sm text-white outline-none transition ${
                              errors.minimumBudget ? 'border-red-500 focus:border-red-400 bg-red-500/5' : 'border-slate-800 focus:border-indigo-500'
                            }`}
                          />
                        </div>
                        {errors.minimumBudget && (
                          <p className="text-xs text-red-400 font-semibold flex items-center gap-1.5 mt-1">
                            <AlertCircle className="w-3.5 h-3.5" />
                            <span>{errors.minimumBudget}</span>
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label className="block text-xs font-black uppercase tracking-wider text-slate-300">
                          Maximum Budget <span className="text-pink-500">*</span>
                        </label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">₹</span>
                          <input
                            type="number"
                            min="1"
                            value={formData.maximumBudget}
                            onChange={(e) => handleFieldChange('maximumBudget', e.target.value)}
                            placeholder="15,000"
                            className={`w-full pl-8 pr-4 py-3.5 bg-slate-900 border rounded-xl text-sm text-white outline-none transition ${
                              errors.maximumBudget ? 'border-red-500 focus:border-red-400 bg-red-500/5' : 'border-slate-800 focus:border-indigo-500'
                            }`}
                          />
                        </div>
                        {errors.maximumBudget && (
                          <p className="text-xs text-red-400 font-semibold flex items-center gap-1.5 mt-1">
                            <AlertCircle className="w-3.5 h-3.5" />
                            <span>{errors.maximumBudget}</span>
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Section 5: Budget Guidance Box */}
                <div className="p-4 bg-indigo-950/30 border border-indigo-500/20 rounded-xl flex items-start gap-3 mt-4">
                  <Info className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <div className="text-xs font-bold text-indigo-200">Not sure about the right budget?</div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Freelancers will review your project requirements and submit proposals based on the work involved. You can negotiate when reviewing applications.
                    </p>
                  </div>
                </div>
              </div>

              {/* Section 6 & 7: Timeline & Dates */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-slate-800">
                {/* Section 6: Project Start */}
                <div className="space-y-3">
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-300">
                    When should the freelancer start?
                  </label>
                  <select
                    value={formData.startPreference}
                    onChange={(e) => handleFieldChange('startPreference', e.target.value)}
                    className="w-full px-4 py-3.5 bg-slate-950 border border-slate-800 rounded-2xl text-sm text-white outline-none focus:border-indigo-500 transition"
                  >
                    {START_PREFERENCES.map(pref => (
                      <option key={pref.id} value={pref.id}>{pref.label}</option>
                    ))}
                  </select>

                  {formData.startPreference === 'SPECIFIC_DATE' && (
                    <div className="space-y-1.5 pt-1">
                      <label className="block text-xs font-semibold text-slate-400">Select Start Date</label>
                      <input
                        type="date"
                        min={todayDateString}
                        value={formData.startDate}
                        onChange={(e) => handleFieldChange('startDate', e.target.value)}
                        className={`w-full px-4 py-3 bg-slate-900 border rounded-xl text-sm text-white outline-none transition ${
                          errors.startDate ? 'border-red-500 focus:border-red-400' : 'border-slate-800 focus:border-indigo-500'
                        }`}
                      />
                      {errors.startDate && (
                        <p className="text-xs text-red-400 font-semibold flex items-center gap-1 mt-1">
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span>{errors.startDate}</span>
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Section 7: Project Deadline */}
                <div className="space-y-3">
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-300">
                    When should the project be completed?
                  </label>
                  <select
                    value={formData.deadlineType}
                    onChange={(e) => handleFieldChange('deadlineType', e.target.value)}
                    className="w-full px-4 py-3.5 bg-slate-950 border border-slate-800 rounded-2xl text-sm text-white outline-none focus:border-indigo-500 transition"
                  >
                    {DEADLINE_TYPES.map(type => (
                      <option key={type.id} value={type.id}>{type.label}</option>
                    ))}
                  </select>

                  {formData.deadlineType === 'SPECIFIC_DATE' && (
                    <div className="space-y-1.5 pt-1">
                      <label className="block text-xs font-semibold text-slate-400">Select Project Deadline</label>
                      <input
                        type="date"
                        min={formData.startDate || todayDateString}
                        value={formData.deadlineDate}
                        onChange={(e) => handleFieldChange('deadlineDate', e.target.value)}
                        className={`w-full px-4 py-3 bg-slate-900 border rounded-xl text-sm text-white outline-none transition ${
                          errors.deadlineDate ? 'border-red-500 focus:border-red-400' : 'border-slate-800 focus:border-indigo-500'
                        }`}
                      />
                      {errors.deadlineDate && (
                        <p className="text-xs text-red-400 font-semibold flex items-center gap-1 mt-1">
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span>{errors.deadlineDate}</span>
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Section 8: Live Timeline Summary Card */}
              <div className="p-5 bg-slate-950/80 border border-slate-800 rounded-2xl space-y-3">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                  <Clock className="w-4 h-4 text-indigo-400" />
                  <span>Timeline & Budget Summary</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-900">
                  <div>
                    <div className="text-[11px] font-semibold text-slate-500 uppercase">Estimated Budget</div>
                    <div className="text-sm font-bold text-emerald-400 mt-0.5">{getFormattedBudgetSummary()}</div>
                  </div>
                  <div>
                    <div className="text-[11px] font-semibold text-slate-500 uppercase">Expected Start</div>
                    <div className="text-sm font-bold text-white mt-0.5">{getFormattedStartSummary()}</div>
                  </div>
                  <div>
                    <div className="text-[11px] font-semibold text-slate-500 uppercase">Project Deadline</div>
                    <div className="text-sm font-bold text-indigo-300 mt-0.5">{getFormattedDeadlineSummary()}</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Placeholders for Steps 5 to 7 */}
          {currentStep > 4 && (
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
