import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Check,
  ChevronRight,
  Circle,
  FileEdit,
  Save,
  Sparkles
} from 'lucide-react';
import API from '../services/api';

const steps = [
  { id: 1, label: 'Basics', description: 'Service identity' },
  { id: 2, label: 'Description', description: 'Explain the offer' },
  { id: 3, label: 'Pricing', description: 'Commercial terms' },
  { id: 4, label: 'Scope & Delivery', description: 'Set expectations' },
  { id: 5, label: 'Requirements', description: 'Buyer inputs' },
  { id: 6, label: 'Media & Portfolio', description: 'Build trust' },
  { id: 7, label: 'Discovery', description: 'Improve findability' },
  { id: 8, label: 'FAQ & Policies', description: 'Reduce ambiguity' },
  { id: 9, label: 'Preview', description: 'Review listing' },
  { id: 10, label: 'Submit', description: 'Validate & publish' }
];

// Service types do not exist in the current backend taxonomy yet.
// These are UI-level configuration values keyed by the existing subcategory names.
const SERVICE_TYPES_BY_SUBCATEGORY = {
  'Frontend Development': [
    { id: 'website-frontend', label: 'Website frontend' },
    { id: 'web-application-ui', label: 'Web application UI' },
    { id: 'landing-page', label: 'Landing page' }
  ],
  'Backend Development': [
    { id: 'rest-api', label: 'REST API' },
    { id: 'backend-service', label: 'Backend service' },
    { id: 'api-integration', label: 'API integration' }
  ],
  'Generative AI': [
    { id: 'prompt-engineering', label: 'Prompt engineering' },
    { id: 'ai-chatbot', label: 'AI chatbot' },
    { id: 'llm-integration', label: 'LLM integration' }
  ],
  'Data Science': [
    { id: 'data-analysis', label: 'Data analysis' },
    { id: 'predictive-modeling', label: 'Predictive modeling' },
    { id: 'data-insights', label: 'Data insights' }
  ],
  'Brand Identity': [
    { id: 'logo-identity', label: 'Logo & visual identity' },
    { id: 'brand-guidelines', label: 'Brand guidelines' },
    { id: 'brand-assets', label: 'Brand asset design' }
  ],
  'UI/UX Design': [
    { id: 'website-ui-ux', label: 'Website UI/UX' },
    { id: 'mobile-ui-ux', label: 'Mobile app UI/UX' },
    { id: 'design-system', label: 'Design system' }
  ],
  'Legal Support': [
    { id: 'document-support', label: 'Document support' },
    { id: 'legal-research', label: 'Legal research' },
    { id: 'policy-drafting', label: 'Policy drafting' }
  ]
};

