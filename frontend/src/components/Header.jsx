import React from 'react';

export default function Header() {
  return (
    <header class="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-slate-800/80 gap-4">
      <div class="flex items-center gap-3">
        <div class="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 text-white font-bold text-xl">
          ⚽
        </div>
        <div>
          <div class="flex items-center gap-2">
            <h1 class="text-xl font-bold tracking-tight text-white">MatchScout <span class="text-indigo-400 font-semibold">B2B</span></h1>
            <span class="px-2 py-0.5 text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full">Advisor Intelligence</span>
          </div>
          <p class="text-xs text-slate-400">Club-Matching Engine & Scouting Platform für Spielerberater</p>
        </div>
      </div>
      <div class="flex items-center gap-3">
        <div class="text-right hidden md:block">
          <p class="text-xs font-medium text-slate-300">Pro Elite Football Agency</p>
          <p class="text-[11px] text-slate-500">14 Klienten im Portfolio</p>
        </div>
        <div class="h-9 w-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-semibold text-slate-300 text-sm">
          AG
        </div>
      </div>
    </header>
  );
}
