'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { toast } from 'sonner';

import { MOCK_SESSIONS } from '@/infrastructure/mock/mock-sessions';
import { TrainingSession } from '@/domain/session';
import { cn } from '@/lib/utils';

export function SessionHistoryView() {
  const router = useRouter();
  const [filter, setFilter] = useState<'all' | 'completed' | 'in_progress'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [sessions] = useState<TrainingSession[]>(MOCK_SESSIONS);

  const filtered = sessions.filter((s) => {
    if (filter === 'all') return true;
    return s.status === filter;
  });

  const handleReplay = (session: TrainingSession) => {
    toast.info(`Loading telemetry replay for session ${session.scenarioTitle}...`);
    router.push(`/session/${session.scenarioId}?replay=true`);
  };

  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return '08 Oct 2026';
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
          Session History
        </h1>
        <p className="mt-1 text-sm text-zinc-400">
          View past sessions and replay your performance.
        </p>
      </div>

      {/* Filter Tabs matching session_history.jpg */}
      <div className="flex gap-2">
        {(
          [
            { label: 'All', value: 'all' },
            { label: 'Completed', value: 'completed' },
            { label: 'In Progress', value: 'in_progress' },
          ] as const
        ).map((tab) => (
          <button
            key={tab.value}
            type="button"
            onClick={() => setFilter(tab.value)}
            className={cn(
              'rounded-xl px-5 py-2 text-xs font-semibold transition-all duration-150',
              filter === tab.value
                ? 'bg-[#54753c] text-white shadow-md'
                : 'border border-zinc-800 bg-[#12161b] text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Table Container */}
      <div className="overflow-hidden rounded-2xl border border-zinc-800/80 bg-[#12161b]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-zinc-800/80 text-xs font-medium text-zinc-400">
              <tr>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Scenario</th>
                <th className="px-6 py-4">Score</th>
                <th className="px-6 py-4">Duration</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {filtered.map((item) => {
                const scoreColor =
                  item.score >= 80
                    ? 'text-[#bcd877]'
                    : item.score >= 70
                    ? 'text-amber-400'
                    : 'text-red-400';

                return (
                  <tr
                    key={item.id}
                    className="transition-colors hover:bg-zinc-800/30"
                  >
                    <td className="px-6 py-4 font-mono text-xs text-zinc-300">
                      {formatDate(item.startedAt)}
                    </td>
                    <td className="px-6 py-4 font-medium text-white">
                      {item.scenarioTitle}
                    </td>
                    <td className={`px-6 py-4 font-bold text-base ${scoreColor}`}>
                      {item.score}%
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-zinc-400">
                      {item.durationFormatted}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleReplay(item)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-700/70 bg-[#0d1014] px-4 py-1.5 text-xs font-medium text-zinc-200 transition-colors hover:border-[#bcd877] hover:text-[#bcd877]"
                      >
                        <Play className="size-3 fill-current" />
                        <span>Replay</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Table Footer with Pagination matching screenshot */}
        <div className="flex items-center justify-end gap-2 border-t border-zinc-800/80 px-6 py-4">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="flex size-8 items-center justify-center rounded-lg border border-zinc-800 bg-[#0d1014] text-zinc-400 hover:text-white transition-colors"
          >
            <ChevronLeft className="size-4" />
          </button>
          <button
            onClick={() => setCurrentPage(1)}
            className={cn(
              'flex size-8 items-center justify-center rounded-lg text-xs font-semibold transition-colors',
              currentPage === 1
                ? 'bg-[#54753c] text-white'
                : 'border border-zinc-800 bg-[#0d1014] text-zinc-400 hover:text-white'
            )}
          >
            1
          </button>
          <button
            onClick={() => setCurrentPage(2)}
            className={cn(
              'flex size-8 items-center justify-center rounded-lg text-xs font-semibold transition-colors',
              currentPage === 2
                ? 'bg-[#54753c] text-white'
                : 'border border-zinc-800 bg-[#0d1014] text-zinc-400 hover:text-white'
            )}
          >
            2
          </button>
          <button
            onClick={() => setCurrentPage(3)}
            className={cn(
              'flex size-8 items-center justify-center rounded-lg text-xs font-semibold transition-colors',
              currentPage === 3
                ? 'bg-[#54753c] text-white'
                : 'border border-zinc-800 bg-[#0d1014] text-zinc-400 hover:text-white'
            )}
          >
            3
          </button>
          <button
            onClick={() => setCurrentPage((p) => Math.min(3, p + 1))}
            className="flex size-8 items-center justify-center rounded-lg border border-zinc-800 bg-[#0d1014] text-zinc-400 hover:text-white transition-colors"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
