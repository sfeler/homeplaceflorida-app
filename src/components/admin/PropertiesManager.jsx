import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Property } from '@/api/entities';
import { Plus, Pencil, Trash2, Star, StarOff, Search } from 'lucide-react';
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
import PropertyForm from './PropertyForm';

export default function PropertiesManager({ properties }) {
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: (id) => Property.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-properties'] });
      setDeleteId(null);
    }
  });

  const toggleFeaturedMutation = useMutation({
    mutationFn: ({ id, featured }) => Property.update(id, { featured }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-properties'] })
  });

  const filteredProperties = properties.filter(p => 
    p.title?.toLowerCase().includes(search.toLowerCase()) ||
    p.city?.toLowerCase().includes(search.toLowerCase()) ||
    p.address?.toLowerCase().includes(search.toLowerCase())
  );

  const statusColors = {
    'Active': 'bg-green-100 text-green-800',
    'Pending': 'bg-amber-100 text-amber-800',
    'Sold': 'bg-blue-100 text-blue-800',
    'Off Market': 'bg-slate-100 text-slate-800'
  };

  return (
    <Card className="p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search properties..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button onClick={() => { setEditingProperty(null); setShowForm(true); }}>
          <Plus className="h-4 w-4 mr-2" />
          Add Property
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b text-left">
              <th className="pb-3 font-medium text-slate-600">Property</th>
              <th className="pb-3 font-medium text-slate-600">Location</th>
              <th className="pb-3 font-medium text-slate-600">Price</th>
              <th className="pb-3 font-medium text-slate-600">Status</th>
              <th className="pb-3 font-medium text-slate-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProperties.map((property) => (
              <tr key={property.id} className="border-b last:border-0">
                <td className="py-4">
                  <div className="flex items-center gap-3">
                    {property.images?.[0] && (
                      <img 
                        src={property.images[0]} 
                        alt={property.title}
                        className="w-16 h-12 object-cover rounded"
                      />
                    )}
                    <div>
                      <p className="font-medium text-slate-900">{property.title}</p>
                      <p className="text-sm text-slate-500">
                        {property.beds} bd • {property.baths} ba • {property.sqft?.toLocaleString()} sqft
                      </p>
                    </div>
                  </div>
                </td>
                <td className="py-4">
                  <p className="text-slate-900">{property.city}</p>
                  <p className="text-sm text-slate-500">{property.address}</p>
                </td>
                <td className="py-4">
                  <p className="font-semibold text-slate-900">
                    ${property.price?.toLocaleString()}
                  </p>
                </td>
                <td className="py-4">
                  <Badge className={statusColors[property.status]}>
                    {property.status}
                  </Badge>
                </td>
                <td className="py-4">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleFeaturedMutation.mutate({ 
                        id: property.id, 
                        featured: !property.featured 
                      })}
                      title={property.featured ? 'Remove from featured' : 'Add to featured'}
                    >
                      {property.featured ? (
                        <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                      ) : (
                        <StarOff className="h-4 w-4 text-slate-400" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => { setEditingProperty(property); setShowForm(true); }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setDeleteId(property.id)}
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

      {filteredProperties.length === 0 && (
        <p className="text-center text-slate-500 py-8">No properties found</p>
      )}

      {/* Property Form Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingProperty ? 'Edit Property' : 'Add New Property'}
            </DialogTitle>
          </DialogHeader>
          <PropertyForm 
            property={editingProperty} 
            onClose={() => setShowForm(false)} 
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Property?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The property will be permanently deleted.
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