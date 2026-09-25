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
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl max-w-md w-full p-8 shadow-2xl text-center space-y-5">
          <div className="w-14 h-14 rounded-2xl bg-red-500/10 text-red-400 border border-red-500/20 flex items-center justify-center mx-auto text-2xl font-bold">
            🛡️
          </div>
          <div className="space-y-1">
            <span className="text-[10px] text-red-400 font-mono uppercase tracking-wider">Cyber Security Enforcement</span>
            <h3 className="text-xl font-bold text-white">Zugriff Verweigert</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Der geschützte App-Bereich <code className="bg-zinc-950 px-1.5 py-0.5 rounded text-emerald-400 font-mono">/dashboard</code> ist exklusiv für den autorisierten Administrator reserviert.
            </p>
          </div>

          <div className="p-3.5 bg-zinc-950 rounded-xl border border-zinc-800 text-left text-xs font-mono space-y-1 text-zinc-400">
            <p>Eingeloggt als: <span className="text-white">{user?.email || 'Nicht angemeldet'}</span></p>
            <p>Erforderliche E-Mail: <span className="text-emerald-400 font-bold">{ADMIN_EMAIL}</span></p>
          </div>

          <div className="flex gap-3 pt-2">
            {user && (
              <button 
                onClick={logout}
                className="flex-1 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold text-xs rounded-xl transition"
              >
                Abmelden
              </button>
            )}
            <button 
              onClick={onBackToLanding}
              className="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/20 transition"
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
        <div className="flex items-center justify-between bg-zinc-900/60 border border-zinc-800 rounded-2xl px-4 py-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span className="font-mono text-zinc-300">Admin Account: <strong>{user?.email}</strong></span>
          </div>
          <button 
            onClick={onBackToLanding}
            className="text-zinc-400 hover:text-white transition font-mono text-[11px] underline"
          >
            ← Öffentliche Landingpage
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

        <footer className="flex flex-col sm:flex-row items-center justify-between text-[11px] text-zinc-500 border-t border-zinc-800/80 pt-4 gap-2 font-mono">
          <p>FutMatch Pro Protected OS v2.4 — Supabase Security Auth Active</p>
          <p>Admin Session Active: {ADMIN_EMAIL}</p>
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
