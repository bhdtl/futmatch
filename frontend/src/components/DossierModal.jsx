import React from 'react';

export default function DossierModal({ club, profile, onClose }) {
  if (!club) return null;

  const pitchText = `Sehr geehrte Damen und Herren der Kaderplanung von ${club.club_name},

in Vorbereitung auf die kommenden Transfereffekte für die Saison 2025/26 möchten wir Ihnen unseren Klienten (Position: ${profile.position}, Starker Fuß: ${profile.preferred_foot}) vorlegen.

Basierend auf unserer datengestützten Kaderanalyse passt sein Profil hervorragend zu Ihrem bevorzugten Spielsystem (${club.tactical_alignment}) und löst Ihre anstehende Vakanz auf der Position ${profile.position}.

Vertragssituation: ${profile.contract_status.toUpperCase()} (Sehr hohe Transfer-Feasibilitaet).

Gerne senden wir Ihnen ein detailliertes Video-Dossier sowie die WyScout-Metriken zu.

Mit freundlichen Grüßen,
Ihr Performance Advisor Team`;

  return (
    <div class="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div class="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative space-y-5 animate-in fade-in zoom-in duration-200">
        
        <button onClick={onClose} class="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>

        <div class="flex items-center gap-3 border-b border-slate-800 pb-4">
          <div class="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-xl font-bold text-slate-200">
            {club.logo_short}
          </div>
          <div>
            <span class="text-xs text-indigo-400 font-semibold tracking-wide uppercase">Generiertes Pitch-Dossier</span>
            <h3 class="text-xl font-bold text-white">{club.club_name}</h3>
            <p class="text-xs text-slate-400">{club.league}</p>
          </div>
        </div>

        <div class="space-y-4 text-xs">
          <div class="bg-slate-950 p-4 rounded-xl border border-slate-800/80 space-y-2">
            <div class="flex justify-between items-center text-slate-300 font-medium">
              <span>Klient Position: <strong class="text-white">{profile.position}</strong></span>
              <span class="text-emerald-400 font-bold">{club.match_score}% Match-Score</span>
            </div>
            <p class="text-slate-400 leading-relaxed">
              {club.tactical_fit_reason}
            </p>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div class="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span class="text-slate-500 block text-[11px]">Taktisches Alignment</span>
              <span class="text-slate-200 font-medium">{club.tactical_alignment}</span>
            </div>
            <div class="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span class="text-slate-500 block text-[11px]">Vertragliche Dringlichkeit</span>
              <span class="text-amber-400 font-medium">{club.contract_urgency}</span>
            </div>
          </div>

          <div class="space-y-1.5">
            <label class="text-slate-300 font-medium">Vorbereitete Pitch-Mail für Sportdirektor:</label>
            <textarea 
              readOnly 
              value={pitchText}
              class="w-full h-32 bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-300 font-mono text-[11px] focus:outline-none custom-scrollbar"
            />
          </div>
        </div>

        <div class="flex items-center justify-end gap-3 pt-2">
          <button onClick={onClose} class="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-xl transition">
            Schließen
          </button>
          <button 
            onClick={() => alert(`Dossier PDF für ${club.club_name} exportiert!`)} 
            class="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium rounded-xl transition shadow-lg shadow-emerald-600/20 flex items-center gap-1.5"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1.051 1.051 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
            <span>PDF Dossier Herunterladen</span>
          </button>
        </div>

      </div>
    </div>
  );
}
