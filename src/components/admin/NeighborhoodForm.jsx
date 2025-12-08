import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Neighborhood } from '@/api/entities';
import { UploadFile } from '@/api/integrations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { X, Upload, Loader2, Plus, Youtube, Image as ImageIcon } from 'lucide-react';

export default function NeighborhoodForm({ neighborhood, onClose }) {
  const [formData, setFormData] = useState({
    name: neighborhood?.name || '',
    slug: neighborhood?.slug || '',
    state: neighborhood?.state || 'FL',
    description: neighborhood?.description || '',
    short_description: neighborhood?.short_description || '',
    hero_image: neighborhood?.hero_image || '',
    gallery_images: neighborhood?.gallery_images || [],
    youtube_url: neighborhood?.youtube_url || '',
    highlights: neighborhood?.highlights || [],
    avg_home_price: neighborhood?.avg_home_price || '',
    population: neighborhood?.population || '',
    school_rating: neighborhood?.school_rating || '',
    walkability_score: neighborhood?.walkability_score || '',
    published: neighborhood?.published ?? true,
    featured: neighborhood?.featured ?? false
  });

  const [newHighlight, setNewHighlight] = useState('');
  const [uploadingHero, setUploadingHero] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data) => {
      const payload = {
        ...data,
        avg_home_price: data.avg_home_price ? Number(data.avg_home_price) : null,
        walkability_score: data.walkability_score ? Number(data.walkability_score) : null
      };
      
      if (neighborhood) {
        return Neighborhood.update(neighborhood.id, payload);
      }
      return Neighborhood.create(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-neighborhoods']);
      onClose();
    }
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const generateSlug = () => {
    const slug = formData.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    handleChange('slug', slug);
  };

  const handleHeroUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingHero(true);
    try {
      const { file_url } = await UploadFile({ file });
      handleChange('hero_image', file_url);
    } catch (err) {
      console.error('Upload failed:', err);
    } finally {
      setUploadingHero(false);
    }
  };

  const handleGalleryUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploadingGallery(true);
    try {
      const uploads = await Promise.all(
        files.map(file => UploadFile({ file }))
      );
      const newUrls = uploads.map(u => u.file_url);
      handleChange('gallery_images', [...formData.gallery_images, ...newUrls]);
    } catch (err) {
      console.error('Upload failed:', err);
    } finally {
      setUploadingGallery(false);
    }
  };

  const removeGalleryImage = (index) => {
    const updated = formData.gallery_images.filter((_, i) => i !== index);
    handleChange('gallery_images', updated);
  };

  const addHighlight = () => {
    if (newHighlight.trim()) {
      handleChange('highlights', [...formData.highlights, newHighlight.trim()]);
      setNewHighlight('');
    }
  };

  const removeHighlight = (index) => {
    const updated = formData.highlights.filter((_, i) => i !== index);
    handleChange('highlights', updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Neighborhood Name *</Label>
          <Input
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="e.g., Clearwater"
            required
          />
        </div>
        <div className="space-y-2">
          <Label>URL Slug *</Label>
          <div className="flex gap-2">
            <Input
              value={formData.slug}
              onChange={(e) => handleChange('slug', e.target.value)}
              placeholder="e.g., clearwater"
              required
            />
            <Button type="button" variant="outline" onClick={generateSlug}>
              Generate
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>State</Label>
          <Input
            value={formData.state}
            onChange={(e) => handleChange('state', e.target.value)}
            placeholder="FL"
          />
        </div>
        <div className="space-y-2">
          <Label>Average Home Price</Label>
          <Input
            type="number"
            value={formData.avg_home_price}
            onChange={(e) => handleChange('avg_home_price', e.target.value)}
            placeholder="450000"
          />
        </div>
      </div>

      {/* Short Description */}
      <div className="space-y-2">
        <Label>Short Description</Label>
        <Input
          value={formData.short_description}
          onChange={(e) => handleChange('short_description', e.target.value)}
          placeholder="A brief tagline about this neighborhood"
        />
      </div>

      {/* Full Description */}
      <div className="space-y-2">
        <Label>Full Description *</Label>
        <Textarea
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="Detailed description of the neighborhood..."
          rows={4}
          required
        />
      </div>

      {/* Hero Image */}
      <div className="space-y-2">
        <Label>Hero Image</Label>
        <div className="flex gap-4 items-start">
          {formData.hero_image ? (
            <div className="relative">
              <img 
                src={formData.hero_image} 
                alt="Hero preview" 
                className="w-40 h-24 object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={() => handleChange('hero_image', '')}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ) : (
            <label className="w-40 h-24 border-2 border-dashed border-slate-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-amber-500 transition-colors">
              {uploadingHero ? (
                <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
              ) : (
                <>
                  <Upload className="h-6 w-6 text-slate-400" />
                  <span className="text-xs text-slate-500 mt-1">Upload Hero</span>
                </>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleHeroUpload}
                className="hidden"
              />
            </label>
          )}
        </div>
      </div>

      {/* Gallery Images */}
      <div className="space-y-2">
        <Label>Gallery Images</Label>
        <div className="flex flex-wrap gap-3">
          {formData.gallery_images.map((img, idx) => (
            <div key={idx} className="relative">
              <img 
                src={img} 
                alt={`Gallery ${idx + 1}`} 
                className="w-24 h-24 object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={() => removeGalleryImage(idx)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
          <label className="w-24 h-24 border-2 border-dashed border-slate-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-amber-500 transition-colors">
            {uploadingGallery ? (
              <Loader2 className="h-5 w-5 animate-spin text-slate-400" />
            ) : (
              <>
                <ImageIcon className="h-5 w-5 text-slate-400" />
                <span className="text-xs text-slate-500 mt-1">Add</span>
              </>
            )}
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleGalleryUpload}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* YouTube URL */}
      <div className="space-y-2">
        <Label className="flex items-center gap-2">
          <Youtube className="h-4 w-4 text-red-500" />
          YouTube Video URL
        </Label>
        <Input
          value={formData.youtube_url}
          onChange={(e) => handleChange('youtube_url', e.target.value)}
          placeholder="https://www.youtube.com/watch?v=..."
        />
      </div>

      {/* Highlights */}
      <div className="space-y-2">
        <Label>Highlights</Label>
        <div className="flex flex-wrap gap-2 mb-2">
          {formData.highlights.map((highlight, idx) => (
            <span
              key={idx}
              className="bg-slate-100 px-3 py-1 rounded-full text-sm flex items-center gap-2"
            >
              {highlight}
              <button
                type="button"
                onClick={() => removeHighlight(idx)}
                className="text-slate-400 hover:text-red-500"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            value={newHighlight}
            onChange={(e) => setNewHighlight(e.target.value)}
            placeholder="Add a highlight..."
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addHighlight())}
          />
          <Button type="button" variant="outline" onClick={addHighlight}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>Population</Label>
          <Input
            value={formData.population}
            onChange={(e) => handleChange('population', e.target.value)}
            placeholder="e.g., 115,000"
          />
        </div>
        <div className="space-y-2">
          <Label>School Rating</Label>
          <Input
            value={formData.school_rating}
            onChange={(e) => handleChange('school_rating', e.target.value)}
            placeholder="e.g., A+"
          />
        </div>
        <div className="space-y-2">
          <Label>Walkability Score (0-100)</Label>
          <Input
            type="number"
            min="0"
            max="100"
            value={formData.walkability_score}
            onChange={(e) => handleChange('walkability_score', e.target.value)}
            placeholder="75"
          />
        </div>
      </div>

      {/* Toggles */}
      <div className="flex gap-8 pt-4 border-t">
        <div className="flex items-center gap-3">
          <Switch
            checked={formData.published}
            onCheckedChange={(val) => handleChange('published', val)}
          />
          <Label>Published</Label>
        </div>
        <div className="flex items-center gap-3">
          <Switch
            checked={formData.featured}
            onCheckedChange={(val) => handleChange('featured', val)}
          />
          <Label>Featured</Label>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button 
          type="submit" 
          className="bg-amber-500 hover:bg-amber-600 text-slate-900"
          disabled={mutation.isPending}
        >
          {mutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          {neighborhood ? 'Update Neighborhood' : 'Create Neighborhood'}
        </Button>
      </div>
    </form>
  );
}