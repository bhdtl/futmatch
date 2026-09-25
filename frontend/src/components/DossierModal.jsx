import React from 'react';

export default function DossierModal({ club, profile, onClose }) {
  if (!club) return null;

  const name = club.club_name || club.name;
  const score = club.match_score || club.score;
  const fitReason = club.tactical_fit_reason || club.fit;

  const pitchText = `Sehr geehrte Damen und Herren der Kaderplanung von ${name},

in Vorbereitung auf die kommenden Transfereffekte für die Saison 2025/26 möchten wir Ihnen unseren Klienten (Position: ${profile.position}, Starker Fuß: ${profile.preferred_foot}) vorlegen.

Basierend auf unserer FutMatch Kaderanalyse passt sein Profil hervorragend zu Ihrem bevorzugten Spielsystem und löst Ihre anstehende Vakanz auf der Position ${profile.position}.

Vertragssituation: ${profile.contract_status ? profile.contract_status.toUpperCase() : 'ABLÖSEFREI'}.

Gerne senden wir Ihnen ein detailliertes Video-Dossier sowie die WyScout-Metriken zu.

Mit freundlichen Grüßen,
Ihr FutMatch Executive Advisor Team`;

  return (
    <div className="fixed inset-0 bg-zinc-950/90 z-50 flex items-center justify-center p-4">
      <div className="border border-zinc-800 bg-zinc-900 rounded-lg max-w-lg w-full p-6 space-y-4 relative text-xs font-sans">
        <button onClick={onClose} className="absolute top-4 right-4 text-zinc-500 hover:text-white">✕</button>
        
        <div className="border-b border-zinc-800 pb-3 space-y-1">
          <span className="text-[10px] font-mono text-emerald-500 uppercase">DOSSIER GENERATOR</span>
          <h3 className="text-base font-bold text-white">{name}</h3>
          <p className="text-xs text-zinc-400 font-mono">{club.league}</p>
        </div>

        <div className="space-y-3 font-mono">
          <div className="bg-zinc-950 p-3 rounded border border-zinc-800 text-[11px] space-y-1">
            <p className="text-zinc-400">MATCH-SCORE: <span className="text-emerald-400 font-bold">{score}%</span></p>
            <p className="text-zinc-300 font-sans">{fitReason}</p>
          </div>

          <div>
            <label className="block text-zinc-400 mb-1">PITCH-MAIL AN SPORTDIREKTOR</label>
            <textarea 
              readOnly 
              value={pitchText}
              className="w-full h-28 bg-zinc-950 border border-zinc-800 rounded p-2.5 text-zinc-300 font-mono text-[11px] focus:outline-none custom-scrollbar"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button onClick={onClose} className="px-3.5 py-2 bg-zinc-800 text-zinc-300 font-mono rounded">Schließen</button>
          <button 
            onClick={() => alert(`Dossier PDF für ${name} erfolgreich exportiert!`)} 
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-bold rounded"
          >
            PDF Download
          </button>
        </div>
      </div>
    </div>
  );
}
