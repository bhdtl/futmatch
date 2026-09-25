import React from 'react';

const ARCHETYPE_MAP = {
  ALL: "ALLE ROLLEN / KADER-EXPLORER",
  TW: "TORWART / REFLEXE & AUFBAU",
  IV: "BALL-PLAYING DEFENDER / AUFBAUSPIELER",
  LV: "ATTACKING WING-BACK / SCHIENENSPIELER",
  RV: "DEFENSIVE FULL-BACK / ZWEIKAMPFSTARK",
  DM: "ANCHOR MAN / BALLEROBERER",
  ZM: "BOX-TO-BOX ENGINE / RAUMDEUTER",
  OM: "PLAYMAKER / ZENTRALER KREATIVSPIELER",
  LF: "INSIDE FORWARD / DRIBBLER",
  RF: "WINGERS / FLANKENGEBER",
  MS: "TARGET MAN / KNIPSER"
};

export default function ClientForm({ profile, onChange, onSubmit, onReset, loading, selectedLeague, onLeagueChange }) {
  const currentPos = profile.position || "ALL";
  const currentArchetype = ARCHETYPE_MAP[currentPos] || "ALLE ROLLEN / KADER-EXPLORER";

  return (
    <section className="border border-zinc-800 rounded-lg bg-zinc-900/40 p-5 space-y-4 font-sans shadow-sm">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span className="text-xs font-mono text-emerald-500 uppercase tracking-wider font-bold">01 / KLIENTEN- & VAKANZEN-EXPLORER (SAISON 2026/27)</span>
        </div>
        {onReset && (
          <button 
            type="button" 
            onClick={onReset}
            className="text-xs font-mono text-zinc-500 hover:text-zinc-300 transition underline"
          >
            ZURÜCKSETZEN
          </button>
        )}
      </div>

      <form onSubmit={onSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 text-xs font-mono">
        
        {/* Position */}
        <div>
          <label className="block text-zinc-400 mb-1 font-bold">POSITION</label>
          <select 
            name="position"
            value={profile.position || 'ALL'} 
            onChange={onChange}
            className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-white focus:outline-none focus:border-emerald-600 cursor-pointer font-sans"
          >
            <option value="ALL">Alle Positionen (Beliebig)</option>
            <option value="TW">Torwart (TW)</option>
            <option value="IV">Innenverteidiger (IV)</option>
            <option value="LV">Linksverteidiger (LV)</option>
            <option value="RV">Rechtsverteidiger (RV)</option>
            <option value="DM">Defensives Mittelfeld (DM / 6er)</option>
            <option value="ZM">Zentrales Mittelfeld (ZM / 8er)</option>
            <option value="OM">Offensives Mittelfeld (OM / 10er)</option>
            <option value="LF">Flügelstürmer Links (LF)</option>
            <option value="RF">Flügelstürmer Rechts (RF)</option>
            <option value="MS">Mittelstürmer (MS)</option>
          </select>
        </div>

        {/* Ligen-Filter */}
        <div>
          <label className="block text-zinc-400 mb-1 font-bold">LIGA-FILTER</label>
          <select 
            value={selectedLeague || 'ALL'} 
            onChange={(e) => onLeagueChange(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-white focus:outline-none focus:border-emerald-600 cursor-pointer font-sans"
          >
            <option value="ALL">Alle Ligen (Beliebig)</option>
            <option value="Bundesliga">Bundesliga</option>
            <option value="2. Bundesliga">2. Bundesliga</option>
            <option value="Jupiler Pro League">Jupiler Pro League (Belgien)</option>
          </select>
        </div>

        {/* Altersklasse */}
        <div>
          <label className="block text-zinc-400 mb-1 font-bold">ALTERSKLASSE</label>
          <select 
            name="age_group"
            value={profile.age_group || 'ALL'} 
            onChange={onChange}
            className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-white focus:outline-none focus:border-emerald-600 cursor-pointer font-sans"
          >
            <option value="ALL">Beliebiges Alter (Alle)</option>
            <option value="18-21">18 - 21 Jahre (Talent)</option>
            <option value="22-25">22 - 25 Jahre (Prime Entw.)</option>
            <option value="26-29">26 - 29 Jahre (Etabliert)</option>
            <option value="30+">30+ Jahre (Erfahren)</option>
          </select>
        </div>

        {/* Starker Fuß */}
        <div>
          <label className="block text-zinc-400 mb-1 font-bold">STARKER FUSS</label>
          <select 
            name="preferred_foot"
            value={profile.preferred_foot || 'ALL'} 
            onChange={onChange}
            className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-white focus:outline-none focus:border-emerald-600 cursor-pointer font-sans"
          >
            <option value="ALL">Beliebiger Fuß (Alle)</option>
            <option value="Rechts">Rechtsfuß</option>
            <option value="Links">Linksfuß</option>
            <option value="Beidfüßig">Beidfüßig</option>
          </select>
        </div>

        {/* Vertragssituation */}
        <div>
          <label className="block text-zinc-400 mb-1 font-bold">VERTRAGSSTATUS</label>
          <select 
            name="contract_status"
            value={profile.contract_status || 'ALL'} 
            onChange={onChange}
            className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-white focus:outline-none focus:border-emerald-600 cursor-pointer font-sans"
          >
            <option value="ALL">Beliebiger Vertragsstatus</option>
            <option value="summer2027">Vertrag läuft 2027 aus</option>
            <option value="summer2028">Vertrag läuft 2028 aus</option>
            <option value="free">Sofort Vereinslos (Ablösefrei)</option>
            <option value="rest1y">Restvertrag 1 Jahr</option>
          </select>
        </div>

        {/* Info & Action Row */}
        <div className="lg:col-span-3 flex flex-wrap items-center gap-3 text-[11px] pt-1">
          <span className="text-zinc-500 font-bold">ARCHETYP:</span>
          <span className="px-2.5 py-1 rounded bg-zinc-950 border border-zinc-800 text-emerald-400 font-bold">
            {currentArchetype}
          </span>
        </div>

        <div className="lg:col-span-2 pt-1 flex justify-end">
          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded uppercase tracking-wider font-mono text-xs transition disabled:opacity-40 shadow-sm"
          >
            {loading ? "BERECHNE VAKANZEN..." : "KADER-MATCHING STARTEN"}
          </button>
        </div>

      </form>
    </section>
  );
}
