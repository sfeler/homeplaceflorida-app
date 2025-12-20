import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { BlogPost as BlogPostEntity } from '@/api/entities';
import { ArrowLeft, Clock, Calendar, Tag, Youtube } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import ReactMarkdown from 'react-markdown';

export default function BlogPost() {
  const urlParams = new URLSearchParams(window.location.search);
  const postId = urlParams.get('id');

  const { data: post, isLoading } = useQuery({
    queryKey: ['blogPost', postId],
    queryFn: async () => {
      const posts = await BlogPostEntity.filter({ id: postId });
      return posts[0];
    },
    enabled: !!postId
  });

  const { data: relatedPosts } = useQuery({
    queryKey: ['relatedPosts', post?.category],
    queryFn: async () => {
      if (!post) return [];
      const related = await BlogPostEntity.filter({ 
        published: true, 
        category: post.category 
      }, '-created_date', 4);
      return related.filter(p => p.id !== post.id).slice(0, 3);
    },
    enabled: !!post
  });

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold mb-4">Post not found</h1>
          <Link to={createPageUrl('Blog')}>
            <Button>Back to Blog</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Handle both base64 and URL paths for images
  const getImageSrc = (imagePath) => {
    if (!imagePath) return null;
    // If it's already a base64 string or full URL, use it directly
    if (imagePath.startsWith('data:') || imagePath.startsWith('http')) {
      return imagePath;
    }
    // Otherwise it's a relative path, use as-is
    return imagePath;
  };

  const coverImage = getImageSrc(post.featured_image || post.cover_image);
  const imagePosition = post.image_position || 'inline'; // Default to 'inline' to show images within article content

  // Check if content is HTML (contains HTML tags)
  const isHTML = (content) => {
    if (!content) return false;
    const htmlRegex = /<[a-z][\s\S]*>/i;
    return htmlRegex.test(content);
  };

  const renderContent = () => {
    if (!post.content) return null;
    
    if (isHTML(post.content)) {
      // Render HTML exactly as presented
      return (
        <div 
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      );
    } else {
      // Render markdown
      return (
        <ReactMarkdown>{post.content}</ReactMarkdown>
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Back Button */}
      <div className="bg-white border-b sticky top-20 z-40 shadow-sm">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 py-4">
          <Link to={createPageUrl('Blog')}>
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Blog
            </Button>
          </Link>
        </div>
      </div>

      {/* Cover Image - Top Position */}
      {coverImage && imagePosition === 'top' && (
        <div className="bg-black">
          <div className="max-w-5xl mx-auto">
            <div className="relative h-[60vh] min-h-[450px] mt-8">
              <img
                src={coverImage}
                alt={post.title}
                className="w-full h-full object-cover object-top opacity-90"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </div>
          </div>
        </div>
      )}

      {/* Article Content */}
      <article className={`max-w-4xl mx-auto px-6 lg:px-8 ${coverImage && imagePosition === 'top' ? 'pt-12 pb-12' : 'pt-8 pb-12'}`}>
        <div className={`bg-white rounded-2xl shadow-lg p-6 md:p-8 ${coverImage && imagePosition === 'top' ? '-mt-20 relative z-10' : ''}`}>
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-3">
              <Badge className="bg-amber-500 text-slate-900 text-xs">
                {post.category}
              </Badge>
              <div className="flex items-center text-xs text-slate-500 gap-1">
                <Clock className="h-3 w-3" />
                {post.read_time || 5} min read
              </div>
            </div>

            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4 leading-tight">
              {post.title}
            </h1>

            {/* Author & Date */}
            <div className="flex items-center gap-3 pb-4 border-b">
              {post.author_photo && (
                <img 
                  src={post.author_photo}
                  alt={post.author_name}
                  className="w-10 h-10 rounded-full object-cover"
                />
              )}
              <div>
                <div className="font-medium text-sm text-slate-900">{post.author_name || 'HomePlace Florida Team'}</div>
                <div className="text-xs text-slate-500 flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {new Date(post.created_date).toLocaleDateString('en-US', { 
                    month: 'long', 
                    day: 'numeric', 
                    year: 'numeric' 
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* YouTube Video */}
          {post.youtube_url && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <Youtube className="h-4 w-4 text-red-600" />
                Video
              </h2>
              <div className="aspect-video rounded-lg overflow-hidden">
                <iframe
                  src={post.youtube_url.replace('watch?v=', 'embed/').replace('youtu.be/', 'youtube.com/embed/')}
                  title="Video"
                  className="w-full h-full"
                  allowFullScreen
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                />
              </div>
            </div>
          )}

          {/* Content */}
          {coverImage && imagePosition === 'inline' && (
            <div className="mb-8">
              <img
                src={coverImage}
                alt={post.title}
                className="w-full h-64 md:h-80 object-cover object-top rounded-lg shadow-lg"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
          )}

          <div className={`relative ${coverImage && imagePosition === 'right' ? 'md:pr-80' : ''}`}>
            {coverImage && imagePosition === 'right' && (
              <div className="hidden md:block absolute top-0 right-0 w-72">
                <img
                  src={coverImage}
                  alt={post.title}
                  className="w-full h-64 object-cover object-top rounded-lg shadow-lg"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            )}

            <div className={`${isHTML(post.content) ? 'blog-html-content' : 'prose prose-base max-w-none'} prose-headings:text-slate-900 prose-p:text-slate-700 prose-a:text-amber-600 prose-strong:text-slate-900`}>
              {renderContent()}
            </div>
          </div>

          {/* Bottom Image */}
          {coverImage && imagePosition === 'bottom' && (
            <div className="mt-8">
              <img
                src={coverImage}
                alt={post.title}
                className="w-full h-64 md:h-80 object-cover object-top rounded-lg shadow-lg"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
          )}

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="mt-6 pt-6 border-t">
              <div className="flex items-center gap-2 flex-wrap">
                <Tag className="h-3 w-3 text-slate-400" />
                {post.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Related Posts */}
        {relatedPosts && relatedPosts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-semibold text-slate-900 mb-6">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <Link key={relatedPost.id} to={createPageUrl('BlogPost') + `?id=${relatedPost.id}`}>
                  <Card className="group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all">
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src={relatedPost.cover_image || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&q=80'}
                        alt={relatedPost.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-4">
                      <Badge variant="outline" className="text-xs mb-2">
                        {relatedPost.category}
                      </Badge>
                      <h3 className="font-semibold text-slate-900 group-hover:text-amber-600 transition-colors line-clamp-2">
                        {relatedPost.title}
                      </h3>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>
    </div>
  );
}