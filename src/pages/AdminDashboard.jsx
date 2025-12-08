import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Property, ContactSubmission, BlogPost, Neighborhood } from '@/api/entities';
import { 
  Home, Users, FileText, MessageSquare, TrendingUp, 
  DollarSign, Eye, Calendar, BarChart3, PlusCircle, Shield, MapPin
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

import PropertiesManager from '../components/admin/PropertiesManager';
import ContactsManager from '../components/admin/ContactsManager';
import BlogManager from '../components/admin/BlogManager';
import AccessControlManager from '../components/admin/AccessControlManager';
import NeighborhoodsManager from '../components/admin/NeighborhoodsManager';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  const { data: properties = [] } = useQuery({
    queryKey: ['admin-properties'],
    queryFn: () => Property.list('-created_date', 100)
  });

  const { data: contacts = [] } = useQuery({
    queryKey: ['admin-contacts'],
    queryFn: () => ContactSubmission.list('-created_date', 100)
  });

  const { data: blogPosts = [] } = useQuery({
    queryKey: ['admin-blogs'],
    queryFn: () => BlogPost.list('-created_date', 100)
  });

  const { data: neighborhoods = [] } = useQuery({
    queryKey: ['admin-neighborhoods'],
    queryFn: () => Neighborhood.list('-created_date', 100)
  });

  const stats = [
    {
      title: 'Total Listings',
      value: properties.length,
      icon: Home,
      color: 'bg-blue-500',
      subtext: `${properties.filter(p => p.status === 'Active').length} active`
    },
    {
      title: 'Total Value',
      value: `$${(properties.reduce((sum, p) => sum + (p.price || 0), 0) / 1000000).toFixed(1)}M`,
      icon: DollarSign,
      color: 'bg-green-500',
      subtext: 'Portfolio value'
    },
    {
      title: 'Inquiries',
      value: contacts.length,
      icon: MessageSquare,
      color: 'bg-amber-500',
      subtext: `${contacts.filter(c => !c.responded).length} pending`
    },
    {
      title: 'Blog Posts',
      value: blogPosts.length,
      icon: FileText,
      color: 'bg-purple-500',
      subtext: `${blogPosts.filter(p => p.published).length} published`
    },
    {
      title: 'Neighborhoods',
      value: neighborhoods.length,
      icon: MapPin,
      color: 'bg-teal-500',
      subtext: `${neighborhoods.filter(n => n.published).length} published`
    }
  ];

  const recentContacts = contacts.slice(0, 5);
  const featuredProperties = properties.filter(p => p.featured).slice(0, 5);

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header */}
      <div className="bg-slate-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <h1 className="text-3xl font-semibold">Admin Dashboard</h1>
          <p className="text-slate-400 mt-1">Manage your properties, contacts, and content</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, idx) => (
            <Card key={idx} className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-slate-500">{stat.title}</p>
                  <p className="text-3xl font-bold text-slate-900 mt-1">{stat.value}</p>
                  <p className="text-xs text-slate-400 mt-1">{stat.subtext}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-xl`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="properties">Properties</TabsTrigger>
            <TabsTrigger value="contacts">Contacts</TabsTrigger>
            <TabsTrigger value="blog">Blog</TabsTrigger>
            <TabsTrigger value="neighborhoods" className="gap-2">
              <MapPin className="h-4 w-4" />
              Neighborhoods
            </TabsTrigger>
            <TabsTrigger value="access" className="gap-2">
              <Shield className="h-4 w-4" />
              Access Control
            </TabsTrigger>
            </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Inquiries */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-slate-900">Recent Inquiries</h3>
                  <Button variant="ghost" size="sm" onClick={() => setActiveTab('contacts')}>
                    View All
                  </Button>
                </div>
                <div className="space-y-3">
                  {recentContacts.length > 0 ? recentContacts.map((contact) => (
                    <div key={contact.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div>
                        <p className="font-medium text-slate-900">{contact.name}</p>
                        <p className="text-sm text-slate-500">{contact.interest}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-slate-400">
                          {new Date(contact.created_date).toLocaleDateString()}
                        </p>
                        {!contact.responded && (
                          <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                            Pending
                          </span>
                        )}
                      </div>
                    </div>
                  )) : (
                    <p className="text-slate-500 text-center py-4">No inquiries yet</p>
                  )}
                </div>
              </Card>

              {/* Featured Properties */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-slate-900">Featured Properties</h3>
                  <Button variant="ghost" size="sm" onClick={() => setActiveTab('properties')}>
                    View All
                  </Button>
                </div>
                <div className="space-y-3">
                  {featuredProperties.length > 0 ? featuredProperties.map((property) => (
                    <div key={property.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                      {property.images?.[0] && (
                        <img 
                          src={property.images[0]} 
                          alt={property.title}
                          className="w-16 h-12 object-cover rounded"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-slate-900 truncate">{property.title}</p>
                        <p className="text-sm text-slate-500">{property.city}</p>
                      </div>
                      <p className="font-semibold text-amber-600">
                        ${(property.price / 1000).toFixed(0)}K
                      </p>
                    </div>
                  )) : (
                    <p className="text-slate-500 text-center py-4">No featured properties</p>
                  )}
                </div>
              </Card>

              {/* Property Status Breakdown */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Listing Status</h3>
                <div className="space-y-3">
                  {['Active', 'Pending', 'Sold', 'Off Market'].map((status) => {
                    const count = properties.filter(p => p.status === status).length;
                    const percent = properties.length > 0 ? (count / properties.length) * 100 : 0;
                    return (
                      <div key={status}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-slate-600">{status}</span>
                          <span className="font-medium">{count}</span>
                        </div>
                        <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${
                              status === 'Active' ? 'bg-green-500' :
                              status === 'Pending' ? 'bg-amber-500' :
                              status === 'Sold' ? 'bg-blue-500' : 'bg-slate-400'
                            }`}
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>

              {/* Quick Actions */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 gap-3">
                  <Button 
                    className="h-auto py-4 flex flex-col gap-2"
                    onClick={() => setActiveTab('properties')}
                  >
                    <PlusCircle className="h-5 w-5" />
                    <span>Add Property</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-auto py-4 flex flex-col gap-2"
                    onClick={() => setActiveTab('blog')}
                  >
                    <FileText className="h-5 w-5" />
                    <span>New Blog Post</span>
                  </Button>
                  <Link to={createPageUrl('Listings')} className="col-span-2">
                    <Button variant="outline" className="w-full">
                      <Eye className="h-4 w-4 mr-2" />
                      View Public Site
                    </Button>
                  </Link>
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* Properties Tab */}
          <TabsContent value="properties">
            <PropertiesManager properties={properties} />
          </TabsContent>

          {/* Contacts Tab */}
          <TabsContent value="contacts">
            <ContactsManager contacts={contacts} />
          </TabsContent>

          {/* Blog Tab */}
          <TabsContent value="blog">
            <BlogManager posts={blogPosts} />
          </TabsContent>

          {/* Neighborhoods Tab */}
          <TabsContent value="neighborhoods">
            <NeighborhoodsManager />
          </TabsContent>

          {/* Access Control Tab */}
          <TabsContent value="access">
            <AccessControlManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}