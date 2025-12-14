import React from 'react';
import { MapPin, Bed, Bath, Square } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { createPageUrl } from '@/utils';
import { Link } from 'react-router-dom';

export default function PropertyCard({ property }) {

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Get main image - handle both base64 and URL paths
  const getImageSrc = (imagePath) => {
    if (!imagePath) return 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80';
    // If it's already a base64 string or full URL, use it directly
    if (imagePath.startsWith('data:') || imagePath.startsWith('http')) {
      return imagePath;
    }
    // Otherwise it's a relative path, use as-is
    return imagePath;
  };

  const mainImage = getImageSrc(property.images?.[0]);

  return (
    <Link to={createPageUrl('ListingDetail') + `?id=${property.id}`}>
      <Card className="group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-white">
        {/* Image Container */}
        <div className="relative h-64 overflow-hidden">
          <img 
            src={mainImage}
            alt={`${property.title} - ${property.beds} bed ${property.baths} bath ${property.property_type} for sale in ${property.city}, ${property.state} at ${formatPrice(property.price)}`}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            onError={(e) => {
              // Fallback to placeholder if image fails to load
              e.target.src = 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80';
            }}
          />
          
          {/* Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          
          {/* Status Badge */}
          {property.status && property.status !== 'Active' && (
            <Badge className="absolute top-4 left-4 bg-slate-900/90 text-white border-0 backdrop-blur-sm">
              {property.status}
            </Badge>
          )}
          
          {property.featured && (
            <Badge className="absolute top-4 left-4 bg-amber-500 text-slate-900 border-0 font-semibold">
              FEATURED
            </Badge>
          )}

          {/* Price */}
          <div className="absolute bottom-4 left-4">
            <div className="text-3xl font-semibold text-white drop-shadow-lg">
              {formatPrice(property.price)}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className="text-xl font-semibold text-slate-900 mb-2 group-hover:text-amber-600 transition-colors line-clamp-1">
            {property.title}
          </h3>
          
          <div className="flex items-center text-slate-600 mb-4">
            <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
            <span className="text-sm line-clamp-1">{property.address}, {property.city}, {property.state}</span>
          </div>

          {/* Property Details */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-2">
              <Bed className="h-4 w-4 text-slate-400" />
              <span className="text-sm font-medium text-slate-700">{property.beds} Beds</span>
            </div>
            <div className="flex items-center gap-2">
              <Bath className="h-4 w-4 text-slate-400" />
              <span className="text-sm font-medium text-slate-700">{property.baths} Baths</span>
            </div>
            <div className="flex items-center gap-2">
              <Square className="h-4 w-4 text-slate-400" />
              <span className="text-sm font-medium text-slate-700">{property.sqft?.toLocaleString()} sqft</span>
            </div>
          </div>

          {/* Property Type */}
          <div className="mt-4 flex items-center justify-between gap-4">
            <Badge variant="outline" className="text-xs font-medium">
              {property.property_type}
            </Badge>
            <span className="text-xs text-slate-500 whitespace-nowrap">
              Updated {new Date(property.updated_date).toLocaleDateString()}
            </span>
          </div>
        </div>
      </Card>
    </Link>
  );
}