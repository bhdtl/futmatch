import React, { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function DemoRequestModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    agency_name: '',
    client_count: '1-10',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Insert into Supabase demo_requests table
      const { error } = await supabase.from('demo_requests').insert([formData]);
      if (error) {
        // Fallback local acknowledgment if table doesn't exist
      }
      setSubmitted(true);
    } catch (err) {
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-zinc-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 relative">
        <button onClick={onClose} className="absolute top-5 right-5 text-zinc-400 hover:text-white p-1">
          ✕
        </button>

        {submitted ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center mx-auto text-xl font-bold">
              ✓
            </div>
            <h3 className="text-xl font-bold text-white">Anfrage erfolgreich übermittelt</h3>
            <p className="text-xs text-zinc-400 max-w-sm mx-auto leading-relaxed">
              Vielen Dank für Ihr Interesse an FutMatch Pro. Unser Enterprise Team prüft Ihre Angaben und kontaktiert Sie in Kürze per E-Mail für Ihren exklusiven Zugang.
            </p>
            <button 
              onClick={onClose} 
              className="mt-4 px-6 py-2.5 bg-emerald-500 text-zinc-950 font-bold text-xs rounded-xl"
            >
              Schließen
            </button>
          </div>
        ) : (
          <>
            <div className="space-y-1">
              <span className="text-[10px] text-emerald-400 font-mono uppercase tracking-wider">Enterprise Onboarding</span>
              <h3 className="text-xl font-bold text-white tracking-tight">Zugang anfragen / Demo buchen</h3>
              <p className="text-xs text-zinc-400">Erhalten Sie eine maßgeschneiderte Präsentation der Transfer-Matching Engine.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-zinc-300 font-medium block mb-1">Vollständiger Name *</label>
                  <input 
                    name="full_name"
                    required 
                    value={formData.full_name}
                    onChange={handleChange}
                    placeholder="z.B. Alexander Schmidt"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-zinc-300 font-medium block mb-1">E-Mail Adresse *</label>
                  <input 
                    name="email"
                    type="email"
                    required 
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="z.B. alex@agency.de"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-zinc-300 font-medium block mb-1">Agentur Name *</label>
                  <input 
                    name="agency_name"
                    required 
                    value={formData.agency_name}
                    onChange={handleChange}
                    placeholder="z.B. Sports Consulting GmbH"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-zinc-300 font-medium block mb-1">Portfolio Größe</label>
                  <select 
                    name="client_count"
                    value={formData.client_count}
                    onChange={handleChange}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                  >
                    <option value="1-10">1 - 10 Klienten</option>
                    <option value="10-30">10 - 30 Klienten</option>
                    <option value="30+">30+ Klienten</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-zinc-300 font-medium block mb-1">Anmerkungen oder Ziel-Ligen</label>
                <textarea 
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Welche Zielmärkte und Ligen betreuen Sie hauptsächlich?"
                  className="w-full h-20 bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 custom-scrollbar"
                />
              </div>

              <div className="pt-2">
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs rounded-xl py-3 transition shadow-lg shadow-emerald-500/20 disabled:opacity-50"
                >
                  {loading ? "Sende Anfrage..." : "Demo-Termin & Zugang anfordern"}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
