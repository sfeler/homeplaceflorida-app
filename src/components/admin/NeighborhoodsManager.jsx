import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Neighborhood } from '@/api/entities';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, Plus, Pencil, Trash2, Eye, EyeOff, Star, StarOff, MapPin 
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import NeighborhoodForm from './NeighborhoodForm';

export default function NeighborhoodsManager() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingNeighborhood, setEditingNeighborhood] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const queryClient = useQueryClient();

  const { data: neighborhoods = [], isLoading } = useQuery({
    queryKey: ['admin-neighborhoods'],
    queryFn: () => Neighborhood.list('-created_date', 100)
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => Neighborhood.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-neighborhoods']);
      setDeleteId(null);
    }
  });

  const togglePublishedMutation = useMutation({
    mutationFn: ({ id, published }) => Neighborhood.update(id, { published }),
    onSuccess: () => queryClient.invalidateQueries(['admin-neighborhoods'])
  });

  const toggleFeaturedMutation = useMutation({
    mutationFn: ({ id, featured }) => Neighborhood.update(id, { featured }),
    onSuccess: () => queryClient.invalidateQueries(['admin-neighborhoods'])
  });

  const filteredNeighborhoods = neighborhoods.filter(n =>
    n.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (neighborhood) => {
    setEditingNeighborhood(neighborhood);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingNeighborhood(null);
  };

  const formatPrice = (price) => 
    price ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(price) : 'N/A';

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex flex-col md:flex-row gap-4 justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search neighborhoods..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button onClick={() => setShowForm(true)} className="bg-amber-500 hover:bg-amber-600 text-slate-900">
            <Plus className="h-4 w-4 mr-2" />
            Add Neighborhood
          </Button>
        </div>
      </Card>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="text-left p-4 font-medium text-slate-600">Neighborhood</th>
                <th className="text-left p-4 font-medium text-slate-600">Avg. Price</th>
                <th className="text-left p-4 font-medium text-slate-600">Status</th>
                <th className="text-left p-4 font-medium text-slate-600">Images</th>
                <th className="text-right p-4 font-medium text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500">Loading...</td>
                </tr>
              ) : filteredNeighborhoods.length > 0 ? (
                filteredNeighborhoods.map((neighborhood) => (
                  <tr key={neighborhood.id} className="border-b hover:bg-slate-50">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {neighborhood.hero_image ? (
                          <img 
                            src={neighborhood.hero_image} 
                            alt={`${neighborhood.name} neighborhood`}
                            className="w-16 h-12 rounded object-cover"
                          />
                        ) : (
                          <div className="w-16 h-12 rounded bg-slate-200 flex items-center justify-center">
                            <MapPin className="h-5 w-5 text-slate-400" />
                          </div>
                        )}
                        <div>
                          <div className="font-medium text-slate-900">{neighborhood.name}</div>
                          <div className="text-sm text-slate-500">{neighborhood.state}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-slate-700">
                      {formatPrice(neighborhood.avg_home_price)}
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        {neighborhood.published ? (
                          <Badge className="bg-green-100 text-green-700">Published</Badge>
                        ) : (
                          <Badge variant="outline" className="text-slate-500">Draft</Badge>
                        )}
                        {neighborhood.featured && (
                          <Badge className="bg-amber-100 text-amber-700">Featured</Badge>
                        )}
                      </div>
                    </td>
                    <td className="p-4 text-slate-600">
                      {(neighborhood.gallery_images?.length || 0) + (neighborhood.hero_image ? 1 : 0)} images
                    </td>
                    <td className="p-4">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => togglePublishedMutation.mutate({ 
                            id: neighborhood.id, 
                            published: !neighborhood.published 
                          })}
                          title={neighborhood.published ? 'Unpublish' : 'Publish'}
                        >
                          {neighborhood.published ? (
                            <EyeOff className="h-4 w-4 text-slate-500" />
                          ) : (
                            <Eye className="h-4 w-4 text-slate-500" />
                          )}
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => toggleFeaturedMutation.mutate({ 
                            id: neighborhood.id, 
                            featured: !neighborhood.featured 
                          })}
                          title={neighborhood.featured ? 'Remove from featured' : 'Feature'}
                        >
                          {neighborhood.featured ? (
                            <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                          ) : (
                            <StarOff className="h-4 w-4 text-slate-500" />
                          )}
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleEdit(neighborhood)}
                        >
                          <Pencil className="h-4 w-4 text-slate-500" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => setDeleteId(neighborhood.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500">
                    No neighborhoods found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Form Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingNeighborhood ? 'Edit Neighborhood' : 'Add New Neighborhood'}
            </DialogTitle>
          </DialogHeader>
          <NeighborhoodForm 
            neighborhood={editingNeighborhood} 
            onClose={handleCloseForm} 
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Neighborhood?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this neighborhood profile. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteMutation.mutate(deleteId)}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}