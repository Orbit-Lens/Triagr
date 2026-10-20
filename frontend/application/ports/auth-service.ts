import { User } from '@/domain/user';
import { AppError } from '@/domain/errors';
import { SignInInput, SignUpInput } from '@/domain/schemas/auth';

export interface AuthResult {
  user: User | null;
  error: AppError | null;
}

export interface AuthService {
  signIn(input: SignInInput): Promise<AuthResult>;
  signUp(input: SignUpInput): Promise<AuthResult>;
  signOut(): Promise<void>;
  getCurrentUser(): Promise<User | null>;
  onAuthStateChange(callback: (user: User | null) => void): () => void;
}
