import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';

export default function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (path) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
  };

  return (
    <AuthProvider>
      {currentPath === '/dashboard' ? (
        <DashboardPage onBackToLanding={() => navigateTo('/')} />
      ) : (
        <LandingPage onEnterDashboard={() => navigateTo('/dashboard')} />
      )}
    </AuthProvider>
  );
}
