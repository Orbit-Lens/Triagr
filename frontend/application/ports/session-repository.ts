import { TrainingSession } from '@/domain/session';

export interface SessionRepository {
  list(): Promise<TrainingSession[]>;
  getById(id: string): Promise<TrainingSession | null>;
  save(session: TrainingSession): Promise<TrainingSession>;
  getRecent(limit?: number): Promise<TrainingSession[]>;
}
