/**
 * SEO Utilities for HomePlace Florida Real Estate
 * Comprehensive SEO helper functions and constants
 */

// Base URL for the site
export const SITE_URL = 'https://homeplaceflorida.com';
export const SITE_NAME = 'HomePlace Florida Real Estate';
export const SITE_ALTERNATE_NAMES = ['Home Place Florida', 'Home Place Florida Real Estate', 'HomePlaceFlorida'];
export const SITE_PHONE = '+1-727-492-6291';
export const SITE_EMAIL = 'steve@homeplaceflorida.com';
export const SITE_ADDRESS = {
  street: '10575 68th Ave North, Suite B-2',
  city: 'Seminole',
  state: 'FL',
  zip: '33772',
  country: 'US'
};

// Default meta tags
export const DEFAULT_META = {
  title: 'HomePlace Florida Real Estate | Home Place Florida | Homes for Sale in Pinellas County, FL',
  description: 'Find your dream home in Florida with HomePlace Florida (Home Place Florida) Real Estate. Browse homes for sale in St. Petersburg, Clearwater, and Pinellas County. Expert local realtors with 13+ years experience.',
  keywords: 'HomePlace Florida, Home Place Florida, home placeflorida, homeplace florida real estate, home place florida real estate, Florida real estate, homes for sale Florida, Pinellas County homes, St Petersburg real estate, Clearwater homes, Tampa Bay real estate, buy home Florida, Florida realtors',
  ogImage: `${SITE_URL}/images/logos/HPF_Logo_White.png`
};

// Social media URLs
export const SOCIAL_URLS = {
  facebook: 'https://facebook.com/homeplaceflorida',
  instagram: 'https://instagram.com/homeplaceflorida',
  linkedin: 'https://linkedin.com/company/homeplaceflorida',
  twitter: 'https://twitter.com/homeplaceflorida'
};

/**
 * Generate canonical URL
 */
