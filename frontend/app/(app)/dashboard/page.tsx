import type { Metadata } from 'next';
import { TraineeDashboard } from '@/features/dashboard/components/trainee-dashboard';

export const metadata: Metadata = {
  title: 'Dashboard — Triagr Trainer',
  description: 'Threat simulation training dashboard and performance metrics.',
};

export default function DashboardPage() {
  return <TraineeDashboard />;
}
