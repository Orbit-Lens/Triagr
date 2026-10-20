'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Sun, Moon, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

import { MOCK_SCENARIOS } from '@/infrastructure/mock/mock-scenarios';
import { Scenario, ScenarioFamily } from '@/domain/scenario';
import { cn } from '@/lib/utils';

export function ScenarioGrid() {
  const router = useRouter();
  const [activeFamily, setActiveFamily] = useState<ScenarioFamily>('all');
  const [scenarios] = useState<Scenario[]>(MOCK_SCENARIOS);

  const filterTabs: { label: string; family: ScenarioFamily }[] = [
    { label: 'All', family: 'all' },
    { label: 'Reconnaissance', family: 'reconnaissance' },
    { label: 'Swarm', family: 'swarm' },
    { label: 'Counter-Drone', family: 'counter-drone' },
    { label: 'Night', family: 'night' },
    { label: 'Custom', family: 'custom' },
  ];

  const filteredScenarios = scenarios.filter((s) => {
    if (activeFamily === 'all') return true;
    return s.family === activeFamily;
  });

  const handleStart = (scenario: Scenario) => {
    toast.success(`Initializing session for "${scenario.title}"...`);
    router.push(`/session/${scenario.slug}`);
  };

  const handleCreateCustom = () => {
    toast.info('Custom scenario sandbox editor will be launched.');
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
          Select a Scenario
        </h1>
        <p className="mt-1 text-sm text-zinc-400">
          Choose a training scenario and set your preferences.
        </p>
      </div>

      {/* Filter Tabs matching scenario_selection.jpg */}
      <div className="flex flex-wrap gap-2 pt-1">
        {filterTabs.map((tab) => (
          <button
            key={tab.family}
            type="button"
            onClick={() => setActiveFamily(tab.family)}
            className={cn(
              'rounded-xl px-5 py-2 text-xs font-semibold transition-all duration-150',
              activeFamily === tab.family
                ? 'bg-[#54753c] text-white shadow-md'
                : 'border border-zinc-800 bg-[#12161b] text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Grid of 6 Scenario Cards (3 columns on lg) */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredScenarios.slice(0, 5).map((scenario) => {
          const isNight = scenario.environment === 'Night';
          const difficultyBadgeColor =
            scenario.difficultyLevel === 'Easy'
              ? 'text-[#bcd877]'
              : scenario.difficultyLevel === 'Intermediate'
              ? 'text-amber-400'
              : 'text-red-400';

          return (
            <div
              key={scenario.id}
              className="group flex flex-col overflow-hidden rounded-2xl border border-zinc-800/80 bg-[#12161b] transition-all hover:border-zinc-700 hover:shadow-xl"
            >
              {/* Thumbnail Header */}
              <div
                className="relative h-44 w-full bg-cover bg-center"
                style={{ backgroundImage: `url(${scenario.thumbnailUrl})` }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-[#12161b] via-[#12161b]/30 to-transparent" />
                <div className="absolute top-3 right-3 rounded-full border border-zinc-700/60 bg-black/60 px-2.5 py-0.5 text-[11px] font-medium text-zinc-300 backdrop-blur-md">
                  {scenario.timeLimitSeconds / 60}m limit
                </div>
              </div>

              {/* Card Body */}
              <div className="flex flex-1 flex-col p-5">
                <h3 className="text-base font-bold text-white group-hover:text-[#bcd877] transition-colors">
                  {scenario.title}
                </h3>

                {/* Badges: Environment & Difficulty */}
                <div className="mt-2 flex items-center gap-2 text-xs text-zinc-400 font-medium">
                  <span className="inline-flex items-center gap-1 text-zinc-300">
                    {isNight ? <Moon className="size-3 text-indigo-400" /> : <Sun className="size-3 text-amber-400" />}
                    <span>{scenario.environment}</span>
                  </span>
                  <span>•</span>
                  <span className={difficultyBadgeColor}>{scenario.difficultyLevel}</span>
                </div>

                <p className="mt-2.5 flex-1 text-xs text-zinc-400 leading-relaxed">
                  {scenario.summary}
                </p>

                {/* Start Button */}
                <div className="mt-5">
                  <button
                    onClick={() => handleStart(scenario)}
                    className="flex w-full items-center justify-center rounded-xl bg-[#54753c] py-2 text-xs font-semibold text-white shadow-md transition-colors hover:bg-[#608645]"
                  >
                    Start
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {/* 6th Card: Custom Scenario Card matching screenshot */}
        <div className="flex flex-col rounded-2xl border border-dashed border-zinc-800 bg-[#12161b]/80 p-6 text-center transition-all hover:border-zinc-700">
          <div className="flex flex-1 flex-col items-center justify-center py-6">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-[#3d542d]/30 text-[#bcd877] border border-[#5d8345]/30 mb-3">
              <Plus className="size-8" />
            </div>
            <h3 className="text-base font-bold text-white">Custom Scenario</h3>
            <p className="mt-2 text-xs text-zinc-400 max-w-[220px]">
              Create your own scenario with custom tactical and doctrine parameters.
            </p>
          </div>

          <button
            onClick={handleCreateCustom}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#54753c] py-2 text-xs font-semibold text-white shadow-md transition-colors hover:bg-[#608645]"
          >
            <Sparkles className="size-3.5" />
            <span>Create</span>
          </button>
        </div>
      </div>
    </div>
  );
}
