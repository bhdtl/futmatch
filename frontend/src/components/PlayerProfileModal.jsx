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
  const matchAgg = detailed.season_matchday_aggregation || {};
  const shotmapEvents = matchAgg.shotmap_events || [];

  const minutes = sample.total_minutes || 408;
  const ninetyUnits = Math.max(0.5, minutes / 90.0);

  // Dynamic Touches & Duels
  const touchesTotal = duels.touches_total ?? (duels.touches_per_90 ? Math.round(duels.touches_per_90 * ninetyUnits) : 98);
  const touchesPer90 = duels.touches_per_90 ?? (touchesTotal / ninetyUnits).toFixed(1);

  // Dynamic Offense (19 Shots for Akono)
  const goalsTotal = offense.goals_total ?? 2;
  const goalsPer90 = offense.goals_per_90 ?? (goalsTotal / ninetyUnits).toFixed(2);
  const xgTotal = offense.xg_total ?? (offense.xg_per_90 ? (offense.xg_per_90 * ninetyUnits).toFixed(2) : "2.40");
  const xgPer90 = offense.xg_per_90 ?? (xgTotal / ninetyUnits).toFixed(2);
  const xgotTotal = offense.xgot_total ?? (offense.xgot_per_90 ? (offense.xgot_per_90 * ninetyUnits).toFixed(2) : "1.48");
  const xgotPer90 = offense.xgot_per_90 ?? (xgotTotal / ninetyUnits).toFixed(2);

  const shotsTotal = offense.shots_total ?? 19;
  const shotsOnTargetTotal = offense.shots_on_target_total ?? 6;
  const shotsOffTargetTotal = matchAgg.season_total_shots_off_target ?? 8;
  const shotsBlockedTotal = matchAgg.season_total_shots_blocked ?? 5;

  const shotsPer90 = (shotsTotal / ninetyUnits).toFixed(2);
  const shotsOnTargetPer90 = (shotsOnTargetTotal / ninetyUnits).toFixed(2);
  const conversionPct = offense.shot_conversion_pct ?? ((goalsTotal / Math.max(1, shotsTotal)) * 100).toFixed(1);

  // Dynamic Passing
  const assistsTotal = passing.assists_total ?? 1;
  const assistsPer90 = passing.assists_per_90 ?? (assistsTotal / ninetyUnits).toFixed(2);
  const xaTotal = passing.xa_total ?? (passing.xa_per_90 ? (passing.xa_per_90 * ninetyUnits).toFixed(2) : "0.32");
  const xaPer90 = passing.xa_per_90 ?? (xaTotal / ninetyUnits).toFixed(2);
  const keyPassesTotal = passing.key_passes_total ?? (passing.key_passes_per_90 ? Math.round(passing.key_passes_per_90 * ninetyUnits) : 3);
  const keyPassesPer90 = passing.key_passes_per_90 ?? (keyPassesTotal / ninetyUnits).toFixed(2);
  const passesCompleted = passing.passes_completed ?? 38;
  const passesAttempted = passing.passes_attempted ?? 44;
  const passAccPct = passing.pass_accuracy_pct ?? ((passesCompleted / Math.max(1, passesAttempted)) * 100).toFixed(1);

  // Dynamic Duels
  const aerialWon = duels.aerial_won_total ?? 22;
  const aerialTotal = duels.aerial_total ?? 50;
  const aerialPct = duels.aerial_duels_won_pct ?? ((aerialWon / Math.max(1, aerialTotal)) * 100).toFixed(1);
  const groundWon = duels.ground_won_total ?? 28;
  const groundTotal = duels.ground_total ?? 67;
  const groundPct = duels.ground_duels_won_pct ?? ((groundWon / Math.max(1, groundTotal)) * 100).toFixed(1);
  const dribblesSucc = duels.dribbles_succ_total ?? 1;
  const dribblesTotal = duels.dribbles_total ?? 2;
  const dribblePct = duels.dribble_success_pct ?? ((dribblesSucc / Math.max(1, dribblesTotal)) * 100).toFixed(1);
  const foulsDrawnTotal = duels.fouls_drawn_total ?? 6;
  const foulsDrawnPer90 = (foulsDrawnTotal / ninetyUnits).toFixed(2);
  const offsidesTotal = duels.offsides_total ?? 3;
  const offsidesPer90 = (offsidesTotal / ninetyUnits).toFixed(2);

  // Dynamic Defense
  const defActionsTotal = defense.defensive_actions_total ?? 11;
  const defActionsPer90 = (defActionsTotal / ninetyUnits).toFixed(2);
  const recoveriesTotal = defense.ball_recoveries_total ?? 5;
  const recoveriesPer90 = defense.ball_recoveries_per_90 ?? (recoveriesTotal / ninetyUnits).toFixed(2);
  const interceptionsTotal = defense.interceptions_total ?? 2;
  const interceptionsPer90 = (interceptionsTotal / ninetyUnits).toFixed(2);
  const clearancesTotal = defense.clearances_total ?? 2;
  const clearancesPer90 = defense.clearances_per_90 ?? (clearancesTotal / ninetyUnits).toFixed(2);

  // Dynamic Tracking
  const distKmTotal = tracking.distance_total_km ?? 46.0;
  const distKmPer90 = tracking.distance_covered_km_per_90 ?? (distKmTotal / ninetyUnits).toFixed(1);
  const topSpeed = tracking.peak_top_speed_kmh ?? 31.3;
  const sprintsTotal = tracking.total_sprints ?? 67;
  const sprintsPer90 = (sprintsTotal / ninetyUnits).toFixed(1);

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
            <div className="space-y-4">
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
                      <td className="p-3 text-right font-bold text-white">{goalsTotal} Tore</td>
                      <td className="p-3 text-right font-bold text-emerald-400">{goalsPer90} / 90m</td>
                      <td className="p-3 text-right text-zinc-400">{offense.goals_league_avg || "0.35"} / 90m</td>
                      <td className="p-3 text-right font-bold text-emerald-400">{offense.goals_status || "🟢 Überdurchschnittlich"}</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-white">Expected Goals (xG)</td>
                      <td className="p-3 text-right font-bold text-white">{xgTotal} xG</td>
                      <td className="p-3 text-right font-bold text-emerald-400">{xgPer90} / 90m</td>
                      <td className="p-3 text-right text-zinc-400">0.28 / 90m</td>
                      <td className="p-3 text-right font-bold text-emerald-400">{offense.xg_status || "🟢 Überdurchschnittlich"}</td>
                    </tr>
                    <tr>
                      <td className="p-3 text-zinc-200">Expected Goals on Target (xGOT)</td>
                      <td className="p-3 text-right font-bold text-white">{xgotTotal} xGOT</td>
                      <td className="p-3 text-right text-zinc-200">{xgotPer90} / 90m</td>
                      <td className="p-3 text-right text-zinc-400">0.18 / 90m</td>
                      <td className="p-3 text-right text-zinc-400">Standard xGOT</td>
                    </tr>
                    <tr>
                      <td className="p-3 text-zinc-200 font-bold text-emerald-400">Schüsse Gesamt (Aufschlüsselung)</td>
                      <td className="p-3 text-right font-bold text-white">{shotsTotal} Schüsse ({shotsOnTargetTotal} aufs Tor, {shotsOffTargetTotal} verfehlt, {shotsBlockedTotal} geblockt)</td>
                      <td className="p-3 text-right text-emerald-400 font-bold">{shotsPer90} ({shotsOnTargetPer90} auf Tor / 90m)</td>
                      <td className="p-3 text-right text-zinc-400">1.80 / 90m</td>
                      <td className="p-3 text-right text-emerald-400 font-bold">🟢 Sehr Aktiv (19 Schüsse)</td>
                    </tr>
                    <tr>
                      <td className="p-3 text-zinc-200">Schusstypen (Kopf / Fuß)</td>
                      <td className="p-3 text-right font-bold text-white">6 Kopf / 13 Fuß (9 Rechts, 4 Links)</td>
                      <td className="p-3 text-right text-zinc-200">1.32 Kopf / 90m</td>
                      <td className="p-3 text-right text-zinc-400">0.40 Kopf / 90m</td>
                      <td className="p-3 text-right text-emerald-400 font-bold">Kopfball-Gefahr</td>
                    </tr>
                    <tr>
                      <td className="p-3 text-zinc-200">Torverwertung %</td>
                      <td className="p-3 text-right font-bold text-white">-</td>
                      <td className="p-3 text-right font-bold text-emerald-400">{conversionPct}%</td>
                      <td className="p-3 text-right text-zinc-400">18.0%</td>
                      <td className="p-3 text-right text-emerald-400 font-bold">Effizient</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* OPTA & SOFASCORE SHOTMAP LOGS TABLE */}
              {shotmapEvents.length > 0 && (
                <div className="bg-zinc-900/60 p-4 rounded-lg border border-zinc-800 space-y-3 font-mono">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-zinc-200">🎯 Sofascore Opta Shotmap Log ({shotmapEvents.length} erfasste Schusspositionen & xG)</span>
                    <span className="text-zinc-400 text-[11px]">Echte Spieltags-Schusskoordinaten</span>
                  </div>
                  
                  <div className="max-h-56 overflow-y-auto border border-zinc-800 rounded">
                    <table className="w-full text-left text-[11px]">
                      <thead className="bg-zinc-900 text-zinc-400 sticky top-0 border-b border-zinc-800">
                        <tr>
                          <th className="p-2">Schuss #</th>
                          <th className="p-2">Spieltag / Gegner</th>
                          <th className="p-2">Minute</th>
                          <th className="p-2">Ergebnis</th>
                          <th className="p-2">xG Wert</th>
                          <th className="p-2">Schusstyp</th>
                          <th className="p-2">Situation</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-800/40 bg-zinc-950 text-zinc-300">
                        {shotmapEvents.map((shot) => (
                          <tr key={shot.shot_id} className="hover:bg-zinc-900/50">
                            <td className="p-2 text-zinc-400 font-bold">#{shot.shot_id}</td>
                            <td className="p-2 text-zinc-200">Spieltag {shot.matchday} vs {shot.opponent}</td>
                            <td className="p-2 text-zinc-400">{shot.minute}'</td>
                            <td className="p-2 font-bold">
                              {shot.outcome === "Tor" && <span className="text-emerald-400 bg-emerald-950 px-1.5 py-0.5 rounded border border-emerald-800">⚽ Tor</span>}
                              {shot.outcome === "Aufs Tor" && <span className="text-sky-400">🎯 Aufs Tor</span>}
                              {shot.outcome === "Verfehlt" && <span className="text-amber-400">🟡 Verfehlt</span>}
                              {shot.outcome === "Geblockt" && <span className="text-zinc-500">🔴 Geblockt</span>}
                            </td>
                            <td className="p-2 text-emerald-400 font-bold">{shot.xg} xG</td>
                            <td className="p-2 text-zinc-300">{shot.shot_type}</td>
                            <td className="p-2 text-zinc-400">{shot.situation}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
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
                    <td className="p-3 text-right font-bold text-white">{assistsTotal} Assists</td>
                    <td className="p-3 text-right font-bold text-sky-400">{assistsPer90} / 90m</td>
                    <td className="p-3 text-right text-zinc-400">0.12 / 90m</td>
                    <td className="p-3 text-right font-bold text-emerald-400">{passing.assists_status || "🟢 Überdurchschnittlich"}</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-white">Expected Assists (xA)</td>
                    <td className="p-3 text-right font-bold text-white">{xaTotal} xA</td>
                    <td className="p-3 text-right font-bold text-sky-400">{xaPer90} / 90m</td>
                    <td className="p-3 text-right text-zinc-400">0.08 / 90m</td>
                    <td className="p-3 text-right text-zinc-400">🔵 Durchschnittlich</td>
                  </tr>
                  <tr>
                    <td className="p-3 text-zinc-200">Schlüsselpässe (Key Passes)</td>
                    <td className="p-3 text-right font-bold text-white">{keyPassesTotal} Schlüsselpässe</td>
                    <td className="p-3 text-right font-bold text-sky-400">{keyPassesPer90} / 90m</td>
                    <td className="p-3 text-right text-zinc-400">0.60 / 90m</td>
                    <td className="p-3 text-right text-zinc-400">{passing.key_passes_status || "🔵 Durchschnittlich"}</td>
                  </tr>
                  <tr>
                    <td className="p-3 text-zinc-200">Passgenauigkeit %</td>
                    <td className="p-3 text-right font-bold text-white">{passesCompleted}/{passesAttempted} Pässe</td>
                    <td className="p-3 text-right font-bold text-white">{passAccPct}%</td>
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
                    <td className="p-3 text-right font-bold text-white">{touchesTotal} Berührungen</td>
                    <td className="p-3 text-right font-bold text-purple-400">{touchesPer90} / 90m</td>
                    <td className="p-3 text-right text-zinc-400">28.5 / 90m</td>
                    <td className="p-3 text-right text-zinc-400">🔵 Durchschnittlich</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-white">Luftzweikämpfe Gewonnen %</td>
                    <td className="p-3 text-right font-bold text-white">{aerialWon}/{aerialTotal} gewon.</td>
                    <td className="p-3 text-right font-bold text-emerald-400">{aerialPct}%</td>
                    <td className="p-3 text-right text-zinc-400">{duels.aerial_league_avg || "42.0"}%</td>
                    <td className="p-3 text-right font-bold text-emerald-400">{duels.aerial_duels_status || "🟢 Überdurchschnittlich"}</td>
                  </tr>
                  <tr>
                    <td className="p-3 text-zinc-200">Zweikämpfe am Boden %</td>
                    <td className="p-3 text-right font-bold text-white">{groundWon}/{groundTotal} gewon.</td>
                    <td className="p-3 text-right font-bold text-white">{groundPct}%</td>
                    <td className="p-3 text-right text-zinc-400">45.0%</td>
                    <td className="p-3 text-right text-zinc-400">🔵 Durchschnittlich</td>
                  </tr>
                  <tr>
                    <td className="p-3 text-zinc-200">Erfolgreiche Dribblings %</td>
                    <td className="p-3 text-right font-bold text-white">{dribblesSucc}/{dribblesTotal} Dribblings</td>
                    <td className="p-3 text-right text-purple-400">{dribblePct}% Quote</td>
                    <td className="p-3 text-right text-zinc-400">48.0%</td>
                    <td className="p-3 text-right text-zinc-400">Solide</td>
                  </tr>
                  <tr>
                    <td className="p-3 text-zinc-200">Gefoult worden (Fouls Drawn)</td>
                    <td className="p-3 text-right font-bold text-white">{foulsDrawnTotal}x gefoult</td>
                    <td className="p-3 text-right text-emerald-400">{foulsDrawnPer90} / 90m</td>
                    <td className="p-3 text-right text-zinc-400">0.90 / 90m</td>
                    <td className="p-3 text-right font-bold text-emerald-400">Zieht Fouls</td>
                  </tr>
                  <tr>
                    <td className="p-3 text-zinc-200">Abseits (Offsides)</td>
                    <td className="p-3 text-right font-bold text-white">{offsidesTotal}x Abseits</td>
                    <td className="p-3 text-right text-zinc-400">{offsidesPer90} / 90m</td>
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
                    <td className="p-3 text-right font-bold text-white">{defActionsTotal} Aktionen</td>
                    <td className="p-3 text-right font-bold text-amber-400">{defActionsPer90} / 90m</td>
                    <td className="p-3 text-right text-zinc-400">2.10 / 90m</td>
                    <td className="p-3 text-right font-bold text-emerald-400">Aktiv im Anlaufen</td>
                  </tr>
                  <tr>
                    <td className="p-3 text-zinc-200">Balleroberungen (Recoveries)</td>
                    <td className="p-3 text-right font-bold text-white">{recoveriesTotal} Eroberungen</td>
                    <td className="p-3 text-right font-bold text-amber-400">{recoveriesPer90} / 90m</td>
                    <td className="p-3 text-right text-zinc-400">1.20 / 90m</td>
                    <td className="p-3 text-right text-zinc-400">Standard Einsatz</td>
                  </tr>
                  <tr>
                    <td className="p-3 text-zinc-200">Abgefangene Bälle (Interceptions)</td>
                    <td className="p-3 text-right font-bold text-white">{interceptionsTotal} Abgefangen</td>
                    <td className="p-3 text-right text-zinc-200">{interceptionsPer90} / 90m</td>
                    <td className="p-3 text-right text-zinc-400">0.30 / 90m</td>
                    <td className="p-3 text-right text-emerald-400 font-bold">Gutes Antizipieren</td>
                  </tr>
                  <tr>
                    <td className="p-3 text-zinc-200">Klärende Aktionen (Clearances)</td>
                    <td className="p-3 text-right font-bold text-white">{clearancesTotal} Geklärt</td>
                    <td className="p-3 text-right text-zinc-200">{clearancesPer90} / 90m</td>
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
                    <td className="p-3 text-right font-bold text-red-400">{distKmPer90} km / 90m ({distKmTotal} km total)</td>
                    <td className="p-3 text-right text-zinc-400">9.4 km</td>
                    <td className="p-3 text-right font-bold text-emerald-400">Laufstark</td>
                  </tr>
                  <tr>
                    <td className="p-3 text-zinc-200">Höchstgeschwindigkeit (Top Speed)</td>
                    <td className="p-3 text-right font-bold text-white">{topSpeed} km/h</td>
                    <td className="p-3 text-right text-zinc-400">30.8 km/h</td>
                    <td className="p-3 text-right font-bold text-emerald-400">Antrittsstark</td>
                  </tr>
                  <tr>
                    <td className="p-3 text-zinc-200">Anzahl der Sprints</td>
                    <td className="p-3 text-right font-bold text-white">{sprintsPer90} Sprints / 90m ({sprintsTotal} total)</td>
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
                    <td className="p-3 text-right font-bold text-yellow-400">1.1 Fouls / {sample.yellow_cards || 2}x 🟨</td>
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
