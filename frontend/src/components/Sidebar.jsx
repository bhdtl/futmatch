import React from 'react';

export default function Sidebar({ activeCount = 0 }) {
  return (
    <aside class="w-full md:w-64 bg-zinc-900/90 border-r border-zinc-800/80 p-4 flex flex-col justify-between shrink-0">
      <div class="space-y-6">
        {/* Logo */}
        <div class="flex items-center gap-3 px-2 py-1">
          <div class="h-9 w-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center font-black text-zinc-950 text-lg shadow-lg shadow-emerald-500/20">
            ⚡
          </div>
          <div>
            <h1 class="text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
              FutMatch <span class="text-xs px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">PRO</span>
            </h1>
            <p class="text-[11px] text-zinc-400">Agency Intelligence</p>
          </div>
        </div>

        {/* Navigation */}
        <nav class="space-y-1 text-xs font-medium">
          <a href="#" class="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-zinc-800 text-emerald-400 border border-zinc-700/60 font-semibold shadow-sm">
            <svg class="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
            <span>Match Analytics</span>
          </a>
          <a href="#" class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 transition">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
            <span>Klienten Portfolio</span>
          </a>
          <a href="#" class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 transition">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
            <span>Vereine & Vakanzen</span>
          </a>
          <a href="#" class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 transition">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1.051 1.051 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
            <span>Generierte Dossiers</span>
          </a>
        </nav>
      </div>

      <div class="pt-6 border-t border-zinc-800/80">
        <div class="flex items-center gap-3 px-2">
          <div class="h-8 w-8 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center font-bold text-xs text-zinc-300">
            FM
          </div>
          <div class="truncate">
            <p class="text-xs font-medium text-zinc-200 truncate">FutMatch Agency</p>
            <p class="text-[10px] text-zinc-500">{activeCount > 0 ? `${activeCount} Aktive Matches` : 'Standby Mode'}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
