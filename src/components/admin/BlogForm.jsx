import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { BlogPost } from '@/api/entities';
import { UploadFile } from '@/api/integrations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, Upload } from 'lucide-react';

export default function BlogForm({ post, onClose }) {
  const [formData, setFormData] = useState({
    title: post?.title || '',
    slug: post?.slug || '',
    excerpt: post?.excerpt || '',
    content: post?.content || '',
    cover_image: post?.cover_image || '',
    youtube_url: post?.youtube_url || '',
    category: post?.category || 'Market Updates',
    tags: post?.tags?.join(', ') || '',
    author_name: post?.author_name || '',
    author_photo: post?.author_photo || '',
    read_time: post?.read_time || 5,
    published: post?.published ?? true,
    featured: post?.featured || false
  });
  const [uploading, setUploading] = useState(false);

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data) => {
      const payload = {
        ...data,
        read_time: Number(data.read_time),
        tags: data.tags ? data.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
        slug: data.slug || data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')
      };

      if (post?.id) {
        return BlogPost.update(post.id, payload);
      }
      return BlogPost.create(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-blogs'] });
      onClose();
    }
  });

  const handleImageUpload = async (e, field) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const { file_url } = await UploadFile({ file });
    setFormData(prev => ({ ...prev, [field]: file_url }));
    setUploading(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  const generateSlug = () => {
    const slug = formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    setFormData({ ...formData, slug });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label>Title</Label>
          <Input
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            onBlur={() => !formData.slug && generateSlug()}
            required
          />
        </div>

        <div>
          <Label>Slug</Label>
          <div className="flex gap-2">
            <Input
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              placeholder="url-friendly-slug"
            />
            <Button type="button" variant="outline" onClick={generateSlug}>
              Generate
            </Button>
          </div>
        </div>

        <div>
          <Label>Category</Label>
          <Select
            value={formData.category}
            onValueChange={(v) => setFormData({ ...formData, category: v })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Market Updates">Market Updates</SelectItem>
              <SelectItem value="Buyer Tips">Buyer Tips</SelectItem>
              <SelectItem value="Seller Tips">Seller Tips</SelectItem>
              <SelectItem value="Neighborhood Spotlights">Neighborhood Spotlights</SelectItem>
              <SelectItem value="Financing">Financing</SelectItem>
              <SelectItem value="Lifestyle">Lifestyle</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Cover Image</Label>
          {formData.cover_image && (
            <img src={formData.cover_image} alt="" className="w-full h-40 object-cover rounded mb-2" />
          )}
          <label className="flex items-center justify-center gap-2 p-4 border-2 border-dashed rounded-lg cursor-pointer hover:bg-slate-50">
            {uploading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                <Upload className="h-5 w-5 text-slate-400" />
                <span className="text-sm text-slate-500">Upload Cover Image</span>
              </>
            )}
            <input 
              type="file" 
              accept="image/*" 
              onChange={(e) => handleImageUpload(e, 'cover_image')} 
              className="hidden" 
            />
          </label>
        </div>

        <div>
          <Label>YouTube Video URL</Label>
          <Input
            value={formData.youtube_url}
            onChange={(e) => setFormData({ ...formData, youtube_url: e.target.value })}
            placeholder="https://www.youtube.com/watch?v=..."
          />
        </div>

        <div>
          <Label>Excerpt</Label>
          <Textarea
            value={formData.excerpt}
            onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
            rows={2}
            required
          />
        </div>

        <div>
          <Label>Content (Markdown supported)</Label>
          <Textarea
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            rows={10}
            required
          />
        </div>

        <div>
          <Label>Tags (comma separated)</Label>
          <Input
            value={formData.tags}
            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
            placeholder="real estate, market, tips"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Author Name</Label>
            <Input
              value={formData.author_name}
              onChange={(e) => setFormData({ ...formData, author_name: e.target.value })}
            />
          </div>
          <div>
            <Label>Read Time (minutes)</Label>
            <Input
              type="number"
              value={formData.read_time}
              onChange={(e) => setFormData({ ...formData, read_time: e.target.value })}
            />
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Switch
              checked={formData.published}
              onCheckedChange={(v) => setFormData({ ...formData, published: v })}
            />
            <Label>Published</Label>
          </div>
          <div className="flex items-center gap-2">
            <Switch
              checked={formData.featured}
              onCheckedChange={(v) => setFormData({ ...formData, featured: v })}
            />
            <Label>Featured</Label>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          {post ? 'Update' : 'Create'} Post
        </Button>
      </div>
    </form>
  );
}