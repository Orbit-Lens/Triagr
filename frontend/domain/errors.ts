export type ErrorKind =
  | 'auth'
  | 'validation'
  | 'not_found'
  | 'network'
  | 'unknown';

export interface AppError {
  kind: ErrorKind;
  message: string;
  details?: unknown;
}
