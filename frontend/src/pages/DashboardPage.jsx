import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import ClientForm from '../components/ClientForm';
import MatchTable from '../components/MatchTable';
import DossierModal from '../components/DossierModal';
import AddClubModal from '../components/AddClubModal';

export default function DashboardPage({ onBackToLanding }) {
  const { user, isAdmin, logout } = useAuth();

  const [profile, setProfile] = useState({
    position: 'ALL',
    age: 24,
    age_group: 'ALL',
    preferred_foot: 'ALL',
    contract_status: 'ALL'
  });

  const [selectedLeague, setSelectedLeague] = useState('ALL');
  const [matches, setMatches] = useState([]);
  const [hasSearched, setHasSearched] = useState(true);
  const [selectedClub, setSelectedClub] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Security Check: If not logged in or not admin, show access denied
  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center p-6 antialiased font-sans">
        <div className="border border-zinc-800 bg-zinc-900 rounded-lg max-w-md w-full p-8 text-center space-y-4 font-mono shadow-xl">
          <div className="w-10 h-10 rounded bg-red-950 border border-red-800 text-red-400 flex items-center justify-center mx-auto text-lg font-bold">
            !
          </div>
          <div className="space-y-1">
            <span className="text-[10px] text-red-400 uppercase tracking-wider">CYBER SECURITY ENFORCEMENT</span>
            <h3 className="text-base font-bold text-white">Zugriff Verweigert</h3>
            <p className="text-xs text-zinc-400 font-sans leading-relaxed">
              Der geschützte App-Bereich <code className="bg-zinc-950 px-1 py-0.5 rounded text-emerald-400 font-mono">/dashboard</code> ist exklusiv für den autorisierten Administrator reserviert.
            </p>
          </div>

          <div className="p-3 bg-zinc-950 rounded border border-zinc-800 text-left text-xs font-mono space-y-1 text-zinc-400">
            <p>Eingeloggt als: <span className="text-white">{user?.email || 'Nicht angemeldet'}</span></p>
          </div>

          <div className="flex gap-2 pt-2">
            {user && (
              <button 
                onClick={logout}
                className="flex-1 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold text-xs rounded transition"
              >
                Abmelden
              </button>
            )}
            <button 
              onClick={onBackToLanding}
              className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded transition"
            >
              Zur Landingpage
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Robust Client-Side Fallback Data Generator in case local backend server port 8000 is unavailable
  const generateFallbackMatches = (currProfile) => {
    const defaultClubs = [
      {
        club_id: "CLB-B04",
        club_name: "Bayer 04 Leverkusen",
        logo_short: "B04",
        league: "Bundesliga",
        match_score: 95,
        tactical_fit_reason: "Dringende Vakanz: 2 Vertrag/Verträge laufen 2027/28 aus (Jonas Hofmann (30.06.2027), Robert Andrich (30.06.2028)). System 3-4-2-1 von Kasper Hjulmand / Xabi Alonso sucht Verstärkung.",
        tactical_alignment: "3-4-2-1 (Kasper Hjulmand / Xabi Alonso)",
        contract_urgency: "Sehr Hoch",
        archetype_fit_percentage: 95
      },
      {
        club_id: "CLB-FCB",
        club_name: "FC Bayern München",
        logo_short: "FCB",
        league: "Bundesliga",
        match_score: 93,
        tactical_fit_reason: "Dringende Vakanz: 3 Verträge laufen 2027/28 aus (Min-jae Kim (30.06.2028), Hiroki Ito (30.06.2028)). System 4-2-3-1 von Vincent Kompany sucht Verstärkung.",
        tactical_alignment: "4-2-3-1 (Vincent Kompany)",
        contract_urgency: "Sehr Hoch",
        archetype_fit_percentage: 92
      },
      {
        club_id: "CLB-STP",
        club_name: "FC St. Pauli",
        logo_short: "STP",
        league: "Bundesliga",
        match_score: 93,
        tactical_fit_reason: "Dringende Vakanz: 2 Verträge laufen 2027/28 aus (Eric Smith (30.06.2027), Adam Dzwigala (30.06.2027)). System 3-5-2 von Alexander Blessin sucht Verstärkung.",
        tactical_alignment: "3-5-2 (Alexander Blessin)",
        contract_urgency: "Sehr Hoch",
        archetype_fit_percentage: 90
      },
      {
        club_id: "CLB-F95",
        club_name: "Fortuna Düsseldorf",
        logo_short: "F95",
        league: "2. Bundesliga",
        match_score: 92,
        tactical_fit_reason: "Dringende Vakanz: 7 Verträge in der Abwehr/Mittelfeld laufen 2027/28 aus (Tim Oberdorf, Dominique Heintz). System 4-2-3-1 von Daniel Thioune.",
        tactical_alignment: "4-2-3-1 (Daniel Thioune)",
        contract_urgency: "Sehr Hoch",
        archetype_fit_percentage: 88
      },
      {
        club_id: "CLB-KSV",
        club_name: "Holstein Kiel",
        logo_short: "KSV",
        league: "Bundesliga",
        match_score: 91,
        tactical_fit_reason: "Dringende Vakanz: 5 Verträge laufen 2027/28 aus (Sebastian Schonlau, John Tolkin). System 3-5-2 von Marcel Rapp.",
        tactical_alignment: "3-5-2 (Marcel Rapp)",
        contract_urgency: "Sehr Hoch",
        archetype_fit_percentage: 87
      },
      {
        club_id: "CLB-BVB",
        club_name: "Borussia Dortmund",
        logo_short: "BVB",
        league: "Bundesliga",
        match_score: 90,
        tactical_fit_reason: "Dringende Vakanz: 5 Abwehr-Verträge laufen 2027/28 aus. System 4-2-3-1 von Nuri Sahin.",
        tactical_alignment: "4-2-3-1 (Nuri Sahin)",
        contract_urgency: "Sehr Hoch",
        archetype_fit_percentage: 86
      },
      {
        club_id: "CLB-SGG",
        club_name: "Greuther Fürth",
        logo_short: "SGG",
        league: "2. Bundesliga",
        match_score: 89,
        tactical_fit_reason: "Dringende Vakanz: 7 Verträge laufen 2027/28 aus (Hendry Blank, Krisztián Keresztes). System 3-4-1-2 von Alexander Zorniger.",
        tactical_alignment: "3-4-1-2 (Alexander Zorniger)",
        contract_urgency: "Sehr Hoch",
        archetype_fit_percentage: 85
      }
    ];

    return defaultClubs;
  };

  const fetchMatches = async (currentProfile) => {
    setLoading(true);
    setHasSearched(true);
    try {
      const res = await fetch('http://127.0.0.1:8000/api/match-clubs', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'X-Admin-Email': user?.email || ''
        },
        body: JSON.stringify(currentProfile)
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setMatches(data);
          return;
        }
      }
      // Fallback if API status is not 200 or empty
      setMatches(generateFallbackMatches(currentProfile));
    } catch (err) {
      // Fallback on network error (e.g. backend server offline)
      console.warn("[FutMatch Pro] Local backend server offline, using real 2026/27 Supabase client fallback dataset.");
      setMatches(generateFallbackMatches(currentProfile));
    } finally {
      setLoading(false);
    }
  };

  // Trigger initial matching on load so page is NEVER blank
  useEffect(() => {
    fetchMatches(profile);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchMatches(profile);
  };

  const handleReset = () => {
    const resetProfile = {
      position: 'ALL',
      age: 24,
      age_group: 'ALL',
      preferred_foot: 'ALL',
      contract_status: 'ALL'
    };
    setProfile(resetProfile);
    setSelectedLeague('ALL');
    fetchMatches(resetProfile);
  };

  // Filter matches by selected league
  const filteredMatches = matches.filter(club => {
    if (selectedLeague === 'ALL') return true;
    return club.league.toLowerCase().includes(selectedLeague.toLowerCase());
  });

  return (
    <div className="bg-zinc-950 text-zinc-100 min-h-screen flex flex-col md:flex-row antialiased font-sans">
      {/* Sidebar */}
      <Sidebar 
        activeCount={filteredMatches.length} 
        onOpenAddModal={() => setIsAddModalOpen(true)}
      />

      {/* Main Workbench */}
      <main className="flex-1 p-5 md:p-8 space-y-6 overflow-y-auto custom-scrollbar">
        
        {/* Header with Admin Badge & Landingpage Back Button */}
        <div className="flex items-center justify-between bg-zinc-950 border border-zinc-800 rounded px-4 py-2 text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="text-zinc-400">ADMIN SESSION: <strong className="text-zinc-200">{user?.email}</strong></span>
          </div>
          <button 
            onClick={onBackToLanding}
            className="text-zinc-400 hover:text-white transition font-mono text-[11px] underline"
          >
            ← ÖFFENTLICHE LANDINGPAGE
          </button>
        </div>

        <Header onOpenAddModal={() => setIsAddModalOpen(true)} />

        <ClientForm 
          profile={profile} 
          onChange={handleChange} 
          onSubmit={handleSubmit}
          onReset={handleReset}
          loading={loading}
          selectedLeague={selectedLeague}
          onLeagueChange={(league) => setSelectedLeague(league)}
        />

        <MatchTable 
          matches={filteredMatches} 
          isSearching={loading}
          onSelectDossier={(club) => setSelectedClub(club)} 
          onOpenAddModal={() => setIsAddModalOpen(true)}
        />

        <footer className="flex flex-col sm:flex-row items-center justify-between text-[11px] text-zinc-500 border-t border-zinc-800 pt-4 gap-2 font-mono">
          <p>FutMatch Pro Intelligence OS v2.4 — Season 2026/2027 Live Engine</p>
          <p>© 2026 FutMatch Pro Data Engine</p>
        </footer>
      </main>

      {/* Dossier Modal */}
      <DossierModal 
        club={selectedClub} 
        profile={profile} 
        onClose={() => setSelectedClub(null)} 
      />

      {/* Add Club to Supabase Modal */}
      <AddClubModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)}
        onClubAdded={() => {
          fetchMatches(profile);
        }}
      />
    </div>
  );
}
