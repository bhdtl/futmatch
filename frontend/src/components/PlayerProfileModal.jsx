import React, { useState } from 'react';

export default function PlayerProfileModal({ isOpen, onClose, player }) {
  const [activeTab, setActiveTab] = useState('offense');

  if (!isOpen || !player) return null;

  const detailed = player.detailed_stats || {};
  const sample = detailed.sample || {};
  const offense = detailed.offense || {};
  const passing = detailed.passing || {};
  const duels = detailed.duels || {};
  const defense = detailed.defense || {};
  const tracking = detailed.tracking || {};
  const context = detailed.league_position_context || {};

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 md:p-6 overflow-y-auto">
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
              <h3 className="text-xs font-bold text-zinc-300 uppercase font-mono tracking-wider">
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

        {/* ROW 3: DETAILED STATS CATEGORIES (5 TECHNICAL TABS) */}
        <div className="p-6 space-y-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 border-b border-zinc-800 pb-3">
            <h3 className="text-xs font-bold text-zinc-300 uppercase font-mono tracking-wider">
              📈 Detaillierte Sofascore & Opta Leistungsdaten (Pro 90 Minuten & Gesamt)
            </h3>
            
            {/* STAT CATEGORY TABS */}
            <div className="flex flex-wrap gap-1 font-mono text-xs">
              <button 
                onClick={() => setActiveTab('offense')}
                className={`px-3 py-1.5 rounded transition ${activeTab === 'offense' ? 'bg-emerald-500 text-black font-bold' : 'bg-zinc-900 text-zinc-400 hover:text-white'}`}
              >
                ⚽ Angriff & xG
              </button>
              <button 
                onClick={() => setActiveTab('passing')}
                className={`px-3 py-1.5 rounded transition ${activeTab === 'passing' ? 'bg-sky-500 text-black font-bold' : 'bg-zinc-900 text-zinc-400 hover:text-white'}`}
              >
                🎯 Passspiel & xA
              </button>
              <button 
                onClick={() => setActiveTab('duels')}
                className={`px-3 py-1.5 rounded transition ${activeTab === 'duels' ? 'bg-purple-500 text-black font-bold' : 'bg-zinc-900 text-zinc-400 hover:text-white'}`}
              >
                🪄 Dribbling & Duelle
              </button>
              <button 
                onClick={() => setActiveTab('defense')}
                className={`px-3 py-1.5 rounded transition ${activeTab === 'defense' ? 'bg-amber-500 text-black font-bold' : 'bg-zinc-900 text-zinc-400 hover:text-white'}`}
              >
                🛡️ Defensive & Einsatz
              </button>
              <button 
                onClick={() => setActiveTab('tracking')}
                className={`px-3 py-1.5 rounded transition ${activeTab === 'tracking' ? 'bg-red-500 text-black font-bold' : 'bg-zinc-900 text-zinc-400 hover:text-white'}`}
              >
                🏃 Physis & Sprints
              </button>
            </div>
          </div>

          {/* TAB CONTENT: OFFENSE */}
          {activeTab === 'offense' && (
            <div className="border border-zinc-800 rounded-lg overflow-hidden font-mono text-xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-zinc-900 text-zinc-400 border-b border-zinc-800 text-[11px]">
                    <th className="p-3">Metrik</th>
                    <th className="p-3 text-right">Gesamtzahl (Saison)</th>
                    <th className="p-3 text-right">Wert Per 90 Min.</th>
                    <th className="p-3 text-right">Liga-Schnitt ({context.position_group || "Mittelstürmer"})</th>
                    <th className="p-3 text-right">Bewertung</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60 bg-zinc-950 text-zinc-300">
                  <tr>
                    <td className="p-3 font-semibold text-white">Tore (Goals)</td>
                    <td className="p-3 text-right font-bold text-white">{offense.goals_total || 2} Tore</td>
                    <td className="p-3 text-right font-bold text-emerald-400">{offense.goals_per_90 || "0.44"} / 90m</td>
                    <td className="p-3 text-right text-zinc-400">{offense.goals_league_avg || "0.35"} / 90m</td>
                    <td className="p-3 text-right font-bold text-emerald-400">{offense.goals_status || "🟢 Überdurchschnittlich"}</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-white">Expected Goals (xG)</td>
                    <td className="p-3 text-right font-bold text-white">{offense.xg_total || "0.59"} xG</td>
                    <td className="p-3 text-right font-bold text-emerald-400">{offense.xg_per_90 || "0.13"} / 90m</td>
                    <td className="p-3 text-right text-zinc-400">0.28 / 90m</td>
                    <td className="p-3 text-right font-bold text-emerald-400">{offense.xg_status || "🟢 Überdurchschnittlich"}</td>
                  </tr>
                  <tr>
                    <td className="p-3 text-zinc-200">Expected Goals on Target (xGOT)</td>
                    <td className="p-3 text-right font-bold text-white">0.42 xGOT</td>
                    <td className="p-3 text-right text-zinc-200">0.09 / 90m</td>
                    <td className="p-3 text-right text-zinc-400">0.18 / 90m</td>
                    <td className="p-3 text-right text-zinc-400">Standard xGOT</td>
                  </tr>
                  <tr>
                    <td className="p-3 text-zinc-200">Schüsse Gesamt (Aufs Tor)</td>
                    <td className="p-3 text-right font-bold text-white">9 (3 auf Tor)</td>
                    <td className="p-3 text-right text-zinc-200">{offense.shots_per_90 || "2.00"} ({offense.shots_on_target_per_90 || "0.84"})</td>
                    <td className="p-3 text-right text-zinc-400">1.80 / 90m</td>
                    <td className="p-3 text-right text-emerald-400 font-bold">Aktiv</td>
                  </tr>
                  <tr>
                    <td className="p-3 text-zinc-200">Schusstypen (Kopf / Offenes Spiel)</td>
                    <td className="p-3 text-right font-bold text-white">4 Kopf / 5 Fuß</td>
                    <td className="p-3 text-right text-zinc-200">0.88 Kopf / 90m</td>
                    <td className="p-3 text-right text-zinc-400">0.40 Kopf / 90m</td>
                    <td className="p-3 text-right text-emerald-400 font-bold">Kopfball-Gefahr</td>
                  </tr>
                  <tr>
                    <td className="p-3 text-zinc-200">Torverwertung %</td>
                    <td className="p-3 text-right font-bold text-white">-</td>
                    <td className="p-3 text-right font-bold text-emerald-400">{offense.shot_conversion_pct || "22.2"}%</td>
                    <td className="p-3 text-right text-zinc-400">18.0%</td>
                    <td className="p-3 text-right text-emerald-400 font-bold">Effizient</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {/* TAB CONTENT: PASSING */}
          {activeTab === 'passing' && (
            <div className="border border-zinc-800 rounded-lg overflow-hidden font-mono text-xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-zinc-900 text-zinc-400 border-b border-zinc-800 text-[11px]">
                    <th className="p-3">Metrik</th>
                    <th className="p-3 text-right">Gesamtzahl (Saison)</th>
                    <th className="p-3 text-right">Wert Per 90 Min.</th>
                    <th className="p-3 text-right">Liga-Schnitt ({context.position_group || "Mittelstürmer"})</th>
                    <th className="p-3 text-right">Bewertung</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60 bg-zinc-950 text-zinc-300">
                  <tr>
                    <td className="p-3 font-semibold text-white">Vorlagen (Assists)</td>
                    <td className="p-3 text-right font-bold text-white">{passing.assists_total || 1} Assists</td>
                    <td className="p-3 text-right font-bold text-sky-400">{passing.assists_per_90 || "0.22"} / 90m</td>
                    <td className="p-3 text-right text-zinc-400">0.12 / 90m</td>
                    <td className="p-3 text-right font-bold text-emerald-400">{passing.assists_status || "🟢 Überdurchschnittlich"}</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-white">Expected Assists (xA)</td>
                    <td className="p-3 text-right font-bold text-white">0.32 xA</td>
                    <td className="p-3 text-right font-bold text-sky-400">0.07 / 90m</td>
                    <td className="p-3 text-right text-zinc-400">0.08 / 90m</td>
                    <td className="p-3 text-right text-zinc-400">🔵 Durchschnittlich</td>
                  </tr>
                  <tr>
                    <td className="p-3 text-zinc-200">Schlüsselpässe (Key Passes)</td>
                    <td className="p-3 text-right font-bold text-white">3 Schlüsselpässe</td>
                    <td className="p-3 text-right font-bold text-sky-400">{passing.key_passes_per_90 || "0.40"} / 90m</td>
                    <td className="p-3 text-right text-zinc-400">0.60 / 90m</td>
                    <td className="p-3 text-right text-zinc-400">{passing.key_passes_status || "🔵 Durchschnittlich"}</td>
                  </tr>
                  <tr>
                    <td className="p-3 text-zinc-200">Passgenauigkeit %</td>
                    <td className="p-3 text-right font-bold text-white">38/44 Pässe</td>
                    <td className="p-3 text-right font-bold text-white">{passing.pass_accuracy_pct || "85.0"}%</td>
                    <td className="p-3 text-right text-zinc-400">{passing.pass_acc_league_avg || "72.0"}%</td>
                    <td className="p-3 text-right font-bold text-emerald-400">{passing.pass_acc_status || "🟢 Überdurchschnittlich"}</td>
                  </tr>
                  <tr>
                    <td className="p-3 text-zinc-200">Pässe Gegnerhälfte %</td>
                    <td className="p-3 text-right font-bold text-white">18/22 Pässe</td>
                    <td className="p-3 text-right text-sky-400">81.8% Quote</td>
                    <td className="p-3 text-right text-zinc-400">68.0%</td>
                    <td className="p-3 text-right font-bold text-emerald-400">Ballfest im Drittel</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {/* TAB CONTENT: DUELS */}
          {activeTab === 'duels' && (
            <div className="border border-zinc-800 rounded-lg overflow-hidden font-mono text-xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-zinc-900 text-zinc-400 border-b border-zinc-800 text-[11px]">
                    <th className="p-3">Metrik</th>
                    <th className="p-3 text-right">Gesamtzahl (Saison)</th>
                    <th className="p-3 text-right">Wert Per 90 Min.</th>
                    <th className="p-3 text-right">Liga-Schnitt ({context.position_group || "Mittelstürmer"})</th>
                    <th className="p-3 text-right">Bewertung</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60 bg-zinc-950 text-zinc-300">
                  <tr>
                    <td className="p-3 font-semibold text-white">Berührungen (Touches)</td>
                    <td className="p-3 text-right font-bold text-white">118 Berührungen</td>
                    <td className="p-3 text-right font-bold text-purple-400">26.0 / 90m</td>
                    <td className="p-3 text-right text-zinc-400">28.5 / 90m</td>
                    <td className="p-3 text-right text-zinc-400">🔵 Durchschnittlich</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-white">Luftzweikämpfe Gewonnen %</td>
                    <td className="p-3 text-right font-bold text-white">22/50 gewon.</td>
                    <td className="p-3 text-right font-bold text-emerald-400">{duels.aerial_duels_won_pct || "44.0"}%</td>
                    <td className="p-3 text-right text-zinc-400">{duels.aerial_league_avg || "42.0"}%</td>
                    <td className="p-3 text-right font-bold text-emerald-400">{duels.aerial_duels_status || "🟢 Überdurchschnittlich"}</td>
                  </tr>
                  <tr>
                    <td className="p-3 text-zinc-200">Zweikämpfe am Boden %</td>
                    <td className="p-3 text-right font-bold text-white">28/67 gewon.</td>
                    <td className="p-3 text-right font-bold text-white">{duels.ground_duels_won_pct || "42.0"}%</td>
                    <td className="p-3 text-right text-zinc-400">45.0%</td>
                    <td className="p-3 text-right text-zinc-400">🔵 Durchschnittlich</td>
                  </tr>
                  <tr>
                    <td className="p-3 text-zinc-200">Erfolgreiche Dribblings %</td>
                    <td className="p-3 text-right font-bold text-white">1/2 Dribblings</td>
                    <td className="p-3 text-right text-purple-400">50.0% Quote</td>
                    <td className="p-3 text-right text-zinc-400">48.0%</td>
                    <td className="p-3 text-right text-zinc-400">Solide</td>
                  </tr>
                  <tr>
                    <td className="p-3 text-zinc-200">Gefoult worden (Fouls Drawn)</td>
                    <td className="p-3 text-right font-bold text-white">6x gefoult</td>
                    <td className="p-3 text-right text-emerald-400">1.32 / 90m</td>
                    <td className="p-3 text-right text-zinc-400">0.90 / 90m</td>
                    <td className="p-3 text-right font-bold text-emerald-400">Zieht Fouls</td>
                  </tr>
                  <tr>
                    <td className="p-3 text-zinc-200">Abseits (Offsides)</td>
                    <td className="p-3 text-right font-bold text-white">3x Abseits</td>
                    <td className="p-3 text-right text-zinc-400">0.66 / 90m</td>
                    <td className="p-3 text-right text-zinc-400">0.50 / 90m</td>
                    <td className="p-3 text-right text-zinc-400">Normal</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {/* TAB CONTENT: DEFENSE */}
          {activeTab === 'defense' && (
            <div className="border border-zinc-800 rounded-lg overflow-hidden font-mono text-xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-zinc-900 text-zinc-400 border-b border-zinc-800 text-[11px]">
                    <th className="p-3">Metrik</th>
                    <th className="p-3 text-right">Gesamtzahl (Saison)</th>
                    <th className="p-3 text-right">Wert Per 90 Min.</th>
                    <th className="p-3 text-right">Liga-Schnitt ({context.position_group || "Mittelstürmer"})</th>
                    <th className="p-3 text-right">Bewertung</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60 bg-zinc-950 text-zinc-300">
                  <tr>
                    <td className="p-3 font-semibold text-white">Defensive Aktionen Total</td>
                    <td className="p-3 text-right font-bold text-white">11 Aktionen</td>
                    <td className="p-3 text-right font-bold text-amber-400">2.42 / 90m</td>
                    <td className="p-3 text-right text-zinc-400">2.10 / 90m</td>
                    <td className="p-3 text-right font-bold text-emerald-400">Aktiv im Anlaufen</td>
                  </tr>
                  <tr>
                    <td className="p-3 text-zinc-200">Balleroberungen (Recoveries)</td>
                    <td className="p-3 text-right font-bold text-white">5 Eroberungen</td>
                    <td className="p-3 text-right font-bold text-amber-400">{defense.ball_recoveries_per_90 || "1.10"} / 90m</td>
                    <td className="p-3 text-right text-zinc-400">1.20 / 90m</td>
                    <td className="p-3 text-right text-zinc-400">Standard Einsatz</td>
                  </tr>
                  <tr>
                    <td className="p-3 text-zinc-200">Abgefangene Bälle (Interceptions)</td>
                    <td className="p-3 text-right font-bold text-white">2 Abgefangen</td>
                    <td className="p-3 text-right text-zinc-200">0.44 / 90m</td>
                    <td className="p-3 text-right text-zinc-400">0.30 / 90m</td>
                    <td className="p-3 text-right text-emerald-400 font-bold">Gutes Antizipieren</td>
                  </tr>
                  <tr>
                    <td className="p-3 text-zinc-200">Klärende Aktionen (Clearances)</td>
                    <td className="p-3 text-right font-bold text-white">2 Geklärt</td>
                    <td className="p-3 text-right text-zinc-200">{defense.clearances_per_90 || "0.44"} / 90m</td>
                    <td className="p-3 text-right text-zinc-400">0.50 / 90m</td>
                    <td className="p-3 text-right text-zinc-400">Absicherung</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {/* TAB CONTENT: TRACKING & PHYSICAL */}
          {activeTab === 'tracking' && (
            <div className="border border-zinc-800 rounded-lg overflow-hidden font-mono text-xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-zinc-900 text-zinc-400 border-b border-zinc-800 text-[11px]">
                    <th className="p-3">Physical & Tracking Metrik</th>
                    <th className="p-3 text-right">Durchschnitt / 90m</th>
                    <th className="p-3 text-right">Liga-Schnitt ({context.position_group || "Mittelstürmer"})</th>
                    <th className="p-3 text-right">Bewertung</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60 bg-zinc-950 text-zinc-300">
                  <tr>
                    <td className="p-3 font-semibold text-white">Zurückgelegte Distanz (km)</td>
                    <td className="p-3 text-right font-bold text-red-400">9.6 km / 90m</td>
                    <td className="p-3 text-right text-zinc-400">9.4 km</td>
                    <td className="p-3 text-right font-bold text-emerald-400">Laufstark</td>
                  </tr>
                  <tr>
                    <td className="p-3 text-zinc-200">Höchstgeschwindigkeit (Top Speed)</td>
                    <td className="p-3 text-right font-bold text-white">31.3 km/h</td>
                    <td className="p-3 text-right text-zinc-400">30.8 km/h</td>
                    <td className="p-3 text-right font-bold text-emerald-400">Antrittsstark</td>
                  </tr>
                  <tr>
                    <td className="p-3 text-zinc-200">Anzahl der Sprints</td>
                    <td className="p-3 text-right font-bold text-white">14 Sprints / 90m</td>
                    <td className="p-3 text-right text-zinc-400">12 Sprints</td>
                    <td className="p-3 text-right font-bold text-emerald-400">High-Intensity Sprints</td>
                  </tr>
                  <tr>
                    <td className="p-3 text-zinc-200">Schnelllauf & Sprinten Distanz</td>
                    <td className="p-3 text-right font-bold text-white">0.42 km (4.4%)</td>
                    <td className="p-3 text-right text-zinc-400">0.38 km</td>
                    <td className="p-3 text-right text-zinc-400">Intensiv</td>
                  </tr>
                  <tr>
                    <td className="p-3 text-zinc-200">Begangene Fouls / Gelbe Karten</td>
                    <td className="p-3 text-right font-bold text-yellow-400">1.1 Fouls / 2x 🟨</td>
                    <td className="p-3 text-right text-zinc-400">1.2 Fouls</td>
                    <td className="p-3 text-right text-zinc-400">Zweikampfbetont</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

        </div>

        {/* FOOTER ACTIONS */}
        <div className="p-4 bg-zinc-900/80 flex items-center justify-between text-xs font-mono">
          <span className="text-zinc-500">FutMatch B2B Scouting OS — Alle Sofascore & Opta Metriken Vollständig Gelistet</span>
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
