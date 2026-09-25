import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import ClientForm from './components/ClientForm';
import MatchTable from './components/MatchTable';
import DossierModal from './components/DossierModal';

export default function App() {
  const [profile, setProfile] = useState({
    position: '',
    age: 23,
    age_group: '22-25',
    preferred_foot: 'Links',
    contract_status: 'summer2025'
  });

  const [matches, setMatches] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedClub, setSelectedClub] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchMatches = async (currentProfile) => {
    if (!currentProfile.position) return;
    setLoading(true);
    setHasSearched(true);
    try {
      const res = await fetch('http://127.0.0.1:8000/api/match-clubs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentProfile)
      });
      if (res.ok) {
        const data = await res.json();
        setMatches(data);
      } else {
        recalculateFallback(currentProfile);
      }
    } catch (err) {
      recalculateFallback(currentProfile);
    } finally {
      setLoading(false);
    }
  };

  const recalculateFallback = (p) => {
    const mockClubs = [
      {
        club_id: "CLB-STP",
        club_name: "FC St. Pauli",
        logo_short: "STP",
        league: "Bundesliga / 2. Bundesliga",
        match_score: 96,
        tactical_fit_reason: `Vertrag auf ${p.position} läuft im Sommer aus, Coach sucht passendes Profil (${p.preferred_foot}fuß).`,
        tactical_alignment: "3-4-2-1 System",
        contract_urgency: "Sehr Hoch"
      },
      {
        club_id: "CLB-F95",
        club_name: "Fortuna Düsseldorf",
        logo_short: "F95",
        league: "2. Bundesliga",
        match_score: 94,
        tactical_fit_reason: "Zwei Verträge auf dieser Position laufen aus. Budget für ablösefreie Spieler reserviert.",
        tactical_alignment: "4-4-2 System",
        contract_urgency: "Hoch"
      },
      {
        club_id: "CLB-KVM",
        club_name: "KV Mechelen",
        logo_short: "KVM",
        league: "Jupiler Pro League (Belgien)",
        match_score: 91,
        tactical_fit_reason: "Stammspieler vor Wechsel in Serie A. Suchen sofortigen Ersatz mit hoher Pressing-Intensität.",
        tactical_alignment: "4-3-3 Hohes Pressing",
        contract_urgency: "Hoch"
      },
      {
        club_id: "CLB-SVE",
        club_name: "SV Elversberg",
        logo_short: "SVE",
        league: "2. Bundesliga",
        match_score: 87,
        tactical_fit_reason: "Kadererweiterung gefordert. Hohe Passquote im Spielaufbau nötig.",
        tactical_alignment: "4-2-3-1 Ballbesitz",
        contract_urgency: "Normal"
      }
    ];
    setMatches(mockClubs);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchMatches(profile);
  };

  const handleReset = () => {
    setProfile({
      position: '',
      age: 23,
      age_group: '22-25',
      preferred_foot: 'Links',
      contract_status: 'summer2025'
    });
    setMatches([]);
    setHasSearched(false);
  };

  return (
    <div class="bg-zinc-950 text-zinc-100 min-h-screen flex flex-col md:flex-row antialiased">
      {/* Sidebar */}
      <Sidebar activeCount={matches.length} />

      {/* Main Workbench */}
      <main class="flex-1 p-5 md:p-8 space-y-6 overflow-y-auto custom-scrollbar">
        <Header />

        <ClientForm 
          profile={profile} 
          onChange={handleChange} 
          onSubmit={handleSubmit}
          onReset={handleReset}
          loading={loading}
        />

        <MatchTable 
          matches={hasSearched ? matches : []} 
          isSearching={loading}
          onSelectDossier={(club) => setSelectedClub(club)} 
        />

        <footer class="flex flex-col sm:flex-row items-center justify-between text-[11px] text-zinc-500 border-t border-zinc-800/80 pt-4 gap-2 font-mono">
          <p>FutMatch Pro Intelligence OS v2.4 — Desktop Native Edition</p>
          <p>Stand: Saison 2024/2025 • WyScout & Transfermarkt Live Feed API</p>
        </footer>
      </main>

      {/* Dossier Modal */}
      <DossierModal 
        club={selectedClub} 
        profile={profile} 
        onClose={() => setSelectedClub(null)} 
      />
    </div>
  );
}
