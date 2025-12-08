import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Youtube, Instagram } from 'lucide-react';

export default function SocialMedia() {
  const socialLinks = [
    {
      name: 'YouTube',
      icon: Youtube,
      url: 'https://www.youtube.com/@homeplaceflorida',
      color: 'bg-red-500 hover:bg-red-600',
      description: 'Watch our property tours, market updates, and home buying tips'
    },
    {
      name: 'TikTok',
      icon: () => (
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-8 w-8">
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
        </svg>
      ),
      url: 'https://www.tiktok.com/@homeplaceflorida',
      color: 'bg-black hover:bg-gray-800',
      description: 'Quick tips, behind-the-scenes, and trending real estate content'
    },
    {
      name: 'Instagram',
      icon: Instagram,
      url: 'https://www.instagram.com/homeplaceflorida/',
      color: 'bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 hover:from-purple-600 hover:via-pink-600 hover:to-orange-600',
      description: 'Beautiful homes, neighborhood spotlights, and daily inspiration'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <div className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-semibold mb-4">
            Follow Us on Social Media
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Stay connected with us for the latest listings, market insights, and real estate tips
          </p>
        </div>
      </div>

      {/* Social Links */}
      <div className="max-w-4xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {socialLinks.map((social) => (
            <Card key={social.name} className="p-8 text-center hover:shadow-xl transition-shadow">
              <a 
                href={social.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="block"
              >
                <div className={`w-20 h-20 ${social.color} rounded-2xl flex items-center justify-center mx-auto mb-6 text-white shadow-lg transition-transform hover:scale-110`}>
                  <social.icon className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-semibold text-slate-900 mb-3">
                  {social.name}
                </h3>
                <p className="text-slate-600 mb-6">
                  {social.description}
                </p>
                <Button className={`${social.color} text-white w-full`}>
                  Follow Us
                </Button>
              </a>
            </Card>
          ))}
        </div>

        {/* Additional CTA */}
        <div className="mt-16 text-center bg-orange-50 rounded-2xl p-8 border border-orange-100">
          <h2 className="text-2xl font-semibold text-slate-900 mb-3">
            Never Miss an Update
          </h2>
          <p className="text-slate-600 max-w-xl mx-auto">
            Follow us on all platforms to get the latest property listings, market trends, and exclusive content delivered to your feed.
          </p>
        </div>
      </div>
    </div>
  );
}