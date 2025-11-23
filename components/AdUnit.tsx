import React, { useEffect, useState } from 'react';
import { getSiteSettings } from '../services/mockData';

interface AdUnitProps {
  slot?: 'header' | 'footer' | 'sidebar' | 'inPost';
  format?: 'horizontal' | 'vertical' | 'square' | 'responsive';
  className?: string;
}

export const AdUnit: React.FC<AdUnitProps> = ({ slot, format = 'responsive', className = '' }) => {
  const [adCode, setAdCode] = useState<string>('');
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const settings = getSiteSettings();
    const isMobile = window.innerWidth < 768;

    // 1. Check Visibility Control
    if (isMobile && !settings.ads.showOnMobile) {
      setIsVisible(false);
      return;
    }
    if (!isMobile && !settings.ads.showOnDesktop) {
      setIsVisible(false);
      return;
    }

    // 2. Select Slot Code
    let code = '';
    if (slot === 'header') code = settings.ads.headerSlot;
    else if (slot === 'footer') code = settings.ads.footerSlot;
    else if (slot === 'sidebar') code = settings.ads.sidebarSlot;
    else if (slot === 'inPost') code = settings.ads.inPostSlot;
    
    setAdCode(code);
  }, [slot]);

  if (!isVisible) return null;

  // If Real Ad Code exists, render it
  if (adCode) {
    return (
      <div 
        className={`my-4 mx-auto overflow-hidden ${className}`}
        dangerouslySetInnerHTML={{ __html: adCode }}
      />
    );
  }

  // Fallback / Placeholder if no code is set
  let dimensions = 'h-24 w-full'; 
  if (format === 'vertical') dimensions = 'h-full w-40'; 
  if (format === 'square') dimensions = 'h-64 w-64'; 
  if (format === 'responsive') dimensions = 'min-h-[100px] w-full';

  return (
    <div className={`my-4 mx-auto flex flex-col items-center justify-center bg-slate-100 border-2 border-dashed border-slate-300 rounded-lg text-slate-400 text-xs font-mono select-none overflow-hidden ${dimensions} ${className}`}>
      <span className="mb-1 font-bold">ADSENSE / AD SLOT</span>
      <span className="opacity-50">{slot ? slot.toUpperCase() : 'AUTO'} POSITION</span>
    </div>
  );
};