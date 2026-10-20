'use client';

import React, { useState } from 'react';
import { useTheme } from 'next-themes';
import { toast } from 'sonner';

import { useAuth } from '@/features/auth/hooks/use-auth';
import { cn } from '@/lib/utils';

export function ProfileView() {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();

  const [activeTab, setActiveTab] = useState<'profile' | 'settings'>('profile');
  const [isEditing, setIsEditing] = useState(false);

  // Form states
  const [fullName, setFullName] = useState(user?.displayName || 'Rahul S');
  const [email, setEmail] = useState(user?.email || 'rahul@example.com');
  const [role] = useState('Trainee');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [language, setLanguage] = useState('English');

  const initials = fullName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const handleSave = () => {
    setIsEditing(false);
    toast.success('Profile details updated successfully');
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
          Profile &amp; Settings
        </h1>
      </div>

      {/* Tabs matching profile.jpg */}
      <div className="flex border-b border-zinc-800 text-sm font-medium">
        <button
          onClick={() => setActiveTab('profile')}
          className={cn(
            'pb-3 px-4 transition-colors',
            activeTab === 'profile'
              ? 'border-b-2 border-[#bcd877] text-white font-semibold'
              : 'text-zinc-400 hover:text-zinc-200'
          )}
        >
          Profile
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={cn(
            'pb-3 px-4 transition-colors',
            activeTab === 'settings'
              ? 'border-b-2 border-[#bcd877] text-white font-semibold'
              : 'text-zinc-400 hover:text-zinc-200'
          )}
        >
          Settings
        </button>
      </div>

      {/* 3 Column Grid Cards matching profile.jpg */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Card 1: Avatar & User Summary */}
        <div className="rounded-2xl border border-zinc-800/80 bg-[#12161b] p-6 flex flex-col items-center text-center">
          <div className="flex size-28 items-center justify-center rounded-full bg-[#3d542d] text-3xl font-extrabold text-[#c8e288] border-2 border-[#5d8345]/40 shadow-xl my-4">
            {initials}
          </div>
          <h2 className="text-xl font-bold text-white">{fullName}</h2>
          <span className="mt-1 inline-flex rounded-full border border-zinc-700/60 bg-[#0d1014] px-3 py-0.5 text-xs font-medium text-zinc-300">
            {role}
          </span>
          <div className="mt-6 pt-6 border-t border-zinc-800/80 w-full text-xs text-zinc-400 space-y-1.5">
            <p className="font-mono">{email}</p>
            <p className="text-zinc-500">Joined on 12 Aug 2026</p>
          </div>
        </div>

        {/* Card 2: Edit Profile Form */}
        <div className="rounded-2xl border border-zinc-800/80 bg-[#12161b] p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-base font-semibold text-white">Edit Profile</h3>
            {isEditing ? (
              <button
                onClick={handleSave}
                className="rounded-lg bg-[#54753c] px-3 py-1 text-xs font-semibold text-white hover:bg-[#608645] transition-colors"
              >
                Save
              </button>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="rounded-lg border border-zinc-700 bg-[#0d1014] px-3 py-1 text-xs font-semibold text-zinc-300 hover:border-[#bcd877] hover:text-[#bcd877] transition-colors"
              >
                Edit
              </button>
            )}
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-zinc-400 mb-1.5 font-medium">Full Name</label>
              <input
                type="text"
                disabled={!isEditing}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full rounded-lg border border-zinc-700/70 bg-[#0d1014] py-2.5 px-3 text-sm text-white disabled:opacity-70 focus:border-[#bcd877] focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-zinc-400 mb-1.5 font-medium">Email</label>
              <input
                type="email"
                disabled={!isEditing}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-zinc-700/70 bg-[#0d1014] py-2.5 px-3 text-sm text-white disabled:opacity-70 focus:border-[#bcd877] focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-zinc-400 mb-1.5 font-medium">Role</label>
              <input
                type="text"
                disabled
                value={role}
                className="w-full rounded-lg border border-zinc-800 bg-[#0a0d10] py-2.5 px-3 text-sm text-zinc-400 cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* Card 3: Preferences */}
        <div className="rounded-2xl border border-zinc-800/80 bg-[#12161b] p-6">
          <h3 className="text-base font-semibold text-white mb-5">Preferences</h3>

          <div className="space-y-5 text-xs">
            {/* Notifications Toggle */}
            <div className="flex items-center justify-between">
              <span className="text-zinc-300 font-medium text-sm">Notifications</span>
              <button
                type="button"
                role="switch"
                aria-checked={notificationsEnabled}
                onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                className={cn(
                  'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out',
                  notificationsEnabled ? 'bg-[#54753c]' : 'bg-zinc-800'
                )}
              >
                <span
                  className={cn(
                    'pointer-events-none inline-block size-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out mt-0.5',
                    notificationsEnabled ? 'translate-x-5' : 'translate-x-0.5'
                  )}
                />
              </button>
            </div>

            {/* Theme Select */}
            <div className="space-y-1.5">
              <label className="text-zinc-400 font-medium block">Theme</label>
              <select
                value={theme || 'dark'}
                onChange={(e) => setTheme(e.target.value)}
                className="w-full rounded-lg border border-zinc-700/70 bg-[#0d1014] py-2.5 px-3 text-sm text-white focus:border-[#bcd877] focus:outline-none"
              >
                <option value="dark">Dark (Ops-Room)</option>
                <option value="light">Light</option>
                <option value="system">System</option>
              </select>
            </div>

            {/* Language Select */}
            <div className="space-y-1.5">
              <label className="text-zinc-400 font-medium block">Language</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full rounded-lg border border-zinc-700/70 bg-[#0d1014] py-2.5 px-3 text-sm text-white focus:border-[#bcd877] focus:outline-none"
              >
                <option value="English">English</option>
                <option value="French">French</option>
                <option value="German">German</option>
                <option value="Spanish">Spanish</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
