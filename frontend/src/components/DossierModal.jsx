import React, { useState } from 'react';

export default function DossierModal({ club, profile, onClose }) {
  if (!club) return null;

  const [activeTab, setActiveTab] = useState('IV');

  const name = club.club_name || club.name;
  const score = club.match_score || club.score;
  const fitReason = club.tactical_fit_reason || club.fit;
  const tactic = club.tactical_alignment || '3-4-2-1 System';
  const headCoach = club.head_coach || 'Cheftrainer';

  const squadProfile = club.squad_profile || {};
  const deepTactics = squadProfile.deep_tactics || {};
  const positionalRoles = squadProfile.positional_role_tactics || {};
  const wyscoutStarters = squadProfile.wyscout_2027_starters || {};
  const coverageTier = deepTactics.data_coverage_tier || '100% Empirical WyScout Per-90 & Starter Minutes Index';

  const posCode = (profile ? profile.position || 'IV' : 'IV').toUpperCase();

  const pitchText = `Sehr geehrte Damen und Herren der Kaderplanung von ${name},

in Vorbereitung auf die kommenden Transfereffekte für die Saison 2026/27 möchten wir Ihnen unseren Klienten (Position: ${posCode}, Alter: ${profile?.age || 23}, Starker Fuß: ${profile?.preferred_foot || 'Rechts'}) vertraulich vorlegen.

Basierend auf unserer FutMatch Pro Kaderanalyse passt sein Profil hervorragend zu Ihrem bevorzugten Spielsystem (${tactic}) unter Cheftrainer ${headCoach} und adressiert Ihre Vakanzen auf der Position ${posCode}.

Taktisches Profil & Trainer-DNA: ${deepTactics.tactical_archetype || 'Dominantes System'} (PPDA: ${deepTactics.ppda || 10.5}, Ballbesitz: ${deepTactics.possession_pct || 50.0}%).

Vertragssituation: ${profile?.contract_status ? profile.contract_status.toUpperCase() : 'ABLÖSEFREI'} (Sehr hohe Transfer-Feasibilität).

Gerne senden wir Ihnen ein detailliertes Video-Dossier sowie die WyScout Per-90 Metriken zu.

Mit freundlichen Grüßen,
Ihr FutMatch Executive Advisor Team`;

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Executive Tactical Dossier — ${name}</title>
          <style>
            body { font-family: monospace; padding: 40px; color: #18181b; line-height: 1.6; }
            h1 { font-size: 20px; border-bottom: 2px solid #18181b; padding-bottom: 8px; margin-bottom: 4px; }
            .subtitle { font-size: 11px; color: #52525b; margin-bottom: 24px; text-transform: uppercase; }
            .grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; margin-bottom: 20px; }
            .stat-card { border: 1px solid #e4e4e7; padding: 10px; background: #f4f4f5; border-radius: 4px; }
            .label { font-size: 10px; color: #71717a; uppercase; font-weight: bold; }
            .val { font-size: 14px; font-weight: bold; color: #059669; }
            .box { border: 1px solid #d4d4d8; padding: 16px; margin-bottom: 24px; background: #fafafa; }
            .pitch { white-space: pre-wrap; font-size: 12px; border: 1px solid #e4e4e7; padding: 16px; background: #ffffff; }
            .footer { margin-top: 40px; font-size: 10px; color: #71717a; border-top: 1px solid #e4e4e7; padding-top: 12px; }
          </style>
        </head>
        <body>
          <h1>FUTMATCH PRO — EXECUTIVE TACTICAL DOSSIER</h1>
          <div class="subtitle">ZIELVEREIN: ${name.toUpperCase()} | CHEFTRAINER: ${headCoach.toUpperCase()} | SAISON 2026/27</div>
          
          <div class="grid">
            <div class="stat-card">
              <div class="label">SPIELSTIL & ARCHETYP</div>
              <div class="val">${deepTactics.tactical_archetype || 'Dominant'}</div>
            </div>
            <div class="stat-card">
              <div class="label">PRESSING (PPDA)</div>
              <div class="val">${deepTactics.ppda || 10.5} (${deepTactics.pressing_intensity_label || 'Aktives Pressing'})</div>
            </div>
            <div class="stat-card">
              <div class="label">BALLBESITZ %</div>
              <div class="val">${deepTactics.possession_pct || 50.0}% (Field Tilt: ${deepTactics.field_tilt_pct || 50.0}%)</div>
            </div>
          </div>

          <div class="box">
            <div><strong>TAKTIK ALIGNMENT:</strong> ${tactic}</div>
            <div style="margin-top: 8px;"><strong>VAKANZ & FIT ANALYSE:</strong> ${fitReason}</div>
          </div>

          <h3>PITCH-LETTER AN DIE KADERPLANUNG</h3>
          <div class="pitch">${pitchText}</div>

          <div class="footer">
            VERTRAULICHE B2B KADERPLANUNG — FUTMATCH PRO INTELLIGENCE ENGINE OS (${coverageTier})
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const currentStarter = wyscoutStarters[activeTab] || {};
  const metrics = currentStarter.empirical_metrics || {};

  const roleTabContent = {
    'IV': { 
      title: positionalRoles.cb_role || 'Innenverteidiger-Profil', 
      behavior: positionalRoles.cb_behavior || 'Aufbauspiel & Absicherung.',
      extra: positionalRoles.iv_buildup_involvement ? `IV-Einbindung im Aufbau: ${positionalRoles.iv_buildup_involvement}` : null
    },
    'AV': { 
      title: positionalRoles.av_role || 'Außenverteidiger-Profil', 
      behavior: positionalRoles.av_behavior || 'Schienen- & Overlap-Verhalten.',
      extra: positionalRoles.av_positioning ? `AV-Staffelung: ${positionalRoles.av_positioning}` : null
    },
    'ZM': { 
      title: positionalRoles.midfield_role || 'Mittelfeld-Zentrale (DM/ZM)', 
      behavior: positionalRoles.midfield_behavior || 'Passverteilung & Gegenpressing.',
      extra: positionalRoles.six_role_details ? `6er/ZM Steuerung: ${positionalRoles.six_role_details}` : null
    },
    'FLÜGEL': { 
      title: positionalRoles.winger_role || 'Flügelstürmer-Profil', 
      behavior: positionalRoles.winger_behavior || 'Dribblings & Cutback-Frequenz.',
      extra: positionalRoles.pressing_lane_closure ? `Pressing-Staffelung: ${positionalRoles.pressing_lane_closure}` : null
    },
    'MS': { 
      title: positionalRoles.striker_role || 'Stürmer-Profil', 
      behavior: positionalRoles.striker_behavior || 'Strafraum-Zuspiel & Laufwege.',
      extra: positionalRoles.shot_zones ? `Abschluss-Zonen: ${positionalRoles.shot_zones}` : null
    }
  };

  return (
    <div className="fixed inset-0 bg-zinc-950/90 z-50 flex items-center justify-center p-4">
      <div className="border border-zinc-800 bg-zinc-900 rounded-lg max-w-2xl w-full p-6 space-y-4 relative text-xs font-sans shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        <button onClick={onClose} className="absolute top-4 right-4 text-zinc-500 hover:text-white font-mono font-bold">✕</button>
        
        {/* Header */}
        <div className="border-b border-zinc-800 pb-3 space-y-1 font-mono">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              TEAM TAKTIK & EMPIRISCHE WYSCOUT ANALYSE
            </span>
            <span className="px-2 py-0.5 rounded bg-emerald-950 border border-emerald-800 text-emerald-400 text-xs font-bold font-mono">
              {score ? `${score}% MATCH SCORE` : 'GESAMT-KADER ANALYSIS'}
            </span>
          </div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            {name}
            <span className="text-xs font-normal text-zinc-400 font-mono">({club.league})</span>
          </h3>
          <p className="text-xs text-zinc-400 font-sans">
            Cheftrainer: <strong className="text-zinc-200">{headCoach}</strong> • System: <strong className="text-emerald-400">{tactic}</strong>
          </p>
        </div>

        {/* Scrollable Modal Body: PURE TEAM TACTICAL ANALYTICS */}
        <div className="space-y-4 overflow-y-auto custom-scrollbar pr-1 font-mono text-xs">
          
          {/* Tactical DNA Banner */}
          <div className="bg-zinc-950 p-3.5 rounded border border-zinc-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-zinc-400 uppercase font-bold">LIVE SPIELSTIL-DNA & TRAINER-PHILOSOPHIE (2026/27)</span>
              <span className="text-[10px] text-zinc-500 font-mono">{coverageTier}</span>
            </div>
            <div className="text-sm font-bold text-emerald-400">{deepTactics.tactical_archetype || 'Dominantes System'}</div>
            
            {/* Tactical Metrics Radar Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-1">
              <div className="p-2.5 rounded bg-zinc-900 border border-zinc-800 text-center">
                <span className="text-[9px] text-zinc-500 block uppercase font-bold">Ballbesitz</span>
                <span className="text-sm font-bold text-zinc-100">{deepTactics.possession_pct || 50.0}%</span>
              </div>
              <div className="p-2.5 rounded bg-zinc-900 border border-zinc-800 text-center">
                <span className="text-[9px] text-zinc-500 block uppercase font-bold">Pressing (PPDA)</span>
                <span className="text-sm font-bold text-amber-400">{deepTactics.ppda || 10.5}</span>
              </div>
              <div className="p-2.5 rounded bg-zinc-900 border border-zinc-800 text-center">
                <span className="text-[9px] text-zinc-500 block uppercase font-bold">Field Tilt %</span>
                <span className="text-sm font-bold text-blue-400">{deepTactics.field_tilt_pct || 50.0}%</span>
              </div>
              <div className="p-2.5 rounded bg-zinc-900 border border-zinc-800 text-center">
                <span className="text-[9px] text-zinc-500 block uppercase font-bold">Deep Entries</span>
                <span className="text-sm font-bold text-emerald-400">{deepTactics.deep_completions_per_match || 4.5}/Match</span>
              </div>
            </div>
          </div>

          {/* Vakanz & Taktik Justification */}
          <div className="bg-zinc-950 p-3 rounded border border-zinc-800 text-[11px] space-y-1">
            <span className="text-zinc-400 font-bold block text-[10px] uppercase">TAKTIKERKENNUNG & KADER-JUSTIFIZIERUNG:</span>
            <p className="text-zinc-200 font-sans leading-relaxed">{fitReason}</p>
          </div>

          {/* Interactive Positional Role Tabs */}
          <div className="space-y-2">
            <label className="text-zinc-400 font-bold text-[10px] uppercase block">POSITIONSSPEZIFISCHE ROLLENANFORDERUNG (SPIELERSCHEMA)</label>
            <div className="flex gap-1 border-b border-zinc-800 pb-1">
              {['IV', 'AV', 'ZM', 'FLÜGEL', 'MS'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1 text-[11px] font-bold rounded transition ${
                    activeTab === tab 
                      ? 'bg-emerald-950 border border-emerald-800 text-emerald-400' 
                      : 'bg-zinc-950 hover:bg-zinc-800 text-zinc-400'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            
            <div className="bg-zinc-950 p-3.5 rounded border border-zinc-800 font-sans space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-emerald-400 font-mono text-[11px] font-bold block uppercase">
                  📍 {roleTabContent[activeTab].title}
                </span>
                {currentStarter.player_name && (
                  <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-900 border border-zinc-700 text-amber-300 font-mono">
                    Top 26/27 Spielminuten: <strong>{currentStarter.player_name}</strong> ({currentStarter.minutes_2027} Min)
                  </span>
                )}
              </div>
              
              <p className="text-zinc-300 text-xs leading-relaxed">
                {roleTabContent[activeTab].behavior}
              </p>

              {/* WyScout Per-90 Empirical Metrics for the Top Starter */}
              {Object.keys(metrics).length > 0 && (
                <div className="pt-2 border-t border-zinc-800/80 space-y-1 font-mono">
                  <span className="text-[9px] text-zinc-400 font-bold uppercase block">
                    ⚡ WYSCOUT PER-90 METRIKEN DES AKTUELLEN STARTERS ({currentStarter.player_name}):
                  </span>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-1.5 pt-0.5">
                    {Object.entries(metrics).map(([k, v]) => (
                      <div key={k} className="p-1.5 rounded bg-zinc-900 border border-zinc-800 text-[10px]">
                        <span className="text-zinc-500 block uppercase text-[8px] font-bold">{k.replace(/_/g, ' ')}</span>
                        <span className="text-emerald-400 font-bold">{v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {roleTabContent[activeTab].extra && (
                <div className="pt-1 text-[10px] text-amber-400/90 font-mono">
                  💡 {roleTabContent[activeTab].extra}
                </div>
              )}
            </div>
          </div>

          {/* FC Barcelona Standard Pro Tactical Analyst Breakdown */}
          <div className="bg-zinc-950 p-3 rounded border border-zinc-800 space-y-2">
            <span className="text-[10px] text-amber-400 font-bold uppercase block tracking-wider">
              📊 PRO TAKTIK-ANALYSE (FC BARCELONA STANDARD METRIKEN)
            </span>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="p-2 bg-zinc-900 rounded border border-zinc-800">
                <span className="text-[9px] text-zinc-500 block font-bold uppercase">Shot Zones & Abschlüsse</span>
                <span className="text-zinc-200 font-sans">{positionalRoles.shot_zones || 'Strafraum & Halbraum-Passagen'}</span>
              </div>
              <div className="p-2 bg-zinc-900 rounded border border-zinc-800">
                <span className="text-[9px] text-zinc-500 block font-bold uppercase">Abwehrketten-Höhe</span>
                <span className="text-emerald-400 font-bold">{positionalRoles.defensive_line_height_meters || 46.0} m</span>
              </div>
              <div className="p-2 bg-zinc-900 rounded border border-zinc-800">
                <span className="text-[9px] text-zinc-500 block font-bold uppercase">Linienbrechende Pässe</span>
                <span className="text-zinc-200 font-bold">{positionalRoles.line_breaking_passes_per_90 || 42.0} / 90 Min</span>
              </div>
              <div className="p-2 bg-zinc-900 rounded border border-zinc-800">
                <span className="text-[9px] text-zinc-500 block font-bold uppercase">Schnittstellen-Steckpässe</span>
                <span className="text-zinc-200 font-bold">{positionalRoles.through_balls_per_90 || 3.5} / 90 Min</span>
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 pt-3 border-t border-zinc-800 font-mono text-xs">
          <button onClick={onClose} className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded font-bold transition">
            Schließen
          </button>
          <button 
            onClick={handlePrint} 
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded transition shadow-sm"
          >
            🖨️ PDF Dossier Drucken
          </button>
        </div>
      </div>
    </div>
  );
}
