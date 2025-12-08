import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Property } from '@/api/entities';
import PropertyCard from '../components/properties/PropertyCard';
import SearchFilters from '../components/properties/SearchFilters';
import { Skeleton } from '@/components/ui/skeleton';

export default function Listings() {
  const [filters, setFilters] = useState({
    location: '',
    minPrice: '',
    maxPrice: '',
    beds: '',
    baths: '',
    propertyType: '',
    minSqft: '',
    maxSqft: '',
    minYear: '',
    garage: '',
    amenities: []
  });

  const { data: properties, isLoading, refetch } = useQuery({
    queryKey: ['properties', filters],
    queryFn: async () => {
      let allProperties = await Property.filter({ status: 'Active' }, '-created_date', 100);
      
      // Apply filters
      return allProperties.filter(property => {
        // Location filter
        if (filters.location) {
          const location = filters.location.toLowerCase();
          const matchesCity = property.city?.toLowerCase().includes(location);
          const matchesZip = property.zip?.includes(location);
          const matchesAddress = property.address?.toLowerCase().includes(location);
          if (!matchesCity && !matchesZip && !matchesAddress) return false;
        }

        // Price filters
        if (filters.minPrice && property.price < Number(filters.minPrice)) return false;
        if (filters.maxPrice && property.price > Number(filters.maxPrice)) return false;

        // Beds filter
        if (filters.beds && property.beds < Number(filters.beds)) return false;

        // Baths filter
        if (filters.baths && property.baths < Number(filters.baths)) return false;

        // Property type filter
        if (filters.propertyType && property.property_type !== filters.propertyType) return false;

        // Square footage filters
        if (filters.minSqft && property.sqft < Number(filters.minSqft)) return false;
        if (filters.maxSqft && property.sqft > Number(filters.maxSqft)) return false;

        // Year built filter
        if (filters.minYear && property.year_built < Number(filters.minYear)) return false;

        // Garage filter
        if (filters.garage && (property.garage || 0) < Number(filters.garage)) return false;

        // Amenities filters
        if (filters.amenities && filters.amenities.length > 0) {
          if (filters.amenities.includes('pool') && !property.pool) return false;
          if (filters.amenities.includes('garage') && !property.garage) return false;
          if (filters.amenities.includes('waterfront') && !property.features?.some(f => f.toLowerCase().includes('waterfront'))) return false;
          if (filters.amenities.includes('newConstruction') && property.year_built < 2020) return false;
        }

        return true;
      });
    },
    initialData: []
  });

  const handleSearch = () => {
    refetch();
  };

  const handleReset = () => {
    setFilters({
      location: '',
      minPrice: '',
      maxPrice: '',
      beds: '',
      baths: '',
      propertyType: '',
      minSqft: '',
      maxSqft: '',
      minYear: '',
      garage: '',
      amenities: []
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <div className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-semibold mb-4">
            Homes for Sale in Pinellas County
          </h1>
          <p className="text-xl text-gray-300">
            Discover your perfect home from our exclusive listings
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-8">
              <SearchFilters
                filters={filters}
                onFilterChange={setFilters}
                onSearch={handleSearch}
                onReset={handleReset}
              />
            </div>
          </div>

          {/* Property Grid */}
          <div className="lg:col-span-3">
            <div className="mb-6">
              <p className="text-slate-600">
                {isLoading ? 'Loading...' : `${properties.length} properties found`}
              </p>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="space-y-4">
                    <Skeleton className="h-64 w-full rounded-xl" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                ))}
              </div>
            ) : properties.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {properties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">🏠</div>
                <h3 className="text-2xl font-semibold text-slate-900 mb-2">
                  No properties found
                </h3>
                <p className="text-slate-600 mb-6">
                  Try adjusting your filters to see more results
                </p>
                <button
                  onClick={handleReset}
                  className="text-amber-600 hover:text-amber-700 font-medium"
                >
                  Reset filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}