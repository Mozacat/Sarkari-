import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { JobPost, JobCategory } from '../types';
import { getPostById, savePost, ALL_STATES, STATE_LANGUAGES, analyzeKeyword, KeywordAnalysis } from '../services/mockData';
import { 
  getSEORankingStrategy, 
  generateFullPostContent, 
  generateViralSeoPost, 
  generateContentFromPrompt,
  parseNotificationText,
  SEOStrategy, 
  GeneratedPostContent 
} from '../services/geminiService';
import { 
  ArrowLeft, Save, Trash, Search, Globe, AlertCircle, CheckCircle, 
  Cpu, Wand2, Target, Layout, Calendar, Users, Award, 
  FileText, BookOpen, DollarSign, Settings, Share2, Link as LinkIcon, 
  Eye, Info, List, Image as ImageIcon, Activity, TrendingUp, Anchor, BarChart2, Flame, PenTool, FileInput, Plus, Briefcase, Building2, MapPin, Database, Trophy, Zap, ClipboardList
} from 'lucide-react';

// --- Constants & Initial State ---

const EMPTY_POST: JobPost = {
  id: '',
  title: '',
  slug: '',
  category: JobCategory.LATEST_JOB,
  status: 'Draft',
  state: 'All India',
  updateDate: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
  shortDescription: '',
  views: 0,
  details: {
    introduction: '',
    fee: [],
    dates: [],
    vacancy: [],
    qualification: [],
    selectionProcess: [],
    examPattern: [],
    howToApply: [],
    importantDocuments: [],
    salary: { structure: '', promotionGrowth: '' },
    links: [],
    faqs: [],
    customFields: [],
    socialLinks: { whatsapp: '', telegram: '', facebook: '' }
  },
  seo: {
    indexing: true,
    follow: true,
    focusKeyword: '',
    seoTitle: '',
    seoDescription: ''
  }
};

const MENU_ITEMS = [
  { id: 'basic', label: 'Adv. Configuration', icon: Settings },
  { id: 'snapshot', label: 'Job Snapshot', icon: Activity },
  { id: 'dates', label: 'Dates & Fees', icon: Calendar },
  { id: 'vacancy', label: 'Vacancy & Reserv.', icon: Users },
  { id: 'eligibility', label: 'Eligibility', icon: Award },
  { id: 'exam', label: 'Exam & Selection', icon: ClipboardList },
  { id: 'content', label: 'Detailed Content', icon: FileText },
  { id: 'custom', label: 'Custom Fields', icon: Database },
  { id: 'seo', label: 'Rank #1 SEO Suite', icon: Target },
  { id: 'automation', label: 'Automation & AI', icon: Cpu },
];

// --- Components ---

