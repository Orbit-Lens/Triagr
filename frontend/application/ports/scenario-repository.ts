import { Scenario, ScenarioFamily } from '@/domain/scenario';

export interface ScenarioRepository {
  list(): Promise<Scenario[]>;
  getById(id: string): Promise<Scenario | null>;
  getByFamily(family: ScenarioFamily): Promise<Scenario[]>;
}
