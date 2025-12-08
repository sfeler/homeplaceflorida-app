import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ContactSubmission } from '@/api/entities';
import { Search, Mail, Phone, Check, Trash2, Eye } from 'lucide-react';
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

export default function ContactsManager({ contacts }) {
  const [search, setSearch] = useState('');
  const [viewContact, setViewContact] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const queryClient = useQueryClient();

  const markRespondedMutation = useMutation({
    mutationFn: (id) => ContactSubmission.update(id, { responded: true }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-contacts'] })
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => ContactSubmission.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-contacts'] });
      setDeleteId(null);
    }
  });

  const filteredContacts = contacts.filter(c =>
    c.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.email?.toLowerCase().includes(search.toLowerCase()) ||
    c.interest?.toLowerCase().includes(search.toLowerCase())
  );

  const interestColors = {
    'Buy': 'bg-green-100 text-green-800',
    'Sell': 'bg-blue-100 text-blue-800',
    'General Inquiry': 'bg-slate-100 text-slate-800',
    'Schedule Tour': 'bg-purple-100 text-purple-800'
  };

  return (
    <Card className="p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search contacts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="px-3 py-1">
            {contacts.filter(c => !c.responded).length} Pending
          </Badge>
          <Badge variant="outline" className="px-3 py-1">
            {contacts.length} Total
          </Badge>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b text-left">
              <th className="pb-3 font-medium text-slate-600">Contact</th>
              <th className="pb-3 font-medium text-slate-600">Interest</th>
              <th className="pb-3 font-medium text-slate-600">Date</th>
              <th className="pb-3 font-medium text-slate-600">Status</th>
              <th className="pb-3 font-medium text-slate-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredContacts.map((contact) => (
              <tr key={contact.id} className="border-b last:border-0">
                <td className="py-4">
                  <p className="font-medium text-slate-900">{contact.name}</p>
                  <p className="text-sm text-slate-500">{contact.email}</p>
                  {contact.phone && (
                    <p className="text-sm text-slate-500">{contact.phone}</p>
                  )}
                </td>
                <td className="py-4">
                  <Badge className={interestColors[contact.interest]}>
                    {contact.interest}
                  </Badge>
                </td>
                <td className="py-4 text-slate-600">
                  {new Date(contact.created_date).toLocaleDateString()}
                </td>
                <td className="py-4">
                  {contact.responded ? (
                    <Badge className="bg-green-100 text-green-800">Responded</Badge>
                  ) : (
                    <Badge className="bg-amber-100 text-amber-800">Pending</Badge>
                  )}
                </td>
                <td className="py-4">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setViewContact(contact)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    {!contact.responded && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => markRespondedMutation.mutate(contact.id)}
                        title="Mark as responded"
                      >
                        <Check className="h-4 w-4 text-green-600" />
                      </Button>
                    )}
                    <a href={`mailto:${contact.email}`}>
                      <Button variant="ghost" size="icon">
                        <Mail className="h-4 w-4" />
                      </Button>
                    </a>
                    {contact.phone && (
                      <a href={`tel:${contact.phone}`}>
                        <Button variant="ghost" size="icon">
                          <Phone className="h-4 w-4" />
                        </Button>
                      </a>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setDeleteId(contact.id)}
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

      {filteredContacts.length === 0 && (
        <p className="text-center text-slate-500 py-8">No contacts found</p>
      )}

      {/* View Contact Dialog */}
      <Dialog open={!!viewContact} onOpenChange={() => setViewContact(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Contact Details</DialogTitle>
          </DialogHeader>
          {viewContact && (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-slate-500">Name</p>
                <p className="font-medium">{viewContact.name}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Email</p>
                <p className="font-medium">{viewContact.email}</p>
              </div>
              {viewContact.phone && (
                <div>
                  <p className="text-sm text-slate-500">Phone</p>
                  <p className="font-medium">{viewContact.phone}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-slate-500">Interest</p>
                <Badge className={interestColors[viewContact.interest]}>
                  {viewContact.interest}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-slate-500">Message</p>
                <p className="bg-slate-50 p-3 rounded-lg whitespace-pre-wrap">
                  {viewContact.message}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Submitted</p>
                <p>{new Date(viewContact.created_date).toLocaleString()}</p>
              </div>
              <div className="flex gap-2 pt-4">
                <a href={`mailto:${viewContact.email}`} className="flex-1">
                  <Button className="w-full">
                    <Mail className="h-4 w-4 mr-2" />
                    Send Email
                  </Button>
                </a>
                {!viewContact.responded && (
                  <Button 
                    variant="outline"
                    onClick={() => {
                      markRespondedMutation.mutate(viewContact.id);
                      setViewContact(null);
                    }}
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Mark Responded
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Contact?</AlertDialogTitle>
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