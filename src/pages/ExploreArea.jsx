import React from 'react';
import { useQuery } from '@tanstack/react-query';
import SEOHead from '../components/shared/SEOHead';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Utensils, Compass, Calendar, Waves, ExternalLink, Phone, Globe, Youtube } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

// Import JSON data
import diningData from '@/data/dining.json';
import attractionsData from '@/data/attractions.json';
import eventsData from '@/data/events.json';
import beachesData from '@/data/beaches.json';

// Check if content is HTML (contains HTML tags)
const isHTML = (content) => {
  if (!content) return false;
  const htmlRegex = /<[a-z][\s\S]*>/i;
  return htmlRegex.test(content);
};

// Strip HTML tags for plain text preview
const stripHTML = (html) => {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '').trim();
};

// Generate Google Maps embed from address
const generateMapEmbed = (address) => {
  if (!address) return null;
  const encodedAddress = encodeURIComponent(address);
  return `<iframe src="https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodedAddress}" width="100%" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>`;
};

// Category configuration
const CATEGORIES = {
  dining: {
    title: 'Dining & Nightlife',
    icon: Utensils,
    color: 'amber',
    data: diningData,
    description: 'Discover the best restaurants, bars, and nightlife spots in Tampa Bay'
  },
  attractions: {
    title: 'Attractions',
    icon: Compass,
    color: 'blue',
    data: attractionsData,
    description: 'Explore top attractions and entertainment venues in the area'
  },
  events: {
    title: 'Events & Festivals',
    icon: Calendar,
    color: 'purple',
    data: eventsData,
    description: 'Experience the vibrant events and festivals throughout the year'
  },
  outdoors: {
    title: 'Beaches, Parks & Outdoors',
    icon: Waves,
    color: 'green',
    data: beachesData,
    description: 'Enjoy beautiful beaches, parks, and outdoor activities'
  }
};