export default function StudentGigCreatePage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState(() => new Set());

  const [basics, setBasics] = useState({
    title: '',
    categoryId: '',
    subcategoryId: '',
    serviceType: ''
  });

  const [categories, setCategories] = useState([]);
  const [categoryLoading, setCategoryLoading] = useState(true);
  const [categoryError, setCategoryError] = useState('');
  const [touchedFields, setTouchedFields] = useState({});
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    let cancelled = false;

    const loadCategories = async () => {
      setCategoryLoading(true);
      setCategoryError('');

      try {
        const response = await API.get('/categories');
        if (!cancelled) {
          setCategories(Array.isArray(response.data) ? response.data : []);
        }
      } catch (error) {
        if (!cancelled) {
          setCategories([]);
          setCategoryError(
            error?.response?.data?.error || 'Unable to load categories right now.'
          );
        }
      } finally {
        if (!cancelled) {
          setCategoryLoading(false);
        }
      }
    };

    loadCategories();

    return () => {
      cancelled = true;
    };
  }, []);

  const selectedCategory = useMemo(
    () => categories.find((category) => category.id === basics.categoryId) || null,
    [categories, basics.categoryId]
  );

  const subcategories = selectedCategory?.subcategories || [];

  const selectedSubcategory = useMemo(
    () =>
      selectedCategory?.subcategories?.find(
        (subcategory) => subcategory.id === basics.subcategoryId
      ) || null,
    [selectedCategory, basics.subcategoryId]
  );

  const serviceTypes = selectedSubcategory
    ? SERVICE_TYPES_BY_SUBCATEGORY[selectedSubcategory.name] || []
    : [];

  const isTitleLengthValid =
    basics.title.trim().length >= 3 && basics.title.trim().length <= 120;

  const isBasicsComplete =
    isTitleLengthValid &&
    Boolean(basics.categoryId) &&
    Boolean(basics.subcategoryId) &&
    Boolean(basics.serviceType);

  const effectiveCompletedSteps = useMemo(() => {
    const next = new Set(completedSteps);

    if (isBasicsComplete) {
      next.add(1);
    } else {
      next.delete(1);
    }

    return next;
  }, [completedSteps, isBasicsComplete]);

  const currentStepData = steps[currentStep - 1];

  const furthestReachableStep = useMemo(
    () => Math.min(
      steps.length,
      Math.max(
        currentStep,
        effectiveCompletedSteps.size ? Math.max(...effectiveCompletedSteps) + 1 : 1
      )
    ),
    [currentStep, effectiveCompletedSteps]
  );

  const completionPercent = Math.round(
    (effectiveCompletedSteps.size / steps.length) * 100
  );

  const validateBasics = () => {
    const nextErrors = {};
    const titleLength = basics.title.trim().length;

    if (titleLength < 3) {
      nextErrors.title = 'Title must be at least 3 characters.';
    } else if (titleLength > 120) {
      nextErrors.title = 'Title must be 120 characters or fewer.';
    }

    if (!basics.categoryId) {
      nextErrors.categoryId = 'Please select a primary category.';
    }

    if (!basics.subcategoryId) {
      nextErrors.subcategoryId = 'Please select a subcategory.';
    }

    if (!basics.serviceType) {
      nextErrors.serviceType = 'Please select a service type.';
    }

    setFieldErrors(nextErrors);
    setTouchedFields({
      title: true,
      categoryId: true,
      subcategoryId: true,
      serviceType: true
    });

    return Object.keys(nextErrors).length === 0;
  };

  const handleBasicsChange = (field, value) => {
    setBasics((previous) => {
      const next = { ...previous, [field]: value };

      if (field === 'categoryId') {
        next.subcategoryId = '';
        next.serviceType = '';
      }

      if (field === 'subcategoryId') {
        next.serviceType = '';
      }

      return next;
    });

    setTouchedFields((previous) => ({
      ...previous,
      [field]: true
    }));

    setFieldErrors((previous) => {
      const next = { ...previous };
      delete next[field];

      if (field === 'categoryId') {
        delete next.subcategoryId;
        delete next.serviceType;
      }

      if (field === 'subcategoryId') {
        delete next.serviceType;
      }

      return next;
    });
  };

  const goToStep = (stepId) => {
    if (stepId >= 1 && stepId <= furthestReachableStep) {
      setCurrentStep(stepId);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNext = () => {
    if (currentStep >= steps.length) return;

    if (currentStep === 1 && !validateBasics()) {
      return;
    }

    setCompletedSteps((previous) => {
      const next = new Set(previous);
      next.add(currentStep);
      return next;
    });

    setCurrentStep((previous) => Math.min(previous + 1, steps.length));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    if (currentStep <= 1) return;
    setCurrentStep((previous) => Math.max(previous - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const titleCount = basics.title.length;

  const titleGuidance = !basics.title.trim()
    ? 'Use a specific service outcome buyers can understand quickly.'
    : titleCount < 3
      ? 'Add a few more characters so the service is clearly identified.'
      : titleCount < 20
        ? 'Good start. Make the outcome or service specific where possible.'
        : titleCount <= 120
          ? 'Looks clear. Keep the wording focused on the service you provide.'
          : 'Shorten the title to 120 characters or fewer.';

  const titleStateClass = touchedFields.title
    ? isTitleLengthValid
      ? 'border-emerald-500/40 focus:border-emerald-400'
      : 'border-red-500/50 focus:border-red-400'
    : 'border-slate-800 focus:border-cyan-500';

  const renderBasics = () => (
    <div className="mt-8 space-y-7">
      <section className="rounded-3xl border border-slate-800 bg-slate-950/35 p-5 sm:p-7">
        <div className="max-w-3xl">
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-cyan-400">
            Service identity
          </p>
          <h3 className="text-xl sm:text-2xl font-black text-white mt-2">
            Tell buyers exactly what you provide
          </h3>
          <p className="text-sm leading-6 text-slate-500 mt-2">
            Start with a clear service title, then narrow it through the category hierarchy.
          </p>
        </div>

        <div className="mt-8 space-y-2.5">
          <div className="flex items-center justify-between gap-4">
            <label
              htmlFor="gig-title"
              className="text-xs font-black uppercase tracking-wider text-slate-300"
            >
              Service title <span className="text-pink-500">*</span>
            </label>
            <span
              className={`text-[11px] font-bold ${
                isTitleLengthValid ? 'text-emerald-400' : 'text-slate-500'
              }`}
            >
              {titleCount}/120
            </span>
          </div>

          <input
            id="gig-title"
            type="text"
            maxLength={120}
            value={basics.title}
            onChange={(event) => handleBasicsChange('title', event.target.value)}
            placeholder="e.g. Build a responsive React dashboard for your startup"
            aria-invalid={Boolean(fieldErrors.title)}
            aria-describedby="gig-title-guidance gig-title-error"
            className={`w-full px-4 py-3.5 bg-slate-950 rounded-2xl text-sm text-white outline-none transition ${titleStateClass}`}
          />

          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
            <p id="gig-title-guidance" className="text-xs leading-5 text-slate-500">
              {titleGuidance}
            </p>
            {fieldErrors.title && (
              <p
                id="gig-title-error"
                className="text-xs font-semibold text-red-400 sm:text-right"
              >
                {fieldErrors.title}
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-800 bg-slate-950/35 p-5 sm:p-7">
        <div className="max-w-3xl">
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-cyan-400">
            Category hierarchy
          </p>
          <h3 className="text-xl sm:text-2xl font-black text-white mt-2">
            Narrow the service to the right category
          </h3>
          <p className="text-sm leading-6 text-slate-500 mt-2">
            Subcategories and service types become available only after their parent selection.
          </p>
        </div>

        {categoryLoading ? (
          <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-950/60 p-4 text-sm text-slate-500">
            Loading available categories…
          </div>
        ) : categoryError ? (
          <div className="mt-8 rounded-2xl border border-red-500/20 bg-red-500/5 p-4">
            <p className="text-sm font-semibold text-red-300">{categoryError}</p>
            <p className="text-xs text-slate-500 mt-1">
              Category selection is unavailable until the taxonomy can be loaded.
            </p>
          </div>
        ) : categories.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4">
            <p className="text-sm font-semibold text-amber-300">
              No categories are currently available.
            </p>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className="space-y-2.5">
              <label
                htmlFor="gig-category"
                className="block text-xs font-black uppercase tracking-wider text-slate-300"
              >
                Primary category <span className="text-pink-500">*</span>
              </label>
              <select
                id="gig-category"
                value={basics.categoryId}
                onChange={(event) =>
                  handleBasicsChange('categoryId', event.target.value)
                }
                aria-invalid={Boolean(fieldErrors.categoryId)}
                className={`w-full px-4 py-3.5 bg-slate-950 border rounded-2xl text-sm text-white outline-none transition ${
                  fieldErrors.categoryId
                    ? 'border-red-500/50 focus:border-red-400'
                    : 'border-slate-800 focus:border-cyan-500'
                }`}
              >
                <option value="">Select a category…</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {fieldErrors.categoryId && (
                <p className="text-xs font-semibold text-red-400">
                  {fieldErrors.categoryId}
                </p>
              )}
            </div>

            <div className="space-y-2.5">
              <label
                htmlFor="gig-subcategory"
                className="block text-xs font-black uppercase tracking-wider text-slate-300"
              >
                Subcategory <span className="text-pink-500">*</span>
              </label>
              <select
                id="gig-subcategory"
                value={basics.subcategoryId}
                disabled={!basics.categoryId}
                onChange={(event) =>
                  handleBasicsChange('subcategoryId', event.target.value)
                }
                aria-invalid={Boolean(fieldErrors.subcategoryId)}
                className={`w-full px-4 py-3.5 bg-slate-950 border rounded-2xl text-sm text-white outline-none transition disabled:opacity-50 disabled:cursor-not-allowed ${
                  fieldErrors.subcategoryId
                    ? 'border-red-500/50 focus:border-red-400'
                    : 'border-slate-800 focus:border-cyan-500'
                }`}
              >
                <option value="">
                  {!basics.categoryId
                    ? 'Select a category first…'
                    : 'Select a subcategory…'}
                </option>
                {subcategories.map((subcategory) => (
                  <option key={subcategory.id} value={subcategory.id}>
                    {subcategory.name}
                  </option>
                ))}
              </select>
              {fieldErrors.subcategoryId && (
                <p className="text-xs font-semibold text-red-400">
                  {fieldErrors.subcategoryId}
                </p>
              )}
            </div>

            <div className="space-y-2.5">
              <label
                htmlFor="gig-service-type"
                className="block text-xs font-black uppercase tracking-wider text-slate-300"
              >
                Service type <span className="text-pink-500">*</span>
              </label>
              <select
                id="gig-service-type"
                value={basics.serviceType}
                disabled={!basics.subcategoryId || serviceTypes.length === 0}
                onChange={(event) =>
                  handleBasicsChange('serviceType', event.target.value)
                }
                aria-invalid={Boolean(fieldErrors.serviceType)}
                className={`w-full px-4 py-3.5 bg-slate-950 border rounded-2xl text-sm text-white outline-none transition disabled:opacity-50 disabled:cursor-not-allowed ${
                  fieldErrors.serviceType
                    ? 'border-red-500/50 focus:border-red-400'
                    : 'border-slate-800 focus:border-cyan-500'
                }`}
              >
                <option value="">
                  {!basics.subcategoryId
                    ? 'Select a subcategory first…'
                    : serviceTypes.length === 0
                      ? 'No service types configured…'
                      : 'Select a service type…'}
                </option>
                {serviceTypes.map((serviceType) => (
                  <option key={serviceType.id} value={serviceType.id}>
                    {serviceType.label}
                  </option>
                ))}
              </select>
              {fieldErrors.serviceType ? (
                <p className="text-xs font-semibold text-red-400">
                  {fieldErrors.serviceType}
                </p>
              ) : basics.subcategoryId && serviceTypes.length === 0 ? (
                <p className="text-xs leading-5 text-amber-400/80">
                  Service-type options are not configured for this subcategory yet.
                </p>
              ) : (
                <p className="text-xs leading-5 text-slate-600">
                  Choose the closest service format for this listing.
                </p>
              )}
            </div>
          </div>
        )}

        {selectedCategory && selectedSubcategory && serviceTypes.length > 0 && (
          <div className="mt-6 flex flex-wrap items-center gap-2 text-[11px] font-bold text-slate-500">
            <span className="rounded-lg border border-slate-800 bg-slate-950/70 px-2.5 py-1.5">
              {selectedCategory.name}
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-700" />
            <span className="rounded-lg border border-slate-800 bg-slate-950/70 px-2.5 py-1.5">
              {selectedSubcategory.name}
            </span>
          </div>
        )}
      </section>

      {!isBasicsComplete && (
        <div className="rounded-2xl border border-slate-800 bg-slate-950/60 px-4 py-3">
          <p className="text-xs font-bold text-slate-400">
            Complete the required title and category selections to continue.
          </p>
        </div>
      )}
    </div>
  );

  const renderPlaceholder = () => (
    <div className="mt-8 rounded-3xl border border-dashed border-slate-700 bg-slate-950/35 p-6 sm:p-8">
      <div className="max-w-xl">
        <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-indigo-300" />
        </div>

        <h3 className="text-lg sm:text-xl font-black text-white mt-5">
          {currentStepData.label} step is ready
        </h3>

        <p className="text-sm leading-6 text-slate-500 mt-2">
          Navigation is now controlled across the complete creation flow.
          Completed steps remain available for review without resetting your place in the workflow.
        </p>
      </div>
    </div>
  );

  return (
    <div className="min-h-[calc(100vh-7rem)] pb-16">
      <div className="max-w-[1500px] mx-auto">
        <section className="glass-panel rounded-3xl border border-slate-800 overflow-hidden">
          <header className="border-b border-slate-800 bg-gradient-to-r from-cyan-500/10 via-transparent to-indigo-500/10">
            <div className="px-5 sm:px-7 lg:px-9 py-5 sm:py-6">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                <div className="min-w-0">
                  <Link
                    to="/student/gigs"
                    className="inline-flex items-center gap-2 text-xs font-black text-slate-400 hover:text-white transition"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back to My Gigs
                  </Link>

                  <div className="flex items-start gap-3 mt-5">
                    <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
                      <FileEdit className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400" />
                    </div>

                    <div className="min-w-0">
                      <p className="text-[10px] font-black uppercase tracking-[0.18em] text-cyan-400">
                        Student Workspace
                      </p>
                      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white mt-1">
                        Create a Service
                      </h1>
                      <p className="text-sm leading-6 text-slate-500 mt-2 max-w-2xl">
                        Build a clear, trustworthy service listing buyers can understand before they order.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 flex-wrap">
                  <div className="inline-flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-3 py-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-300">
                      Ready to edit
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => navigate('/student/gigs')}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-950/50 text-xs font-black text-slate-300 hover:text-white hover:border-slate-600 transition"
                  >
                    <Save className="w-4 h-4" />
                    Save Draft
                  </button>
                </div>
              </div>
            </div>

            <div className="px-5 sm:px-7 lg:px-9 pb-5">
              <div className="flex items-center justify-between gap-4 mb-2">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-500">
                    Overall Progress
                  </p>
                  <p className="text-sm font-black text-white mt-1">
                    {completionPercent}% complete
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-600">
                    Current step
                  </p>
                  <p className="text-sm font-black text-cyan-300 mt-1">
                    {currentStep} of {steps.length}
                  </p>
                </div>
              </div>

              <div className="h-2 rounded-full bg-slate-900 border border-slate-800 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-indigo-500 to-violet-500 transition-all"
                  style={{ width: `${completionPercent}%` }}
                />
              </div>
            </div>
          </header>

          <div className="grid lg:grid-cols-[290px_minmax(0,1fr)]">
            <aside className="border-b lg:border-b-0 lg:border-r border-slate-800 bg-slate-950/35 p-4 sm:p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-cyan-400">
                    Creation Flow
                  </p>
                  <h2 className="text-sm font-black text-white mt-1">
                    Build your service
                  </h2>
                </div>

                <div className="hidden sm:flex items-center gap-1.5 text-[10px] font-black text-slate-500">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  Guided
                </div>
              </div>

              <nav
                aria-label="Gig creation steps"
                className="flex gap-2 overflow-x-auto pb-1 lg:grid lg:grid-cols-1 lg:overflow-visible"
              >
                {steps.map((step) => {
                  const isCurrent = step.id === currentStep;
                  const isComplete = effectiveCompletedSteps.has(step.id);
                  const isReachable = step.id <= furthestReachableStep;

                  return (
                    <button
                      key={step.id}
                      type="button"
                      onClick={() => goToStep(step.id)}
                      disabled={!isReachable}
                      aria-current={isCurrent ? 'step' : undefined}
                      aria-label={`${step.label}${isComplete ? ', completed' : isCurrent ? ', current step' : ', upcoming'}`}
                      className={[
                        'w-full min-w-[190px] lg:min-w-0 text-left rounded-2xl border px-3.5 py-3 transition',
                        isCurrent
                          ? 'border-cyan-500/30 bg-cyan-500/10 shadow-lg shadow-cyan-500/5'
                          : isComplete
                            ? 'border-emerald-500/20 bg-emerald-500/5 hover:border-emerald-500/30 hover:bg-emerald-500/10'
                            : 'border-slate-800 bg-slate-950/30 opacity-75',
                        !isReachable ? 'cursor-not-allowed' : 'cursor-pointer'
                      ].join(' ')}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={[
                            'w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border',
                            isComplete
                              ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                              : isCurrent
                                ? 'border-cyan-500/30 bg-cyan-500/10 text-cyan-300'
                                : 'border-slate-800 bg-slate-900 text-slate-600'
                          ].join(' ')}
                        >
                          {isComplete ? (
                            <Check className="w-4 h-4" />
                          ) : isCurrent ? (
                            <span className="text-[11px] font-black">{step.id}</span>
                          ) : (
                            <Circle className="w-3.5 h-3.5" />
                          )}
                        </div>

                        <div className="min-w-0">
                          <p className={`text-xs font-black ${isCurrent ? 'text-white' : 'text-slate-400'}`}>
                            {step.label}
                          </p>
                          <p className="text-[10px] text-slate-600 mt-0.5 truncate">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </nav>
            </aside>

            <main className="min-w-0 p-5 sm:p-7 lg:p-10">
              <div className="max-w-4xl">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-cyan-400">
                      Step {currentStep}
                    </p>
                    <h2 className="text-2xl sm:text-3xl font-black text-white mt-2">
                      {currentStepData.label}
                    </h2>
                    <p className="text-sm leading-6 text-slate-500 mt-2 max-w-2xl">
                      {currentStep === 1
                        ? 'Identify the service with a clear title and precise category hierarchy.'
                        : `${currentStepData.description}. This step is part of the guided service creation workflow.`}
                    </p>
                  </div>

                  <div className="hidden sm:flex w-11 h-11 rounded-2xl bg-slate-900 border border-slate-800 items-center justify-center">
                    <FileEdit className="w-5 h-5 text-slate-500" />
                  </div>
                </div>

                {currentStep === 1 ? renderBasics() : renderPlaceholder()}

                <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3 mt-8 pt-6 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => navigate('/student/gigs')}
                    className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-slate-700 bg-slate-950/50 text-xs font-black text-slate-300 hover:text-white hover:border-slate-600 transition"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Exit
                  </button>

                  <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                    {currentStep > 1 && (
                      <button
                        type="button"
                        onClick={handleBack}
                        className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-slate-700 bg-slate-950/50 text-xs font-black text-slate-300 hover:text-white hover:border-slate-600 transition"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        Back
                      </button>
                    )}

                    {currentStep < steps.length && (
                      <button
                        type="button"
                        onClick={handleNext}
                        className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-cyan-500 text-slate-950 text-xs font-black hover:bg-cyan-400 transition shadow-lg shadow-cyan-500/15"
                      >
                        Continue
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </main>
          </div>
        </section>
      </div>
    </div>
  );
}
