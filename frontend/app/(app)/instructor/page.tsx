import type { Metadata } from 'next';
import { InstructorDashboard } from '@/features/dashboard/components/instructor-dashboard';

export const metadata: Metadata = {
  title: 'Instructor Dashboard — Triagr Trainer',
  description: 'Instructor mission monitoring, live sessions, and trainee performance.',
};

export default function InstructorPage() {
  return <InstructorDashboard />;
}
