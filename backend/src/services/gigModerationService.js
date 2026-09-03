const CONTACT_PATTERNS = {
  EMAIL: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/i,
  PHONE: /(\+?\d{1,3}[-.\s]?)?(\(?\d{3}\)?[-.\s]?)?\d{3}[-.\s]?\d{4}|\b\d{10}\b/,
  PAYMENT_OR_SOCIAL: /\b(gpay|google\s*pay|paytm|phonepe|upi|whatsapp|telegram|instagram|insta|paypal)\b/i
};

const EXTERNAL_URL_PATTERN = /\bhttps?:\/\/[^\s<>"']+/gi;

const PROHIBITED_SERVICE_PATTERNS = [
  /\b(?:hack|hacking|ddos|ransomware|malware|credential\s*steal|password\s*steal)\b/i,
  /\b(?:fake\s*id|forged\s*document|counterfeit|stolen\s*account)\b/i,
  /\b(?:weapon|firearm|explosive|drug\s*sale)\b/i
];

const normalizeText = (value) =>
  String(value || '')
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<\/(p|li|ul|ol)>/gi, ' ')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const normalizeForComparison = (value) =>
  normalizeText(value)
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const collectText = (draftData) => {
  const basics = draftData?.basics || {};
  const pricing = draftData?.pricing || {};
  const delivery = draftData?.delivery || {};
  const requirements = Array.isArray(draftData?.requirements) ? draftData.requirements : [];
  const faqs = Array.isArray(draftData?.faqs) ? draftData.faqs : [];
  const included = Array.isArray(delivery.includedItems) ? delivery.includedItems : [];
  const excluded = Array.isArray(delivery.excludedItems) ? delivery.excludedItems : [];
  const deliverables = Array.isArray(delivery.deliverables) ? delivery.deliverables : [];
  const skills = Array.isArray(basics.skills) ? basics.skills : [];

  return {
    title: normalizeText(basics.title),
    description: normalizeText(draftData?.description),
    category: normalizeText(basics.categoryId),
    subcategory: normalizeText(basics.subcategoryId),
    serviceType: normalizeText(basics.serviceType),
    skills: skills.map(normalizeText).filter(Boolean),
    included: included.map(normalizeText).filter(Boolean),
    excluded: excluded.map(normalizeText).filter(Boolean),
    deliverables: deliverables.map(normalizeText).filter(Boolean),
    requirements: requirements.flatMap((item) => [
      normalizeText(item?.question),
      ...(Array.isArray(item?.options) ? item.options.map(normalizeText) : [])
    ]).filter(Boolean),
    faqs: faqs.flatMap((item) => [
      normalizeText(item?.question),
      normalizeText(item?.answer)
    ]).filter(Boolean),
    coverUrl: String(draftData?.media?.cover?.url || '').trim(),
    galleryUrls: (Array.isArray(draftData?.media?.gallery) ? draftData.media.gallery : [])
      .map((item) => String(item?.url || '').trim())
      .filter(Boolean),
    currency: normalizeText(pricing.currency),
    basePrice: pricing.basePrice
  };
};

const flattenComparableText = (parts) =>
  [
    parts.title,
    parts.description,
    parts.category,
    parts.subcategory,
    parts.serviceType,
    ...parts.skills,
    ...parts.included,
    ...parts.excluded,
    ...parts.deliverables,
    ...parts.requirements,
    ...parts.faqs
  ]
    .filter(Boolean)
    .join(' ');

const STOP_WORDS = new Set([
  'a', 'an', 'and', 'are', 'as', 'at', 'be', 'before', 'by', 'for',
  'from', 'in', 'is', 'it', 'of', 'on', 'or', 'that', 'the', 'they',
  'this', 'to', 'what', 'who', 'with', 'you'
]);

const countRepeatedPhrases = (text) => {
  const words = normalizeForComparison(text)
    .split(' ')
    .filter(Boolean);

  if (words.length < 20) return [];

  const phraseCounts = new Map();

  for (let size = 3; size <= 5; size += 1) {
    for (let i = 0; i <= words.length - size; i += 1) {
      const phraseWords = words.slice(i, i + size);
      const meaningfulWords = phraseWords.filter((word) => !STOP_WORDS.has(word));

      if (meaningfulWords.length < 2) continue;

      const phrase = phraseWords.join(' ');
      phraseCounts.set(phrase, (phraseCounts.get(phrase) || 0) + 1);
    }
  }

  return [...phraseCounts.entries()]
    .filter(([, count]) => count >= 3)
    .sort((a, b) => {
      if (b[1] !== a[1]) return b[1] - a[1];
      return b[0].split(' ').length - a[0].split(' ').length;
    })
    .slice(0, 5);
};

const checkSpam = (parts) => {
  const textFields = [
    ['title', parts.title],
    ['description', parts.description]
  ];

  const findings = [];

  for (const [field, text] of textFields) {
    const repeatedPhrases = countRepeatedPhrases(text);
    if (repeatedPhrases.length === 0) continue;

    findings.push({
      check: 'SPAM_KEYWORD_STUFFING',
      reasonCode: 'REPEATED_KEYWORD_PHRASE',
      severity: 'MEDIUM',
      message: `Repeated keyword phrases in the ${field} may indicate keyword stuffing.`,
      details: repeatedPhrases.map(([phrase, count]) => ({ phrase, count }))
    });
  }

  return findings;
};

