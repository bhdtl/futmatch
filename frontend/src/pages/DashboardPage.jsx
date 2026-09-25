import React, { useState } from 'react';
import { useAuth, ADMIN_EMAIL } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import ClientForm from '../components/ClientForm';
import MatchTable from '../components/MatchTable';
import DossierModal from '../components/DossierModal';
import AddClubModal from '../components/AddClubModal';

export default function DashboardPage({ onBackToLanding }) {
  const { user, isAdmin, logout } = useAuth();

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

  const fetchMatches = async (currentProfile) => {
    if (!currentProfile.position) return;
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
        setMatches(data);
      } else {
        setMatches([]);
      }
    } catch (err) {
      setMatches([]);
    } finally {
      setLoading(false);
    }
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
    <div className="bg-zinc-950 text-zinc-100 min-h-screen flex flex-col md:flex-row antialiased font-sans">
      {/* Sidebar */}
      <Sidebar 
        activeCount={matches.length} 
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
        />

        <MatchTable 
          matches={hasSearched ? matches : []} 
          isSearching={loading}
          onSelectDossier={(club) => setSelectedClub(club)} 
          onOpenAddModal={() => setIsAddModalOpen(true)}
        />

        <footer className="flex flex-col sm:flex-row items-center justify-between text-[11px] text-zinc-500 border-t border-zinc-800 pt-4 gap-2 font-mono">
          <p>FutMatch Pro Intelligence OS v2.4 — Utilitarian Edition</p>
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
          if (profile.position) fetchMatches(profile);
        }}
      />
    </div>
  );
}
