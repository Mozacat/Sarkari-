
import { JobCategory, JobPost, SiteSettings } from '../types';

// Helper to generate dates
const getRandomDate = (start: Date, end: Date) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

// Helper to generate realistic high view counts (Starts from 25,000)
const getRandomViews = () => {
  return Math.floor(Math.random() * (500000 - 25000 + 1)) + 25000;
};

export const ALL_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", 
  "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", 
  "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", 
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", 
  "Uttarakhand", "West Bengal", "Delhi", "All India"
];

export const STATE_LANGUAGES: Record<string, string> = {
  "Andhra Pradesh": "Telugu",
  "Arunachal Pradesh": "English",
  "Assam": "Assamese",
  "Bihar": "Hindi",
  "Chhattisgarh": "Hindi",
  "Goa": "Konkani",
  "Gujarat": "Gujarati",
  "Haryana": "Hindi",
  "Himachal Pradesh": "Hindi",
  "Jharkhand": "Hindi",
  "Karnataka": "Kannada",
  "Kerala": "Malayalam",
  "Madhya Pradesh": "Hindi",
  "Maharashtra": "Marathi",
  "Manipur": "Manipuri",
  "Meghalaya": "English",
  "Mizoram": "Mizo",
  "Nagaland": "English",
  "Odisha": "Odia",
  "Punjab": "Punjabi",
  "Rajasthan": "Hindi",
  "Sikkim": "English",
  "Tamil Nadu": "Tamil",
  "Telangana": "Telugu",
  "Tripura": "Bengali",
  "Uttar Pradesh": "Hindi",
  "Uttarakhand": "Hindi",
  "West Bengal": "Bengali",
  "Delhi": "Hindi",
  "All India": "Hindi/English"
};

export const ALL_CATEGORIES_LIST = [
  { title: 'Latest Job', icon: 'briefcase' },
  { title: 'Result', icon: 'check-circle' },
  { title: 'Admit Card', icon: 'file-text' },
  { title: 'Answer Key', icon: 'key' },
  { title: 'Syllabus', icon: 'book-open' },
  { title: 'Admission', icon: 'graduation-cap' },
  { title: 'Important', icon: 'alert-circle' },
  { title: 'Certificate Verification', icon: 'shield-check' },
  { title: 'Scholarship', icon: 'coins' },
  { title: 'News', icon: 'newspaper' }
];

// Initial Seed Data
const INITIAL_POSTS: JobPost[] = [
  {
    id: 'ssc-cgl-2024',
    title: 'SSC CGL 2024 Apply Online Form',
    shortTitle: 'SSC CGL 2024',
    slug: 'ssc-cgl-2024-apply-online',
    category: JobCategory.LATEST_JOB,
    subCategory: 'SSC',
    state: 'All India',
    department: 'Staff Selection Commission',
    status: 'Published',
    updateDate: '15 May 2024',
    lastDate: '15 Jun 2024',
    shortDescription: 'Staff Selection Commission (SSC) Combined Graduate Level CGL Examination 2024.',
    totalVacancy: '17727 Approx',
    views: 145020,
    showInHome: true,
    showInTrending: true,
    fullContent: '', 
    seo: {
      seoTitle: 'SSC CGL 2024 Notification, Apply Online, Syllabus & Exam Date',
      seoDescription: 'SSC CGL Recruitment 2024: Apply online for 17727 vacancies. Check eligibility, exam pattern, syllabus and download notification PDF.',
      keywords: 'SSC CGL 2024, SSC CGL Notification, SSC Recruitment, Government Jobs 2024'
    },
    details: {
      introduction: "Friends, this is a huge opportunity for graduates! The SSC CGL notification has been released for over 17,000 posts.",
      fee: [
        { category: "General / OBC / EWS", amount: "₹ 100/-" },
        { category: "SC / ST / PH", amount: "₹ 0/-" },
        { category: "All Category Female", amount: "₹ 0/-" }
      ],
      dates: [
        { label: "Application Begin", date: "15 May 2024" },
        { label: "Last Date for Apply", date: "15 Jun 2024" },
        { label: "Exam Date", date: "Sep-Oct 2024" }
      ],
      ageLimit: {
          min: "18",
          max: "27",
          asOn: "01/08/2024"
      },
      qualification: ["Bachelor Degree in Any Stream from Recognized University in India."],
      howToApply: [
        "First, visit the official SSC website.",
        "Register with your basic details.",
        "Fill the application form carefully.",
        "Upload photo and signature."
      ],
      importantDocuments: ["Aadhar Card", "10th Marksheet", "Graduation Certificate", "Passport Photo"],
      links: [
        { label: "Apply Online", url: "#" },
        { label: "Download Notification", url: "#" },
        { label: "Official Website", url: "#" }
      ],
      customFields: [],
      socialLinks: { whatsapp: '', telegram: '', facebook: '' }
    }
  }
];

