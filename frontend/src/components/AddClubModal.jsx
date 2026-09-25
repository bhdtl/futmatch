import React, { useState } from 'react';

export default function AddClubModal({ isOpen, onClose, onClubAdded }) {
  const [formData, setFormData] = useState({
    id: 'CLB-',
    name: '',
    logo_short: '',
    league: '2. Bundesliga',
    primary_tactics: '3-4-2-1',
    target_positions: 'IV',
    preferred_foot: 'Links',
    vacancies: ''
  });
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        id: formData.id || `CLB-${Date.now().toString().slice(-4)}`,
        name: formData.name,
        logo_short: formData.logo_short || formData.name.slice(0, 3).toUpperCase(),
        league: formData.league,
        primary_tactics: [formData.primary_tactics],
        target_positions: [formData.target_positions],
        preferred_foot: formData.preferred_foot,
        vacancies: formData.vacancies || "Kader-Vakanz auf dieser Position."
      };

      const res = await fetch('http://127.0.0.1:8000/api/clubs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        alert(`Verein '${formData.name}' erfolgreich in Supabase gespeichert!`);
        if (onClubAdded) onClubAdded();
        onClose();
      } else {
        alert("Fehler beim Speichern in Supabase. Bitte Backend prüfen.");
      }
    } catch (err) {
      alert(`Netzwerkfehler: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-zinc-950/90 z-50 flex items-center justify-center p-4">
      <div className="border border-zinc-800 bg-zinc-900 rounded-lg max-w-lg w-full p-6 space-y-4 relative text-xs font-sans">
        <button onClick={onClose} className="absolute top-4 right-4 text-zinc-500 hover:text-white">✕</button>
        
        <div className="border-b border-zinc-800 pb-3 space-y-1">
          <span className="text-[10px] font-mono text-emerald-500 uppercase">SUPABASE DATABASE</span>
          <h3 className="text-base font-bold text-white">+ Zielverein & Vakanz anlegen</h3>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 font-mono">
          <div>
            <label className="block text-zinc-400 mb-1">VEREINSNAME *</label>
            <input 
              name="name" 
              required 
              value={formData.name} 
              onChange={handleChange}
              placeholder="z.B. FC St. Pauli" 
              className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-white focus:outline-none focus:border-emerald-600"
            />
          </div>

          <div>
            <label className="block text-zinc-400 mb-1">LIGA *</label>
            <input 
              name="league" 
              required 
              value={formData.league} 
              onChange={handleChange}
              placeholder="2. Bundesliga" 
              className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-white focus:outline-none focus:border-emerald-600"
            />
          </div>

          <div>
            <label className="block text-zinc-400 mb-1">VAKANZ-GRUND *</label>
            <textarea 
              name="vacancies" 
              required 
              value={formData.vacancies} 
              onChange={handleChange}
              placeholder="Vertrag des Stamm-IV läuft aus..." 
              className="w-full h-16 bg-zinc-950 border border-zinc-800 rounded p-2 text-white focus:outline-none focus:border-emerald-600"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="px-3.5 py-2 bg-zinc-800 text-zinc-300 font-mono rounded">Abbrechen</button>
            <button type="submit" disabled={loading} className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-bold rounded">
              {loading ? "Speichere..." : "IN SUPABASE SPEICHERN"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
