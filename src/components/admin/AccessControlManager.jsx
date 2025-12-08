import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { User } from '@/api/entities';
import { SendEmail } from '@/api/integrations';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  Shield, UserPlus, Search, Pencil, Trash2, 
  Users, Home, FileText, MessageSquare, Check, X,
  Key, Mail, Loader2, Phone, Send
} from 'lucide-react';

const ROLE_OPTIONS = [
  { value: 'admin', label: 'Administrator', description: 'Full access to all features', color: 'bg-red-500' },
  { value: 'agent', label: 'Property Agent', description: 'Manage property listings', color: 'bg-blue-500' },
  { value: 'blogger', label: 'Blog Contributor', description: 'Create and edit blog posts', color: 'bg-purple-500' },
  { value: 'user', label: 'Regular User', description: 'Basic access only', color: 'bg-slate-500' }
];

const PERMISSIONS = [
  { key: 'manage_properties', label: 'Manage Properties', icon: Home, roles: ['admin', 'agent'] },
  { key: 'manage_blog', label: 'Manage Blog Posts', icon: FileText, roles: ['admin', 'blogger'] },
  { key: 'view_contacts', label: 'View Contact Submissions', icon: MessageSquare, roles: ['admin', 'agent'] },
  { key: 'manage_users', label: 'Manage Users', icon: Users, roles: ['admin'] },
];

