import React, { useState } from 'react';
import LoginModal from '../components/LoginModal';
import DemoRequestModal from '../components/DemoRequestModal';
import { useAuth } from '../context/AuthContext';

export default function LandingPage({ onEnterDashboard }) {
  const { user, isAdmin, logout } = useAuth();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isDemoOpen, setIsDemoOpen] = useState(false);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 antialiased selection:bg-emerald-600 selection:text-white flex flex-col justify-between font-sans">
      
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-950 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-7 w-7 rounded bg-emerald-600 flex items-center justify-center font-bold text-white text-xs font-mono">
              FM
            </div>
            <span className="font-bold text-white tracking-tight text-sm uppercase">
              FutMatch <span className="font-mono text-xs text-zinc-400 font-normal">/ PRO</span>
            </span>
          </div>
          
          <div className="flex items-center gap-4 text-xs font-medium">
            {user ? (
              <div className="flex items-center gap-3">
                {isAdmin && (
                  <button 
                    onClick={onEnterDashboard}
                    className="px-3.5 py-2 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition"
                  >
                    Zum Workspace (/dashboard)
                  </button>
                )}
                <button 
                  onClick={logout}
                  className="text-zinc-400 hover:text-white transition"
                >
                  Abmelden
                </button>
              </div>
            ) : (
              <>
                <button 
                  onClick={() => setIsLoginOpen(true)}
                  className="text-zinc-400 hover:text-white transition"
                >
                  Anmelden
                </button>
                <button 
                  onClick={() => setIsDemoOpen(true)}
                  className="px-3.5 py-2 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition"
                >
                  Zugang anfragen
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 pt-16 pb-12 space-y-10 flex-1">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 text-[11px] text-zinc-400 font-mono">
            <span>KADER-VAKANZEN</span> • <span>SYSTEM-FIT</span> • <span>ONE-CLICK DOSSIERS</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Die Transfer-Matching Engine für Spielerberater & Agenturen.
          </h1>
          <p className="text-sm text-zinc-400 leading-relaxed max-w-2xl">
            FutMatch Pro aggregiert taktische Spielsysteme, Kaderstrukturen und auslaufende Verträge europäischer Profivereine. Finden Sie den optimalen Club-Fit für Ihre Klienten in Sekunden.
          </p>
        </div>

        {/* Product Preview (Data-Dense Table) */}
        <div className="border border-zinc-800 rounded-lg bg-zinc-900/60 overflow-hidden shadow-sm space-y-0">
          <div className="px-5 py-3 border-b border-zinc-800 bg-zinc-950 flex items-center justify-between text-xs font-mono">
            <span className="text-zinc-400 uppercase tracking-wider">Interaktive Produkt-Vorschau — Klient: Innenverteidiger (IV), Linksfuß, Ablösefrei 2025</span>
            <span className="text-emerald-500">● LIVE ENGINE</span>
          </div>

          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-zinc-950/80 text-zinc-400 font-mono text-[11px] uppercase tracking-wider border-b border-zinc-800">
                  <th className="py-3 px-5">Verein</th>
                  <th className="py-3 px-4">Liga</th>
                  <th className="py-3 px-4">Taktisches System</th>
                  <th className="py-3 px-4 text-center">Match-Score</th>
                  <th className="py-3 px-5">Vakanz- & Fit-Analyse</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/80 text-zinc-200 font-sans">
                <tr className="hover:bg-zinc-800/40">
                  <td className="py-3.5 px-5 font-semibold text-white">FC St. Pauli</td>
                  <td className="py-3.5 px-4 font-mono text-zinc-400">2. Bundesliga</td>
                  <td className="py-3.5 px-4 font-mono text-zinc-300">3-4-2-1 Dreierkette</td>
                  <td className="py-3.5 px-4 text-center">
                    <span className="px-2 py-0.5 rounded bg-emerald-950 border border-emerald-800 text-emerald-400 font-mono font-bold">
                      96%
                    </span>
                  </td>
                  <td className="py-3.5 px-5 text-zinc-400 text-xs">
                    Vertrag des Stamm-IV läuft Juni 2025 aus. Hoher Bedarf an linksfüßigem Aufbau-Verteidiger.
                  </td>
                </tr>
                <tr className="hover:bg-zinc-800/40">
                  <td className="py-3.5 px-5 font-semibold text-white">KV Mechelen</td>
                  <td className="py-3.5 px-4 font-mono text-zinc-400">Jupiler Pro League</td>
                  <td className="py-3.5 px-4 font-mono text-zinc-300">4-3-3 Pressing</td>
                  <td className="py-3.5 px-4 text-center">
                    <span className="px-2 py-0.5 rounded bg-emerald-950 border border-emerald-800 text-emerald-400 font-mono font-bold">
                      92%
                    </span>
                  </td>
                  <td className="py-3.5 px-5 text-zinc-400 text-xs">
                    Abwehrchef vor Wechsel in Serie A. Suche nach ablösefreiem Ersatz mit hoher Passquote.
                  </td>
                </tr>
                <tr className="hover:bg-zinc-800/40">
                  <td className="py-3.5 px-5 font-semibold text-white">Fortuna Düsseldorf</td>
                  <td className="py-3.5 px-4 font-mono text-zinc-400">2. Bundesliga</td>
                  <td className="py-3.5 px-4 font-mono text-zinc-300">4-4-2 Flaches System</td>
                  <td className="py-3.5 px-4 text-center">
                    <span className="px-2 py-0.5 rounded bg-emerald-950 border border-emerald-800 text-emerald-400 font-mono font-bold">
                      88%
                    </span>
                  </td>
                  <td className="py-3.5 px-5 text-zinc-400 text-xs">
                    Zwei Verträge laufen im Sommer aus. Budget für ablösefreie Spieler reserviert.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="border-t border-zinc-800 bg-zinc-950 py-16">
        <div className="max-w-6xl mx-auto px-6 space-y-10">
          <div className="space-y-2">
            <span className="text-xs font-mono text-emerald-500 uppercase tracking-wider">WORKFLOW</span>
            <h2 class="text-2xl font-bold text-white tracking-tight">In drei Schritten zum passenden Zielverein.</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border border-zinc-800 bg-zinc-900/40 p-6 rounded-lg space-y-3">
              <span className="text-xs font-mono text-zinc-500">01 / EINGABE</span>
              <h3 className="text-sm font-bold text-white">Klienten-Profil erfassen</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Position, starker Fuß, Altersklasse und Vertragssituation eingeben. Der Algorithmus identifiziert den statistischen Spielertyp.
              </p>
            </div>

            <div className="border border-zinc-800 bg-zinc-900/40 p-6 rounded-lg space-y-3">
              <span className="text-xs font-mono text-zinc-500">02 / MATCHING</span>
              <h3 className="text-sm font-bold text-white">Vakanzen & Taktik abgleichen</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                FutMatch gleicht die Anforderungen mit Spielsystemen, Trainer-Präferenzen und auslaufenden Verträgen europäischer Klubs ab.
              </p>
            </div>

            <div className="border border-zinc-800 bg-zinc-900/40 p-6 rounded-lg space-y-3">
              <span className="text-xs font-mono text-zinc-500">03 / OUTREACH</span>
              <h3 className="text-sm font-bold text-white">Dossier & Pitch generieren</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Generieren Sie mit einem Klick vorbereitete Pitch-Dokumente und Direkt-Mails für Sportdirektoren und Chef-Scouts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Invitation-Only / Demo Request Form */}
      <section id="demo" className="border-t border-zinc-800 py-16 bg-zinc-950">
        <div className="max-w-xl mx-auto px-6 space-y-6">
          <div className="space-y-2 text-center">
            <span className="text-xs font-mono text-emerald-500 uppercase tracking-wider">INVITATION-ONLY</span>
            <h2 className="text-2xl font-bold text-white tracking-tight">Zugang anfragen oder Demo buchen</h2>
            <p className="text-xs text-zinc-400">FutMatch Pro richtet sich exklusiv an lizenzierte Spielerberater und Agenturen.</p>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); setIsDemoOpen(true); }} className="border border-zinc-800 bg-zinc-900/60 p-6 rounded-lg space-y-4 text-xs">
            <div>
              <label className="block text-zinc-300 font-medium mb-1">Vollständiger Name *</label>
              <input type="text" required placeholder="z.B. Alexander Schmidt" className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-white focus:outline-none focus:border-emerald-600" />
            </div>
            <div>
              <label className="block text-zinc-300 font-medium mb-1">Geschäftliche E-Mail *</label>
              <input type="email" required placeholder="name@agentur.de" className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-white focus:outline-none focus:border-emerald-600" />
            </div>
            <div>
              <label className="block text-zinc-300 font-medium mb-1">Name der Agentur *</label>
              <input type="text" required placeholder="Sports Management GmbH" className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-white focus:outline-none focus:border-emerald-600" />
            </div>
            <button type="submit" className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded transition">
              Demo-Termin & Zugang anfordern
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800 py-6 px-6 bg-zinc-950 text-center text-xs text-zinc-500 font-mono">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>© 2026 FutMatch Pro. Utilitarian Data Platform.</p>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-zinc-300 transition">Datenschutz</a>
            <a href="#" className="hover:text-zinc-300 transition">Impressum</a>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <LoginModal 
        isOpen={isLoginOpen} 
        onClose={() => setIsLoginOpen(false)} 
        onSuccess={() => {
          setIsLoginOpen(false);
          if (onEnterDashboard) onEnterDashboard();
        }}
      />

      <DemoRequestModal 
        isOpen={isDemoOpen} 
        onClose={() => setIsDemoOpen(false)} 
      />

    </div>
  );
}
