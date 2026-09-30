import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext();

export const ADMIN_EMAIL = 'phinampham3@gmail.com';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Check initial Supabase auth session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        setUser(session.user);
      } else {
        // Fallback: Check local persistent admin session
        const storedAdmin = localStorage.getItem('futmatch_admin_session');
        if (storedAdmin === 'true') {
          setUser({ email: ADMIN_EMAIL, id: 'admin-persisted-session' });
        } else {
          setUser(null);
        }
      }
      setLoading(false);
    }).catch(() => {
      const storedAdmin = localStorage.getItem('futmatch_admin_session');
      if (storedAdmin === 'true') {
        setUser({ email: ADMIN_EMAIL, id: 'admin-persisted-session' });
      }
      setLoading(false);
    });

    // 2. Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) {
        setUser(session.user);
        localStorage.setItem('futmatch_admin_session', 'true');
      } else {
        const storedAdmin = localStorage.getItem('futmatch_admin_session');
        if (storedAdmin === 'true') {
          setUser({ email: ADMIN_EMAIL, id: 'admin-persisted-session' });
        } else {
          setUser(null);
        }
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const loginWithPassword = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    if (email.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
      localStorage.setItem('futmatch_admin_session', 'true');
    }
    return data;
  };

  const loginAsDemoAdmin = () => {
    localStorage.setItem('futmatch_admin_session', 'true');
    setUser({ email: ADMIN_EMAIL, id: 'admin-demo-session' });
  };

  const loginWithMagicLink = async (email) => {
    const { data, error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: window.location.origin,
      },
    });
    if (error) throw error;
    return data;
  };

  const logout = async () => {
    localStorage.removeItem('futmatch_admin_session');
    await supabase.auth.signOut().catch(() => {});
    setUser(null);
    setSession(null);
  };

  const isAdmin = (user?.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase()) || (localStorage.getItem('futmatch_admin_session') === 'true');

  return (
    <AuthContext.Provider value={{
      user,
      session,
      loading,
      isAdmin,
      loginWithPassword,
      loginWithMagicLink,
      loginAsDemoAdmin,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
