import React from 'react';

const ARCHETYPE_MAP = {
  IV: "BALL-PLAYING DEFENDER / AUFBAUSPIELER",
  LV: "ATTACKING WING-BACK / SCHIENENSPIELER",
  RV: "DEFENSIVE FULL-BACK / ZWEIKAMPFSTARK",
  DM: "ANCHOR MAN / BALLEROBERER",
  ZM: "BOX-TO-BOX ENGINE / RAUMDEUTER",
  LF: "INSIDE FORWARD / DRIBBLER",
  RF: "WINGERS / FLANKENGEBER",
  MS: "TARGET MAN / KNIPSER"
};

export default function ClientForm({ profile, onChange, onSubmit, onReset, loading }) {
  const currentArchetype = profile.position ? ARCHETYPE_MAP[profile.position] : "WÄHLEN SIE EINE POSITION";

  return (
    <section className="border border-zinc-800 rounded-lg bg-zinc-900/40 p-5 space-y-4 font-sans">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
        <span className="text-xs font-mono text-emerald-500 uppercase tracking-wider">01 / KLIENTEN-PARAMETER</span>
        {onReset && (
          <button 
            type="button" 
            onClick={onReset}
            className="text-xs font-mono text-zinc-500 hover:text-zinc-300 transition"
          >
            ZURÜCKSETZEN
          </button>
        )}
      </div>

      <form onSubmit={onSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
        
        {/* Position */}
        <div>
          <label className="block text-zinc-400 mb-1">POSITION *</label>
          <select 
            name="position"
            value={profile.position || ''} 
            onChange={onChange}
            className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-white focus:outline-none focus:border-emerald-600 cursor-pointer"
          >
            <option value="" disabled>— Wählen —</option>
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
        <div>
          <label className="block text-zinc-400 mb-1">ALTERSKLASSE</label>
          <select 
            name="age_group"
            value={profile.age_group} 
            onChange={onChange}
            className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-white focus:outline-none focus:border-emerald-600 cursor-pointer"
          >
            <option value="18-21">18 - 21 Jahre</option>
            <option value="22-25">22 - 25 Jahre</option>
            <option value="26-29">26 - 29 Jahre</option>
            <option value="30+">30+ Jahre</option>
          </select>
        </div>

        {/* Starker Fuß */}
        <div>
          <label className="block text-zinc-400 mb-1">STARKER FUSS</label>
          <select 
            name="preferred_foot"
            value={profile.preferred_foot} 
            onChange={onChange}
            className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-white focus:outline-none focus:border-emerald-600 cursor-pointer"
          >
            <option value="Links">Linksfuß</option>
            <option value="Rechts">Rechtsfuß</option>
            <option value="Beidfüßig">Beidfüßig</option>
          </select>
        </div>

        {/* Vertragssituation */}
        <div>
          <label className="block text-zinc-400 mb-1">VERTRAGSSTATUS</label>
          <select 
            name="contract_status"
            value={profile.contract_status} 
            onChange={onChange}
            className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-white focus:outline-none focus:border-emerald-600 cursor-pointer"
          >
            <option value="summer2025">Auslaufend Juni 2025</option>
            <option value="free">Sofort Vereinslos</option>
            <option value="rest1y">Restvertrag 1 Jahr</option>
            <option value="rest2y">Restvertrag 2+ Jahre</option>
          </select>
        </div>

        {/* Info & Action Row */}
        <div className="lg:col-span-3 flex items-center gap-3 text-[11px] pt-1">
          <span className="text-zinc-500">ARCHETYP:</span>
          <span className={`px-2 py-0.5 rounded bg-zinc-950 border border-zinc-800 ${profile.position ? 'text-emerald-400 font-bold' : 'text-zinc-500'}`}>
            {currentArchetype}
          </span>
        </div>

        <div className="lg:col-span-1 pt-1 flex justify-end">
          <button 
            type="submit" 
            disabled={loading || !profile.position}
            className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded uppercase tracking-wider font-mono text-xs transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? "BERECHNE..." : "MATCHING STARTEN"}
          </button>
        </div>

      </form>
    </section>
  );
}
