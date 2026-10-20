import type { Metadata } from 'next';
import { ScenarioGrid } from '@/features/scenarios/components/scenario-grid';

export const metadata: Metadata = {
  title: 'Scenarios — Triagr Trainer',
  description: 'Select counter-drone threat scenarios and configure mission parameters.',
};

export default function ScenariosPage() {
  return <ScenarioGrid />;
}
