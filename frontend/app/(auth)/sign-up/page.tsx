import type { Metadata } from 'next';
import { AuthCard } from '@/features/auth/components/auth-card';

export const metadata: Metadata = {
  title: 'Sign Up — Triagr Simulation Trainer',
  description: 'Create an account to begin counter-drone threat simulation training.',
};

export default function SignUpPage() {
  return <AuthCard initialMode="signup" />;
}
