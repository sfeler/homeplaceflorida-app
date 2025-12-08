import React, { useState } from 'react';
import { Heart, MapPin, Bed, Bath, Square, Calendar } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { createPageUrl } from '@/utils';
import { Link } from 'react-router-dom';
import { User, SavedProperty } from '@/api/entities';
import { useQueryClient } from '@tanstack/react-query';

export default function PropertyCard({ property, showSaveButton = true }) {
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      const user = await User.me();
      setIsLoading(true);
      
      if (isSaved) {
        // Remove from saved
        const saved = await SavedProperty.filter({
          property_id: property.id,
          user_email: user.email
        });
        if (saved.length > 0) {
          await SavedProperty.delete(saved[0].id);
        }
        setIsSaved(false);
      } else {
        // Add to saved
        await SavedProperty.create({
          property_id: property.id,
          user_email: user.email
        });
        setIsSaved(true);
      }
      
      queryClient.invalidateQueries(['savedProperties']);
    } catch (error) {
      // User not logged in - do nothing
      console.log('User not logged in');
    } finally {
      setIsLoading(false);
    }
  };

  const mainImage = property.images?.[0] || 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80';

  return (
    <Link to={createPageUrl('ListingDetail') + `?id=${property.id}`}>
      <Card className="group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-white">
        {/* Image Container */}
        <div className="relative h-64 overflow-hidden">
          <img 
            src={mainImage}
            alt={`${property.title} - ${property.beds} bed ${property.baths} bath ${property.property_type} for sale in ${property.city}, ${property.state} at ${formatPrice(property.price)}`}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
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

          {/* Save Button */}
          {showSaveButton && (
            <Button
              size="icon"
              variant="ghost"
              className="absolute top-4 right-4 bg-white/90 hover:bg-white backdrop-blur-sm rounded-full h-10 w-10"
              onClick={handleSave}
              disabled={isLoading}
            >
              <Heart className={`h-5 w-5 ${isSaved ? 'fill-red-500 text-red-500' : 'text-slate-700'}`} />
            </Button>
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
          <div className="mt-4 flex items-center justify-between">
            <Badge variant="outline" className="text-xs font-medium">
              {property.property_type}
            </Badge>
            <span className="text-xs text-slate-500">
              Updated {new Date(property.updated_date).toLocaleDateString()}
            </span>
          </div>
        </div>
      </Card>
    </Link>
  );
}