import React from 'react';
import { FutMatchLogo } from './FutMatchLogo';

export default function Sidebar({ activeCount = 0, onOpenAddModal }) {
  return (
    <aside className="w-full md:w-60 bg-zinc-950 border-r border-zinc-800 p-4 flex flex-col justify-between shrink-0 font-sans">
      <div className="space-y-6">
        {/* Logo */}
        <div className="flex items-center gap-3 px-2 py-1">
          <FutMatchLogo className="w-7 h-7" />
          <span className="font-bold text-white tracking-tight text-sm uppercase">
            FutMatch <span className="font-mono text-xs text-zinc-400 font-normal">/ PRO</span>
          </span>
        </div>

        {/* Navigation */}
        <nav className="space-y-1 text-xs font-mono">
          <a href="#" className="flex items-center gap-2.5 px-3 py-2 rounded bg-zinc-900 text-white font-semibold border border-zinc-800">
            <span>■</span>
            <span>MATCH ANALYTICS</span>
          </a>
          {onOpenAddModal && (
            <button 
              onClick={onOpenAddModal}
              className="w-full text-left flex items-center gap-2.5 px-3 py-2 rounded text-emerald-500 hover:bg-zinc-900/60 border border-transparent hover:border-zinc-800 transition"
            >
              <span>+</span>
              <span>ZIELVEREIN DB</span>
            </button>
          )}
          <a href="#" className="flex items-center gap-2.5 px-3 py-2 rounded text-zinc-400 hover:text-white hover:bg-zinc-900/60 border border-transparent hover:border-zinc-800 transition">
            <span>□</span>
            <span>KLIENTEN PORTFOLIO</span>
          </a>
          <a href="#" className="flex items-center gap-2.5 px-3 py-2 rounded text-zinc-400 hover:text-white hover:bg-zinc-900/60 border border-transparent hover:border-zinc-800 transition">
            <span>□</span>
            <span>DOSSIERS</span>
          </a>
        </nav>
      </div>

      <div className="pt-4 border-t border-zinc-800 font-mono text-[11px] text-zinc-500 px-2 space-y-1">
        <p className="text-zinc-300 font-semibold truncate">AGENCY WORKSPACE</p>
        <p>{activeCount > 0 ? `${activeCount} MATCHES AKTIV` : 'SUPABASE CONNECTED'}</p>
      </div>
    </aside>
  );
}
