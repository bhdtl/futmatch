import React from 'react';

export default function MatchTable({ matches, isSearching, onSelectDossier }) {
  if (isSearching) {
    return (
      <section className="border border-zinc-800 rounded-lg bg-zinc-900/60 p-12 text-center space-y-2 font-mono">
        <p className="text-xs text-emerald-500 font-bold">BERECHNE MATCH-SCORES & TAKTIK-ALIGNMENTS...</p>
      </section>
    );
  }

  if (!matches || matches.length === 0) {
    return (
      <section className="border border-zinc-800 rounded-lg bg-zinc-900/60 p-12 text-center space-y-2">
        <p className="text-xs font-mono text-zinc-400">KEINE AKTIVE BERECHNUNG</p>
        <p className="text-xs text-zinc-500 max-w-sm mx-auto">Wählen Sie oben die Position aus und klicken Sie auf MATCHING STARTEN.</p>
      </section>
    );
  }

  return (
    <section className="border border-zinc-800 rounded-lg bg-zinc-900/60 overflow-hidden shadow-sm space-y-0 font-sans">
      <div className="px-5 py-3 border-b border-zinc-800 bg-zinc-950 flex items-center justify-between text-xs font-mono">
        <span className="text-zinc-400 uppercase tracking-wider">02 / MATCH-ERGEBNISSE</span>
        <span className="text-emerald-500 font-bold">
          {matches.length} ERGEBNISSE GEFUNDEN
        </span>
      </div>

      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-zinc-950/80 text-zinc-400 font-mono text-[11px] uppercase tracking-wider border-b border-zinc-800">
              <th className="py-3 px-5">Verein</th>
              <th className="py-3 px-4">Liga</th>
              <th className="py-3 px-4">Taktisches System</th>
              <th className="py-3 px-4 text-center">Match-Score</th>
              <th className="py-3 px-5">Vakanz- & Fit-Analyse</th>
              <th className="py-3 px-5 text-right">Aktion</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/80 text-zinc-200">
            {matches.map((club) => {
              const score = club.match_score || club.score;
              const name = club.club_name || club.name;
              const fitReason = club.tactical_fit_reason || club.fit;
              const tactic = club.tactical_alignment || club.tactic || 'Standard System';

              return (
                <tr key={club.club_id || name} className="hover:bg-zinc-800/40 transition-colors">
                  <td className="py-3.5 px-5 font-semibold text-white">{name}</td>
                  <td className="py-3.5 px-4 font-mono text-zinc-400">{club.league}</td>
                  <td className="py-3.5 px-4 font-mono text-zinc-300">{tactic}</td>
                  <td className="py-3.5 px-4 text-center">
                    <span className="px-2 py-0.5 rounded bg-emerald-950 border border-emerald-800 text-emerald-400 font-mono font-bold">
                      {score}%
                    </span>
                  </td>
                  <td className="py-3.5 px-5 text-zinc-400 text-xs">{fitReason}</td>
                  <td className="py-3.5 px-5 text-right">
                    <button 
                      onClick={() => onSelectDossier(club)} 
                      className="px-3 py-1 bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 text-zinc-200 text-xs font-mono rounded"
                    >
                      Dossier
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
