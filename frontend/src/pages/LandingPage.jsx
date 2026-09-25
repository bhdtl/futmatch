import React, { useState } from 'react';
import LoginModal from '../components/LoginModal';
import DemoRequestModal from '../components/DemoRequestModal';
import { useAuth } from '../context/AuthContext';

export default function LandingPage({ onEnterDashboard }) {
  const { user, isAdmin, logout } = useAuth();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isDemoOpen, setIsDemoOpen] = useState(false);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 antialiased selection:bg-emerald-500 selection:text-zinc-950 flex flex-col justify-between font-sans relative overflow-x-hidden">
      
      {/* Background Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-teal-500/5 rounded-full blur-[160px] pointer-events-none"></div>

      {/* Navigation Bar */}
      <header className="fixed top-0 left-0 right-0 z-40 px-6 py-4 bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-800/80">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center font-black text-zinc-950 text-lg shadow-lg shadow-emerald-500/20">
              ⚡
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
                FutMatch <span className="text-xs px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">PRO</span>
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                {isAdmin ? (
                  <button 
                    onClick={onEnterDashboard}
                    className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition"
                  >
                    Zum Workspace (/dashboard)
                  </button>
                ) : (
                  <span className="text-xs text-red-400 font-medium">Kein Admin-Zugang</span>
                )}
                <button 
                  onClick={logout}
                  className="text-xs text-zinc-400 hover:text-white px-2 py-1 transition"
                >
                  Abmelden
                </button>
              </div>
            ) : (
              <>
                <button 
                  onClick={() => setIsLoginOpen(true)}
                  className="text-xs font-bold text-zinc-300 hover:text-white px-4 py-2 transition"
                >
                  Login
                </button>
                <button 
                  onClick={() => setIsDemoOpen(true)}
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition"
                >
                  Zugang anfragen / Demo buchen
                </button>
              </>
            )}
          </div>

        </div>
      </header>

      {/* Hero Section */}
      <main className="pt-32 pb-20 px-6 max-w-6xl mx-auto flex-1 flex flex-col justify-center space-y-16 relative z-10">
        
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-xs text-emerald-400 font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>B2B Transfer Intelligence OS</span>
          </div>

          <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white leading-[1.1]">
            Die Transfer-Matching Engine für <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">Spielerberater</span>
          </h2>

          <p className="text-sm md:text-base text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            FutMatch Pro analysiert Kader-Vakanzen, Formations-Alignments und Vertragskonstellationen in europäischen Ziel-Ligen. Finden Sie in Sekunden den perfekten Verein für Ihre Klienten.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={() => setIsDemoOpen(true)}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-sm shadow-xl shadow-emerald-500/20 transition flex items-center justify-center gap-2"
            >
              <span>Zugang anfragen / Demo buchen</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
            </button>
            <button 
              onClick={() => setIsLoginOpen(true)}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 font-semibold text-sm border border-zinc-800 transition"
            >
              Bestandskunden Login
            </button>
          </div>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="bg-zinc-900/80 backdrop-blur-md border border-zinc-800/80 rounded-3xl p-6 space-y-3 shadow-2xl hover:border-zinc-700/80 transition">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center font-bold text-lg">
              🎯
            </div>
            <h3 className="text-base font-bold text-white">Vakanz-Erkennung</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Erkennt automatisch auslaufende Verträge und entstehende Notstände auf spezifischen Positionen bei europäischen Zielvereinen.
            </p>
          </div>

          <div className="bg-zinc-900/80 backdrop-blur-md border border-zinc-800/80 rounded-3xl p-6 space-y-3 shadow-2xl hover:border-zinc-700/80 transition">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center font-bold text-lg">
              📊
            </div>
            <h3 className="text-base font-bold text-white">Formations- & System-Fit</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Algorithmisches Matchmaking für Taktik-Alignment (z.B. Dreierkette vs. Viererkette, Schienenspieler, Pressing-Intensität).
            </p>
          </div>

          <div className="bg-zinc-900/80 backdrop-blur-md border border-zinc-800/80 rounded-3xl p-6 space-y-3 shadow-2xl hover:border-zinc-700/80 transition">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center font-bold text-lg">
              📄
            </div>
            <h3 className="text-base font-bold text-white">One-Click Pitch Dossiers</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Generiert maßgeschneiderte Pitch-Dokumente und Direkt-Mails für Sportdirektoren und Chef-Scouts auf Knopfdruck.
            </p>
          </div>

        </div>

        {/* Security Badge Banner */}
        <div className="bg-zinc-900/50 border border-zinc-800/80 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-400">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg font-mono font-bold text-[10px]">
              SECURITY APPROVED
            </span>
            <span>Enterprise-Grade Cyber Security & Supabase Auth Protection</span>
          </div>
          <span className="font-mono text-zinc-500 text-[11px]">Strict Role Access Control (phinampham3@gmail.com)</span>
        </div>

      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800/80 py-6 px-6 bg-zinc-950 text-center text-xs text-zinc-500 font-mono">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>© 2026 FutMatch Pro. Alle Rechte vorbehalten.</p>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-zinc-300 transition">Datenschutz</a>
            <a href="#" className="hover:text-zinc-300 transition">Impressum</a>
            <a href="#" className="hover:text-zinc-300 transition">AGB</a>
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
