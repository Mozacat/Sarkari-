
import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { PostDetail } from './pages/PostDetail';
import { CategoryPage } from './pages/CategoryPage';
import { StateList } from './pages/StateList';
import { CategoryList } from './pages/CategoryList';
import { AdminDashboard } from './pages/AdminDashboard';
import { PostEditor } from './pages/PostEditor';
import { Chatbot } from './components/Chatbot';
import { SEOHead } from './components/SEOHead';
import { SubscriptionPopup } from './components/SubscriptionPopup';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
        {/* Global SEO handler for base settings like Analytics/Verification which run on every page */}
        <SEOHead />
        
        {/* Global Engagement Popup */}
        <SubscriptionPopup />
        
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/category/:category" element={<CategoryPage />} />
            <Route path="/categories" element={<CategoryList />} />
            
            <Route path="/state/:state" element={<CategoryPage />} /> 
            <Route path="/states" element={<StateList />} />
            
            <Route path="/post/:id" element={<PostDetail />} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/new" element={<PostEditor />} />
            <Route path="/admin/edit/:id" element={<PostEditor />} />
          </Routes>
        </main>
        <Footer />
        <Chatbot />
      </div>
    </Router>
  );
}

export default App;
