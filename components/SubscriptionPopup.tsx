
import React, { useEffect, useState } from 'react';
import { getSiteSettings } from '../services/mockData';
import { MessageCircle, Bell, X, Send } from 'lucide-react';

export const SubscriptionPopup: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [socialLinks, setSocialLinks] = useState<{ whatsapp: string; telegram: string }>({ whatsapp: '', telegram: '' });

  useEffect(() => {
    const settings = getSiteSettings();
    setSocialLinks({
      whatsapp: settings.social.whatsappGroup,
      telegram: settings.social.telegramChannel
    });

    // Check if previously dismissed in this session
    const isDismissed = sessionStorage.getItem('subscription_popup_dismissed');
    
    if (!isDismissed) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 4000); // Show after 4 seconds
      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismiss = () => {
    setIsOpen(false);
    sessionStorage.setItem('subscription_popup_dismissed', 'true');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden relative animate-in zoom-in-95 duration-300">
        
        {/* Close Button */}
        <button 
          onClick={handleDismiss} 
          className="absolute top-2 right-2 bg-slate-100 p-1.5 rounded-full hover:bg-slate-200 transition-colors z-10"
        >
          <X size={20} className="text-slate-600"/>
        </button>

        {/* Header Image/Banner */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-center text-white relative overflow-hidden">
           <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
           <div className="mx-auto bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mb-3 backdrop-blur-md animate-bounce">
              <Bell size={32} className="fill-current text-yellow-300" />
           </div>
           <h3 className="text-xl font-extrabold mb-1">Get Instant Job Alerts!</h3>
           <p className="text-indigo-100 text-xs">Don't miss any Sarkari Notification.</p>
        </div>

        {/* Content Actions */}
        <div className="p-6 space-y-3">
          {socialLinks.whatsapp && (
             <a 
               href={socialLinks.whatsapp} 
               target="_blank" 
               rel="noreferrer"
               className="flex items-center justify-center gap-3 w-full bg-[#25D366] hover:bg-[#20bd5a] text-white py-3 rounded-xl font-bold shadow-lg shadow-green-500/20 hover:shadow-xl hover:-translate-y-0.5 transition-all"
             >
                <MessageCircle size={24} className="fill-white"/> Join WhatsApp Group
             </a>
          )}
          
          {socialLinks.telegram && (
             <a 
               href={socialLinks.telegram} 
               target="_blank" 
               rel="noreferrer"
               className="flex items-center justify-center gap-3 w-full bg-[#0088cc] hover:bg-[#0077b5] text-white py-3 rounded-xl font-bold shadow-lg shadow-blue-500/20 hover:shadow-xl hover:-translate-y-0.5 transition-all"
             >
                <Send size={24} className="fill-white"/> Join Telegram Channel
             </a>
          )}
          
          <button 
             onClick={handleDismiss}
             className="w-full py-3 text-slate-400 text-sm font-medium hover:text-slate-600"
          >
             No thanks, I'll miss updates
          </button>
        </div>
      </div>
    </div>
  );
};
