
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Home, Search, FileText, Phone, Info, Menu, X, Heart, User, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { User as UserEntity } from '@/api/entities';
import CrispChatLabel from '@/components/shared/CrispChatLabel';
import ChatbotWidget from '@/components/chatbot/ChatbotWidget';

export default function Layout({ children, currentPageName }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);

  React.useEffect(() => {
    UserEntity.me()
      .then(setUser)
      .catch(() => setUser(null));
  }, []);

  const navigation = [
    { name: 'Home', href: createPageUrl('Home'), icon: Home },
    { name: 'Listings', href: createPageUrl('Listings'), icon: Search },
    { name: 'Neighborhoods', href: createPageUrl('Neighborhoods'), icon: Home },
    { name: 'Blog', href: createPageUrl('Blog'), icon: FileText },
    { name: 'About', href: createPageUrl('About'), icon: Info },
    { name: 'Contact', href: createPageUrl('Contact'), icon: Phone },
  ];

  const handleLogout = async () => {
    await UserEntity.logout();
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-200">
        <nav className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo and Navigation Group */}
            <div className="flex items-center gap-10">
              <Link to={createPageUrl('Home')} className="flex items-center">
                <img 
                  src="/images/logos/HPF_Logo_Black.png" 
                  alt="HomePlace Florida" 
                  className="h-20 w-auto object-contain"
                />
              </Link>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center gap-1">
                {navigation.map((item) => (
                  <Link key={item.name} to={item.href}>
                    <Button
                      variant={currentPageName === item.name ? 'default' : 'ghost'}
                      className={
                        currentPageName === item.name
                          ? 'bg-amber-500 hover:bg-amber-600 text-slate-900 font-medium'
                          : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100 font-medium'
                      }
                    >
                      <item.icon className="h-4 w-4 mr-2" />
                      {item.name}
                    </Button>
                  </Link>
                ))}
              </div>
            </div>

            {/* User Actions */}
            <div className="hidden md:flex items-center gap-3">
              <div className="flex flex-col items-end gap-1">
                <img 
                  src="/images/logos/FutureHomeRealty_Logo.png" 
                  alt="Future Home Realty" 
                  className="h-10 w-auto object-contain max-w-[200px]"
                />
                <p className="text-xs text-slate-600">Steve Feler, Realtor, Future Home Realty</p>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-700 hover:text-slate-900"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-slate-200">
              <div className="flex flex-col gap-2">
                {navigation.map((item) => (
                  <Link key={item.name} to={item.href} onClick={() => setMobileMenuOpen(false)}>
                    <Button
                      variant={currentPageName === item.name ? 'default' : 'ghost'}
                      className={`w-full justify-start ${
                        currentPageName === item.name
                          ? 'bg-amber-500 hover:bg-amber-600 text-slate-900'
                          : 'text-slate-700 hover:text-slate-900'
                      }`}
                    >
                      <item.icon className="h-4 w-4 mr-2" />
                      {item.name}
                    </Button>
                  </Link>
                ))}

              </div>
            </div>
          )}
        </nav>
      </header>

      {/* Main Content */}
      <main>{children}</main>

      {/* Crisp Chat Label */}
      <CrispChatLabel />

      {/* Footer */}
      <footer className="bg-slate-900 text-white mt-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="md:col-span-1">
              <div className="flex flex-col items-start gap-3 mb-4">
                <img 
                  src="/images/logos/HPF_Logo_White.png" 
                  alt="HomePlace Florida" 
                  className="h-20 w-auto object-contain"
                />
                <img 
                  src="/images/logos/FutureHomeRealty_Logo_White.png" 
                  alt="Future Home Realty" 
                  className="h-10 w-auto object-contain max-w-[200px]"
                />
                <p className="text-xs text-gray-400">Steve Feler, Realtor, Future Home Realty</p>
              </div>
              <p className="text-gray-400 text-sm">
                Your trusted partner in real estate since 2005.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to={createPageUrl('Home')} className="text-gray-400 hover:text-white transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to={createPageUrl('Listings')} className="text-gray-400 hover:text-white transition-colors">
                    Buy
                  </Link>
                </li>
                <li>
                  <Link to={createPageUrl('Contact')} className="text-gray-400 hover:text-white transition-colors">
                    Sell
                  </Link>
                </li>
                <li>
                  <Link to={createPageUrl('About')} className="text-gray-400 hover:text-white transition-colors">
                    About Us
                  </Link>
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to={createPageUrl('Blog')} className="text-gray-400 hover:text-white transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    Market Reports
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    Buyer's Guide
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    Seller's Guide
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="font-semibold mb-4">Contact</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>10575 68th Ave North</li>
                <li>Suite B-2, Seminole, FL 33772</li>
                <li className="pt-2">
                  <a href="tel:7274926291" className="hover:text-white transition-colors">
                    (727) 492-6291
                  </a>
                </li>
                <li>
                  <a href="mailto:steve@homeplaceflorida.com" className="hover:text-white transition-colors">
                steve@homeplaceflorida.com
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 mt-12 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-3">
                <p>&copy; {new Date().getFullYear()} HomePlace Florida Real Estate. All rights reserved.</p>
                {user?.role === 'admin' && (
                  <Link to={createPageUrl('AdminDashboard')} className="p-1.5 hover:bg-slate-800 rounded transition-colors" title="Admin">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
                  </Link>
                )}
              </div>
              
              {/* Social Media Links */}
              <div className="flex items-center gap-4">
                <a href="https://www.facebook.com/HomePlaceFlorida" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors" aria-label="Facebook">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a href="https://www.instagram.com/homeplaceflorida/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors" aria-label="Instagram">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                <a href="https://www.youtube.com/@homeplaceflorida" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors" aria-label="YouTube">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
                <a href="https://www.tiktok.com/@homeplaceflorida" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors" aria-label="TikTok">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                  </svg>
                </a>
              </div>
              
              <div className="flex gap-6 mt-4 md:mt-0">
                <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
