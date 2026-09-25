import React, { useState } from 'react';

export default function DossierModal({ club, profile, onClose }) {
  if (!club) return null;

  const [copied, setCopied] = useState(false);

  const name = club.club_name || club.name;
  const score = club.match_score || club.score;
  const fitReason = club.tactical_fit_reason || club.fit;
  const tactic = club.tactical_alignment || '3-4-2-1 System';

  const pitchText = `Sehr geehrte Damen und Herren der Kaderplanung von ${name},

in Vorbereitung auf die kommenden Transfereffekte für die Saison 2026/27 möchten wir Ihnen unseren Klienten (Position: ${profile.position || 'IV'}, Alter: ${profile.age || 23}, Starker Fuß: ${profile.preferred_foot || 'Rechts'}) vertraulich vorlegen.

Basierend auf unserer FutMatch Pro Kaderanalyse passt sein Profil hervorragend zu Ihrem bevorzugten Spielsystem (${tactic}) und adressiert Ihre Vakanzen auf der Position ${profile.position || 'IV'}.

Vertragssituation: ${profile.contract_status ? profile.contract_status.toUpperCase() : 'ABLÖSEFREI'} (Sehr hohe Transfer-Feasibilität).

Gerne senden wir Ihnen ein detailliertes Video-Dossier sowie die WyScout Per-90 Metriken zu.

Mit freundlichen Grüßen,
Ihr FutMatch Executive Advisor Team`;

  const handleCopy = () => {
    navigator.clipboard.writeText(pitchText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Executive Dossier — ${name}</title>
          <style>
            body { font-family: monospace; padding: 40px; color: #18181b; line-height: 1.6; }
            h1 { font-size: 20px; border-bottom: 2px solid #18181b; padding-bottom: 8px; margin-bottom: 4px; }
            .subtitle { font-size: 12px; color: #52525b; margin-bottom: 24px; text-transform: uppercase; }
            .box { border: 1px solid #d4d4d8; padding: 16px; margin-bottom: 24px; background: #f4f4f5; }
            .score { font-size: 18px; font-weight: bold; color: #059669; }
            .pitch { white-space: pre-wrap; font-size: 13px; border: 1px solid #e4e4e7; padding: 16px; background: #ffffff; }
            .footer { margin-top: 40px; font-size: 10px; color: #71717a; border-top: 1px solid #e4e4e7; padding-top: 12px; }
          </style>
        </head>
        <body>
          <h1>FUTMATCH PRO — EXECUTIVE DOSSIER</h1>
          <div class="subtitle">ZIELVEREIN: ${name.toUpperCase()} | SAISON 2026/2027 DATA ENGINE</div>
          
          <div class="box">
            <div><strong>MATCH SCORE:</strong> <span class="score">${score}%</span></div>
            <div><strong>TAKTIK ALIGNMENT:</strong> ${tactic}</div>
            <div style="margin-top: 8px;"><strong>VAKANZ & FIT ANALYSE:</strong> ${fitReason}</div>
          </div>

          <h3>PITCH-LETTER AN DIE KADERPLANUNG</h3>
          <div class="pitch">${pitchText}</div>

          <div class="footer">
            VERTRAULICHE B2B KADERPLANUNG — FUTMATCH PRO AGENCY INTELLIGENCE ENGINE OS
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="fixed inset-0 bg-zinc-950/90 z-50 flex items-center justify-center p-4">
      <div className="border border-zinc-800 bg-zinc-900 rounded-lg max-w-xl w-full p-6 space-y-4 relative text-xs font-sans shadow-2xl">
        <button onClick={onClose} className="absolute top-4 right-4 text-zinc-500 hover:text-white">✕</button>
        
        <div className="border-b border-zinc-800 pb-3 space-y-1 font-mono">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-wider">EXECUTIVE DOSSIER GENERATOR</span>
            <span className="px-2 py-0.5 rounded bg-emerald-950 border border-emerald-800 text-emerald-400 text-xs font-bold">
              {score}% MATCH SCORE
            </span>
          </div>
          <h3 className="text-lg font-bold text-white">{name}</h3>
          <p className="text-xs text-zinc-400">{club.league} • {tactic}</p>
        </div>

        <div className="space-y-3 font-mono">
          <div className="bg-zinc-950 p-3 rounded border border-zinc-800 text-[11px] space-y-1">
            <span className="text-zinc-400 font-bold block text-[10px] uppercase">TAKTIKERKENNUNG & VAKANZ-BEGRÜNDUNG:</span>
            <p className="text-zinc-200 font-sans leading-relaxed">{fitReason}</p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-zinc-400 font-bold text-[10px] uppercase">PITCH-MAIL AN SPORTDIREKTOR / KADERPLANER</label>
              <button 
                onClick={handleCopy}
                className="text-[10px] text-emerald-400 hover:text-emerald-300 font-mono underline"
              >
                {copied ? '✓ KOPIERT!' : 'Text kopieren'}
              </button>
            </div>
            <textarea 
              readOnly 
              value={pitchText}
              className="w-full h-36 bg-zinc-950 border border-zinc-800 rounded p-3 text-zinc-300 font-mono text-[11px] leading-relaxed focus:outline-none custom-scrollbar"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2 border-t border-zinc-800 font-mono text-xs">
          <button onClick={onClose} className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded font-bold transition">
            Schließen
          </button>
          <button 
            onClick={handlePrint} 
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded transition shadow-sm"
          >
            🖨️ PDF / Dossier Drucken
          </button>
        </div>
      </div>
    </div>
  );
}