export default function AccessControlManager() {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [deleteUser, setDeleteUser] = useState(null);
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [inviteForm, setInviteForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    role: 'user'
  });
  const [inviteSending, setInviteSending] = useState(false);
  const [inviteSuccess, setInviteSuccess] = useState(false);

  const queryClient = useQueryClient();

  const { data: users = [], isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: () => User.list('-created_date', 100)
  });

  const updateUserMutation = useMutation({
    mutationFn: ({ id, data }) => User.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      setShowEditDialog(false);
      setEditingUser(null);
    }
  });

  const filteredUsers = users.filter(user => 
    user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleInfo = (role) => ROLE_OPTIONS.find(r => r.value === role) || ROLE_OPTIONS[3];

  const getUserPermissions = (role) => {
    return PERMISSIONS.filter(p => p.roles.includes(role));
  };

  const handleEditUser = (user) => {
    setEditingUser({ ...user });
    setShowEditDialog(true);
  };

  const handleSaveUser = () => {
    if (!editingUser) return;
    updateUserMutation.mutate({
      id: editingUser.id,
      data: { role: editingUser.role, phone: editingUser.phone }
    });
  };

  const handleSendInvite = async () => {
    if (!inviteForm.email || !inviteForm.first_name || !inviteForm.last_name) return;
    
    setInviteSending(true);
    
    const roleInfo = getRoleInfo(inviteForm.role);
    const inviteLink = window.location.origin;
    
    await SendEmail({
      to: inviteForm.email,
      subject: `You're invited to join HomePlace Florida Real Estate`,
      body: `
Hello ${inviteForm.first_name} ${inviteForm.last_name},

You've been invited to join HomePlace Florida Real Estate as a ${roleInfo.label}.

To get started, click the link below to create your account:
${inviteLink}

You can sign in using your email, or through Google, Apple, or Microsoft.

Your assigned role: ${roleInfo.label}
${roleInfo.description}

If you have any questions, please contact our admin team.

Best regards,
HomePlace Florida Real Estate Team
      `.trim()
    });
    
    setInviteSending(false);
    setInviteSuccess(true);
    
    setTimeout(() => {
      setShowInviteDialog(false);
      setInviteSuccess(false);
      setInviteForm({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        role: 'user'
      });
    }, 2000);
  };

  const usersByRole = ROLE_OPTIONS.map(role => ({
    ...role,
    count: users.filter(u => u.role === role.value).length
  }));

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {usersByRole.map((role) => (
          <Card key={role.value} className="p-4">
            <div className="flex items-center gap-3">
              <div className={`${role.color} p-2 rounded-lg`}>
                <Shield className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{role.count}</p>
                <p className="text-xs text-slate-500">{role.label}s</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Permissions Overview */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <Key className="h-5 w-5" />
          Role Permissions Overview
        </h3>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Permission</TableHead>
                {ROLE_OPTIONS.map(role => (
                  <TableHead key={role.value} className="text-center">{role.label}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {PERMISSIONS.map(permission => (
                <TableRow key={permission.key}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <permission.icon className="h-4 w-4 text-slate-400" />
                      {permission.label}
                    </div>
                  </TableCell>
                  {ROLE_OPTIONS.map(role => (
                    <TableCell key={role.value} className="text-center">
                      {permission.roles.includes(role.value) ? (
                        <Check className="h-5 w-5 text-green-500 mx-auto" />
                      ) : (
                        <X className="h-5 w-5 text-slate-300 mx-auto" />
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* User Management */}
      <Card className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
            <Users className="h-5 w-5" />
            User Management
          </h3>
          <div className="flex gap-3">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button onClick={() => setShowInviteDialog(true)}>
              <UserPlus className="h-4 w-4 mr-2" />
              Invite User
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Permissions</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => {
                  const roleInfo = getRoleInfo(user.role);
                  const permissions = getUserPermissions(user.role);
                  return (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-slate-600">
                              {user.full_name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-slate-900">{user.full_name || 'No name'}</p>
                            <p className="text-sm text-slate-500">{user.email}</p>
                            {user.phone && (
                              <p className="text-xs text-slate-400 flex items-center gap-1">
                                <Phone className="h-3 w-3" />
                                {user.phone}
                              </p>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={`${roleInfo.color} text-white`}>
                          {roleInfo.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1 flex-wrap">
                          {permissions.map(p => (
                            <span key={p.key} className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">
                              {p.label}
                            </span>
                          ))}
                          {permissions.length === 0 && (
                            <span className="text-xs text-slate-400">No special permissions</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-slate-500">
                        {new Date(user.created_date).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditUser(user)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {filteredUsers.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-slate-500">
                      No users found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>

      {/* Edit User Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User Role</DialogTitle>
          </DialogHeader>
          {editingUser && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg">
                <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center">
                  <span className="text-lg font-medium text-slate-600">
                    {editingUser.full_name?.[0]?.toUpperCase() || editingUser.email?.[0]?.toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-slate-900">{editingUser.full_name || 'No name'}</p>
                  <p className="text-sm text-slate-500">{editingUser.email}</p>
                </div>
              </div>

              <div>
                <Label>Assign Role</Label>
                <Select
                  value={editingUser.role}
                  onValueChange={(value) => setEditingUser({ ...editingUser, role: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ROLE_OPTIONS.map(role => (
                      <SelectItem key={role.value} value={role.value}>
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${role.color}`} />
                          <span>{role.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Phone Number</Label>
                <Input
                  value={editingUser.phone || ''}
                  onChange={(e) => setEditingUser({ ...editingUser, phone: e.target.value })}
                  placeholder="(555) 123-4567"
                />
              </div>

              <div className="p-4 bg-slate-50 rounded-lg">
                <p className="text-sm font-medium text-slate-700 mb-2">Permissions for this role:</p>
                <div className="space-y-2">
                  {getUserPermissions(editingUser.role).map(p => (
                    <div key={p.key} className="flex items-center gap-2 text-sm text-slate-600">
                      <Check className="h-4 w-4 text-green-500" />
                      {p.label}
                    </div>
                  ))}
                  {getUserPermissions(editingUser.role).length === 0 && (
                    <p className="text-sm text-slate-400">No special permissions</p>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setShowEditDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveUser} disabled={updateUserMutation.isPending}>
                  {updateUserMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Save Changes
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Invite User Dialog */}
      <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              Invite New User
            </DialogTitle>
            <DialogDescription>
              Send an invitation email to add a new team member. They can sign in using email, Google, Apple, or Microsoft.
            </DialogDescription>
          </DialogHeader>

          {inviteSuccess ? (
            <div className="py-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Invitation Sent!</h3>
              <p className="text-slate-500">
                An email has been sent to {inviteForm.email}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>First Name *</Label>
                  <Input
                    value={inviteForm.first_name}
                    onChange={(e) => setInviteForm({ ...inviteForm, first_name: e.target.value })}
                    placeholder="John"
                  />
                </div>
                <div>
                  <Label>Last Name *</Label>
                  <Input
                    value={inviteForm.last_name}
                    onChange={(e) => setInviteForm({ ...inviteForm, last_name: e.target.value })}
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div>
                <Label>Email Address *</Label>
                <Input
                  type="email"
                  value={inviteForm.email}
                  onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
                  placeholder="john.doe@example.com"
                />
              </div>

              <div>
                <Label>Phone Number</Label>
                <Input
                  type="tel"
                  value={inviteForm.phone}
                  onChange={(e) => setInviteForm({ ...inviteForm, phone: e.target.value })}
                  placeholder="(555) 123-4567"
                />
              </div>

              <div>
                <Label>Assign Role</Label>
                <Select
                  value={inviteForm.role}
                  onValueChange={(value) => setInviteForm({ ...inviteForm, role: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ROLE_OPTIONS.map(role => (
                      <SelectItem key={role.value} value={role.value}>
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${role.color}`} />
                          <span>{role.label}</span>
                          <span className="text-xs text-slate-400">- {role.description}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-700">
                  <Mail className="h-4 w-4 inline mr-1" />
                  The user will receive an email with a link to create their account. They can authenticate using email, Google, Apple, or Microsoft.
                </p>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button variant="outline" onClick={() => setShowInviteDialog(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleSendInvite} 
                  disabled={inviteSending || !inviteForm.email || !inviteForm.first_name || !inviteForm.last_name}
                >
                  {inviteSending ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4 mr-2" />
                  )}
                  Send Invitation
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}