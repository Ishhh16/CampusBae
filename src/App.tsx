import { useState, useEffect } from 'react';
import { GalaxyBackground } from './components/GalaxyBackground';
import { LandingPage } from './components/LandingPage';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { ProfilePage } from './components/ProfilePage';
import { BranchResourcesPage } from './components/BranchResourcesPage';
import { MarketplacePage } from './components/MarketplacePage';
import { SocietiesPage } from './components/SocietiesPage';
import { NetworkingPage } from './components/NetworkingPage';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AuthDebug } from './components/AuthDebug';

function AppContent() {
  const { user, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState<'landing' | 'home' | 'profile' | 'resources' | 'marketplace' | 'societies' | 'networking'>('landing');
  const [authError, setAuthError] = useState<string | null>(null);

  // Simple navigation logic without complex state management
  useEffect(() => {
    if (!loading) {
      if (user && currentPage === 'landing') {
        setCurrentPage('home');
      } else if (!user && currentPage !== 'landing') {
        setCurrentPage('landing');
      }
    }
  }, [user, loading]); // Remove currentPage from deps to prevent infinite loop

  const handleNavigate = (page: string) => {
    setAuthError(null);
    setCurrentPage(page as any);
  };

  const handleLoginSuccess = () => {
    setCurrentPage('home');
    setAuthError(null);
  };

  const handleAuthError = (error: string) => {
    setAuthError(error);
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'landing':
        return <LandingPage onLoginSuccess={handleLoginSuccess} onAuthError={handleAuthError} authError={authError} />;
      case 'home':
        return <Dashboard onNavigate={handleNavigate} />;
      case 'profile':
        return <ProfilePage />;
      case 'resources':
        return <BranchResourcesPage />;
      case 'marketplace':
        return <MarketplacePage />;
      case 'societies':
        return <SocietiesPage />;
      case 'networking':
        return <NetworkingPage />;
      default:
        return <Dashboard onNavigate={handleNavigate} />;
    }
  };

  return (
    <div 
      className="min-h-screen relative"
      style={{ 
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif'
      }}
    >
      <GalaxyBackground />
      
      {user && currentPage !== 'landing' && (
        <Navbar currentPage={currentPage} onNavigate={handleNavigate} />
      )}
      
      <main className="relative z-10">
        {currentPage === 'landing' ? (
          <LandingPage 
            onLoginSuccess={handleLoginSuccess}
            onAuthError={handleAuthError}
            authError={authError}
          />
        ) : (
          renderCurrentPage()
        )}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}