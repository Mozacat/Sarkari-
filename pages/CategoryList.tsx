import React from 'react';
import { Link } from 'react-router-dom';
import { ALL_CATEGORIES_LIST } from '../services/mockData';
import { Grid } from 'lucide-react';
import { AdUnit } from '../components/AdUnit';

export const CategoryList: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-slate-900 mb-3">All Job Categories</h1>
        <p className="text-slate-500">Browse recruitment notifications by specific categories.</p>
      </div>

      <AdUnit format="horizontal" className="mb-10" />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
        {ALL_CATEGORIES_LIST.map((cat) => (
          <Link 
            key={cat.title}
            to={`/category/${cat.title.toLowerCase().replace(/\s+/g, '-')}`}
            className="flex items-center p-5 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all group"
          >
            <div className="w-12 h-12 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center mr-4 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              <Grid size={24} />
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-800 group-hover:text-indigo-700">{cat.title}</h3>
              <p className="text-xs text-slate-400 mt-1">View all notifications</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};