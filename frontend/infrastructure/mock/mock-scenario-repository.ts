import { ScenarioRepository } from '@/application/ports/scenario-repository';
import { Scenario, ScenarioFamily } from '@/domain/scenario';
import { MOCK_SCENARIOS } from './mock-scenarios';

export class MockScenarioRepository implements ScenarioRepository {
  private scenarios: Scenario[] = [...MOCK_SCENARIOS];

  async list(): Promise<Scenario[]> {
    return this.scenarios;
  }

  async getById(id: string): Promise<Scenario | null> {
    const found = this.scenarios.find((s) => s.id === id || s.slug === id);
    return found || null;
  }

  async getByFamily(family: ScenarioFamily): Promise<Scenario[]> {
    if (family === 'all') return this.scenarios;
    return this.scenarios.filter((s) => s.family === family);
  }
}
