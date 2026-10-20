'use client';

import React, { useState } from 'react';
import { Plus, Edit2, MoreVertical } from 'lucide-react';
import { toast } from 'sonner';

export function AdminPanel() {
  const [users] = useState([
    { name: 'Rahul S', email: 'rahul@example.com', role: 'Trainee', status: 'Active' },
    { name: 'Priya K', email: 'priya@example.com', role: 'Trainee', status: 'Active' },
    { name: 'Arun M', email: 'arun@example.com', role: 'Trainee', status: 'Active' },
    { name: 'Sneha R', email: 'sneha@example.com', role: 'Trainee', status: 'Active' },
    { name: 'Vikram T', email: 'vikram@example.com', role: 'Instructor', status: 'Active' },
  ]);

  const handleAddUser = () => {
    toast.info('Add User dialog will open.');
  };

  const handleEdit = (userName: string) => {
    toast.info(`Editing permissions for ${userName}`);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            User Management
          </h1>
          <p className="mt-1 text-sm text-zinc-400">
            Manage users, roles and permissions.
          </p>
        </div>

        <button
          onClick={handleAddUser}
          className="inline-flex items-center gap-2 rounded-xl bg-[#54753c] px-4 py-2 text-xs font-semibold text-white shadow-md transition-colors hover:bg-[#608645]"
        >
          <Plus className="size-4" />
          <span>Add User</span>
        </button>
      </div>

      {/* Table matching admin_panel.jpg */}
      <div className="overflow-hidden rounded-2xl border border-zinc-800/80 bg-[#12161b]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-zinc-800/80 text-xs font-medium text-zinc-400">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {users.map((u, i) => (
                <tr key={i} className="hover:bg-zinc-800/30 transition-colors">
                  <td className="px-6 py-4 font-medium text-white">{u.name}</td>
                  <td className="px-6 py-4 font-mono text-xs text-zinc-400">{u.email}</td>
                  <td className="px-6 py-4 text-zinc-300 text-xs">{u.role}</td>
                  <td className="px-6 py-4">
                    <span className="rounded-md border border-[#5d8345]/50 bg-[#3d542d]/40 px-2.5 py-0.5 text-xs font-medium text-[#bcd877]">
                      {u.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="inline-flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(u.name)}
                        className="p-1.5 text-zinc-400 hover:text-white transition-colors"
                        aria-label="Edit user"
                      >
                        <Edit2 className="size-4" />
                      </button>
                      <button
                        className="p-1.5 text-zinc-400 hover:text-white transition-colors"
                        aria-label="More actions"
                      >
                        <MoreVertical className="size-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
