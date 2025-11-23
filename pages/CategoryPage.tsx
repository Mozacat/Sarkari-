import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { JobCategory, JobPost } from '../types';
import { getPostsByCategory } from '../services/mockData';
import { JobCard } from '../components/JobCard';
import { AdUnit } from '../components/AdUnit';

export const CategoryPage: React.FC = () => {
  const { category } = useParams<{ category: string }>();
  const [posts, setPosts] = useState<JobPost[]>([]);
  
  const formattedCategory = category 
    ? category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') as JobCategory
    : JobCategory.LATEST_JOB;

  useEffect(() => {
    // In a real app, this would fetch based on the category param
    // Here we map the string to the Enum or fallback
    let enumVal = JobCategory.LATEST_JOB;
    Object.values(JobCategory).forEach(val => {
      if (val.toLowerCase() === formattedCategory.toLowerCase()) {
        enumVal = val;
      }
    });

    // Simulate fetching more data for the "view all" pages
    setPosts(getPostsByCategory(enumVal, 20));
  }, [category, formattedCategory]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        
        <div className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-slate-800 border-l-8 border-indigo-600 pl-4">
              {formattedCategory}
            </h1>
            <span className="text-sm text-slate-500">{posts.length} Posts</span>
          </div>

          <AdUnit className="mb-6" />

          <div className="grid gap-4">
            {posts.map((post) => (
              <JobCard key={post.id} post={post} />
            ))}
          </div>

          {/* Pagination Mock */}
          <div className="flex justify-center mt-10 space-x-2">
            <button className="px-4 py-2 border border-slate-300 rounded hover:bg-slate-100 disabled:opacity-50" disabled>Prev</button>
            <button className="px-4 py-2 bg-indigo-600 text-white rounded">1</button>
            <button className="px-4 py-2 border border-slate-300 rounded hover:bg-slate-100">2</button>
            <button className="px-4 py-2 border border-slate-300 rounded hover:bg-slate-100">3</button>
            <span className="px-2 py-2 text-slate-400">...</span>
            <button className="px-4 py-2 border border-slate-300 rounded hover:bg-slate-100">Next</button>
          </div>
        </div>

        <div className="w-full lg:w-80 flex-shrink-0 space-y-6">
           <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
             <h3 className="font-bold text-indigo-800 mb-2">Subscribe</h3>
             <p className="text-xs text-indigo-600 mb-3">Get daily job alerts via Email</p>
             <input type="email" placeholder="Enter email" className="w-full px-3 py-2 text-sm border rounded mb-2" />
             <button className="w-full bg-indigo-600 text-white py-2 rounded text-sm font-medium hover:bg-indigo-700">Subscribe</button>
           </div>
           <AdUnit format="square" className="mx-auto" />
        </div>
      
      </div>
    </div>
  );
};