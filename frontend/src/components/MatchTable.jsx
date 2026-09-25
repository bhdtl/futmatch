import React from 'react';

export default function MatchTable({ matches, onSelectDossier }) {
  if (!matches || matches.length === 0) {
    return (
      <div class="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center text-slate-400">
        Keine passenden Vereine gefunden. Bitte Such-Filter anpassen.
      </div>
    );
  }

  return (
    <section class="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
      <div class="overflow-x-auto custom-scrollbar">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-950/80 text-slate-400 text-xs font-semibold uppercase tracking-wider border-b border-slate-800">
              <th class="py-4 px-5">Verein</th>
              <th class="py-4 px-4">Liga</th>
              <th class="py-4 px-4 text-center">Match-Score</th>
              <th class="py-4 px-5">Grund für den Fit (Taktik & Vakanz)</th>
              <th class="py-4 px-5 text-right">Aktion</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-800/60 text-sm">
            {matches.map((club) => {
              const scoreColor = club.match_score >= 90 
                ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/30" 
                : club.match_score >= 83 
                ? "text-indigo-400 bg-indigo-500/10 border-indigo-500/30" 
                : "text-amber-400 bg-amber-500/10 border-amber-500/30";

              return (
                <tr key={club.club_id} class="hover:bg-slate-800/40 transition-colors group">
                  <td class="py-4 px-5 font-medium text-slate-100">
                    <div class="flex items-center gap-3">
                      <div class="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-xs text-indigo-400 group-hover:border-indigo-500/50 transition">
                        {club.logo_short}
                      </div>
                      <div>
                        <div class="font-semibold text-white text-sm">{club.club_name}</div>
                        <div class="text-[11px] text-slate-500">ID: {club.club_id}</div>
                      </div>
                    </div>
                  </td>
                  <td class="py-4 px-4 text-slate-300 text-xs">
                    <span class="px-2.5 py-1 bg-slate-950 border border-slate-800 rounded-lg text-slate-300 inline-block">
                      {club.league}
                    </span>
                  </td>
                  <td class="py-4 px-4 text-center">
                    <div class={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${scoreColor}`}>
                      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                      <span>{club.match_score}%</span>
                    </div>
                  </td>
                  <td class="py-4 px-5 text-slate-300 text-xs leading-relaxed max-w-md">
                    {club.tactical_fit_reason}
                  </td>
                  <td class="py-4 px-5 text-right">
                    <button 
                      onClick={() => onSelectDossier(club)} 
                      class="px-3.5 py-2 bg-indigo-600/10 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/30 rounded-xl text-xs font-medium transition shadow-sm flex items-center justify-center gap-1.5 ml-auto"
                    >
                      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1.051 1.051 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                      <span>Dossier erstellen</span>
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
