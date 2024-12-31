import React from 'react';
import { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
}

export const SEO: React.FC<SEOProps> = ({
  title = 'Image Background Remover',
  description = 'Professional online tool to remove backgrounds from images instantly using AI',
  keywords = 'background removal, image editing, AI image processing, transparent background',
  image = '/og-image.jpg',
}) => {
  useEffect(() => {
    // Update document title
    document.title = title;

    // Update meta tags
    const metaTags = {
      description: description,
      keywords: keywords,
      'og:type': 'website',
      'og:url': window.location.href,
      'og:title': title,
      'og:description': description,
      'og:image': image,
      'twitter:card': 'summary_large_image',
      'twitter:url': window.location.href,
      'twitter:title': title,
      'twitter:description': description,
      'twitter:image': image,
    };

    // Update existing meta tags or create new ones
    Object.entries(metaTags).forEach(([name, content]) => {
      let meta = document.querySelector(`meta[name="${name}"]`) ||
                document.querySelector(`meta[property="${name}"]`);
      
      if (!meta) {
        meta = document.createElement('meta');
        if (name.startsWith('og:') || name.startsWith('twitter:')) {
          meta.setAttribute('property', name);
        } else {
          meta.setAttribute('name', name);
        }
        document.head.appendChild(meta);
      }
      
      meta.setAttribute('content', content);
    });

    // Set viewport and language
    let viewport = document.querySelector('meta[name="viewport"]');
    if (!viewport) {
      viewport = document.createElement('meta');
      viewport.setAttribute('name', 'viewport');
      document.head.appendChild(viewport);
    }
    viewport.setAttribute('content', 'width=device-width, initial-scale=1');

    document.documentElement.lang = 'en';
  }, [title, description, keywords, image]);

  return null;
};
