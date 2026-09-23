'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Ban, Download, Pencil, Trash2, UserPlus } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 }
};

const users = [
  { id: 1, name: 'Emeka Obi', email: 'emeka.obi@email.com', role: 'Super Admin', status: 'Active', lastActive: '2 min ago' },
  { id: 2, name: 'Chioma Adeyemi', email: 'chioma.a@email.com', role: 'Admin', status: 'Active', lastActive: '15 min ago' },
  { id: 3, name: 'Adebayo Smith', email: 'adebayo@taxpro.com', role: 'Tax Pro', status: 'Active', lastActive: '1 hr ago' },
  { id: 4, name: 'Fatima Hassan', email: 'fatima.h@company.ng', role: 'User', status: 'Active', lastActive: '3 hr ago' },
  { id: 5, name: 'Olumide Johnson', email: 'olu.j@business.com', role: 'User', status: 'Suspended', lastActive: '2 days ago' },
  { id: 6, name: 'Ngozi Marcus', email: 'ngozi.m@email.com', role: 'Tax Pro', status: 'Active', lastActive: '5 hr ago' },
  { id: 7, name: 'Ibrahim Bello', email: 'ibrahim.b@firm.ng', role: 'User', status: 'Active', lastActive: '1 day ago' },
  { id: 8, name: 'Grace Okonkwo', email: 'grace.o@email.com', role: 'Admin', status: 'Active', lastActive: '30 min ago' },
  { id: 9, name: 'Kunle Adebisi', email: 'kunle.a@corp.com', role: 'User', status: 'Active', lastActive: '4 hr ago' },
  { id: 10, name: 'Amina Yusuf', email: 'amina.y@email.com', role: 'Tax Pro', status: 'Suspended', lastActive: '1 week ago' },
];

const roleBadgeVariant: Record<string, 'error' | 'warning' | 'brand' | 'info'> = {
  'Super Admin': 'error',
  'Admin': 'warning',
  'Tax Pro': 'brand',
  'User': 'info',
};

interface EditModalProps {
  user: typeof users[0] | null;
  onClose: () => void;
  onSave: (user: typeof users[0]) => void;
}

