export interface User {
  id: string;
  email: string;
  displayName: string;
  role: 'trainee' | 'instructor' | 'admin';
  createdAt: string;
}

export interface AuthSession {
  user: User;
  token: string;
}
