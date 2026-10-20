'use client';

import React from 'react';
import { Users, Activity, Award, CheckCircle } from 'lucide-react';

export function InstructorDashboard() {
  const liveSessions = [
    { name: 'Rahul S', scenario: 'Drone Swarm Attack', status: 'In Progress', score: 76, time: '08:24' },
    { name: 'Priya K', scenario: 'Urban Counter-Drone', status: 'In Progress', score: 64, time: '06:12' },
    { name: 'Arun M', scenario: 'Night Operation', status: 'Completed', score: 92, time: '11:34' },
    { name: 'Sneha R', scenario: 'Reconnaissance', status: 'Completed', score: 84, time: '11:24' },
    { name: 'Vikram T', scenario: 'Drone Swarm Attack', status: 'In Progress', score: 71, time: '07:15' },
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
          Training Overview
        </h1>
        <p className="mt-1 text-sm text-zinc-400">
          Monitor trainee performance and manage active sessions.
        </p>
      </div>

      {/* Top 4 KPI Metrics matching instructor_dashboard.jpg */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-2xl border border-zinc-800/80 bg-[#12161b] p-5">
          <div className="flex items-center gap-3.5">
            <div className="flex size-11 items-center justify-center rounded-xl bg-[#3d542d]/40 text-[#bcd877] border border-[#5d8345]/30">
              <Users className="size-5" />
            </div>
            <div>
              <p className="text-xs text-zinc-400 font-medium">Total Trainees</p>
              <p className="text-2xl font-bold text-white mt-0.5">8</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-800/80 bg-[#12161b] p-5">
          <div className="flex items-center gap-3.5">
            <div className="flex size-11 items-center justify-center rounded-xl bg-[#3d542d]/40 text-[#bcd877] border border-[#5d8345]/30">
              <Activity className="size-5" />
            </div>
            <div>
              <p className="text-xs text-zinc-400 font-medium">Active Sessions</p>
              <p className="text-2xl font-bold text-white mt-0.5">4</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-800/80 bg-[#12161b] p-5">
          <div className="flex items-center gap-3.5">
            <div className="flex size-11 items-center justify-center rounded-xl bg-[#3d542d]/40 text-[#bcd877] border border-[#5d8345]/30">
              <Award className="size-5" />
            </div>
            <div>
              <p className="text-xs text-zinc-400 font-medium">Avg. Score</p>
              <p className="text-2xl font-bold text-white mt-0.5">74%</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-800/80 bg-[#12161b] p-5">
          <div className="flex items-center gap-3.5">
            <div className="flex size-11 items-center justify-center rounded-xl bg-[#3d542d]/40 text-[#bcd877] border border-[#5d8345]/30">
              <CheckCircle className="size-5" />
            </div>
            <div>
              <p className="text-xs text-zinc-400 font-medium">Completion Rate</p>
              <p className="text-2xl font-bold text-white mt-0.5">83%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main 2 Column Section: Live Sessions & Performance Overview */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Live Sessions Table */}
        <div className="lg:col-span-2 overflow-hidden rounded-2xl border border-zinc-800/80 bg-[#12161b] p-6">
          <h3 className="text-base font-semibold text-white mb-4">Live Sessions</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-zinc-800/80 text-zinc-400 font-medium">
                <tr>
                  <th className="pb-3">Trainee</th>
                  <th className="pb-3">Scenario</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Score</th>
                  <th className="pb-3">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/50">
                {liveSessions.map((session, i) => (
                  <tr key={i} className="hover:bg-zinc-800/20 transition-colors">
                    <td className="py-3.5 font-medium text-white">{session.name}</td>
                    <td className="py-3.5 text-zinc-300">{session.scenario}</td>
                    <td className="py-3.5">
                      <span
                        className={`rounded-md px-2 py-0.5 text-[11px] font-medium ${
                          session.status === 'Completed'
                            ? 'bg-[#3d542d]/50 text-[#bcd877] border border-[#5d8345]/40'
                            : 'bg-zinc-800/80 text-zinc-300'
                        }`}
                      >
                        {session.status}
                      </span>
                    </td>
                    <td className="py-3.5 font-bold text-zinc-200">{session.score}%</td>
                    <td className="py-3.5 font-mono text-zinc-400">{session.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Performance Overview Bar Chart matching screenshot */}
        <div className="rounded-2xl border border-zinc-800/80 bg-[#12161b] p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-semibold text-white">Performance Overview</h3>
            <p className="text-xs text-zinc-400 mt-1">Average Score by Scenario</p>
          </div>

          <div className="my-6 flex items-end justify-between gap-3 h-48 px-2 border-b border-zinc-800/80 pb-2">
            {[
              { label: 'Recon', score: 82 },
              { label: 'Swarm', score: 68 },
              { label: 'Counter', score: 74 },
              { label: 'Night', score: 76 },
              { label: 'Custom', score: 70 },
            ].map((bar) => (
              <div key={bar.label} className="flex flex-1 flex-col items-center gap-2">
                <span className="text-[11px] font-bold text-zinc-300">{bar.score}%</span>
                <div
                  className="w-full rounded-t-md bg-[#bcd877] transition-all hover:opacity-90"
                  style={{ height: `${(bar.score / 100) * 130}px` }}
                />
                <span className="text-[10px] text-zinc-400 font-medium truncate">{bar.label}</span>
              </div>
            ))}
          </div>

          <p className="text-[11px] text-zinc-500 text-center">
            Updated in realtime across all active simulation nodes
          </p>
        </div>
      </div>
    </div>
  );
}
