import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Property } from '@/api/entities';
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
import { Loader2, Upload, X } from 'lucide-react';

export default function PropertyForm({ property, onClose }) {
  const [formData, setFormData] = useState({
    title: property?.title || '',
    address: property?.address || '',
    city: property?.city || '',
    state: property?.state || 'FL',
    zip: property?.zip || '',
    price: property?.price || '',
    beds: property?.beds || '',
    baths: property?.baths || '',
    sqft: property?.sqft || '',
    property_type: property?.property_type || 'Single Family',
    status: property?.status || 'Active',
    description: property?.description || '',
    features: property?.features?.join(', ') || '',
    images: property?.images || [],
    youtube_url: property?.youtube_url || '',
    year_built: property?.year_built || '',
    lot_size: property?.lot_size || '',
    garage: property?.garage || '',
    pool: property?.pool || false,
    hoa_fee: property?.hoa_fee || '',
    featured: property?.featured || false
  });
  const [uploading, setUploading] = useState(false);

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data) => {
      const payload = {
        ...data,
        price: Number(data.price),
        beds: Number(data.beds),
        baths: Number(data.baths),
        sqft: data.sqft ? Number(data.sqft) : null,
        year_built: data.year_built ? Number(data.year_built) : null,
        lot_size: data.lot_size ? Number(data.lot_size) : null,
        garage: data.garage ? Number(data.garage) : null,
        hoa_fee: data.hoa_fee ? Number(data.hoa_fee) : null,
        features: data.features ? data.features.split(',').map(f => f.trim()).filter(Boolean) : [],
        youtube_url: data.youtube_url || null
      };

      if (property?.id) {
        return Property.update(property.id, payload);
      }
      return Property.create(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-properties'] });
      onClose();
    }
  });

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const { file_url } = await UploadFile({ file });
    setFormData(prev => ({ ...prev, images: [...prev.images, file_url] }));
    setUploading(false);
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <Label>Title</Label>
          <Input
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
        </div>

        <div className="md:col-span-2">
          <Label>Address</Label>
          <Input
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            required
          />
        </div>

        <div>
          <Label>City</Label>
          <Input
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label>State</Label>
            <Input
              value={formData.state}
              onChange={(e) => setFormData({ ...formData, state: e.target.value })}
            />
          </div>
          <div>
            <Label>ZIP</Label>
            <Input
              value={formData.zip}
              onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
            />
          </div>
        </div>

        <div>
          <Label>Price</Label>
          <Input
            type="number"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            required
          />
        </div>

        <div>
          <Label>Property Type</Label>
          <Select
            value={formData.property_type}
            onValueChange={(v) => setFormData({ ...formData, property_type: v })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Single Family">Single Family</SelectItem>
              <SelectItem value="Condo">Condo</SelectItem>
              <SelectItem value="Townhouse">Townhouse</SelectItem>
              <SelectItem value="Multi-Family">Multi-Family</SelectItem>
              <SelectItem value="Land">Land</SelectItem>
              <SelectItem value="Commercial">Commercial</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Status</Label>
          <Select
            value={formData.status}
            onValueChange={(v) => setFormData({ ...formData, status: v })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Sold">Sold</SelectItem>
              <SelectItem value="Off Market">Off Market</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div>
            <Label>Beds</Label>
            <Input
              type="number"
              value={formData.beds}
              onChange={(e) => setFormData({ ...formData, beds: e.target.value })}
              required
            />
          </div>
          <div>
            <Label>Baths</Label>
            <Input
              type="number"
              step="0.5"
              value={formData.baths}
              onChange={(e) => setFormData({ ...formData, baths: e.target.value })}
              required
            />
          </div>
          <div>
            <Label>Sqft</Label>
            <Input
              type="number"
              value={formData.sqft}
              onChange={(e) => setFormData({ ...formData, sqft: e.target.value })}
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div>
            <Label>Year Built</Label>
            <Input
              type="number"
              value={formData.year_built}
              onChange={(e) => setFormData({ ...formData, year_built: e.target.value })}
            />
          </div>
          <div>
            <Label>Lot (acres)</Label>
            <Input
              type="number"
              step="0.01"
              value={formData.lot_size}
              onChange={(e) => setFormData({ ...formData, lot_size: e.target.value })}
            />
          </div>
          <div>
            <Label>Garage</Label>
            <Input
              type="number"
              value={formData.garage}
              onChange={(e) => setFormData({ ...formData, garage: e.target.value })}
            />
          </div>
        </div>

        <div>
          <Label>HOA Fee ($/month)</Label>
          <Input
            type="number"
            value={formData.hoa_fee}
            onChange={(e) => setFormData({ ...formData, hoa_fee: e.target.value })}
          />
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Switch
              checked={formData.pool}
              onCheckedChange={(v) => setFormData({ ...formData, pool: v })}
            />
            <Label>Pool</Label>
          </div>
          <div className="flex items-center gap-2">
            <Switch
              checked={formData.featured}
              onCheckedChange={(v) => setFormData({ ...formData, featured: v })}
            />
            <Label>Featured</Label>
          </div>
        </div>

        <div className="md:col-span-2">
          <Label>Description</Label>
          <Textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={4}
          />
        </div>

        <div className="md:col-span-2">
          <Label>Features (comma separated)</Label>
          <Input
            value={formData.features}
            onChange={(e) => setFormData({ ...formData, features: e.target.value })}
            placeholder="Pool, Granite counters, Hardwood floors"
          />
        </div>

        <div className="md:col-span-2">
          <Label>YouTube Video Tour URL</Label>
          <Input
            value={formData.youtube_url}
            onChange={(e) => setFormData({ ...formData, youtube_url: e.target.value })}
            placeholder="https://www.youtube.com/watch?v=..."
          />
        </div>

        <div className="md:col-span-2">
          <Label>Images</Label>
          <div className="flex flex-wrap gap-2 mb-2">
            {formData.images.map((url, idx) => (
              <div key={idx} className="relative">
                <img src={url} alt="" className="w-20 h-16 object-cover rounded" />
                <button
                  type="button"
                  onClick={() => removeImage(idx)}
                  className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
          <label className="flex items-center justify-center gap-2 p-4 border-2 border-dashed rounded-lg cursor-pointer hover:bg-slate-50">
            {uploading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                <Upload className="h-5 w-5 text-slate-400" />
                <span className="text-sm text-slate-500">Upload Image</span>
              </>
            )}
            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
          </label>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          {property ? 'Update' : 'Create'} Property
        </Button>
      </div>
    </form>
  );
}