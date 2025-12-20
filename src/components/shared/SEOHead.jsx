import { useEffect } from 'react';

export default function SEOHead({ 
  title, 
  description, 
  keywords, 
  canonicalUrl, 
  ogImage, 
  ogType = 'website',
  structuredData = null,
  author = 'HomePlace Florida Real Estate',
  publishedTime = null,
  modifiedTime = null
}) {
  useEffect(() => {
    // Update document title
    if (title) {
      document.title = title;
    }

    // Update or create meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.name = 'description';
      document.head.appendChild(metaDescription);
    }
    if (description) {
      metaDescription.content = description;
    }

    // Update or create meta keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.name = 'keywords';
      document.head.appendChild(metaKeywords);
    }
    if (keywords) {
      metaKeywords.content = keywords;
    }

    // Update or create meta author
    let metaAuthor = document.querySelector('meta[name="author"]');
    if (!metaAuthor) {
      metaAuthor = document.createElement('meta');
      metaAuthor.name = 'author';
      document.head.appendChild(metaAuthor);
    }
    if (author) {
      metaAuthor.content = author;
    }

    // Update or create canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    if (canonicalUrl) {
      canonical.href = canonicalUrl;
    }

    // Open Graph tags
    const ogTags = {
      'og:title': title,
      'og:description': description,
      'og:image': ogImage,
      'og:url': canonicalUrl,
      'og:type': ogType,
      'og:site_name': 'HomePlace Florida Real Estate',
      'og:locale': 'en_US'
    };

    // Add article-specific OG tags
    if (ogType === 'article' && publishedTime) {
      ogTags['article:published_time'] = publishedTime;
      if (modifiedTime) {
        ogTags['article:modified_time'] = modifiedTime;
      }
      ogTags['article:author'] = author;
    }

    Object.entries(ogTags).forEach(([property, content]) => {
      if (!content) return;
      let tag = document.querySelector(`meta[property="${property}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('property', property);
        document.head.appendChild(tag);
      }
      tag.content = content;
    });

    // Twitter Card tags
    const twitterTags = {
      'twitter:card': 'summary_large_image',
      'twitter:title': title,
      'twitter:description': description,
      'twitter:image': ogImage,
      'twitter:site': '@homeplaceflorida',
      'twitter:creator': '@homeplaceflorida'
    };

    Object.entries(twitterTags).forEach(([name, content]) => {
      if (!content) return;
      let tag = document.querySelector(`meta[name="${name}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.name = name;
        document.head.appendChild(tag);
      }
      tag.content = content;
    });

    // Add or update structured data (JSON-LD)
    if (structuredData) {
      let script = document.querySelector('script[data-seo="structured-data"]');
      if (!script) {
        script = document.createElement('script');
        script.type = 'application/ld+json';
        script.setAttribute('data-seo', 'structured-data');
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(structuredData);
    }

    // Cleanup on unmount
    return () => {
      document.title = 'HomePlace Florida Real Estate';
      // Remove structured data on unmount
      const script = document.querySelector('script[data-seo="structured-data"]');
      if (script) {
        script.remove();
      }
    };
  }, [title, description, keywords, canonicalUrl, ogImage, ogType, structuredData, author, publishedTime, modifiedTime]);

  return null;
}

