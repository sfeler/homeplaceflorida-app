import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { BlogPost } from '@/api/entities';
import BlogCard from '../components/blog/BlogCard';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import SEOHead from '../components/shared/SEOHead';

const categories = ['All', 'Market Updates', 'Buyer Tips', 'Seller Tips', 'Neighborhood Spotlights', 'Financing', 'Lifestyle'];

export default function Blog() {
  const [activeCategory, setActiveCategory] = useState('All');

  // Check if content is HTML (contains HTML tags)
  const isHTML = (content) => {
    if (!content) return false;
    const htmlRegex = /<[a-z][\s\S]*>/i;
    return htmlRegex.test(content);
  };

  // Strip HTML tags for plain text preview
  const stripHTML = (html) => {
    if (!html) return '';
    // Remove HTML tags using regex
    return html.replace(/<[^>]*>/g, '').trim();
  };

  const { data: posts, isLoading } = useQuery({
    queryKey: ['blogPosts', activeCategory],
    queryFn: async () => {
      if (activeCategory === 'All') {
        return await BlogPost.filter({ published: true }, '-created_date', 50);
      }
      return await BlogPost.filter({ published: true, category: activeCategory }, '-created_date', 50);
    },
    initialData: []
  });

  const { data: featuredPost } = useQuery({
    queryKey: ['featuredPost'],
    queryFn: async () => {
      const featured = await BlogPost.filter({ published: true, featured: true }, '-created_date', 1);
      return featured[0];
    }
  });

  const seoData = {
    title: 'Real Estate Blog | Market Insights & Home Buying Tips | HomePlace Florida',
    description: 'Expert real estate advice, market updates, and local insights from HomePlace Florida. Learn about buying and selling homes in Pinellas County, St. Petersburg, and Clearwater. Tips for first-time buyers, sellers, and investors.',
    keywords: 'Florida real estate blog, home buying tips, home selling advice, Pinellas County market updates, St Petersburg real estate news, Clearwater housing market, real estate investment tips, first time home buyer Florida',
    canonicalUrl: 'https://homeplaceflorida.com/Blog',
    ogImage: featuredPost?.cover_image || 'https://homeplaceflorida.com/images/logos/HPF_Logo_White.png',
    structuredData: {
      "@context": "https://schema.org",
      "@type": "Blog",
      "name": "HomePlace Florida Real Estate Blog",
      "description": "Expert insights, market updates, and tips for buying and selling homes in Florida",
      "url": "https://homeplaceflorida.com/Blog",
      "publisher": {
        "@type": "Organization",
        "name": "HomePlace Florida Real Estate",
        "logo": {
          "@type": "ImageObject",
          "url": "https://homeplaceflorida.com/images/logos/HPF_Logo_White.png"
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <SEOHead {...seoData} />
      {/* Header */}
      <div className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="inline-block mb-4 px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-full">
            <span className="text-amber-400 text-sm font-medium tracking-wide">INSIGHTS & EXPERTISE</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-semibold mb-4">
            Real Estate Blog
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl">
            Market insights, buying and selling tips, and local neighborhood guides from our expert team
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        {/* Featured Post */}
        {featuredPost && (
          <div className="mb-12">
            <div className="bg-gradient-to-r from-amber-500/10 to-amber-500/5 rounded-2xl p-8 md:p-12 border border-amber-500/20">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div>
                  <div className="text-amber-600 font-medium mb-2">FEATURED POST</div>
                  <h2 className="text-3xl md:text-4xl font-semibold text-slate-900 mb-4">
                    {featuredPost.title}
                  </h2>
                  {featuredPost.excerpt && (
                    <p className="text-slate-700 mb-6 text-lg">
                      {isHTML(featuredPost.excerpt) ? stripHTML(featuredPost.excerpt) : featuredPost.excerpt}
                    </p>
                  )}
                  <BlogCard post={featuredPost} />
                </div>
                <div className="rounded-xl overflow-hidden shadow-2xl">
                  <img 
                    src={featuredPost.cover_image || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80'}
                    alt={featuredPost.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Category Tabs */}
        <div className="mb-8 overflow-x-auto">
          <Tabs value={activeCategory} onValueChange={setActiveCategory}>
            <TabsList className="bg-slate-100 p-1">
              {categories.map((category) => (
                <TabsTrigger 
                  key={category} 
                  value={category}
                  className="data-[state=active]:bg-amber-500 data-[state=active]:text-slate-900"
                >
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* Posts Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-56 w-full rounded-xl" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-2xl font-semibold text-slate-900 mb-2">
              No posts found
            </h3>
            <p className="text-slate-600">
              Check back soon for new content
            </p>
          </div>
        )}
      </div>
    </div>
  );
}