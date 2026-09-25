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
    <div className="fixed inset-0 bg-zinc-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-zinc-400 hover:text-white p-1">
          ✕
        </button>

        <div className="border-b border-zinc-800 pb-3">
          <span className="text-[10px] text-emerald-400 font-mono uppercase tracking-wider">Supabase Live DB</span>
          <h3 className="text-lg font-bold text-white">+ Zielverein & Vakanz anlegen</h3>
          <p className="text-xs text-zinc-400">Fügen Sie echte Vereine und Kader-Bedarfe zu Supabase hinzu.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-zinc-300 font-medium block mb-1">Vereinsname *</label>
              <input 
                name="name" 
                required 
                value={formData.name} 
                onChange={handleChange}
                placeholder="z.B. FC St. Pauli" 
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="text-zinc-300 font-medium block mb-1">Kürzel (Logo)</label>
              <input 
                name="logo_short" 
                value={formData.logo_short} 
                onChange={handleChange}
                placeholder="z.B. STP" 
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-zinc-300 font-medium block mb-1">Liga</label>
              <input 
                name="league" 
                value={formData.league} 
                onChange={handleChange}
                placeholder="z.B. 2. Bundesliga" 
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="text-zinc-300 font-medium block mb-1">Ziel-Position</label>
              <select 
                name="target_positions" 
                value={formData.target_positions} 
                onChange={handleChange}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                <option value="IV">Innenverteidiger (IV)</option>
                <option value="LV">Linksverteidiger (LV)</option>
                <option value="RV">Rechtsverteidiger (RV)</option>
                <option value="DM">Defensives Mittelfeld (DM)</option>
                <option value="ZM">Zentrales Mittelfeld (ZM)</option>
                <option value="MS">Mittelstürmer (MS)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-zinc-300 font-medium block mb-1">Grund für Vakanz / Taktisches Alignment</label>
            <textarea 
              name="vacancies" 
              value={formData.vacancies} 
              onChange={handleChange}
              placeholder="z.B. Vertrag des Stamm-IV läuft im Sommer aus, Trainer sucht linksfüßigen Aufbau-IV."
              className="w-full h-20 bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-zinc-100 focus:outline-none focus:ring-1 focus:ring-emerald-500 custom-scrollbar"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-zinc-800 text-zinc-300 rounded-xl">Abbrechen</button>
            <button type="submit" disabled={loading} className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold rounded-xl shadow-lg shadow-emerald-500/20">
              {loading ? "Speichere..." : "In Supabase Speichern"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
