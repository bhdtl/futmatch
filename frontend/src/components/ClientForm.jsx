import React from 'react';

const ARCHETYPE_MAP = {
  IV: "Ball-playing Defender / Aufbauspieler",
  LV: "Attacking Wing-Back / Schienenspieler",
  RV: "Defensive Full-Back / Zweikampfstark",
  DM: "Anchor Man / Balleroberer",
  ZM: "Box-to-Box Engine / Raumdeuter",
  LF: "Inside Forward / Dribbler",
  RF: "Winger / Flankengeber",
  MS: "Target Man / Knipser"
};

export default function ClientForm({ profile, onChange, onSubmit, loading }) {
  const currentArchetype = ARCHETYPE_MAP[profile.position] || "Universal Player";

  return (
    <section class="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 md:p-6 shadow-xl relative overflow-hidden">
      <div class="absolute top-0 right-0 w-96 h-96 bg-indigo-600/5 rounded-full blur-3xl pointer-events-none"></div>

      <div class="flex items-center justify-between mb-5">
        <div class="flex items-center gap-2">
          <div class="w-2 h-2 rounded-full bg-indigo-500"></div>
          <h2 class="text-base font-semibold text-slate-100">Klienten-Profil Eingabemaske</h2>
        </div>
        <span class="text-xs text-slate-400">Such-Kriterien für Algorithmus & Match-Score</span>
      </div>

      <form onSubmit={onSubmit} class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Dropdown 1: Position */}
        <div class="space-y-1.5">
          <label class="text-xs font-medium text-slate-300 flex items-center gap-1">
            <span>Position</span>
            <span class="text-indigo-400">*</span>
          </label>
          <select 
            name="position"
            value={profile.position} 
            onChange={onChange}
            class="w-full bg-slate-950 border border-slate-700 text-slate-100 text-sm rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
          >
            <option value="IV">Innenverteidiger (IV)</option>
            <option value="LV">Linksverteidiger (LV)</option>
            <option value="RV">Rechtsverteidiger (RV)</option>
            <option value="DM">Defensives Mittelfeld (6er)</option>
            <option value="ZM">Zentrales Mittelfeld (8er)</option>
            <option value="LF">Flügelstürmer Links (LF)</option>
            <option value="RF">Flügelstürmer Rechts (RF)</option>
            <option value="MS">Mittelstürmer (MS)</option>
          </select>
        </div>

        {/* Dropdown 2: Alter */}
        <div class="space-y-1.5">
          <label class="text-xs font-medium text-slate-300">Alter</label>
          <select 
            name="age_group"
            value={profile.age_group} 
            onChange={onChange}
            class="w-full bg-slate-950 border border-slate-700 text-slate-100 text-sm rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
          >
            <option value="18-21">18 - 21 Jahre (U21 Talent)</option>
            <option value="22-25">22 - 25 Jahre (Entwicklungsfähig)</option>
            <option value="26-29">26 - 29 Jahre (Bestes Alter)</option>
            <option value="30+">30+ Jahre (Erfahrener Profi)</option>
          </select>
        </div>

        {/* Dropdown 3: Starker Fuß */}
        <div class="space-y-1.5">
          <label class="text-xs font-medium text-slate-300">Starker Fuß</label>
          <select 
            name="preferred_foot"
            value={profile.preferred_foot} 
            onChange={onChange}
            class="w-full bg-slate-950 border border-slate-700 text-slate-100 text-sm rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
          >
            <option value="Links">Links (Linksfuß)</option>
            <option value="Rechts">Rechts (Rechtsfuß)</option>
            <option value="Beidfüßig">Beidfüßig (Beide)</option>
          </select>
        </div>

        {/* Dropdown 4: Vertragssituation */}
        <div class="space-y-1.5">
          <label class="text-xs font-medium text-slate-300">Vertragssituation</label>
          <select 
            name="contract_status"
            value={profile.contract_status} 
            onChange={onChange}
            class="w-full bg-slate-950 border border-slate-700 text-slate-100 text-sm rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
          >
            <option value="summer2025">Vertrag läuft im Sommer aus (Ablösefrei)</option>
            <option value="free">Sofort Vereinslos (Ablösefrei)</option>
            <option value="rest1y">Restvertrag 1 Jahr (Günstige Ablöse)</option>
            <option value="rest2y">Restvertrag 2+ Jahre (Leihe möglich)</option>
          </select>
        </div>

        {/* Info Row */}
        <div class="lg:col-span-3 flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-2">
          <div class="flex items-center gap-2">
            <span class="text-slate-500">Spieler-Archetyp:</span>
            <span class="px-2.5 py-1 bg-slate-800 text-indigo-300 rounded-lg font-medium border border-slate-700">
              {currentArchetype}
            </span>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-slate-500">Ziel-Märkte:</span>
            <span class="px-2.5 py-1 bg-slate-800 text-slate-300 rounded-lg border border-slate-700">
              DACH, Benelux & Ligue 2
            </span>
          </div>
        </div>

        <div class="lg:col-span-1 pt-2 flex justify-end">
          <button 
            type="submit" 
            disabled={loading}
            class="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm rounded-xl px-4 py-2.5 transition flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 disabled:opacity-50"
          >
            {loading ? (
              <span>Berechne Matches...</span>
            ) : (
              <>
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                <span>Club Matches berechnen</span>
              </>
            )}
          </button>
        </div>

      </form>
    </section>
  );
}
