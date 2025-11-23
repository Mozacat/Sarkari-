import React from 'react';
import { Link } from 'react-router-dom';
import { ALL_STATES } from '../services/mockData';
import { MapPin } from 'lucide-react';
import { AdUnit } from '../components/AdUnit';

export const StateList: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-slate-900 mb-3">Browse Jobs by State</h1>
        <p className="text-slate-500">Select your state to find relevant government job notifications.</p>
      </div>

      <AdUnit format="horizontal" className="mb-10" />

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {ALL_STATES.map((state) => (
          <Link 
            key={state} 
            to={`/state/${state.toLowerCase().replace(/\s+/g, '-')}`}
            className="bg-white border border-slate-200 hover:border-indigo-500 rounded-xl p-4 shadow-sm hover:shadow-md transition-all group flex flex-col items-center text-center gap-3"
          >
            <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <MapPin size={24} />
            </div>
            <span className="font-semibold text-slate-700 group-hover:text-indigo-700 text-sm">{state}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};