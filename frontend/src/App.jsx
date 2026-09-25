import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import ClientForm from './components/ClientForm';
import MatchTable from './components/MatchTable';
import DossierModal from './components/DossierModal';
import AddClubModal from './components/AddClubModal';

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
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
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
          <p>FutMatch Pro Intelligence OS v2.4 — Supabase DB Connected (xrytnuhucuqmyoytdtch)</p>
          <p>Stand: Saison 2024/2025 • Supabase Live Engine</p>
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
