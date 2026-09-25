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

export default function ClientForm({ profile, onChange, onSubmit, onReset, loading }) {
  const currentArchetype = profile.position ? ARCHETYPE_MAP[profile.position] : "Wählen Sie eine Position aus";

  return (
    <section class="bg-zinc-900/80 backdrop-blur-md border border-zinc-800/80 rounded-2xl p-5 md:p-6 shadow-2xl relative overflow-hidden">
      <div class="flex items-center justify-between mb-5">
        <div class="flex items-center gap-2">
          <span class="text-emerald-400 text-xs font-mono">01/</span>
          <h3 class="text-xs font-semibold text-zinc-100 uppercase tracking-wider">Klienten-Profil Parameter</h3>
        </div>
        {onReset && (
          <button 
            type="button" 
            onClick={onReset}
            class="text-xs text-zinc-400 hover:text-zinc-200 transition"
          >
            Formular zurücksetzen
          </button>
        )}
      </div>

      <form onSubmit={onSubmit} class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Position */}
        <div class="space-y-1.5">
          <label class="text-xs font-medium text-zinc-300">Position</label>
          <select 
            name="position"
            value={profile.position || ''} 
            onChange={onChange}
            class="w-full bg-zinc-950 border border-zinc-800 text-zinc-100 text-xs rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
          >
            <option value="" disabled>— Position wählen —</option>
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

        {/* Alter */}
        <div class="space-y-1.5">
          <label class="text-xs font-medium text-zinc-300">Alter</label>
          <select 
            name="age_group"
            value={profile.age_group} 
            onChange={onChange}
            class="w-full bg-zinc-950 border border-zinc-800 text-zinc-100 text-xs rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
          >
            <option value="18-21">18 - 21 Jahre (Talent)</option>
            <option value="22-25">22 - 25 Jahre (Prime Start)</option>
            <option value="26-29">26 - 29 Jahre (Erfahren)</option>
            <option value="30+">30+ Jahre (Routinier)</option>
          </select>
        </div>

        {/* Starker Fuß */}
        <div class="space-y-1.5">
          <label class="text-xs font-medium text-zinc-300">Starker Fuß</label>
          <select 
            name="preferred_foot"
            value={profile.preferred_foot} 
            onChange={onChange}
            class="w-full bg-zinc-950 border border-zinc-800 text-zinc-100 text-xs rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
          >
            <option value="Links">Links (Linksfuß)</option>
            <option value="Rechts">Rechts (Rechtsfuß)</option>
            <option value="Beidfüßig">Beidfüßig (Beide)</option>
          </select>
        </div>

        {/* Vertragssituation */}
        <div class="space-y-1.5">
          <label class="text-xs font-medium text-zinc-300">Vertragssituation</label>
          <select 
            name="contract_status"
            value={profile.contract_status} 
            onChange={onChange}
            class="w-full bg-zinc-950 border border-zinc-800 text-zinc-100 text-xs rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
          >
            <option value="summer2025">Vertrag läuft Sommer 2025 aus (Ablösefrei)</option>
            <option value="free">Sofort Vereinslos (Ablösefrei)</option>
            <option value="rest1y">Restvertrag 1 Jahr</option>
            <option value="rest2y">Restvertrag 2+ Jahre</option>
          </select>
        </div>

        {/* Info & Action Row */}
        <div class="lg:col-span-3 flex flex-wrap items-center gap-3 text-xs text-zinc-400 pt-2">
          <span class="text-zinc-500">Erkannter Archetyp:</span>
          <span class={`px-2.5 py-1 bg-zinc-950 rounded-lg border border-zinc-800 font-mono text-[11px] ${profile.position ? 'text-emerald-400' : 'text-zinc-500'}`}>
            {currentArchetype}
          </span>
        </div>

        <div class="lg:col-span-1 pt-2 flex justify-end">
          <button 
            type="submit" 
            disabled={loading || !profile.position}
            class="w-full bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs rounded-xl px-4 py-2.5 transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span>Analysiere FutMatch Data...</span>
            ) : (
              <>
                <span>Match-Analyse starten</span>
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
              </>
            )}
          </button>
        </div>

      </form>
    </section>
  );
}
