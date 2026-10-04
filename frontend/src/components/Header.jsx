import React from 'react';
import PlayerSearchBar from './PlayerSearchBar';

export default function Header({ onOpenAddModal, onSelectPlayer }) {
  return (
    <header className="border-b border-zinc-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-sans">
      <div>
        <h1 className="text-xl font-bold text-white tracking-tight uppercase">Executive Matchmaking Workspace</h1>
        <p className="text-xs text-zinc-400 font-mono">STANDBY / DATEN-EINHEIT ZUR BERECHNUNG WÄHLEN</p>
      </div>
      
      <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
        {/* GLOBAL PLAYER SEARCH */}
        <PlayerSearchBar onSelectPlayer={onSelectPlayer} />

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          {onOpenAddModal && (
            <button 
              onClick={onOpenAddModal}
              className="px-3.5 py-2 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-mono text-emerald-400 font-medium transition whitespace-nowrap"
            >
              + ZIELVEREIN ANLEGEN
            </button>
          )}
          <span className="px-2.5 py-2 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 text-xs font-mono whitespace-nowrap">
            ONLINE
          </span>
        </div>
      </div>
    </header>
  );
}
