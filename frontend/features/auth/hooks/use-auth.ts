'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '@/domain/user';
import { SignInInput, SignUpInput } from '@/domain/schemas/auth';
import { getAuthService } from '@/infrastructure/container';

export function useAuth() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const auth = getAuthService();
    const unsubscribe = auth.onAuthStateChange((currentUser) => {
      setUser(currentUser);
      setIsLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const signIn = useCallback(
    async (input: SignInInput) => {
      setIsSubmitting(true);
      try {
        const auth = getAuthService();
        const res = await auth.signIn(input);
        if (res.error) {
          return { success: false, error: res.error.message };
        }
        setUser(res.user);
        router.push('/dashboard');
        return { success: true };
      } catch {
        return { success: false, error: 'An unexpected authentication error occurred.' };
      } finally {
        setIsSubmitting(false);
      }
    },
    [router]
  );

  const signUp = useCallback(
    async (input: SignUpInput) => {
      setIsSubmitting(true);
      try {
        const auth = getAuthService();
        const res = await auth.signUp(input);
        if (res.error) {
          return { success: false, error: res.error.message };
        }
        setUser(res.user);
        router.push('/dashboard');
        return { success: true };
      } catch {
        return { success: false, error: 'An unexpected registration error occurred.' };
      } finally {
        setIsSubmitting(false);
      }
    },
    [router]
  );

  const signOut = useCallback(async () => {
    setIsSubmitting(true);
    try {
      const auth = getAuthService();
      await auth.signOut();
      setUser(null);
      router.push('/sign-in');
    } finally {
      setIsSubmitting(false);
    }
  }, [router]);

  return {
    user,
    isLoading,
    isSubmitting,
    isAuthenticated: !!user,
    signIn,
    signUp,
    signOut,
  };
}
