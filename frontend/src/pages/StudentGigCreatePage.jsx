import React, { useMemo, useState } from 'react';
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

export default function StudentGigCreatePage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState(() => new Set());

  const currentStepData = steps[currentStep - 1];

  const furthestReachableStep = useMemo(
    () => Math.min(
      steps.length,
      Math.max(currentStep, completedSteps.size ? Math.max(...completedSteps) + 1 : 1)
    ),
    [currentStep, completedSteps]
  );

  const completionPercent = Math.round((completedSteps.size / steps.length) * 100);

  const goToStep = (stepId) => {
    if (stepId >= 1 && stepId <= furthestReachableStep) {
      setCurrentStep(stepId);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNext = () => {
    if (currentStep >= steps.length) return;

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
                  const isComplete = completedSteps.has(step.id);
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
                      {currentStepData.description}. This step is part of the guided service creation workflow.
                      Detailed fields will be added as each requirement is implemented.
                    </p>
                  </div>

                  <div className="hidden sm:flex w-11 h-11 rounded-2xl bg-slate-900 border border-slate-800 items-center justify-center">
                    <FileEdit className="w-5 h-5 text-slate-500" />
                  </div>
                </div>

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
