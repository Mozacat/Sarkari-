import React from 'react';
import { Link } from 'react-router-dom';
import { JobPost } from '../types';
import { ExternalLink } from 'lucide-react';

interface JobCardProps {
  post: JobPost;
  compact?: boolean;
}

export const JobCard: React.FC<JobCardProps> = ({ post, compact = false }) => {
  if (compact) {
    return (
      <Link to={`/post/${post.id}`} className="block group">
        <div className="bg-white hover:bg-indigo-50 p-2 border-b border-slate-100 transition-colors">
          <h3 className="text-sm font-medium text-indigo-700 group-hover:text-indigo-900 truncate">
            {post.title}
          </h3>
          <div className="flex justify-between mt-1 text-[10px] text-slate-500">
            <span>{post.updateDate}</span>
            {post.lastDate && <span>Last: {post.lastDate}</span>}
          </div>
        </div>
      </Link>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-all p-4 mb-3">
      <div className="flex justify-between items-start">
        <div>
           <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide mb-2 ${
             post.category === 'Result' ? 'bg-green-100 text-green-800' :
             post.category === 'Admit Card' ? 'bg-blue-100 text-blue-800' :
             'bg-rose-100 text-rose-800'
           }`}>
            {post.category}
          </span>
          <Link to={`/post/${post.id}`}>
            <h3 className="text-lg font-semibold text-indigo-700 hover:text-indigo-900 hover:underline mb-1">
              {post.title}
            </h3>
          </Link>
          <p className="text-sm text-slate-600 line-clamp-2 mb-3">
            {post.shortDescription}
          </p>
        </div>
      </div>
      
      <div className="flex items-center justify-between pt-3 border-t border-slate-100 mt-1">
        <div className="flex gap-4 text-xs text-slate-500 font-medium">
          <span>Updated: {post.updateDate}</span>
          {post.lastDate && <span>Last Date: {post.lastDate}</span>}
        </div>
        <Link 
          to={`/post/${post.id}`}
          className="text-xs font-bold text-indigo-600 flex items-center gap-1 hover:text-indigo-800"
        >
          Details <ExternalLink size={12} />
        </Link>
      </div>
    </div>
  );
};