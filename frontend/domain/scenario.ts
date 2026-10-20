export type ScenarioFamily =
  | 'all'
  | 'reconnaissance'
  | 'swarm'
  | 'counter-drone'
  | 'night'
  | 'weather'
  | 'custom';

export type ScenarioDifficultyLevel = 'Easy' | 'Intermediate' | 'Advanced';

export interface Scenario {
  id: string;
  slug: string;
  title: string;
  family: ScenarioFamily;
  summary: string;
  objectives: string[];
  difficulty: number; // 0 to 1
  difficultyLevel: ScenarioDifficultyLevel;
  environment: 'Day' | 'Night';
  timeLimitSeconds: number;
  defaultSeed: number;
  thumbnailUrl: string;
}