function EditUserModal({ user, onClose, onSave }: EditModalProps) {
  const [formData, setFormData] = useState(user);

  if (!user) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.15 }}
        className="w-full max-w-md bg-surface-raised rounded-card border border-border-default shadow-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-border-default">
          <h2>Edit User — {user.name}</h2>
        </div>
        <div className="p-6 space-y-4">
          <Input
            label="Full Name"
            defaultValue={user.name}
            onChange={(e) => setFormData({ ...formData!, name: e.target.value })}
          />
          <Input
            label="Email"
            type="email"
            defaultValue={user.email}
            onChange={(e) => setFormData({ ...formData!, email: e.target.value })}
          />
          <div className="flex flex-col gap-1.5">
            <label className="text-text-muted text-[12px] font-semibold uppercase tracking-wider block">
              Role
            </label>
            <select
              defaultValue={user.role}
              className="h-12 w-full rounded-input px-4 text-sm bg-surface-base border border-border-strong text-text-primary focus:outline-none focus:ring-2 focus:ring-[var(--color-focus-ring)]"
            >
              <option>Super Admin</option>
              <option>Admin</option>
              <option>Tax Pro</option>
              <option>User</option>
            </select>
          </div>
          <div className="flex items-center justify-between">
            <label className="text-text-muted text-sm">Status</label>
            <div className="flex items-center gap-2">
              <span className={`text-sm ${user.status === 'Active' ? 'text-success-text' : 'text-warning-text'}`}>
                {user.status}
              </span>
              <button
                role="switch"
                aria-checked={user.status === 'Active'}
                aria-label="Toggle user status"
                className="w-12 h-6 rounded-full bg-surface-inset relative transition-colors cursor-pointer"
              >
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-text-muted transition-all ${
                  user.status === 'Active' ? 'left-7 bg-success' : 'left-1'
                }`} />
              </button>
            </div>
          </div>
        </div>
        <div className="p-6 border-t border-border-default flex items-center justify-between">
          <Button variant="danger" size="sm">
            <Trash2 size={14} />
            Delete User
          </Button>
          <div className="flex gap-3">
            <Button variant="ghost" onClick={onClose}>Cancel</Button>
            <Button variant="primary" onClick={() => { onSave(formData!); onClose(); }}>Save Changes</Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function AdminUsersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedUser, setSelectedUser] = useState<typeof users[0] | null>(null);

  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'All' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'All' || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* Page Header */}
      <motion.div variants={itemVariants} className="mb-8">
        <h1>Users</h1>
        <p className="text-text-muted mt-1">Manage platform users and roles</p>
      </motion.div>

      {/* Stats Row */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4">
          <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">Total Users</p>
          <p className="text-2xl font-mono font-bold text-text-primary mt-1 tabular-nums">1,247</p>
          <p className="text-xs text-text-muted mt-1">+43 this week</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">Active Today</p>
          <p className="text-2xl font-mono font-bold text-text-primary mt-1 tabular-nums">387</p>
          <p className="text-xs text-text-muted mt-1">31% DAU rate</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">New This Week</p>
          <p className="text-2xl font-mono font-bold text-text-primary mt-1 tabular-nums">43</p>
          <p className="text-xs text-success-text mt-1">+22% vs last week</p>
        </Card>
      </motion.div>

      {/* Header Controls */}
      <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-4">
        <div className="flex-1 min-w-[200px] max-w-md">
          <Input
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-10"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="h-10 px-4 rounded-input bg-surface-base border border-border-strong text-text-primary text-sm"
        >
          <option>All</option>
          <option>Super Admin</option>
          <option>Admin</option>
          <option>Tax Pro</option>
          <option>User</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-10 px-4 rounded-input bg-surface-base border border-border-strong text-text-primary text-sm"
        >
          <option>All</option>
          <option>Active</option>
          <option>Suspended</option>
        </select>
        <div className="flex gap-2 ml-auto">
          <Button variant="ghost" size="md">
            <Download size={15} />
            Export
          </Button>
          <Button variant="primary" size="md">
            <UserPlus size={15} />
            Add User
          </Button>
        </div>
      </motion.div>

      {/* Users Table */}
      <motion.div variants={itemVariants}>
        <Card className="overflow-hidden max-w-[1100px]">
          <div className="overflow-x-auto overscroll-x-contain">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border-default bg-surface-inset">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">User</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">Email</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">Role</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">Last Active</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user, i) => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className="border-b border-border-subtle hover:bg-hover-overlay transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={`/images/avatars/avatar-${String((user.id % 10) + 1).padStart(2, '0')}.png`}
                          alt=""
                          width={32}
                          height={32}
                          className="w-8 h-8 rounded-full object-cover flex-shrink-0 border border-border-subtle"
                        />
                        <span className="text-sm font-medium text-text-primary">{user.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-text-secondary">{user.email}</td>
                    <td className="px-4 py-3">
                      <Badge variant={roleBadgeVariant[user.role]}>{user.role}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${
                          user.status === 'Active' ? 'bg-success' : 'bg-warning'
                        }`} />
                        <span className={`text-sm ${
                          user.status === 'Active' ? 'text-text-primary' : 'text-warning-text'
                        }`}>
                          {user.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-text-muted">{user.lastActive}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setSelectedUser(user)}
                          aria-label={`Edit ${user.name}`}
                          title="Edit"
                          className="p-1.5 rounded-btn text-text-muted hover:text-brand-primary hover:bg-hover-overlay transition-colors cursor-pointer"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          aria-label={`Suspend ${user.name}`}
                          title="Suspend"
                          className="p-1.5 rounded-btn text-text-muted hover:text-warning-text hover:bg-hover-overlay transition-colors cursor-pointer"
                        >
                          <Ban size={15} />
                        </button>
                        <button
                          aria-label={`Delete ${user.name}`}
                          title="Delete"
                          className="p-1.5 rounded-btn text-text-muted hover:text-error-text hover:bg-hover-overlay transition-colors cursor-pointer"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </motion.div>

      {/* Edit Modal */}
      <AnimatePresence>
        {selectedUser && (
          <EditUserModal
            user={selectedUser}
            onClose={() => setSelectedUser(null)}
            onSave={(updated) => console.log('Saved:', updated)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}