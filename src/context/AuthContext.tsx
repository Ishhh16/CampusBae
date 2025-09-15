import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabaseClient';

interface StudentProfile {
  name: string;
  email: string;
  enrollment_number: string;
  branch: string;
  batch: number;
}

interface AuthContextType {
  user: User | null;
  userProfile: StudentProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string, enrollmentNumber: string, branch: string, batch: string) => Promise<void>;
  signOut: () => Promise<void>;
  getUserProfile: () => Promise<StudentProfile | null>;
}

const AuthContext = createContext<AuthContextType>({ 
  user: null,
  userProfile: null,
  loading: true,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
  getUserProfile: async () => null
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const signIn = async (email: string, password: string) => {
    console.log('🔑 Attempting login for:', email);
    
    // Validate email format
    if (!email || !email.includes('@')) {
      throw new Error('📧 Please enter a valid email address.');
    }
    
    const { data, error } = await supabase.auth.signInWithPassword({ 
      email: email.trim().toLowerCase(), 
      password 
    });
    
    if (error) {
      console.error('❌ Login error:', error);
      
      if (error.message.includes('Invalid login credentials')) {
        throw new Error('🔐 Incorrect email or password. Please check your credentials and try again.');
      }
      if (error.message.includes('Email not confirmed')) {
        throw new Error('📧 Please check your email and click the confirmation link before logging in.');
      }
      if (error.message.includes('Too many requests')) {
        throw new Error('⏱️ Too many login attempts. Please wait a moment and try again.');
      }
      if (error.message.includes('User not found')) {
        throw new Error('👤 No account found with this email address. Please sign up first.');
      }
      throw new Error(`❌ Login failed: ${error.message}`);
    }
    
    if (data.user) {
      console.log('✅ Login successful for user:', data.user.id);
      console.log('📊 User metadata:', data.user.user_metadata);
    }
  };

  const signUp = async (name: string, email: string, password: string, enrollmentNumber: string, branch: string, batch: string) => {
    // Validate college email domain
    if (!email.endsWith('@igdtuw.ac.in')) {
      throw new Error('🏫 Please use your official IGDTUW college email address (@igdtuw.ac.in)');
    }

    // Validate email format
    const emailRegex = /^[a-zA-Z0-9._%+-]+@igdtuw\.ac\.in$/;
    if (!emailRegex.test(email)) {
      throw new Error('📞 Invalid email format. Please use a valid IGDTUW email address.');
    }

    // Check if email follows IGDTUW naming convention
    const localPart = email.split('@')[0];
    if (localPart.length < 3) {
      throw new Error('🏫 Please use your complete college email address.');
    }

    // Check for common invalid patterns
    if (localPart.includes('..') || localPart.startsWith('.') || localPart.endsWith('.')) {
      throw new Error('📞 Invalid email format. Please check your email address.');
    }

    // Basic check for realistic email structure (letters, numbers, common characters)
    const validLocalPartRegex = /^[a-zA-Z0-9]([a-zA-Z0-9._-]*[a-zA-Z0-9])?$/;
    if (!validLocalPartRegex.test(localPart)) {
      throw new Error('📞 Please enter a valid IGDTUW email address.');
    }

    // Validate password strength
    if (password.length < 6) {
      throw new Error('🔒 Password must be at least 6 characters long');
    }

    const { data: { user }, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          enrollmentNumber,
          branch,
          batch: parseInt(batch)
        }
      }
    });

    if (signUpError) {
      if (signUpError.message.includes('User already registered')) {
        throw new Error('📝 This email is already registered. Please try logging in instead.');
      }
      if (signUpError.message.includes('Password should be')) {
        throw new Error('🔒 Password is too weak. Please use a stronger password.');
      }
      if (signUpError.message.includes('Unable to validate email address')) {
        throw new Error('📞 Invalid email address. Please check if your IGDTUW email is correct.');
      }
      if (signUpError.message.includes('Invalid email')) {
        throw new Error('📞 Please enter a valid IGDTUW email address.');
      }
      throw new Error(`❌ Signup failed: ${signUpError.message}`);
    }
    
    if (!user) {
      throw new Error('❌ Signup failed. Please try again.');
    }

    console.log('✅ User created successfully:', user.id);
    console.log('📧 Email confirmation required');

    // Save profile info to user metadata (more reliable approach)
    console.log('📝 Saving profile info to user metadata...');
    
    try {
      // First, get a fresh user session to ensure we have the latest user object
      await new Promise(resolve => setTimeout(resolve, 100)); // Small delay for user creation to complete
      
      const { error: metadataError } = await supabase.auth.updateUser({
        data: {
          name: name?.trim(),
          enrollment_number: enrollmentNumber?.trim(),
          branch: branch?.trim(),
          batch: parseInt(batch)
        }
      });
      
      if (metadataError) {
        console.error('❌ Metadata update failed:', metadataError);
        console.warn('⚠️ Profile info not saved but signup succeeded. User can complete profile later.');
        // Don't throw error here - signup was successful, profile can be completed later
      } else {
        console.log('✅ Profile info saved to user metadata successfully');
      }
    } catch (err) {
      console.error('❌ Error during metadata update:', err);
      console.warn('⚠️ Profile info not saved but signup succeeded. User can complete profile later.');
      // Don't throw error here - signup was successful
    }
    
    // Don't try database insertion during signup - it can cause foreign key issues
    // The profile will be created later when user confirms email and logs in
    console.log('ℹ️ Database profile will be created after email confirmation');
    
    // Note: Supabase requires email confirmation by default
    // The user will need to check their email and confirm before they can login
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setUserProfile(null); // Clear profile on logout
  };

  const getUserProfile = async (): Promise<StudentProfile | null> => {
    if (!user) {
      console.log('🔍 getUserProfile: No user found');
      return null;
    }
    
    console.log('🔍 getUserProfile: Fetching profile for user:', user.id);
    
    try {
      // Get current user metadata first
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      const userMeta = currentUser?.user_metadata || {};
      
      console.log('📊 User metadata found:', userMeta);
      console.log('📧 User email:', currentUser?.email);
      
      // Try to fetch from database
      let rawData = null;
      try {
        const { data: dbData, error: dbError } = await supabase
          .from('students')
          .select('name, email, enrollment_number, branch, year')
          .eq('id', user.id)
          .single();
        
        if (!dbError && dbData) {
          console.log('🗄️ Database profile found:', dbData);
          rawData = dbData;
        } else {
          console.log('⚠️ No database profile found:', dbError?.message);
        }
      } catch (dbError) {
        console.log('⚠️ Database query failed:', dbError);
      }
      
      // Build profile data with metadata fallback
      const data = {
        name: rawData?.name || userMeta.name || 'Not available',
        email: rawData?.email || currentUser?.email || 'Not available',
        enrollment_number: rawData?.enrollment_number || userMeta.enrollment_number || userMeta.enrollmentNumber || 'Not available',
        branch: rawData?.branch || userMeta.branch || 'Not available', 
        batch: rawData?.year || userMeta.batch || 'Not available'
      };
      
      console.log('📋 Final profile data:', data);
      
      // If we have user metadata but no database record, try to create one
      if (!rawData && userMeta.name) {
        console.log('📝 Attempting to create database profile from metadata...');
        try {
          await supabase
            .from('students')
            .insert([{
              id: user.id,
              name: userMeta.name,
              email: currentUser?.email,
              enrollment_number: userMeta.enrollment_number || userMeta.enrollmentNumber,
              branch: userMeta.branch,
              year: userMeta.batch
            }]);
          console.log('✅ Database profile created from metadata');
        } catch (insertError) {
          console.log('⚠️ Could not create database profile:', insertError);
        }
      }
      
      return data as StudentProfile;
    } catch (error) {
      console.error('❌ Error in getUserProfile:', error);
      
      // Final fallback - try to get basic info from auth user
      try {
        const { data: { user: currentUser } } = await supabase.auth.getUser();
        if (currentUser?.user_metadata) {
          return {
            name: currentUser.user_metadata.name || 'Not available',
            email: currentUser.email || 'Not available',
            enrollment_number: currentUser.user_metadata.enrollment_number || currentUser.user_metadata.enrollmentNumber || 'Not available',
            branch: currentUser.user_metadata.branch || 'Not available',
            batch: currentUser.user_metadata.batch || 'Not available'
          } as StudentProfile;
        }
      } catch (fallbackError) {
        console.error('❌ Fallback profile fetch failed:', fallbackError);
      }
      
      return null;
    }
  };

  useEffect(() => {
    let mounted = true;

    // Check active sessions and sets the user
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error getting session:', error);
        }
        if (mounted) {
          const newUser = session?.user ?? null;
          setUser(newUser);
          setLoading(false); // Set loading to false immediately after setting user
          
          // Fetch user profile asynchronously (non-blocking)
          if (newUser) {
            fetchUserProfile(newUser.id);
          } else {
            setUserProfile(null);
          }
        }
      } catch (error) {
        console.error('Error in getSession:', error);
        if (mounted) {
          setUser(null);
          setUserProfile(null);
          setLoading(false);
        }
      }
    };

    const fetchUserProfile = async (userId: string) => {
      try {
        // Get current user metadata first
        const { data: { user: currentUser } } = await supabase.auth.getUser();
        const userMeta = currentUser?.user_metadata || {};
        
        console.log('📊 User metadata found:', userMeta);
        console.log('📧 User email:', currentUser?.email);
        
        // We don't use a separate students table anymore - all profile data is in user_metadata
        // This makes the system more reliable and doesn't require database schema
        console.log('📊 Using user_metadata for profile data');
        
        // Build profile data from metadata only
        const data = {
          name: userMeta.name || 'Not available',
          email: currentUser?.email || 'Not available',
          enrollment_number: userMeta.enrollment_number || userMeta.enrollmentNumber || 'Not available',
          branch: userMeta.branch || 'Not available', 
          batch: userMeta.batch || 'Not available'
        };
        
        console.log('📋 Final profile data:', data);
        
        if (mounted) {
          setUserProfile(data as StudentProfile);
        }
        
        // No need to create database records since we use user_metadata only
        
      } catch (error) {
        console.error('Error fetching profile:', error);
        if (mounted) {
          // Final fallback - use metadata if available
          try {
            const { data: { user: currentUser } } = await supabase.auth.getUser();
            if (currentUser?.user_metadata) {
              setUserProfile({
                name: currentUser.user_metadata.name || 'Not available',
                email: currentUser.email || 'Not available',
                enrollment_number: currentUser.user_metadata.enrollment_number || currentUser.user_metadata.enrollmentNumber || 'Not available',
                branch: currentUser.user_metadata.branch || 'Not available',
                batch: currentUser.user_metadata.batch || 'Not available'
              } as StudentProfile);
            } else {
              setUserProfile(null);
            }
          } catch (fallbackError) {
            console.error('❌ Fallback profile fetch failed:', fallbackError);
            setUserProfile(null);
          }
        }
      }
    };

    getInitialSession();

    // Listen for changes on auth state (login, logout, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (mounted) {
        const newUser = session?.user ?? null;
        setUser(newUser);
        setLoading(false); // Set loading to false immediately
        
        // Fetch user profile asynchronously (non-blocking)
        if (newUser) {
          fetchUserProfile(newUser.id);
        } else {
          setUserProfile(null);
        }
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, userProfile, loading, signIn, signUp, signOut, getUserProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  return useContext(AuthContext);
};
