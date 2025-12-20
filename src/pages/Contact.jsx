import React from 'react';
import { MapPin, Phone, Mail, Clock, MessageCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import ContactForm from '../components/shared/ContactForm';
import SEOHead from '../components/shared/SEOHead';

export default function Contact() {
  const seoData = {
    title: 'Contact HomePlace Florida Real Estate | Home Place Florida | Get in Touch',
    description: 'Contact HomePlace Florida (Home Place Florida) Real Estate for expert assistance with buying or selling homes in Pinellas County. Call (727) 492-6291 or visit our Seminole office. Available Monday-Saturday with flexible appointment times.',
    keywords: 'contact HomePlace Florida, contact Home Place Florida, home placeflorida contact, homeplace florida real estate, Pinellas County realtor contact, St Petersburg real estate agent, Clearwater realtor phone, Florida real estate consultation, schedule home tour, real estate appointment',
    canonicalUrl: 'https://homeplaceflorida.com/Contact',
    ogImage: 'https://homeplaceflorida.com/images/logos/HPF_Logo_White.png',
    structuredData: {
      "@context": "https://schema.org",
      "@type": "ContactPage",
      "name": "Contact HomePlace Florida Real Estate",
      "description": "Get in touch with our expert real estate team",
      "url": "https://homeplaceflorida.com/Contact",
      "      mainEntity": {
        "@type": "RealEstateAgent",
        "name": "HomePlace Florida Real Estate",
        "alternateName": ["Home Place Florida", "Home Place Florida Real Estate", "HomePlaceFlorida"],
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
      {/* Header */}
      <div className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-semibold mb-4">
            Get in Touch
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl">
            Ready to find your dream home or sell your property? Let's start a conversation.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <MapPin className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">Office Location</h3>
                  <p className="text-slate-600">
                    10575 68th Ave North<br />
                    Suite B-2, Seminole, FL 33772
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Phone className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">Phone</h3>
                  <p className="text-slate-600">(727) 492-6291</p>
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
                  <p className="text-slate-600">steve@homeplaceflorida.com</p>
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
    </div>
  );
}