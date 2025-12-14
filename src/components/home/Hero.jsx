import React from 'react';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { createPageUrl } from '@/utils';
import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <div className="relative h-[85vh] min-h-[600px] flex items-center">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=80')"
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-slate-900/85 to-slate-900/70" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 w-full">
        <div className="max-w-3xl">
          <div className="inline-block mb-4 px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-full">
            <span className="text-amber-400 text-sm font-medium tracking-wide">CLEARWATER FL, ST. PETERSBURG FL, TAMPA BAY AREA EXPERTS</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-light text-white mb-6 leading-tight tracking-tight">
            Find Your Perfect
            <span className="block font-semibold bg-gradient-to-r from-amber-400 to-amber-200 bg-clip-text text-transparent">
              Florida Home
            </span>
          </h1>
          
          <p className="text-xl text-gray-300 mb-10 leading-relaxed font-light max-w-2xl">
            Discover exceptional properties in the most sought-after neighborhoods. 
            Expert guidance, personalized service, exceptional results.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link to={createPageUrl('Listings')}>
              <Button 
                size="lg" 
                className="bg-orange-500 hover:bg-orange-600 text-white font-medium px-8 h-14 text-base rounded-full shadow-2xl shadow-orange-500/20 transition-all hover:shadow-orange-500/30 hover:scale-105"
              >
                <Search className="mr-2 h-5 w-5" />
                View Featured Homes
              </Button>
            </Link>
            
            <Link to={createPageUrl('Contact')}>
              <Button 
                size="lg" 
                className="bg-orange-500 hover:bg-orange-600 text-white font-medium px-8 h-14 text-base rounded-full shadow-2xl shadow-orange-500/20 transition-all hover:shadow-orange-500/30 hover:scale-105"
              >
                Get Free Valuation
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-3 gap-8 max-w-lg">
            <div className="text-center sm:text-left">
              <div className="text-3xl font-semibold text-white">500+</div>
              <div className="text-sm text-gray-400 mt-1">Homes Sold</div>
            </div>
            <div className="text-center sm:text-left">
              <div className="text-3xl font-semibold text-white">$150M+</div>
              <div className="text-sm text-gray-400 mt-1">Sales Volume</div>
            </div>
            <div className="text-center sm:text-left">
              <div className="text-3xl font-semibold text-white">98%</div>
              <div className="text-sm text-gray-400 mt-1">Client Satisfaction</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <div className="w-1.5 h-3 bg-white/60 rounded-full mt-2" />
        </div>
      </div>
    </div>
  );
}