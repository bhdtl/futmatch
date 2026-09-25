import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ClientForm from './components/ClientForm';
import MatchTable from './components/MatchTable';
import DossierModal from './components/DossierModal';

const DEFAULT_MATCHES = [
  {
    club_id: "CLB-STP",
    club_name: "FC St. Pauli",
    logo_short: "STP",
    league: "Bundesliga / 2. Bundesliga",
    match_score: 94,
    tactical_fit_reason: "Vertrag auf IV läuft im Sommer aus, Coach spielt Dreierkette. Linksfuß als Aufbau-IV gesucht.",
    tactical_alignment: "3-4-2-1 Dreierkette",
    contract_urgency: "Sehr Hoch"
  },
  {
    club_id: "CLB-KVM",
    club_name: "KV Mechelen",
    logo_short: "KVM",
    league: "Jupiler Pro League (Belgien)",
    match_score: 91,
    tactical_fit_reason: "Stamm-IV vor Wechsel in Serie A. Suchen ballfesten Innenverteidiger für hohes Pressingsystem.",
    tactical_alignment: "4-3-3 Hohes Pressing",
    contract_urgency: "Hoch"
  },
  {
    club_id: "CLB-SVE",
    club_name: "SV Elversberg",
    logo_short: "SVE",
    league: "2. Bundesliga",
    match_score: 87,
    tactical_fit_reason: "Spielstarke Abwehr benötigt. Hohe Passquote im Spielaufbau gefordert (K-Means Match 89%).",
    tactical_alignment: "4-2-3-1 Ballbesitz",
    contract_urgency: "Normal"
  },
  {
    club_id: "CLB-F95",
    club_name: "Fortuna Düsseldorf",
    logo_short: "F95",
    league: "2. Bundesliga",
    match_score: 84,
    tactical_fit_reason: "Zwei Abwehrverträge laufen aus. Budget für ablösefreie Spieler reserviert.",
    tactical_alignment: "4-4-2 System",
    contract_urgency: "Hoch"
  },
  {
    club_id: "CLB-GNT",
    club_name: "KAA Gent",
    logo_short: "GNT",
    league: "Jupiler Pro League (Belgien)",
    match_score: 79,
    tactical_fit_reason: "Kader-Tiefe auf IV gering. Suchen physisch starken Vorstopper als Ergänzung.",
    tactical_alignment: "3-5-2 Umschaltspiel",
    contract_urgency: "Normal"
  }
];

export default function App() {
  const [profile, setProfile] = useState({
    position: 'IV',
    age: 23,
    age_group: '22-25',
    preferred_foot: 'Links',
    contract_status: 'summer2025'
  });

  const [matches, setMatches] = useState(DEFAULT_MATCHES);
  const [selectedClub, setSelectedClub] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchMatches = async (currentProfile) => {
    setLoading(true);
    try {
      const res = await fetch('http://127.0.0.1:8000/api/match-clubs', {
        method: 'POST',
        headers: { 'Content-[Type': 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify(currentProfile)
      });
      if (res.ok) {
        const data = await res.json();
        setMatches(data);
      } else {
        // Fallback filtering in UI
        recalculateLocal(currentProfile);
      }
    } catch (err) {
      // Local fallback calculation if backend not currently active
      recalculateLocal(currentProfile);
    } finally {
      setLoading(false);
    }
  };

  const recalculateLocal = (p) => {
    const updated = DEFAULT_MATCHES.map((club) => {
      let score = club.match_score;
      if (p.position === 'IV') score += 2;
      else if (p.position === 'MS') score = Math.max(65, score - 15);
      if (p.preferred_foot === 'Links') score += 2;
      return { ...club, match_score: Math.min(98, score) };
    });
    setMatches(updated);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newProfile = { ...profile, [name]: value };
    setProfile(newProfile);
    fetchMatches(newProfile);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchMatches(profile);
  };

  return (
    <div class="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 antialiased">
      <div class="max-w-7xl mx-auto space-y-6">
        <Header />
        
        <ClientForm 
          profile={profile} 
          onChange={handleChange} 
          onSubmit={handleSubmit} 
          loading={loading}
        />

        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-1 pt-2">
          <div>
            <h2 class="text-lg font-semibold text-slate-100 flex items-center gap-2">
              <span>Top Club Matches</span>
              <span class="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                {matches.length} Vereine gefunden
              </span>
            </h2>
            <p class="text-xs text-slate-400">Basiert auf Vakanzen im Sommer, Spielsystem (Formations-Suitability) und Liga-Fit</p>
          </div>
        </div>

        <MatchTable 
          matches={matches} 
          onSelectDossier={(club) => setSelectedClub(club)} 
        />

        <footer class="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 border-t border-slate-800/60 pt-4 gap-2">
          <p>MatchScout B2B Advisor Engine v1.0 — XGBoost & K-Means Inverted Matching</p>
          <p>Stand: Saison 2024/2025 • Datenquellen: Transfermarkt & WyScout API Feed</p>
        </footer>
      </div>

      <DossierModal 
        club={selectedClub} 
        profile={profile} 
        onClose={() => setSelectedClub(null)} 
      />
    </div>
  );
}
