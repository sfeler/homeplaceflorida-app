import React from 'react';
import { Award, Users, TrendingUp, Heart, Target, Shield } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { createPageUrl } from '@/utils';
import { Link } from 'react-router-dom';

const values = [
  {
    icon: Target,
    title: 'Client-Focused',
    description: 'Your goals are our priority. We tailor our approach to your unique needs and timeline.'
  },
  {
    icon: Shield,
    title: 'Trust & Integrity',
    description: 'Transparent communication and ethical practices in every transaction.'
  },
  {
    icon: TrendingUp,
    title: 'Market Expertise',
    description: 'Deep knowledge of Pinellas County neighborhoods, trends, and opportunities.'
  },
  {
    icon: Heart,
    title: 'Community Commitment',
    description: 'Proud to serve and give back to the communities we call home.'
  }
];

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero */}
      <div className="relative h-[50vh] min-h-[400px] bg-slate-900">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920&q=80')"
          }}
        />
        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full">
            <div className="max-w-3xl">
              <div className="inline-block mb-4 px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-full">
                <span className="text-amber-400 text-sm font-medium tracking-wide">ABOUT HOMEPLACE FLORIDA</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-semibold text-white mb-4">
                Your Trusted Partner in Pinellas County Real Estate
              </h1>
              <p className="text-xl text-gray-300">
                Delivering exceptional results through local expertise, innovation, and personalized service since 2010
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-slate-900 mb-2">500+</div>
              <div className="text-slate-600">Homes Sold</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-slate-900 mb-2">$150M+</div>
              <div className="text-slate-600">Sales Volume</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-slate-900 mb-2">98%</div>
              <div className="text-slate-600">Client Satisfaction</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-slate-900 mb-2">13+</div>
              <div className="text-slate-600">Years Experience</div>
            </div>
          </div>
        </div>
      </div>

      {/* Our Story */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <h2 className="text-4xl font-semibold text-slate-900 mb-6">Our Story</h2>
            <div className="space-y-4 text-slate-700 leading-relaxed text-lg">
              <p>
                Founded in 2010, HomePlace Florida was born from a simple belief: real estate transactions should be 
                transparent, efficient, and tailored to each client's unique journey.
              </p>
              <p>
                What started as a small boutique firm has grown into one of Pinellas County's most trusted 
                real estate teams, known for our deep local expertise, innovative marketing, and unwavering 
                commitment to client success.
              </p>
              <p>
                Today, we're proud to serve buyers and sellers across St. Petersburg, Clearwater, and the 
                surrounding communities, combining cutting-edge technology with the personal touch that makes 
                all the difference.
              </p>
            </div>
          </div>
          <div className="rounded-2xl overflow-hidden shadow-2xl">
            <img 
              src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80"
              alt="Beautiful home"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Values */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-semibold text-slate-900 mb-4">Our Values</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Card key={index} className="p-6 text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 rounded-2xl mb-4">
                  <value.icon className="h-8 w-8 text-amber-600" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">{value.title}</h3>
                <p className="text-slate-600">{value.description}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-semibold text-white mb-4">
            Ready to Work Together?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Whether you're buying, selling, or just exploring, we're here to help make your real estate journey smooth and successful.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={createPageUrl('Listings')}>
              <Button size="lg" className="bg-amber-500 hover:bg-amber-600 text-slate-900 px-8 h-14 rounded-full font-semibold">
                Browse Listings
              </Button>
            </Link>
            <Link to={createPageUrl('Contact')}>
              <Button size="lg" className="border-2 border-white bg-transparent text-white hover:bg-white hover:text-slate-900 px-8 h-14 rounded-full font-semibold">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}