import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';

export default function App() {
  const getCleanPath = () => window.location.pathname.toLowerCase().trim();
  const [currentPath, setCurrentPath] = useState(getCleanPath());

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(getCleanPath());
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (path) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path.toLowerCase().trim());
  };

  const isDashboardRoute = currentPath.startsWith('/dashboard');

  return (
    <AuthProvider>
      {isDashboardRoute ? (
        <DashboardPage onBackToLanding={() => navigateTo('/')} />
      ) : (
        <LandingPage onEnterDashboard={() => navigateTo('/dashboard')} />
      )}
    </AuthProvider>
  );
}
