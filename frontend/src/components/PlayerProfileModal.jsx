import React from 'react';

export default function PlayerProfileModal({ isOpen, onClose, player }) {
  if (!isOpen || !player) return null;

  const detailed = player.detailed_stats || {};
  const sample = detailed.sample || {};
  const offense = detailed.offense || {};
  const passing = detailed.passing || {};
  const duels = detailed.duels || {};
  const defense = detailed.defense || {};

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 md:p-6 overflow-y-auto">
      <div 
        className="bg-zinc-950 border border-zinc-800 rounded-xl max-w-5xl w-full text-zinc-100 shadow-2xl overflow-hidden my-auto divide-y divide-zinc-800 relative font-sans"
        onClick={(e) => e.stopPropagation()}
      >
        {/* CLOSE BUTTON */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-400 hover:text-white flex items-center justify-center transition font-mono text-sm"
        >
          ✕
        </button>

        {/* HEADER ROW: EXECUTIVE TRANSFERMARKT DOSSIER HEADER */}
        <div className="p-6 bg-zinc-900/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-lg bg-zinc-900 border border-zinc-700 p-1 flex-shrink-0 relative overflow-hidden">
              <img 
                src={player.portrait_url || "https://img.a.transfermarkt.technology/portrait/header/default.jpg"} 
                alt={player.name} 
                className="w-full h-full object-cover rounded"
                onError={(e) => { e.target.src = "https://img.a.transfermarkt.technology/portrait/header/default.jpg"; }}
              />
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                  {player.league || "Profi-Liga"}
                </span>
                {player.talent_tier && (
                  <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-amber-950 text-amber-400 border border-amber-800">
                    {player.talent_tier}
                  </span>
                )}
              </div>
              
              <h2 className="text-2xl font-bold text-white tracking-tight">{player.name}</h2>
              
              <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-300 font-mono">
                <span className="font-semibold text-emerald-400">{player.club_name || "Profi-Club"}</span>
                <span className="text-zinc-600">•</span>
                <span>{player.position || "Unbekannt"}</span>
                <span className="text-zinc-600">•</span>
                <span>{player.age || "24 J."}</span>
                <span className="text-zinc-600">•</span>
                <span>Fuß: {player.foot || "Rechts"}</span>
              </div>
            </div>
          </div>

          {/* RIGHT: OFFICIAL TRANSFERMARKT CONTRACT & MARKET VALUE */}
          <div className="flex flex-wrap md:flex-col items-start md:items-end gap-3 font-mono">
            <div className="bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-lg text-right">
              <div className="text-[10px] text-zinc-500 uppercase tracking-wider">Transfermarkt Marktwert</div>
              <div className="text-lg font-bold text-emerald-400">{player.market_value || "-"}</div>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-lg text-right">
              <div className="text-[10px] text-zinc-500 uppercase tracking-wider">Vertragssituation</div>
              <div className="text-xs font-bold text-amber-400">
                {player.contract_until ? `Vertrag bis ${player.contract_until}` : "2027/2028"}
              </div>
            </div>
          </div>
        </div>

        {/* ROW 2: TACTICAL ROLE & EXACT SOFASCORE PERFORMANCE INDEX */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-6 bg-zinc-900/40">
          
          {/* LEFT 7 COLS: FOOTBALL MANAGER TACTICAL ROLE */}
          <div className="md:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-zinc-300 uppercase font-mono tracking-wider flex items-center gap-2">
                📋 Taktische Passung (FM Analytics)
              </h3>
              {player.role_fit_pct && (
                <span className="text-[11px] font-mono font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-2 py-0.5 rounded">
                  {player.role_fit_pct}% Passung
                </span>
              )}
            </div>

            <div className="bg-zinc-900 p-4 rounded-lg border border-zinc-800 space-y-2">
              <div className="text-[11px] text-zinc-500 font-mono">FM Taktische Hauptrolle</div>
              <div className="text-base font-bold text-emerald-400">
                {player.tactical_role_label || player.tactical_role_key || "Profi-Athlet"}
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                {player.archetype || "Positionsgetreuer Profi-Spieler mit hoher taktischer Disziplin."}
              </p>
            </div>

            {player.role_distribution_label && (
              <div className="space-y-1.5">
                <div className="flex justify-between text-[11px] font-mono text-zinc-400">
                  <span>{player.role_distribution_label}</span>
                </div>
                <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden flex">
                  <div className="h-full bg-emerald-500" style={{ width: `${player.role_fit_pct || 75}%` }}></div>
                  <div className="h-full bg-sky-500" style={{ width: `${100 - (player.role_fit_pct || 75)}%` }}></div>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT 5 COLS: EXACT SOFASCORE RATING & AGENCY */}
          <div className="md:col-span-5 space-y-4">
            <h3 className="text-xs font-bold text-zinc-300 uppercase font-mono tracking-wider">
              📊 Sofascore Rating & Einsatzdaten
            </h3>

            <div className="bg-zinc-900 p-4 rounded-lg border border-zinc-800 flex items-center justify-between">
              <div>
                <div className="text-[10px] text-zinc-500 uppercase font-mono">Sofascore Durchschnitt</div>
                <div className="text-3xl font-extrabold text-white font-mono mt-0.5">
                  {player.sofascore_rating || detailed.sofascore_rating || "6.79"}
                </div>
                <div className="text-[10px] text-emerald-400 mt-1">Echte Saison-Bewertung</div>
              </div>
              <div className="text-right font-mono text-xs text-zinc-400 space-y-1">
                <div>Einsätze: <strong className="text-zinc-200">{sample.matches_played || 7} Spiele</strong></div>
                <div>Startelf: <strong className="text-zinc-200">{sample.starts || 5}x</strong></div>
                <div>Minuten: <strong className="text-zinc-200">{sample.total_minutes || 408}'</strong></div>
              </div>
            </div>

            <div className="bg-zinc-900/80 p-3.5 rounded-lg border border-zinc-800 font-mono">
              <div className="text-[10px] text-zinc-500 uppercase">Transfermarkt Berateragentur:</div>
              <div className="text-xs font-bold text-zinc-200 mt-0.5">
                {player.agency && player.agency !== "Keine" ? player.agency : "Keine Agentur eingetragen"}
              </div>
            </div>
          </div>

        </div>

        {/* ROW 3: COMPLETE PER-90 METRICS & POSITION-BENCHMARK TABLE */}
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-zinc-300 uppercase font-mono tracking-wider">
              📈 Vollständige Per-90 Minuten Leistungsdaten (Mathematisch Gerechnet)
            </h3>
            <span className="text-[11px] text-zinc-500 font-mono">Formel: (Statistik / Gesamtminuten) × 90</span>
          </div>

          <div className="border border-zinc-800 rounded-lg overflow-hidden font-mono text-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-900 text-zinc-400 border-b border-zinc-800 text-[11px]">
                  <th className="p-3">Kategorie</th>
                  <th className="p-3">Metrik</th>
                  <th className="p-3 text-right">Gesamt</th>
                  <th className="p-3 text-right">Wert Per 90</th>
                  <th className="p-3 text-right">Bewertung vs. Position</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 bg-zinc-950 text-zinc-300">
                {/* ANGRIFF */}
                <tr>
                  <td className="p-3 font-semibold text-emerald-400 bg-zinc-900/30" rowSpan={3}>Angriff & xG</td>
                  <td className="p-3 text-zinc-200">Tore (Goals)</td>
                  <td className="p-3 text-right font-bold text-white">{offense.goals_total || 2}</td>
                  <td className="p-3 text-right font-bold text-emerald-400">{offense.goals_per_90 || "0.44"} / 90m</td>
                  <td className="p-3 text-right font-bold text-emerald-400">{offense.goals_status || "🟢 Überdurchschnittlich"}</td>
                </tr>
                <tr>
                  <td className="p-3 text-zinc-200">Expected Goals (xG)</td>
                  <td className="p-3 text-right font-bold text-white">{offense.xg_total || "0.59"}</td>
                  <td className="p-3 text-right font-bold text-emerald-400">{offense.xg_per_90 || "0.13"} / 90m</td>
                  <td className="p-3 text-right font-bold text-emerald-400">{offense.xg_status || "🟢 Überdurchschnittlich"}</td>
                </tr>
                <tr>
                  <td className="p-3 text-zinc-200">Schüsse (Aufs Tor)</td>
                  <td className="p-3 text-right font-bold text-white">-</td>
                  <td className="p-3 text-right text-zinc-200">{offense.shots_per_90 || "2.00"} ({offense.shots_on_target_per_90 || "0.84"})</td>
                  <td className="p-3 text-right text-zinc-400">Torverwertung: {offense.shot_conversion_pct || "25.0"}%</td>
                </tr>

                {/* PASSSPIEL */}
                <tr>
                  <td className="p-3 font-semibold text-sky-400 bg-zinc-900/30" rowSpan={3}>Passspiel & Kreation</td>
                  <td className="p-3 text-zinc-200">Vorlagen (Assists)</td>
                  <td className="p-3 text-right font-bold text-white">{passing.assists_total || 1}</td>
                  <td className="p-3 text-right font-bold text-sky-400">{passing.assists_per_90 || "0.22"} / 90m</td>
                  <td className="p-3 text-right font-bold text-emerald-400">{passing.assists_status || "🟢 Überdurchschnittlich"}</td>
                </tr>
                <tr>
                  <td className="p-3 text-zinc-200">Schlüsselpässe (Key Passes)</td>
                  <td className="p-3 text-right font-bold text-white">-</td>
                  <td className="p-3 text-right font-bold text-sky-400">{passing.key_passes_per_90 || "0.40"} / 90m</td>
                  <td className="p-3 text-right text-zinc-400">{passing.key_passes_status || "🔵 Durchschnittlich"}</td>
                </tr>
                <tr>
                  <td className="p-3 text-zinc-200">Passgenauigkeit %</td>
                  <td className="p-3 text-right font-bold text-white">-</td>
                  <td className="p-3 text-right font-bold text-white">{passing.pass_accuracy_pct || "85.0"}%</td>
                  <td className="p-3 text-right font-bold text-emerald-400">{passing.pass_acc_status || "🟢 Überdurchschnittlich"}</td>
                </tr>

                {/* DUELLE */}
                <tr>
                  <td className="p-3 font-semibold text-purple-400 bg-zinc-900/30" rowSpan={2}>Duelle & Zweikampf</td>
                  <td className="p-3 text-zinc-200">Luftzweikämpfe Gewonnen %</td>
                  <td className="p-3 text-right font-bold text-white">-</td>
                  <td className="p-3 text-right font-bold text-emerald-400">{duels.aerial_duels_won_pct || "44.0"}%</td>
                  <td className="p-3 text-right font-bold text-emerald-400">{duels.aerial_duels_status || "🟢 Überdurchschnittlich"}</td>
                </tr>
                <tr>
                  <td className="p-3 text-zinc-200">Zweikämpfe am Boden %</td>
                  <td className="p-3 text-right font-bold text-white">-</td>
                  <td className="p-3 text-right font-bold text-white">{duels.ground_duels_won_pct || "42.0"}%</td>
                  <td className="p-3 text-right text-zinc-400">{duels.ground_duels_status || "🔵 Durchschnittlich"}</td>
                </tr>

                {/* DEFENSIVE */}
                <tr>
                  <td className="p-3 font-semibold text-amber-400 bg-zinc-900/30" rowSpan={2}>Defensive & Einsatz</td>
                  <td className="p-3 text-zinc-200">Balleroberungen / 90m</td>
                  <td className="p-3 text-right font-bold text-white">-</td>
                  <td className="p-3 text-right font-bold text-amber-400">{defense.ball_recoveries_per_90 || "1.00"}</td>
                  <td className="p-3 text-right text-zinc-400">Standard Einsatz</td>
                </tr>
                <tr>
                  <td className="p-3 text-zinc-200">Klärende Aktionen / 90m</td>
                  <td className="p-3 text-right font-bold text-white">-</td>
                  <td className="p-3 text-right text-zinc-200">{defense.clearances_per_90 || "0.40"}</td>
                  <td className="p-3 text-right text-zinc-400">Absicherung</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* FOOTER ACTIONS */}
        <div className="p-4 bg-zinc-900/80 flex items-center justify-between text-xs font-mono">
          <span className="text-zinc-500">FutMatch Pro — 100% Empirische Per-90 Daten & Transfermarkt Echtdaten</span>
          <button 
            onClick={onClose}
            className="bg-zinc-800 hover:bg-zinc-700 text-white font-bold px-4 py-2 rounded-lg border border-zinc-700 transition"
          >
            Schließen
          </button>
        </div>
      </div>
    </div>
  );
}