const checkTextPolicies = (text) => {
  const findings = [];

  for (const [code, regex] of Object.entries(CONTACT_PATTERNS)) {
    if (regex.test(text)) {
      findings.push({
        check: 'URL_CONTACT_PAYMENT',
        reasonCode: `CONTACT_${code}`,
        severity: 'HIGH',
        message: 'Direct contact, social, or external payment instructions were detected.'
      });
    }
  }

  if (EXTERNAL_URL_PATTERN.test(text)) {
    findings.push({
      check: 'URL_CONTACT_PAYMENT',
      reasonCode: 'EXTERNAL_URL',
      severity: 'MEDIUM',
      message: 'An external URL was detected in gig text.'
    });
  }

  for (const [index, pattern] of PROHIBITED_SERVICE_PATTERNS.entries()) {
    if (pattern.test(text)) {
      findings.push({
        check: 'POLICY_PROHIBITED_SERVICE',
        reasonCode: `PROHIBITED_SERVICE_${index + 1}`,
        severity: 'HIGH',
        message: 'Potentially prohibited or unsafe service language was detected.'
      });
    }
  }

  return findings;
};

const checkPricing = (draftData) => {
  const price = Number(draftData?.pricing?.basePrice);
  const findings = [];

  if (!Number.isFinite(price) || price <= 0) {
    findings.push({
      check: 'PRICING',
      reasonCode: 'INVALID_PRICE',
      severity: 'HIGH',
      message: 'Gig pricing is invalid.'
    });
  }

  if (price > Number.MAX_SAFE_INTEGER) {
    findings.push({
      check: 'PRICING',
      reasonCode: 'UNREALISTIC_PRICE_VALUE',
      severity: 'MEDIUM',
      message: 'Gig pricing contains an unusually large numeric value.'
    });
  }

  return findings;
};

const checkCategoryPolicy = (category) => {
  if (!category) return [];

  if (category.isRestricted) {
    return [{
      check: 'POLICY_PROHIBITED_SERVICE',
      reasonCode: 'RESTRICTED_CATEGORY',
      severity: 'HIGH',
      message: 'The selected category is marked as restricted by marketplace policy.'
    }];
  }

  return [];
};

const findDuplicateFinding = (currentDraftData, existingGigs) => {
  const current = normalizeForComparison(
    flattenComparableText(collectText(currentDraftData))
  );

  if (!current) return [];

  for (const gig of existingGigs) {
    const existing = normalizeForComparison(
      flattenComparableText(collectText(gig?.draftData || {}))
    );

    if (existing && existing === current) {
      return [{
        check: 'DUPLICATE',
        reasonCode: 'EXACT_DUPLICATE_LISTING',
        severity: 'HIGH',
        message: 'This listing appears to duplicate another listing owned by the same seller.',
        details: { matchedGigId: gig.id }
      }];
    }
  }

  return [];
};

const checkUrls = (parts) => {
  const urls = [parts.coverUrl, ...parts.galleryUrls].filter(Boolean);
  const suspiciousUrls = urls.filter((url) => {
    try {
      const parsed = new URL(url);
      return !/^(https?:)$/i.test(parsed.protocol);
    } catch {
      return true;
    }
  });

  if (suspiciousUrls.length === 0) return [];

  return [{
    check: 'URL_CONTACT_PAYMENT',
    reasonCode: 'INVALID_MEDIA_URL',
    severity: 'MEDIUM',
    message: 'One or more media URLs are malformed or use an unsupported protocol.'
  }];
};

async function moderateGig({ draftData, sellerId, gigId, prisma }) {
  const parts = collectText(draftData);
  const combinedText = flattenComparableText(parts);
  const findings = [
    ...checkTextPolicies(combinedText),
    ...checkSpam(parts),
    ...checkPricing(draftData),
    ...checkUrls(parts)
  ];

  const categorySlug =
    typeof draftData?.basics?.categoryId === 'string'
      ? draftData.basics.categoryId.trim()
      : '';

  if (categorySlug) {
    const category = await prisma.category.findUnique({
      where: { slug: categorySlug },
      select: { id: true, name: true, isRestricted: true }
    });

    findings.push(...checkCategoryPolicy(category));
  }

  if (sellerId) {
    const existingGigs = await prisma.gig.findMany({
      where: {
        sellerId,
        isDeleted: false,
        NOT: {
          OR: [
            { status: 'DRAFT' },
            { id: gigId }
          ]
        }
      },
      select: {
        id: true,
        draftData: true
      }
    });

    findings.push(...findDuplicateFinding(draftData, existingGigs));
  }

  const uniqueFindings = [];
  const seen = new Set();

  for (const finding of findings) {
    const key = `${finding.check}:${finding.reasonCode}:${finding.details?.matchedGigId || ''}`;
    if (!seen.has(key)) {
      seen.add(key);
      uniqueFindings.push(finding);
    }
  }

  const highCount = uniqueFindings.filter((finding) => finding.severity === 'HIGH').length;

  return {
    status: uniqueFindings.length > 0 ? 'FLAGGED' : 'CLEAR',
    summary: {
      totalFindings: uniqueFindings.length,
      highSeverity: highCount,
      mediumSeverity: uniqueFindings.filter((finding) => finding.severity === 'MEDIUM').length
    },
    findings: uniqueFindings
  };
}

module.exports = {
  moderateGig
};
