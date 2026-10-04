import React, { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function PlayerSearchBar({ onSelectPlayer }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleSearch = async (val) => {
    setQuery(val);
    if (!val || val.length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    setLoading(true);
    try {
      const { data: clubs, error } = await supabase.from('clubs').select('id, name, league, squad_profile');
      if (error) throw error;

      const matchedPlayers = [];
      const searchLower = val.toLowerCase().trim();

      for (const club of (clubs || [])) {
        const squadProfile = club.squad_profile || {};
        const fullSquad = squadProfile.full_squad_2027 || [];
        for (const p of fullSquad) {
          if (p.name && p.name.toLowerCase().includes(searchLower)) {
            matchedPlayers.push({
              ...p,
              club_id: club.id,
              club_name: club.name,
              league: club.league
            });
          }
          if (matchedPlayers.length >= 8) break;
        }
        if (matchedPlayers.length >= 8) break;
      }

      setResults(matchedPlayers);
      setIsOpen(matchedPlayers.length > 0);
    } catch (err) {
      console.error('[PlayerSearch Error]', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (p) => {
    setIsOpen(false);
    setQuery('');
    if (onSelectPlayer) {
      onSelectPlayer(p);
    }
  };

  return (
    <div className="relative w-full max-w-md">
      <div className="relative">
        <input 
          type="text" 
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="🔍 Spieler suchen (z. B. Cyrill Akono, Harry Kane)..."
          className="w-full bg-zinc-900 border border-zinc-700/80 rounded-lg px-3.5 py-2 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-emerald-500 font-mono transition"
        />
        {loading && (
          <div className="absolute right-3 top-2.5 text-xs text-emerald-400 font-mono animate-pulse">
            ...
          </div>
        )}
      </div>

      {/* AUTOCOMPLETE DROPDOWN */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1.5 bg-zinc-900 border border-zinc-700 rounded-lg shadow-2xl overflow-hidden z-50 divide-y divide-zinc-800 max-h-80 overflow-y-auto">
          {results.map((p, idx) => (
            <div 
              key={idx}
              onClick={() => handleSelect(p)}
              className="p-3 hover:bg-zinc-800 cursor-pointer flex items-center justify-between transition font-mono text-xs"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-zinc-950 border border-zinc-800 flex-shrink-0 overflow-hidden">
                  <img 
                    src={p.portrait_url || "https://img.a.transfermarkt.technology/portrait/header/default.jpg"} 
                    alt={p.name} 
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.src = "https://img.a.transfermarkt.technology/portrait/header/default.jpg"; }}
                  />
                </div>
                <div>
                  <div className="font-bold text-white">{p.name}</div>
                  <div className="text-[10px] text-zinc-400">{p.club_name} • {p.position}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-emerald-400 font-bold text-[11px]">{p.market_value || "-"}</div>
                <div className="text-[10px] text-amber-400">{p.contract_until ? `Vertrag ${p.contract_until}` : "2027"}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
