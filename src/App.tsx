import { useState, useEffect } from 'react';
import { GalaxyBackground } from './components/GalaxyBackground';
import { LandingPage } from './components/LandingPage';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Dashboard } from './components/Dashboard';
import { ProfilePage } from './components/ProfilePage';
import { BranchResourcesPage } from './components/BranchResourcesPage';
import { MarketplacePage } from './components/MarketplacePage';
import { SocietiesPage } from './components/SocietiesPage';
import { RoadmapPage } from './components/RoadmapPage';
import { NetworkingPage } from './components/NetworkingPage';
import { PasswordResetPage } from './components/auth/PasswordResetPage';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AuthDebug } from './components/AuthDebug';

function AppContent() {
  const { user, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState<'landing' | 'home' | 'profile' | 'resources' | 'marketplace' | 'societies' | 'roadmap' | 'networking' | 'reset-password'>('landing');
  const [authError, setAuthError] = useState<string | null>(null);
  const [isPdfOpen, setIsPdfOpen] = useState<boolean>(false);
  
  // State for navigation filters
  const [resourceFilters, setResourceFilters] = useState<{
    branch?: string;
    semester?: string;
    subject?: string;
    type?: string;
  }>({});
  
  const [societyFilters, setSocietyFilters] = useState<{
    scrollToSociety?: number;
  }>({});

  // Simple navigation logic without complex state management
  useEffect(() => {
    // Check if we're on the password reset page FIRST (before checking user login status)
    const urlParams = new URLSearchParams(window.location.search);
    const type = urlParams.get('type');
    const accessToken = urlParams.get('access_token');
    const hash = window.location.hash;
    
    // Debug logging
    console.log('🔍 URL Debug:', {
      pathname: window.location.pathname,
      search: window.location.search,
      hash: window.location.hash,
      type,
      hasAccessToken: !!accessToken
    });
    
    // Parse hash parameters as well
    let hashType = null;
    let hashAccessToken = null;
    if (hash) {
      const hashParams = new URLSearchParams(hash.substring(1));
      hashType = hashParams.get('type');
      hashAccessToken = hashParams.get('access_token');
    }
    
    // Check multiple possible formats for password reset - PRIORITY OVER USER LOGIN
    if (type === 'recovery' || 
        hashType === 'recovery' ||
        hash.includes('type=recovery') || 
        hash.includes('access_token') ||
        accessToken ||
        hashAccessToken ||
        window.location.pathname === '/reset-password') {
      console.log('✅ Password reset detected, forcing reset page', { type, hashType, hasToken: !!(accessToken || hashAccessToken) });
      setCurrentPage('reset-password');
      return; // Don't check user login status if we're on reset page
    }

    // Only handle regular login/navigation if NOT on reset page
    if (!loading && currentPage !== 'reset-password') {
      if (user && currentPage === 'landing') {
        setCurrentPage('home');
      } else if (!user && currentPage !== 'landing') {
        setCurrentPage('landing');
      }
    }
  }, [user, loading, currentPage]); // Added currentPage back to ensure reset page takes priority

  const handleNavigate = (page: string, filters?: any) => {
    setAuthError(null);
    if (page === 'resources' && filters) {
      setResourceFilters(filters);
      setSocietyFilters({});
    } else if (page === 'societies' && filters) {
      setSocietyFilters(filters);
      setResourceFilters({});
    } else {
      setResourceFilters({});
      setSocietyFilters({});
    }
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
      case 'reset-password':
        return <PasswordResetPage />;
      case 'home':
        return <Dashboard onNavigate={handleNavigate} />;
      case 'profile':
        return <ProfilePage />;
      case 'resources':
        return <BranchResourcesPage 
          initialBranch={resourceFilters.branch}
          initialSemester={resourceFilters.semester}
          initialSubject={resourceFilters.subject}
          initialType={resourceFilters.type}
        />;
      case 'marketplace':
        return <MarketplacePage />;
      case 'societies':
        return <SocietiesPage scrollToSociety={societyFilters.scrollToSociety} />;
      case 'roadmap':
        return <RoadmapPage onPdfStateChange={setIsPdfOpen} />;
      case 'networking':
        return <NetworkingPage />;
      default:
        return <Dashboard onNavigate={handleNavigate} />;
    }
  };

  // Special case for password reset page - show only the reset component
  if (currentPage === 'reset-password') {
    return <PasswordResetPage />;
  }

  return (
    <div 
      className="min-h-screen relative flex flex-col"
      style={{ 
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif'
      }}
    >
      <GalaxyBackground />
      
      {user && currentPage !== 'landing' && !isPdfOpen && (
        <Navbar currentPage={currentPage} onNavigate={handleNavigate} />
      )}
      
      <main className="relative z-10 flex-1">
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

      <Footer onNavigate={handleNavigate} currentPage={currentPage} />
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
