import React from 'react';

export default function Header() {
  return (
    <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-zinc-800/80">
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight">Executive Club-Matching Workspace</h2>
        <p className="text-xs text-zinc-400">Geben Sie die Parameter Ihres Klienten ein, um die FutMatch Analysen zu starten.</p>
      </div>
      <div className="flex items-center gap-3 text-xs">
        <div className="px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>FutMatch ML-Engine v2.4 Bereit</span>
        </div>
      </div>
    </header>
  );
}
