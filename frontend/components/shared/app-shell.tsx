'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FolderGit2,
  History,
  Trophy,
  User,
  Settings,
  Menu,
  X,
  LogOut,
  Users,
  ShieldAlert,
} from 'lucide-react';

import { TriagrEmblem } from '@/features/auth/components/triagr-emblem';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { cn } from '@/lib/utils';

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeRole, setActiveRole] = useState<'Trainee' | 'Instructor' | 'Admin'>('Trainee');

  const displayName = user?.displayName || 'Rahul S';
  const initials = displayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const navItems = [
    {
      label: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
      active: pathname === '/dashboard',
    },
    {
      label: 'Scenarios',
      href: '/scenarios',
      icon: FolderGit2,
      active: pathname.startsWith('/scenarios'),
    },
    {
      label: 'History',
      href: '/history',
      icon: History,
      active: pathname.startsWith('/history'),
    },
    {
      label: activeRole === 'Trainee' ? 'Leaderboard' : 'Trainees',
      href: activeRole === 'Trainee' ? '/dashboard' : '/instructor',
      icon: activeRole === 'Trainee' ? Trophy : Users,
      active: pathname === '/instructor' || pathname === '/leaderboard',
    },
    {
      label: 'Profile',
      href: '/profile',
      icon: User,
      active: pathname === '/profile',
    },
    ...(activeRole === 'Admin'
      ? [
          {
            label: 'Admin Panel',
            href: '/admin',
            icon: ShieldAlert,
            active: pathname === '/admin',
          },
        ]
      : []),
    {
      label: 'Settings',
      href: '/profile',
      icon: Settings,
      active: false,
    },
  ];

  return (
    <div className="flex min-h-screen w-full bg-[#0a0d10] text-zinc-100 font-sans">
      {/* Desktop Left Sidebar matching design images */}
      <aside className="hidden lg:flex w-64 flex-col border-r border-zinc-800/80 bg-[#0c1014] px-4 py-6">
        {/* Brand Header */}
        <div className="flex items-center gap-3 px-2 mb-8">
          <TriagrEmblem size={36} className="text-[#bcd877]" />
          <span className="text-xl font-bold tracking-tight text-white">Triagr</span>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  'flex items-center gap-3.5 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-150',
                  item.active
                    ? 'bg-[#4d6c38]/40 text-[#c8e288] border border-[#5d8345]/50 shadow-sm'
                    : 'text-zinc-400 hover:bg-zinc-800/40 hover:text-zinc-200'
                )}
              >
                <div
                  className={cn(
                    'flex size-7 items-center justify-center rounded-lg transition-colors',
                    item.active
                      ? 'bg-[#55773e] text-white'
                      : 'text-zinc-400'
                  )}
                >
                  <Icon className="size-4" />
                </div>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer with Sign Out */}
        <div className="pt-4 border-t border-zinc-800/80">
          <button
            onClick={() => signOut()}
            className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2 text-xs font-medium text-zinc-400 hover:bg-zinc-800/40 hover:text-red-400 transition-colors"
          >
            <LogOut className="size-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <aside className="relative z-50 flex w-72 flex-col bg-[#0c1014] border-r border-zinc-800 p-6">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <TriagrEmblem size={32} className="text-[#bcd877]" />
                <span className="text-lg font-bold text-white">Triagr</span>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-zinc-400 hover:text-white"
              >
                <X className="size-5" />
              </button>
            </div>
            <nav className="flex-1 space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      'flex items-center gap-3.5 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors',
                      item.active
                        ? 'bg-[#4d6c38]/40 text-[#c8e288] border border-[#5d8345]/50'
                        : 'text-zinc-400 hover:text-white'
                    )}
                  >
                    <Icon className="size-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </aside>
        </div>
      )}

      {/* Main Content Column */}
      <div className="flex flex-1 flex-col overflow-x-hidden">
        {/* Top Header Bar matching screenshot */}
        <header className="flex h-16 items-center justify-between border-b border-zinc-800/80 bg-[#0c1014]/60 px-6 backdrop-blur-md">
          {/* Mobile hamburger toggle */}
          <div className="flex items-center gap-3 lg:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="text-zinc-400 hover:text-white"
            >
              <Menu className="size-5" />
            </button>
            <span className="font-semibold text-white">Triagr</span>
          </div>

          <div className="hidden lg:block">
            {/* Breadcrumb or mission status badge */}
            <span className="text-xs uppercase tracking-wider text-zinc-500 font-mono">
              Operational Threat Simulator • Standalone Mode
            </span>
          </div>

          {/* User profile & Role switcher matching screenshot */}
          <div className="flex items-center gap-4">
            {/* Role switch toggle (Trainee / Instructor / Admin) */}
            <div className="flex items-center rounded-lg border border-zinc-800 bg-[#12161b] p-0.5 text-xs">
              {(['Trainee', 'Instructor', 'Admin'] as const).map((role) => (
                <button
                  key={role}
                  onClick={() => setActiveRole(role)}
                  className={cn(
                    'rounded-md px-2.5 py-1 text-xs font-medium transition-colors',
                    activeRole === role
                      ? 'bg-[#4d6c38] text-white shadow-xs'
                      : 'text-zinc-400 hover:text-zinc-200'
                  )}
                >
                  {role}
                </button>
              ))}
            </div>

            {/* User Pill */}
            <Link
              href="/profile"
              className="flex items-center gap-2.5 rounded-full border border-zinc-800/80 bg-[#12161b] py-1 pr-3 pl-1 hover:border-zinc-700 transition-colors"
            >
              <div className="flex size-7 items-center justify-center rounded-full bg-[#3d542d] text-xs font-bold text-[#c8e288]">
                {initials}
              </div>
              <span className="text-xs font-medium text-zinc-200">{displayName}</span>
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
