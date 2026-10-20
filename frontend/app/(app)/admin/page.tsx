import type { Metadata } from 'next';
import { AdminPanel } from '@/features/dashboard/components/admin-panel';

export const metadata: Metadata = {
  title: 'User Management — Triagr Admin',
  description: 'Manage users, roles and simulation system permissions.',
};

export default function AdminPage() {
  return <AdminPanel />;
}
