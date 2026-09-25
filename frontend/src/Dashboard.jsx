import React, { useState, useEffect } from 'react';

// Mock Data for fallback
const INITIAL_CLUBS = [
  { id: '1', name: 'FC St. Pauli', league: 'Bundesliga / 2. Bundesliga', score: 94, fit: 'Vertrag auf IV läuft im Sommer aus, Coach spielt Dreierkette (3-4-2-1), Linksfuß als Aufbau-IV gesucht.' },
  { id: '2', name: 'KV Mechelen', league: 'Jupiler Pro League (Belgien)', score: 91, fit: 'Stamm-IV vor Wechsel in Serie A. Suchen ballfesten Innenverteidiger für hohes Pressingsystem.' },
  { id: '3', name: 'SV Elversberg', league: '2. Bundesliga', score: 87, fit: 'Spielstarke Abwehr benötigt. Hohe Passquote im Spielaufbau gefordert (K-Means Match 89%).' },
  { id: '4', name: 'Fortuna Düsseldorf', league: '2. Bundesliga', score: 84, fit: 'Zwei Abwehrverträge laufen aus. Budget für ablösefreie Spieler reserviert.' },
  { id: '5', name: 'KAA Gent', league: 'Jupiler Pro League (Belgien)', score: 79, fit: 'Kader-Tiefe auf IV gering. Suchen physisch starken Vorstopper als Ergänzung.' }
];

export default function Dashboard() {
  const [position, setPosition] = useState('IV');
  const [age, setAge] = useState('22-25');
  const [foot, setFoot] = useState('Links');
  const [contract, setContract] = useState('summer2025');
  const [clubs, setClubs] = useState(INITIAL_CLUBS);
  const [selectedClub, setSelectedClub] = useState(null);

  const handleMatching = (e) => {
    if (e) e.preventDefault();
    // Simulate dynamic scoring update
    const updated = clubs.map((c, i) => ({
      ...c,
      score: Math.min(98, Math.max(70, c.score + (position === 'IV' ? 2 : -5)))
    }));
    setClubs(updated);
  };

  return (
    <div class="min-h-screen bg-slate-950 text-slate-100 p-6 font-sans">
      <div class="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <header class="flex justify-between items-center pb-6 border-b border-slate-800">
          <div class="flex items-center gap-3">
            <div class="h-10 w-10 rounded-xl bg-indigo-600 flex items-center justify-center font-bold text-xl">⚽</div>
            <div>
              <h1 class="text-xl font-bold text-white">MatchScout B2B</h1>
              <p class="text-xs text-slate-400">Club-Matching Platform für Spielerberater</p>
            </div>
          </div>
        </header>

        {/* Input Form */}
        <section class="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <h2 class="text-base font-semibold text-slate-100 mb-4">Klienten-Profil Eingabemaske</h2>
          <form onSubmit={handleMatching} class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label class="text-xs font-medium text-slate-300 block mb-1">Position</label>
              <select value={position} onChange={(e) => setPosition(e.target.value)} class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100">
                <option value="IV">Innenverteidiger (IV)</option>
                <option value="LV">Linksverteidiger (LV)</option>
                <option value="DM">Defensives Mittelfeld (DM)</option>
                <option value="MS">Mittelstürmer (MS)</option>
              </select>
            </div>

            <div>
              <label class="text-xs font-medium text-slate-300 block mb-1">Alter</label>
              <select value={age} onChange={(e) => setAge(e.target.value)} class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100">
                <option value="18-21">18 - 21 Jahre</option>
                <option value="22-25">22 - 25 Jahre</option>
                <option value="26-29">26 - 29 Jahre</option>
                <option value="30+">30+ Jahre</option>
              </select>
            </div>

            <div>
              <label class="text-xs font-medium text-slate-300 block mb-1">Starker Fuß</label>
              <select value={foot} onChange={(e) => setFoot(e.target.value)} class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100">
                <option value="Links">Links</option>
                <option value="Rechts">Rechts</option>
                <option value="Beidfüßig">Beidfüßig</option>
              </select>
            </div>

            <div>
              <label class="text-xs font-medium text-slate-300 block mb-1">Vertragssituation</label>
              <select value={contract} onChange={(e) => setContract(e.target.value)} class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100">
                <option value="summer2025">Vertrag läuft im Sommer aus</option>
                <option value="free">Sofort Vereinslos</option>
                <option value="rest1y">Restvertrag 1 Jahr</option>
              </select>
            </div>

            <div class="md:col-span-4 flex justify-end pt-2">
              <button type="submit" class="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium px-5 py-2.5 rounded-xl transition shadow-lg shadow-indigo-600/30">
                Club Matches berechnen
              </button>
            </div>
          </form>
        </section>

        {/* Results Table */}
        <section class="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
          <div class="px-6 py-4 border-b border-slate-800 flex justify-between items-center">
            <h3 class="text-lg font-semibold text-white">Top Club Matches</h3>
            <span class="text-xs text-slate-400">5 Vereine gefunden</span>
          </div>

          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-slate-950 text-slate-400 text-xs font-semibold uppercase border-b border-slate-800">
                <th class="p-4">Verein</th>
                <th class="p-4">Liga</th>
                <th class="p-4 text-center">Match-Score</th>
                <th class="p-4">Grund für den Fit</th>
                <th class="p-4 text-right">Aktion</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-800 text-sm">
              {clubs.map((c) => (
                <tr key={c.id} class="hover:bg-slate-800/50">
                  <td class="p-4 font-semibold text-white">{c.name}</td>
                  <td class="p-4 text-xs text-slate-300">{c.league}</td>
                  <td class="p-4 text-center">
                    <span class="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-full text-xs font-bold">
                      {c.score}%
                    </span>
                  </td>
                  <td class="p-4 text-xs text-slate-300 max-w-md">{c.fit}</td>
                  <td class="p-4 text-right">
                    <button onClick={() => setSelectedClub(c)} class="px-3 py-1.5 bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600 hover:text-white rounded-xl text-xs transition border border-indigo-500/30">
                      Dossier erstellen
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>

      {/* Modal */}
      {selectedClub && (
        <div class="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div class="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-lg w-full space-y-4">
            <h3 class="text-xl font-bold text-white">{selectedClub.name} — Pitch Dossier</h3>
            <p class="text-xs text-slate-300">{selectedClub.fit}</p>
            <div class="flex justify-end gap-2">
              <button onClick={() => setSelectedClub(null)} class="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs">Schließen</button>
              <button onClick={() => alert('PDF exportiert!')} class="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-medium">Dossier PDF</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
