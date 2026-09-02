import React from 'react';
import {
  Check,
  Clock3,
  HelpCircle,
  Image as ImageIcon,
  Tag,
  UserRound,
  X
} from 'lucide-react';
import { sanitizeRichTextHtml } from '../utils/richText.js';

const TYPE_LABELS = {
  text: 'Text response',
  'long-text': 'Detailed response',
  'multiple-choice': 'Choose one option',
  checkbox: 'Confirmation',
  'file-upload': 'File upload'
};

const meaningfulItems = (items) =>
  Array.isArray(items)
    ? items.map((item) => String(item || '').trim()).filter(Boolean)
    : [];

const meaningfulRequirement = (requirement) =>
  String(requirement?.question || '').trim().length > 0;

const meaningfulFaq = (faq) =>
  String(faq?.question || '').trim().length > 0 &&
  String(faq?.answer || '').trim().length > 0;

function PreviewSection({ eyebrow, title, children }) {
  return (
    <section
      aria-labelledby={`preview-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
      className="rounded-3xl border border-slate-800 bg-slate-950/45 p-5 sm:p-7"
    >
      <div className="mb-5">
        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-cyan-400">
          {eyebrow}
        </p>
        <h2
          id={`preview-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
          className="mt-2 text-xl font-black text-white sm:text-2xl"
        >
          {title}
        </h2>
      </div>
      {children}
    </section>
  );
}

export default function GigBuyerPreview({
  basics,
  description,
  pricing,
  delivery,
  requirements,
  media,
  faqs,
  categoryName,
  subcategoryName,
  serviceTypeName,
  sellerName
}) {
  const safeBasics = basics || {};
  const safePricing = pricing || {};
  const safeDelivery = delivery || {};
  const safeMedia = media || {};

  const includedItems = meaningfulItems(safeDelivery.includedItems);
  const excludedItems = meaningfulItems(safeDelivery.excludedItems);
  const deliverables = meaningfulItems(safeDelivery.deliverables);

  const validGallery = Array.isArray(safeMedia.gallery)
    ? safeMedia.gallery.filter(
        (item) =>
          item &&
          item.previewUrl &&
          !item.validationError
      )
    : [];

  const validCover =
    safeMedia.cover?.previewUrl && !safeMedia.cover?.validationError
      ? safeMedia.cover
      : null;

  const validRequirements = Array.isArray(requirements)
    ? requirements.filter(meaningfulRequirement)
    : [];

  const validFaqs = Array.isArray(faqs)
    ? faqs.filter(meaningfulFaq)
    : [];

  const sanitizedDescription = sanitizeRichTextHtml(description || '');

  const basePrice = Number(safePricing.basePrice);
  const hasPrice =
    safePricing.basePrice !== '' &&
    Number.isFinite(basePrice) &&
    basePrice > 0;

  const revisionsLabel =
    safeDelivery.revisions === 'unlimited'
      ? 'Unlimited revisions'
      : safeDelivery.revisions !== '' && safeDelivery.revisions !== undefined
        ? `${safeDelivery.revisions} revision${Number(safeDelivery.revisions) === 1 ? '' : 's'}`
        : 'Revision allowance not set';

  return (
    <div className="mt-8 space-y-6">
      <div className="rounded-2xl border border-cyan-500/15 bg-cyan-500/5 px-4 py-3 sm:px-5">
        <p className="text-xs font-semibold leading-5 text-cyan-100/80">
          This is a buyer-facing preview of your current draft. It shows the service
          using the information available so far.
        </p>
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-950/55">
        <div className="aspect-[16/8.5] w-full bg-slate-900">
          {validCover ? (
            <img
              src={validCover.previewUrl}
              alt={safeBasics.title?.trim() || 'Gig cover'}
              className="h-full w-full object-cover"
            />
          ) : (
            <div
              className="flex h-full flex-col items-center justify-center px-6 text-center"
              aria-label="No gig cover available"
            >
              <ImageIcon className="h-8 w-8 text-slate-700" aria-hidden="true" />
              <p className="mt-3 text-sm font-black text-slate-400">
                Cover image not added yet
              </p>
              <p className="mt-1 max-w-md text-xs leading-5 text-slate-600">
                Buyers will see your selected cover here once one is available.
              </p>
            </div>
          )}
        </div>

        <div className="p-5 sm:p-8">
          <div className="flex flex-wrap items-center gap-2">
            {categoryName ? (
              <span className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-2.5 py-1 text-xs font-black text-cyan-300">
                {categoryName}
              </span>
            ) : null}

            {subcategoryName ? (
              <span className="rounded-full border border-slate-800 bg-slate-900 px-2.5 py-1 text-xs font-black text-slate-400">
                {subcategoryName}
              </span>
            ) : null}

            {serviceTypeName ? (
              <span className="rounded-full border border-indigo-500/20 bg-indigo-500/10 px-2.5 py-1 text-xs font-black text-indigo-300">
                {serviceTypeName}
              </span>
            ) : null}
          </div>

          <h1 className="mt-4 break-words text-3xl font-black tracking-tight text-white sm:text-4xl">
            {safeBasics.title?.trim() || 'Your service title will appear here'}
          </h1>

          {sellerName ? (
            <div className="mt-5 flex items-center gap-2 text-sm text-slate-400">
              <UserRound className="h-4 w-4 text-slate-500" aria-hidden="true" />
              <span>
                By <span className="font-bold text-slate-200">{sellerName}</span>
              </span>
            </div>
          ) : (
            <p className="mt-5 text-sm text-slate-500">
              Student creator
            </p>
          )}

          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
              <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-500">
                Starting price
              </p>
              <p className="mt-2 text-xl font-black text-emerald-300">
                {hasPrice
                  ? `${safePricing.currency || 'INR'} ${basePrice.toLocaleString('en-IN')}`
                  : 'Price not set'}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
              <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-500">
                Delivery
              </p>
              <p className="mt-2 inline-flex items-center gap-2 text-base font-black text-white">
                <Clock3 className="h-4 w-4 text-cyan-300" aria-hidden="true" />
                {safeDelivery.deliveryDays
                  ? `${safeDelivery.deliveryDays} day${Number(safeDelivery.deliveryDays) === 1 ? '' : 's'}`
                  : 'Not set'}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
              <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-500">
                Revisions
              </p>
              <p className="mt-2 text-base font-black text-white">
                {revisionsLabel}
              </p>
            </div>
          </div>
        </div>
      </div>

      <PreviewSection eyebrow="About the service" title="What you’re getting">
        {sanitizedDescription ? (
          <div
            className="max-w-none break-words text-sm leading-7 text-slate-300 [&_p]:mb-4 [&_p:last-child]:mb-0 [&_strong]:font-black [&_strong]:text-white [&_b]:font-black [&_b]:text-white [&_em]:italic [&_ul]:ml-5 [&_ul]:list-disc [&_ol]:ml-5 [&_ol]:list-decimal [&_li]:pl-1"
            dangerouslySetInnerHTML={{ __html: sanitizedDescription }}
          />
        ) : (
          <p className="text-sm leading-6 text-slate-500">
            No service description has been added yet.
          </p>
        )}

        {Array.isArray(safeBasics.skills) && safeBasics.skills.length > 0 ? (
          <div className="mt-6 border-t border-slate-800 pt-5">
            <div className="flex items-center gap-2">
              <Tag className="h-4 w-4 text-indigo-300" aria-hidden="true" />
              <h3 className="text-sm font-black text-white">Skills & expertise</h3>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {safeBasics.skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-full border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs font-bold text-slate-300"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ) : null}
      </PreviewSection>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <PreviewSection eyebrow="Scope" title="What’s included">
          {includedItems.length > 0 ? (
            <ul className="space-y-3">
              {includedItems.map((item, index) => (
                <li key={`${item}-${index}`} className="flex items-start gap-3 text-sm leading-6 text-slate-300">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-300">
                    <Check className="h-3.5 w-3.5" aria-hidden="true" />
                  </span>
                  <span className="break-words">{item}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-500">Included items have not been added yet.</p>
          )}

          {excludedItems.length > 0 ? (
            <div className="mt-6 border-t border-slate-800 pt-5">
              <h3 className="text-sm font-black text-white">What’s not included</h3>
              <ul className="mt-3 space-y-3">
                {excludedItems.map((item, index) => (
                  <li key={`${item}-${index}`} className="flex items-start gap-3 text-sm leading-6 text-slate-400">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-500/10 text-red-300">
                      <X className="h-3.5 w-3.5" aria-hidden="true" />
                    </span>
                    <span className="break-words">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </PreviewSection>

        <PreviewSection eyebrow="Deliverables" title="What you’ll receive">
          {deliverables.length > 0 ? (
            <ul className="space-y-3">
              {deliverables.map((item, index) => (
                <li key={`${item}-${index}`} className="rounded-2xl border border-slate-800 bg-slate-900/55 px-4 py-3 text-sm font-semibold leading-6 text-slate-300">
                  {item}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-500">No deliverables have been added yet.</p>
          )}
        </PreviewSection>
      </div>

      <PreviewSection eyebrow="Buyer inputs" title="What I’ll need from you">
        {validRequirements.length > 0 ? (
          <div className="space-y-4">
            {validRequirements.map((requirement, index) => {
              const options = meaningfulItems(requirement.options);

              return (
                <article
                  key={requirement.id || `${requirement.question}-${index}`}
                  className="rounded-2xl border border-slate-800 bg-slate-900/55 p-4 sm:p-5"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex min-w-0 items-start gap-3">
                      <span
                        aria-hidden="true"
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10 text-xs font-black text-cyan-300"
                      >
                        {index + 1}
                      </span>
                      <div className="min-w-0">
                        <p className="break-words text-sm font-black leading-6 text-white">
                          {String(requirement.question).trim()}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          {TYPE_LABELS[requirement.type] || 'Buyer response'}
                        </p>
                      </div>
                    </div>

                    <span
                      className={[
                        'shrink-0 self-start rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-wider',
                        requirement.required
                          ? 'border-cyan-500/20 bg-cyan-500/10 text-cyan-300'
                          : 'border-slate-700 bg-slate-950 text-slate-400'
                      ].join(' ')}
                    >
                      {requirement.required ? 'Required' : 'Optional'}
                    </span>
                  </div>

                  {requirement.type === 'multiple-choice' && options.length >= 2 ? (
                    <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950/60 p-3">
                      <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-600">
                        Choices
                      </p>
                      <ul className="mt-2 space-y-2">
                        {options.map((option, optionIndex) => (
                          <li
                            key={`${option}-${optionIndex}`}
                            className="text-sm text-slate-300"
                          >
                            <span className="mr-2 text-slate-600">{optionIndex + 1}.</span>
                            {option}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </article>
              );
            })}
          </div>
        ) : (
          <p className="text-sm leading-6 text-slate-500">
            No buyer requirements have been added yet.
          </p>
        )}
      </PreviewSection>

      {validGallery.length > 0 ? (
        <PreviewSection eyebrow="More work" title="Gallery">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {validGallery.map((item, index) => (
              <figure key={item.id || `${item.previewUrl}-${index}`} className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
                <div className="aspect-[4/3] w-full">
                  <img
                    src={item.previewUrl}
                    alt={`Gig gallery image ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                </div>
              </figure>
            ))}
          </div>
        </PreviewSection>
      ) : null}

      <PreviewSection eyebrow="Questions" title="Frequently asked questions">
        {validFaqs.length > 0 ? (
          <div className="space-y-3">
            {validFaqs.map((faq, index) => (
              <details
                key={faq.id || `${faq.question}-${index}`}
                className="group rounded-2xl border border-slate-800 bg-slate-900/50 px-4 py-4"
              >
                <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-sm font-black text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/70">
                  <span className="flex items-start gap-3">
                    <HelpCircle className="mt-0.5 h-4 w-4 shrink-0 text-cyan-300" aria-hidden="true" />
                    <span className="break-words">{String(faq.question).trim()}</span>
                  </span>
                  <span className="text-slate-600 transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 pl-7 text-sm leading-6 text-slate-400">
                  {String(faq.answer).trim()}
                </p>
              </details>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-500">
            No FAQs have been added yet.
          </p>
        )}
      </PreviewSection>
    </div>
  );
}
