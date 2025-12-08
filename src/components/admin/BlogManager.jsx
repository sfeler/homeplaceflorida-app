import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { BlogPost } from '@/api/entities';
import { Plus, Pencil, Trash2, Eye, EyeOff, Star, Search } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import BlogForm from './BlogForm';

export default function BlogManager({ posts }) {
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: (id) => BlogPost.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-blogs'] });
      setDeleteId(null);
    }
  });

  const togglePublishedMutation = useMutation({
    mutationFn: ({ id, published }) => BlogPost.update(id, { published }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-blogs'] })
  });

  const toggleFeaturedMutation = useMutation({
    mutationFn: ({ id, featured }) => BlogPost.update(id, { featured }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-blogs'] })
  });

  const filteredPosts = posts.filter(p =>
    p.title?.toLowerCase().includes(search.toLowerCase()) ||
    p.category?.toLowerCase().includes(search.toLowerCase())
  );

  const categoryColors = {
    'Market Updates': 'bg-blue-100 text-blue-800',
    'Buyer Tips': 'bg-green-100 text-green-800',
    'Seller Tips': 'bg-purple-100 text-purple-800',
    'Neighborhood Spotlights': 'bg-amber-100 text-amber-800',
    'Financing': 'bg-pink-100 text-pink-800',
    'Lifestyle': 'bg-indigo-100 text-indigo-800'
  };

  return (
    <Card className="p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search posts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button onClick={() => { setEditingPost(null); setShowForm(true); }}>
          <Plus className="h-4 w-4 mr-2" />
          New Post
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b text-left">
              <th className="pb-3 font-medium text-slate-600">Post</th>
              <th className="pb-3 font-medium text-slate-600">Category</th>
              <th className="pb-3 font-medium text-slate-600">Date</th>
              <th className="pb-3 font-medium text-slate-600">Status</th>
              <th className="pb-3 font-medium text-slate-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPosts.map((post) => (
              <tr key={post.id} className="border-b last:border-0">
                <td className="py-4">
                  <div className="flex items-center gap-3">
                    {post.cover_image && (
                      <img
                        src={post.cover_image}
                        alt={post.title}
                        className="w-16 h-12 object-cover rounded"
                      />
                    )}
                    <div>
                      <p className="font-medium text-slate-900">{post.title}</p>
                      <p className="text-sm text-slate-500 line-clamp-1">{post.excerpt}</p>
                    </div>
                  </div>
                </td>
                <td className="py-4">
                  <Badge className={categoryColors[post.category]}>
                    {post.category}
                  </Badge>
                </td>
                <td className="py-4 text-slate-600">
                  {new Date(post.created_date).toLocaleDateString()}
                </td>
                <td className="py-4">
                  <div className="flex items-center gap-2">
                    {post.published ? (
                      <Badge className="bg-green-100 text-green-800">Published</Badge>
                    ) : (
                      <Badge className="bg-slate-100 text-slate-800">Draft</Badge>
                    )}
                    {post.featured && (
                      <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                    )}
                  </div>
                </td>
                <td className="py-4">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => togglePublishedMutation.mutate({
                        id: post.id,
                        published: !post.published
                      })}
                      title={post.published ? 'Unpublish' : 'Publish'}
                    >
                      {post.published ? (
                        <EyeOff className="h-4 w-4 text-slate-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-green-600" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleFeaturedMutation.mutate({
                        id: post.id,
                        featured: !post.featured
                      })}
                      title={post.featured ? 'Remove from featured' : 'Mark as featured'}
                    >
                      <Star className={`h-4 w-4 ${post.featured ? 'text-amber-500 fill-amber-500' : 'text-slate-400'}`} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => { setEditingPost(post); setShowForm(true); }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setDeleteId(post.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredPosts.length === 0 && (
        <p className="text-center text-slate-500 py-8">No blog posts found</p>
      )}

      {/* Blog Form Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingPost ? 'Edit Post' : 'New Blog Post'}
            </DialogTitle>
          </DialogHeader>
          <BlogForm
            post={editingPost}
            onClose={() => setShowForm(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Post?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 hover:bg-red-600"
              onClick={() => deleteMutation.mutate(deleteId)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}