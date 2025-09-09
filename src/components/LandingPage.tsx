import { useState } from 'react';
import { Button } from './ui/button';
import { LoginForm } from './auth/LoginForm';
import { SignupForm } from './auth/SignupForm';

interface LandingPageProps {
  onLoginSuccess: () => void;
  onAuthError: (error: string) => void;
  authError: string | null;
}

export function LandingPage({ onLoginSuccess, onAuthError, authError }: LandingPageProps) {
  const [showLogin, setShowLogin] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className="mb-8">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span style={{ color: '#EAEAEA' }}>Don't just study it, </span>
            <span 
              style={{ 
                color: '#00E5FF', 
                textShadow: '0 0 20px rgba(0, 229, 255, 0.6)' 
              }}
              className="block sm:inline"
            >
              CampusBae
            </span>
            <span style={{ color: '#EAEAEA' }}> it.</span>
          </h1>
          
          <p 
            className="text-xl md:text-2xl mb-12 max-w-2xl mx-auto"
            style={{ color: '#A0AEC0' }}
          >
            Your all-in-one campus companion for IGDTUW students.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
          {/* Login Button */}
          <Button
            size="lg"
            onClick={() => {
              setShowLogin(true);
              setShowForm(true);
              setSignupSuccess(false);
              onAuthError(null); // Clear any errors
            }}
            className={`
              text-lg px-12 py-4 rounded-full
              transition-all duration-300
              hover:scale-105 hover:shadow-2xl
            `}
            style={{
              background: showLogin 
                ? 'linear-gradient(135deg, #0D47A1, #00BFFF)'
                : 'transparent',
              color: '#EAEAEA',
              border: showLogin ? 'none' : '2px solid #00BFFF',
              boxShadow: showLogin ? '0 8px 32px rgba(0, 191, 255, 0.3)' : 'none'
            }}
          >
            Login
          </Button>

          {/* Signup Button */}
          <Button
            size="lg"
            onClick={() => {
              setShowLogin(false);
              setShowForm(true);
              setSignupSuccess(false);
              onAuthError(null); // Clear any errors
            }}
            className={`
              text-lg px-12 py-4 rounded-full
              transition-all duration-300
              hover:scale-105
            `}
            style={{
              background: !showLogin 
                ? 'linear-gradient(135deg, #0D47A1, #00BFFF)'
                : 'transparent',
              color: '#EAEAEA',
              border: !showLogin ? 'none' : '2px solid #00BFFF',
              boxShadow: !showLogin ? '0 8px 32px rgba(0, 191, 255, 0.3)' : 'none'
            }}
          >
            Signup
          </Button>
        </div>

        {/* Auth Forms */}
        {showForm && (
          <div className="max-w-md mx-auto mb-12">
            {showLogin ? (
              <LoginForm onSuccess={onLoginSuccess} onError={onAuthError} hasError={!!authError} />
            ) : (
              <SignupForm 
                onSuccess={() => {
                  setSignupSuccess(true);
                  setShowLogin(true);
                  onAuthError(null); // Clear any previous errors
                }} 
                onError={onAuthError} 
                hasError={!!authError}
              />
            )}
            {authError && (
              <div className="mt-4 p-3 rounded-lg border border-red-500/50 bg-red-500/10 backdrop-blur-sm">
                <p className="text-red-400 font-medium text-sm flex items-center gap-2">
                  <span className="text-red-500">⚠️</span>
                  {authError}
                </p>
              </div>
            )}
            {signupSuccess && showLogin && (
              <div className="mt-4 p-3 rounded-lg border border-green-500/50 bg-green-500/10 backdrop-blur-sm">
                <p className="text-green-400 font-medium text-sm flex items-center gap-2">
                  <span className="text-green-500">✅</span>
                  Signup successful! Please check your IGDTUW email for confirmation, then login.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Floating elements */}
        <div className="absolute top-1/4 left-10 w-32 h-32 bg-blue-500 rounded-full opacity-10 blur-3xl animate-pulse" />
        <div
          className="absolute bottom-1/4 right-10 w-40 h-40 bg-cyan-400 rounded-full opacity-5 blur-3xl animate-pulse"
          style={{ animationDelay: '1s' }}
        />
      </div>
    </div>
  );
}
