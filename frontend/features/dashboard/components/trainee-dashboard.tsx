'use client';

import React from 'react';
import Link from 'next/link';
import {
  Layers,
  Crosshair,
  Award,
  Clock,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { MOCK_SESSIONS } from '@/infrastructure/mock/mock-sessions';

export function TraineeDashboard() {
  const { user } = useAuth();
  const userName = user?.displayName || 'Rahul';
  const firstName = userName.split(' ')[0] || 'Rahul';

  const recentSessions = MOCK_SESSIONS.filter((s) => s.status === 'completed').slice(0, 3);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header Greeting */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
          Good morning, {firstName}!
        </h1>
        <p className="mt-1 text-sm text-zinc-400">
          Ready to train? Choose a scenario and start your mission.
        </p>
      </div>

      {/* Top 4 KPI Metric Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {/* Total Sessions */}
        <div className="rounded-2xl border border-zinc-800/80 bg-[#12161b] p-5">
          <div className="flex items-center gap-3.5">
            <div className="flex size-11 items-center justify-center rounded-xl bg-[#3d542d]/40 text-[#bcd877] border border-[#5d8345]/30">
              <Layers className="size-5" />
            </div>
            <div>
              <p className="text-xs text-zinc-400 font-medium">Total Sessions</p>
              <p className="text-2xl font-bold text-white mt-0.5">12</p>
            </div>
          </div>
        </div>

        {/* Avg. Score */}
        <div className="rounded-2xl border border-zinc-800/80 bg-[#12161b] p-5">
          <div className="flex items-center gap-3.5">
            <div className="flex size-11 items-center justify-center rounded-xl bg-[#3d542d]/40 text-[#bcd877] border border-[#5d8345]/30">
              <Crosshair className="size-5" />
            </div>
            <div>
              <p className="text-xs text-zinc-400 font-medium">Avg. Score</p>
              <p className="text-2xl font-bold text-white mt-0.5">78%</p>
            </div>
          </div>
        </div>

        {/* Best Score */}
        <div className="rounded-2xl border border-zinc-800/80 bg-[#12161b] p-5">
          <div className="flex items-center gap-3.5">
            <div className="flex size-11 items-center justify-center rounded-xl bg-[#3d542d]/40 text-[#bcd877] border border-[#5d8345]/30">
              <Award className="size-5" />
            </div>
            <div>
              <p className="text-xs text-zinc-400 font-medium">Best Score</p>
              <p className="text-2xl font-bold text-white mt-0.5">96%</p>
            </div>
          </div>
        </div>

        {/* Time Spent */}
        <div className="rounded-2xl border border-zinc-800/80 bg-[#12161b] p-5">
          <div className="flex items-center gap-3.5">
            <div className="flex size-11 items-center justify-center rounded-xl bg-[#3d542d]/40 text-[#bcd877] border border-[#5d8345]/30">
              <Clock className="size-5" />
            </div>
            <div>
              <p className="text-xs text-zinc-400 font-medium">Time Spent</p>
              <p className="text-2xl font-bold text-white mt-0.5">5.4 hrs</p>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Banner: Ready for the next mission? */}
      <div className="relative overflow-hidden rounded-2xl border border-zinc-800/90 bg-[#12161b] p-7 sm:p-8">
        {/* Atmospheric drone background graphic on right */}
        <div
          className="absolute inset-y-0 right-0 w-full sm:w-2/3 opacity-30 sm:opacity-40 bg-cover bg-center pointer-events-none"
          style={{
            backgroundImage:
              'url(https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&w=1200&q=80)',
            maskImage: 'linear-gradient(to right, transparent, black 40%)',
            WebkitMaskImage: 'linear-gradient(to right, transparent, black 40%)',
          }}
        />

        <div className="relative z-10 max-w-md">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#5d8345]/40 bg-[#3d542d]/30 px-3 py-1 text-xs text-[#c8e288] mb-3">
            <ShieldCheck className="size-3.5" />
            <span>Recommended Scenario</span>
          </div>
          <h2 className="text-2xl font-bold text-white">Ready for the next mission?</h2>
          <p className="mt-2 text-sm text-zinc-300">
            Continue your training with the last played scenario: Drone Swarm Defense.
          </p>
          <div className="mt-5">
            <Link
              href="/scenarios"
              className="inline-flex items-center gap-2 rounded-xl bg-[#54753c] px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition-colors hover:bg-[#608645]"
            >
              <span>Continue Training</span>
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom 2 Columns: Recent Activity & Your Progress */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Recent Activity List (2 cols on lg) */}
        <div className="lg:col-span-2 rounded-2xl border border-zinc-800/80 bg-[#12161b] p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-base font-semibold text-white">Recent Activity</h3>
            <Link
              href="/history"
              className="text-xs font-medium text-[#bcd877] hover:underline"
            >
              View all
            </Link>
          </div>

          <div className="space-y-4">
            {recentSessions.map((session, idx) => {
              const daysAgoText =
                idx === 0 ? 'Completed • 2 days ago' : idx === 1 ? 'Completed • 3 days ago' : 'Completed • 4 days ago';
              const scoreColor =
                session.score >= 80
                  ? 'text-[#bcd877]'
                  : session.score >= 70
                  ? 'text-amber-400'
                  : 'text-red-400';

              return (
                <div
                  key={session.id}
                  className="flex items-center justify-between rounded-xl border border-zinc-800/50 bg-[#0d1014] p-3.5 transition-colors hover:border-zinc-700"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-[#3d542d]/30 text-[#bcd877]">
                      <CheckCircle2 className="size-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{session.scenarioTitle}</p>
                      <p className="text-xs text-zinc-500">{daysAgoText}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`text-base font-bold ${scoreColor}`}>
                      {session.score}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Your Progress / Radial Donut Chart (1 col on lg) */}
        <div className="rounded-2xl border border-zinc-800/80 bg-[#12161b] p-6 flex flex-col items-center justify-center text-center">
          <h3 className="text-base font-semibold text-white mb-6 w-full text-left">
            Your Progress
          </h3>

          <div className="relative my-2 flex items-center justify-center">
            {/* SVG Donut Circle matching screenshot */}
            <svg className="size-44" viewBox="0 0 160 160">
              <circle
                cx="80"
                cy="80"
                r="64"
                stroke="currentColor"
                strokeWidth="14"
                fill="none"
                className="text-zinc-800/70"
              />
              <circle
                cx="80"
                cy="80"
                r="64"
                stroke="#bcd877"
                strokeWidth="14"
                fill="none"
                strokeDasharray="402"
                strokeDashoffset="88" // ~78% fill
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out -rotate-90 origin-center"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-extrabold text-white">78%</span>
            </div>
          </div>

          <p className="mt-4 text-xs font-medium text-zinc-400">
            Overall Performance
          </p>
        </div>
      </div>
    </div>
  );
}
