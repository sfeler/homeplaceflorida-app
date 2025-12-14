import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Property } from '@/api/entities';
import PropertyCard from '../components/properties/PropertyCard';
import SearchFilters from '../components/properties/SearchFilters';
import { Skeleton } from '@/components/ui/skeleton';
import ContactForm from '../components/shared/ContactForm';
import { Card } from '@/components/ui/card';
import { Home, Mail, Phone } from 'lucide-react';

export default function Listings() {
  const [searchQuery, setSearchQuery] = useState('');
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

  // Check if there are any properties at all
  const { data: allPropertiesCount } = useQuery({
    queryKey: ['allPropertiesCount'],
    queryFn: async () => {
      const all = await Property.filter({ status: 'Active' }, null, 100);
      return all.length;
    }
  });

  const { data: properties, isLoading, refetch } = useQuery({
    queryKey: ['properties', filters, searchQuery],
    queryFn: async () => {
      // Get properties in the order they appear in JSON (respects content manager order)
      let allProperties = await Property.filter({ status: 'Active' }, null, 100);
      
      // Apply filters
      let filtered = allProperties.filter(property => {
        // General search query (searches title, address, city, description, features)
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          const searchableText = [
            property.title,
            property.address,
            property.city,
            property.state,
            property.zip,
            property.description,
            property.property_type,
            ...(property.features || [])
          ].join(' ').toLowerCase();
          
          if (!searchableText.includes(query)) return false;
        }

        // Location filter
        if (filters.location) {
          const location = filters.location.toLowerCase();
          const matchesCity = property.city?.toLowerCase().includes(location);
          const matchesZip = property.zip?.includes(location);
          const matchesAddress = property.address?.toLowerCase().includes(location);
          if (!matchesCity && !matchesZip && !matchesAddress) return false;
        }

        // Price filters
        if (filters.minPrice && filters.minPrice !== '0' && property.price < Number(filters.minPrice)) return false;
        if (filters.maxPrice && filters.maxPrice !== '999999999' && property.price > Number(filters.maxPrice)) return false;

        // Beds filter
        if (filters.beds && filters.beds !== '0' && property.beds < Number(filters.beds)) return false;

        // Baths filter
        if (filters.baths && filters.baths !== '0' && property.baths < Number(filters.baths)) return false;

        // Property type filter - handle variations
        if (filters.propertyType && filters.propertyType !== 'all') {
          const propType = property.property_type?.toLowerCase() || '';
          const filterType = filters.propertyType.toLowerCase();
          
          // Map filter values to actual property types
          const typeMap = {
            'single family': ['single family home', 'single family'],
            'condo': ['condo', 'condominium'],
            'townhouse': ['townhouse', 'town home'],
            'multi-family': ['multi-family', 'multi family'],
            'land': ['land'],
            'commercial': ['commercial']
          };
          
          const matches = typeMap[filterType]?.some(type => propType.includes(type)) || 
                         propType === filterType;
          
          if (!matches) return false;
        }

        // Square footage filters
        if (filters.minSqft && filters.minSqft !== '0' && property.sqft < Number(filters.minSqft)) return false;
        if (filters.maxSqft && filters.maxSqft !== '999999' && property.sqft > Number(filters.maxSqft)) return false;

        // Year built filter
        if (filters.minYear && filters.minYear !== '0' && property.year_built && property.year_built < Number(filters.minYear)) return false;

        // Garage filter
        if (filters.garage && filters.garage !== '0' && (property.garage || 0) < Number(filters.garage)) return false;

        // Amenities filters
        if (filters.amenities && filters.amenities.length > 0) {
          if (filters.amenities.includes('pool') && !property.pool) return false;
          if (filters.amenities.includes('garage') && (!property.garage || property.garage === 0)) return false;
          if (filters.amenities.includes('waterfront') && !property.features?.some(f => f.toLowerCase().includes('waterfront'))) return false;
          if (filters.amenities.includes('newConstruction') && (!property.year_built || property.year_built < 2020)) return false;
        }

        return true;
      });
      
      return filtered;
    },
    initialData: []
  });

  const handleSearch = () => {
    refetch();
  };

  const handleReset = () => {
    setSearchQuery('');
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
      {/* Header - Only show when there are properties or loading */}
      {!(allPropertiesCount === 0 && !isLoading) && (
        <div className="bg-slate-900 text-white py-16">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <h1 className="text-4xl md:text-5xl font-semibold mb-4">
              Homes for Sale
            </h1>
            <p className="text-xl text-gray-300">
              Discover your perfect home from our exclusive listings
            </p>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        {allPropertiesCount === 0 && !isLoading ? (
          // No properties at all - show listing invitation (no filters)
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-amber-100 mb-6">
                <Home className="h-12 w-12 text-amber-600" />
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
                Ready to List Your Property?
              </h2>
              <p className="text-xl text-slate-600 mb-2">
                We're always looking for great properties to showcase!
              </p>
              <p className="text-lg text-slate-500">
                Whether you're selling or leasing, we'd love to help you reach the right buyers and tenants.
              </p>
            </div>

            <Card className="p-8 md:p-12 bg-gradient-to-br from-white to-amber-50/30 border-2 border-amber-200/50 shadow-xl">
              <div className="mb-8">
                <h3 className="text-2xl md:text-3xl font-semibold text-slate-900 mb-4">
                  Let's Get Started
                </h3>
                <p className="text-slate-600 text-lg">
                  Fill out the form below and our team will get in touch with you today to discuss listing your property for <span className="font-semibold text-amber-600">sale or lease</span>.
                </p>
              </div>

              <ContactForm defaultInterest="List Your Property" />

              <div className="mt-8 pt-8 border-t border-slate-200">
                <div className="flex flex-col md:flex-row items-center justify-center gap-6 text-slate-600">
                  <div className="flex items-center gap-2">
                    <Phone className="h-5 w-5 text-amber-600" />
                    <span className="font-medium">(727) 492-6291</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-5 w-5 text-amber-600" />
                    <span>Contact us anytime</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Filters Sidebar */}
            <div className="lg:col-span-1">
              <div className="lg:sticky lg:top-8">
                <SearchFilters
                  filters={filters}
                  onFilterChange={setFilters}
                  onSearch={handleSearch}
                  onReset={handleReset}
                  searchQuery={searchQuery}
                  onSearchQueryChange={setSearchQuery}
                />
              </div>
            </div>

            {/* Property Grid */}
            <div className="lg:col-span-3">
              <div className="mb-6">
                <p className="text-slate-600">
                  {isLoading ? 'Loading...' : `${properties.length} properties found`}
                  {(searchQuery || Object.values(filters).some(v => v && (Array.isArray(v) ? v.length > 0 : true))) && (
                    <button
                      onClick={handleReset}
                      className="ml-3 text-amber-600 hover:text-amber-700 font-medium text-sm"
                    >
                      Clear all
                    </button>
                  )}
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
                // Properties exist but filtered out
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
        )}
      </div>
    </div>
  );
}