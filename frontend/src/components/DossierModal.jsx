import React from 'react';

export default function DossierModal({ club, profile, onClose }) {
  if (!club) return null;

  const name = club.club_name || club.name;
  const logo = club.logo_short || club.logo;
  const score = club.match_score || club.score;
  const fitReason = club.tactical_fit_reason || club.fit;

  const pitchText = `Sehr geehrte Damen und Herren der Kaderplanung von ${name},

in Vorbereitung auf die kommenden Transfereffekte für die Saison 2025/26 möchten wir Ihnen unseren Klienten (Position: ${profile.position}, Starker Fuß: ${profile.preferred_foot}) vorlegen.

Basierend auf unserer FutMatch Kaderanalyse passt sein Profil hervorragend zu Ihrem bevorzugten Spielsystem und löst Ihre anstehende Vakanz auf der Position ${profile.position}.

Vertragssituation: ${profile.contract_status ? profile.contract_status.toUpperCase() : 'Ablösefrei'}.

Gerne senden wir Ihnen ein detailliertes Video-Dossier sowie die WyScout-Metriken zu.

Mit freundlichen Grüßen,
Ihr FutMatch Executive Advisor Team`;

  return (
    <div className="fixed inset-0 bg-zinc-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-5 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-zinc-400 hover:text-white p-1">
          ✕
        </button>

        <div className="flex items-center gap-3 border-b border-zinc-800 pb-4">
          <div className="w-10 h-10 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-sm font-bold text-emerald-400">
            {logo}
          </div>
          <div>
            <span className="text-[10px] text-emerald-400 font-mono uppercase tracking-wider">FutMatch Executive Dossier</span>
            <h3 className="text-lg font-bold text-white">{name}</h3>
            <p className="text-xs text-zinc-400">{club.league}</p>
          </div>
        </div>

        <div className="space-y-3 text-xs">
          <div className="bg-zinc-950 p-3.5 rounded-xl border border-zinc-800 space-y-1.5">
            <div className="flex justify-between items-center text-zinc-300">
              <span>Match-Score:</span>
              <span className="text-emerald-400 font-bold">{score}% Match</span>
            </div>
            <p className="text-zinc-400 leading-relaxed text-[11px]">
              {fitReason}
            </p>
          </div>

          <div className="space-y-1">
            <label className="text-zinc-300 font-medium">Vorbereiteter Direkt-Pitch für Sportdirektor:</label>
            <textarea 
              readOnly 
              value={pitchText} 
              className="w-full h-28 bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-zinc-300 font-mono text-[11px] focus:outline-none custom-scrollbar"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button onClick={onClose} className="px-4 py-2 bg-zinc-800 text-zinc-300 text-xs font-medium rounded-xl">Schließen</button>
          <button 
            onClick={() => alert(`Dossier für ${name} erfolgreich als PDF exportiert!`)} 
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-bold rounded-xl shadow-lg shadow-emerald-500/20"
          >
            PDF Herunterladen
          </button>
        </div>
      </div>
    </div>
  );
}
