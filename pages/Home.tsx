import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { JobCategory, JobPost, QuickLink } from '../types';
import { getPostsByCategory, ALL_STATES, ALL_CATEGORIES_LIST, getSiteSettings } from '../services/mockData';
import { AdUnit } from '../components/AdUnit';
import { MapPin, Star, ArrowRight, Zap, Bell, CheckCircle, Search, Flame, MessageCircle, Send, CheckSquare, Server, Train, Shield, Target, BookOpen, Landmark, Building2, Gavel, Stethoscope, Users, FileText, GraduationCap, Briefcase, Cpu, Hammer, X, ExternalLink, RefreshCw } from 'lucide-react';

// --- Components ---

const QuickAccessSection = ({ links }: { links: QuickLink[] }) => {
    const [modalLink, setModalLink] = useState<QuickLink | null>(null);
    const [loadingIframe, setLoadingIframe] = useState(false);

    const handleLinkClick = (link: QuickLink, e: React.MouseEvent) => {
        if (link.type === 'redirect') {
            return; // Let default behavior handle it
        }
        e.preventDefault();
        setModalLink(link);
        setLoadingIframe(true);
    };

    const handleIframeLoad = () => {
        setLoadingIframe(false);
    };

    if (!links || links.length === 0) return null;

    return (
        <>
            <div className="bg-white border-b border-indigo-100 py-3 shadow-sm sticky top-16 z-30 overflow-x-auto">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-3">
                        <span className="flex-shrink-0 bg-rose-600 text-white text-[10px] font-bold px-2 py-1 rounded animate-pulse">
                            LIVE CHECK
                        </span>
                        <div className="flex gap-3">
                            {links.filter(l => l.isActive).map((link) => (
                                <a
                                    key={link.id}
                                    href={link.url}
                                    onClick={(e) => handleLinkClick(link, e)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`flex-shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border transition-colors ${
                                        link.category === 'Result' 
                                        ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100' 
                                        : link.category === 'Admit Card'
                                        ? 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'
                                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                                    }`}
                                >
                                    {link.category === 'Result' ? <CheckCircle size={12}/> : <FileText size={12}/>}
                                    {link.title}
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Safe Iframe Modal */}
            {modalLink && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-white w-full max-w-5xl h-[85vh] rounded-xl flex flex-col overflow-hidden shadow-2xl relative">
                        {/* Modal Header */}
                        <div className="bg-indigo-900 text-white px-4 py-3 flex justify-between items-center flex-shrink-0">
                            <div className="flex items-center gap-3">
                                <h3 className="font-bold text-sm md:text-base flex items-center gap-2">
                                    <GlobeIcon size={16} className="text-blue-300"/> {modalLink.title}
                                </h3>
                                <span className="bg-white/20 px-2 py-0.5 rounded text-[10px] font-mono hidden md:inline-block truncate max-w-[200px]">
                                    {modalLink.url}
                                </span>
                            </div>
                            <button onClick={() => setModalLink(null)} className="hover:bg-white/20 p-2 rounded-full transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Safety Warning Bar */}
                        <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 flex items-center justify-between text-xs text-amber-800">
                             <span className="flex items-center gap-2">
                                 <AlertIcon size={14} /> If content is blank or blocked, official site may prevent embedding.
                             </span>
                             <a 
                                href={modalLink.url} 
                                target="_blank" 
                                rel="noreferrer" 
                                className="font-bold underline flex items-center gap-1 hover:text-amber-900"
                             >
                                Open in New Tab <ExternalLink size={12} />
                             </a>
                        </div>

                        {/* Iframe Area */}
                        <div className="flex-1 bg-slate-100 relative">
                             {loadingIframe && (
                                 <div className="absolute inset-0 flex items-center justify-center z-10 bg-white/50">
                                     <div className="flex flex-col items-center gap-2">
                                         <RefreshCw className="animate-spin text-indigo-600" size={30} />
                                         <span className="text-xs font-bold text-indigo-800">Loading Official Site...</span>
                                     </div>
                                 </div>
                             )}
                             <iframe 
                                src={modalLink.url} 
                                className="w-full h-full border-0"
                                onLoad={handleIframeLoad}
                                title="External Content"
                                sandbox="allow-forms allow-scripts allow-same-origin allow-popups"
                             />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

const GlobeIcon = ({size, className}: {size:number, className?:string}) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1 4-10z"/><path d="M2 12h20"/></svg>
);
const AlertIcon = ({size}: {size:number}) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
);


const HeroSection = () => {
  const [siteName, setSiteName] = useState('SarkariAI');
  
  useEffect(() => {
    const settings = getSiteSettings();
    setSiteName(settings.general.siteName || 'SarkariAI');
  }, []);

  return (
    <div className="bg-gradient-to-r from-rose-700 via-pink-700 to-rose-800 text-white pt-10 pb-16 px-4 relative overflow-hidden">
     {/* Decorative circles */}
     <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
     <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/20 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl"></div>

     <div className="max-w-4xl mx-auto text-center relative z-10">
        <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wider mb-6 animate-pulse">
            <span className="w-2 h-2 bg-green-400 rounded-full"></span> Result Server Live
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4 drop-shadow-md">
           India's No.1 <span className="text-yellow-300">Sarkari Result</span> Portal
        </h1>
        <p className="text-rose-100 text-lg mb-8 font-medium">
           The Fastest Updates for Exam Results, Merit Lists & Cut-offs on {siteName}
        </p>
        
        {/* Search Bar */}
        <div className="relative max-w-2xl mx-auto mb-6">
           <input 
              type="text" 
              placeholder="Search Result (e.g. 'SSC CGL Result', '10th Board')..." 
              className="w-full pl-12 pr-4 py-4 rounded-full text-slate-800 focus:outline-none focus:ring-4 focus:ring-rose-500/30 shadow-xl font-medium placeholder-slate-400"
           />
           <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
           <button className="absolute right-2 top-2 bottom-2 bg-rose-600 hover:bg-rose-700 text-white px-6 rounded-full font-bold transition-colors">
              Find Result
           </button>
        </div>

        {/* Trending Tags */}
        <div className="flex flex-wrap justify-center gap-2 text-xs md:text-sm">
           <span className="opacity-75">Trending Results:</span>
           {['SSC CGL 2024', 'UPSC Prelims', 'Railway Group D', 'Bihar Board', 'CBSE 10th'].map(tag => (
              <span key={tag} className="bg-white/10 hover:bg-white/20 px-3 py-1 rounded-full cursor-pointer transition-colors border border-white/10">
                 {tag}
              </span>
           ))}
        </div>
     </div>
  </div>
  );
};

const LiveTicker = () => (
  <div className="bg-slate-900 text-white text-sm font-bold py-2.5 overflow-hidden relative shadow-md z-20 border-b border-slate-700">
    <div className="flex items-center absolute left-0 top-0 bottom-0 bg-rose-600 px-3 z-30 shadow-lg clip-path-slant">
       <span className="flex items-center gap-1"><Zap size={14} className="fill-current text-yellow-300"/> BREAKING NEWS</span>
    </div>
    <div className="inline-block animate-marquee pl-40 whitespace-nowrap">
      <span className="mx-8 inline-flex items-center gap-2 hover:text-yellow-300 cursor-pointer transition-colors">🚀 SSC CGL 2024 RESULT DECLARED</span>
      <span className="mx-8 text-white/20">|</span>
      <span className="mx-8 inline-flex items-center gap-2 hover:text-yellow-300 cursor-pointer transition-colors">🔥 RAILWAY NTPC CBT-1 RESULT OUT</span>
      <span className="mx-8 text-white/20">|</span>
      <span className="mx-8 inline-flex items-center gap-2 hover:text-yellow-300 cursor-pointer transition-colors">📌 UP POLICE CONSTABLE MERIT LIST PDF</span>
      <span className="mx-8 text-white/20">|</span>
      <span className="mx-8 inline-flex items-center gap-2 hover:text-yellow-300 cursor-pointer transition-colors">WB MADHYAMIK RESULT 2025 LINK ACTIVE</span>
    </div>
  </div>
);

const ColumnHeader: React.FC<{ title: string; colorFrom: string; colorTo: string; icon: React.ReactNode; link: string, live?: boolean }> = ({ title, colorFrom, colorTo, icon, link, live }) => (
  <div className={`flex items-center justify-between px-5 py-4 bg-gradient-to-r ${colorFrom} ${colorTo} text-white shadow-md relative overflow-hidden group`}>
    <div className="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 transition-transform group-hover:scale-125 duration-500"></div>
    <div className="relative z-10">
        <h2 className="font-extrabold text-xl tracking-wide uppercase flex items-center gap-2">
        {icon} {title}
        </h2>
        {live && <div className="text-[10px] font-bold text-green-300 flex items-center gap-1 mt-0.5"><div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div> Servers Fastest</div>}
    </div>
    <Link to={link} className="text-[10px] font-bold bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-full transition-all flex items-center gap-1 uppercase backdrop-blur-sm relative z-10 border border-white/20">
      View All <ArrowRight size={10} />
    </Link>
  </div>
);

const HighImpactJobItem: React.FC<{ post: JobPost; index: number; type: 'result' | 'admit' | 'job' }> = ({ post, index, type }) => {
    const isNew = index < 3; 
    let accentColor = 'group-hover:text-indigo-700';
    let badgeColor = 'from-indigo-500 to-indigo-600';
    let badgeText = 'NEW';
    
    if (type === 'result') {
        accentColor = 'group-hover:text-rose-700';
        badgeColor = 'from-rose-500 to-rose-600';
        badgeText = 'DECLARED';
    }
    if (type === 'admit') {
        accentColor = 'group-hover:text-blue-700';
        badgeColor = 'from-blue-500 to-blue-600';
        badgeText = 'RELEASED';
    }
    if (type === 'job') {
        accentColor = 'group-hover:text-emerald-700';
        badgeColor = 'from-emerald-500 to-emerald-600';
        badgeText = 'APPLY';
    }

    return (
        <Link 
            to={`/post/${post.id}`} 
            className="block px-5 py-3.5 hover:bg-slate-50 transition-colors border-b border-slate-100 group relative flex items-start gap-3 last:border-0"
        >
            <div className="mt-1.5 flex-shrink-0">
                 <ArrowRight size={14} className="text-slate-300 group-hover:text-slate-800 transition-colors" />
            </div>
            <div className="flex-1 min-w-0">
                <h3 className={`text-[15px] font-bold text-slate-700 ${accentColor} leading-snug transition-colors`}>
                    {post.title}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                    {isNew && (
                        <span className={`inline-block text-[9px] font-extrabold bg-gradient-to-r ${badgeColor} text-white px-1.5 py-0.5 rounded shadow-sm animate-pulse`}>
                            {badgeText}
                        </span>
                    )}
                    <span className="text-[10px] text-slate-400 font-medium">{post.updateDate}</span>
                </div>
            </div>
        </Link>
    );
};

const QuickLinkButton: React.FC<{ label: string; to: string; icon: React.ReactNode; color: string }> = ({ label, to, icon, color }) => (
    <Link 
        to={to} 
        className={`${color} text-white p-4 rounded-xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col items-center justify-center gap-2 text-center group relative overflow-hidden`}
    >
        <div className="absolute top-0 left-0 w-full h-1 bg-white/20"></div>
        <div className="bg-white/20 p-2 rounded-full group-hover:scale-110 transition-transform">
           {icon}
        </div>
        <span className="font-bold text-sm uppercase tracking-wide">{label}</span>
    </Link>
);

const JOB_SECTORS = [
    { title: 'Railway Jobs', icon: <Train size={18}/>, color: 'text-blue-700', bg: 'bg-blue-50' },
    { title: 'Police Jobs', icon: <Shield size={18}/>, color: 'text-rose-700', bg: 'bg-rose-50' },
    { title: 'Army Jobs', icon: <Target size={18}/>, color: 'text-emerald-700', bg: 'bg-emerald-50' },
    { title: 'Teacher Recruitment', icon: <BookOpen size={18}/>, color: 'text-amber-700', bg: 'bg-amber-50' },
    { title: 'SSC Recruitment', icon: <CheckSquare size={18}/>, color: 'text-indigo-700', bg: 'bg-indigo-50' },
    { title: 'GNM & ANM', icon: <Stethoscope size={18}/>, color: 'text-cyan-700', bg: 'bg-cyan-50' },
    { title: 'Bank Jobs', icon: <Landmark size={18}/>, color: 'text-purple-700', bg: 'bg-purple-50' },
    { title: 'State Govt Jobs', icon: <Building2 size={18}/>, color: 'text-orange-700', bg: 'bg-orange-50' },
    { title: 'Defense Forces', icon: <Target size={18}/>, color: 'text-teal-700', bg: 'bg-teal-50' },
    { title: 'Court Jobs', icon: <Gavel size={18}/>, color: 'text-slate-700', bg: 'bg-slate-100' },
    { title: 'Engineering Jobs', icon: <Cpu size={18}/>, color: 'text-sky-700', bg: 'bg-sky-50' },
    { title: 'Health Department', icon: <Stethoscope size={18}/>, color: 'text-red-700', bg: 'bg-red-50' },
    { title: 'Panchayat & ICDS', icon: <Users size={18}/>, color: 'text-lime-700', bg: 'bg-lime-50' },
    { title: 'Clerk / Office', icon: <FileText size={18}/>, color: 'text-gray-700', bg: 'bg-gray-100' },
    { title: '10th / 12th Jobs', icon: <GraduationCap size={18}/>, color: 'text-pink-700', bg: 'bg-pink-50' },
    { title: 'ITI / Diploma', icon: <Hammer size={18}/>, color: 'text-yellow-700', bg: 'bg-yellow-50' },
];

export const Home: React.FC = () => {
  const [results, setResults] = useState<JobPost[]>([]);
  const [admitCards, setAdmitCards] = useState<JobPost[]>([]);
  const [latestJobs, setLatestJobs] = useState<JobPost[]>([]);
  const [quickLinks, setQuickLinks] = useState<QuickLink[]>([]);
  
  useEffect(() => {
    setResults(getPostsByCategory(JobCategory.RESULT, 8)); // Fetch more results
    setAdmitCards(getPostsByCategory(JobCategory.ADMIT_CARD, 6));
    setLatestJobs(getPostsByCategory(JobCategory.LATEST_JOB, 6));
    setQuickLinks(getSiteSettings().quickLinks || []);
  }, []);

  return (
    <div className="animate-in fade-in duration-500 bg-slate-100 min-h-screen pb-12 font-sans">
      
      <LiveTicker />
      <HeroSection />
      
      {/* New: Quick Access Bar with iFrame Modal */}
      <QuickAccessSection links={quickLinks} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        
        {/* Quick Access Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            <QuickLinkButton label="All Results" to="/category/results" icon={<CheckCircle size={20}/>} color="bg-rose-600" />
            <QuickLinkButton label="Admit Card" to="/category/admit-card" icon={<Bell size={20}/>} color="bg-blue-600" />
            <QuickLinkButton label="Latest Jobs" to="/category/latest-jobs" icon={<Star size={20}/>} color="bg-emerald-600" />
            <QuickLinkButton label="Answer Key" to="/category/answer-key" icon={<Zap size={20}/>} color="bg-purple-600" />
            <QuickLinkButton label="Syllabus" to="/category/syllabus" icon={<Search size={20}/>} color="bg-amber-600" />
            <QuickLinkButton label="Admission" to="/category/admission" icon={<Flame size={20}/>} color="bg-cyan-600" />
        </div>

        <AdUnit format="responsive" className="mb-8 border border-slate-200 shadow-sm rounded-lg bg-white" />

        {/* Sanjay Online Center Promo Banner */}
        <div className="bg-gradient-to-r from-[#25D366] to-emerald-600 rounded-2xl shadow-lg p-6 mb-12 flex flex-col md:flex-row items-center justify-between gap-4 text-white relative overflow-hidden group border-2 border-white/20">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
            <div className="flex items-center gap-4 relative z-10">
                <div className="bg-white/20 p-3 rounded-full animate-bounce">
                    <CheckSquare size={32} />
                </div>
                <div>
                    <h3 className="font-extrabold text-xl">Sanjay Online Center Service</h3>
                    <p className="text-emerald-100 text-sm font-medium">Any Online Form Fill-up (WBSSC, SSC, Railway) from home @ ₹60 only.</p>
                </div>
            </div>
            <a 
                href="https://wa.me/917407319638?text=Hi%20Sanjay%20Online%20Center%2C%20I%20want%20to%20know%20about%20form%20filling." 
                target="_blank"
                rel="noreferrer"
                className="bg-white text-emerald-700 px-6 py-2.5 rounded-full font-bold shadow-md hover:scale-105 transition-transform flex items-center gap-2 whitespace-nowrap relative z-10"
            >
                <MessageCircle size={18} /> Chat on WhatsApp
            </a>
        </div>

        {/* 3 Main Columns with Lighting Effects */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          
          {/* Result Column (Highlighted) */}
          <div className="bg-white rounded-2xl shadow-xl border-2 border-rose-100 overflow-hidden lighting-card lighting-card-rose flex flex-col relative">
            {/* Blinking indicator for Result column */}
            <span className="absolute top-3 right-14 flex h-3 w-3 z-20">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
            <ColumnHeader 
                title="Result" 
                colorFrom="from-rose-600"
                colorTo="to-rose-700" 
                icon={<CheckCircle size={22} className="text-white"/>} 
                link="/category/results" 
                live={true}
            />
            <div className="divide-y divide-slate-100 bg-white flex-1">
              {results.map((post, idx) => (
                <HighImpactJobItem key={post.id} post={post} index={idx} type="result" />
              ))}
            </div>
            <Link to="/category/results" className="p-3 text-center text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 transition-colors uppercase tracking-widest border-t border-rose-100 flex items-center justify-center gap-2">
               View All Results <ArrowRight size={12}/>
            </Link>
          </div>

          {/* Admit Card Column */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden lighting-card lighting-card-blue flex flex-col">
            <ColumnHeader 
                title="Admit Card" 
                colorFrom="from-blue-600"
                colorTo="to-blue-700"
                icon={<Bell size={22} className="text-white"/>} 
                link="/category/admit-card" 
            />
            <div className="divide-y divide-slate-100 bg-white flex-1">
              {admitCards.map((post, idx) => (
                <HighImpactJobItem key={post.id} post={post} index={idx} type="admit" />
              ))}
            </div>
            <Link to="/category/admit-card" className="p-3 text-center text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors uppercase tracking-widest border-t border-blue-100">
               View More
            </Link>
          </div>

          {/* Jobs Column */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden lighting-card lighting-card-emerald flex flex-col">
            <ColumnHeader 
                title="Latest Jobs" 
                colorFrom="from-emerald-600"
                colorTo="to-emerald-700"
                icon={<Star size={22} className="text-white"/>} 
                link="/category/latest-jobs" 
            />
            <div className="divide-y divide-slate-100 bg-white flex-1">
              {latestJobs.map((post, idx) => (
                <HighImpactJobItem key={post.id} post={post} index={idx} type="job" />
              ))}
            </div>
            <Link to="/category/latest-jobs" className="p-3 text-center text-xs font-bold text-emerald-600 bg-emerald-50 hover:bg-emerald-100 transition-colors uppercase tracking-widest border-t border-emerald-100">
               View More
            </Link>
          </div>

        </div>

        {/* New: Browse by Sector Grid */}
        <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6 mb-12 lighting-card">
            <h2 className="text-xl font-extrabold text-slate-800 mb-6 flex items-center gap-2">
                <div className="bg-indigo-100 p-2 rounded-lg text-indigo-600"><Briefcase size={20} /></div>
                Browse by Sector
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {JOB_SECTORS.map((sector) => (
                    <Link 
                        key={sector.title}
                        to={`/category/${sector.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                        className={`flex items-center gap-3 p-3 rounded-lg border border-slate-100 hover:shadow-md transition-all group ${sector.bg}`}
                    >
                        <div className={`p-2 rounded-full bg-white shadow-sm ${sector.color} group-hover:scale-110 transition-transform`}>
                            {sector.icon}
                        </div>
                        <span className="text-sm font-bold text-slate-700 group-hover:text-indigo-800 line-clamp-1">{sector.title}</span>
                    </Link>
                ))}
            </div>
        </div>

        {/* Categories & States */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6 relative overflow-hidden group lighting-card">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-500"></div>
                 <h2 className="text-xl font-extrabold text-slate-800 mb-6 flex items-center gap-2 relative z-10">
                    <div className="bg-amber-100 p-2 rounded-lg text-amber-600"><Star size={20} /></div> Browse Categories
                 </h2>
                 <div className="flex flex-wrap gap-2 relative z-10">
                    {ALL_CATEGORIES_LIST.map((cat) => (
                        <Link 
                            key={cat.title}
                            to={`/category/${cat.title.toLowerCase().replace(' ', '-')}`}
                            className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all text-sm font-semibold text-slate-700 shadow-sm"
                        >
                            {cat.title}
                        </Link>
                    ))}
                 </div>
            </div>

             <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6 relative overflow-hidden group lighting-card">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-rose-400/10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-500"></div>
                 <h2 className="text-xl font-extrabold text-slate-800 mb-6 flex items-center gap-2 relative z-10">
                    <div className="bg-rose-100 p-2 rounded-lg text-rose-600"><MapPin size={20} /></div> Browse by State
                 </h2>
                 <div className="flex flex-wrap gap-2 relative z-10">
                    {ALL_STATES.slice(0, 15).map((state) => (
                        <Link 
                            key={state}
                            to={`/state/${state.toLowerCase().replace(' ', '-')}`}
                            className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg hover:bg-rose-600 hover:text-white hover:border-rose-600 transition-all text-sm font-semibold text-slate-700 shadow-sm"
                        >
                            {state}
                        </Link>
                    ))}
                    <Link to="/states" className="px-4 py-2 bg-slate-100 border border-slate-200 rounded-lg hover:bg-slate-200 text-sm font-bold text-slate-600">
                        View All...
                    </Link>
                 </div>
            </div>
        </div>

      </div>

      {/* Sticky Join Button */}
      <a href="#" className="fixed bottom-6 left-6 z-40 bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 group border-4 border-white/20 animate-bounce">
        <Send size={24} className="fill-current" />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 ease-in-out whitespace-nowrap font-bold">
          Join Telegram
        </span>
      </a>

    </div>
  );
};