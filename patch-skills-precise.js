const fs = require('fs');
const path = require('path');

try {
  // Explicitly targeting the active directories, ignoring backups
  const dataPath = path.join(__dirname, 'frontend', 'src', 'data', 'jobsCategoriesData.js');
  const postJobPath = path.join(__dirname, 'frontend', 'src', 'pages', 'PostJobPage.jsx');

  if (!fs.existsSync(dataPath) || !fs.existsSync(postJobPath)) {
    throw new Error("Could not find the exact active files. Please ensure you are in the root directory.");
  }

  // 1. Generate the Massive 800+ Taxonomy File
  const taxonomyData = `export const JOB_CATEGORIES = [
  "Web & Software Development",
  "Mobile App Development",
  "AI, Machine Learning & Data",
  "Design & Creative",
  "Video, Audio & Animation",
  "Gaming & Esports",
  "Writing & Translation",
  "Marketing & E-commerce",
  "Admin & Data Entry",
  "Business, Finance & Legal",
  "Engineering & Architecture",
  "Tutoring & Coaching",
  "Specialized Tech & Local"
];

export const JOB_CATEGORIES_DATA = {
  "Web & Software Development": {
    "Web Development": ["Web Development", "Web Application", "Progressive Web Apps (PWAs)", "Website Migration", "Website Maintenance", "Cross-Browser Testing", "W3C Accessibility Compliance", "SaaS Development", "Performance Optimization"],
    "Frontend Development": ["Frontend Development", "HTML", "HTML5", "CSS", "Tailwind CSS", "Bootstrap", "JavaScript", "React.js", "Next.js", "Vue.js", "Angular", "Svelte", "jQuery", "Micro-frontends", "WebAssembly"],
    "Backend & APIs": ["Backend Development", "Node.js", "Express JS", "Python", "Django", "FastAPI", "PHP", "Laravel", "Ruby on Rails", "Go", "Rust", "Java", "C# Programming", "C++ Programming", "C", ".NET", "ASP.NET", "GraphQL", "RESTful API", "API Development", "API Integration"],
    "Full Stack Development": ["Full Stack Development", "MERN Stack", "MEAN Stack", "LAMP Stack", "Software Development", "Software Engineering"],
    "CMS & Website Builders": ["WordPress", "Shopify", "Shopify Development", "WooCommerce", "WooCommerce Customization", "Wix", "Webflow", "Squarespace", "Magento", "Drupal", "Joomla", "Prestashop", "Ghost", "Headless CMS", "Payment Gateway Integration"],
    "Databases": ["PostgreSQL", "MySQL", "MongoDB", "Redis", "Cassandra", "Database Architecture", "Query Optimization", "Database Migration", "Backup & Recovery", "Data Modeling"],
    "DevOps & Cloud": ["AWS", "Google Cloud (GCP)", "Microsoft Azure", "Docker", "Kubernetes", "CI/CD", "GitHub Actions", "GitLab CI", "Jenkins", "Ansible", "Infrastructure as Code (IaC)", "Terraform", "DevOps Automation", "Server Setup", "Linux/Windows Server Admin", "Server Management", "Cloud Optimization", "Deployment Troubleshooting", "Serverless Architecture"],
    "Scripting & Automation": ["Scripting", "Bash Scripting", "Automation", "Workflow Automation", "Web Scraping", "Scrapy", "n8n", "Make.com", "Cron Jobs", "Computer Science", "Coding", "Programming", "Git", "GitHub"],
    "Web3 & Blockchain": ["Solidity", "Ethereum Development", "Solana Development", "Binance Smart Chain", "Polygon", "Smart Contract Auditing", "Gas Optimization", "Yul", "Decentralized Applications (dApps)", "NFT Minting Platforms", "Token Development", "DeFi Protocols", "Web3.js", "Ethers.js", "Wallet Integration", "Node Operation", "Private Blockchain Networks", "Consensus Algorithms", "Web3 Research", "IPFS Integration"],
    "Cybersecurity": ["Web Security", "Web Security Audits", "Network Security", "Application/API Security", "Penetration Testing", "Malware Analysis", "Digital Forensics", "Secure Coding Review", "Vulnerability Assessment", "Security Auditing", "Security Monitoring", "Incident Response", "Cloud Security", "Identity & Access Management (IAM)", "Security Configuration"],
    "Desktop & OS": ["Electron", "Qt", "macOS Development", "Windows Forms", "WPF", "Command Line Interfaces (CLI)", "Legacy System Modernization", "Browser Extensions", "Assembly", "Kernel Development", "Embedded Linux", "Device Drivers"],
    "Algorithms & Testing": ["Software Testing", "Data Structures", "Algorithm", "Algorithm Optimization", "Code Refactoring", "Open-source Contribution"]
  },
  "Mobile App Development": {
    "Android": ["Android", "Android App Development", "Android SDK", "Android Studio", "Kotlin", "Java"],
    "iOS": ["SwiftUI", "iOS SDK", "Apple HealthKit Integration", "Core ML", "ARKit Implementation"],
    "Cross-Platform": ["React Native", "Flutter", "Xamarin", "Ionic", "PhoneGap", "Cordova"],
    "App Management": ["Mobile App Testing", "App Reskinning", "Firebase Integration", "In-App Purchases", "Push Notifications", "App Store Optimization (ASO)", "Mobile Device Management (MDM)"]
  },
  "AI, Machine Learning & Data": {
    "AI & Large Language Models": ["Artificial Intelligence", "AI Development", "AI Integration", "AI Bot Development", "AI Chatbot", "AI Chatbot Development", "AI Content Creation", "AI Image Generation", "AI Video", "AI Agents", "AI Automation", "Chatbot Development", "Generative AI", "Large Language Models (LLMs)", "LLM Prompt Engineering", "Prompt Engineering", "OpenAI", "Claude (Anthropic)", "Hugging Face", "Retrieval-Augmented Generation (RAG)", "RAG Systems", "OpenAI/Gemini API Integration", "LlamaIndex", "Model Fine-Tuning", "AI Testing", "AI Content Generation Consulting", "Ethics & Bias Auditing"],
    "Machine Learning & Deep Learning": ["Machine Learning (ML)", "Deep Learning", "TensorFlow", "Pytorch", "Neural Networks", "Predictive Modeling", "Classification", "Regression", "Scikit-Learn", "Feature Engineering", "Model Evaluation", "Recommendation Systems"],
    "Data Science & Analytics": ["Data Science", "Data Analysis", "Data Analytics", "Pandas", "Pattern Discovery", "A/B Testing", "SPSS", "SAS", "R Programming", "ANOVA", "Hypothesis Testing", "Survey Analysis", "Research Data Analysis", "Time Series Forecasting", "Customer Churn Prediction", "Fraud Detection", "Algorithmic Trading", "Experiment Analysis", "Spatial Data Science"],
    "Data Visualization": ["Data Visualization", "Power BI", "Tableau", "Google Looker Studio", "Qlik", "Dashboard Creation", "KPI Tracking", "Reporting", "Excel Financial Models"],
    "Computer Vision & NLP": ["Computer Vision", "OpenCV", "Object Detection", "Image Analysis", "Image Processing", "Image Bounding Boxes", "Facial Recognition", "Medical Image Analysis", "Spatial Computing", "Optical Flow Analysis", "Natural Language Processing", "Sentiment Analysis", "Speech Recognition", "Voice Cloning", "Text-to-Speech (TTS)", "Audio Labeling"],
    "Data Engineering": ["Data Engineer", "Data Extraction", "Data Processing", "Data Annotation", "Data Cleansing", "Data Labeling", "Image-to-Text", "PDF-to-Word"]
  },
  "Design & Creative": {
    "Graphic Design & Branding": ["Graphic Design", "Logo Design", "Creative Design", "Flyer Design", "Poster Design", "Canva", "Adobe Illustrator", "Adobe Photoshop", "Brand Style Guides", "Business Cards", "Letterheads", "Stationery", "Typography Selection", "Brand Voice", "Flyers", "Brochures", "Posters", "Catalogs", "Menus", "Postcards", "Signage", "Trade Show Booth Design", "Roll-up Banners", "Packaging Design", "Label Design", "Album Cover Design", "Podcast Cover Art"],
    "UI / UX Design": ["UI / User Interface", "UX / User Experience", "Figma", "Sketch", "Website Design", "Website UI", "Mobile App UI", "Dashboard UI", "SaaS Application UI", "Design Systems", "Component Libraries", "Wireframing", "Prototyping", "User Journey Mapping", "Usability Testing", "Information Architecture", "Persona Development", "UX Research", "Interaction Design"],
    "Illustration & Art": ["Illustration", "Digital Art", "Vector Design", "Character Design", "T-Shirts", "Vector Tracing", "Portraits", "Caricatures", "Children’s Book Illustration", "Editorial Illustration", "Concept Art", "Comics", "Cartoon Design", "T-Shirt & Merchandise Design", "Tattoo Design", "Pattern Design", "NFT Art"],
    "Photography & Image Editing": ["Photo Editing", "Photo Retouching", "Adobe Lightroom", "Thumbnail Design", "YouTube Thumbnail Design", "Instagram Post Design", "Banner Ads", "Stream Graphics", "Twitch Overlays", "AR Filters & Lenses", "Portrait Photography", "Product Photography", "Food Photography", "Fashion Photography", "Wedding Photography", "Real Estate Photography", "Travel Photography", "Sports Photography", "Lifestyle Photography", "Background Removal", "Image Restoration", "Color Correction", "Photo Manipulation", "Compositing", "Lightroom Batch Editing"],
    "Presentations & Formatting": ["PowerPoint", "Google Slides", "Keynote", "Pitch Decks", "Investor Decks", "Academic Presentations", "Prezi", "Custom Data Visualization", "Master Slide Engineering", "PDF Design", "Report Design", "Resume/CV Design", "Lead Magnet Formatting", "E-book Layout", "Typesetting"],
    "Fashion & Styling": ["Fashion Design", "Clothing Patterns", "Tech Packs", "Fashion Illustration", "Textile Design", "Jewelry Design", "Shoe/Accessories Design", "Personal Styling", "Apparel Styling & Fast-Fashion Consulting", "Makeup Consultation"]
  },
  "Video, Audio & Animation": {
    "Video Editing & Production": ["Video Editing", "Video Production", "Video Post-editing", "Adobe Premiere Pro", "Final Cut Pro", "DaVinci Resolve", "CapCut", "TikToks", "Instagram Reels", "YouTube Shorts", "Captions/Subtitles", "Trend-based Editing", "YouTube Videos (Long-form)", "Documentaries", "Wedding Videos", "Travel Vlogs", "Corporate Presentations", "Real Estate Promos", "Unboxing Videos", "Color Grading", "Green Screen Compositing", "Video Restoration", "Video Compression", "Visual Effects (VFX)", "Multi-cam Syncing", "Subtitle Translation"],
    "Animation & Motion Graphics": ["Animation", "2D Animation", "3D Animation", "Motion Graphics", "After Effects", "Explainer Videos", "Whiteboard Animation", "Lottie Animations", "Sprite Sheets", "Traditional Frame-by-Frame Animation", "Character Animation", "Logo Animation", "Title Sequences", "Broadcast Graphics", "CGI Compositing", "App Promo Videos", "3D Product Animation", "Intro/Outro Videos"],
    "Audio Production": ["Audio Editing", "Music Production", "Podcast Editing", "Audio Cleaning", "Noise Reduction", "Mixing and Mastering", "Dialogue Editing", "Audiobook Production", "Audio Ads", "Foley", "Sound Effects for Games", "Jingles", "Background Music Scoring", "Audio Restoration", "Beat Making", "Songwriting", "Session Musicians", "Vocal Tuning", "Music Transcription", "DJ Services", "Instrumental Production"],
    "Voice Over & Narration": ["Voice Over", "Commercial Narration", "Audiobook Narration", "Character Acting", "IVR/Voicemail", "Dubbing", "E-learning Narration", "Promotional Acting"]
  },
  "Gaming & Esports": {
    "Game Development": ["Game Development", "Game Programming", "Unity", "Unity 3D", "Unreal Engine", "Godot", "Construct 3", "HTML5 Games", "2D/3D Game Development", "Game Mechanics", "Multiplayer Networking", "Game AI Programming", "Game Optimization", "Game Testing", "Roblox", "AR Development", "VR Development", "Virtual Reality", "Metaverse Experiences"],
    "Game Art & Design": ["Game Design", "Game Art", "2D Game Art", "3D Game Art", "Game Asset Creation", "Game UI", "Game Animation", "Level Design", "Environment Design", "Asset Creation"],
    "Esports & Coaching": ["Esports", "Twitch", "Video Game Coaching", "Gameplay Coaching", "VOD Review", "Rank Boosting", "In-game Resource Farming", "Speedrun Coaching", "Offerwall Game Testing", "Twitch Overlay Design", "OBS Setup", "Discord Server Architecture", "Gaming Video Highlights Editing", "Esports Content", "Tournament Organization"]
  },
  "Writing & Translation": {
    "Content & Copywriting": ["Content Creation", "Content Writing", "Copywriting", "Blog Writing", "Article Writing", "SEO Writing", "Creative Writing", "Script Writing", "Blog Posts", "Articles", "Website Copy", "Landing Pages", "Email Sequences", "Social Media Captions", "Product Descriptions", "Direct Response Copy", "Sales Letters", "Ad Copy", "VSL Scripts", "Press Releases", "Slogan Creation", "Ghostwriting", "Fiction/Non-Fiction E-books", "Scriptwriting", "Speechwriting", "Poetry", "Story Outlining", "Character Development"],
    "Academic & Technical Writing": ["Technical Writing", "Academic Writing", "Report Writing", "Research", "Research Writing", "User Manuals", "API Documentation", "Process Documentation", "SOPs", "White Papers", "SaaS Guides", "FAQ Creation", "Engineering Reports", "Research Summaries", "Research Proposals", "Grant Writing", "Thesis Formatting", "Citation Management", "Survey Creation", "Data Collection"],
    "Medical Writing": ["Clinical Study Reports", "Protocols", "IND/NDA/CTA Submission Dossiers", "FDA Documentation", "Medical Device Manuals", "HEOR Writing", "HTA Submissions", "Real-World Evidence Summaries", "Pharmacoeconomic Modeling", "Drug Safety Reports", "Adverse Event Narratives", "PSURs", "Peer-Reviewed Manuscripts", "Medical Journal Articles", "Congress Abstracts", "Poster Presentations", "Slide Decks", "Literature Reviews", "Patient Education Materials", "Public Health Campaigns", "Health/Wellness Blogs", "CME Materials", "Medical News"],
    "Editing & Proofreading": ["Editing", "Proofreading", "Copy Editing", "Article Rewriting", "Resume Writing", "Developmental Editing", "Copyediting", "Line Editing", "Beta Reading", "Plagiarism Checking", "Fact-Checking"],
    "Translation & Localization": ["Translation", "English Translation", "App Localization", "Website Localization", "Game Localization", "Subtitling", "Captioning", "Cultural Adaptation", "English to Telugu Translation", "English to Hindi Translation", "English to Tamil Translation", "English to Kannada Translation", "English to Malayalam Translation", "English to Marathi Translation", "English to Bengali Translation", "English to Gujarati Translation", "English to Punjabi Translation", "English to Urdu Translation", "English to Sanskrit Translation", "Foreign Language Pairs Translation", "Audio Transcription", "Medical Transcription", "Legal Transcription", "Video Transcription", "Real-Time Captioning", "Transcription"]
  },
  "Marketing & E-commerce": {
    "Digital Marketing": ["Digital Marketing", "Marketing", "Content Marketing", "Influencer Marketing", "Affiliate Marketing", "Affiliate Marketing Management", "Internet Marketing", "Press Release Distribution", "Media Outreach", "Online Reputation Management (ORM)", "Suppressing Negative Links", "Brand Strategy", "Influencer Outreach", "Campaign Management", "UGC Coordination"],
    "SEO & Analytics": ["SEO", "On-Page SEO", "Off-Page SEO", "Technical SEO", "Local SEO", "E-commerce SEO", "SEO Audits", "Competitor Analysis", "Keyword Research", "Social Media Analytics"],
    "Social Media & Community": ["Social Media Marketing", "Social Media Management", "Instagram", "Instagram Marketing", "TikTok", "YouTube", "Reddit Marketing", "Facebook Marketing", "Content Scheduling", "Content Planning", "Engagement Management", "Profile Setup", "Hashtag Research", "Discord Server Management", "Telegram Moderation", "Reddit Community Growth", "Facebook Group Moderation", "Crisis Management"],
    "Paid Advertising": ["Search Engine Marketing", "Google Ads", "Facebook Ads", "Bing Ads", "YouTube Ads", "Display Network", "PPC Strategy", "ROAS Optimization", "Programmatic Advertising", "Meta Ads", "TikTok Ads", "LinkedIn Ads", "X (Twitter) Ads", "Pinterest Ads", "Pixel Integration"],
    "Sales & Lead Generation": ["Lead Generation", "B2B/B2C Lead Generation", "Cold Email Research", "Appointment Setting", "LinkedIn Outreach", "CRM Management", "Sales Prospecting", "Cold Calling"],
    "E-commerce Operations": ["Amazon", "Amazon Listing Optimization", "Gated Category Un-gating", "Brand Approvals", "Amazon PPC Campaigns", "A+ Content Creation", "Inventory Syncing", "Shopify Store Setup", "Dropshipping", "Dropshipping Management", "Product Research", "Conversion Rate Optimization (CRO)", "Marketplace Management"],
    "Email Marketing": ["Newsletter Writing", "Drip Campaigns", "Klaviyo/Mailchimp Automation", "List Segmentation", "Email Deliverability Optimization", "Email Management"]
  },
  "Admin & Data Entry": {
    "Data Entry": ["Data Entry", "Copy Typing", "Typing", "Offline Data Entry", "Deduplication", "Formatting & Cleanup", "Data Normalization", "Missing Value Imputation", "Copy-Paste Tasks", "CRM Data Entry", "Excel Data Entry"],
    "Administrative & Virtual Assistance": ["Virtual Assistant", "Administrative Support", "Executive Assistance", "Real Estate VA", "Medical VA", "Legal Assistant VA", "E-commerce VA", "Calendar Scheduling", "File Organization", "Document Formatting", "Spreadsheet Management", "Microsoft Office", "Microsoft Word", "Excel", "Spreadsheets", "Google Spreadsheets", "Excel Macros", "VBA", "Time Management", "Internet Research", "Web Search", "Video Upload", "Word Processing", "PDF"],
    "Customer Support": ["Customer Service", "Customer Support", "Technical Support", "Telephone Handling", "Live Chat Support", "Email Ticketing", "Phone/Call Support", "Help Desk Operations", "Customer Feedback Analysis", "Order Processing", "Email Handling"],
    "HR & Operations": ["Candidate Sourcing", "Resume Screening", "Interview Coordination", "HR Policy Drafting", "Employer Branding", "Onboarding Setup", "Employee Surveys", "Process Improvement", "Supply Chain/Logistics Consulting", "Product Strategy", "Agile/Scrum Coaching", "Asana/Jira Setup", "Timeline Management", "Team Coordination", "Resource Allocation", "Operations Consulting", "Airtable Automation", "Notion Systems", "Power Automate", "RPA", "Email Automation", "Computer Troubleshooting", "Software Installation", "Linux/Windows OS Support", "Network Topology Design", "Active Directory", "Server Troubleshooting", "Domain/Hosting Setup"]
  },
  "Business, Finance & Legal": {
    "Finance & Accounting": ["Bookkeeping", "QuickBooks", "Xero", "Wave Setup", "Bank Reconciliation", "Invoicing", "Expense Tracking", "Payroll Assistance", "Financial Data Entry", "Financial Modeling", "Business Valuation", "Budgeting", "Financial Forecasting", "Investment Research", "Financial Planning", "Business Finance", "Day Trading & Retail Investment Consulting"],
    "Legal Services": ["Contract Drafting", "Terms of Service", "Privacy Policies", "NDA Creation", "Patent/Trademark Research", "Legal Writing", "Compliance Documentation"],
    "Business Consulting": ["Business Plan Writing", "Market Research", "Startup Pitch Decks", "Freelance"]
  },
  "Engineering & Architecture": {
    "Architecture & 3D Modeling": ["3D CAD", "3D Modelling", "3D Printing", "AutoCAD", "CAD / SolidWorks", "Solidworks", "SketchUp", "Revit", "2D Floor Plans", "Blueprints", "Elevation Drawings", "MEP Plans", "Structural Drawings", "Interior Styling", "Landscape Design", "Room Design", "Kitchen Design", "Furniture Design", "Photorealistic Visualization", "Virtual Staging", "3D Walkthroughs", "Architectural Visualization", "Simulation Programming", "Virtual Tours"],
    "Mechanical & Industrial": ["Mechanical Engineering", "Manufacturing Design", "Engineering Drawing", "CAD/CAM", "CAD Design", "Concept Generation", "Prototype Design", "DFM", "Mechanical Product Design", "3D Product Modeling", "CATIA", "AutoDesk Inventor", "Prototyping", "Enclosure Design", "Thermal Analysis", "Fluid Dynamics (CFD)", "Bill of Materials (BOM) Optimization", "CNC Programming", "Tooling Design", "Automotive Modifications", "HVAC Design", "Engineering Calculations"],
    "Electrical & Hardware": ["Electrical Engineering", "Electronics", "Circuit Design", "PCB Layout", "Microcontroller", "Arduino", "Firmware Development", "Altium Designer", "Eagle", "Circuit Board Layout", "Schematic Capture", "Gerber File Generation", "Antenna Design", "Mixed Signal Design", "Microcontrollers", "IoT Devices", "Embedded C/C++", "Embedded C++", "Embedded Systems", "FPGA Coding", "Circuit Simulation"],
    "Civil Engineering": ["Civil Engineering", "Structural Analysis", "Load Calculations", "Foundation Design", "Building Information Modeling (BIM)", "Surveying Data Analysis", "Engineering Technical Drawings"]
  },
  "Tutoring & Coaching": {
    "Academic Tutoring": ["Tutoring", "Math Tutoring", "English Tutoring", "Language Tutoring", "Physics Tutoring", "Chemistry Tutoring", "Biology Tutoring", "Computer Science Tutoring", "Economics Tutoring", "Programming Tutoring", "Data Science Tutoring", "AI/ML Concepts Tutoring", "Regional Language Tutoring", "History Tutoring", "Literature Tutoring", "Coding Lesson"],
    "Exam Preparation": ["SAT Preparation", "GRE Preparation", "GMAT Preparation", "IELTS Preparation", "Competitive State Exams Coaching", "Engineering/Medical Entrance Exam Coaching", "Aptitude & Logical Reasoning"],
    "Career & Life Coaching": ["CV Design", "LinkedIn Profile Optimization", "Cover Letter Writing", "Portfolio Creation", "Personal Branding", "Interview Preparation", "Job Search Assistance", "Communication Skills", "Presentation Coaching", "Life Coaching", "Relationship Coaching", "Fitness Guidance", "Personal Training", "Nutrition Plans", "Yoga Instruction", "Meditation Guidance", "Astrology/Tarot"]
  },
  "Specialized Tech & Local": {
    "Drones & Mapping": ["Drone Piloting", "Drone Photography", "Roof Inspections", "Thermal Imaging", "Power Line/Telecom Inspection", "Solar Panel Thermography", "Construction Site Monitoring", "Disaster Relief Assessment", "LiDAR Corridor Mapping", "Photogrammetry", "Topographical Surveys", "Mining Volume Calculations", "3D Site Modeling", "Archaeological Documentation", "NDVI Crop Scouting", "Precision Spraying", "Field Mapping", "Multispectral Imaging", "Forestry & Wildlife Preservation", "Real Estate Aerials", "Cinematic FPV", "Event Coverage", "Drone Light Shows", "Public Safety", "Stock Photography (Drones)"],
    "Travel & Events": ["Travel Planning", "Genealogy Research", "Custom Itinerary Creation", "Train & Regional Travel Itinerary Planning", "Travel Research", "Visa Application Assistance", "Destination Research", "Points & Miles Consulting", "Hotel Listing Content", "Local Tour Guiding", "Travel Photography", "Travel Blogging", "Airbnb Experience Management", "Corporate Events Planning", "Wedding Planning", "Birthday Events Planning", "College Events Planning", "Hybrid/Virtual Event Production", "Webinar Moderation", "Event Promotion", "Invitation Design", "Event Photography/Videography", "Sponsorship Deck Creation", "Event Social Media Management"],
    "Real Estate Operations": ["Property Listing Management", "Real Estate Marketing", "Property Photography/Video Tours", "MLS Data Scraping", "Virtual Staging", "Skip Tracing for Wholesaling"],
    "Local Services": ["Local Job", "Odd Jobs", "Delivery", "Food Delivery", "Parcel Delivery", "Car Driving", "Event Photography"]
  }
};

// Flatten the entire dictionary into a single alphabetical array of unique skills
export const ALL_SKILLS = Array.from(new Set(
  Object.values(JOB_CATEGORIES_DATA).flatMap(category =>
    Object.values(category).flatMap(skills => skills)
  )
)).sort();
`;

  fs.writeFileSync(dataPath, taxonomyData, 'utf8');
  console.log("✅ Updated jobsCategoriesData.js with 800+ categorized skills.");

  // 2. Patch PostJobPage.jsx to search against ALL_SKILLS globally
  let postJobCode = fs.readFileSync(postJobPath, 'utf8');

  // Fix imports to include ALL_SKILLS
  if (!postJobCode.includes('ALL_SKILLS')) {
    postJobCode = postJobCode.replace(
      /import \{ JOB_CATEGORIES_DATA, JOB_CATEGORIES \} from '\.\.\/data\/jobsCategoriesData';/,
      "import { JOB_CATEGORIES_DATA, JOB_CATEGORIES, ALL_SKILLS } from '../data/jobsCategoriesData';"
    );
  }

  // Remove the old restricted category skill search block completely
  postJobCode = postJobCode.replace(
    /const availableJobSkills =\s*formData\.category[\s\S]*?:\s*\[\];/m, 
    ""
  );

  // Update the suggestions array to search ALL_SKILLS directly and return up to 15 results
  postJobCode = postJobCode.replace(
    /const filteredSkillSuggestions = availableJobSkills\.filter\([\s\S]*?\.slice\(0,\s*8\);/m,
    `const filteredSkillSuggestions = ALL_SKILLS.filter(s =>
    s.toLowerCase().includes(skillSearchInput.toLowerCase().trim()) &&
    !formData.requiredSkills.includes(s)
  ).slice(0, 15);`
  );

  fs.writeFileSync(postJobPath, postJobCode, 'utf8');
  console.log("✅ Patched PostJobPage.jsx to search globally across all 800+ skills.");
} catch (e) {
  console.error("❌ Patch failed:", e);
}
