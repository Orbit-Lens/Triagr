export type SessionStatus = 'completed' | 'in_progress' | 'aborted';

export interface ScoreItem {
  id: string;
  ruleId: string;
  timestampSeconds: number;
  expected: string;
  selected: string;
  pointsDelta: number;
  explanation: string;
  coachingTip?: string;
}

export interface ScoreBreakdown {
  detectScore: number;       // weight 0.20
  classifyScore: number;     // weight 0.20
  identifyScore: number;     // weight 0.15
  prioritiseScore: number;   // weight 0.20
  decideScore: number;       // weight 0.10
  teamScore: number;         // weight 0.10
  timeScore: number;         // weight 0.05
  penalties: number;
  finalScore: number;        // 0 - 100
  passedSafetyGates: boolean;
  deductions: ScoreItem[];
}

export interface TrainingSession {
  id: string;
  scenarioId: string;
  scenarioTitle: string;
  userId: string;
  userName: string;
  status: SessionStatus;
  startedAt: string;
  endedAt?: string;
  durationSeconds: number;
  durationFormatted: string;
  score: number;
  scoreBreakdown?: ScoreBreakdown;
  traineeRole?: string;
}
