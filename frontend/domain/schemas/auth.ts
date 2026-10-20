import { z } from 'zod';

export const signInSchema = z.object({
  emailOrUsername: z
    .string()
    .min(1, 'Please enter your email or username'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters'),
  rememberMe: z.boolean().default(false),
});

export type SignInInput = z.infer<typeof signInSchema>;

export const signUpSchema = z
  .object({
    displayName: z
      .string()
      .min(2, 'Name must be at least 2 characters')
      .max(50, 'Name must be under 50 characters'),
    email: z.string().email('Please enter a valid email address'),
    password: z
      .string()
      .min(6, 'Password must be at least 6 characters')
      .max(100, 'Password is too long'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
    agreeTerms: z.boolean().default(true),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export type SignUpInput = z.infer<typeof signUpSchema>;
