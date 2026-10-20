import { AuthService, AuthResult } from '@/application/ports/auth-service';
import { User } from '@/domain/user';
import { SignInInput, SignUpInput } from '@/domain/schemas/auth';

const STORAGE_KEY_USERS = 'triagr_mock_users';
const STORAGE_KEY_CURRENT_USER = 'triagr_mock_session';

const DEFAULT_DEMO_USER: User & { passwordHash: string } = {
  id: 'usr-demo-001',
  email: 'you@example.com',
  displayName: 'Trainee Alex',
  role: 'trainee',
  createdAt: '2026-10-01T00:00:00.000Z',
  passwordHash: 'password123',
};

type StoredUser = User & { passwordHash: string };

export class MockAuthService implements AuthService {
  private listeners: Set<(user: User | null) => void> = new Set();

  private isBrowser(): boolean {
    return typeof window !== 'undefined';
  }

  private getUsers(): StoredUser[] {
    if (!this.isBrowser()) return [DEFAULT_DEMO_USER];
    const data = localStorage.getItem(STORAGE_KEY_USERS);
    if (!data) {
      localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify([DEFAULT_DEMO_USER]));
      return [DEFAULT_DEMO_USER];
    }
    try {
      return JSON.parse(data);
    } catch {
      return [DEFAULT_DEMO_USER];
    }
  }

  private saveUsers(users: StoredUser[]): void {
    if (!this.isBrowser()) return;
    localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));
  }

  private setCurrentUser(user: User | null): void {
    if (this.isBrowser()) {
      if (user) {
        localStorage.setItem(STORAGE_KEY_CURRENT_USER, JSON.stringify(user));
      } else {
        localStorage.removeItem(STORAGE_KEY_CURRENT_USER);
      }
    }
    this.notify(user);
  }

  private notify(user: User | null) {
    this.listeners.forEach((cb) => {
      try {
        cb(user);
      } catch (err) {
        console.error('Auth state listener error:', err);
      }
    });
  }

  async getCurrentUser(): Promise<User | null> {
    if (!this.isBrowser()) return null;
    const data = localStorage.getItem(STORAGE_KEY_CURRENT_USER);
    if (!data) return null;
    try {
      return JSON.parse(data) as User;
    } catch {
      return null;
    }
  }

  async signIn(input: SignInInput): Promise<AuthResult> {
    // Artificial slight latency to show realistic responsive feedback
    await new Promise((resolve) => setTimeout(resolve, 350));

    const users = this.getUsers();
    const query = input.emailOrUsername.trim().toLowerCase();

    const matchedUser = users.find((u) => {
      const emailLower = u.email.toLowerCase();
      const usernameLower = u.email.split('@')[0]?.toLowerCase();
      return emailLower === query || usernameLower === query;
    });

    if (!matchedUser) {
      return {
        user: null,
        error: {
          kind: 'auth',
          message: 'No account found with this email or username.',
        },
      };
    }

    if (matchedUser.passwordHash !== input.password) {
      return {
        user: null,
        error: {
          kind: 'auth',
          message: 'Incorrect password. Try "password123" for demo accounts.',
        },
      };
    }

    const userSafe: User = {
      id: matchedUser.id,
      email: matchedUser.email,
      displayName: matchedUser.displayName,
      role: matchedUser.role,
      createdAt: matchedUser.createdAt,
    };
    this.setCurrentUser(userSafe);

    return {
      user: userSafe,
      error: null,
    };
  }

  async signUp(input: SignUpInput): Promise<AuthResult> {
    await new Promise((resolve) => setTimeout(resolve, 350));

    const users = this.getUsers();
    const emailLower = input.email.trim().toLowerCase();

    if (users.some((u) => u.email.toLowerCase() === emailLower)) {
      return {
        user: null,
        error: {
          kind: 'auth',
          message: 'An account with this email already exists.',
        },
      };
    }

    const newUser: StoredUser = {
      id: `usr-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      email: emailLower,
      displayName: input.displayName.trim(),
      role: 'trainee',
      createdAt: new Date().toISOString(),
      passwordHash: input.password,
    };

    users.push(newUser);
    this.saveUsers(users);

    const userSafe: User = {
      id: newUser.id,
      email: newUser.email,
      displayName: newUser.displayName,
      role: newUser.role,
      createdAt: newUser.createdAt,
    };
    this.setCurrentUser(userSafe);

    return {
      user: userSafe,
      error: null,
    };
  }

  async signOut(): Promise<void> {
    this.setCurrentUser(null);
  }

  onAuthStateChange(callback: (user: User | null) => void): () => void {
    this.listeners.add(callback);
    // Emit initial status
    this.getCurrentUser().then(callback);
    return () => {
      this.listeners.delete(callback);
    };
  }
}
