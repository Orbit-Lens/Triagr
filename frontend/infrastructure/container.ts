import { AuthService } from '@/application/ports/auth-service';
import { ScenarioRepository } from '@/application/ports/scenario-repository';
import { SessionRepository } from '@/application/ports/session-repository';
import { MockAuthService } from '@/infrastructure/mock/mock-auth-service';
import { MockScenarioRepository } from '@/infrastructure/mock/mock-scenario-repository';
import { MockSessionRepository } from '@/infrastructure/mock/mock-session-repository';

// In standalone mode, Mock adapters are instantiated
const authServiceInstance: AuthService = new MockAuthService();
const scenarioRepositoryInstance: ScenarioRepository = new MockScenarioRepository();
const sessionRepositoryInstance: SessionRepository = new MockSessionRepository();

export function getAuthService(): AuthService {
  return authServiceInstance;
}

export function getScenarioRepository(): ScenarioRepository {
  return scenarioRepositoryInstance;
}

export function getSessionRepository(): SessionRepository {
  return sessionRepositoryInstance;
}
