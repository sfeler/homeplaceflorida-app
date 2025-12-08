import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Property } from '@/api/entities';
import { MapPin, Bed, Bath, Square, Calendar, Car, Waves, ArrowLeft, Heart, Share2, Youtube, Image } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import ContactForm from '../components/shared/ContactForm';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import SEOHead, { generatePropertySEO } from '../components/shared/SEOHead';

export default function ListingDetail() {
  const urlParams = new URLSearchParams(window.location.search);
  const propertyId = urlParams.get('id');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const { data: property, isLoading } = useQuery({
    queryKey: ['property', propertyId],
    queryFn: async () => {
      const properties = await Property.filter({ id: propertyId });
      return properties[0];
    },
    enabled: !!propertyId
  });

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold mb-4">Property not found</h1>
          <Link to={createPageUrl('Listings')}>
            <Button>Back to Listings</Button>
          </Link>
        </div>
      </div>
    );
  }

  const images = property.images || ['https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=1920&q=80'];
  const formatPrice = (price) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(price);
  const seo = generatePropertySEO(property);

  return (
    <div className="min-h-screen bg-slate-50">
      <SEOHead 
        title={seo.title}
        description={seo.description}
        keywords={seo.keywords}
        canonicalUrl={`${window.location.origin}/ListingDetail?id=${property.id}`}
        ogImage={seo.ogImage}
      />
      {/* Back Button */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4">
          <Link to={createPageUrl('Listings')}>
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Listings
            </Button>
          </Link>
        </div>
      </div>

      {/* Image Gallery */}
      <div className="bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="relative h-[60vh] min-h-[500px]">
            <img
              src={images[currentImageIndex]}
              alt={`${property.title} - ${property.beds} bedroom ${property.property_type} for sale in ${property.city}, ${property.state} - Photo ${currentImageIndex + 1}`}
              className="w-full h-full object-cover"
            />
            
            {images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentImageIndex ? 'bg-white w-8' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header */}
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-4xl font-semibold text-slate-900 mb-2">
                    {property.title}
                  </h1>
                  <div className="flex items-center text-slate-600 text-lg">
                    <MapPin className="h-5 w-5 mr-2" />
                    {property.address}, {property.city}, {property.state} {property.zip}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-bold text-amber-600 mb-2">
                    {formatPrice(property.price)}
                  </div>
                  <Badge variant="outline">{property.status}</Badge>
                </div>
              </div>

              {/* Key Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div className="bg-white rounded-xl p-4 border border-slate-200">
                  <Bed className="h-6 w-6 text-slate-400 mb-2" />
                  <div className="text-2xl font-semibold text-slate-900">{property.beds}</div>
                  <div className="text-sm text-slate-600">Bedrooms</div>
                </div>
                <div className="bg-white rounded-xl p-4 border border-slate-200">
                  <Bath className="h-6 w-6 text-slate-400 mb-2" />
                  <div className="text-2xl font-semibold text-slate-900">{property.baths}</div>
                  <div className="text-sm text-slate-600">Bathrooms</div>
                </div>
                <div className="bg-white rounded-xl p-4 border border-slate-200">
                  <Square className="h-6 w-6 text-slate-400 mb-2" />
                  <div className="text-2xl font-semibold text-slate-900">{property.sqft?.toLocaleString()}</div>
                  <div className="text-sm text-slate-600">Sq Ft</div>
                </div>
                <div className="bg-white rounded-xl p-4 border border-slate-200">
                  <Car className="h-6 w-6 text-slate-400 mb-2" />
                  <div className="text-2xl font-semibold text-slate-900">{property.garage || 0}</div>
                  <div className="text-sm text-slate-600">Garage</div>
                </div>
              </div>
            </div>

            {/* YouTube Video Tour */}
            {property.youtube_url && (
              <Card className="p-6">
                <h2 className="text-2xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <Youtube className="h-6 w-6 text-red-600" />
                  Video Tour
                </h2>
                <div className="aspect-video rounded-lg overflow-hidden">
                  <iframe
                    src={property.youtube_url.replace('watch?v=', 'embed/').replace('youtu.be/', 'youtube.com/embed/')}
                    title="Property Video Tour"
                    className="w-full h-full"
                    allowFullScreen
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  />
                </div>
              </Card>
            )}

            {/* Photo Gallery */}
            {images.length > 0 && (
              <Card className="p-6">
                <h2 className="text-2xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <Image className="h-6 w-6 text-amber-600" />
                  Photo Gallery
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {images.map((img, index) => (
                    <div 
                      key={index} 
                      className="aspect-video rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={() => setCurrentImageIndex(index)}
                    >
                      <img
                        src={img}
                        alt={`${property.title} in ${property.city} - ${property.property_type} interior/exterior view ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Description */}
            <Card className="p-6">
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">About This Property</h2>
              <p className="text-slate-700 leading-relaxed whitespace-pre-line">
                {property.description || 'No description available.'}
              </p>
            </Card>

            {/* Features */}
            {property.features && property.features.length > 0 && (
              <Card className="p-6">
                <h2 className="text-2xl font-semibold text-slate-900 mb-4">Features & Amenities</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {property.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-amber-500 rounded-full" />
                      <span className="text-slate-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Property Details */}
            <Card className="p-6">
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">Property Details</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-slate-500 mb-1">Property Type</div>
                  <div className="font-medium text-slate-900">{property.property_type}</div>
                </div>
                {property.year_built && (
                  <div>
                    <div className="text-sm text-slate-500 mb-1">Year Built</div>
                    <div className="font-medium text-slate-900">{property.year_built}</div>
                  </div>
                )}
                {property.lot_size && (
                  <div>
                    <div className="text-sm text-slate-500 mb-1">Lot Size</div>
                    <div className="font-medium text-slate-900">{property.lot_size} acres</div>
                  </div>
                )}
                {property.hoa_fee && (
                  <div>
                    <div className="text-sm text-slate-500 mb-1">HOA Fee</div>
                    <div className="font-medium text-slate-900">${property.hoa_fee}/month</div>
                  </div>
                )}
                {property.pool && (
                  <div>
                    <div className="text-sm text-slate-500 mb-1">Pool</div>
                    <div className="font-medium text-slate-900 flex items-center gap-2">
                      <Waves className="h-4 w-4 text-blue-500" />
                      Yes
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Contact Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <Card className="p-6 shadow-xl">
                <h3 className="text-2xl font-semibold text-slate-900 mb-6">
                  Interested in this property?
                </h3>
                <ContactForm 
                  propertyId={property.id}
                  defaultInterest="Schedule Tour"
                />
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}