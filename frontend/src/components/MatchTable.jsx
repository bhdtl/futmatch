import React from 'react';

export default function MatchTable({ matches, isSearching, onSelectDossier }) {
  if (isSearching) {
    return (
      <section className="border border-zinc-800 rounded-lg bg-zinc-900/60 p-12 text-center space-y-2 font-mono">
        <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
        <p className="text-xs text-emerald-500 font-bold">LADE REAL SUPABASE KADER-DATEN (SAISON 2026/27)...</p>
      </section>
    );
  }

  if (!matches || matches.length === 0) {
    return (
      <section className="border border-zinc-800 rounded-lg bg-zinc-900/60 p-12 text-center space-y-2 font-mono">
        <p className="text-xs text-amber-500 font-bold uppercase tracking-wider">KEINE VAKANZEN FÜR DIESE FILTER-KOMBINATION GEFUNDEN</p>
        <p className="text-xs text-zinc-400 max-w-md mx-auto font-sans leading-relaxed">
          Für die ausgewählte Position oder Filter-Kombination bestehen bei den aktuellen Vereinen derzeit keine auslaufenden Verträge. Versuchen Sie es mit <strong className="text-zinc-200">"Alle Positionen"</strong> oder verändern Sie den Liga-Filter.
        </p>
      </section>
    );
  }

  const isGeneralSearch = matches[0]?.is_general_search;

  return (
    <section className="border border-zinc-800 rounded-lg bg-zinc-900/60 overflow-hidden shadow-sm space-y-0 font-sans">
      <div className="px-5 py-3 border-b border-zinc-800 bg-zinc-950 flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span className="text-zinc-300 font-bold uppercase tracking-wider">
            {isGeneralSearch ? '02 / GESAMT-KADER VAKANZEN (SAISON 2026/2027)' : '02 / SPEZIFISCHE MATCH-PASSUNGEN (SAISON 2026/2027)'}
          </span>
        </div>
        <span className="text-emerald-400 font-bold">
          {matches.length} ERGEBNISSE GEFUNDEN
        </span>
      </div>

      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-zinc-950/80 text-zinc-400 font-mono text-[11px] uppercase tracking-wider border-b border-zinc-800">
              <th className="py-3 px-5">Zielverein</th>
              <th className="py-3 px-4">Liga</th>
              <th className="py-3 px-4">System & Trainer</th>
              <th className="py-3 px-4 text-center">
                {isGeneralSearch ? 'Offene Verträge (27/28)' : 'Match-Score'}
              </th>
              <th className="py-3 px-4 text-center">Dringlichkeit</th>
              <th className="py-3 px-5">Vakanz- & Taktik-Analyse (2026/27)</th>
              <th className="py-3 px-5 text-right">Dossier</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/80 text-zinc-200">
            {matches.map((club) => {
              const score = club.match_score;
              const name = club.club_name || club.name;
              const fitReason = club.tactical_fit_reason || club.fit;
              const tactic = club.tactical_alignment || club.tactic || 'Standard System';
              const urgency = club.contract_urgency || 'Normal';
              const expiringCount = club.expiring_count || 0;

              const tacticalDna = club.tactical_dna || 'Variabler Aufbau';
              const possessionPct = club.possession_pct;
              const ppda = club.ppda;
              const fieldTilt = club.field_tilt;

              return (
                <tr key={club.club_id || name} className="hover:bg-zinc-800/50 transition-colors">
                  <td className="py-4 px-5 font-bold text-white text-sm">
                    {name}
                    {possessionPct && (
                      <div className="text-[10px] font-mono text-zinc-400 font-normal mt-0.5 flex items-center gap-2">
                        <span>Ballbesitz: <strong className="text-emerald-400 font-bold">{possessionPct}</strong></span>
                        {ppda && <span>• PPDA: <strong className="text-amber-400 font-bold">{ppda}</strong></span>}
                      </div>
                    )}
                  </td>
                  <td className="py-4 px-4 font-mono text-zinc-400 text-xs">{club.league}</td>
                  <td className="py-4 px-4 font-mono text-zinc-300 text-xs">
                    <div className="font-bold">{tactic}</div>
                    <div className="text-[10px] text-emerald-400 font-sans mt-0.5 font-medium">{tacticalDna}</div>
                  </td>
                  <td className="py-4 px-4 text-center">
                    {isGeneralSearch ? (
                      <span className="px-2.5 py-1 rounded bg-zinc-800 border border-zinc-700 text-zinc-200 font-mono font-bold text-xs">
                        {expiringCount} Vakanz{expiringCount !== 1 ? 'en' : ''}
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded bg-emerald-950 border border-emerald-800 text-emerald-400 font-mono font-bold text-xs">
                        {score}%
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                      urgency === 'Sehr Hoch' 
                        ? 'bg-amber-950 border border-amber-800 text-amber-400' 
                        : (urgency === 'Mittel' ? 'bg-zinc-800 border border-zinc-700 text-zinc-300' : 'bg-zinc-950 text-zinc-500')
                    }`}>
                      {urgency}
                    </span>
                  </td>
                  <td className="py-4 px-5 text-zinc-300 text-xs leading-relaxed max-w-md">
                    <div>{fitReason}</div>
                    
                    {club.position_role_title && (
                      <div className="mt-2 p-2 rounded bg-zinc-950/90 border border-zinc-800 text-[11px] font-sans">
                        <span className="text-emerald-400 font-bold font-mono text-[10px] block uppercase">
                          📍 {club.position_role_title}
                        </span>
                        <p className="text-zinc-300 text-[11px] leading-snug mt-0.5">
                          {club.position_role_behavior}
                        </p>
                      </div>
                    )}

                    <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[10px] font-mono">
                      <span className="px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 font-semibold border border-emerald-800/80">
                        {tacticalDna}
                      </span>
                      {ppda && (
                        <span className="px-1.5 py-0.5 rounded bg-zinc-900 text-amber-400 border border-zinc-700">
                          PPDA: {ppda} ({ppda < 9.5 ? 'High Press' : 'Mid Block'})
                        </span>
                      )}
                      {fieldTilt && (
                        <span className="px-1.5 py-0.5 rounded bg-zinc-900 text-blue-400 border border-zinc-700">
                          Field Tilt: {fieldTilt}
                        </span>
                      )}
                    </div>
                  </td>
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
