import { JOB_CATEGORIES, JOB_CATEGORIES_DATA } from './jobsCategoriesData.js';

/*
 * SkillLaunch Gig Taxonomy
 *
 * Layering:
 *   Primary category
 *      -> Subcategory
 *          -> Service type
 *
 * Skills/tags remain separate and belong to GIG-005.
 *
 * The existing marketplace taxonomy is retained as the foundation so
 * Jobs and Gigs do not drift into unrelated category names.
 */

const SERVICE_TYPES_BY_SUBCATEGORY = {
  // Development / IT
  'Frontend Development': [
    'Business website',
    'Landing page',
    'Web application interface',
    'Dashboard interface',
    'Website redesign',
    'Frontend bug fixing'
  ],
  'Backend Development': [
    'REST API development',
    'Backend application',
    'Database-backed service',
    'API integration',
    'Authentication & authorization',
    'Backend bug fixing'
  ],
  'Full Stack Development': [
    'Full-stack web application',
    'SaaS application',
    'Business web application',
    'E-commerce application',
    'MVP development',
    'Full-stack bug fixing'
  ],
  'CMS & Website Builders': [
    'WordPress website',
    'Shopify store',
    'Wix website',
    'Webflow website',
    'CMS customization',
    'CMS migration'
  ],
  'Web Management': [
    'Website maintenance',
    'Website migration',
    'Performance optimization',
    'Accessibility improvements',
    'Security maintenance',
    'Website troubleshooting'
  ],
  'Desktop & OS Development': [
    'Desktop application',
    'Windows application',
    'macOS application',
    'CLI / developer tool',
    'Browser extension',
    'Desktop application maintenance'
  ],
  'Cloud & DevOps': [
    'Cloud deployment',
    'CI/CD pipeline',
    'Docker containerization',
    'Server setup',
    'Cloud migration',
    'Infrastructure optimization'
  ],
  'Scripting & Automation': [
    'Task automation',
    'Workflow automation',
    'Web scraping',
    'Data processing script',
    'CLI automation',
    'Scheduled automation'
  ],
  'Web3 & Blockchain': [
    'Smart contract development',
    'dApp development',
    'Blockchain integration',
    'Wallet integration',
    'Token / NFT functionality',
    'Blockchain troubleshooting'
  ],
  'Cybersecurity': [
    'Security assessment',
    'Web application security review',
    'API security review',
    'Vulnerability assessment',
    'Security hardening',
    'Security remediation'
  ],
  'Low-Level & Testing': [
    'Software testing',
    'Test automation',
    'Code review',
    'Algorithm implementation',
    'Performance optimization',
    'Refactoring & cleanup'
  ],

  // Mobile
  'Android Development': [
    'Android application',
    'Android UI implementation',
    'Android feature development',
    'Android bug fixing',
    'Firebase integration',
    'Play Store preparation'
  ],
  'iOS Development': [
    'iPhone / iPad application',
    'SwiftUI interface',
    'iOS feature development',
    'iOS bug fixing',
    'Apple service integration',
    'App Store preparation'
  ],
  'Cross-Platform': [
    'Flutter application',
    'React Native application',
    'Cross-platform MVP',
    'Cross-platform UI',
    'Cross-platform bug fixing',
    'Mobile API integration'
  ],
  'App Management & Store': [
    'App testing',
    'App reskin',
    'App store optimization',
    'Push notification setup',
    'In-app purchase setup',
    'Mobile app maintenance'
  ],

  // AI / Data
  'Artificial Intelligence & LLMs': [
    'AI application',
    'LLM integration',
    'RAG application',
    'AI content system',
    'AI model integration',
    'AI workflow implementation'
  ],
  'AI Agents & Chatbots': [
    'AI chatbot',
    'AI agent',
    'Customer support bot',
    'Website chatbot',
    'WhatsApp / messaging bot',
    'AI automation agent'
  ],
  'Machine Learning & Deep Learning': [
    'Machine learning model',
    'Predictive model',
    'Classification model',
    'Regression model',
    'Recommendation system',
    'Model evaluation'
  ],
  'Computer Vision & Audio': [
    'Computer vision application',
    'Image recognition',
    'Object detection',
    'OCR solution',
    'Speech / audio AI',
    'Image processing pipeline'
  ],
  'Data Science & Analytics': [
    'Data analysis',
    'Business analytics',
    'Statistical analysis',
    'Research analysis',
    'Predictive analytics',
    'Experiment analysis'
  ],
  'Data Engineering & Databases': [
    'Data pipeline',
    'ETL / data transformation',
    'Database design',
    'Database migration',
    'Data cleaning pipeline',
    'Query optimization'
  ],
  'Data Visualization': [
    'Business dashboard',
    'Analytics dashboard',
    'Power BI dashboard',
    'Tableau dashboard',
    'KPI reporting',
    'Interactive data visualization'
  ],

  // Design
  'Graphic & Visual Design': [
    'Marketing graphic',
    'Social media design',
    'Print design',
    'Poster / flyer design',
    'Packaging design',
    'Marketing asset package'
  ],
  'Branding & Logos': [
    'Logo design',
    'Brand identity',
    'Brand style guide',
    'Business stationery',
    'Logo redesign',
    'Brand asset package'
  ],
  'UI / UX & Web Design': [
    'Website UI design',
    'Mobile app UI design',
    'Dashboard UI',
    'UX wireframes',
    'Interactive prototype',
    'Design system'
  ],
  'Illustration & Art': [
    'Digital illustration',
    'Character design',
    'Vector illustration',
    'Concept art',
    'Editorial illustration',
    'Custom artwork'
  ],
  'Presentations & Typography': [
    'PowerPoint presentation',
    'Pitch deck',
    'Investor presentation',
    'Academic presentation',
    'Presentation redesign',
    'Report / document design'
  ],
  'Fashion & Merchandise': [
    'T-shirt design',
    'Merchandise design',
    'Fashion illustration',
    'Clothing design',
    'Tech pack',
    'Pattern design'
  ],

  // Photography
  'Photography Services': [
    'Portrait photography',
    'Product photography',
    'Food photography',
    'Event photography',
    'Real estate photography',
    'Lifestyle photography'
  ],
  'Image Editing & Retouching': [
    'Photo editing',
    'Photo retouching',
    'Background removal',
    'Image restoration',
    'Color correction',
    'Photo manipulation'
  ],

  // Video / audio
  'Video Editing & Post-Production': [
    'YouTube video editing',
    'Corporate video editing',
    'Wedding video editing',
    'Travel video editing',
    'Short-form video editing',
    'Video post-production'
  ],
  'Short-Form Video': [
    'Instagram Reels',
    'TikTok videos',
    'YouTube Shorts',
    'Social media edits',
    'Video repurposing',
    'Captioned short-form video'
  ],
  'Animation & Motion Graphics': [
    '2D animation',
    '3D animation',
    'Motion graphics',
    'Explainer animation',
    'Logo animation',
    'Product animation'
  ],
  'Audio Production & Editing': [
    'Podcast editing',
    'Audio cleanup',
    'Music production',
    'Mixing & mastering',
    'Sound design',
    'Audiobook editing'
  ],
  'Voice Over & Acting': [
    'Commercial voice over',
    'Narration',
    'Character voice',
    'E-learning narration',
    'Dubbing',
    'IVR / voicemail voice over'
  ],

  // Social
  'Social Media Management': [
    'Social media management',
    'Content scheduling',
    'Social media strategy',
    'Profile optimization',
    'Engagement management',
    'Social media analytics'
  ],
  'Community Management': [
    'Discord community management',
    'Telegram community management',
    'Reddit community management',
    'Group moderation',
    'Community growth',
    'Community support'
  ],
  'Graphics for Socials': [
    'Social media post design',
    'YouTube thumbnail design',
    'Social banner design',
    'Stream graphics',
    'Ad creative',
    'Social media template package'
  ],

  // Marketing
  'Marketing Strategy': [
    'Marketing strategy',
    'Go-to-market planning',
    'Campaign planning',
    'Conversion optimization',
    'Marketing audit',
    'Growth strategy'
  ],
  'Search Engine Optimization (SEO)': [
    'SEO audit',
    'Keyword research',
    'On-page SEO',
    'Technical SEO',
    'Local SEO',
    'E-commerce SEO'
  ],
  'Paid Advertising (PPC)': [
    'Google Ads setup',
    'Meta Ads setup',
    'PPC campaign management',
    'Campaign optimization',
    'Retargeting setup',
    'PPC audit'
  ],
  'PR & Outreach': [
    'Influencer outreach',
    'Press outreach',
    'Affiliate outreach',
    'UGC coordination',
    'Online reputation support',
    'PR campaign support'
  ],

  // E-commerce
  'Amazon & Marketplaces': [
    'Amazon listing optimization',
    'Marketplace product research',
    'Amazon PPC setup',
    'Inventory / catalog support',
    'Marketplace management',
    'A+ content creation'
  ],
  'Shopify & Stores': [
    'Shopify store setup',
    'Shopify customization',
    'WooCommerce store setup',
    'E-commerce storefront',
    'Product catalog setup',
    'Store optimization'
  ],

  // Writing
  'Content & Blog Writing': [
    'Blog post writing',
    'SEO content writing',
    'Website content',
    'Article writing',
    'Content package',
    'AI-assisted content editing'
  ],
  'Copywriting & Sales': [
    'Website copy',
    'Landing page copy',
    'Email copy',
    'Ad copy',
    'Product descriptions',
    'Sales copy package'
  ],
  'Technical & Academic Writing': [
    'Technical documentation',
    'Research writing',
    'Report writing',
    'Literature review',
    'Documentation package',
    'Academic editing'
  ],
  'Medical & Scientific Writing': [
    'Scientific writing',
    'Medical writing',
    'Literature review',
    'Research summary',
    'Technical manuscript support',
    'Scientific editing'
  ],
  'Creative Writing & Scripts': [
    'Script writing',
    'Video script',
    'Story writing',
    'Ghostwriting',
    'E-book writing',
    'Creative writing package'
  ],
  'Editing & Proofreading': [
    'Proofreading',
    'Copy editing',
    'Developmental editing',
    'Fact checking',
    'Rewriting',
    'Document editing'
  ],

  // Translation
  'Translation & Localization': [
    'Document translation',
    'Website localization',
    'App localization',
    'Marketing translation',
    'Technical translation',
    'General translation'
  ],
  'Transcription & Subtitles': [
    'Audio transcription',
    'Video transcription',
    'Subtitling',
    'Captioning',
    'Real-time captioning',
    'PDF-to-text conversion'
  ],

  // Gaming
  'Game Development & Programming': [
    '2D game development',
    '3D game development',
    'Unity game',
    'Unreal game',
    'Game mechanics',
    'Game bug fixing'
  ],
  'Game Art & Level Design': [
    'Game UI design',
    '2D game art',
    '3D game assets',
    'Level design',
    'Environment design',
    'Game animation'
  ],
  'AR, VR & Metaverse': [
    'AR experience',
    'VR experience',
    'Interactive 3D experience',
    'Metaverse environment',
    'AR / VR prototype',
    'Immersive experience design'
  ],
  'Esports, Coaching & Streaming': [
    'Gameplay coaching',
    'VOD review',
    'Streaming setup',
    'Stream graphics',
    'Tournament support',
    'Esports content'
  ],

  // Admin
  'Virtual Assistance & Admin': [
    'Virtual assistant',
    'Administrative support',
    'Calendar management',
    'Document organization',
    'Research assistance',
    'Spreadsheet support'
  ],
  'Data Entry': [
    'Data entry',
    'Data cleanup',
    'Data formatting',
    'Spreadsheet data entry',
    'CRM data entry',
    'PDF data conversion'
  ],
  'Customer Support': [
    'Customer support',
    'Email support',
    'Live chat support',
    'Technical support',
    'Help desk support',
    'Order support'
  ],

  // Business
  'Finance, Accounting & Trading': [
    'Bookkeeping support',
    'Financial data preparation',
    'Expense tracking',
    'Financial modeling',
    'Budgeting support',
    'Accounting spreadsheet support'
  ],
  'HR & Recruitment': [
    'Candidate sourcing',
    'Resume screening',
    'Recruitment coordination',
    'Interview coordination',
    'HR documentation',
    'Employer branding support'
  ],
  'Business Consulting & Project Mgmt': [
    'Market research',
    'Business research',
    'Business plan support',
    'Project management support',
    'Process improvement',
    'Operations support'
  ],
  'Sales & Lead Generation': [
    'Lead generation',
    'Prospect research',
    'Appointment setting',
    'LinkedIn outreach',
    'CRM support',
    'Sales research'
  ],
  'Email Marketing': [
    'Newsletter setup',
    'Email campaign',
    'Drip campaign',
    'Email automation',
    'List segmentation',
    'Email optimization'
  ],

  // Legal
  'Contracts & Documentation': [
    'Contract drafting support',
    'Terms & conditions support',
    'Privacy policy support',
    'NDA documentation',
    'Legal document formatting',
    'Compliance documentation support'
  ],
  'Research & IP': [
    'Legal research',
    'Patent research',
    'Trademark research',
    'IP research support',
    'Research summary',
    'Document research support'
  ],

  // Engineering
  'Architecture & 3D Modeling': [
    '2D floor plan',
    '3D modeling',
    'Architectural visualization',
    'Interior design',
    '3D walkthrough',
    'CAD drafting'
  ],
  'Mechanical & Industrial Engineering': [
    'CAD design',
    'Mechanical product design',
    'Engineering drawing',
    'Prototype design',
    'DFM support',
    'Engineering analysis'
  ],
  'Electrical & Hardware Engineering': [
    'Circuit design',
    'PCB design',
    'Arduino project',
    'Embedded system',
    'Firmware development',
    'Electronics prototype'
  ],
  'Civil Engineering': [
    'Structural analysis',
    'Engineering drawings',
    'BIM support',
    'Load calculation support',
    'Survey data analysis',
    'Civil drafting'
  ],

  // Education
  'Academic Tutoring': [
    '1:1 tutoring',
    'Subject tutoring',
    'Homework guidance',
    'Exam preparation',
    'Programming tutoring',
    'Study mentoring'
  ],
  'Test & Exam Preparation': [
    'SAT preparation',
    'GRE preparation',
    'IELTS preparation',
    'Entrance exam preparation',
    'Aptitude preparation',
    'Mock test coaching'
  ],
  'Career Coaching & Personal Branding': [
    'Resume / CV coaching',
    'LinkedIn profile optimization',
    'Interview preparation',
    'Portfolio guidance',
    'Personal branding',
    'Job search coaching'
  ],
  'Life Coaching & Wellness': [
    'Goal coaching',
    'Study productivity coaching',
    'Fitness guidance',
    'Yoga instruction',
    'Meditation guidance',
    'Lifestyle coaching'
  ],

  // Events / local
  'Drones & Aerial Mapping': [
    'Drone photography',
    'Aerial mapping',
    'Photogrammetry',
    'Inspection imagery',
    'Construction site monitoring',
    'Aerial documentation'
  ],
  'Events & Travel Planning': [
    'Travel itinerary',
    'Travel research',
    'Event planning',
    'Wedding planning',
    'College event planning',
    'Virtual event support'
  ],
  'Real Estate Operations': [
    'Property listing support',
    'Real estate marketing',
    'Property photo / video',
    'Virtual staging',
    'Property data research',
    'Listing management'
  ],
  'Specialized IT & Local Jobs': [
    'Computer troubleshooting',
    'Software installation',
    'Network setup',
    'OS support',
    'Hosting / domain setup',
    'Local technical support'
  ]
};

