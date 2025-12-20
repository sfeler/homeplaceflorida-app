import React from 'react';
import { Clock, ArrowRight, Calendar } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { createPageUrl } from '@/utils';
import { Link } from 'react-router-dom';

export default function BlogCard({ post }) {
  // Handle both base64 and URL paths for images
  const getImageSrc = (imagePath) => {
    if (!imagePath) return 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80';
    // If it's already a base64 string or full URL, use it directly
    if (imagePath.startsWith('data:') || imagePath.startsWith('http')) {
      return imagePath;
    }
    // Otherwise it's a relative path, use as-is
    return imagePath;
  };

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

  const coverImage = getImageSrc(post.featured_image || post.cover_image);
  
  // Get excerpt - if HTML, strip tags for preview, otherwise use as-is
  const excerptText = post.excerpt 
    ? (isHTML(post.excerpt) ? stripHTML(post.excerpt) : post.excerpt)
    : '';

  return (
    <Link to={createPageUrl('BlogPost') + `?id=${post.id}`}>
      <Card className="group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-white h-full flex flex-col">
        {/* Image */}
        <div className="relative h-56 overflow-hidden">
          <img
            src={coverImage}
            alt={post.title}
            className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-700"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          
          {post.featured && (
            <Badge className="absolute top-4 left-4 bg-amber-500 text-slate-900 border-0 font-semibold">
              FEATURED
            </Badge>
          )}
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col flex-grow">
          <div className="flex items-center gap-3 mb-3">
            <Badge variant="outline" className="text-xs">
              {post.category}
            </Badge>
            <div className="flex items-center text-xs text-slate-500 gap-1">
              <Clock className="h-3 w-3" />
              <span>{post.read_time || 5} min read</span>
            </div>
          </div>

          <h3 className="text-xl font-semibold text-slate-900 mb-3 group-hover:text-amber-600 transition-colors line-clamp-2">
            {post.title}
          </h3>

          {excerptText && (
            <p className="text-slate-600 text-sm line-clamp-3 mb-4 flex-grow">
              {excerptText}
            </p>
          )}

          {/* Author & Date */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <div className="flex items-center gap-3">
              {post.author_photo && (
                <img 
                  src={post.author_photo}
                  alt={post.author_name}
                  className="w-8 h-8 rounded-full object-cover"
                />
              )}
              <div>
                <div className="text-sm font-medium text-slate-900">{post.author_name || 'HomePlace Florida Team'}</div>
                <div className="text-xs text-slate-500 flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {new Date(post.created_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </div>
              </div>
            </div>
            
            <ArrowRight className="h-5 w-5 text-amber-500 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </Card>
    </Link>
  );
}