export default function ExploreArea() {
  const urlParams = new URLSearchParams(window.location.search);
  const category = urlParams.get('category') || 'all';
  const itemSlug = urlParams.get('item');

  // Get category config
  const categoryConfig = category !== 'all' ? CATEGORIES[category] : null;

  // If item slug is provided, show detail view
  if (itemSlug && categoryConfig) {
    const item = categoryConfig.data.find(i => i.slug === itemSlug);
    
    if (!item) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <div className="text-center">
            <MapPin className="h-16 w-16 text-slate-300 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-slate-900 mb-2">Item Not Found</h2>
            <p className="text-slate-500 mb-4">The requested item doesn't exist.</p>
            <Link to={createPageUrl('ExploreArea') + `?category=${category}`}>
              <Button>Back to {categoryConfig.title}</Button>
            </Link>
          </div>
        </div>
      );
    }

    const Icon = categoryConfig.icon;

    return (
      <div className="min-h-screen bg-slate-50">
        <SEOHead 
          title={`${item.title} - ${categoryConfig.title} | HomePlace Florida`}
          description={item.short_description || stripHTML(item.description).slice(0, 160)}
          keywords={`${item.title}, Tampa Bay, Florida, ${categoryConfig.title.toLowerCase()}`}
          canonicalUrl={`${window.location.origin}/explore-area?category=${category}&item=${itemSlug}`}
          ogImage={item.featured_image}
        />

        {/* Hero Section */}
        <div className="relative h-[50vh] min-h-[400px]">
          <img 
            src={item.featured_image || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1920&q=80'}
            alt={item.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          <div className="absolute inset-0 flex items-end">
            <div className="max-w-7xl mx-auto px-6 lg:px-8 pb-12 w-full">
              <Badge className={`bg-${categoryConfig.color}-500 text-slate-900 mb-4`}>
                {categoryConfig.title}
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
                {item.title}
              </h1>
              <p className="text-xl text-gray-200 max-w-2xl flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                {item.location}
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
          {/* Quick Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 -mt-20 relative z-10 mb-12">
            {item.website && (
              <a 
                href={item.website} 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow"
              >
                <Globe className={`h-8 w-8 text-${categoryConfig.color}-500 mx-auto mb-2`} />
                <div className="text-sm font-medium text-slate-900">Visit Website</div>
                <div className="text-xs text-slate-500 mt-1">Learn More</div>
              </a>
            )}
            {item.phone && (
              <a 
                href={`tel:${item.phone}`}
                className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow"
              >
                <Phone className={`h-8 w-8 text-${categoryConfig.color}-500 mx-auto mb-2`} />
                <div className="text-sm font-medium text-slate-900">{item.phone}</div>
                <div className="text-xs text-slate-500 mt-1">Call Now</div>
              </a>
            )}
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <Icon className={`h-8 w-8 text-${categoryConfig.color}-500 mx-auto mb-2`} />
              <div className="text-sm font-medium text-slate-900">{categoryConfig.title}</div>
              <div className="text-xs text-slate-500 mt-1">Category</div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white rounded-xl p-8 mb-12">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">About {item.title}</h2>
            <div className="text-slate-600 leading-relaxed prose prose-slate max-w-none" 
              dangerouslySetInnerHTML={{ __html: item.description }} 
            />
          </div>

          {/* YouTube Video */}
          {item.youtube_url && (
            <div className="mb-12">
              <h2 className="text-2xl font-semibold text-slate-900 mb-6 flex items-center gap-2">
                <Youtube className="h-6 w-6 text-red-500" />
                Video
              </h2>
              <div className="aspect-video rounded-xl overflow-hidden shadow-lg">
                <iframe
                  src={item.youtube_url.replace('watch?v=', 'embed/').replace('youtu.be/', 'youtube.com/embed/')}
                  title={`${item.title} video`}
                  className="w-full h-full"
                  allowFullScreen
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                />
              </div>
            </div>
          )}

          {/* Gallery */}
          {item.gallery_images && item.gallery_images.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-semibold text-slate-900 mb-6">Photo Gallery</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {item.gallery_images.map((img, idx) => (
                  <div key={idx} className="aspect-square rounded-lg overflow-hidden shadow-md">
                    <img 
                      src={img} 
                      alt={`${item.title} photo ${idx + 1}`}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Map */}
          {item.location && (
            <div className="mb-12">
              <h2 className="text-2xl font-semibold text-slate-900 mb-6 flex items-center gap-2">
                <MapPin className="h-6 w-6 text-amber-500" />
                Location Map
              </h2>
              <div className="rounded-xl overflow-hidden shadow-lg border border-slate-200">
                <div dangerouslySetInnerHTML={{ __html: generateMapEmbed(item.location) }} />
              </div>
              <p className="text-sm text-slate-600 mt-3 flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {item.location}
              </p>
            </div>
          )}

          {/* Highlights */}
          {item.highlights && item.highlights.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-semibold text-slate-900 mb-6">Highlights</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {item.highlights.map((highlight, idx) => (
                  <div key={idx} className="bg-white rounded-lg p-4 border border-slate-200 flex items-start gap-3">
                    <div className={`w-2 h-2 bg-${categoryConfig.color}-500 rounded-full mt-2 flex-shrink-0`} />
                    <span className="font-medium text-slate-700">{highlight}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Back Button */}
          <div className="text-center">
            <Link to={createPageUrl('ExploreArea') + `?category=${category}`}>
              <Button variant="outline" size="lg">
                Back to {categoryConfig.title}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Category listing view
  if (category !== 'all' && categoryConfig) {
    const Icon = categoryConfig.icon;
    const items = categoryConfig.data.filter(item => item.published !== false);

    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <SEOHead 
          title={`${categoryConfig.title} - Explore Tampa Bay | HomePlace Florida`}
          description={categoryConfig.description}
          keywords={`Tampa Bay, Florida, ${categoryConfig.title.toLowerCase()}`}
          canonicalUrl={`${window.location.origin}/explore-area?category=${category}`}
        />

        {/* Header */}
        <div className="bg-slate-900 text-white py-16">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <Link 
              to={createPageUrl('ExploreArea')}
              className="inline-flex items-center text-amber-400 hover:text-amber-300 mb-6 text-sm"
            >
              ← Back to All Categories
            </Link>
            <h1 className="text-4xl md:text-5xl font-semibold mb-4 flex items-center gap-4">
              <Icon className="h-12 w-12" />
              {categoryConfig.title}
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl">
              {categoryConfig.description}
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
          {/* Items Grid */}
          {items.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {items.map((item) => (
                <Link
                  key={item.id}
                  to={createPageUrl('ExploreArea') + `?category=${category}&item=${item.slug}`}
                  className="group"
                >
                  <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                    <div className="aspect-video relative overflow-hidden">
                      <img
                        src={item.featured_image || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80'}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4">
                        {item.featured && (
                          <Badge className={`bg-${categoryConfig.color}-500 text-slate-900 mb-2`}>Featured</Badge>
                        )}
                        <h3 className="text-xl font-semibold text-white">
                          {item.title}
                        </h3>
                      </div>
                    </div>
                    <div className="p-6">
                      <p className="text-slate-600 mb-4 line-clamp-2">
                        {item.short_description || stripHTML(item.description).slice(0, 120)}
                      </p>
                      <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
                        <MapPin className="h-4 w-4" />
                        <span className="line-clamp-1">{item.location}</span>
                      </div>
                      {item.highlights && item.highlights.length > 0 && (
                        <div className="space-y-1 mb-4">
                          {item.highlights.slice(0, 3).map((highlight, idx) => (
                            <div key={idx} className="flex items-start gap-2 text-xs text-slate-600">
                              <div className={`w-1.5 h-1.5 bg-${categoryConfig.color}-500 rounded-full mt-1 flex-shrink-0`} />
                              <span className="line-clamp-1">{highlight}</span>
                            </div>
                          ))}
                        </div>
                      )}
                      <div className="pt-4 border-t border-slate-100">
                        <span className={`text-${categoryConfig.color}-600 font-medium group-hover:text-${categoryConfig.color}-700 transition-colors`}>
                          Learn More →
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <Icon className="h-16 w-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold text-slate-900 mb-2">
                No Items Yet
              </h3>
              <p className="text-slate-600">
                Check back soon for more {categoryConfig.title.toLowerCase()}.
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // All categories overview
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <SEOHead 
        title="Explore Tampa Bay Area - Dining, Attractions, Events & More | HomePlace Florida"
        description="Discover the best of Tampa Bay - restaurants, attractions, events, beaches, and outdoor activities. Your complete guide to living in Tampa Bay, Florida."
        keywords="Tampa Bay, Florida, dining, restaurants, attractions, events, beaches, parks, things to do"
        canonicalUrl={`${window.location.origin}/explore-area`}
      />

      {/* Header */}
      <div className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="inline-block mb-4 px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-full">
            <span className="text-amber-400 text-sm font-medium tracking-wide">EXPLORE THE AREA</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-semibold mb-4">
            Discover Tampa Bay
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl">
            Explore the best dining, attractions, events, and outdoor activities in the Tampa Bay area
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {Object.entries(CATEGORIES).map(([key, config]) => {
            const Icon = config.icon;
            const itemCount = config.data.filter(item => item.published !== false).length;
            
            return (
              <Link
                key={key}
                to={createPageUrl('ExploreArea') + `?category=${key}`}
                className="group"
              >
                <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-amber-500">
                  <div className="p-8">
                    <div className={`w-16 h-16 bg-${config.color}-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <Icon className={`h-8 w-8 text-${config.color}-600`} />
                    </div>
                    <h2 className="text-2xl font-semibold text-slate-900 mb-2">
                      {config.title}
                    </h2>
                    <p className="text-slate-600 mb-4">
                      {config.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-500">
                        {itemCount} {itemCount === 1 ? 'item' : 'items'}
                      </span>
                      <span className={`text-${config.color}-600 font-medium group-hover:text-${config.color}-700 transition-colors flex items-center gap-2`}>
                        Explore <ExternalLink className="h-4 w-4" />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Featured Items Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-semibold text-slate-900 mb-8">Featured Highlights</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.entries(CATEGORIES).map(([key, config]) => {
              const featuredItem = config.data.find(item => item.featured && item.published !== false);
              if (!featuredItem) return null;

              const Icon = config.icon;

              return (
                <Link
                  key={key}
                  to={createPageUrl('ExploreArea') + `?category=${key}&item=${featuredItem.slug}`}
                  className="group"
                >
                  <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                    <div className="aspect-square relative overflow-hidden">
                      <img
                        src={featuredItem.featured_image}
                        alt={featuredItem.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                      <div className="absolute bottom-3 left-3 right-3">
                        <Badge className={`bg-${config.color}-500 text-slate-900 mb-1 text-xs`}>
                          {config.title}
                        </Badge>
                        <h3 className="text-sm font-semibold text-white line-clamp-2">
                          {featuredItem.title}
                        </h3>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

