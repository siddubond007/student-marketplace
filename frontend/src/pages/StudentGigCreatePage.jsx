import React, { useDeferredValue, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';
import {
  ArrowLeft,
  Check,
  ChevronRight,
  Circle,
  FileEdit,
  Save,
  Search,
  X,
  Sparkles,
  Plus
} from 'lucide-react';
import { GIG_CATEGORY_OPTIONS, GIG_SUBCATEGORY_OPTIONS, GIG_SERVICE_TYPE_OPTIONS } from '../data/gigTaxonomyData.js';
import { ALL_SKILLS_DATABASE } from '../data/skillsData.js';
import RichTextEditor from '../components/RichTextEditor.jsx';
import { richTextToPlainText } from '../utils/richText.js';

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


function SearchableSelect({
  id,
  label,
  value,
  options,
  placeholder,
  disabled = false,
  error,
  onChange,
  onOpenChange
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const [availableHeight, setAvailableHeight] = useState(288);
  const [dropdownPosition, setDropdownPosition] = useState({
    top: 0,
    left: 0,
    width: 0,
    openUp: false
  });
  const triggerRef = useRef(null);
  const optionRefs = useRef([]);

  useEffect(() => {
    if (!open) return undefined;

    const updateDropdownPosition = () => {
      const trigger = triggerRef.current;
      if (!trigger) return;

      const rect = trigger.getBoundingClientRect();
      const viewportPadding = 16;
      const gap = 8;

      const spaceAbove = Math.max(
        0,
        rect.top - viewportPadding - gap
      );

      const spaceBelow = Math.max(
        0,
        window.innerHeight - rect.bottom - viewportPadding - gap
      );

      const openUp = spaceBelow < 260 && spaceAbove > spaceBelow;
      const availableSpace = openUp ? spaceAbove : spaceBelow;

      const dropdownWidth = rect.width;
      const maxLeft = Math.max(
        viewportPadding,
        window.innerWidth - dropdownWidth - viewportPadding
      );

      setDropdownPosition({
        top: openUp ? rect.top - gap : rect.bottom + gap,
        left: Math.min(Math.max(rect.left, viewportPadding), maxLeft),
        width: dropdownWidth,
        openUp
      });

      setAvailableHeight(
        Math.max(
          160,
          Math.min(360, availableSpace)
        )
      );
    };

    updateDropdownPosition();

    window.addEventListener('resize', updateDropdownPosition);
    window.addEventListener('scroll', updateDropdownPosition, true);

    return () => {
      window.removeEventListener('resize', updateDropdownPosition);
      window.removeEventListener('scroll', updateDropdownPosition, true);
    };
  }, [open]);

  const selectedOption = options.find((option) => option.id === value) || null;

  const filteredOptions = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return options;
    }

    return options.filter((option) =>
      option.name.toLowerCase().includes(normalizedQuery)
    );
  }, [options, query]);

  const activeIndex = filteredOptions.length
    ? Math.min(highlightedIndex, filteredOptions.length - 1)
    : 0;

  const setDropdownOpen = (nextOpen) => {
    setOpen(nextOpen);
    onOpenChange?.(nextOpen);

    if (nextOpen) {
      setQuery('');
      setHighlightedIndex(0);
      return;
    }

    setQuery('');
    setHighlightedIndex(0);
    window.requestAnimationFrame(() => triggerRef.current?.focus());
  };

  const handleSelect = (option) => {
    onChange(option.id);
    setDropdownOpen(false);
  };

  const handleSearchKeyDown = (event) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();

      if (!filteredOptions.length) return;

      const nextIndex = (activeIndex + 1) % filteredOptions.length;
      setHighlightedIndex(nextIndex);

      window.requestAnimationFrame(() =>
        optionRefs.current[nextIndex]?.scrollIntoView({
          block: 'nearest'
        })
      );
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();

      if (!filteredOptions.length) return;

      const nextIndex =
        (activeIndex - 1 + filteredOptions.length) % filteredOptions.length;

      setHighlightedIndex(nextIndex);

      window.requestAnimationFrame(() =>
        optionRefs.current[nextIndex]?.scrollIntoView({
          block: 'nearest'
        })
      );
    }

    if (event.key === 'Enter') {
      event.preventDefault();

      if (filteredOptions[activeIndex]) {
        handleSelect(filteredOptions[activeIndex]);
      }
    }

    if (event.key === 'Escape') {
      event.preventDefault();
      setDropdownOpen(false);
    }
  };

  const renderMatch = (text) => {
    const normalizedQuery = query.trim();

    if (!normalizedQuery) return text;

    const escapedQuery = normalizedQuery.replace(
      /[.*+?^${}()|[\]\\]/g,
      '\\$&'
    );

    const parts = text.split(new RegExp(`(${escapedQuery})`, 'ig'));

    return parts.map((part, index) =>
      part.toLowerCase() === normalizedQuery.toLowerCase() ? (
        <mark
          key={`${part}-${index}`}
          className="rounded bg-cyan-500/15 px-0.5 text-cyan-200"
        >
          {part}
        </mark>
      ) : (
        <span key={`${part}-${index}`}>{part}</span>
      )
    );
  };

  return (
    <div className="relative space-y-2.5">
      <label
        htmlFor={`${id}-trigger`}
        className="block text-xs font-black uppercase tracking-wider text-slate-300"
      >
        {label} <span className="text-pink-500">*</span>
      </label>

      <div className="relative">
        <button
          ref={triggerRef}
          id={`${id}-trigger`}
          type="button"
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={`${id}-listbox`}
          aria-invalid={Boolean(error)}
          onClick={() => setDropdownOpen(!open)}
          onKeyDown={(event) => {
            if (
              !open &&
              (event.key === 'ArrowDown' ||
                event.key === 'Enter' ||
                event.key === ' ')
            ) {
              event.preventDefault();
              setDropdownOpen(true);
            }
          }}
          className={`w-full min-h-[52px] flex items-center justify-between gap-3 px-4 py-3.5 bg-slate-950 border rounded-2xl text-sm text-left outline-none transition ${
            error
              ? 'border-red-500/50 focus:border-red-400'
              : open
                ? 'border-cyan-500'
                : 'border-slate-800 hover:border-slate-700'
          } ${
            disabled
              ? 'opacity-50 cursor-not-allowed'
              : 'cursor-pointer'
          }`}
        >
          <span
            className={`min-w-0 truncate ${
              selectedOption ? 'text-white' : 'text-slate-500'
            }`}
          >
            {selectedOption?.name || placeholder}
          </span>

          <ChevronRight
            className={`w-4 h-4 shrink-0 text-slate-500 transition-transform ${
              open ? 'rotate-90' : ''
            }`}
          />
        </button>

        {open && !disabled && createPortal(
          <>
            <button
              type="button"
              aria-label={`Close ${label} dropdown`}
              onClick={() => setDropdownOpen(false)}
              className="fixed inset-0 z-[9998] cursor-default"
            />

            <div
              id={`${id}-listbox`}
              role="listbox"
              aria-label={label}
              className="fixed z-[9999] overflow-hidden rounded-2xl border border-slate-700 bg-slate-950 shadow-2xl shadow-black/60 ring-1 ring-white/5"
              style={{
                left: `${dropdownPosition.left}px`,
                width: `${dropdownPosition.width}px`,
                ...(dropdownPosition.openUp
                  ? {
                      bottom: `${window.innerHeight - dropdownPosition.top}px`
                    }
                  : {
                      top: `${dropdownPosition.top}px`
                    })
              }}
            >
              <div className="border-b border-slate-800 p-2.5">
                <div className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/80 px-3 focus-within:border-cyan-500/50">
                  <Search className="w-4 h-4 shrink-0 text-slate-500" />

                  <input
                    autoFocus
                    value={query}
                    onChange={(event) => {
                      setQuery(event.target.value);
                      setHighlightedIndex(0);
                    }}
                    onKeyDown={handleSearchKeyDown}
                    placeholder={`Search ${label.toLowerCase()}...`}
                    aria-controls={`${id}-listbox-options`}
                    className="w-full bg-transparent py-2.5 text-sm text-white placeholder:text-slate-600 outline-none"
                  />

                  {query && (
                    <button
                      type="button"
                      aria-label={`Clear ${label} search`}
                      onClick={() => {
                        setQuery('');
                        setHighlightedIndex(0);
                      }}
                      className="rounded-lg p-1 text-slate-500 hover:bg-slate-800 hover:text-white transition"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              <div
                id={`${id}-listbox-options`}
                className="overflow-y-auto p-1.5 scrollbar-hide"
                style={{ maxHeight: `${availableHeight}px` }}
              >
                {filteredOptions.length > 0 ? (
                  filteredOptions.map((option, index) => {
                    const isSelected = option.id === value;
                    const isHighlighted = index === activeIndex;

                    return (
                      <button
                        key={option.id}
                        ref={(element) => {
                          optionRefs.current[index] = element;
                        }}
                        id={`${id}-option-${index}`}
                        type="button"
                        role="option"
                        aria-selected={isSelected}
                        onMouseEnter={() => setHighlightedIndex(index)}
                        onClick={() => handleSelect(option)}
                        className={`w-full flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition ${
                          isSelected
                            ? 'bg-cyan-500/10 text-cyan-300'
                            : isHighlighted
                              ? 'bg-slate-900 text-white'
                              : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                        }`}
                      >
                        <span className="min-w-0 truncate">
                          {renderMatch(option.name)}
                        </span>

                        {isSelected && (
                          <Check className="w-4 h-4 shrink-0 text-cyan-400" />
                        )}
                      </button>
                    );
                  })
                ) : (
                  <div className="px-3 py-8 text-center">
                    <Search className="w-5 h-5 mx-auto text-slate-600" />
                    <p className="mt-2 text-xs font-semibold text-slate-500">
                      No {label.toLowerCase()} found.
                    </p>
                    <p className="mt-1 text-[11px] text-slate-700">
                      Try a different search term.
                    </p>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between gap-3 border-t border-slate-800 px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-600">
                <span>{filteredOptions.length} of {options.length}</span>
                <span className="hidden sm:inline">
                  ↑↓ navigate · Enter select · Esc close
                </span>
              </div>
            </div>
          </>,
          document.body
        )}
      </div>

      {error && (
        <p className="text-xs font-semibold text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}

const HIDDEN_SCROLLBAR_STYLES = `
  .scrollbar-hide {
    scrollbar-width: none;
    -ms-overflow-style: none;
  }

  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
`;

export default function StudentGigCreatePage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState(() => new Set());
  const [description, setDescription] = useState('');

  const [pricing, setPricing] = useState({
    basePrice: '',
    currency: 'INR',
    packageModel: 'single'
  });

  const [delivery, setDelivery] = useState({
    deliveryDays: '',
    revisions: ''
  });

  const [basics, setBasics] = useState({

    title: '',
    categoryId: '',
    subcategoryId: '',
    serviceType: '',
    skills: []
  });

  const [skillQuery, setSkillQuery] = useState('');
  const deferredSkillQuery = useDeferredValue(skillQuery);
  const [visibleSkillCount, setVisibleSkillCount] = useState(24);

  const [touchedFields, setTouchedFields] = useState({});
  const [fieldErrors, setFieldErrors] = useState({});

  const categories = GIG_CATEGORY_OPTIONS;
  const selectedCategoryId = basics.categoryId;
  const selectedSubcategoryId = basics.subcategoryId;

  const subcategories = GIG_SUBCATEGORY_OPTIONS(selectedCategoryId);
  const serviceTypes = GIG_SERVICE_TYPE_OPTIONS(
    selectedCategoryId,
    selectedSubcategoryId
  );

  const filteredSkills = useMemo(() => {
    const normalizedQuery = deferredSkillQuery.trim().toLowerCase();

    return ALL_SKILLS_DATABASE.filter((skill) => {
      const matchesQuery =
        !normalizedQuery ||
        skill.toLowerCase().includes(normalizedQuery);

      return matchesQuery && !basics.skills.includes(skill);
    });
  }, [deferredSkillQuery, basics.skills]);

  const selectedSkillItems = basics.skills;

  const addSkill = (skill) => {
    setBasics((previous) => (
      previous.skills.includes(skill)
        ? previous
        : { ...previous, skills: [...previous.skills, skill] }
    ));
    setSkillQuery('');
    setVisibleSkillCount(24);
  };

  const removeSkill = (skillToRemove) => {
    setBasics((previous) => ({
      ...previous,
      skills: previous.skills.filter((skill) => skill !== skillToRemove)
    }));
  };

  const selectedCategory = categories.find(
    (category) => category.id === selectedCategoryId
  ) || null;

  const selectedSubcategory = subcategories.find(
    (subcategory) => subcategory.id === selectedSubcategoryId
  ) || null;

  const isTitleLengthValid =
    basics.title.trim().length >= 3 && basics.title.trim().length <= 120;

  const descriptionText = useMemo(
    () => richTextToPlainText(description),
    [description]
  );

  const descriptionCharacterCount = descriptionText.length;
  const descriptionWordCount = descriptionText
    ? descriptionText.split(/\s+/).filter(Boolean).length
    : 0;

  const isDescriptionComplete = descriptionCharacterCount >= 50;

  const basePriceNumber = Number(pricing.basePrice);
  const isPricingComplete =
    pricing.packageModel === 'single' &&
    Boolean(pricing.currency) &&
    pricing.basePrice !== '' &&
    Number.isFinite(basePriceNumber) &&
    basePriceNumber > 0;

  const deliveryDaysNumber = Number(delivery.deliveryDays);
  const revisionsNumber = Number(delivery.revisions);
  const isUnlimitedRevisions = delivery.revisions === 'unlimited';
  const isRevisionAllowanceValid =
    isUnlimitedRevisions ||
    (delivery.revisions !== '' &&
      Number.isInteger(revisionsNumber) &&
      revisionsNumber >= 0);
  const isDeliveryComplete =
    delivery.deliveryDays !== '' &&
    Number.isInteger(deliveryDaysNumber) &&
    deliveryDaysNumber > 0 &&
    isRevisionAllowanceValid;

  const descriptionGuidance = !descriptionText
    ? 'Explain what you provide, what the buyer receives, and what to expect.'
    : descriptionCharacterCount < 50
      ? `Add ${50 - descriptionCharacterCount} more meaningful character${
          50 - descriptionCharacterCount === 1 ? '' : 's'
        } so buyers have enough context.`
      : descriptionCharacterCount < 140
        ? 'Good foundation. Add the buyer outcome, key inclusions, and any important expectations.'
        : descriptionCharacterCount < 300
          ? 'Strong description. Make sure the service, buyer fit, and boundaries are easy to understand.'
          : 'Strong buyer-facing detail. Keep it focused, specific, and easy to scan.';

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

    if (isDescriptionComplete) {
      next.add(2);
    } else {
      next.delete(2);
    }

    if (isPricingComplete) {
      next.add(3);
    } else {
      next.delete(3);
    }

    if (isDeliveryComplete) {
      next.add(4);
    } else {
      next.delete(4);
    }

    return next;
  }, [
    completedSteps,
    isBasicsComplete,
    isDescriptionComplete,
    isPricingComplete,
    isDeliveryComplete
  ]);

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

  const validateDescription = () => {
    if (!isDescriptionComplete) {
      setFieldErrors((previous) => ({
        ...previous,
        description: descriptionText
          ? 'Description must contain at least 50 meaningful characters.'
          : 'Service description is required.'
      }));

      setTouchedFields((previous) => ({
        ...previous,
        description: true
      }));

      return false;
    }

    setFieldErrors((previous) => {
      const next = { ...previous };
      delete next.description;
      return next;
    });

    setTouchedFields((previous) => ({
      ...previous,
      description: true
    }));

    return true;
  };

  const handleDescriptionChange = (nextValue) => {
    setDescription(nextValue);

    setFieldErrors((previous) => {
      if (!previous.description) return previous;

      const next = { ...previous };
      delete next.description;
      return next;
    });

    setTouchedFields((previous) => ({
      ...previous,
      description: true
    }));
  };

  const validatePricing = () => {
    const nextErrors = {};
    const rawPrice = String(pricing.basePrice).trim();

    if (!rawPrice) {
      nextErrors.basePrice = 'Enter a base price for your service.';
    } else if (!Number.isFinite(Number(rawPrice))) {
      nextErrors.basePrice = 'Enter a valid numeric price.';
    } else if (!(Number(rawPrice) > 0)) {
      nextErrors.basePrice = 'Base price must be greater than 0.';
    }

    if (!pricing.currency) {
      nextErrors.currency = 'Please select a currency.';
    }

    if (pricing.packageModel !== 'single') {
      nextErrors.packageModel = 'Single-price mode is required for GIG-007.';
    }

    setFieldErrors((previous) => {
      const next = { ...previous };
      Object.keys(next).forEach((key) => {
        if (['basePrice', 'currency', 'packageModel'].includes(key)) {
          delete next[key];
        }
      });
      return { ...next, ...nextErrors };
    });

    setTouchedFields((previous) => ({
      ...previous,
      basePrice: true,
      currency: true,
      packageModel: true
    }));

    return Object.keys(nextErrors).length === 0;
  };

  const handlePricingChange = (field, value) => {
    setPricing((previous) => ({
      ...previous,
      [field]: value
    }));

    setFieldErrors((previous) => {
      if (!previous[field]) return previous;

      const next = { ...previous };
      delete next[field];
      return next;
    });

    setTouchedFields((previous) => ({
      ...previous,
      [field]: true
    }));
  };

  const validateDelivery = () => {
    const nextErrors = {};
    const rawDelivery = String(delivery.deliveryDays).trim();
    const rawRevisions = String(delivery.revisions).trim();

    if (!rawDelivery) {
      nextErrors.deliveryDays = 'Enter the delivery time for your service.';
    } else if (!Number.isInteger(Number(rawDelivery))) {
      nextErrors.deliveryDays = 'Delivery time must be a whole number of days.';
    } else if (!(Number(rawDelivery) > 0)) {
      nextErrors.deliveryDays = 'Delivery time must be greater than 0 days.';
    }

    if (!rawRevisions) {
      nextErrors.revisions = 'Select how many revisions are included.';
    } else if (
      rawRevisions !== 'unlimited' &&
      (!Number.isInteger(Number(rawRevisions)) || Number(rawRevisions) < 0)
    ) {
      nextErrors.revisions = 'Revisions must be 0 or more, or unlimited.';
    }

    setFieldErrors((previous) => {
      const next = { ...previous };
      ['deliveryDays', 'revisions'].forEach((key) => delete next[key]);
      return { ...next, ...nextErrors };
    });

    setTouchedFields((previous) => ({
      ...previous,
      deliveryDays: true,
      revisions: true
    }));

    return Object.keys(nextErrors).length === 0;
  };

  const handleDeliveryChange = (field, value) => {
    setDelivery((previous) => ({
      ...previous,
      [field]: value
    }));

    setFieldErrors((previous) => {
      if (!previous[field]) return previous;

      const next = { ...previous };
      delete next[field];
      return next;
    });

    setTouchedFields((previous) => ({
      ...previous,
      [field]: true
    }));
  };

  const handleNext = () => {
    if (currentStep >= steps.length) return;

    if (currentStep === 1 && !validateBasics()) {
      return;
    }

    if (currentStep === 2 && !validateDescription()) {
      return;
    }

    if (currentStep === 3 && !validatePricing()) {
      return;
    }

    if (currentStep === 4 && !validateDelivery()) {
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
          <h3 className="break-words text-xl sm:text-2xl font-black text-white mt-2">
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

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-5">
          <SearchableSelect
            id="gig-category"
            label="Primary category"
            value={basics.categoryId}
            options={categories}
            placeholder="Select a category…"
            error={fieldErrors.categoryId}
            onChange={(value) => handleBasicsChange('categoryId', value)}
          />

          <SearchableSelect
            id="gig-subcategory"
            label="Subcategory"
            value={basics.subcategoryId}
            options={subcategories}
            disabled={!basics.categoryId}
            placeholder={
              basics.categoryId
                ? 'Select a subcategory…'
                : 'Select a category first…'
            }
            error={fieldErrors.subcategoryId}
            onChange={(value) => handleBasicsChange('subcategoryId', value)}
          />

          <SearchableSelect
            id="gig-service-type"
            label="Service type"
            value={basics.serviceType}
            options={serviceTypes}
            disabled={!basics.subcategoryId}
            placeholder={
              basics.subcategoryId
                ? 'Select a service type…'
                : 'Select a subcategory first…'
            }
            error={fieldErrors.serviceType}
            onChange={(value) => handleBasicsChange('serviceType', value)}
          />
          </div>

        {selectedCategory && selectedSubcategory && (
          <div className="mt-6 flex flex-wrap items-center gap-2 text-[11px] font-bold text-slate-500">
            <span className="max-w-full truncate rounded-lg border border-slate-800 bg-slate-950/70 px-2.5 py-1.5">
              {selectedCategory.name}
            </span>

            <ChevronRight className="w-3.5 h-3.5 shrink-0 text-slate-700" />

            <span className="max-w-full truncate rounded-lg border border-slate-800 bg-slate-950/70 px-2.5 py-1.5">
              {selectedSubcategory.name}
            </span>

            {basics.serviceType && (
              <>
                <ChevronRight className="w-3.5 h-3.5 shrink-0 text-slate-700" />

                <span className="max-w-full truncate rounded-lg border border-cyan-500/15 bg-cyan-500/5 px-2.5 py-1.5 text-cyan-300/80">
                  {serviceTypes.find(
                    (serviceType) => serviceType.id === basics.serviceType
                  )?.name || basics.serviceType}
                </span>
              </>
            )}
          </div>
        )}
      </section>

      <section className="rounded-3xl border border-slate-800 bg-slate-950/35 p-5 sm:p-7">
        <div className="max-w-3xl">
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-cyan-400">
            Skills & tags
          </p>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-white mt-2">
                Add the skills buyers can search for
              </h3>
              <p className="text-sm leading-6 text-slate-500 mt-2">
                Choose the capabilities that best represent your service. Search the full SkillLaunch catalog; 3–10 relevant skills are recommended.
              </p>
            </div>

            <div className="text-right shrink-0">
              <p className="text-[11px] font-black uppercase tracking-wider text-slate-500">
                {basics.skills.length} selected
              </p>
              <p className={`text-[10px] font-bold mt-1 ${
                basics.skills.length >= 3 && basics.skills.length <= 10
                  ? 'text-emerald-400'
                  : 'text-slate-600'
              }`}>
                {basics.skills.length >= 3 && basics.skills.length <= 10
                  ? 'Recommended range'
                  : '3–10 recommended'}
              </p>
            </div>
          </div>

          <div className="mt-6 relative">
            <div className="flex items-center gap-2 rounded-2xl border border-slate-800 bg-slate-950/80 px-3.5 transition focus-within:border-cyan-500/60">
              <Search className="w-4 h-4 shrink-0 text-slate-500" />

              <input
                id="gig-skills"
                type="text"
                value={skillQuery}
                onChange={(event) => {
                  setSkillQuery(event.target.value);
                  setVisibleSkillCount(24);
                }}
                placeholder="Search skills (e.g. React, Trading, SEO, Blender, Excel, Figma)…"
                className="w-full bg-transparent py-3.5 text-sm text-white outline-none placeholder:text-slate-600"
              />

              {skillQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSkillQuery('');
                    setVisibleSkillCount(24);
                  }}
                  aria-label="Clear skill search"
                  className="rounded-lg p-1 text-slate-500 hover:bg-slate-800 hover:text-white transition"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="mt-2 flex items-center justify-between gap-3 px-1">
              <span className="text-[10px] font-bold text-slate-600">
                {filteredSkills.length.toLocaleString()} matching skills
              </span>

              {!skillQuery && (
                <span className="text-[10px] font-bold text-slate-600">
                  1,891 skills available
                </span>
              )}
            </div>
          </div>

          {selectedSkillItems.length > 0 && (
            <div className="mt-5">
              <div className="flex items-center justify-between gap-3 mb-2.5">
                <span className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-500">
                  Selected skills
                </span>
                <span className="text-[10px] font-bold text-slate-600">
                  {selectedSkillItems.length} selected
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                {selectedSkillItems.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-2 rounded-xl border border-cyan-500/20 bg-cyan-500/10 px-3 py-2 text-xs font-bold text-cyan-200"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      aria-label={`Remove ${skill}`}
                      className="rounded-md p-0.5 text-cyan-400 hover:bg-cyan-500/10 hover:text-white transition"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="mt-5 overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/60">
            <div className="flex items-center justify-between gap-3 border-b border-slate-800 px-4 py-3">
              <div>
                <p className="text-xs font-black text-white">
                  {skillQuery ? 'Search results' : 'Explore skills'}
                </p>
                <p className="text-[10px] text-slate-600 mt-0.5">
                  Click any skill to add it to your gig.
                </p>
              </div>

              <span className="text-[10px] font-bold text-slate-600">
                {filteredSkills.length.toLocaleString()} results
              </span>
            </div>

            <div className="max-h-80 overflow-y-auto p-3 scrollbar-hide">
              {filteredSkills.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {filteredSkills.slice(0, visibleSkillCount).map((skill) => (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => addSkill(skill)}
                        className="group flex items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-900/70 px-3.5 py-2.5 text-left text-xs font-bold text-slate-300 hover:border-cyan-500/30 hover:bg-cyan-500/5 hover:text-cyan-200 transition"
                      >
                        <span className="min-w-0 truncate">
                          {skill}
                        </span>
                        <Plus className="w-3.5 h-3.5 shrink-0 text-slate-600 group-hover:text-cyan-400 transition" />
                      </button>
                    ))}
                  </div>

                  {filteredSkills.length > visibleSkillCount && (
                    <button
                      type="button"
                      onClick={() =>
                        setVisibleSkillCount((count) =>
                          Math.min(count + 24, filteredSkills.length)
                        )
                      }
                      className="mt-3 w-full rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-2.5 text-[11px] font-black uppercase tracking-wider text-slate-400 hover:border-cyan-500/30 hover:bg-cyan-500/5 hover:text-cyan-200 transition"
                    >
                      Show 24 more · {filteredSkills.length - visibleSkillCount} remaining
                    </button>
                  )}
                </>
              ) : (
                <div className="py-12 text-center">
                  <Search className="w-5 h-5 mx-auto text-slate-700" />
                  <p className="mt-2 text-xs font-bold text-slate-500">
                    No matching skills found.
                  </p>
                  <p className="mt-1 text-[10px] text-slate-700">
                    Try another keyword or broader spelling.
                  </p>
                </div>
              )}
            </div>
          </div>

          {basics.skills.length > 10 && (
            <div className="mt-3 rounded-xl border border-amber-500/15 bg-amber-500/5 px-3 py-2.5">
              <p className="text-[10px] font-bold text-amber-300/80">
                You have more than 10 skills selected. Keep only the most relevant skills for the strongest buyer signal.
              </p>
            </div>
          )}
        </div>
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

  const renderDescription = () => (
    <div className="mt-8 space-y-7">
      <section className="rounded-3xl border border-slate-800 bg-slate-950/35 p-5 sm:p-7">
        <div className="w-full min-w-0 max-w-3xl">
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-cyan-400">
            Service description
          </p>

          <h3 className="text-xl sm:text-2xl font-black text-white mt-2">
            Give buyers a clear reason to choose your service
          </h3>

          <p className="break-words text-sm leading-6 text-slate-500 mt-2">
            Explain what you provide, who it is for, what the buyer receives,
            and any important expectations or limitations.
          </p>
        </div>

        <div className="mt-8">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between mb-2.5">
            <label
              htmlFor="service-description"
              className="text-xs font-black uppercase tracking-wider text-slate-300"
            >
              Description <span className="text-pink-500">*</span>
            </label>

            <div className="flex items-center gap-3 text-[10px] font-bold text-slate-600">
              <span>{descriptionWordCount} words</span>
              <span aria-hidden="true">·</span>
              <span>{descriptionCharacterCount} characters</span>
            </div>
          </div>

          <RichTextEditor
            id="service-description"
            value={description}
            onChange={handleDescriptionChange}
            error={Boolean(fieldErrors.description)}
          />

          <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <p className="text-xs leading-5 text-slate-500 max-w-2xl">
              {descriptionGuidance}
            </p>

            {fieldErrors.description && touchedFields.description && (
              <p
                id="service-description-error"
                className="text-xs font-semibold text-red-400 sm:text-right"
              >
                {fieldErrors.description}
              </p>
            )}
          </div>

          <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              ['What you provide', 'Describe the actual service and outcome.'],
              ['What they receive', 'Mention the main deliverables or inclusions.'],
              ['What to expect', 'Clarify fit, boundaries, or important conditions.']
            ].map(([title, detail]) => (
              <div
                key={title}
                className="rounded-2xl border border-slate-800 bg-slate-950/60 p-3.5"
              >
                <p className="text-xs font-black text-white">{title}</p>
                <p className="text-[11px] leading-5 text-slate-600 mt-1">
                  {detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {!isDescriptionComplete && (
        <div className="rounded-2xl border border-slate-800 bg-slate-950/60 px-4 py-3">
          <p className="text-xs font-bold text-slate-400">
            A meaningful description of at least 50 characters is required before continuing.
          </p>
        </div>
      )}
    </div>
  );

  const renderPricing = () => {
    const priceError = touchedFields.basePrice ? fieldErrors.basePrice : null;
    const currencyError = touchedFields.currency ? fieldErrors.currency : null;
    const packageModelError = touchedFields.packageModel ? fieldErrors.packageModel : null;

    return (
      <div className="mt-8 space-y-7">
        <section className="rounded-3xl border border-slate-800 bg-slate-950/35 p-5 sm:p-7">
          <div className="max-w-3xl">
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-cyan-400">
              Service pricing
            </p>

            <h3 className="text-xl sm:text-2xl font-black text-white mt-2">
              Set a clear starting price for your service
            </h3>

            <p className="text-sm leading-6 text-slate-500 mt-2 max-w-2xl">
              Give buyers one straightforward price for the service you are offering.
              Package tiers will be introduced in a later stage.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 sm:p-5">
              <label
                htmlFor="gig-base-price"
                className="text-xs font-black uppercase tracking-wider text-slate-300"
              >
                Base price <span className="text-pink-500">*</span>
              </label>

              <div className="mt-3 flex min-w-0 rounded-xl border border-slate-800 bg-slate-950 focus-within:border-cyan-500/60 overflow-hidden">
                <span className="inline-flex items-center px-3 border-r border-slate-800 text-sm font-black text-slate-500">
                  INR
                </span>

                <input
                  id="gig-base-price"
                  name="basePrice"
                  type="number"
                  inputMode="decimal"
                  min="0.01"
                  step="1"
                  value={pricing.basePrice}
                  onChange={(event) => handlePricingChange('basePrice', event.target.value)}
                  aria-invalid={Boolean(priceError)}
                  aria-describedby={priceError ? 'gig-base-price-error' : 'gig-base-price-help'}
                  className={[
                    'w-full min-w-0 bg-transparent px-3 py-3 text-sm font-bold text-white outline-none',
                    priceError ? 'border-red-500/50' : ''
                  ].join(' ')}
                  placeholder="Enter your price"
                />
              </div>

              <p id="gig-base-price-help" className="text-xs leading-5 text-slate-600 mt-2">
                Enter a positive amount for the complete service.
              </p>

              {priceError && (
                <p
                  id="gig-base-price-error"
                  role="alert"
                  className="text-xs font-semibold text-red-400 mt-2"
                >
                  {priceError}
                </p>
              )}
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 sm:p-5">
              <label
                htmlFor="gig-currency"
                className="text-xs font-black uppercase tracking-wider text-slate-300"
              >
                Currency <span className="text-pink-500">*</span>
              </label>

              <select
                id="gig-currency"
                name="currency"
                value={pricing.currency}
                onChange={(event) => handlePricingChange('currency', event.target.value)}
                aria-invalid={Boolean(currencyError)}
                aria-describedby={currencyError ? 'gig-currency-error' : 'gig-currency-help'}
                className={[
                  'w-full mt-3 rounded-xl border bg-slate-950 px-3 py-3 text-sm font-bold text-white outline-none transition',
                  currencyError
                    ? 'border-red-500/50 focus:border-red-400'
                    : 'border-slate-800 focus:border-cyan-500/60'
                ].join(' ')}
              >
                <option value="INR">INR — Indian Rupee</option>
              </select>

              <p id="gig-currency-help" className="text-xs leading-5 text-slate-600 mt-2">
                Your current platform currency is INR.
              </p>

              {currencyError && (
                <p
                  id="gig-currency-error"
                  role="alert"
                  className="text-xs font-semibold text-red-400 mt-2"
                >
                  {currencyError}
                </p>
              )}
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-cyan-500/20 bg-cyan-500/5 p-5 sm:p-7">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl border border-cyan-500/20 bg-cyan-500/10 flex items-center justify-center shrink-0">
              <Check className="w-4 h-4 text-cyan-300" />
            </div>

            <div className="min-w-0">
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-cyan-400">
                Package model
              </p>

              <h3 className="text-lg sm:text-xl font-black text-white mt-1">
                Single-price service
              </h3>

              <p className="text-sm leading-6 text-slate-500 mt-2 max-w-2xl">
                This gig will use one base service price. Basic, Standard, and Premium
                package configuration will be added in the Packages stage.
              </p>

              <label
                htmlFor="gig-package-model"
                className="mt-5 flex items-start gap-3 rounded-2xl border border-slate-800 bg-slate-950/60 p-4 cursor-pointer"
              >
                <input
                  id="gig-package-model"
                  name="packageModel"
                  type="radio"
                  value="single"
                  checked={pricing.packageModel === 'single'}
                  onChange={(event) => handlePricingChange('packageModel', event.target.value)}
                  className="mt-1 h-4 w-4 accent-cyan-400"
                  aria-invalid={Boolean(packageModelError)}
                  aria-describedby={packageModelError ? 'gig-package-model-error' : undefined}
                />

                <span className="min-w-0">
                  <span className="block text-sm font-black text-white">
                    Single price
                  </span>
                  <span className="block text-xs leading-5 text-slate-500 mt-1">
                    One purchase option for the service.
                  </span>
                </span>
              </label>

              {packageModelError && (
                <p
                  id="gig-package-model-error"
                  role="alert"
                  className="text-xs font-semibold text-red-400 mt-2"
                >
                  {packageModelError}
                </p>
              )}
            </div>
          </div>
        </section>

        {!isPricingComplete && (
          <div className="rounded-2xl border border-slate-800 bg-slate-950/60 px-4 py-3">
            <p className="text-xs font-bold text-slate-400">
              Complete the required pricing details before continuing.
            </p>
          </div>
        )}
      </div>
    );
  };

  const renderDelivery = () => {
    const deliveryError = touchedFields.deliveryDays ? fieldErrors.deliveryDays : null;
    const revisionsError = touchedFields.revisions ? fieldErrors.revisions : null;

    return (
      <div className="mt-8 space-y-7">
        <section className="rounded-3xl border border-slate-800 bg-slate-950/35 p-5 sm:p-7">
          <div className="max-w-3xl">
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-cyan-400">
              Delivery expectations
            </p>

            <h3 className="text-xl sm:text-2xl font-black text-white mt-2">
              Set a delivery promise buyers can understand
            </h3>

            <p className="text-sm leading-6 text-slate-500 mt-2 max-w-2xl">
              Choose the time you need to complete the service after the buyer places the order.
              The delivery clock starts when the order is created.
            </p>
          </div>

          <div className="mt-8 max-w-xl">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 sm:p-5">
              <label
                htmlFor="gig-delivery-days"
                className="text-xs font-black uppercase tracking-wider text-slate-300"
              >
                Delivery time <span className="text-pink-500">*</span>
              </label>

              <div className="mt-3 flex items-center min-w-0 rounded-xl border border-slate-800 bg-slate-950 overflow-hidden focus-within:border-cyan-500/60">
                <input
                  id="gig-delivery-days"
                  name="deliveryDays"
                  type="number"
                  inputMode="numeric"
                  min="1"
                  step="1"
                  value={delivery.deliveryDays}
                  onChange={(event) => handleDeliveryChange('deliveryDays', event.target.value)}
                  aria-invalid={Boolean(deliveryError)}
                  aria-describedby={deliveryError ? 'gig-delivery-days-error' : 'gig-delivery-days-help'}
                  className="w-full min-w-0 bg-transparent px-3 py-3 text-sm font-bold text-white outline-none"
                  placeholder="e.g. 3"
                />
                <span className="shrink-0 border-l border-slate-800 px-3 text-sm font-black text-slate-500">
                  days
                </span>
              </div>

              <p id="gig-delivery-days-help" className="text-xs leading-5 text-slate-600 mt-2">
                Enter the number of days you expect to need for the complete service.
              </p>

              {deliveryError && (
                <p
                  id="gig-delivery-days-error"
                  role="alert"
                  className="text-xs font-semibold text-red-400 mt-2"
                >
                  {deliveryError}
                </p>
              )}
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-800 bg-slate-950/35 p-5 sm:p-7">
          <div className="max-w-3xl">
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-cyan-400">
              Revision policy
            </p>

            <h3 className="text-xl sm:text-2xl font-black text-white mt-2">
              Set the revision allowance
            </h3>

            <p className="text-sm leading-6 text-slate-500 mt-2 max-w-2xl">
              Tell buyers how many rounds of reasonable changes are included in this service.
              One revision means a buyer requests changes to the delivered work within the
              original service scope; a completely new scope is not a revision.
            </p>
          </div>

          <div className="mt-8 max-w-xl">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 sm:p-5">
              <label
                htmlFor="gig-revisions"
                className="text-xs font-black uppercase tracking-wider text-slate-300"
              >
                Revisions <span className="text-pink-500">*</span>
              </label>

              <select
                id="gig-revisions"
                name="revisions"
                value={delivery.revisions}
                onChange={(event) => handleDeliveryChange('revisions', event.target.value)}
                aria-invalid={Boolean(revisionsError)}
                aria-describedby={revisionsError ? 'gig-revisions-error' : 'gig-revisions-help'}
                className={[
                  'w-full mt-3 rounded-xl border bg-slate-950 px-3 py-3 text-sm font-bold text-white outline-none transition',
                  revisionsError
                    ? 'border-red-500/50 focus:border-red-400'
                    : 'border-slate-800 focus:border-cyan-500/60'
                ].join(' ')}
              >
                <option value="">Select revision allowance</option>
                <option value="0">0 revisions</option>
                <option value="1">1 revision</option>
                <option value="2">2 revisions</option>
                <option value="3">3 revisions</option>
                <option value="4">4 revisions</option>
                <option value="5">5 revisions</option>
                <option value="unlimited">Unlimited revisions</option>
              </select>

              <p id="gig-revisions-help" className="text-xs leading-5 text-slate-600 mt-2">
                Choose the allowance that applies to the single service price.
              </p>

              {revisionsError && (
                <p
                  id="gig-revisions-error"
                  role="alert"
                  className="text-xs font-semibold text-red-400 mt-2"
                >
                  {revisionsError}
                </p>
              )}
            </div>
          </div>
        </section>

        {!isDeliveryComplete && (
          <div className="rounded-2xl border border-slate-800 bg-slate-950/60 px-4 py-3">
            <p className="text-xs font-bold text-slate-400">
              Complete the required delivery and revision details before continuing.
            </p>
          </div>
        )}
      </div>
    );
  };

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
    <>
      <style>{HIDDEN_SCROLLBAR_STYLES}</style>
      <div className="min-h-[calc(100vh-7rem)] pb-16">
      <div className="w-full min-w-0 max-w-[1500px] mx-auto">
        <section className="glass-panel w-full min-w-0 rounded-3xl border border-slate-800 overflow-hidden">
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

          <div className="grid w-full min-w-0 grid-cols-1 lg:grid-cols-[290px_minmax(0,1fr)]">
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

            <main className="w-full min-w-0 p-5 sm:p-7 lg:p-10">
              <div className="w-full min-w-0 max-w-4xl">
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

                {currentStep === 1
                  ? renderBasics()
                  : currentStep === 2
                    ? renderDescription()
                    : currentStep === 3
                      ? renderPricing()
                      : currentStep === 4
                        ? renderDelivery()
                        : renderPlaceholder()}

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
    </>
  );
}
