
export enum JobCategory {
  RESULT = 'Result',
  ADMIT_CARD = 'Admit Card',
  LATEST_JOB = 'Latest Job',
  SYLLABUS = 'Syllabus',
  ANSWER_KEY = 'Answer Key',
  ADMISSION = 'Admission',
  IMPORTANT = 'Important',
  CERTIFICATE = 'Certificate Verification',
  SCHOLARSHIP = 'Scholarship',
  NEWS = 'News'
}

export interface SEOConfig {
  seoTitle?: string;
  seoDescription?: string;
  keywords?: string;
  focusKeyword?: string;
  tags?: string[];
  indexing?: boolean; // Index/No-index
  follow?: boolean; // Follow/No-follow
  imageAlt?: string;
}

export interface JobPost {
  id: string;
  // Basic Info
  title: string;
  shortTitle?: string; // Card Title
  slug: string;
  category: JobCategory;
  subCategory?: string; // SSC, Railway, etc.
  state?: string;
  department?: string; // Board Name
  language?: string[]; // English, Hindi, etc.
  
  // Status & Meta
  status: 'Draft' | 'Published' | 'Scheduled' | 'Under Review';
  updateDate: string;
  lastDate?: string;
  author?: string;
  isPinned?: boolean;
  views: number;

  // Job Snapshot
  totalVacancy?: string;
  location?: string;
  jobLevel?: '10th' | '12th' | 'Graduate' | 'PG' | 'Diploma' | 'Other';
  jobType?: 'Permanent' | 'Contract' | 'Part Time';
  applicationMode?: 'Online' | 'Offline' | 'Both';
  
  // URLs
  officialWebsiteUrl?: string;
  notificationUrl?: string;
  applyUrl?: string;

  // Detailed Content
  shortDescription: string;
  fullContent?: string; // Legacy/Fallback HTML
  
  // Structured Data
  details?: {
    introduction?: string;
    fee?: Array<{ category: string; amount: string }>;
    dates?: Array<{ label: string; date: string; note?: string }>;
    vacancy?: Array<{ postName: string; ur: string; obc: string; sc: string; st: string; ews: string; total: string }>;
    reservationText?: string;
    
    // Eligibility
    ageLimit?: {
      min?: string;
      max?: string;
      asOn?: string;
      relaxation?: Array<{ category: string; years: string }>;
    };
    qualification?: string[]; // Bullet points
    physical?: Array<{ label: string; value: string }>; // Height, Chest
    
    // Exam
    selectionProcess?: string[]; // Steps (Written, Interview...)
    examPattern?: Array<{ paperName?: string; subject: string; questions: string; marks: string; duration: string }>;
    syllabus?: { overview: string; topics: string };
    
    // Salary
    salary?: {
      payScale?: string;
      inHand?: string;
      allowances?: string;
      structure?: string; // Detailed text description
      promotionGrowth?: string; // New field
    };

    // How to Apply
    howToApply?: string[]; // Step by step list
    importantDocuments?: string[]; // Document list

    faqs?: Array<{ question: string; answer: string }>;
    
    links?: Array<{ label: string; url: string }>; // Generic Links
    
    // New Advanced Custom Fields
    customFields?: Array<{ title: string; content: string }>;
    
    // Post Specific Social Links
    socialLinks?: {
        whatsapp?: string;
        telegram?: string;
        facebook?: string;
    };
  };

  // Advanced
  schemaMarkup?: string; // JSON-LD
  enableSchema?: boolean;
  seo?: SEOConfig;
  
  // Engagement
  showInHome?: boolean;
  showInTrending?: boolean;
  enableComments?: boolean;
}

// --- Quick Access Link Type ---
export interface QuickLink {
  id: string;
  title: string;
  url: string;
  type: 'iframe' | 'redirect'; // iframe tries to load in modal, redirect opens new tab
  category: 'Admit Card' | 'Result' | 'Official Site';
  isActive: boolean;
}

// --- 9-Section Comprehensive Settings ---

export interface SiteSettings {
  general: {
    siteName: string;
    siteBaseUrl: string;
    tagline: string;
    footerText: string;
    contactEmail: string;
  };

  // 1. Mobile Home Page Settings
  mobileHome: {
    enabled: boolean;
    mobileTitle: string;
    layout: 'list' | 'grid' | 'card';
    visibleSections: {
      latestJobs: boolean;
      results: boolean;
      admitCards: boolean;
      trending: boolean;
    };
    postLimit: number;
    bannerUrl: string;
  };

  // 2. Sitemap Settings
  sitemap: {
    autoGenerate: boolean;
    sitemapUrl: string;
    includeCategories: boolean;
    includePages: boolean;
    excludeUrls: string; // Comma separated
  };

  // 3. Google Verification & Tools
  google: {
    searchConsoleCode: string; // HTML Tag content
    analyticsId: string; // GA4 ID
    tagManagerId: string; // GTM ID
  };

  // 4. Ad Code Manager
  ads: {
    globalHeadCode: string;
    globalBodyCode: string;
    headerSlot: string;
    footerSlot: string;
    sidebarSlot: string;
    inPostSlot: string;
    showOnMobile: boolean;
    showOnDesktop: boolean;
  };

  // 5. Mobile SEO Control
  mobileSeo: {
    mobileMetaTitle: string;
    mobileMetaDesc: string;
    enableAmp: boolean;
    enableLazyLoad: boolean;
    minifyCssJs: boolean;
    themeColor: string;
  };

  // 6. Robots.txt Manager
  robots: {
    content: string;
    customRules: string;
  };

  // 7. Indexing & Crawl Control
  indexing: {
    noindexCategories: boolean;
    noindexTags: boolean;
    noindexSearch: boolean;
    noindexPagination: boolean;
    externalLinksNofollow: boolean;
  };

  // 8. Schema & Structured Data
  schema: {
    enableOrganization: boolean;
    enableJobPosting: boolean; // Auto apply to all posts
    enableAutoFaq: boolean;
    enableBreadcrumbs: boolean;
  };

  // 9. Social & Open Graph
  social: {
    defaultOgImage: string;
    facebookPage: string;
    whatsappGroup: string; // New: Global WhatsApp Group
    twitterHandle: string;
    telegramChannel: string;
    youtubeChannel: string;
  };

  // 10. Quick Access Links
  quickLinks: QuickLink[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}