const STORAGE_KEY = 'sarkariai_posts_v6'; 
const SETTINGS_KEY = 'sarkariai_settings_v5'; 

const loadPosts = (): JobPost[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_POSTS));
  return INITIAL_POSTS;
};

const savePostsToStorage = (posts: JobPost[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
};

// --- Comprehensive Settings Initialization ---

const INITIAL_SETTINGS: SiteSettings = {
  general: {
    siteName: 'SarkariAI',
    siteBaseUrl: 'https://sarkariai.com',
    tagline: 'India No.1 Job Portal',
    footerText: 'Copyright 2025 SarkariAI',
    contactEmail: 'support@sarkariai.com'
  },
  
  // 1. Mobile Home Page
  mobileHome: {
    enabled: true,
    mobileTitle: 'SarkariAI Mobile',
    layout: 'grid',
    visibleSections: {
      latestJobs: true,
      results: true,
      admitCards: true,
      trending: true
    },
    postLimit: 10,
    bannerUrl: ''
  },

  // 2. Sitemap
  sitemap: {
    autoGenerate: true,
    sitemapUrl: 'https://sarkariai.com/sitemap.xml',
    includeCategories: true,
    includePages: true,
    excludeUrls: '/admin,/private'
  },

  // 3. Google Verification
  google: {
    searchConsoleCode: '',
    analyticsId: '',
    tagManagerId: ''
  },

  // 4. Ad Code Manager
  ads: {
    globalHeadCode: '',
    globalBodyCode: '',
    headerSlot: '',
    footerSlot: '',
    sidebarSlot: '',
    inPostSlot: '',
    showOnMobile: true,
    showOnDesktop: true
  },

  // 5. Mobile SEO
  mobileSeo: {
    mobileMetaTitle: 'SarkariAI - Fast Updates',
    mobileMetaDesc: 'Get fastest government job updates on mobile.',
    enableAmp: false,
    enableLazyLoad: true,
    minifyCssJs: true,
    themeColor: '#4f46e5'
  },

  // 6. Robots.txt
  robots: {
    content: 'User-agent: *\nDisallow: /admin\nAllow: /',
    customRules: ''
  },

  // 7. Indexing & Crawl
  indexing: {
    noindexCategories: false,
    noindexTags: true,
    noindexSearch: true,
    noindexPagination: true,
    externalLinksNofollow: true
  },

  // 8. Schema
  schema: {
    enableOrganization: true,
    enableJobPosting: true,
    enableAutoFaq: true,
    enableBreadcrumbs: true
  },

  // 9. Social
  social: {
    defaultOgImage: '',
    facebookPage: '',
    whatsappGroup: 'https://chat.whatsapp.com/sample',
    twitterHandle: '',
    telegramChannel: 'https://t.me/sample',
    youtubeChannel: ''
  },

  // 10. Quick Access Links
  quickLinks: [
    { id: '1', title: 'Check SSC Result', url: 'https://ssc.nic.in', type: 'redirect', category: 'Result', isActive: true },
    { id: '2', title: 'Download Admit Card', url: '#', type: 'iframe', category: 'Admit Card', isActive: true },
  ]
};

export const getSiteSettings = (): SiteSettings => {
  const stored = localStorage.getItem(SETTINGS_KEY);
  if (stored) {
    const parsed = JSON.parse(stored);
    // Deep merge to ensure new structure exists
    return {
        ...INITIAL_SETTINGS,
        ...parsed,
        mobileHome: { ...INITIAL_SETTINGS.mobileHome, ...parsed.mobileHome },
        sitemap: { ...INITIAL_SETTINGS.sitemap, ...parsed.sitemap },
        google: { ...INITIAL_SETTINGS.google, ...parsed.google },
        ads: { ...INITIAL_SETTINGS.ads, ...parsed.ads },
        mobileSeo: { ...INITIAL_SETTINGS.mobileSeo, ...parsed.mobileSeo },
        robots: { ...INITIAL_SETTINGS.robots, ...parsed.robots },
        indexing: { ...INITIAL_SETTINGS.indexing, ...parsed.indexing },
        schema: { ...INITIAL_SETTINGS.schema, ...parsed.schema },
        social: { ...INITIAL_SETTINGS.social, ...parsed.social },
        quickLinks: parsed.quickLinks || INITIAL_SETTINGS.quickLinks
    };
  }
  return INITIAL_SETTINGS;
};

export const saveSiteSettings = (settings: SiteSettings) => {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
};

// --- Public API ---

export const getAllPosts = (): JobPost[] => {
  return loadPosts();
};

export const getPostsByCategory = (category: JobCategory, limit: number = 10): JobPost[] => {
  const allPosts = loadPosts();
  const filtered = allPosts.filter(p => p.category === category);
  
  if (filtered.length < 5) {
    const needed = limit - filtered.length;
    const generated: JobPost[] = Array.from({ length: needed }).map((_, i) => ({
      id: `gen-${category.toLowerCase().replace(/\s/g,'-')}-${Date.now()}-${i}`,
      title: `${category} Post ${i + 1} - Recruitment Online Form`,
      category: category,
      status: 'Published',
      state: i % 3 === 0 ? 'All India' : 'Uttar Pradesh',
      updateDate: getRandomDate(new Date(2024, 0, 1), new Date()),
      shortDescription: `Auto-generated content for ${category}.`,
      totalVacancy: 'Various',
      views: getRandomViews(),
      slug: `generated-post-${i}`
    }));
    return [...filtered, ...generated].slice(0, limit);
  }

  return filtered.slice(0, limit);
};

export const getPostById = (id: string): JobPost | null => {
  const allPosts = loadPosts();
  const found = allPosts.find(p => p.id === id);
  if (found) return found;
  
  if (id.startsWith('gen-')) {
    return {
      id,
      title: `Generated Post View`,
      category: JobCategory.LATEST_JOB,
      status: 'Published',
      state: 'All India',
      slug: id,
      updateDate: 'Recently',
      shortDescription: 'This is a generated post placeholder.',
      views: getRandomViews(),
      totalVacancy: 'N/A'
    };
  }
  return null;
};

export const deletePost = (id: string): void => {
  const posts = loadPosts();
  const newPosts = posts.filter(p => p.id !== id);
  savePostsToStorage(newPosts);
};

export const savePost = (post: JobPost): void => {
  const posts = loadPosts();
  const existingIndex = posts.findIndex(p => p.id === post.id);
  
  if (existingIndex >= 0) {
    posts[existingIndex] = post;
  } else {
    if (!post.views || post.views < 25000) {
        post.views = getRandomViews();
    }
    posts.unshift(post);
  }
  savePostsToStorage(posts);
};

export const generateSitemapXML = (): string => {
  const posts = getAllPosts();
  const settings = getSiteSettings();
  const baseUrl = settings.general.siteBaseUrl.replace(/\/$/, '');
  const today = new Date().toISOString().split('T')[0];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>`;
  
  if (settings.sitemap.includeCategories) {
       xml += `
  <url>
    <loc>${baseUrl}/category/latest-jobs</loc>
    <lastmod>${today}</lastmod>
    <changefreq>hourly</changefreq>
    <priority>0.9</priority>
  </url>`;
  }

  posts.forEach(post => {
    xml += `
  <url>
    <loc>${baseUrl}/#/post/${post.id}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>`;
  });

  xml += `
</urlset>`;
  return xml;
};

export interface KeywordAnalysis {
  volume: number;
  difficulty: number;
  cpc: number;
  potentialRank: string;
}

export const analyzeKeyword = (keyword: string): KeywordAnalysis => {
    return {
        volume: 120000,
        difficulty: 45,
        cpc: 12.5,
        potentialRank: "Top 3"
    };
};
