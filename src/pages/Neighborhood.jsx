import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Neighborhood as NeighborhoodEntity, Property } from '@/api/entities';
import PropertyCard from '../components/properties/PropertyCard';
import SEOHead, { generateNeighborhoodSEO } from '../components/shared/SEOHead';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Home, TrendingUp, Users, ArrowRight, Youtube, GraduationCap, Footprints } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

// Check if content is HTML (contains HTML tags)
const isHTML = (content) => {
  if (!content) return false;
  const htmlRegex = /<[a-z][\s\S]*>/i;
  return htmlRegex.test(content);
};

// Strip HTML tags for plain text preview
const stripHTML = (html) => {
  if (!html) return '';
  // Remove HTML tags using regex
  return html.replace(/<[^>]*>/g, '').trim();
};

export default function Neighborhood() {
  const urlParams = new URLSearchParams(window.location.search);
  const citySlug = urlParams.get('city');

  // Fetch all neighborhoods
  const { data: allNeighborhoods = [], isLoading: loadingNeighborhoods } = useQuery({
    queryKey: ['neighborhoods'],
    queryFn: () => NeighborhoodEntity.filter({ published: true }, 'name', 100)
  });

  // If citySlug is provided, show individual neighborhood, otherwise show listing
  const isListingView = !citySlug;
  const neighborhood = citySlug
    ? allNeighborhoods.find(n => n.slug === citySlug)
    : null;

  const { data: properties = [], isLoading } = useQuery({
    queryKey: ['neighborhood-properties', neighborhood?.name],
    queryFn: async () => {
      if (!neighborhood) return [];
      const allProperties = await Property.filter({ status: 'Active' }, '-created_date', 100);
      return allProperties.filter(p => 
        p.city?.toLowerCase() === neighborhood.name.toLowerCase()
      ).slice(0, 12);
    },
    enabled: !!neighborhood
  });

  const formatPrice = (price) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(price);

  // Loading state
  if (loadingNeighborhoods) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Skeleton className="h-12 w-48 mx-auto mb-4" />
          <Skeleton className="h-4 w-64 mx-auto" />
        </div>
      </div>
    );
  }

  // Listing view - show all neighborhoods
  if (isListingView) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        {/* Header */}
        <div className="bg-slate-900 text-white py-16">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="inline-block mb-4 px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-full">
              <span className="text-amber-400 text-sm font-medium tracking-wide">NEIGHBORHOOD GUIDES</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-semibold mb-4">
              Explore Neighborhoods
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl">
              Discover the perfect community for you with our comprehensive neighborhood guides
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
          {/* Neighborhoods Grid */}
          {allNeighborhoods.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {allNeighborhoods.map((neighborhood) => (
                <Link
                  key={neighborhood.id}
                  to={createPageUrl('Neighborhoods') + `?city=${neighborhood.slug}`}
                  className="group"
                >
                  <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                    <div className="aspect-video relative overflow-hidden">
                      <img
                        src={neighborhood.hero_image || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80'}
                        alt={`${neighborhood.name}, ${neighborhood.state} skyline`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4">
                        <Badge className="bg-amber-500 text-slate-900 mb-2">Neighborhood Guide</Badge>
                        <h3 className="text-xl font-semibold text-white">
                          {neighborhood.name}, {neighborhood.state}
                        </h3>
                      </div>
                    </div>
                    <div className="p-6">
                      <p className="text-slate-600 mb-4 line-clamp-2">
                        {neighborhood.short_description || (neighborhood.description ? stripHTML(neighborhood.description).slice(0, 120) : null) || 'Discover this vibrant community...'}
                      </p>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="text-center">
                          <div className="font-semibold text-slate-900">
                            {neighborhood.avg_home_price ? formatPrice(neighborhood.avg_home_price) : '—'}
                          </div>
                          <div className="text-slate-500">Avg. Price</div>
                        </div>
                        <div className="text-center">
                          <div className="font-semibold text-slate-900">
                            {neighborhood.school_rating || 'A'}
                          </div>
                          <div className="text-slate-500">School Rating</div>
                        </div>
                      </div>
                      <div className="mt-4 pt-4 border-t border-slate-100">
                        <span className="text-amber-600 font-medium group-hover:text-amber-700 transition-colors">
                          View Guide →
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <MapPin className="h-16 w-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold text-slate-900 mb-2">
                No Neighborhoods Yet
              </h3>
              <p className="text-slate-600">
                Check back soon for comprehensive neighborhood guides.
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // No neighborhoods available
  if (allNeighborhoods.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <MapPin className="h-16 w-16 text-slate-300 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-slate-900 mb-2">No Neighborhoods Yet</h2>
          <p className="text-slate-500">Check back soon for neighborhood guides.</p>
        </div>
      </div>
    );
  }

  // Neighborhood not found
  if (!neighborhood) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <MapPin className="h-16 w-16 text-slate-300 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-slate-900 mb-2">Neighborhood Not Found</h2>
          <p className="text-slate-500 mb-4">The requested neighborhood doesn't exist.</p>
          <Link to={createPageUrl('Neighborhoods')}>
            <Button>View All Neighborhoods</Button>
          </Link>
        </div>
      </div>
    );
  }

  const seo = generateNeighborhoodSEO(neighborhood.name, neighborhood.state, properties.length);

  return (
    <div className="min-h-screen bg-slate-50">
      <SEOHead 
        title={seo.title}
        description={seo.description}
        keywords={seo.keywords}
        canonicalUrl={`${window.location.origin}/neighborhoods?city=${neighborhood.slug}`}
        ogImage={neighborhood.hero_image}
      />

      {/* Hero Section */}
      <div className="relative h-[50vh] min-h-[400px]">
        <img 
          src={neighborhood.hero_image || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1920&q=80'}
          alt={`${neighborhood.name}, ${neighborhood.state} skyline and neighborhood view`}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute inset-0 flex items-end">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 pb-12 w-full">
            <Badge className="bg-amber-500 text-slate-900 mb-4">Neighborhood Guide</Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              {neighborhood.name}, {neighborhood.state}
            </h1>
            <p className="text-xl text-gray-200 max-w-2xl">
              {neighborhood.short_description || (neighborhood.description ? stripHTML(neighborhood.description).slice(0, 150) : null)}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 -mt-20 relative z-10 mb-12">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <Home className="h-8 w-8 text-amber-500 mx-auto mb-2" />
            <div className="text-3xl font-bold text-slate-900">{properties.length}</div>
            <div className="text-sm text-slate-500">Active Listings</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <TrendingUp className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <div className="text-3xl font-bold text-slate-900">
              {neighborhood.avg_home_price ? formatPrice(neighborhood.avg_home_price) : 'N/A'}
            </div>
            <div className="text-sm text-slate-500">Avg. Home Price</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <GraduationCap className="h-8 w-8 text-blue-500 mx-auto mb-2" />
            <div className="text-3xl font-bold text-slate-900">{neighborhood.school_rating || 'A'}</div>
            <div className="text-sm text-slate-500">School Rating</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <Footprints className="h-8 w-8 text-purple-500 mx-auto mb-2" />
            <div className="text-3xl font-bold text-slate-900">{neighborhood.walkability_score || '—'}</div>
            <div className="text-sm text-slate-500">Walk Score</div>
          </div>
        </div>

        {/* Description */}
        <div className="bg-white rounded-xl p-8 mb-12">
          <h2 className="text-2xl font-semibold text-slate-900 mb-4">About {neighborhood.name}</h2>
          <div className="text-slate-600 leading-relaxed prose prose-slate max-w-none" dangerouslySetInnerHTML={{ __html: neighborhood.description }} />
          {neighborhood.population && (
            <p className="text-sm text-slate-500 mt-4">Population: {neighborhood.population}</p>
          )}
        </div>

        {/* YouTube Video */}
        {neighborhood.youtube_url && (
          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-slate-900 mb-6 flex items-center gap-2">
              <Youtube className="h-6 w-6 text-red-500" />
              Video Tour
            </h2>
            <div className="aspect-video rounded-xl overflow-hidden shadow-lg">
              <iframe
                src={neighborhood.youtube_url.replace('watch?v=', 'embed/').replace('youtu.be/', 'youtube.com/embed/')}
                title={`${neighborhood.name} video tour`}
                className="w-full h-full"
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              />
            </div>
          </div>
        )}

        {/* Gallery */}
        {neighborhood.gallery_images && neighborhood.gallery_images.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-slate-900 mb-6">Photo Gallery</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {neighborhood.gallery_images.map((img, idx) => (
                <div key={idx} className="aspect-square rounded-lg overflow-hidden shadow-md">
                  <img 
                    src={img} 
                    alt={`${neighborhood.name} neighborhood photo ${idx + 1}`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Map */}
        {neighborhood.map_embed && (
          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-slate-900 mb-6">Location Map</h2>
            <div className="rounded-xl overflow-hidden shadow-lg border border-slate-200">
              <div dangerouslySetInnerHTML={{ __html: neighborhood.map_embed }} />
            </div>
          </div>
        )}

        {/* Neighborhood Highlights */}
        {neighborhood.highlights && neighborhood.highlights.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-slate-900 mb-6">Why Live in {neighborhood.name}?</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {neighborhood.highlights.map((highlight, idx) => (
                <div key={idx} className="bg-white rounded-lg p-4 border border-slate-200">
                  <div className="w-2 h-2 bg-amber-500 rounded-full mb-2" />
                  <span className="font-medium text-slate-700">{highlight}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Other Neighborhoods */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-slate-900 mb-6">Explore Other Areas</h2>
          <div className="flex flex-wrap gap-2">
            {allNeighborhoods.map((n) => (
              <Link key={n.id} to={createPageUrl('Neighborhoods') + `?city=${n.slug}`}>
                <Badge 
                  variant={n.slug === neighborhood.slug ? 'default' : 'outline'}
                  className={`cursor-pointer text-sm py-2 px-4 ${n.slug === neighborhood.slug ? 'bg-amber-500 text-slate-900' : 'hover:bg-slate-100'}`}
                >
                  {n.name}
                </Badge>
              </Link>
            ))}
          </div>
        </div>

        {/* Properties */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-slate-900">
              Homes for Sale in {neighborhood.name}
            </h2>
            <Link to={createPageUrl('Listings') + `?location=${neighborhood.name}`}>
              <Button variant="outline" className="gap-2">
                View All <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="h-64 w-full rounded-xl" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : properties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-xl">
              <Home className="h-12 w-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-900 mb-2">No listings available</h3>
              <p className="text-slate-500 mb-4">Check back soon for new properties in {neighborhood.name}</p>
              <Link to={createPageUrl('Listings')}>
                <Button>Browse All Listings</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}