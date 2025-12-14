import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Property } from '@/api/entities';
import PropertyCard from '../properties/PropertyCard';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { createPageUrl } from '@/utils';
import { Link } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';

export default function FeaturedProperties() {
  const { data: properties, isLoading } = useQuery({
    queryKey: ['featuredProperties'],
    queryFn: () => Property.filter({ featured: true, status: 'Active' }, null, 6),
    initialData: []
  });

  return (
    <section className="py-20 bg-gradient-to-b from-white to-slate-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-block mb-4 px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-full">
            <span className="text-amber-600 text-sm font-medium tracking-wide">FEATURED LISTINGS</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-semibold text-slate-900 mb-4">
            Exceptional Properties
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Discover hand-picked homes in the most desirable locations
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-64 w-full rounded-xl" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : properties.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {properties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>

            <div className="text-center">
              <Link to={createPageUrl('Listings')}>
                <Button 
                  size="lg"
                  className="bg-slate-900 hover:bg-slate-800 text-white px-8 h-14 rounded-full"
                >
                  View All Properties
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-slate-600">No featured properties available at the moment.</p>
          </div>
        )}
      </div>
    </section>
  );
}