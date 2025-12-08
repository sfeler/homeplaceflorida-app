import { useEffect } from 'react';

export default function SEOHead({ title, description, keywords, canonicalUrl, ogImage }) {
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
      'og:type': 'website'
    };

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
      'twitter:image': ogImage
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

    // Cleanup on unmount
    return () => {
      document.title = 'HomePlace Florida Real Estate';
    };
  }, [title, description, keywords, canonicalUrl, ogImage]);

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

  return { title, description, keywords, ogImage: property.images?.[0] };
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

  return { title, description, keywords };
}