import { describe, it, expect, beforeEach } from 'vitest';
import { signInSchema, signUpSchema } from '@/domain/schemas/auth';
import { MockAuthService } from '@/infrastructure/mock/mock-auth-service';

describe('Auth validation schemas', () => {
  it('validates a correct sign-in payload', () => {
    const valid = signInSchema.safeParse({
      emailOrUsername: 'trainee@triagr.mil',
      password: 'password123',
      rememberMe: true,
    });
    expect(valid.success).toBe(true);
  });

  it('rejects short passwords on sign-in', () => {
    const invalid = signInSchema.safeParse({
      emailOrUsername: 'trainee@triagr.mil',
      password: '123',
    });
    expect(invalid.success).toBe(false);
  });

  it('rejects mismatched passwords on sign-up', () => {
    const invalid = signUpSchema.safeParse({
      displayName: 'Alex Trainee',
      email: 'alex@example.com',
      password: 'password123',
      confirmPassword: 'password456',
      agreeTerms: true,
    });
    expect(invalid.success).toBe(false);
  });

  it('accepts matching sign-up payload', () => {
    const valid = signUpSchema.safeParse({
      displayName: 'Alex Trainee',
      email: 'alex@example.com',
      password: 'password123',
      confirmPassword: 'password123',
      agreeTerms: true,
    });
    expect(valid.success).toBe(true);
  });
});

describe('MockAuthService', () => {
  let auth: MockAuthService;

  beforeEach(() => {
    auth = new MockAuthService();
  });

  it('authenticates default demo credentials', async () => {
    const result = await auth.signIn({
      emailOrUsername: 'you@example.com',
      password: 'password123',
      rememberMe: false,
    });
    expect(result.error).toBeNull();
    expect(result.user?.email).toBe('you@example.com');
  });

  it('rejects invalid password', async () => {
    const result = await auth.signIn({
      emailOrUsername: 'you@example.com',
      password: 'wrongpassword',
      rememberMe: false,
    });
    expect(result.error?.kind).toBe('auth');
    expect(result.user).toBeNull();
  });
});
