import type { Metadata } from 'next';
import { SessionHistoryView } from '@/features/history/components/session-history-view';

export const metadata: Metadata = {
  title: 'History — Triagr Trainer',
  description: 'Past simulation sessions, scores, and performance telemetry replay.',
};

export default function HistoryPage() {
  return <SessionHistoryView />;
}
