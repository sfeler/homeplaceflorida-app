import React from 'react';
import { Phone, Mail, Clock, MessageCircle, Target, Shield, TrendingUp, Heart } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ContactForm from '../components/shared/ContactForm';
import SEOHead from '../components/shared/SEOHead';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

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

export default function Contact() {
  const seoData = {
    title: 'Contact HomePlace Florida Real Estate | Home Place Florida | About Us & Get in Touch',
    description: 'Contact HomePlace Florida (Home Place Florida) Real Estate. Since 2010, we\'ve sold 500+ homes with $150M+ in sales volume. 98% client satisfaction. Call (727) 492-6291 or visit our Seminole office. Expert local knowledge of St. Petersburg, Clearwater, and Pinellas County.',
    keywords: 'contact HomePlace Florida, about Home Place Florida, home placeflorida contact, homeplace florida real estate, Pinellas County realtor contact, St Petersburg real estate agent, Clearwater realtor, Florida real estate experts, trusted realtors Florida, real estate consultation',
    canonicalUrl: 'https://homeplaceflorida.com/Contact',
    ogImage: 'https://homeplaceflorida.com/images/logos/HPF_Logo_White.png',
    structuredData: {
      "@context": "https://schema.org",
      "@type": "ContactPage",
      "name": "Contact HomePlace Florida Real Estate",
      "description": "Get in touch with our expert real estate team and learn about our commitment to exceptional service",
      "url": "https://homeplaceflorida.com/Contact",
      "mainEntity": {
        "@type": "RealEstateAgent",
        "name": "HomePlace Florida Real Estate",
        "alternateName": ["Home Place Florida", "Home Place Florida Real Estate", "HomePlaceFlorida"],
        "foundingDate": "2010",
        "telephone": "+1-727-492-6291",
        "email": "steve@homeplaceflorida.com",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "10575 68th Ave North, Suite B-2",
          "addressLocality": "Seminole",
          "addressRegion": "FL",
          "postalCode": "33772",
          "addressCountry": "US"
        },
        "areaServed": ["St. Petersburg", "Clearwater", "Pinellas County"],
        "knowsAbout": ["Residential Real Estate", "Property Sales", "Buyer Representation", "Seller Representation"],
        "slogan": "Your Trusted Partner in Real Estate",
        "openingHoursSpecification": [
          {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
            "opens": "09:00",
            "closes": "18:00"
          },
          {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": "Saturday",
            "opens": "10:00",
            "closes": "16:00"
          }
        ]
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <SEOHead {...seoData} />
      
      {/* Hero Section */}
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
                <span className="text-amber-400 text-sm font-medium tracking-wide">ABOUT & CONTACT</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-semibold text-white mb-4">
                Your Trusted Partner in Real Estate
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

        {/* Contact Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-semibold text-slate-900 mb-4">Get in Touch</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Ready to find your dream home or sell your property? Let's start a conversation.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Information */}
            <div className="lg:col-span-1 space-y-6">
              <Card className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Phone className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">Phone</h3>
                    <a href="tel:7274926291" className="text-slate-600 hover:text-blue-600 transition-colors">
                      (727) 492-6291
                    </a>
                    <p className="text-sm text-slate-500 mt-1">Monday - Saturday</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 cursor-pointer hover:shadow-md transition-shadow" onClick={() => {
                if (window.$crisp) {
                  window.$crisp.push(['do', 'chat:open']);
                }
              }}>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="h-6 w-6 text-amber-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900 mb-1">Chat with us</h3>
                    <p className="text-slate-600">Get instant answers</p>
                    <p className="text-sm text-slate-500 mt-1">Click to start a conversation</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Mail className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">Email</h3>
                    <a href="mailto:steve@homeplaceflorida.com" className="text-slate-600 hover:text-green-600 transition-colors">
                      steve@homeplaceflorida.com
                    </a>
                    <p className="text-sm text-slate-500 mt-1">We'll respond within 24 hours</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Clock className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">Office Hours</h3>
                    <div className="text-slate-600 text-sm space-y-1">
                      <p>Monday - Friday: 9am - 6pm</p>
                      <p>Saturday: 10am - 4pm</p>
                      <p>Sunday: By appointment</p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card className="p-8 shadow-xl">
                <h2 className="text-3xl font-semibold text-slate-900 mb-2">
                  Send us a message
                </h2>
                <p className="text-slate-600 mb-8">
                  Fill out the form below and we'll get back to you as soon as possible.
                </p>
                <ContactForm />
              </Card>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-semibold text-white mb-4">
            Ready to Explore Properties?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Browse our current listings and discover your perfect home in Pinellas County.
          </p>
          <Link to={createPageUrl('Listings')}>
            <Button size="lg" className="bg-amber-500 hover:bg-amber-600 text-slate-900 px-8 h-14 rounded-full font-semibold">
              Browse Listings
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}