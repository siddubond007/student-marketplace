import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Briefcase, 
  FileText, 
  Layers, 
  DollarSign, 
  Paperclip, 
  Sliders, 
  CheckCircle2, 
  ArrowLeft, 
  ArrowRight, 
  Save, 
  Sparkles, 
  Check, 
  Lock 
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

export default function PostJobPage({ currentUser }) {
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const isAuthenticated = Boolean(currentUser || token);

  const [currentStep, setCurrentStep] = useState(1);
  const [saveStatus, setSaveStatus] = useState('');
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    title: '',
    category: 'Web Development',
    subcategory: '',
    projectScope: 'MEDIUM',
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
    setFormData(prev => ({ ...prev, [field]: value }));
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
      if (!formData.title.trim() || formData.title.trim().length < 5) {
        stepErrors.title = 'Job title must be at least 5 characters long';
      }
      if (!formData.category) {
        stepErrors.category = 'Please select a category';
      }
    } else if (step === 2) {
      if (!formData.description.trim() || formData.description.trim().length < 20) {
        stepErrors.description = 'Please provide a project description (at least 20 characters)';
      }
    } else if (step === 4) {
      if (!formData.budget || Number(formData.budget) <= 0) {
        stepErrors.budget = 'Please specify a valid budget amount';
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
      setSaveStatus('Failed to save draft locally.');
    }
  };

  const handlePublish = async () => {
    if (!validateCurrentStep(currentStep)) return;
    alert('Job posting foundation ready! Backend submission will be connected in subsequent requirements.');
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

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">

        {/* Page Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4" />
              <span>Client Project Hub</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">Post a Job</h1>
            <p className="text-sm text-slate-400 mt-1">Hire verified college talent, developers, and creators for your project.</p>
          </div>

          <div className="flex items-center gap-3 self-stretch sm:self-auto">
            <button 
              type="button" 
              onClick={handleSaveDraft}
              className="px-4 py-2.5 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition"
            >
              <Save className="w-4 h-4 text-indigo-400" />
              <span>Save Draft</span>
            </button>
            {saveStatus && (
              <span className="text-xs text-emerald-400 font-semibold animate-pulse">{saveStatus}</span>
            )}
          </div>
        </div>

        {/* Multi-Step Progress Indicator */}
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
                    isCurrent 
                      ? 'bg-indigo-600/20 border border-indigo-500/40 text-white' 
                      : isCompleted 
                        ? 'text-emerald-400 hover:bg-slate-900/60 cursor-pointer' 
                        : 'text-slate-600 opacity-60 cursor-not-allowed'
                  }`}
                >
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-black mb-1.5 transition-all ${
                    isCurrent 
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30 ring-2 ring-indigo-400/50' 
                      : isCompleted 
                        ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-400' 
                        : 'bg-slate-950 border border-slate-800 text-slate-500'
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
            <div 
              className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 h-full transition-all duration-300 rounded-full"
              style={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}
            />
          </div>
        </div>

        {/* Step Container */}
        <div className="glass-panel p-6 sm:p-10 rounded-3xl border border-slate-800 shadow-2xl space-y-8 min-h-[400px]">
          <div className="space-y-1">
            <div className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Step {currentStep}</div>
            <h2 className="text-2xl font-black text-white">{STEPS[currentStep - 1].label}</h2>
            <p className="text-xs sm:text-sm text-slate-400">{STEPS[currentStep - 1].desc}</p>
          </div>

          {/* Step 1: Basics */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="block text-xs font-black uppercase tracking-wider text-slate-300">Project Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleFieldChange('title', e.target.value)}
                  placeholder="e.g. Build a Responsive React & Tailwind Dashboard for Fintech App"
                  className={`w-full px-4 py-3.5 bg-slate-950 border rounded-2xl text-sm text-white outline-none transition ${
                    errors.title ? 'border-red-500 focus:border-red-400' : 'border-slate-800 focus:border-indigo-500'
                  }`}
                />
                {errors.title && <p className="text-xs text-red-400 font-semibold">{errors.title}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-300">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleFieldChange('category', e.target.value)}
                    className="w-full px-4 py-3.5 bg-slate-950 border border-slate-800 rounded-2xl text-sm text-white outline-none focus:border-indigo-500"
                  >
                    <option value="Web Development">Web Development & Full Stack</option>
                    <option value="Mobile App Development">Mobile App Development</option>
                    <option value="UI/UX Design">UI/UX & Product Design</option>
                    <option value="AI & Machine Learning">AI, ML & Data Science</option>
                    <option value="Content & Copywriting">Content & Copywriting</option>
                    <option value="Video Editing & Animation">Video Editing & Animation</option>
                    <option value="Digital Marketing">Digital Marketing & SEO</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-300">Project Scope</label>
                  <select
                    value={formData.projectScope}
                    onChange={(e) => handleFieldChange('projectScope', e.target.value)}
                    className="w-full px-4 py-3.5 bg-slate-950 border border-slate-800 rounded-2xl text-sm text-white outline-none focus:border-indigo-500"
                  >
                    <option value="SMALL">Small (Quick task, 1-7 days)</option>
                    <option value="MEDIUM">Medium (Standard project, 1-4 weeks)</option>
                    <option value="LARGE">Large (Complex system, 1-3 months)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Description */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="block text-xs font-black uppercase tracking-wider text-slate-300">Detailed Description *</label>
                <textarea
                  rows={6}
                  value={formData.description}
                  onChange={(e) => handleFieldChange('description', e.target.value)}
                  placeholder="Describe your project goals, key features, target audience, and expectations..."
                  className={`w-full px-4 py-3.5 bg-slate-950 border rounded-2xl text-sm text-white outline-none transition ${
                    errors.description ? 'border-red-500 focus:border-red-400' : 'border-slate-800 focus:border-indigo-500'
                  }`}
                />
                {errors.description && <p className="text-xs text-red-400 font-semibold">{errors.description}</p>}
              </div>
              <div className="space-y-2">
                <label className="block text-xs font-black uppercase tracking-wider text-slate-300">Key Deliverables (Optional)</label>
                <textarea
                  rows={3}
                  value={formData.deliverables}
                  onChange={(e) => handleFieldChange('deliverables', e.target.value)}
                  placeholder="List specific files, source code repository, or live deployments expected..."
                  className="w-full px-4 py-3.5 bg-slate-950 border border-slate-800 rounded-2xl text-sm text-white outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          )}

          {/* Step 3: Skills & Experience */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="block text-xs font-black uppercase tracking-wider text-slate-300">Student Experience Level</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { id: 'ENTRY', label: 'Rising Star (Junior)', desc: 'Talented beginner students looking for portfolio experience' },
                    { id: 'INTERMEDIATE', label: 'Intermediate', desc: 'Students with proven coursework & prior freelance projects' },
                    { id: 'EXPERT', label: 'Senior / Top Tier', desc: 'High-performing student developers with comprehensive skills' }
                  ].map(lvl => (
                    <button
                      key={lvl.id}
                      type="button"
                      onClick={() => handleFieldChange('experienceLevel', lvl.id)}
                      className={`p-4 rounded-2xl text-left border transition-all ${
                        formData.experienceLevel === lvl.id
                          ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-lg shadow-indigo-500/10'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className="text-sm font-bold text-white mb-1">{lvl.label}</div>
                      <div className="text-xs text-slate-400">{lvl.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Budget & Timeline */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-300">Budget (INR ₹) *</label>
                  <input
                    type="number"
                    value={formData.budget}
                    onChange={(e) => handleFieldChange('budget', e.target.value)}
                    placeholder="e.g. 5000"
                    className={`w-full px-4 py-3.5 bg-slate-950 border rounded-2xl text-sm text-white outline-none transition ${
                      errors.budget ? 'border-red-500 focus:border-red-400' : 'border-slate-800 focus:border-indigo-500'
                    }`}
                  />
                  {errors.budget && <p className="text-xs text-red-400 font-semibold">{errors.budget}</p>}
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-300">Expected Timeline</label>
                  <select
                    value={formData.duration}
                    onChange={(e) => handleFieldChange('duration', e.target.value)}
                    className="w-full px-4 py-3.5 bg-slate-950 border border-slate-800 rounded-2xl text-sm text-white outline-none focus:border-indigo-500"
                  >
                    <option value="LESS_THAN_1_WEEK">Less than 1 week</option>
                    <option value="1_TO_4_WEEKS">1 to 4 weeks</option>
                    <option value="1_TO_3_MONTHS">1 to 3 months</option>
                    <option value="3_TO_6_MONTHS">3 to 6 months</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Files & References */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="block text-xs font-black uppercase tracking-wider text-slate-300">Reference Links or Documentation</label>
                <input
                  type="text"
                  value={formData.referenceLinks}
                  onChange={(e) => handleFieldChange('referenceLinks', e.target.value)}
                  placeholder="https://figma.com/... or https://github.com/..."
                  className="w-full px-4 py-3.5 bg-slate-950 border border-slate-800 rounded-2xl text-sm text-white outline-none focus:border-indigo-500"
                />
              </div>
              <div className="p-8 border-2 border-dashed border-slate-800 rounded-3xl text-center space-y-2 bg-slate-950/40">
                <Paperclip className="w-8 h-8 text-slate-600 mx-auto" />
                <div className="text-sm font-bold text-slate-300">Upload Project Brief or Attachments</div>
                <div className="text-xs text-slate-500">PDF, PNG, JPG, ZIP up to 25MB (Full upload integration in next phase)</div>
              </div>
            </div>
          )}

          {/* Step 6: Additional Options */}
          {currentStep === 6 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="block text-xs font-black uppercase tracking-wider text-slate-300">Project Visibility</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { id: 'PUBLIC', label: 'Public Marketplace', desc: 'Visible to all verified student freelancers across colleges' },
                    { id: 'INVITE_ONLY', label: 'Direct Invite Only', desc: 'Only students you directly invite can view and apply' }
                  ].map(vis => (
                    <button
                      key={vis.id}
                      type="button"
                      onClick={() => handleFieldChange('visibility', vis.id)}
                      className={`p-4 rounded-2xl text-left border transition-all ${
                        formData.visibility === vis.id
                          ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-lg shadow-indigo-500/10'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className="text-sm font-bold text-white mb-1">{vis.label}</div>
                      <div className="text-xs text-slate-400">{vis.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 7: Review & Publish */}
          {currentStep === 7 && (
            <div className="space-y-6">
              <div className="p-6 bg-slate-950/60 border border-slate-800 rounded-2xl space-y-4">
                <div>
                  <div className="text-xs text-slate-500 font-bold uppercase">Title</div>
                  <div className="text-lg font-bold text-white">{formData.title || 'Untitled Project'}</div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2 border-t border-slate-800">
                  <div>
                    <div className="text-xs text-slate-500 font-bold uppercase">Category</div>
                    <div className="text-sm font-semibold text-indigo-400">{formData.category}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 font-bold uppercase">Budget</div>
                    <div className="text-sm font-semibold text-emerald-400">₹{formData.budget || 'Not set'}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 font-bold uppercase">Timeline</div>
                    <div className="text-sm font-semibold text-slate-300">{formData.duration.replace(/_/g, ' ')}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 font-bold uppercase">Experience</div>
                    <div className="text-sm font-semibold text-purple-400">{formData.experienceLevel}</div>
                  </div>
                </div>
                {formData.description && (
                  <div className="pt-2 border-t border-slate-800">
                    <div className="text-xs text-slate-500 font-bold uppercase mb-1">Description</div>
                    <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">{formData.description}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Bottom Navigation Buttons */}
          <div className="flex flex-col-reverse sm:flex-row justify-between items-center gap-4 pt-6 border-t border-slate-800">
            <div>
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={handleBack}
                  className="w-full sm:w-auto px-6 py-3 bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-300 text-xs font-black rounded-xl flex items-center justify-center gap-2 transition"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
              ) : (
                <div />
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
                  onClick={handlePublish}
                  className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 text-white text-xs font-black rounded-xl flex items-center justify-center gap-2 transition shadow-lg shadow-emerald-500/25 hover:scale-[1.02] active:scale-[0.98]"
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
