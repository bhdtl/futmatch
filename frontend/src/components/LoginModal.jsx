import React, { useState } from 'react';
import { useAuth, ADMIN_EMAIL } from '../context/AuthContext';

export default function LoginModal({ isOpen, onClose, onSuccess }) {
  const { loginWithPassword, loginWithMagicLink } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [useMagicLink, setUseMagicLink] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [infoMsg, setInfoMsg] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(null);
    setInfoMsg(null);
    setLoading(true);

    try {
      if (useMagicLink) {
        await loginWithMagicLink(email);
        setInfoMsg(`Ein Anmelde-Link wurde an ${email} gesendet. Bitte prüfen Sie Ihre E-Mails.`);
      } else {
        const data = await loginWithPassword(email, password);
        const loggedUserEmail = data?.user?.email?.toLowerCase();
        
        if (loggedUserEmail !== ADMIN_EMAIL.toLowerCase()) {
          setErrorMsg('Anmeldung fehlgeschlagen. Keine Berechtigung für diesen Account.');
          setLoading(false);
          return;
        }

        if (onSuccess) onSuccess();
        onClose();
      }
    } catch (err) {
      setErrorMsg(err.message || 'Anmeldung fehlgeschlagen. Bitte Anmeldedaten überprüfen.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-zinc-950/90 z-50 flex items-center justify-center p-4">
      <div className="border border-zinc-800 bg-zinc-900 rounded-lg max-w-sm w-full p-6 space-y-4 relative text-xs font-sans shadow-xl">
        <button onClick={onClose} className="absolute top-4 right-4 text-zinc-500 hover:text-white">
          ✕
        </button>

        <div className="space-y-1">
          <h3 className="text-base font-bold text-white">Anmelden</h3>
          <p className="text-zinc-400 text-[11px]">Zugang für lizenzierte Nutzer & Partner.</p>
        </div>

        {errorMsg && (
          <div className="p-2.5 bg-red-500/10 border border-red-500/30 rounded text-red-400 text-[11px] leading-relaxed">
            {errorMsg}
          </div>
        )}

        {infoMsg && (
          <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded text-emerald-400 text-[11px] leading-relaxed">
            {infoMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-zinc-300 font-medium mb-1">E-Mail Adresse *</label>
            <input 
              type="email"
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@agentur.de"
              className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-white focus:outline-none focus:border-emerald-600"
            />
          </div>

          {!useMagicLink && (
            <div>
              <label className="block text-zinc-300 font-medium mb-1">Passwort *</label>
              <input 
                type="password"
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-white focus:outline-none focus:border-emerald-600"
              />
            </div>
          )}

          <div className="flex items-center justify-between">
            <button 
              type="button" 
              onClick={() => setUseMagicLink(!useMagicLink)} 
              className="text-[11px] text-zinc-400 hover:text-white underline transition"
            >
              {useMagicLink ? "Mit Passwort anmelden" : "Magic-Link per E-Mail senden"}
            </button>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded transition disabled:opacity-50"
          >
            {loading ? "Authentifiziere..." : "Anmelden"}
          </button>
        </form>
      </div>
    </div>
  );
}