const Card = ({ id, title, icon: Icon, children, rightElement }: any) => (
  <div id={id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-6 scroll-mt-20">
    <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
      <h3 className="font-bold text-slate-800 flex items-center gap-2">
        <Icon size={18} className="text-indigo-600" /> {title}
      </h3>
      {rightElement}
    </div>
    <div className="p-6">
      {children}
    </div>
  </div>
);

const InputGroup = ({ label, required, tooltip, children, className = "mb-4" }: any) => (
  <div className={className}>
    <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-1">
      {label} {required && <span className="text-red-500">*</span>}
      {tooltip && <span className="text-slate-400 cursor-help" title={tooltip}><Info size={12}/></span>}
    </label>
    {children}
  </div>
);

// --- Main Editor Component ---

export const PostEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<JobPost>(EMPTY_POST);
  const [activeSection, setActiveSection] = useState('basic');
  
  // UI Helper States
  const [isAutoWriting, setIsAutoWriting] = useState(false);
  const [isAnalyzingSeo, setIsAnalyzingSeo] = useState(false);
  const [seoStrategy, setSeoStrategy] = useState<SEOStrategy | null>(null);
  const [viralKeyword, setViralKeyword] = useState('');
  const [isGeneratingViral, setIsGeneratingViral] = useState(false);
  const [deepAnalysis, setDeepAnalysis] = useState<GeneratedPostContent['seoAdvice']['deepAnalysis'] | null>(null);
  
  // New AI Content Writer State
  const [customTopic, setCustomTopic] = useState('');
  const [isWritingCustom, setIsWritingCustom] = useState(false);
  const [notificationText, setNotificationText] = useState('');
  const [showImportModal, setShowImportModal] = useState(false);

  // Initial Load
  useEffect(() => {
    if (id) {
      const existing = getPostById(id);
      if (existing) {
        setPost({ ...EMPTY_POST, ...existing, details: { ...EMPTY_POST.details, ...existing.details } });
      }
    } else {
      setPost({ ...EMPTY_POST, id: `post-${Date.now()}` });
    }
  }, [id]);

  // Scroll Spy / Navigation
  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  // Handlers
  const updateDetail = (section: keyof typeof post.details, value: any) => {
    setPost(prev => ({ ...prev, details: { ...prev.details, [section]: value } }));
  };

  const applyGeneratedContent = (generated: GeneratedPostContent) => {
    setPost(prev => ({
        ...prev,
        title: generated.seoTitle || prev.title,
        shortDescription: generated.shortDescription,
        slug: generated.slug,
        totalVacancy: 'Various',
        schemaMarkup: generated.schemaMarkup,
        details: {
          ...prev.details,
          fee: generated.fee?.map(f => ({ category: f.key, amount: f.value })) || [],
          dates: generated.dates?.map(d => ({ label: d.key, date: d.value })) || [],
          qualification: generated.eligibility ? [generated.eligibility] : [],
          ageLimit: { min: '18', max: '30', asOn: '01/01/2025' }, 
          introduction: generated.introduction,
          selectionProcess: generated.selectionSteps,
          examPattern: generated.examPattern,
          howToApply: generated.howToApply,
          importantDocuments: generated.importantDocuments,
          salary: { structure: generated.salaryStructure }
        },
        seo: {
          ...prev.seo,
          seoTitle: generated.seoTitle,
          seoDescription: generated.seoDescription,
          keywords: generated.keywords
        }
      }));

      // Automatically Populate SEO Suite Data (Keywords & Backlinks)
      if (generated.seoAdvice) {
          setSeoStrategy({
              targetKeywords: generated.seoAdvice.targetKeywords || [],
              backlinkStrategy: {
                  sources: generated.seoAdvice.backlinkPlan?.sites || [],
                  actionPlan: generated.seoAdvice.backlinkPlan?.howTo || '',
                  estimatedCount: '40+ Sources'
              },
              optimizedTitle: generated.seoTitle,
              optimizedDescription: generated.seoDescription,
              contentGap: []
          });

          if (generated.seoAdvice.deepAnalysis) {
              setDeepAnalysis(generated.seoAdvice.deepAnalysis);
          }
      }
  };

  const handleAutoWrite = async () => {
    if (!post.title) return alert("Enter Title first");
    setIsAutoWriting(true);
    const generated = await generateFullPostContent(post.title);
    if (generated) {
      applyGeneratedContent(generated);
      alert("✨ Content Optimized for Featured Snippets & Rank #1!");
    }
    setIsAutoWriting(false);
  };

  const handleViralGen = async () => {
    if (!viralKeyword) return alert("Enter a Primary Keyword first");
    setIsGeneratingViral(true);
    const generated = await generateViralSeoPost(viralKeyword);
    if (generated) {
        applyGeneratedContent(generated);
        alert("Viral SEO Content Generated Successfully!");
    }
    setIsGeneratingViral(false);
  };

  const handleCustomContentGen = async () => {
    if (!customTopic) return alert("Please enter a topic or prompt first.");
    setIsWritingCustom(true);
    const generated = await generateContentFromPrompt(customTopic);
    if (generated) {
        applyGeneratedContent(generated);
    }
    setIsWritingCustom(false);
  };

  const handleImportNotification = async () => {
    if (!notificationText) return;
    setIsAutoWriting(true);
    setShowImportModal(false);
    const generated = await parseNotificationText(notificationText);
    if (generated) {
        applyGeneratedContent(generated);
    }
    setIsAutoWriting(false);
    setNotificationText('');
  };

  const handleMagicSEO = async () => {
    if (!post.title) return alert("Please enter a Post Title first to generate SEO strategy.");
    setIsAnalyzingSeo(true);
    const strategy = await getSEORankingStrategy(post.title, post.shortDescription || post.title);
    if (strategy) {
      setSeoStrategy(strategy);
      setPost(prev => ({
        ...prev,
        seo: {
          ...prev.seo,
          seoTitle: strategy.optimizedTitle,
          seoDescription: strategy.optimizedDescription,
          keywords: strategy.targetKeywords.map(k => k.term).join(', '),
          focusKeyword: strategy.targetKeywords[0]?.term || ''
        }
      }));
    }
    setIsAnalyzingSeo(false);
  };

  const handleSave = () => {
    savePost(post);
    alert("Post Saved Successfully!");
  };

  const ListEditor = ({ items, onChange, placeholder }: { items: string[], onChange: (i: string[]) => void, placeholder: string }) => (
    <div>
        {items.map((item, idx) => (
            <div key={idx} className="flex gap-2 mb-2">
                <input 
                    type="text" 
                    value={item} 
                    onChange={e => {
                        const newItems = [...items];
                        newItems[idx] = e.target.value;
                        onChange(newItems);
                    }}
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm"
                />
                <button onClick={() => {
                    const newItems = [...items];
                    newItems.splice(idx, 1);
                    onChange(newItems);
                }} className="text-red-500 hover:bg-red-50 p-2 rounded"><Trash size={16}/></button>
            </div>
        ))}
        <button 
            onClick={() => onChange([...items, ''])}
            className="text-xs font-bold text-indigo-600 flex items-center gap-1 hover:underline"
        >
            <Plus size={12}/> Add Item
        </button>
    </div>
  );

  return (
    <div className="flex h-screen bg-slate-100 font-sans overflow-hidden">
      
      {/* 2. Left Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex-shrink-0 hidden lg:flex flex-col">
        <div className="p-4 border-b border-slate-100">
           <div className="flex items-center gap-2 font-bold text-indigo-700">
              <Settings size={20} /> Advanced Editor
           </div>
           <div className="text-xs text-slate-400 mt-1">SaaS Mode v3.0 (Pro)</div>
        </div>
        <nav className="flex-1 overflow-y-auto py-4 space-y-0.5 px-3 custom-scrollbar">
           {MENU_ITEMS.map(item => (
             <button
               key={item.id}
               onClick={() => scrollToSection(item.id)}
               className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all ${
                 activeSection === item.id 
                   ? 'bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200' 
                   : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
               }`}
             >
               <item.icon size={16} className={activeSection === item.id ? 'text-indigo-600' : 'text-slate-400'} />
               {item.label}
             </button>
           ))}
        </nav>
        <div className="p-4 border-t border-slate-100">
           <button onClick={() => navigate('/admin')} className="flex items-center gap-2 text-slate-500 text-sm hover:text-slate-800">
              <ArrowLeft size={16} /> Back to Dashboard
           </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* Header Bar */}
        <header className="bg-white h-16 border-b border-slate-200 flex items-center justify-between px-6 flex-shrink-0 z-10">
           <div className="flex items-center gap-4">
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide border ${
                post.category === 'Result' ? 'bg-green-50 text-green-700 border-green-200' :
                'bg-indigo-50 text-indigo-700 border-indigo-200'
              }`}>
                 {post.category}
              </span>
              <div className="h-4 w-px bg-slate-300 mx-2"></div>
              <select 
                value={post.status} 
                onChange={e => setPost({...post, status: e.target.value as any})}
                className={`text-sm font-bold rounded-full px-3 py-1 border ${
                  post.status === 'Published' ? 'bg-green-100 text-green-800 border-green-200' : 
                  post.status === 'Draft' ? 'bg-slate-100 text-slate-800 border-slate-200' :
                  'bg-amber-100 text-amber-800 border-amber-200'
                }`}
              >
                 <option value="Draft">Draft</option>
                 <option value="Published">Published</option>
                 <option value="Scheduled">Scheduled</option>
              </select>
           </div>

           <div className="flex items-center gap-3">
               <button 
                  onClick={handleAutoWrite}
                  disabled={isAutoWriting || !post.title}
                  className="bg-gradient-to-r from-amber-400 to-orange-500 text-white px-5 py-2 rounded-full text-sm font-bold hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center gap-2 disabled:opacity-70 disabled:hover:translate-y-0"
               >
                  {isAutoWriting ? <Cpu className="animate-spin" size={16}/> : <Zap size={16} className="fill-white"/>} 
                  {isAutoWriting ? 'Analysing...' : '👑 Super Rank AI'}
               </button>
               <button 
                  onClick={handleSave}
                  className="bg-indigo-600 text-white px-5 py-2 rounded-lg text-sm font-bold hover:bg-indigo-700 transition-colors shadow-md flex items-center gap-2"
               >
                  <Save size={16} /> Publish
               </button>
           </div>
        </header>

        {/* Scrollable Form Area */}
        <main className="flex-1 overflow-y-auto p-6 lg:px-12 lg:py-8 custom-scrollbar">
           <div className="max-w-5xl mx-auto">
              
              {/* 2. Advanced Post Configuration (Replaces Basic Info) */}
              <Card id="basic" title="Advanced Post Configuration" icon={Settings}>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                       <InputGroup label="Post Title (H1)" required tooltip="This is the main title of your page.">
                          <input 
                             type="text" 
                             value={post.title} 
                             onChange={e => setPost({...post, title: e.target.value})}
                             className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-lg font-medium"
                             placeholder="e.g. WBSSC Group C & D Recruitment 2025 Online Form"
                          />
                       </InputGroup>
                    </div>

                    <InputGroup label="URL Slug" required tooltip="The URL path. Keep it short and keyword rich.">
                       <div className="flex">
                          <span className="bg-slate-100 border border-r-0 border-slate-300 rounded-l-lg px-3 py-2 text-slate-500 text-sm flex items-center">/post/</span>
                          <input type="text" value={post.slug} onChange={e => setPost({...post, slug: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-r-lg font-mono text-sm text-indigo-600" />
                       </div>
                    </InputGroup>

                    <InputGroup label="Department / Board Name">
                       <div className="relative">
                           <Building2 size={16} className="absolute left-3 top-3 text-slate-400"/>
                           <input type="text" value={post.department || ''} onChange={e => setPost({...post, department: e.target.value})} className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg" placeholder="e.g. SSC, Indian Railways"/>
                       </div>
                    </InputGroup>
                    
                    <InputGroup label="Category" required>
                       <select value={post.category} onChange={e => setPost({...post, category: e.target.value as any})} className="w-full px-3 py-2 border border-slate-300 rounded-lg">
                          {Object.values(JobCategory).map(c => <option key={c} value={c}>{c}</option>)}
                       </select>
                    </InputGroup>
                    
                    <InputGroup label="Sub Category">
                        <select value={post.subCategory || ''} onChange={e => setPost({...post, subCategory: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg">
                           <option value="">Select...</option>
                           <option value="SSC">SSC</option>
                           <option value="Railway">Railway</option>
                           <option value="Bank">Bank</option>
                           <option value="Police">Police</option>
                           <option value="Defence">Defence</option>
                           <option value="State PSC">State PSC</option>
                           <option value="Teaching">Teaching</option>
                           <option value="UPSC">UPSC</option>
                        </select>
                    </InputGroup>
                    
                    <InputGroup label="State / Location" required>
                        <div className="relative">
                            <MapPin size={16} className="absolute left-3 top-3 text-slate-400"/>
                            <select value={post.state} onChange={e => setPost({...post, state: e.target.value})} className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg">
                                {ALL_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                    </InputGroup>

                    <InputGroup label="Job Type">
                        <select value={post.jobType || 'Permanent'} onChange={e => setPost({...post, jobType: e.target.value as any})} className="w-full px-3 py-2 border border-slate-300 rounded-lg">
                           <option value="Permanent">Permanent</option>
                           <option value="Contract">Contractual</option>
                           <option value="Part Time">Part Time</option>
                           <option value="Apprentice">Apprentice</option>
                        </select>
                    </InputGroup>

                    <InputGroup label="Application Mode">
                         <select value={post.applicationMode || 'Online'} onChange={e => setPost({...post, applicationMode: e.target.value as any})} className="w-full px-3 py-2 border border-slate-300 rounded-lg">
                           <option value="Online">Online</option>
                           <option value="Offline">Offline</option>
                           <option value="Both">Both</option>
                        </select>
                    </InputGroup>
                 </div>
              </Card>

              {/* 3. Job Snapshot */}
              <Card id="snapshot" title="Job Snapshot" icon={Activity}>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <InputGroup label="Total Vacancy">
                         <input type="text" value={post.totalVacancy || ''} onChange={e => setPost({...post, totalVacancy: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg" />
                      </InputGroup>
                      <InputGroup label="Apply Online URL">
                         <input type="url" value={post.applyUrl || ''} onChange={e => setPost({...post, applyUrl: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg" />
                      </InputGroup>
                      <InputGroup label="Notification URL">
                         <input type="url" value={post.notificationUrl || ''} onChange={e => setPost({...post, notificationUrl: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg" />
                      </InputGroup>
                  </div>
              </Card>

              {/* 4. Important Dates & Fees */}
              <Card id="dates" title="Important Dates & Fees" icon={Calendar}>
                  <div className="grid md:grid-cols-2 gap-8">
                      <div>
                          <h4 className="text-sm font-bold text-slate-700 mb-2">Dates</h4>
                          {(post.details?.dates || []).map((row, idx) => (
                             <div key={idx} className="flex gap-2 mb-2">
                                <input placeholder="Label" value={row.label} onChange={e => { const n = [...(post.details?.dates || [])]; n[idx].label = e.target.value; updateDetail('dates', n); }} className="w-1/2 border rounded px-2 py-1 text-sm" />
                                <input placeholder="Date" value={row.date} onChange={e => { const n = [...(post.details?.dates || [])]; n[idx].date = e.target.value; updateDetail('dates', n); }} className="w-1/2 border rounded px-2 py-1 text-sm" />
                             </div>
                          ))}
                          <button onClick={() => updateDetail('dates', [...(post.details?.dates || []), { label: '', date: '' }])} className="text-xs font-bold text-indigo-600">+ Add Date</button>
                      </div>
                      <div>
                          <h4 className="text-sm font-bold text-slate-700 mb-2">Fees</h4>
                          {(post.details?.fee || []).map((row, idx) => (
                             <div key={idx} className="flex gap-2 mb-2">
                                <input placeholder="Category" value={row.category} onChange={e => { const n = [...(post.details?.fee || [])]; n[idx].category = e.target.value; updateDetail('fee', n); }} className="w-1/2 border rounded px-2 py-1 text-sm" />
                                <input placeholder="Amount" value={row.amount} onChange={e => { const n = [...(post.details?.fee || [])]; n[idx].amount = e.target.value; updateDetail('fee', n); }} className="w-1/2 border rounded px-2 py-1 text-sm" />
                             </div>
                          ))}
                          <button onClick={() => updateDetail('fee', [...(post.details?.fee || []), { category: '', amount: '' }])} className="text-xs font-bold text-indigo-600">+ Add Fee</button>
                      </div>
                  </div>
              </Card>

              {/* 5. Vacancy */}
              <Card id="vacancy" title="Vacancy Details" icon={Users}>
                 <div className="overflow-x-auto border rounded-lg">
                    <table className="w-full text-xs text-left">
                       <thead className="bg-slate-100 font-bold">
                           <tr>
                               <th className="p-2">Post Name</th>
                               <th className="p-2 w-16">Total</th>
                               <th className="p-2 w-10"></th>
                           </tr>
                       </thead>
                       <tbody>
                           {(post.details?.vacancy || []).map((row, idx) => (
                               <tr key={idx} className="border-t">
                                   <td className="p-2"><input value={row.postName} onChange={e => { const n = [...(post.details?.vacancy || [])]; n[idx].postName = e.target.value; updateDetail('vacancy', n); }} className="w-full border rounded px-1" /></td>
                                   <td className="p-2"><input value={row.total} onChange={e => { const n = [...(post.details?.vacancy || [])]; n[idx].total = e.target.value; updateDetail('vacancy', n); }} className="w-full border rounded px-1" /></td>
                                   <td className="p-2"><button onClick={() => { const n = [...(post.details?.vacancy || [])]; n.splice(idx, 1); updateDetail('vacancy', n); }}><Trash size={12} className="text-red-500"/></button></td>
                               </tr>
                           ))}
                       </tbody>
                    </table>
                 </div>
                 <button onClick={() => updateDetail('vacancy', [...(post.details?.vacancy || []), { postName: '', total: '' }])} className="mt-2 text-xs font-bold text-indigo-600">+ Add Post</button>
              </Card>

              {/* 6. Eligibility */}
              <Card id="eligibility" title="Eligibility Criteria" icon={Award}>
                 <div className="grid grid-cols-2 gap-4 mb-4">
                    <InputGroup label="Min Age">
                       <input value={post.details?.ageLimit?.min || ''} onChange={e => updateDetail('ageLimit', {...post.details?.ageLimit, min: e.target.value})} className="w-full border rounded px-2 py-1" />
                    </InputGroup>
                    <InputGroup label="Max Age">
                       <input value={post.details?.ageLimit?.max || ''} onChange={e => updateDetail('ageLimit', {...post.details?.ageLimit, max: e.target.value})} className="w-full border rounded px-2 py-1" />
                    </InputGroup>
                 </div>
                 <InputGroup label="Qualifications (List)">
                    <ListEditor 
                        items={post.details?.qualification || []} 
                        onChange={items => updateDetail('qualification', items)}
                        placeholder="e.g. 10th Pass"
                    />
                 </InputGroup>
              </Card>
              
              {/* 7. Exam & Selection Process */}
              <Card id="exam" title="Exam & Selection Process" icon={ClipboardList}>
                 <InputGroup label="Selection Process (Steps)">
                    <ListEditor 
                        items={post.details?.selectionProcess || []}
                        onChange={items => updateDetail('selectionProcess', items)}
                        placeholder="e.g. Written Exam"
                    />
                 </InputGroup>
                 
                 <div className="mt-6">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Exam Pattern (Detailed)</label>
                    <div className="overflow-x-auto border rounded-lg">
                       <table className="w-full text-xs text-left">
                          <thead className="bg-slate-100 font-bold">
                              <tr>
                                  <th className="p-2">Paper Name</th>
                                  <th className="p-2">Subject</th>
                                  <th className="p-2">Questions</th>
                                  <th className="p-2">Marks</th>
                                  <th className="p-2">Time</th>
                                  <th className="p-2 w-10"></th>
                              </tr>
                          </thead>
                          <tbody>
                              {(post.details?.examPattern || []).map((row, idx) => (
                                  <tr key={idx} className="border-t">
                                      <td className="p-2"><input placeholder="Paper I" value={row.paperName || ''} onChange={e => { const n = [...(post.details?.examPattern || [])]; n[idx].paperName = e.target.value; updateDetail('examPattern', n); }} className="w-full border rounded px-1" /></td>
                                      <td className="p-2"><input placeholder="Gen. Knowledge" value={row.subject} onChange={e => { const n = [...(post.details?.examPattern || [])]; n[idx].subject = e.target.value; updateDetail('examPattern', n); }} className="w-full border rounded px-1" /></td>
                                      <td className="p-2"><input placeholder="50" value={row.questions} onChange={e => { const n = [...(post.details?.examPattern || [])]; n[idx].questions = e.target.value; updateDetail('examPattern', n); }} className="w-full border rounded px-1" /></td>
                                      <td className="p-2"><input placeholder="100" value={row.marks} onChange={e => { const n = [...(post.details?.examPattern || [])]; n[idx].marks = e.target.value; updateDetail('examPattern', n); }} className="w-full border rounded px-1" /></td>
                                      <td className="p-2"><input placeholder="60 Min" value={row.duration} onChange={e => { const n = [...(post.details?.examPattern || [])]; n[idx].duration = e.target.value; updateDetail('examPattern', n); }} className="w-full border rounded px-1" /></td>
                                      <td className="p-2"><button onClick={() => { const n = [...(post.details?.examPattern || [])]; n.splice(idx, 1); updateDetail('examPattern', n); }}><Trash size={12} className="text-red-500"/></button></td>
                                  </tr>
                              ))}
                          </tbody>
                       </table>
                    </div>
                    <button onClick={() => updateDetail('examPattern', [...(post.details?.examPattern || []), { paperName: '', subject: '', questions: '', marks: '', duration: '' }])} className="mt-2 text-xs font-bold text-indigo-600">+ Add Exam Subject</button>
                 </div>
              </Card>

              {/* 10. Content Body */}
              <Card 
                id="content" 
                title="Detailed Content" 
                icon={FileText}
                rightElement={
                   <div className="flex gap-2">
                       <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded border border-green-200 flex items-center gap-1">
                          <CheckCircle size={10} /> NLP Optimized
                       </span>
                   </div>
                }
              >
                 <div className="mb-6 p-4 bg-indigo-50 border border-indigo-100 rounded-xl">
                    <div className="flex gap-2">
                        <input 
                            type="text" 
                            value={customTopic}
                            onChange={(e) => setCustomTopic(e.target.value)}
                            placeholder="Enter topic..."
                            className="flex-1 px-4 py-2 border border-indigo-200 rounded-lg text-sm"
                        />
                        <button 
                            onClick={handleCustomContentGen}
                            disabled={isWritingCustom}
                            className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-bold disabled:opacity-70"
                        >
                            {isWritingCustom ? 'Writing...' : 'Write Article'}
                        </button>
                    </div>
                 </div>

                 <div className="space-y-6">
                     <InputGroup label="1. Introduction (Hook) - Featured Snippet Optimized">
                        <textarea 
                           value={post.details?.introduction || ''} 
                           onChange={e => updateDetail('introduction', e.target.value)} 
                           className="w-full px-3 py-2 border border-slate-300 rounded-lg h-24 text-sm bg-amber-50" 
                           placeholder="Friends, this is a great opportunity..."
                        />
                     </InputGroup>

                     <InputGroup label="3. How to Apply (Steps)">
                        <ListEditor 
                            items={post.details?.howToApply || []}
                            onChange={items => updateDetail('howToApply', items)}
                            placeholder="e.g. Visit Official Website"
                        />
                     </InputGroup>

                     <InputGroup label="4. Important Documents (List)">
                        <ListEditor 
                            items={post.details?.importantDocuments || []}
                            onChange={items => updateDetail('importantDocuments', items)}
                            placeholder="e.g. Aadhar Card"
                        />
                     </InputGroup>

                     <InputGroup label="5. Salary Structure (Explanation)">
                        <textarea 
                           value={post.details?.salary?.structure || ''} 
                           onChange={e => updateDetail('salary', { ...post.details?.salary, structure: e.target.value })} 
                           className="w-full px-3 py-2 border border-slate-300 rounded-lg h-20 text-sm" 
                           placeholder="Explain basic pay + grade pay..."
                        />
                     </InputGroup>
                 </div>
              </Card>
              
              {/* New: Advanced Custom Fields & Social */}
              <Card id="custom" title="Advanced Custom Fields & Social" icon={Database}>
                 <div className="mb-6 border-b border-slate-100 pb-6">
                     <h4 className="font-bold text-sm text-slate-800 mb-4 flex items-center gap-2">
                         <Share2 size={16} className="text-indigo-600" /> Post Specific Social Links
                     </h4>
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                         <InputGroup label="WhatsApp Group Link">
                             <input 
                                type="url" 
                                value={post.details?.socialLinks?.whatsapp || ''} 
                                onChange={e => updateDetail('socialLinks', {...post.details?.socialLinks, whatsapp: e.target.value})} 
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm" 
                                placeholder="https://chat.whatsapp.com/..."
                             />
                         </InputGroup>
                         <InputGroup label="Telegram Channel Link">
                             <input 
                                type="url" 
                                value={post.details?.socialLinks?.telegram || ''} 
                                onChange={e => updateDetail('socialLinks', {...post.details?.socialLinks, telegram: e.target.value})} 
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm" 
                                placeholder="https://t.me/..."
                             />
                         </InputGroup>
                         <InputGroup label="Facebook Group Link">
                             <input 
                                type="url" 
                                value={post.details?.socialLinks?.facebook || ''} 
                                onChange={e => updateDetail('socialLinks', {...post.details?.socialLinks, facebook: e.target.value})} 
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm" 
                                placeholder="https://facebook.com/..."
                             />
                         </InputGroup>
                     </div>
                 </div>

                 <div>
                     <h4 className="font-bold text-sm text-slate-800 mb-2 flex items-center gap-2">
                         <Database size={16} className="text-indigo-600" /> Custom Info Blocks
                     </h4>
                     <p className="text-xs text-slate-500 mb-4">Add extra sections like "Promotion & Career Growth", "Job Profile", etc.</p>
                     
                     <div className="space-y-4">
                         {(post.details?.customFields || []).map((field, idx) => (
                             <div key={idx} className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                                 <div className="flex justify-between items-start mb-2">
                                     <input 
                                        type="text" 
                                        placeholder="Section Title (e.g. Promotion Policy)" 
                                        value={field.title}
                                        onChange={e => {
                                            const newFields = [...(post.details?.customFields || [])];
                                            newFields[idx].title = e.target.value;
                                            updateDetail('customFields', newFields);
                                        }}
                                        className="font-bold text-slate-700 bg-transparent border-b border-slate-300 focus:border-indigo-500 outline-none w-2/3"
                                     />
                                     <button 
                                        onClick={() => {
                                            const newFields = [...(post.details?.customFields || [])];
                                            newFields.splice(idx, 1);
                                            updateDetail('customFields', newFields);
                                        }} 
                                        className="text-red-500 hover:text-red-700"
                                     >
                                         <Trash size={16} />
                                     </button>
                                 </div>
                                 <textarea 
                                     placeholder="Section content..." 
                                     value={field.content}
                                     onChange={e => {
                                         const newFields = [...(post.details?.customFields || [])];
                                         newFields[idx].content = e.target.value;
                                         updateDetail('customFields', newFields);
                                     }}
                                     className="w-full p-2 text-sm border border-slate-300 rounded-md h-24"
                                 />
                             </div>
                         ))}
                     </div>
                     <button 
                        onClick={() => updateDetail('customFields', [...(post.details?.customFields || []), { title: '', content: '' }])}
                        className="mt-4 flex items-center gap-2 text-sm font-bold text-indigo-600 hover:bg-indigo-50 px-3 py-2 rounded-lg"
                     >
                         <Plus size={16} /> Add Custom Field
                     </button>
                 </div>
              </Card>

              {/* 11. SEO & Discovery (AHREFS STYLE) */}
              <Card 
                id="seo" 
                title="Rank #1 SEO Suite (Ahrefs Mode)" 
                icon={Target}
              >
                 <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
                     <Trophy className="text-amber-500 flex-shrink-0 mt-0.5" size={20} />
                     <div>
                         <h4 className="font-bold text-amber-800 text-sm">Rank 1-5 Targeting Active</h4>
                         <p className="text-xs text-amber-700">This tool uses "Sniper SEO" mode to find low-difficulty keywords you can easily rank for.</p>
                     </div>
                 </div>

                 <h3 className="font-extrabold text-lg text-slate-800 mb-4 border-b pb-2 flex items-center gap-2">
                    <Zap className="text-indigo-600" size={20}/> AI-Powered SEO Suite
                 </h3>

                 {/* Google Snippet Preview */}
                 <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm mb-8">
                     <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1">
                         <Globe size={12} /> Google Search Preview
                     </h4>
                     <div className="font-sans max-w-xl">
                         <div className="text-sm text-slate-800 mb-1 flex items-center gap-2">
                             <div className="bg-slate-100 p-1 rounded-full"><Globe size={14}/></div>
                             <span>sarkariai.com</span>
                             <span className="text-slate-400">› post › {post.slug || 'url-slug'}</span>
                         </div>
                         <h3 className="text-xl text-[#1a0dab] hover:underline cursor-pointer font-medium leading-snug mb-1 truncate">
                             {post.seo?.seoTitle || post.title || 'Your Post Title Here'}
                         </h3>
                         <p className="text-sm text-[#4d5156] leading-relaxed line-clamp-2">
                             {post.seo?.seoDescription || post.shortDescription || 'This is how your description will appear in search results. Ensure it includes keywords and a call to action.'}
                         </p>
                     </div>
                 </div>

                 <button 
                      onClick={handleMagicSEO}
                      disabled={isAnalyzingSeo}
                      className="w-full mb-8 bg-slate-900 text-white px-3 py-3 rounded-xl font-bold disabled:opacity-70 flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors shadow-lg border border-slate-700"
                   >
                      {isAnalyzingSeo ? <Cpu className="animate-spin" /> : <TrendingUp />}
                      {isAnalyzingSeo ? 'Analyzing for Rank #1...' : '🚀 Generate "Rank #1" Keyword Strategy'}
                   </button>
                   
                   {/* SEO Strategy Visualization */}
                   {seoStrategy && (
                       <div className="mt-6 animate-in fade-in space-y-6">
                           
                           {/* Keywords Table */}
                           <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                               <div className="bg-indigo-50 px-4 py-3 border-b border-indigo-100 flex items-center justify-between">
                                   <div className="flex items-center gap-2 text-indigo-800 font-bold text-sm">
                                       <Target size={16} /> Winning Keywords (Low Difficulty)
                                   </div>
                               </div>
                               <table className="w-full text-sm text-left">
                                   <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold">
                                       <tr>
                                           <th className="px-4 py-2">Keyword</th>
                                           <th className="px-4 py-2">Vol</th>
                                           <th className="px-4 py-2">KD</th>
                                           <th className="px-4 py-2">Potential</th>
                                       </tr>
                                   </thead>
                                   <tbody>
                                       {seoStrategy.targetKeywords.map((k, i) => (
                                           <tr key={i} className="border-t border-slate-100 hover:bg-slate-50">
                                               <td className="px-4 py-2 font-medium text-slate-700">{k.term}</td>
                                               <td className="px-4 py-2 text-slate-500">{k.volume}</td>
                                               <td className="px-4 py-2">
                                                   <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${k.difficulty.includes('Easy') ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                                       {k.difficulty}
                                                   </span>
                                               </td>
                                               <td className="px-4 py-2 text-indigo-600 font-bold text-xs">{k.rankPotential}</td>
                                           </tr>
                                       ))}
                                   </tbody>
                               </table>
                           </div>

                           {/* Backlink Plan */}
                           <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                               <div className="bg-emerald-50 px-4 py-3 border-b border-emerald-100 flex items-center gap-2 text-emerald-800 font-bold text-sm">
                                   <LinkIcon size={16} /> 40+ Backlink Opportunities
                               </div>
                               <div className="p-4">
                                   <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Action Plan</p>
                                   <p className="text-sm text-slate-700 mb-4 bg-slate-50 p-2 rounded border border-slate-100">{seoStrategy.backlinkStrategy.actionPlan}</p>
                                   
                                   <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Target Sites</p>
                                   <div className="h-48 overflow-y-auto border border-slate-200 rounded-lg bg-slate-50 p-3 text-xs space-y-1 custom-scrollbar">
                                       {seoStrategy.backlinkStrategy.sources.map((site, i) => (
                                           <div key={i} className="flex items-center gap-2 text-indigo-700">
                                               <span className="text-slate-400 font-mono w-5">{i+1}.</span> {site}
                                           </div>
                                       ))}
                                   </div>
                               </div>
                           </div>
                       </div>
                   )}

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                     <div className="md:col-span-2">
                         <InputGroup label="SEO Meta Title" tooltip="Optimal length: 50-60 characters">
                             <input 
                                type="text" 
                                value={post.seo?.seoTitle || ''} 
                                onChange={e => setPost({...post, seo: {...post.seo, seoTitle: e.target.value}})} 
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg font-bold text-slate-700" 
                                placeholder="Rank #1 Title"
                             />
                             <div className="flex justify-end mt-1">
                                 <span className={`text-xs font-bold ${(post.seo?.seoTitle?.length || 0) > 60 ? 'text-red-500' : 'text-emerald-600'}`}>
                                     {post.seo?.seoTitle?.length || 0} / 60
                                 </span>
                             </div>
                         </InputGroup>
                     </div>

                     <div className="md:col-span-2">
                         <InputGroup label="Meta Description" tooltip="Optimal length: 150-160 characters">
                             <textarea 
                                value={post.seo?.seoDescription || ''} 
                                onChange={e => setPost({...post, seo: {...post.seo, seoDescription: e.target.value}})} 
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg" 
                                rows={3} 
                                placeholder="Click-worthy description..."
                             />
                             <div className="flex justify-end mt-1">
                                 <span className={`text-xs font-bold ${(post.seo?.seoDescription?.length || 0) > 160 ? 'text-red-500' : 'text-emerald-600'}`}>
                                     {post.seo?.seoDescription?.length || 0} / 160
                                 </span>
                             </div>
                         </InputGroup>
                     </div>

                     <InputGroup label="Focus Keyword" tooltip="The main keyword you want to rank for.">
                         <div className="relative">
                             <Target size={16} className="absolute left-3 top-3 text-slate-400"/>
                             <input 
                                type="text" 
                                value={post.seo?.focusKeyword || ''} 
                                onChange={e => setPost({...post, seo: {...post.seo, focusKeyword: e.target.value}})} 
                                className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg font-bold text-indigo-700"
                                placeholder="e.g. SSC CGL 2025"
                             />
                         </div>
                     </InputGroup>

                     <InputGroup label="Canonical URL" tooltip="Leave empty if this is the original post.">
                         <input 
                            type="text" 
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg" 
                            placeholder="https://..."
                         />
                     </InputGroup>
                     
                     {/* Robots Meta */}
                     <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                         <h5 className="font-bold text-sm text-slate-700 mb-3">Robots Meta Tags</h5>
                         <div className="flex gap-4">
                             <label className="flex items-center gap-2 cursor-pointer">
                                 <input 
                                    type="checkbox" 
                                    checked={post.seo?.indexing !== false} 
                                    onChange={e => setPost({...post, seo: {...post.seo, indexing: e.target.checked}})} 
                                    className="w-4 h-4 text-indigo-600 rounded"
                                 />
                                 <span className="text-sm font-medium">Index</span>
                             </label>
                             <label className="flex items-center gap-2 cursor-pointer">
                                 <input 
                                    type="checkbox" 
                                    checked={post.seo?.follow !== false} 
                                    onChange={e => setPost({...post, seo: {...post.seo, follow: e.target.checked}})} 
                                    className="w-4 h-4 text-indigo-600 rounded"
                                 />
                                 <span className="text-sm font-medium">Follow</span>
                             </label>
                         </div>
                     </div>
                 </div>
              </Card>

              {/* 14. Automation */}
              <Card id="automation" title="AI Tools" icon={Cpu}>
                 {/* Import Notification Tool */}
                 <div className="mb-6">
                     <button 
                        onClick={() => setShowImportModal(true)}
                        className="w-full p-4 border border-indigo-200 bg-indigo-50 rounded-xl flex items-center justify-center gap-2 hover:shadow-md transition-all text-indigo-800 font-bold"
                     >
                        <FileInput size={20} /> ✨ Import from Notification PDF (Text)
                     </button>
                 </div>
              </Card>

           </div>
        </main>
      </div>

       {/* Import Modal */}
       {showImportModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-in fade-in">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl p-6">
                <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <FileInput className="text-indigo-600"/> Import Notification Data
                </h3>
                <textarea 
                    value={notificationText}
                    onChange={(e) => setNotificationText(e.target.value)}
                    className="w-full h-64 border border-slate-300 rounded-lg p-3 font-mono text-xs mb-4 focus:ring-2 focus:ring-indigo-500"
                    placeholder="Paste text here..."
                ></textarea>
                <div className="flex justify-end gap-3">
                    <button 
                        onClick={() => setShowImportModal(false)}
                        className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-100 rounded-lg"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={handleImportNotification}
                        disabled={!notificationText}
                        className="px-4 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                    >
                        Extract Data
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};