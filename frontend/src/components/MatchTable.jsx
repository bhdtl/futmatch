import React from 'react';

export default function MatchTable({ matches, isSearching, onSelectDossier }) {
  if (isSearching) {
    return (
      <section className="border border-zinc-800 rounded-lg bg-zinc-900/60 p-12 text-center space-y-2 font-mono">
        <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
        <p className="text-xs text-emerald-500 font-bold">BERECHNE LIVE MATCH-SCORES & TAKTIK-ALIGNMENTS (SAISON 2026/27)...</p>
      </section>
    );
  }

  if (!matches || matches.length === 0) {
    return (
      <section className="border border-zinc-800 rounded-lg bg-zinc-900/60 p-12 text-center space-y-2 font-mono">
        <p className="text-xs text-zinc-400 font-bold uppercase tracking-wider">KEINE AKTIVE KADERANALYSEN-SUCHE</p>
        <p className="text-xs text-zinc-500 max-w-md mx-auto font-sans leading-relaxed">
          Wählen Sie im Formular oben das Profil Ihres Klienten aus (z. B. Position, Alter & Vertrag) und klicken Sie auf <strong className="text-zinc-300">KLIENTEN MATCHING STARTEN</strong>.
        </p>
      </section>
    );
  }

  return (
    <section className="border border-zinc-800 rounded-lg bg-zinc-900/60 overflow-hidden shadow-sm space-y-0 font-sans">
      <div className="px-5 py-3 border-b border-zinc-800 bg-zinc-950 flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span className="text-zinc-300 font-bold uppercase tracking-wider">02 / AKTUELLE KADER-PASSUNGEN (SAISON 2026/2027)</span>
        </div>
        <span className="text-emerald-400 font-bold">
          {matches.length} KADER-PASSUNGEN
        </span>
      </div>

      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-zinc-950/80 text-zinc-400 font-mono text-[11px] uppercase tracking-wider border-b border-zinc-800">
              <th className="py-3 px-5">Zielverein</th>
              <th className="py-3 px-4">Liga</th>
              <th className="py-3 px-4">System (Trainer)</th>
              <th className="py-3 px-4 text-center">Match-Score</th>
              <th className="py-3 px-4 text-center">Dringlichkeit</th>
              <th className="py-3 px-5">Vakanz- & Taktik-Analyse (2026/27)</th>
              <th className="py-3 px-5 text-right">Dossier</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/80 text-zinc-200">
            {matches.map((club) => {
              const score = club.match_score || club.score;
              const name = club.club_name || club.name;
              const fitReason = club.tactical_fit_reason || club.fit;
              const tactic = club.tactical_alignment || club.tactic || 'Standard System';
              const urgency = club.contract_urgency || 'Normal';

              return (
                <tr key={club.club_id || name} className="hover:bg-zinc-800/50 transition-colors">
                  <td className="py-4 px-5 font-bold text-white text-sm">{name}</td>
                  <td className="py-4 px-4 font-mono text-zinc-400 text-xs">{club.league}</td>
                  <td className="py-4 px-4 font-mono text-zinc-300 text-xs">{tactic}</td>
                  <td className="py-4 px-4 text-center">
                    <span className="px-2.5 py-1 rounded bg-emerald-950 border border-emerald-800 text-emerald-400 font-mono font-bold text-xs">
                      {score}%
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                      urgency === 'Sehr Hoch' 
                        ? 'bg-amber-950 border border-amber-800 text-amber-400' 
                        : 'bg-zinc-800 text-zinc-300'
                    }`}>
                      {urgency}
                    </span>
                  </td>
                  <td className="py-4 px-5 text-zinc-300 text-xs leading-relaxed max-w-md">{fitReason}</td>
                  <td className="py-4 px-5 text-right">
                    <button 
                      onClick={() => onSelectDossier(club)} 
                      className="px-3.5 py-1.5 bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 text-zinc-200 hover:text-white text-xs font-mono rounded font-bold transition shadow-sm"
                    >
                      Dossier PDF
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