const slugify = (value) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');

export const GIG_TAXONOMY = JOB_CATEGORIES.map((category) => ({
  id: slugify(category),
  name: category,
  subcategories: Object.keys(JOB_CATEGORIES_DATA[category] || {}).map((subcategory) => ({
    id: `${slugify(category)}-${slugify(subcategory)}`,
    name: subcategory,
    serviceTypes: (SERVICE_TYPES_BY_SUBCATEGORY[subcategory] || [
      'Custom service',
      'Project-based service',
      'Setup / implementation',
      'Optimization',
      'Consultation / support'
    ]).map((serviceType) => ({
      id: slugify(serviceType),
      name: serviceType
    }))
  }))
}));

export const GIG_CATEGORY_OPTIONS = GIG_TAXONOMY.map((category) => ({
  id: category.id,
  name: category.name
}));

export const GIG_SUBCATEGORY_OPTIONS = (categoryId) =>
  GIG_TAXONOMY.find((category) => category.id === categoryId)?.subcategories || [];

export const GIG_SERVICE_TYPE_OPTIONS = (categoryId, subcategoryId) =>
  GIG_TAXONOMY
    .find((category) => category.id === categoryId)
    ?.subcategories.find((subcategory) => subcategory.id === subcategoryId)
    ?.serviceTypes || [];
