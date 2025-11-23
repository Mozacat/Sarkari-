
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getSiteSettings } from '../services/mockData';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  schema?: string;
}

export const SEOHead: React.FC<SEOHeadProps> = ({ 
  title, 
  description, 
  keywords,
  schema
}) => {
  const location = useLocation();
  const settings = getSiteSettings();

  useEffect(() => {
    // 1. Title Control
    const suffix = " | " + settings.general.siteName;
    document.title = title ? `${title}${suffix}` : `${settings.general.siteName} - ${settings.general.tagline}`;

    // 2. Meta Description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', description || settings.mobileSeo.mobileMetaDesc || settings.general.tagline);

    // 3. Keywords
    let metaKw = document.querySelector('meta[name="keywords"]');
    if (!metaKw) {
      metaKw = document.createElement('meta');
      metaKw.setAttribute('name', 'keywords');
      document.head.appendChild(metaKw);
    }
    metaKw.setAttribute('content', keywords || "Sarkari Result, Government Jobs");

    // 4. Canonical
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', `${settings.general.siteBaseUrl}/#${location.pathname}`);

    // 5. Google Verification
    if (settings.google.searchConsoleCode) {
        let verifTag = document.querySelector('meta[name="google-site-verification"]');
        if (!verifTag) {
            verifTag = document.createElement('meta');
            verifTag.setAttribute('name', 'google-site-verification');
            document.head.appendChild(verifTag);
        }
        verifTag.setAttribute('content', settings.google.searchConsoleCode);
    }

    // 6. Google Analytics 4
    if (settings.google.analyticsId) {
        if (!document.getElementById('ga-script')) {
            const script1 = document.createElement('script');
            script1.id = 'ga-script';
            script1.async = true;
            script1.src = `https://www.googletagmanager.com/gtag/js?id=${settings.google.analyticsId}`;
            document.head.appendChild(script1);

            const script2 = document.createElement('script');
            script2.id = 'ga-init';
            script2.innerHTML = `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${settings.google.analyticsId}');
            `;
            document.head.appendChild(script2);
        }
    }

    // 7. Robots Meta Control
    let robotsMeta = document.querySelector('meta[name="robots"]');
    if (!robotsMeta) {
        robotsMeta = document.createElement('meta');
        robotsMeta.setAttribute('name', 'robots');
        document.head.appendChild(robotsMeta);
    }
    
    // Check specific noindex conditions
    let shouldNoIndex = false;
    if (location.pathname.includes('/category/') && settings.indexing.noindexCategories) shouldNoIndex = true;
    
    robotsMeta.setAttribute('content', shouldNoIndex ? 'noindex, follow' : 'index, follow');

    // 8. Mobile Theme Color
    let themeColor = document.querySelector('meta[name="theme-color"]');
    if (!themeColor) {
        themeColor = document.createElement('meta');
        themeColor.setAttribute('name', 'theme-color');
        document.head.appendChild(themeColor);
    }
    themeColor.setAttribute('content', settings.mobileSeo.themeColor);

    // 9. Schema
    if (schema) {
      let script = document.getElementById('schema-markup') as HTMLScriptElement | null;
      if (!script) {
          script = document.createElement('script');
          script.id = 'schema-markup';
          script.type = 'application/ld+json';
          document.head.appendChild(script);
      }
      script.textContent = schema;
    }

    // 10. Global Ad Code Injection
    if (settings.ads.globalHeadCode) {
        const markerId = 'sarkari-global-ads';
        if (!document.getElementById(markerId)) {
            // Create a marker to prevent re-injection
            const marker = document.createElement('div');
            marker.id = markerId;
            marker.style.display = 'none';
            document.body.appendChild(marker); // Append to body to avoid cluttering head visuals, but scripts act globally

            // Parse and inject
            const temp = document.createElement('div');
            temp.innerHTML = settings.ads.globalHeadCode;

            Array.from(temp.childNodes).forEach(node => {
                if (node.nodeName === 'SCRIPT') {
                    const s = document.createElement('script');
                    const scriptNode = node as HTMLScriptElement;
                    Array.from(scriptNode.attributes).forEach(attr => {
                        s.setAttribute(attr.name, attr.value);
                    });
                    s.innerHTML = scriptNode.innerHTML;
                    document.head.appendChild(s);
                } else {
                    document.head.appendChild(node.cloneNode(true));
                }
            });
        }
    }

  }, [title, description, keywords, schema, location, settings]);

  return null;
};