// Helper function to generate property SEO data
export function generatePropertySEO(property) {
  if (!property) return {};
  
  const formatPrice = (price) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(price);

  const title = `${property.title} | ${property.beds} Bed ${property.baths} Bath ${property.property_type} in ${property.city}, ${property.state} | HomePlace Florida Real Estate`;
  
  const description = `${formatPrice(property.price)} - ${property.beds} bedroom, ${property.baths} bathroom ${property.property_type?.toLowerCase()} for sale in ${property.city}, ${property.state}. ${property.sqft?.toLocaleString() || ''} sqft. ${property.description?.slice(0, 150) || `Beautiful property located at ${property.address}.`}...`;
  
  const keywords = [
    `${property.city} homes for sale`,
    `${property.city} real estate`,
    `${property.beds} bedroom homes ${property.city}`,
    property.property_type,
    `${property.state} real estate`,
    property.zip,
    'buy home',
    'house for sale'
  ].filter(Boolean).join(', ');

  // Generate structured data for property
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": property.title,
    "description": property.description || `${property.beds} bedroom, ${property.baths} bathroom ${property.property_type} for sale`,
    "image": property.images || [],
    "offers": {
      "@type": "Offer",
      "price": property.price,
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock",
      "url": `https://homeplaceflorida.com/ListingDetail?id=${property.id}`,
      "seller": {
        "@type": "RealEstateAgent",
        "name": "HomePlace Florida Real Estate"
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
    "geo": property.latitude && property.longitude ? {
      "@type": "GeoCoordinates",
      "latitude": property.latitude,
      "longitude": property.longitude
    } : undefined,
    "numberOfRooms": property.beds,
    "numberOfBathroomsTotal": property.baths,
    "floorSize": {
      "@type": "QuantitativeValue",
      "value": property.sqft,
      "unitCode": "FTK"
    }
  };

  // Add SingleFamilyResidence structured data
  const residenceData = {
    "@context": "https://schema.org",
    "@type": "SingleFamilyResidence",
    "name": property.title,
    "description": property.description || `${property.beds} bedroom, ${property.baths} bathroom ${property.property_type}`,
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
    },
    "yearBuilt": property.year_built
  };

  return { 
    title, 
    description, 
    keywords, 
    ogImage: property.images?.[0],
    structuredData: [structuredData, residenceData]
  };
}

// Helper function to generate neighborhood SEO data
export function generateNeighborhoodSEO(city, state = 'FL', propertyCount = 0) {
  const title = `Homes for Sale in ${city}, ${state} | ${propertyCount} Listings | HomePlace Florida Real Estate`;
  
  const description = `Browse ${propertyCount} homes for sale in ${city}, ${state}. Find houses, condos, townhouses and more. View photos, prices, and property details. Contact HomePlace Florida Real Estate today!`;
  
  const keywords = [
    `${city} homes for sale`,
    `${city} real estate`,
    `${city} ${state} houses`,
    `buy home ${city}`,
    `${city} property listings`,
    `${city} condos for sale`,
    `${city} townhouses`
  ].join(', ');

  // Structured data for neighborhood page
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": `Homes for Sale in ${city}, ${state}`,
    "description": description,
    "numberOfItems": propertyCount,
    "itemListElement": []
  };

  return { title, description, keywords, structuredData };
}

// Helper function to generate blog post SEO data
export function generateBlogSEO(post) {
  if (!post) return {};

  const title = `${post.title} | HomePlace Florida Real Estate Blog`;
  const description = post.excerpt || post.content?.slice(0, 160) || 'Read the latest insights from HomePlace Florida Real Estate';
  const keywords = post.tags ? post.tags.join(', ') : 'real estate, Florida, home buying, home selling';

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": description,
    "image": post.cover_image || 'https://homeplaceflorida.com/images/logos/HPF_Logo_White.png',
    "author": {
      "@type": "Organization",
      "name": "HomePlace Florida Real Estate"
    },
    "publisher": {
      "@type": "Organization",
      "name": "HomePlace Florida Real Estate",
      "logo": {
        "@type": "ImageObject",
        "url": "https://homeplaceflorida.com/images/logos/HPF_Logo_White.png"
      }
    },
    "datePublished": post.created_date,
    "dateModified": post.updated_date || post.created_date,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://homeplaceflorida.com/BlogPost?id=${post.id}`
    }
  };

  return {
    title,
    description,
    keywords,
    ogImage: post.cover_image,
    ogType: 'article',
    publishedTime: post.created_date,
    modifiedTime: post.updated_date,
    structuredData
  };
}

// Helper to generate breadcrumb structured data
export function generateBreadcrumbData(breadcrumbs) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": crumb.name,
      "item": crumb.url
    }))
  };
}