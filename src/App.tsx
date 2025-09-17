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
import { AuthProvider, useAuth } from './context/AuthContext';
import { AuthDebug } from './components/AuthDebug';

function AppContent() {
  const { user, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState<'landing' | 'home' | 'profile' | 'resources' | 'marketplace' | 'societies' | 'roadmap' | 'networking'>('landing');
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
    if (!loading) {
      if (user && currentPage === 'landing') {
        setCurrentPage('home');
      } else if (!user && currentPage !== 'landing') {
        setCurrentPage('landing');
      }
    }
  }, [user, loading]); // Remove currentPage from deps to prevent infinite loop

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