export function generateCanonicalUrl(path = '') {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${SITE_URL}${cleanPath}`;
}

/**
 * Generate page title with site name
 */
export function generatePageTitle(title) {
  if (!title) return DEFAULT_META.title;
  return `${title} | ${SITE_NAME}`;
}

/**
 * Truncate text for meta descriptions
 */
export function truncateText(text, maxLength = 160) {
  if (!text) return '';
  const cleanText = text.replace(/<[^>]*>/g, '').trim();
  if (cleanText.length <= maxLength) return cleanText;
  return cleanText.slice(0, maxLength - 3) + '...';
}

/**
 * Generate keywords from array or string
 */
export function generateKeywords(keywords) {
  if (Array.isArray(keywords)) {
    return keywords.join(', ');
  }
  return keywords || DEFAULT_META.keywords;
}

/**
 * Generate Organization structured data
 */
export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    "name": SITE_NAME,
    "alternateName": SITE_ALTERNATE_NAMES,
    "url": SITE_URL,
    "logo": `${SITE_URL}/images/logos/HPF_Logo_White.png`,
    "image": `${SITE_URL}/images/logos/HPF_Logo_White.png`,
    "telephone": SITE_PHONE,
    "email": SITE_EMAIL,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": SITE_ADDRESS.street,
      "addressLocality": SITE_ADDRESS.city,
      "addressRegion": SITE_ADDRESS.state,
      "postalCode": SITE_ADDRESS.zip,
      "addressCountry": SITE_ADDRESS.country
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 27.7676,
      "longitude": -82.6403
    },
    "areaServed": [
      {
        "@type": "City",
        "name": "St. Petersburg",
        "containedInPlace": { "@type": "State", "name": "Florida" }
      },
      {
        "@type": "City",
        "name": "Clearwater",
        "containedInPlace": { "@type": "State", "name": "Florida" }
      },
      {
        "@type": "AdministrativeArea",
        "name": "Pinellas County",
        "containedInPlace": { "@type": "State", "name": "Florida" }
      }
    ],
    "sameAs": Object.values(SOCIAL_URLS),
    "priceRange": "$$"
  };
}

/**
 * Generate WebSite structured data with search
 */
export function generateWebsiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": SITE_NAME,
    "alternateName": SITE_ALTERNATE_NAMES,
    "url": SITE_URL,
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${SITE_URL}/Listings?search={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  };
}

/**
 * Generate LocalBusiness structured data
 */
export function generateLocalBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": SITE_NAME,
    "alternateName": SITE_ALTERNATE_NAMES,
    "description": "Premier real estate agency serving Pinellas County, Florida. Also known as Home Place Florida. Specializing in residential properties, buyer and seller representation.",
    "url": SITE_URL,
    "telephone": SITE_PHONE,
    "email": SITE_EMAIL,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": SITE_ADDRESS.street,
      "addressLocality": SITE_ADDRESS.city,
      "addressRegion": SITE_ADDRESS.state,
      "postalCode": SITE_ADDRESS.zip,
      "addressCountry": SITE_ADDRESS.country
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 27.7676,
      "longitude": -82.6403
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "150",
      "bestRating": "5",
      "worstRating": "1"
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "09:00",
        "closes": "18:00"
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": "Saturday",
        "opens": "10:00",
        "closes": "16:00"
      }
    ],
    "priceRange": "$$",
    "sameAs": Object.values(SOCIAL_URLS)
  };
}

/**
 * Generate BreadcrumbList structured data
 */
export function generateBreadcrumbSchema(breadcrumbs) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": crumb.name,
      "item": crumb.url.startsWith('http') ? crumb.url : `${SITE_URL}${crumb.url}`
    }))
  };
}

/**
 * Generate FAQ structured data
 */
export function generateFAQSchema(faqs) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };
}

/**
 * Generate Article structured data for blog posts
 */
export function generateArticleSchema(article) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": article.title,
    "description": article.description || article.excerpt,
    "image": article.image || DEFAULT_META.ogImage,
    "datePublished": article.publishedDate,
    "dateModified": article.modifiedDate || article.publishedDate,
    "author": {
      "@type": "Organization",
      "name": SITE_NAME
    },
    "publisher": {
      "@type": "Organization",
      "name": SITE_NAME,
      "logo": {
        "@type": "ImageObject",
        "url": `${SITE_URL}/images/logos/HPF_Logo_White.png`
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": article.url
    }
  };
}

/**
 * Generate Product structured data for properties
 */
export function generatePropertySchema(property) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": property.title,
    "description": property.description,
    "image": property.images || [],
    "offers": {
      "@type": "Offer",
      "price": property.price,
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock",
      "url": `${SITE_URL}/ListingDetail?id=${property.id}`,
      "seller": {
        "@type": "RealEstateAgent",
        "name": SITE_NAME
      }
    },
    "address": {
      "@type": "PostalAddress",
      "streetAddress": property.address,
      "addressLocality": property.city,
      "addressRegion": property.state,
      "postalCode": property.zip,
      "addressCountry": "US"
    },
    "numberOfRooms": property.beds,
    "numberOfBathroomsTotal": property.baths,
    "floorSize": {
      "@type": "QuantitativeValue",
      "value": property.sqft,
      "unitCode": "FTK"
    }
  };
}

/**
 * Preload critical resources
 */
export function preloadCriticalResources() {
  const resources = [
    { href: '/images/logos/HPF_Logo_White.png', as: 'image' },
    { href: '/images/logos/HPF_Logo_Black.png', as: 'image' }
  ];

  resources.forEach(resource => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = resource.href;
    link.as = resource.as;
    document.head.appendChild(link);
  });
}

/**
 * Add JSON-LD structured data to page
 */
export function addStructuredData(data) {
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(data);
  document.head.appendChild(script);
  return script;
}

/**
 * Remove structured data from page
 */
export function removeStructuredData(script) {
  if (script && script.parentNode) {
    script.parentNode.removeChild(script);
  }
}

/**
 * Generate Open Graph image URL with fallback
 */
export function getOgImage(image) {
  if (!image) return DEFAULT_META.ogImage;
  if (image.startsWith('http') || image.startsWith('data:')) return image;
  return `${SITE_URL}${image}`;
}

/**
 * Generate Twitter Card meta tags
 */
export function generateTwitterMeta(title, description, image) {
  return {
    'twitter:card': 'summary_large_image',
    'twitter:site': '@homeplaceflorida',
    'twitter:creator': '@homeplaceflorida',
    'twitter:title': title,
    'twitter:description': description,
    'twitter:image': getOgImage(image)
  };
}

/**
 * Generate Open Graph meta tags
 */
export function generateOgMeta(title, description, image, url, type = 'website') {
  return {
    'og:type': type,
    'og:site_name': SITE_NAME,
    'og:title': title,
    'og:description': description,
    'og:image': getOgImage(image),
    'og:url': url,
    'og:locale': 'en_US'
  };
}

/**
 * Performance: Lazy load images
 */
export function enableLazyLoading() {
  if ('loading' in HTMLImageElement.prototype) {
    const images = document.querySelectorAll('img[data-src]');
    images.forEach(img => {
      img.src = img.dataset.src;
      img.removeAttribute('data-src');
    });
  } else {
    // Fallback for browsers that don't support lazy loading
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/lazysizes@5.3.2/lazysizes.min.js';
    document.body.appendChild(script);
  }
}

/**
 * Check if page is being crawled by a bot
 */
export function isCrawler() {
  const userAgent = navigator.userAgent.toLowerCase();
  const crawlers = ['googlebot', 'bingbot', 'slurp', 'duckduckbot', 'baiduspider', 'yandexbot', 'facebookexternalhit', 'twitterbot', 'linkedinbot'];
  return crawlers.some(crawler => userAgent.includes(crawler));
}

/**
 * Generate hreflang tags for international SEO (if needed in future)
 */
export function generateHreflangTags(alternates) {
  return alternates.map(alt => ({
    rel: 'alternate',
    hreflang: alt.lang,
    href: alt.url
  }));
}

export default {
  SITE_URL,
  SITE_NAME,
  DEFAULT_META,
  SOCIAL_URLS,
  generateCanonicalUrl,
  generatePageTitle,
  truncateText,
  generateKeywords,
  generateOrganizationSchema,
  generateWebsiteSchema,
  generateLocalBusinessSchema,
  generateBreadcrumbSchema,
  generateFAQSchema,
  generateArticleSchema,
  generatePropertySchema,
  preloadCriticalResources,
  addStructuredData,
  removeStructuredData,
  getOgImage,
  generateTwitterMeta,
  generateOgMeta,
  enableLazyLoading,
  isCrawler,
  generateHreflangTags
};

