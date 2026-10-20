import type { Metadata } from 'next';
import { ProfileView } from '@/features/profile/components/profile-view';

export const metadata: Metadata = {
  title: 'Profile & Settings — Triagr Trainer',
  description: 'Manage trainee profile credentials and simulation system preferences.',
};

export default function ProfilePage() {
  return <ProfileView />;
}
