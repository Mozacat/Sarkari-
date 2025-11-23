
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { JobPost, SiteSettings } from '../types';
import { getAllPosts, deletePost, getSiteSettings, saveSiteSettings, generateSitemapXML } from '../services/mockData';
import { 
    LayoutDashboard, FileText, Settings, Users, Plus, Search, 
    Edit, Trash2, Zap, CheckCircle, LogOut, Cpu, FileInput, Globe, ShieldCheck,
    Smartphone, Share2, Anchor, Database, DollarSign, Bot, Tablet, FileJson, BarChart, RefreshCw, Link2, ExternalLink
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState<'overview' | 'posts' | 'settings'>('overview');
  const [activeSettingSection, setActiveSettingSection] = useState('mobileHome');
  const [posts, setPosts] = useState<JobPost[]>([]);
  const [filter, setFilter] = useState('');
  
  // Settings State
  const [settings, setSettings] = useState<SiteSettings>(getSiteSettings());

  useEffect(() => {
    loadData();
    setSettings(getSiteSettings());
  }, []);

  const loadData = () => {
    setPosts(getAllPosts());
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      deletePost(id);
      loadData();
    }
  };

  const handleSaveSettings = (e: React.FormEvent) => {
      e.preventDefault();
      saveSiteSettings(settings);
      alert('✅ All Settings & SEO Configuration Saved Successfully!');
  };

  const handleGenerateRobots = () => {
      setSettings({
          ...settings,
          robots: {
              ...settings.robots,
              content: `User-agent: *\nDisallow: /admin\nDisallow: /private\nAllow: /\n\nSitemap: ${settings.sitemap.sitemapUrl}`
          }
      });
  };

  const downloadRobotsTxt = () => {
    const blob = new Blob([settings.robots.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'robots.txt';
    a.click();
  };

  const downloadSitemap = () => {
    const xml = generateSitemapXML();
    const blob = new Blob([xml], { type: 'text/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sitemap.xml';
    a.click();
  };

  const SettingSectionBtn = ({ id, label, icon: Icon }: any) => (
      <button 
        type="button"
        onClick={() => setActiveSettingSection(id)}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors text-left ${
            activeSettingSection === id 
            ? 'bg-indigo-600 text-white shadow-md' 
            : 'text-slate-600 hover:bg-slate-100'
        }`}
      >
          <Icon size={18} /> {label}
      </button>
  );

  // --- Statistics ---
  const totalViews = posts.reduce((acc, curr) => acc + (curr.views || 0), 0);
  const totalPosts = posts.length;
  const publishedPosts = posts.filter(p => p.status === 'Published').length;

  return (
    <div className="min-h-screen bg-slate-100 flex font-sans">
      
      {/* 1. Main Admin Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex-shrink-0 hidden md:flex flex-col h-screen sticky top-0 border-r border-slate-800">
         <div className="p-6 border-b border-slate-800">
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
               <Zap className="text-indigo-500 fill-current" /> AdminPanel
            </h1>
            <p className="text-xs text-slate-500 mt-1">SarkariAI Command Center</p>
         </div>

         <nav className="flex-1 p-4 space-y-1">
            <button 
                onClick={() => setActiveView('overview')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeView === 'overview' ? 'bg-indigo-600 text-white shadow-lg' : 'hover:bg-slate-800 text-slate-400 hover:text-white'}`}
            >
                <LayoutDashboard size={20} /> <span className="font-medium">Overview</span>
            </button>
            <button 
                onClick={() => setActiveView('posts')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeView === 'posts' ? 'bg-indigo-600 text-white shadow-lg' : 'hover:bg-slate-800 text-slate-400 hover:text-white'}`}
            >
                <FileText size={20} /> <span className="font-medium">All Posts</span>
            </button>
            <button 
                onClick={() => setActiveView('settings')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeView === 'settings' ? 'bg-indigo-600 text-white shadow-lg' : 'hover:bg-slate-800 text-slate-400 hover:text-white'}`}
            >
                <Settings size={20} /> <span className="font-medium">Settings & SEO</span>
            </button>
         </nav>

         <div className="p-4 border-t border-slate-800">
            <button onClick={() => navigate('/')} className="w-full flex items-center gap-2 text-slate-400 hover:text-white text-sm px-2">
               <LogOut size={16} /> Exit to Website
            </button>
         </div>
      </aside>

      {/* 2. Main Content Area */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
               <h2 className="text-2xl font-bold text-slate-800">
                  {activeView === 'overview' && 'Dashboard Overview'}
                  {activeView === 'posts' && 'Post Management'}
                  {activeView === 'settings' && 'Settings & SEO Tools'}
               </h2>
               <p className="text-slate-500 text-sm">Welcome back, Admin</p>
            </div>
            {activeView === 'posts' || activeView === 'overview' ? (
                <Link to="/admin/new" className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-full font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2">
                    <Plus size={18} /> Create New Post
                </Link>
            ) : null}
        </header>

        {activeView === 'overview' && (
           <div className="space-y-8 animate-in fade-in">
              {/* AI Command Center */}
              <div className="bg-gradient-to-r from-indigo-900 to-purple-900 rounded-2xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
                 <div className="relative z-10">
                    <h3 className="text-2xl font-bold mb-2 flex items-center gap-2">
                       <Zap className="text-yellow-400 fill-current"/> AI Command Center
                    </h3>
                    <p className="text-indigo-200 mb-6 max-w-xl">
                       The "One AI" engine is ready. Paste any government notification text below to instantly generate a fully SEO-optimized blog post.
                    </p>
                    <div className="flex flex-wrap gap-4">
                        <button 
                            onClick={() => navigate('/admin/new')}
                            className="bg-white text-indigo-900 px-6 py-3 rounded-xl font-bold hover:bg-indigo-50 transition-colors flex items-center gap-2 shadow-lg"
                        >
                            <FileInput size={20} /> Paste Notification & Create
                        </button>
                    </div>
                 </div>
              </div>

              {/* SEO Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col">
                      <div className="flex items-center gap-2 mb-4 text-indigo-700 font-bold">
                          <Anchor size={20} /> Sitemap Generator
                      </div>
                      <p className="text-sm text-slate-500 mb-4">
                          Update your XML sitemap instantly to help Google crawl new posts.
                      </p>
                      <button onClick={downloadSitemap} className="mt-auto w-full py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-lg font-bold text-sm flex items-center justify-center gap-2">
                          <RefreshCw size={14} /> Regenerate & Download
                      </button>
                  </div>

                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col">
                      <div className="flex items-center gap-2 mb-4 text-emerald-700 font-bold">
                          <ShieldCheck size={20} /> Site Status
                      </div>
                      <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                              <span className="text-slate-500">Google Verification:</span>
                              <span className={settings.google.searchConsoleCode ? "text-green-600 font-bold" : "text-red-500 font-bold"}>
                                  {settings.google.searchConsoleCode ? 'Active' : 'Missing'}
                              </span>
                          </div>
                          <div className="flex justify-between">
                              <span className="text-slate-500">Analytics:</span>
                              <span className={settings.google.analyticsId ? "text-green-600 font-bold" : "text-red-500 font-bold"}>
                                  {settings.google.analyticsId ? 'Active' : 'Missing'}
                              </span>
                          </div>
                      </div>
                      <button onClick={() => { setActiveView('settings'); setActiveSettingSection('google'); }} className="mt-4 w-full py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-lg font-bold text-sm">
                          Configure Keys
                      </button>
                  </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <div className="flex items-center justify-between mb-4">
                       <div className="bg-blue-50 p-3 rounded-xl text-blue-600"><FileText size={24}/></div>
                    </div>
                    <div className="text-3xl font-bold text-slate-800">{totalPosts}</div>
                    <div className="text-sm text-slate-500">Total Posts</div>
                 </div>
                 
                 <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <div className="flex items-center justify-between mb-4">
                       <div className="bg-purple-50 p-3 rounded-xl text-purple-600"><Users size={24}/></div>
                    </div>
                    <div className="text-3xl font-bold text-slate-800">{new Intl.NumberFormat('en-IN').format(totalViews)}</div>
                    <div className="text-sm text-slate-500">Total Views</div>
                 </div>

                 <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <div className="flex items-center justify-between mb-4">
                       <div className="bg-emerald-50 p-3 rounded-xl text-emerald-600"><CheckCircle size={24}/></div>
                    </div>
                    <div className="text-3xl font-bold text-slate-800">{publishedPosts}</div>
                    <div className="text-sm text-slate-500">Published Active Posts</div>
                 </div>
              </div>
           </div>
        )}

        {activeView === 'posts' && (
            <div className="space-y-6 animate-in fade-in">
                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search posts..." 
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-slate-50 border-0 rounded-lg focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4">Title</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Stats</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {posts.filter(p => p.title.toLowerCase().includes(filter.toLowerCase())).map((post) => (
                                <tr key={post.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-slate-800">{post.title}</div>
                                        <div className="text-xs text-slate-500">{post.category} • {post.updateDate}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                                            post.status === 'Published' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'
                                        }`}>
                                            {post.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-slate-500 font-medium">
                                        {new Intl.NumberFormat('en-IN').format(post.views || 0)} Views
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <Link to={`/admin/edit/${post.id}`} className="p-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100">
                                                <Edit size={16} />
                                            </Link>
                                            <button onClick={() => handleDelete(post.id)} className="p-2 bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-100">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        )}

        {/* ---------------- SETTINGS VIEW (9 SECTIONS) ---------------- */}
        {activeView === 'settings' && (
            <div className="flex flex-col lg:flex-row gap-6 animate-in fade-in h-full">
                
                {/* 1. Settings Menu (Left Sidebar) */}
                <div className="w-full lg:w-72 flex-shrink-0 bg-white rounded-2xl border border-slate-200 p-4 h-fit sticky top-4 shadow-sm">
                    <h3 className="font-bold text-slate-400 text-xs uppercase tracking-wider mb-4 px-2">Configuration Menu</h3>
                    <div className="space-y-1">
                        <SettingSectionBtn id="mobileHome" label="1. Mobile Home Page" icon={Smartphone} />
                        <SettingSectionBtn id="sitemap" label="2. Sitemap Settings" icon={Anchor} />
                        <SettingSectionBtn id="google" label="3. Google Verification" icon={ShieldCheck} />
                        <SettingSectionBtn id="ads" label="4. Ad Code Manager" icon={DollarSign} />
                        <SettingSectionBtn id="mobileSeo" label="5. Mobile SEO Control" icon={Tablet} />
                        <SettingSectionBtn id="robots" label="6. Robots.txt Manager" icon={Bot} />
                        <SettingSectionBtn id="indexing" label="7. Indexing Control" icon={Database} />
                        <SettingSectionBtn id="schema" label="8. Schema & Structured" icon={FileJson} />
                        <SettingSectionBtn id="social" label="9. Social & Open Graph" icon={Share2} />
                        <SettingSectionBtn id="quickLinks" label="10. Quick Access Links" icon={Link2} />
                        <SettingSectionBtn id="general" label="General Settings" icon={Globe} />
                    </div>
                </div>

                {/* 2. Settings Form Area (Right Content) */}
                <div className="flex-1 bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
                    <form onSubmit={handleSaveSettings} className="max-w-4xl mx-auto">
                        
                        {/* SECTION 1: MOBILE HOME PAGE */}
                        {activeSettingSection === 'mobileHome' && (
                            <div className="space-y-6 animate-in fade-in">
                                <h3 className="text-xl font-bold text-slate-800 border-b pb-4 flex items-center gap-2">
                                    <Smartphone className="text-indigo-600"/> Mobile Home Page Settings
                                </h3>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-slate-50 p-4 rounded-lg flex items-center justify-between">
                                        <label className="font-bold text-slate-700">Enable Mobile Specific Layout</label>
                                        <input type="checkbox" checked={settings.mobileHome.enabled} onChange={e => setSettings({...settings, mobileHome: {...settings.mobileHome, enabled: e.target.checked}})} className="w-5 h-5"/>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Mobile Page Title</label>
                                        <input type="text" value={settings.mobileHome.mobileTitle} onChange={e => setSettings({...settings, mobileHome: {...settings.mobileHome, mobileTitle: e.target.value}})} className="w-full px-4 py-2 border border-slate-300 rounded-lg"/>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Mobile Banner URL</label>
                                        <input type="text" value={settings.mobileHome.bannerUrl} onChange={e => setSettings({...settings, mobileHome: {...settings.mobileHome, bannerUrl: e.target.value}})} className="w-full px-4 py-2 border border-slate-300 rounded-lg" placeholder="https://..."/>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Post Limit (Mobile)</label>
                                        <input type="number" value={settings.mobileHome.postLimit} onChange={e => setSettings({...settings, mobileHome: {...settings.mobileHome, postLimit: parseInt(e.target.value)}})} className="w-full px-4 py-2 border border-slate-300 rounded-lg"/>
                                    </div>
                                </div>

                                <div className="border rounded-xl p-4">
                                    <h4 className="font-bold text-sm text-slate-600 mb-3">Visible Sections on Mobile</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <label className="flex items-center gap-2"><input type="checkbox" checked={settings.mobileHome.visibleSections.latestJobs} onChange={e => setSettings({...settings, mobileHome: {...settings.mobileHome, visibleSections: {...settings.mobileHome.visibleSections, latestJobs: e.target.checked}}})} /> Latest Jobs</label>
                                        <label className="flex items-center gap-2"><input type="checkbox" checked={settings.mobileHome.visibleSections.results} onChange={e => setSettings({...settings, mobileHome: {...settings.mobileHome, visibleSections: {...settings.mobileHome.visibleSections, results: e.target.checked}}})} /> Results</label>
                                        <label className="flex items-center gap-2"><input type="checkbox" checked={settings.mobileHome.visibleSections.admitCards} onChange={e => setSettings({...settings, mobileHome: {...settings.mobileHome, visibleSections: {...settings.mobileHome.visibleSections, admitCards: e.target.checked}}})} /> Admit Cards</label>
                                        <label className="flex items-center gap-2"><input type="checkbox" checked={settings.mobileHome.visibleSections.trending} onChange={e => setSettings({...settings, mobileHome: {...settings.mobileHome, visibleSections: {...settings.mobileHome.visibleSections, trending: e.target.checked}}})} /> Trending Ticker</label>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* SECTION 2: SITEMAP */}
                        {activeSettingSection === 'sitemap' && (
                            <div className="space-y-6 animate-in fade-in">
                                <h3 className="text-xl font-bold text-slate-800 border-b pb-4 flex items-center gap-2">
                                    <Anchor className="text-indigo-600"/> Sitemap Settings
                                </h3>
                                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                                    <div>
                                        <label className="font-bold text-slate-700 block">Auto XML Sitemap Generator</label>
                                        <span className="text-xs text-slate-500">Automatically updates sitemap.xml on new post</span>
                                    </div>
                                    <input type="checkbox" checked={settings.sitemap.autoGenerate} onChange={e => setSettings({...settings, sitemap: {...settings.sitemap, autoGenerate: e.target.checked}})} className="w-5 h-5"/>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Sitemap URL</label>
                                    <input type="text" value={settings.sitemap.sitemapUrl} readOnly className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-slate-100 text-slate-500 cursor-not-allowed"/>
                                </div>
                                <div className="flex gap-4">
                                    <label className="flex items-center gap-2"><input type="checkbox" checked={settings.sitemap.includeCategories} onChange={e => setSettings({...settings, sitemap: {...settings.sitemap, includeCategories: e.target.checked}})} /> Include Categories</label>
                                    <label className="flex items-center gap-2"><input type="checkbox" checked={settings.sitemap.includePages} onChange={e => setSettings({...settings, sitemap: {...settings.sitemap, includePages: e.target.checked}})} /> Include Pages</label>
                                </div>
                                <div className="pt-4">
                                    <button type="button" onClick={downloadSitemap} className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-emerald-700">
                                        <Zap size={16}/> Manual Regenerate & Download
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* SECTION 3: GOOGLE TOOLS */}
                        {activeSettingSection === 'google' && (
                            <div className="space-y-6 animate-in fade-in">
                                <h3 className="text-xl font-bold text-slate-800 border-b pb-4 flex items-center gap-2">
                                    <ShieldCheck className="text-indigo-600"/> Google Verification & Tools
                                </h3>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Google Search Console (HTML Tag Content)</label>
                                    <div className="relative">
                                        <input type="text" value={settings.google.searchConsoleCode} onChange={e => setSettings({...settings, google: {...settings.google, searchConsoleCode: e.target.value}})} className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg" placeholder="e.g. v-E2f3... (Do not paste full tag)"/>
                                        <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                    </div>
                                    <p className="text-xs text-slate-400 mt-1">Paste only the content code, NOT the full &lt;meta&gt; tag.</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Google Analytics 4 ID</label>
                                    <div className="relative">
                                        <input type="text" value={settings.google.analyticsId} onChange={e => setSettings({...settings, google: {...settings.google, analyticsId: e.target.value}})} className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg" placeholder="G-XXXXXXXXXX"/>
                                        <BarChart className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Google Tag Manager ID</label>
                                    <input type="text" value={settings.google.tagManagerId} onChange={e => setSettings({...settings, google: {...settings.google, tagManagerId: e.target.value}})} className="w-full px-4 py-2 border border-slate-300 rounded-lg" placeholder="GTM-XXXXXX"/>
                                </div>
                            </div>
                        )}

                        {/* SECTION 4: ADS MANAGER */}
                        {activeSettingSection === 'ads' && (
                            <div className="space-y-6 animate-in fade-in">
                                <h3 className="text-xl font-bold text-slate-800 border-b pb-4 flex items-center gap-2">
                                    <DollarSign className="text-indigo-600"/> Ad Code Manager
                                </h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Global Head Ad Code</label>
                                        <textarea value={settings.ads.globalHeadCode} onChange={e => setSettings({...settings, ads: {...settings.ads, globalHeadCode: e.target.value}})} className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono text-xs h-24" placeholder="<script>...</script>"/>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Global Body Ad Code</label>
                                        <textarea value={settings.ads.globalBodyCode} onChange={e => setSettings({...settings, ads: {...settings.ads, globalBodyCode: e.target.value}})} className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono text-xs h-24"/>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="col-span-2">
                                        <h4 className="font-bold text-sm text-slate-600 mb-2">Ad Slots</h4>
                                    </div>
                                    <div><label className="text-xs font-bold">Header Slot</label><textarea value={settings.ads.headerSlot} onChange={e => setSettings({...settings, ads: {...settings.ads, headerSlot: e.target.value}})} className="w-full border p-2 h-20 rounded font-mono text-xs"/></div>
                                    <div><label className="text-xs font-bold">Footer Slot</label><textarea value={settings.ads.footerSlot} onChange={e => setSettings({...settings, ads: {...settings.ads, footerSlot: e.target.value}})} className="w-full border p-2 h-20 rounded font-mono text-xs"/></div>
                                    <div><label className="text-xs font-bold">Sidebar Slot</label><textarea value={settings.ads.sidebarSlot} onChange={e => setSettings({...settings, ads: {...settings.ads, sidebarSlot: e.target.value}})} className="w-full border p-2 h-20 rounded font-mono text-xs"/></div>
                                    <div><label className="text-xs font-bold">In-Post Slot</label><textarea value={settings.ads.inPostSlot} onChange={e => setSettings({...settings, ads: {...settings.ads, inPostSlot: e.target.value}})} className="w-full border p-2 h-20 rounded font-mono text-xs"/></div>
                                </div>
                                <div className="flex gap-6">
                                    <label className="flex items-center gap-2 font-bold text-sm"><input type="checkbox" checked={settings.ads.showOnMobile} onChange={e => setSettings({...settings, ads: {...settings.ads, showOnMobile: e.target.checked}})} /> Show on Mobile</label>
                                    <label className="flex items-center gap-2 font-bold text-sm"><input type="checkbox" checked={settings.ads.showOnDesktop} onChange={e => setSettings({...settings, ads: {...settings.ads, showOnDesktop: e.target.checked}})} /> Show on Desktop</label>
                                </div>
                            </div>
                        )}

                        {/* SECTION 5: MOBILE SEO */}
                        {activeSettingSection === 'mobileSeo' && (
                            <div className="space-y-6 animate-in fade-in">
                                <h3 className="text-xl font-bold text-slate-800 border-b pb-4 flex items-center gap-2">
                                    <Tablet className="text-indigo-600"/> Mobile SEO Control
                                </h3>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Mobile Meta Title</label>
                                    <input type="text" value={settings.mobileSeo.mobileMetaTitle} onChange={e => setSettings({...settings, mobileSeo: {...settings.mobileSeo, mobileMetaTitle: e.target.value}})} className="w-full px-4 py-2 border border-slate-300 rounded-lg"/>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Mobile Meta Description</label>
                                    <textarea value={settings.mobileSeo.mobileMetaDesc} onChange={e => setSettings({...settings, mobileSeo: {...settings.mobileSeo, mobileMetaDesc: e.target.value}})} className="w-full px-4 py-2 border border-slate-300 rounded-lg h-20"/>
                                </div>
                                <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-lg">
                                    <label className="flex items-center justify-between font-bold text-sm text-slate-700">Enable AMP <input type="checkbox" checked={settings.mobileSeo.enableAmp} onChange={e => setSettings({...settings, mobileSeo: {...settings.mobileSeo, enableAmp: e.target.checked}})} /></label>
                                    <label className="flex items-center justify-between font-bold text-sm text-slate-700">Enable Lazy Load <input type="checkbox" checked={settings.mobileSeo.enableLazyLoad} onChange={e => setSettings({...settings, mobileSeo: {...settings.mobileSeo, enableLazyLoad: e.target.checked}})} /></label>
                                    <label className="flex items-center justify-between font-bold text-sm text-slate-700">Minify CSS/JS <input type="checkbox" checked={settings.mobileSeo.minifyCssJs} onChange={e => setSettings({...settings, mobileSeo: {...settings.mobileSeo, minifyCssJs: e.target.checked}})} /></label>
                                </div>
                            </div>
                        )}

                        {/* SECTION 6: ROBOTS.TXT */}
                        {activeSettingSection === 'robots' && (
                            <div className="space-y-6 animate-in fade-in">
                                <h3 className="text-xl font-bold text-slate-800 border-b pb-4 flex items-center gap-2">
                                    <Bot className="text-indigo-600"/> Robots.txt Manager
                                </h3>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Robots.txt Content</label>
                                    <textarea value={settings.robots.content} onChange={e => setSettings({...settings, robots: {...settings.robots, content: e.target.value}})} className="w-full px-4 py-2 border border-slate-300 rounded-lg font-mono text-sm h-48"/>
                                </div>
                                <div className="flex gap-3">
                                    <button type="button" onClick={handleGenerateRobots} className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-indigo-700">Generate Default Robots.txt</button>
                                    <button type="button" onClick={downloadRobotsTxt} className="bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-lg font-bold text-sm hover:bg-slate-50 flex items-center gap-2"><Zap size={14}/> Download robots.txt</button>
                                </div>
                            </div>
                        )}

                        {/* SECTION 7: INDEXING */}
                        {activeSettingSection === 'indexing' && (
                            <div className="space-y-6 animate-in fade-in">
                                <h3 className="text-xl font-bold text-slate-800 border-b pb-4 flex items-center gap-2">
                                    <Database className="text-indigo-600"/> Indexing & Crawl Control
                                </h3>
                                <div className="bg-amber-50 p-4 rounded-lg border border-amber-200 mb-4">
                                    <p className="text-xs text-amber-800"><strong>Note:</strong> Checking these boxes adds <code>noindex</code> tag to pages. Use carefully.</p>
                                </div>
                                <div className="space-y-3">
                                    <label className="flex items-center gap-3 font-medium text-slate-700"><input type="checkbox" checked={settings.indexing.noindexCategories} onChange={e => setSettings({...settings, indexing: {...settings.indexing, noindexCategories: e.target.checked}})} /> Noindex Category Pages</label>
                                    <label className="flex items-center gap-3 font-medium text-slate-700"><input type="checkbox" checked={settings.indexing.noindexTags} onChange={e => setSettings({...settings, indexing: {...settings.indexing, noindexTags: e.target.checked}})} /> Noindex Tag Pages</label>
                                    <label className="flex items-center gap-3 font-medium text-slate-700"><input type="checkbox" checked={settings.indexing.noindexSearch} onChange={e => setSettings({...settings, indexing: {...settings.indexing, noindexSearch: e.target.checked}})} /> Noindex Search Results</label>
                                    <label className="flex items-center gap-3 font-medium text-slate-700"><input type="checkbox" checked={settings.indexing.noindexPagination} onChange={e => setSettings({...settings, indexing: {...settings.indexing, noindexPagination: e.target.checked}})} /> Noindex Pagination Pages</label>
                                    <hr className="my-2"/>
                                    <label className="flex items-center gap-3 font-bold text-indigo-700"><input type="checkbox" checked={settings.indexing.externalLinksNofollow} onChange={e => setSettings({...settings, indexing: {...settings.indexing, externalLinksNofollow: e.target.checked}})} /> Add rel="nofollow" to External Links</label>
                                </div>
                            </div>
                        )}

                        {/* SECTION 8: SCHEMA */}
                        {activeSettingSection === 'schema' && (
                            <div className="space-y-6 animate-in fade-in">
                                <h3 className="text-xl font-bold text-slate-800 border-b pb-4 flex items-center gap-2">
                                    <FileJson className="text-indigo-600"/> Schema & Structured Data
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="p-4 border rounded-lg bg-slate-50 flex items-center justify-between">
                                        <label className="font-bold text-sm">Organization Schema</label>
                                        <input type="checkbox" checked={settings.schema.enableOrganization} onChange={e => setSettings({...settings, schema: {...settings.schema, enableOrganization: e.target.checked}})} className="w-5 h-5"/>
                                    </div>
                                    <div className="p-4 border rounded-lg bg-slate-50 flex items-center justify-between">
                                        <label className="font-bold text-sm">JobPosting Schema</label>
                                        <input type="checkbox" checked={settings.schema.enableJobPosting} onChange={e => setSettings({...settings, schema: {...settings.schema, enableJobPosting: e.target.checked}})} className="w-5 h-5"/>
                                    </div>
                                    <div className="p-4 border rounded-lg bg-slate-50 flex items-center justify-between">
                                        <label className="font-bold text-sm">Breadcrumbs Schema</label>
                                        <input type="checkbox" checked={settings.schema.enableBreadcrumbs} onChange={e => setSettings({...settings, schema: {...settings.schema, enableBreadcrumbs: e.target.checked}})} className="w-5 h-5"/>
                                    </div>
                                    <div className="p-4 border rounded-lg bg-slate-50 flex items-center justify-between">
                                        <label className="font-bold text-sm">Auto Generate FAQ Schema</label>
                                        <input type="checkbox" checked={settings.schema.enableAutoFaq} onChange={e => setSettings({...settings, schema: {...settings.schema, enableAutoFaq: e.target.checked}})} className="w-5 h-5"/>
                                    </div>
                                </div>
                            </div>
                        )}

                         {/* SECTION 9: SOCIAL */}
                         {activeSettingSection === 'social' && (
                            <div className="space-y-6 animate-in fade-in">
                                <h3 className="text-xl font-bold text-slate-800 border-b pb-4 flex items-center gap-2">
                                    <Share2 className="text-indigo-600"/> Social & Open Graph
                                </h3>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Default OG Image URL</label>
                                    <input type="text" value={settings.social.defaultOgImage} onChange={e => setSettings({...settings, social: {...settings.social, defaultOgImage: e.target.value}})} className="w-full px-4 py-2 border border-slate-300 rounded-lg"/>
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">WhatsApp Group Link (Popup)</label>
                                        <input type="text" value={settings.social.whatsappGroup || ''} onChange={e => setSettings({...settings, social: {...settings.social, whatsappGroup: e.target.value}})} className="w-full px-4 py-2 border border-slate-300 rounded-lg" placeholder="https://chat.whatsapp.com/..."/>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Telegram Channel</label>
                                        <input type="text" value={settings.social.telegramChannel} onChange={e => setSettings({...settings, social: {...settings.social, telegramChannel: e.target.value}})} className="w-full px-4 py-2 border border-slate-300 rounded-lg"/>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Facebook Page URL</label>
                                        <input type="text" value={settings.social.facebookPage} onChange={e => setSettings({...settings, social: {...settings.social, facebookPage: e.target.value}})} className="w-full px-4 py-2 border border-slate-300 rounded-lg"/>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Twitter Handle (@user)</label>
                                        <input type="text" value={settings.social.twitterHandle} onChange={e => setSettings({...settings, social: {...settings.social, twitterHandle: e.target.value}})} className="w-full px-4 py-2 border border-slate-300 rounded-lg"/>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">YouTube Channel</label>
                                        <input type="text" value={settings.social.youtubeChannel} onChange={e => setSettings({...settings, social: {...settings.social, youtubeChannel: e.target.value}})} className="w-full px-4 py-2 border border-slate-300 rounded-lg"/>
                                    </div>
                                </div>
                            </div>
                        )}

                         {/* SECTION 10: QUICK LINKS */}
                         {activeSettingSection === 'quickLinks' && (
                            <div className="space-y-6 animate-in fade-in">
                                <h3 className="text-xl font-bold text-slate-800 border-b pb-4 flex items-center gap-2">
                                    <Link2 className="text-indigo-600"/> Quick Access Links
                                </h3>
                                <p className="text-sm text-slate-500 mb-4">Manage the "Live Check" links that appear at the top of the homepage.</p>
                                
                                <div className="space-y-4">
                                    {(settings.quickLinks || []).map((link, idx) => (
                                        <div key={idx} className="bg-slate-50 p-4 rounded-lg border border-slate-200 flex flex-col md:flex-row gap-4 items-start md:items-center">
                                            <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-2 w-full">
                                                <input 
                                                    type="text" 
                                                    value={link.title}
                                                    placeholder="Link Title (e.g. SSC Result)"
                                                    onChange={(e) => {
                                                        const updated = [...(settings.quickLinks || [])];
                                                        updated[idx].title = e.target.value;
                                                        setSettings({...settings, quickLinks: updated});
                                                    }}
                                                    className="border rounded px-2 py-1 text-sm"
                                                />
                                                <input 
                                                    type="text" 
                                                    value={link.url}
                                                    placeholder="https://..."
                                                    onChange={(e) => {
                                                        const updated = [...(settings.quickLinks || [])];
                                                        updated[idx].url = e.target.value;
                                                        setSettings({...settings, quickLinks: updated});
                                                    }}
                                                    className="border rounded px-2 py-1 text-sm md:col-span-2"
                                                />
                                                <div className="flex gap-2">
                                                    <select 
                                                        value={link.category}
                                                        onChange={(e) => {
                                                            const updated = [...(settings.quickLinks || [])];
                                                            updated[idx].category = e.target.value as any;
                                                            setSettings({...settings, quickLinks: updated});
                                                        }}
                                                        className="border rounded px-2 py-1 text-sm flex-1"
                                                    >
                                                        <option value="Result">Result</option>
                                                        <option value="Admit Card">Admit</option>
                                                        <option value="Official Site">Site</option>
                                                    </select>
                                                    <select 
                                                        value={link.type}
                                                        onChange={(e) => {
                                                            const updated = [...(settings.quickLinks || [])];
                                                            updated[idx].type = e.target.value as any;
                                                            setSettings({...settings, quickLinks: updated});
                                                        }}
                                                        className="border rounded px-2 py-1 text-sm w-20"
                                                    >
                                                        <option value="redirect">Tab</option>
                                                        <option value="iframe">Modal</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                 <label className="flex items-center gap-1 text-xs font-bold text-slate-600">
                                                     <input 
                                                        type="checkbox" 
                                                        checked={link.isActive} 
                                                        onChange={(e) => {
                                                            const updated = [...(settings.quickLinks || [])];
                                                            updated[idx].isActive = e.target.checked;
                                                            setSettings({...settings, quickLinks: updated});
                                                        }}
                                                     /> Active
                                                 </label>
                                                 <button 
                                                    type="button"
                                                    onClick={() => {
                                                        const updated = [...(settings.quickLinks || [])];
                                                        updated.splice(idx, 1);
                                                        setSettings({...settings, quickLinks: updated});
                                                    }}
                                                    className="text-red-500 p-2 hover:bg-red-50 rounded"
                                                 >
                                                     <Trash2 size={16} />
                                                 </button>
                                            </div>
                                        </div>
                                    ))}
                                    <button 
                                        type="button" 
                                        onClick={() => setSettings({
                                            ...settings, 
                                            quickLinks: [...(settings.quickLinks || []), { id: Date.now().toString(), title: '', url: '', type: 'redirect', category: 'Result', isActive: true }]
                                        })}
                                        className="text-sm font-bold text-indigo-600 flex items-center gap-2 hover:underline"
                                    >
                                        <Plus size={16} /> Add New Link
                                    </button>
                                </div>
                            </div>
                        )}

                         {/* SECTION 0: GENERAL */}
                         {activeSettingSection === 'general' && (
                            <div className="space-y-6 animate-in fade-in">
                                <h3 className="text-xl font-bold text-slate-800 border-b pb-4 flex items-center gap-2">
                                    <Globe className="text-indigo-600"/> General Settings
                                </h3>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Website Name</label>
                                    <input type="text" value={settings.general.siteName} onChange={e => setSettings({...settings, general: {...settings.general, siteName: e.target.value}})} className="w-full px-4 py-2 border border-slate-300 rounded-lg"/>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Tagline</label>
                                    <input type="text" value={settings.general.tagline} onChange={e => setSettings({...settings, general: {...settings.general, tagline: e.target.value}})} className="w-full px-4 py-2 border border-slate-300 rounded-lg"/>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Footer Text</label>
                                    <input type="text" value={settings.general.footerText} onChange={e => setSettings({...settings, general: {...settings.general, footerText: e.target.value}})} className="w-full px-4 py-2 border border-slate-300 rounded-lg"/>
                                </div>
                            </div>
                        )}

                        <div className="pt-8 mt-4 border-t border-slate-100 sticky bottom-0 bg-white pb-4 z-10">
                            <button type="submit" className="w-full bg-slate-900 text-white px-6 py-4 rounded-xl font-bold hover:bg-slate-800 transition-colors shadow-lg flex items-center justify-center gap-2">
                                <CheckCircle size={20} /> Save All Configuration
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        )}

      </main>
    </div>
  );
};
