import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { JobPost } from '../types';
import { getPostById, getPostsByCategory } from '../services/mockData';
import { AdUnit } from '../components/AdUnit';
import { Calendar, Download, MapPin, Share2, Printer, Eye, Sparkles, ExternalLink, CheckCircle, AlertTriangle, Bell, Star, ArrowRight, Zap, MessageCircle, Users, BookOpen, FileText, Database, Phone, CheckSquare, PenTool, ClipboardList } from 'lucide-react';
import { sendMessageToGemini } from '../services/geminiService';
import { SEOHead } from '../components/SEOHead';

export const PostDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<JobPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);
  const [relatedPosts, setRelatedPosts] = useState<JobPost[]>([]);
  
  // Live Views State
  const [liveViews, setLiveViews] = useState(0);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      if (id) {
        const data = getPostById(id);
        setPost(data);
        if (data) {
          // Ensure views start from at least 25,000 if the data has less
          const baseViews = (data.views && data.views > 25000) ? data.views : 25421;
          setLiveViews(baseViews);
          setRelatedPosts(getPostsByCategory(data.category, 5).filter(p => p.id !== data.id));
        }
      }
      setLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [id]);

  // Live View Counter Effect
  useEffect(() => {
    if (!post) return;

    // Simulate increasing views to show "Live" traffic
    // Updates every 2 seconds to be clearly visible to the user
    const interval = setInterval(() => {
        setLiveViews(prev => {
            const increment = Math.floor(Math.random() * 4) + 2; // Always add 2-5 views
            return prev + increment;
        });
    }, 2000); 

    return () => clearInterval(interval);
  }, [post]);

  const handleGenerateSummary = async () => {
    if (!post) return;
    setLoadingAi(true);
    const prompt = `Provide a very short, 3-bullet point summary for this government job post: ${post.title}. Vacancies: ${post.totalVacancy}, Last Date: ${post.lastDate}, Qualification: ${post.details?.qualification?.join(', ')}`;
    const response = await sendMessageToGemini(prompt);
    setAiSummary(response);
    setLoadingAi(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!post) {
    return <div className="text-center py-20 text-slate-500">Post not found.</div>;
  }

  const formattedViews = new Intl.NumberFormat('en-IN').format(liveViews);
  
  // Sanjay Online Center WhatsApp Link Logic
  const serviceNumber = "917407319638";
  const serviceMessage = `Hi Sanjay Online Center, I want to fill the form for: *${post.title}*.`;
  const whatsappUrl = `https://wa.me/${serviceNumber}?text=${encodeURIComponent(serviceMessage)}`;

  return (
    <div className="bg-slate-50 min-h-screen pb-12">
      <SEOHead 
        title={post.seo?.seoTitle || post.title} 
        description={post.seo?.seoDescription || post.shortDescription}
        keywords={post.seo?.keywords}
        schema={post.schemaMarkup}
      />
      
      {/* 1. Hero Header */}
      <div className="bg-gradient-to-r from-indigo-700 via-purple-700 to-indigo-800 text-white pt-8 pb-16 relative overflow-hidden shadow-lg">
         <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full translate-x-1/3 -translate-y-1/3 blur-3xl"></div>
         <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/20 rounded-full -translate-x-1/3 translate-y-1/3 blur-3xl"></div>
         
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border border-white/20 ${
                            post.category === 'Result' ? 'bg-rose-500/20 text-rose-100' :
                            post.category === 'Admit Card' ? 'bg-blue-500/20 text-blue-100' :
                            'bg-emerald-500/20 text-emerald-100'
                        }`}>
                            {post.category}
                        </span>
                        <span className="flex items-center gap-1 bg-black/20 px-3 py-1 rounded-full text-xs font-bold text-yellow-300 border border-white/10 shadow-sm">
                            <Eye size={12} /> <span className="tabular-nums">{formattedViews}</span> Views
                        </span>
                        <span className="flex items-center gap-1 bg-red-500 px-2 py-0.5 rounded-full text-[10px] font-bold text-white animate-pulse">
                            LIVE
                        </span>
                    </div>

                    <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight leading-tight mb-4 drop-shadow-sm">
                        {post.title}
                    </h1>

                    <div className="flex flex-wrap items-center gap-6 text-sm text-indigo-100 font-medium">
                        <div className="flex items-center gap-1.5">
                            <Calendar size={16} className="text-yellow-300" /> 
                            <span>Updated: {post.updateDate}</span>
                        </div>
                        {post.state && (
                            <div className="flex items-center gap-1.5">
                                <MapPin size={16} className="text-yellow-300" />
                                <span>{post.state}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
         </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Short Info & AI Summary Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden lighting-card">
               <div className="p-6">
                  <h2 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
                      <Zap className="text-yellow-500 fill-current" size={20} /> Short Information
                  </h2>
                  <p className="text-slate-600 leading-relaxed mb-6 bg-slate-50 p-4 rounded-xl border border-slate-100">
                      {post.shortDescription}
                  </p>

                  {/* Introduction (Hook) */}
                  {post.details?.introduction && (
                      <div className="mb-6 prose-sm text-slate-700 leading-relaxed">
                          <p>{post.details.introduction}</p>
                      </div>
                  )}

                  {/* AI Summary Button */}
                  <div>
                    {!aiSummary ? (
                        <button 
                        onClick={handleGenerateSummary}
                        disabled={loadingAi}
                        className="flex items-center gap-2 text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-2.5 rounded-full hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-70"
                        >
                        <Sparkles size={14} />
                        {loadingAi ? 'Generating AI Summary...' : '✨ Generate AI Quick Summary'}
                        </button>
                    ) : (
                        <div className="bg-indigo-50 border border-indigo-100 p-5 rounded-xl animate-in fade-in relative overflow-hidden">
                             <div className="absolute top-0 right-0 p-2 opacity-10"><Sparkles size={60} className="text-indigo-600"/></div>
                             <div className="flex items-center gap-2 mb-3 text-indigo-800 font-bold text-xs uppercase tracking-wider relative z-10">
                                <Sparkles size={14} /> AI Generated Summary
                             </div>
                             <div className="text-sm text-slate-700 whitespace-pre-line leading-relaxed relative z-10 font-medium">{aiSummary}</div>
                        </div>
                    )}
                  </div>
               </div>
            </div>
            
            <AdUnit className="rounded-xl overflow-hidden shadow-sm" />

            {/* Dates & Fees */}
            <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden lighting-card lighting-card-rose flex flex-col">
                    <div className="bg-gradient-to-r from-rose-600 to-rose-700 px-5 py-3 flex items-center gap-2 text-white">
                        <Calendar size={18} />
                        <h3 className="font-bold text-sm uppercase tracking-wide">Important Dates</h3>
                    </div>
                    <div className="p-5 flex-1 bg-white">
                        <ul className="space-y-4">
                            {post.details?.dates?.map((date, idx) => (
                                <li key={idx} className="flex flex-col sm:flex-row justify-between sm:items-center border-b border-rose-100 last:border-0 pb-3 last:pb-0 gap-1">
                                    <span className="text-slate-600 text-sm font-medium">{date.label}</span>
                                    <span className="text-rose-700 font-bold text-sm text-right">{date.date}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden lighting-card lighting-card-blue flex flex-col">
                     <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-5 py-3 flex items-center gap-2 text-white">
                        <Download size={18} />
                        <h3 className="font-bold text-sm uppercase tracking-wide">Application Fee</h3>
                    </div>
                    <div className="p-5 flex-1 bg-white">
                        <ul className="space-y-4">
                            {post.details?.fee?.map((feeItem, idx) => (
                                <li key={idx} className="flex flex-col sm:flex-row justify-between sm:items-center border-b border-blue-100 last:border-0 pb-3 last:pb-0 gap-1">
                                    <span className="text-slate-600 text-sm font-medium">{feeItem.category}</span>
                                    <span className="text-blue-700 font-bold text-sm text-right">{feeItem.amount}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            {/* Vacancy */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden lighting-card lighting-card-emerald">
                <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 px-5 py-3 flex items-center justify-between text-white">
                    <div className="flex items-center gap-2">
                        <Users size={18} />
                        <h3 className="font-bold text-sm uppercase tracking-wide">Vacancy Details</h3>
                    </div>
                    <span className="bg-white/20 px-2 py-0.5 rounded text-xs font-bold">Total: {post.totalVacancy}</span>
                </div>
                
                <div className="p-5">
                    {/* Age Limit */}
                    {post.details?.ageLimit && (
                        <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                            <div className="bg-emerald-100 p-2 rounded-full text-emerald-600"><CheckCircle size={20}/></div>
                            <div className="flex-1">
                                <h4 className="text-emerald-900 font-bold text-sm uppercase mb-1">Age Limit</h4>
                                <div className="text-sm text-emerald-800 flex gap-4 font-medium">
                                    <span>Min: {post.details.ageLimit.min || 'NA'}</span>
                                    <span>Max: {post.details.ageLimit.max || 'NA'}</span>
                                    {post.details.ageLimit.asOn && <span>As on: {post.details.ageLimit.asOn}</span>}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Vacancy Table */}
                    {post.details?.vacancy && post.details.vacancy.length > 0 && (
                        <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-sm">
                            <table className="w-full text-sm text-left text-slate-600">
                                <thead className="text-xs text-emerald-900 uppercase bg-emerald-50">
                                    <tr>
                                        <th className="px-4 py-3 font-bold border-b border-emerald-100">Post Name</th>
                                        <th className="px-2 py-3 font-bold border-b border-emerald-100 text-center">Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {post.details.vacancy.map((row, idx) => (
                                        <tr key={idx} className="bg-white border-b border-slate-100 last:border-0 hover:bg-slate-50">
                                            <td className="px-4 py-3 font-medium text-slate-800">{row.postName}</td>
                                            <td className="px-2 py-3 text-center font-bold text-emerald-700">{row.total}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                    
                    {/* Eligibility List */}
                    {post.details?.qualification && post.details.qualification.length > 0 && (
                        <div className="mt-6">
                            <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                                <Star size={16} className="text-emerald-500 fill-current" /> Eligibility Criteria
                            </h4>
                            <ul className="grid gap-2">
                                {post.details.qualification.map((qual, i) => (
                                    <li key={i} className="flex items-start gap-2 text-sm text-slate-700 bg-slate-50 p-2 rounded border border-slate-100">
                                        <div className="min-w-[6px] h-[6px] rounded-full bg-emerald-500 mt-1.5"></div>
                                        {qual}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
            
            {/* Exam Pattern & Syllabus */}
            {(post.details?.examPattern?.length || 0) > 0 && (
                <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden lighting-card">
                   <div className="bg-gradient-to-r from-blue-700 to-indigo-700 px-5 py-3 flex items-center gap-2 text-white">
                       <ClipboardList size={18} />
                       <h3 className="font-bold text-sm uppercase tracking-wide">Exam Pattern</h3>
                   </div>
                   <div className="p-0">
                       <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left text-slate-600">
                                <thead className="text-xs text-indigo-900 uppercase bg-indigo-50">
                                    <tr>
                                        <th className="px-4 py-3 font-bold border-b border-indigo-100">Paper Name</th>
                                        <th className="px-4 py-3 font-bold border-b border-indigo-100">Subject</th>
                                        <th className="px-4 py-3 font-bold border-b border-indigo-100 text-center">Questions</th>
                                        <th className="px-4 py-3 font-bold border-b border-indigo-100 text-center">Marks</th>
                                        <th className="px-4 py-3 font-bold border-b border-indigo-100 text-center">Time</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {post.details?.examPattern?.map((row, idx) => (
                                        <tr key={idx} className="bg-white border-b border-slate-100 last:border-0 hover:bg-slate-50">
                                            <td className="px-4 py-3 font-bold text-slate-800">{row.paperName || '-'}</td>
                                            <td className="px-4 py-3 font-medium text-slate-700">{row.subject}</td>
                                            <td className="px-4 py-3 text-center">{row.questions}</td>
                                            <td className="px-4 py-3 text-center font-bold">{row.marks}</td>
                                            <td className="px-4 py-3 text-center">{row.duration}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                   </div>
                </div>
            )}

            {/* Selection Process */}
            {(post.details?.selectionProcess?.length || 0) > 0 && (
                <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden lighting-card">
                   <div className="bg-slate-800 px-5 py-3 flex items-center gap-2 text-white">
                       <FileText size={18} />
                       <h3 className="font-bold text-sm uppercase tracking-wide">Selection Process</h3>
                   </div>
                   <div className="p-6">
                        <div className="flex flex-wrap gap-2">
                           {post.details?.selectionProcess?.map((step, i) => (
                               <div key={i} className="flex items-center gap-2 text-sm text-slate-700 bg-slate-50 border border-slate-200 px-4 py-2 rounded-full">
                                   <span className="bg-slate-800 text-white w-5 h-5 flex items-center justify-center rounded-full text-xs font-bold">{i+1}</span>
                                   {step}
                               </div>
                           ))}
                        </div>
                   </div>
                </div>
            )}
            
            {/* Custom Fields (Dynamically Added) */}
            {(post.details?.customFields || []).map((field, idx) => (
                <div key={idx} className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden lighting-card">
                   <div className="bg-slate-700 px-5 py-3 flex items-center gap-2 text-white">
                       <Database size={18} />
                       <h3 className="font-bold text-sm uppercase tracking-wide">{field.title}</h3>
                   </div>
                   <div className="p-6">
                        <div className="text-sm text-slate-700 whitespace-pre-line leading-relaxed">
                            {field.content}
                        </div>
                   </div>
                </div>
            ))}

            {/* How to Apply */}
            {(post.details?.howToApply?.length || 0) > 0 && (
                <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden lighting-card">
                   <div className="bg-indigo-600 px-5 py-3 flex items-center gap-2 text-white">
                       <CheckCircle size={18} />
                       <h3 className="font-bold text-sm uppercase tracking-wide">How to Apply</h3>
                   </div>
                   <div className="p-6 bg-indigo-50/30">
                        <ul className="space-y-3">
                           {post.details?.howToApply?.map((step, i) => (
                               <li key={i} className="flex gap-3 text-sm text-slate-800 bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
                                   <span className="font-bold text-indigo-600 shrink-0">Step {i+1}:</span>
                                   <span>{step}</span>
                               </li>
                           ))}
                        </ul>
                   </div>
                </div>
            )}
            
            {/* Documents */}
            {(post.details?.importantDocuments?.length || 0) > 0 && (
                <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
                   <div className="p-6">
                        <h3 className="font-bold text-slate-800 mb-4">Required Documents</h3>
                        <div className="flex flex-wrap gap-2">
                            {post.details?.importantDocuments?.map((doc, i) => (
                                <span key={i} className="px-3 py-1 bg-amber-50 text-amber-800 text-sm border border-amber-200 rounded-md">
                                    {doc}
                                </span>
                            ))}
                        </div>
                   </div>
                </div>
            )}

            {/* High Impact Ad Slot before Links */}
            <AdUnit format="horizontal" className="shadow-md border border-slate-200" />

            {/* Links */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden lighting-card">
                <div className="bg-slate-900 px-6 py-4 flex items-center gap-2 text-white">
                    <ExternalLink size={20} />
                    <h3 className="font-bold text-lg uppercase tracking-wide">Important Links</h3>
                </div>
                <div className="p-6">
                    <table className="w-full text-sm">
                        <tbody className="divide-y divide-slate-100">
                            {(post.details?.links && post.details.links.length > 0) ? (
                                post.details.links.map((link, index) => (
                                    <tr key={index} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 font-bold text-slate-700">{link.label}</td>
                                        <td className="px-6 py-4 text-right">
                                            <a href={link.url} target="_blank" className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-xs font-bold uppercase hover:bg-indigo-700">
                                                Click Here <ExternalLink size={12} />
                                            </a>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <>
                                    {post.applyUrl && (
                                        <tr>
                                            <td className="px-6 py-4 font-bold text-slate-700">Apply Online</td>
                                            <td className="px-6 py-4 text-right">
                                                <a href={post.applyUrl} target="_blank" className="inline-flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg text-xs font-bold uppercase hover:bg-emerald-700">
                                                    Click Here <ExternalLink size={12} />
                                                </a>
                                            </td>
                                        </tr>
                                    )}
                                </>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Disclaimer */}
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex gap-3 items-start text-amber-800 text-xs leading-relaxed">
                <AlertTriangle size={16} className="mt-0.5 flex-shrink-0" />
                <p><strong>Disclaimer:</strong> Content on SarkariAI is for informational purposes. Users are advised to verify details from official websites before applying.</p>
            </div>

            {/* SANJAY ONLINE CENTER BANNER - BOTTOM */}
            <div className="bg-gradient-to-r from-emerald-600 to-green-600 rounded-2xl p-6 shadow-xl relative overflow-hidden text-white mt-4 animate-in slide-in-from-bottom-5">
                 <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                 <div className="relative z-10 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="space-y-2">
                        <h3 className="text-2xl font-extrabold flex items-center justify-center md:justify-start gap-2">
                            <CheckSquare size={28} /> Sanjay Online Center
                        </h3>
                        <p className="font-medium text-emerald-50 max-w-lg leading-relaxed">
                           সঞ্জয় অনলাইন সেন্টার এখানে সমস্ত চাকরীর এক্সাম ফ্রম ফিলাপ করা হয়। WBSSC Group C & D, Railway NTPC, SSC, TET সহ সমস্ত ফর্ম বাড়িতে বসে ফিলাপ করুন।
                        </p>
                        <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-2 text-sm font-bold text-yellow-300">
                           <span className="bg-black/20 px-3 py-1 rounded-full">WhatsApp: 7407319638</span>
                           <span className="bg-black/20 px-3 py-1 rounded-full">Service Charge: ₹60/-</span>
                           <span className="bg-black/20 px-3 py-1 rounded-full text-white/80">App Fees: Yours</span>
                        </div>
                    </div>
                    <a 
                        href={whatsappUrl}
                        target="_blank" 
                        className="bg-white text-emerald-700 hover:bg-emerald-50 px-8 py-3 rounded-full font-extrabold shadow-lg hover:scale-105 transition-transform flex items-center gap-2 whitespace-nowrap"
                    >
                        <MessageCircle size={20} /> Message Now
                    </a>
                 </div>
            </div>

          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-1 space-y-6">
             <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
                <div className="bg-indigo-50 px-4 py-3 border-b border-indigo-100 font-bold text-indigo-900 flex items-center gap-2">
                    <Sparkles size={16} className="text-indigo-600"/> Related Jobs
                </div>
                <div className="divide-y divide-slate-100">
                    {relatedPosts.map(related => (
                        <Link to={`/post/${related.id}`} key={related.id} className="block p-4 hover:bg-slate-50 transition-colors group">
                            <h4 className="text-sm font-bold text-slate-700 group-hover:text-indigo-600 line-clamp-2 mb-1">
                                {related.title}
                            </h4>
                            <div className="flex items-center justify-between text-[10px] text-slate-400">
                                <span>{related.updateDate}</span>
                                <span className="group-hover:translate-x-1 transition-transform">View <ArrowRight size={10} className="inline"/></span>
                            </div>
                        </Link>
                    ))}
                </div>
             </div>
            
            {/* Post Specific Social Links */}
             {(post.details?.socialLinks?.whatsapp || post.details?.socialLinks?.telegram || post.details?.socialLinks?.facebook) && (
                 <div className="space-y-3">
                     {post.details.socialLinks.whatsapp && (
                         <a href={post.details.socialLinks.whatsapp} target="_blank" className="block bg-green-500 hover:bg-green-600 text-white p-3 rounded-xl shadow-sm hover:shadow-md transition-all text-center font-bold text-sm flex items-center justify-center gap-2">
                             <MessageCircle size={18} /> Join WhatsApp Group
                         </a>
                     )}
                     {post.details.socialLinks.telegram && (
                         <a href={post.details.socialLinks.telegram} target="_blank" className="block bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-xl shadow-sm hover:shadow-md transition-all text-center font-bold text-sm flex items-center justify-center gap-2">
                             <MessageCircle size={18} /> Join Telegram Channel
                         </a>
                     )}
                     {post.details.socialLinks.facebook && (
                         <a href={post.details.socialLinks.facebook} target="_blank" className="block bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-xl shadow-sm hover:shadow-md transition-all text-center font-bold text-sm flex items-center justify-center gap-2">
                             <Share2 size={18} /> Join Facebook Group
                         </a>
                     )}
                 </div>
             )}

             <AdUnit format="square" className="mx-auto" />

             {/* Sticky Join Button (Global) */}
             <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white text-center shadow-lg relative overflow-hidden group cursor-pointer">
                 <div className="absolute top-0 right-0 w-24 h-24 bg-white/20 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform"></div>
                 <MessageCircle size={40} className="mx-auto mb-3 text-white" />
                 <h3 className="font-bold text-xl mb-1">Join Community</h3>
                 <p className="text-blue-100 text-xs mb-4">Get Real-time Updates on your phone.</p>
                 <button className="bg-white text-blue-600 font-bold py-2 px-6 rounded-full text-sm hover:shadow-lg hover:scale-105 transition-all">
                    Join Channel
                 </button>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};