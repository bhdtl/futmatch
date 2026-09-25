import React from 'react';

export default function Header({ onOpenAddModal }) {
  return (
    <header className="border-b border-zinc-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-sans">
      <div>
        <h1 className="text-xl font-bold text-white tracking-tight uppercase">Executive Matchmaking Workspace</h1>
        <p className="text-xs text-zinc-400 font-mono">STANDBY / DATEN-EINHEIT ZUR BERECHNUNG WÄHLEN</p>
      </div>
      <div className="flex items-center gap-3">
        {onOpenAddModal && (
          <button 
            onClick={onOpenAddModal}
            className="px-3.5 py-1.5 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-mono text-emerald-400 font-medium transition"
          >
            + ZIELVEREIN ANLEGEN
          </button>
        )}
        <span className="px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 text-xs font-mono">
          STATUS: ONLINE
        </span>
      </div>
    </header>
  );
}
