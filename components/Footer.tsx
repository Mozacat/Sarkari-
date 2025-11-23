
import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-white text-sm font-semibold uppercase tracking-wider mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-white">Home</Link></li>
              <li><Link to="/category/latest-jobs" className="hover:text-white">Latest Jobs</Link></li>
              <li><Link to="/category/results" className="hover:text-white">Results</Link></li>
              <li><Link to="/category/admit-card" className="hover:text-white">Admit Cards</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white text-sm font-semibold uppercase tracking-wider mb-4">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white">Answer Keys</a></li>
              <li><a href="#" className="hover:text-white">Syllabus</a></li>
              <li><a href="#" className="hover:text-white">Admission</a></li>
              <li><a href="#" className="hover:text-white">Important</a></li>
            </ul>
          </div>
           <div>
            <h3 className="text-white text-sm font-semibold uppercase tracking-wider mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white">Disclaimer</a></li>
              <li>
                  <Link to="/admin" className="text-indigo-400 hover:text-white font-bold flex items-center gap-1">
                      🔐 Admin Panel
                  </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-white text-sm font-semibold uppercase tracking-wider mb-4">About SarkariAI</h3>
            <p className="text-sm text-slate-400">
              The smartest way to track government job notifications. Powered by Gemini AI to assist you 24/7.
            </p>
            <div className="mt-4 flex space-x-4">
              {/* Social Icons placeholders */}
              <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center hover:bg-indigo-600 transition-colors cursor-pointer">X</div>
              <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center hover:bg-indigo-600 transition-colors cursor-pointer">In</div>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-slate-800 pt-8 text-center text-xs">
          <p>&copy; 2024 SarkariAI. All rights reserved. Not affiliated with any government organization.</p>
        </div>
      </div>
    </footer>
  );
};
