import React from 'react';
import Hero from '../components/home/Hero';
import FeaturedProperties from '../components/home/FeaturedProperties';
import Testimonials from '../components/home/Testimonials';
import { Building2, TrendingUp, Award, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { createPageUrl } from '@/utils';
import { Link } from 'react-router-dom';
import SEOHead from '../components/shared/SEOHead';

export default function Home() {
  const seoData = {
    title: 'HomePlace Florida Real Estate | Home Place Florida | Homes for Sale in Pinellas County, FL',
    description: 'Find your dream home in Florida with HomePlace Florida (Home Place Florida) Real Estate. Browse homes for sale in St. Petersburg, Clearwater, and Pinellas County. Expert local realtors with 13+ years experience and $150M+ in sales.',
    keywords: 'HomePlace Florida, Home Place Florida, home placeflorida, homeplace florida real estate, home place florida real estate, Florida real estate, homes for sale Florida, Pinellas County homes, St Petersburg real estate, Clearwater homes, Tampa Bay real estate, buy home Florida, Florida realtors, real estate agent Florida',
    canonicalUrl: 'https://homeplaceflorida.com/',
    ogImage: 'https://homeplaceflorida.com/images/logos/HPF_Logo_White.png',
    structuredData: {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "HomePlace Florida Real Estate",
      "alternateName": ["Home Place Florida", "Home Place Florida Real Estate", "HomePlaceFlorida"],
      "url": "https://homeplaceflorida.com",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://homeplaceflorida.com/Listings?search={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    }
  };

  return (
    <div className="min-h-screen">
      <SEOHead {...seoData} />
      <Hero />
      
      <FeaturedProperties />

      {/* Why Choose Us */}
      <section className="py-20 bg-white" aria-labelledby="why-choose-us">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 id="why-choose-us" className="text-4xl md:text-5xl font-semibold text-slate-900 mb-4">
              Why Choose HomePlace Florida
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Local expertise, cutting-edge technology, and personalized service
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 rounded-2xl mb-4">
                <Building2 className="h-8 w-8 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Local Expertise</h3>
              <p className="text-slate-600">
                Deep knowledge of Pinellas County neighborhoods and market trends
              </p>
            </div>

            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-2xl mb-4">
                <TrendingUp className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Proven Results</h3>
              <p className="text-slate-600">
                $150M+ in sales volume with homes selling 20% faster than market average
              </p>
            </div>

            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-2xl mb-4">
                <Award className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Award-Winning</h3>
              <p className="text-slate-600">
                Recognized for excellence in customer service and market innovation
              </p>
            </div>

            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-2xl mb-4">
                <Users className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Client-First</h3>
              <p className="text-slate-600">
                98% client satisfaction with personalized guidance every step of the way
              </p>
            </div>
          </div>
        </div>
      </section>



      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" aria-labelledby="cta-heading">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 id="cta-heading" className="text-4xl md:text-5xl font-semibold text-white mb-6">
            Ready to Find Your Dream Home?
          </h2>
          <p className="text-xl text-gray-300 mb-10">
            Let's start your journey today. Our expert team is here to guide you every step of the way.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={createPageUrl('Listings')}>
              <Button size="lg" className="bg-amber-500 hover:bg-amber-600 text-slate-900 px-8 h-14 rounded-full font-semibold">
                Browse Properties
              </Button>
            </Link>
            <Link to={createPageUrl('Contact')}>
              <Button size="lg" className="bg-white text-slate-900 hover:bg-slate-100 px-8 h-14 rounded-full font-semibold">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}