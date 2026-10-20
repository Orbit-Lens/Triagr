'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { User, Lock, Mail, Eye, EyeOff, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { TriagrEmblem } from './triagr-emblem';
import { VideoBackground } from './video-background';
import { signInSchema, signUpSchema, SignInInput, SignUpInput } from '@/domain/schemas/auth';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { cn } from '@/lib/utils';

interface AuthCardProps {
  initialMode: 'signin' | 'signup';
}

export function AuthCard({ initialMode }: AuthCardProps) {
  const router = useRouter();
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { signIn, signUp, isSubmitting } = useAuth();

  // Sign In Form
  const signInForm = useForm<SignInInput>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      emailOrUsername: 'you@example.com',
      password: 'password123',
      rememberMe: true,
    },
  });

  // Sign Up Form
  const signUpForm = useForm<SignUpInput>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      displayName: '',
      email: '',
      password: '',
      confirmPassword: '',
      agreeTerms: true,
    },
  });

  const onSignInSubmit = async (data: SignInInput) => {
    const res = await signIn(data);
    if (!res.success) {
      toast.error(res.error || 'Failed to sign in');
    } else {
      toast.success('Signed in successfully');
    }
  };

  const onSignUpSubmit = async (data: SignUpInput) => {
    const res = await signUp(data);
    if (!res.success) {
      toast.error(res.error || 'Failed to create account');
    } else {
      toast.success('Account created! Welcome to Triagr');
    }
  };

  const handleOAuthClick = (provider: string) => {
    toast.info(`${provider} authentication will be available after backend integration.`);
  };

  const handleForgotPassword = (e: React.MouseEvent) => {
    e.preventDefault();
    toast.info('In demo mode, use password: "password123" for any registered account.');
  };

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-black px-4 py-8 text-white sm:px-8">
      {/* Background Drone Video with 0.85x speed and smooth loop transition */}
      <VideoBackground
        src="https://res.cloudinary.com/zby2cx5x/video/upload/v1792345739/drone_sign_image_m8z82j.mp4"
        playbackSpeed={0.85}
      />

      {/* Container matching screenshot: Left brand hero, Right auth card */}
      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center justify-between gap-12 lg:flex-row lg:items-center lg:gap-16">
        {/* Left Side: Brand Identity */}
        <div className="flex flex-1 flex-col items-center text-center lg:items-start lg:text-left drop-shadow-md">
          <div className="mb-4 flex items-center justify-center">
            <TriagrEmblem size={120} className="text-[#bcd877] drop-shadow-lg" />
          </div>

          <h1 className="text-5xl font-extrabold tracking-tight text-white drop-shadow-lg sm:text-6xl">
            Triagr
          </h1>

          <p className="mt-3 text-lg font-semibold tracking-normal text-zinc-100 drop-shadow-md sm:text-xl">
            Drone &amp; Counter-Drone <br />
            Threat Simulation Trainer
          </p>

          <p className="mt-6 text-sm font-medium tracking-widest text-[#bcd877] uppercase drop-shadow">
            Train. Detect. Defend.
          </p>

          <div className="mt-8 rounded-lg border border-zinc-800/80 bg-black/60 backdrop-blur-md p-3 text-xs text-zinc-300 shadow-lg">
            <span className="font-semibold text-[#bcd877]">Demo Credentials: </span>
            <span>you@example.com / password123</span>
          </div>
        </div>

        {/* Right Side: Auth Card with glassmorphic backdrop */}
        <div className="w-full max-w-[430px] rounded-2xl border border-zinc-800/90 bg-[#12161b]/90 backdrop-blur-xl p-6 shadow-2xl sm:p-8">
          {/* Top Tabs: Login / Sign Up */}
          <div className="mb-6 flex border-b border-zinc-800 text-center">
            <button
              type="button"
              onClick={() => {
                setMode('signin');
                router.replace('/sign-in');
              }}
              className={cn(
                'flex-1 pb-3 text-sm font-semibold transition-colors',
                mode === 'signin'
                  ? 'border-b-2 border-[#bcd877] text-white'
                  : 'text-zinc-400 hover:text-zinc-200'
              )}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('signup');
                router.replace('/sign-up');
              }}
              className={cn(
                'flex-1 pb-3 text-sm font-semibold transition-colors',
                mode === 'signup'
                  ? 'border-b-2 border-[#bcd877] text-white'
                  : 'text-zinc-400 hover:text-zinc-200'
              )}
            >
              Sign Up
            </button>
          </div>

          {/* Form Area */}
          {mode === 'signin' ? (
            <form onSubmit={signInForm.handleSubmit(onSignInSubmit)} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-zinc-300">
                  Email or Username
                </label>
                <div className="relative flex items-center">
                  <User className="pointer-events-none absolute left-3 size-4 text-zinc-500" />
                  <input
                    type="text"
                    {...signInForm.register('emailOrUsername')}
                    placeholder="you@example.com"
                    autoComplete="username"
                    className="w-full rounded-lg border border-zinc-700/70 bg-[#0d1014] py-2.5 pr-3 pl-9 text-sm text-white placeholder-zinc-500 transition-colors focus:border-[#bcd877] focus:outline-none"
                  />
                </div>
                {signInForm.formState.errors.emailOrUsername && (
                  <p className="mt-1 text-xs text-red-400">
                    {signInForm.formState.errors.emailOrUsername.message}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-zinc-300">
                  Password
                </label>
                <div className="relative flex items-center">
                  <Lock className="pointer-events-none absolute left-3 size-4 text-zinc-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    {...signInForm.register('password')}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    className="w-full rounded-lg border border-zinc-700/70 bg-[#0d1014] py-2.5 pr-10 pl-9 text-sm text-white placeholder-zinc-500 transition-colors focus:border-[#bcd877] focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-3 text-zinc-500 hover:text-zinc-300"
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
                {signInForm.formState.errors.password && (
                  <p className="mt-1 text-xs text-red-400">
                    {signInForm.formState.errors.password.message}
                  </p>
                )}
              </div>

              {/* Remember me & Forgot password */}
              <div className="flex items-center justify-between text-xs pt-0.5">
                <label className="flex items-center gap-2 cursor-pointer text-zinc-400 hover:text-zinc-300 select-none">
                  <input
                    type="checkbox"
                    {...signInForm.register('rememberMe')}
                    className="size-3.5 rounded border-zinc-700 bg-[#0d1014] text-[#54753c] accent-[#54753c]"
                  />
                  <span>Remember me</span>
                </label>
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-zinc-400 hover:text-zinc-200 transition-colors"
                >
                  Forgot password?
                </button>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-2 flex w-full items-center justify-center rounded-lg bg-[#54753c] py-2.5 text-sm font-semibold text-white shadow-md transition-colors hover:bg-[#608645] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : 'Login'}
              </button>

              {/* Divider */}
              <div className="relative my-4 flex items-center justify-center">
                <div className="w-full border-t border-zinc-800" />
                <span className="absolute bg-[#12161b] px-3 text-[11px] font-medium tracking-wider text-zinc-500 uppercase">
                  OR
                </span>
              </div>

              {/* Social Login Buttons */}
              <div className="space-y-2.5">
                <button
                  type="button"
                  onClick={() => handleOAuthClick('Google')}
                  className="flex w-full items-center justify-center gap-2.5 rounded-lg border border-zinc-800 bg-[#0d1014] py-2.5 text-xs font-medium text-zinc-300 transition-colors hover:bg-zinc-900"
                >
                  <svg className="size-3.5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                    />
                  </svg>
                  <span>Continue with Google</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleOAuthClick('GitHub')}
                  className="flex w-full items-center justify-center gap-2.5 rounded-lg border border-zinc-800 bg-[#0d1014] py-2.5 text-xs font-medium text-zinc-300 transition-colors hover:bg-zinc-900"
                >
                  <svg className="size-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                  <span>Continue with GitHub</span>
                </button>
              </div>

              {/* Footer Switch */}
              <p className="pt-2 text-center text-xs text-zinc-400">
                Don&apos;t have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('signup');
                    router.replace('/sign-up');
                  }}
                  className="font-semibold text-[#bcd877] hover:underline"
                >
                  Sign up
                </button>
              </p>
            </form>
          ) : (
            <form onSubmit={signUpForm.handleSubmit(onSignUpSubmit)} className="space-y-3.5">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-zinc-300">
                  Full Name / Call-sign
                </label>
                <div className="relative flex items-center">
                  <User className="pointer-events-none absolute left-3 size-4 text-zinc-500" />
                  <input
                    type="text"
                    {...signUpForm.register('displayName')}
                    placeholder="Trainee Name"
                    autoComplete="name"
                    className="w-full rounded-lg border border-zinc-700/70 bg-[#0d1014] py-2.5 pr-3 pl-9 text-sm text-white placeholder-zinc-500 transition-colors focus:border-[#bcd877] focus:outline-none"
                  />
                </div>
                {signUpForm.formState.errors.displayName && (
                  <p className="mt-1 text-xs text-red-400">
                    {signUpForm.formState.errors.displayName.message}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-zinc-300">
                  Email Address
                </label>
                <div className="relative flex items-center">
                  <Mail className="pointer-events-none absolute left-3 size-4 text-zinc-500" />
                  <input
                    type="email"
                    {...signUpForm.register('email')}
                    placeholder="you@example.com"
                    autoComplete="email"
                    className="w-full rounded-lg border border-zinc-700/70 bg-[#0d1014] py-2.5 pr-3 pl-9 text-sm text-white placeholder-zinc-500 transition-colors focus:border-[#bcd877] focus:outline-none"
                  />
                </div>
                {signUpForm.formState.errors.email && (
                  <p className="mt-1 text-xs text-red-400">
                    {signUpForm.formState.errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-zinc-300">
                  Password
                </label>
                <div className="relative flex items-center">
                  <Lock className="pointer-events-none absolute left-3 size-4 text-zinc-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    {...signUpForm.register('password')}
                    placeholder="Create a password (min 6 chars)"
                    autoComplete="new-password"
                    className="w-full rounded-lg border border-zinc-700/70 bg-[#0d1014] py-2.5 pr-10 pl-9 text-sm text-white placeholder-zinc-500 transition-colors focus:border-[#bcd877] focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-3 text-zinc-500 hover:text-zinc-300"
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
                {signUpForm.formState.errors.password && (
                  <p className="mt-1 text-xs text-red-400">
                    {signUpForm.formState.errors.password.message}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-zinc-300">
                  Confirm Password
                </label>
                <div className="relative flex items-center">
                  <Lock className="pointer-events-none absolute left-3 size-4 text-zinc-500" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    {...signUpForm.register('confirmPassword')}
                    placeholder="Confirm your password"
                    autoComplete="new-password"
                    className="w-full rounded-lg border border-zinc-700/70 bg-[#0d1014] py-2.5 pr-10 pl-9 text-sm text-white placeholder-zinc-500 transition-colors focus:border-[#bcd877] focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-3 text-zinc-500 hover:text-zinc-300"
                  >
                    {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
                {signUpForm.formState.errors.confirmPassword && (
                  <p className="mt-1 text-xs text-red-400">
                    {signUpForm.formState.errors.confirmPassword.message}
                  </p>
                )}
              </div>

              {/* Sign Up Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-2 flex w-full items-center justify-center rounded-lg bg-[#54753c] py-2.5 text-sm font-semibold text-white shadow-md transition-colors hover:bg-[#608645] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : 'Create Account'}
              </button>

              {/* Divider */}
              <div className="relative my-4 flex items-center justify-center">
                <div className="w-full border-t border-zinc-800" />
                <span className="absolute bg-[#12161b] px-3 text-[11px] font-medium tracking-wider text-zinc-500 uppercase">
                  OR
                </span>
              </div>

              {/* Social Login Buttons */}
              <div className="space-y-2.5">
                <button
                  type="button"
                  onClick={() => handleOAuthClick('Google')}
                  className="flex w-full items-center justify-center gap-2.5 rounded-lg border border-zinc-800 bg-[#0d1014] py-2.5 text-xs font-medium text-zinc-300 transition-colors hover:bg-zinc-900"
                >
                  <svg className="size-3.5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                    />
                  </svg>
                  <span>Continue with Google</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleOAuthClick('GitHub')}
                  className="flex w-full items-center justify-center gap-2.5 rounded-lg border border-zinc-800 bg-[#0d1014] py-2.5 text-xs font-medium text-zinc-300 transition-colors hover:bg-zinc-900"
                >
                  <svg className="size-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                  <span>Continue with GitHub</span>
                </button>
              </div>

              {/* Footer Switch */}
              <p className="pt-2 text-center text-xs text-zinc-400">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('signin');
                    router.replace('/sign-in');
                  }}
                  className="font-semibold text-[#bcd877] hover:underline"
                >
                  Log in
                </button>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
