
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Search, Briefcase } from 'lucide-react';
import { getSiteSettings } from '../services/mockData';

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [siteName, setSiteName] = useState('SarkariAI');

  useEffect(() => {
    const settings = getSiteSettings();
    setSiteName(settings.general.siteName || 'SarkariAI');
  }, []);

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Latest Jobs', path: '/category/latest-jobs' },
    { label: 'Results', path: '/category/results' },
    { label: 'Admit Card', path: '/category/admit-card' },
    { label: 'Answer Key', path: '/category/answer-key' },
    { label: 'Syllabus', path: '/category/syllabus' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-indigo-700 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
            <div className="bg-white p-1.5 rounded-lg">
              <Briefcase className="text-indigo-700" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">{siteName}</h1>
              <p className="text-[10px] text-indigo-200 uppercase tracking-wider leading-none">Result & Jobs</p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.path}
                className="px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-600 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Search & Mobile Menu Toggle */}
          <div className="flex items-center gap-2">
            <div className="relative hidden sm:block">
              <input
                type="text"
                placeholder="Search posts..."
                className="bg-indigo-800 text-white placeholder-indigo-300 rounded-full pl-9 pr-4 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-white/20 border border-indigo-600"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-300" size={14} />
            </div>
            
            <button
              className="md:hidden p-2 rounded-md hover:bg-indigo-600 focus:outline-none"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isMenuOpen && (
        <div className="md:hidden bg-indigo-800 border-t border-indigo-600">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
             {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.path}
                className="block px-3 py-2 rounded-md text-base font-medium hover:bg-indigo-600"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="relative mt-4 px-3">
              <input
                  type="text"
                  placeholder="Search..."
                  className="w-full bg-indigo-900 text-white placeholder-indigo-400 rounded-md px-4 py-2 text-sm focus:outline-none border border-indigo-700"
                />
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
