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
          setErrorMsg(`Zugriff Verweigert: Für '${loggedUserEmail}' liegt keine Administrator-Berechtigung vor. Nur '${ADMIN_EMAIL}' ist autorisiert.`);
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
    <div className="fixed inset-0 bg-zinc-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5 relative">
        <button onClick={onClose} className="absolute top-5 right-5 text-zinc-400 hover:text-white p-1">
          ✕
        </button>

        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs border border-emerald-500/30">
              🔒
            </div>
            <span className="text-[10px] text-emerald-400 font-mono uppercase tracking-wider">Geschützter Bereich</span>
          </div>
          <h3 className="text-xl font-bold text-white tracking-tight">FutMatch Pro Login</h3>
          <p className="text-xs text-zinc-400">Authentifizierung für lizenzierte Spielerberater & Administratoren.</p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs leading-relaxed">
            {errorMsg}
          </div>
        )}

        {infoMsg && (
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs leading-relaxed">
            {infoMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="text-zinc-300 font-medium block mb-1">E-Mail Adresse *</label>
            <input 
              type="email"
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="z.B. phinampham3@gmail.com"
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {!useMagicLink && (
            <div>
              <label className="text-zinc-300 font-medium block mb-1">Passwort *</label>
              <input 
                type="password"
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          )}

          <div className="flex items-center justify-between pt-1">
            <button 
              type="button" 
              onClick={() => setUseMagicLink(!useMagicLink)} 
              className="text-[11px] text-zinc-400 hover:text-emerald-400 underline transition"
            >
              {useMagicLink ? "Mit Passwort anmelden" : "Stattdessen Magic-Link per E-Mail senden"}
            </button>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs rounded-xl py-3 transition shadow-lg shadow-emerald-500/20 disabled:opacity-50"
          >
            {loading ? "Authentifiziere..." : "FutMatch Pro Workspace Betreten"}
          </button>
        </form>

        <div className="pt-3 border-t border-zinc-800/80 text-center">
          <p className="text-[10px] text-zinc-500 font-mono">
            Authorized Email Access: <strong className="text-zinc-400">{ADMIN_EMAIL}</strong>
          </p>
        </div>
      </div>
    </div>
  );
}
