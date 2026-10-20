import { SessionRepository } from '@/application/ports/session-repository';
import { TrainingSession } from '@/domain/session';
import { MOCK_SESSIONS } from './mock-sessions';

const STORAGE_KEY_SESSIONS = 'triagr_mock_sessions';

export class MockSessionRepository implements SessionRepository {
  private isBrowser(): boolean {
    return typeof window !== 'undefined';
  }

  private getStoredSessions(): TrainingSession[] {
    if (!this.isBrowser()) return [...MOCK_SESSIONS];
    const data = localStorage.getItem(STORAGE_KEY_SESSIONS);
    if (!data) {
      localStorage.setItem(STORAGE_KEY_SESSIONS, JSON.stringify(MOCK_SESSIONS));
      return [...MOCK_SESSIONS];
    }
    try {
      return JSON.parse(data);
    } catch {
      return [...MOCK_SESSIONS];
    }
  }

  private persist(sessions: TrainingSession[]): void {
    if (this.isBrowser()) {
      localStorage.setItem(STORAGE_KEY_SESSIONS, JSON.stringify(sessions));
    }
  }

  async list(): Promise<TrainingSession[]> {
    return this.getStoredSessions();
  }

  async getById(id: string): Promise<TrainingSession | null> {
    const list = this.getStoredSessions();
    return list.find((s) => s.id === id) || null;
  }

  async save(session: TrainingSession): Promise<TrainingSession> {
    const list = this.getStoredSessions();
    const idx = list.findIndex((s) => s.id === session.id);
    if (idx >= 0) {
      list[idx] = session;
    } else {
      list.unshift(session);
    }
    this.persist(list);
    return session;
  }

  async getRecent(limit = 5): Promise<TrainingSession[]> {
    const list = this.getStoredSessions();
    return list.slice(0, limit);
  }
}
