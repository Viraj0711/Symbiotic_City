import { useEffect } from 'react';

export interface SEOMetaData {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product' | 'profile';
  siteName?: string;
  locale?: string;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  tags?: string[];
}

const defaultMeta: SEOMetaData = {
  title: 'Symbiotic City - Building Sustainable Communities',
  description: 'Join Symbiotic City to build stronger, smarter, and more connected communities for a sustainable future. Collaborate on projects, share resources, and make a positive environmental impact.',
  keywords: ['sustainability', 'community', 'environment', 'green living', 'collaboration', 'eco-friendly', 'renewable energy', 'urban planning'],
  image: '/og-image.jpg',
  url: 'https://symbioticicity.com',
  type: 'website',
  siteName: 'Symbiotic City',
  locale: 'en_US',
};

// Hook for managing SEO meta tags
export const useSEO = (meta: Partial<SEOMetaData> = {}) => {
  useEffect(() => {
    const finalMeta = { ...defaultMeta, ...meta };

    // Update document title
    if (finalMeta.title) {
      document.title = finalMeta.title;
    }

    // Helper function to update or create meta tags
    const updateMetaTag = (selector: string, content: string) => {
      let element = document.querySelector(selector) as HTMLMetaElement;
      if (!element) {
        element = document.createElement('meta');
        document.head.appendChild(element);
        
        // Set name or property attribute based on selector
        if (selector.includes('[property=')) {
          const property = selector.match(/property="([^"]+)"/)?.[1];
          if (property) element.setAttribute('property', property);
        } else if (selector.includes('[name=')) {
          const name = selector.match(/name="([^"]+)"/)?.[1];
          if (name) element.setAttribute('name', name);
        }
      }
      element.setAttribute('content', content);
    };

    // Basic meta tags
    if (finalMeta.description) {
      updateMetaTag('meta[name="description"]', finalMeta.description);
    }

    if (finalMeta.keywords && finalMeta.keywords.length > 0) {
      updateMetaTag('meta[name="keywords"]', finalMeta.keywords.join(', '));
    }

    if (finalMeta.author) {
      updateMetaTag('meta[name="author"]', finalMeta.author);
    }

    // Open Graph meta tags
    if (finalMeta.title) {
      updateMetaTag('meta[property="og:title"]', finalMeta.title);
    }

    if (finalMeta.description) {
      updateMetaTag('meta[property="og:description"]', finalMeta.description);
    }

    if (finalMeta.image) {
      updateMetaTag('meta[property="og:image"]', finalMeta.image);
    }

    if (finalMeta.url) {
      updateMetaTag('meta[property="og:url"]', finalMeta.url);
    }

    if (finalMeta.type) {
      updateMetaTag('meta[property="og:type"]', finalMeta.type);
    }

    if (finalMeta.siteName) {
      updateMetaTag('meta[property="og:site_name"]', finalMeta.siteName);
    }

    if (finalMeta.locale) {
      updateMetaTag('meta[property="og:locale"]', finalMeta.locale);
    }

    // Twitter Card meta tags
    updateMetaTag('meta[name="twitter:card"]', 'summary_large_image');
    
    if (finalMeta.title) {
      updateMetaTag('meta[name="twitter:title"]', finalMeta.title);
    }

    if (finalMeta.description) {
      updateMetaTag('meta[name="twitter:description"]', finalMeta.description);
    }

    if (finalMeta.image) {
      updateMetaTag('meta[name="twitter:image"]', finalMeta.image);
    }

    // Article-specific meta tags
    if (finalMeta.type === 'article') {
      if (finalMeta.author) {
        updateMetaTag('meta[property="article:author"]', finalMeta.author);
      }

      if (finalMeta.publishedTime) {
        updateMetaTag('meta[property="article:published_time"]', finalMeta.publishedTime);
      }

      if (finalMeta.modifiedTime) {
        updateMetaTag('meta[property="article:modified_time"]', finalMeta.modifiedTime);
      }

      if (finalMeta.section) {
        updateMetaTag('meta[property="article:section"]', finalMeta.section);
      }

      if (finalMeta.tags && finalMeta.tags.length > 0) {
        finalMeta.tags.forEach(tag => {
          const existingTag = document.querySelector(`meta[property="article:tag"][content="${tag}"]`);
          if (!existingTag) {
            const element = document.createElement('meta');
            element.setAttribute('property', 'article:tag');
            element.setAttribute('content', tag);
            document.head.appendChild(element);
          }
        });
      }
    }

    // Canonical URL
    if (finalMeta.url) {
      let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
      if (!canonical) {
        canonical = document.createElement('link');
        canonical.setAttribute('rel', 'canonical');
        document.head.appendChild(canonical);
      }
      canonical.setAttribute('href', finalMeta.url);
    }

    // Clean up function
    return () => {
      // Reset title to default on unmount
      document.title = defaultMeta.title || 'Symbiotic City';
    };
  }, [meta]);
};

// Hook for structured data (JSON-LD)
export const useStructuredData = (data: any) => {
  useEffect(() => {
    const scriptId = 'structured-data';
    let script = document.getElementById(scriptId) as HTMLScriptElement;

    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }

    script.textContent = JSON.stringify(data);

    return () => {
      const scriptElement = document.getElementById(scriptId);
      if (scriptElement) {
        document.head.removeChild(scriptElement);
      }
    };
  }, [data]);
};

// Predefined structured data templates
export const structuredDataTemplates = {
  website: (data: { name: string; url: string; description?: string }) => ({
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: data.name,
    url: data.url,
    description: data.description,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${data.url}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  }),

  organization: (data: { name: string; url: string; logo?: string; description?: string }) => ({
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: data.name,
    url: data.url,
    logo: data.logo,
    description: data.description,
  }),

  article: (data: {
    title: string;
    description: string;
    author: string;
    publishedDate: string;
    modifiedDate?: string;
    image?: string;
    url: string;
  }) => ({
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: data.title,
    description: data.description,
    author: {
      '@type': 'Person',
      name: data.author,
    },
    datePublished: data.publishedDate,
    dateModified: data.modifiedDate || data.publishedDate,
    image: data.image,
    url: data.url,
  }),

  product: (data: {
    name: string;
    description: string;
    price: string;
    currency: string;
    availability: string;
    image: string;
    brand?: string;
  }) => ({
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: data.name,
    description: data.description,
    image: data.image,
    brand: data.brand ? {
      '@type': 'Brand',
      name: data.brand,
    } : undefined,
    offers: {
      '@type': 'Offer',
      price: data.price,
      priceCurrency: data.currency,
      availability: `https://schema.org/${data.availability}`,
    },
  }),
};

export default useSEO;