import React from 'react';

export default function MatchTable({ matches, isSearching, onSelectDossier }) {
  if (isSearching) {
    return (
      <section className="bg-zinc-900/80 backdrop-blur-md border border-zinc-800/80 rounded-2xl p-12 text-center space-y-3 shadow-2xl">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-xs text-zinc-400 font-mono">Berechne Taktik-Alignment & Vakanz-Scores...</p>
      </section>
    );
  }

  if (!matches || matches.length === 0) {
    return (
      <section className="bg-zinc-900/80 backdrop-blur-md border border-zinc-800/80 rounded-2xl p-12 text-center space-y-3 shadow-2xl">
        <div className="w-12 h-12 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center justify-center mx-auto text-xl text-zinc-500">
          🔍
        </div>
        <div className="max-w-md mx-auto space-y-1">
          <h4 className="text-sm font-semibold text-zinc-200">Keine aktive Club-Matching Analyse</h4>
          <p className="text-xs text-zinc-500">Wählen Sie oben die Position und Kriterien Ihres Klienten aus und klicken Sie auf <strong>„Match-Analyse starten“</strong>, um die Ergebnisse zu berechnen.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-zinc-900/80 backdrop-blur-md border border-zinc-800/80 rounded-2xl overflow-hidden shadow-2xl">
      <div className="px-6 py-4 border-b border-zinc-800/80 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-emerald-400 text-xs font-mono">02/</span>
          <h3 className="text-xs font-semibold text-zinc-100 uppercase tracking-wider">FutMatch Top Club Results</h3>
        </div>
        <span className="text-xs px-2.5 py-1 rounded-full bg-zinc-950 text-emerald-400 border border-emerald-500/20 font-mono">
          {matches.length} Club-Matches gefunden
        </span>
      </div>

      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-zinc-950/90 text-zinc-400 text-[11px] font-semibold uppercase tracking-wider border-b border-zinc-800/80">
              <th className="py-3.5 px-5">Verein</th>
              <th className="py-3.5 px-4">Liga</th>
              <th className="py-3.5 px-4 text-center">Match-Score</th>
              <th className="py-3.5 px-5">Taktischer Fit & Vakanz-Grund</th>
              <th className="py-3.5 px-5 text-right">Aktion</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/60 text-xs">
            {matches.map((club) => {
              const score = club.match_score || club.score;
              const name = club.club_name || club.name;
              const logo = club.logo_short || club.logo;
              const fitReason = club.tactical_fit_reason || club.fit;

              return (
                <tr key={club.club_id || name} className="hover:bg-zinc-800/40 transition-colors group">
                  <td className="py-3.5 px-5 font-medium text-zinc-100">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center font-bold text-xs text-emerald-400">
                        {logo}
                      </div>
                      <span className="font-semibold text-white">{name}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-zinc-300">
                    <span className="px-2 py-0.5 bg-zinc-950 border border-zinc-800 rounded-md text-[11px]">
                      {club.league}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      {score}% Match
                    </span>
                  </td>
                  <td className="py-3.5 px-5 text-zinc-300 text-xs leading-relaxed max-w-md">
                    {fitReason}
                  </td>
                  <td className="py-3.5 px-5 text-right">
                    <button 
                      onClick={() => onSelectDossier(club)} 
                      className="px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-zinc-950 rounded-lg text-xs font-semibold transition border border-emerald-500/20"
                    >
                      Dossier erstellen
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
