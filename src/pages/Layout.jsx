
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Home, Search, FileText, Phone, Info, Menu, X, Heart, User, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { User as UserEntity } from '@/api/entities';
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
    { name: 'Neighborhoods', href: createPageUrl('Neighborhood'), icon: Home },
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

      {/* Chatbot Widget */}
      <ChatbotWidget />

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
                Your trusted partner in Pinellas County real estate since 2005.
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

          <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
            <div className="flex items-center gap-3">
              <p>&copy; {new Date().getFullYear()} HomePlace Florida Real Estate. All rights reserved.</p>
              {user?.role === 'admin' && (
                <Link to={createPageUrl('AdminDashboard')} className="p-1.5 hover:bg-slate-800 rounded transition-colors" title="Admin">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
                </Link>
              )}
            </div>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
