import type { Metadata } from 'next';
import { AuthCard } from '@/features/auth/components/auth-card';

export const metadata: Metadata = {
  title: 'Sign In — Triagr Simulation Trainer',
  description: 'Sign in to access your counter-drone threat simulation console.',
};

export default function SignInPage() {
  return <AuthCard initialMode="signin" />;
}
