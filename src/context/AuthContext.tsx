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
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      if (error.message.includes('Invalid login credentials')) {
        throw new Error('🔐 Incorrect email or password. Please check your credentials and try again.');
      }
      if (error.message.includes('Email not confirmed')) {
        throw new Error('📧 Please check your email and click the confirmation link before logging in.');
      }
      if (error.message.includes('Too many requests')) {
        throw new Error('⏱️ Too many login attempts. Please wait a moment and try again.');
      }
      throw new Error(`❌ Login failed: ${error.message}`);
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
          batch,
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

    // insert into students table with all available fields
    console.log('📝 Attempting to create profile with all fields...');
    
    // First try with all fields to see what's supported
    let { error: profileError } = await supabase
      .from('students')
      .insert([{ 
        id: user.id,
        name,
        email,
        enrollment_number: enrollmentNumber,
        branch,
        year: parseInt(batch)
      }]);
    
    // If some columns don't exist, try with basic fields first
    if (profileError && (profileError.message?.includes('column') || profileError.code === '42703')) {
      console.log('⚠️ Some columns missing, trying basic insertion...');
      const { error: basicError } = await supabase
        .from('students')
        .insert([{ 
          id: user.id,
          name,
          email
        }]);
      
      if (!basicError) {
        console.log('✅ Basic profile created, additional fields not available in database');
      }
      profileError = basicError;
    } else if (!profileError) {
      console.log('✅ Full profile created with all fields');
    }

    if (profileError) {
      console.error('Profile creation error:', profileError);
      
      // As a fallback, try to update user metadata with the profile info
      console.log('🔄 Attempting to save profile info to user metadata...');
      console.log('📝 Data being saved:', { name, enrollmentNumber, branch, batch });
      const { error: metadataError } = await supabase.auth.updateUser({
        data: {
          name,
          enrollment_number: enrollmentNumber,
          enrollmentNumber: enrollmentNumber,  // Try both field names
          branch,
          batch: parseInt(batch)
        }
      });
      
      if (!metadataError) {
        console.log('✅ Profile info saved to user metadata as fallback');
        // Don't throw error if we successfully saved to metadata
        return;
      }
      
      throw new Error(`Failed to create profile: ${profileError.message}`);
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setUserProfile(null); // Clear profile on logout
  };

  const getUserProfile = async (): Promise<StudentProfile | null> => {
    if (!user) return null;
    
    try {
      // Start with basic fields and add more if they exist
      let { data: rawData, error } = await supabase
        .from('students')
        .select('name, email')
        .eq('id', user.id)
        .single();
      
      // If basic fetch works, try to get additional fields
      if (!error && rawData) {
        const { data: fullData } = await supabase
          .from('students')
          .select('name, email, enrollment_number, branch, year')
          .eq('id', user.id)
          .single();
        
        // Use full data if available, otherwise use basic data
        rawData = fullData || rawData;
      }
      
      // Convert data format for UI, with user metadata fallback
      let data = null;
      if (rawData) {
        // Get current user metadata as fallback
        const { data: { user: currentUser } } = await supabase.auth.getUser();
        const userMeta = currentUser?.user_metadata || {};
        
        data = {
          name: rawData.name || userMeta.name,
          email: rawData.email || currentUser?.email,
          enrollment_number: rawData.enrollment_number || userMeta.enrollment_number || userMeta.enrollmentNumber || 'Not available',
          branch: rawData.branch || userMeta.branch || 'Not available', 
          batch: rawData.year || userMeta.batch || 'Not available'  // Convert year to batch
        };
      }
      
      if (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }
      
      return data as StudentProfile;
    } catch (error) {
      console.error('Error in getUserProfile:', error);
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
        // Start with basic fields and add more if they exist
        let { data: rawData, error } = await supabase
          .from('students')
          .select('name, email')
          .eq('id', userId)
          .single();
        
        // If basic fetch works, try to get additional fields
        if (!error && rawData) {
          const { data: fullData } = await supabase
            .from('students')
            .select('name, email, enrollment_number, branch, year')
            .eq('id', userId)
            .single();
          
          // Use full data if available, otherwise use basic data
          rawData = fullData || rawData;
        }
        let data = null;
        if (rawData) {
          // Get current user metadata as fallback
          const { data: { user: currentUser } } = await supabase.auth.getUser();
          const userMeta = currentUser?.user_metadata || {};
          
          console.log('🔍 User metadata:', userMeta);
          
          data = {
            name: rawData.name || userMeta.name,
            email: rawData.email || currentUser?.email,
            enrollment_number: rawData.enrollment_number || userMeta.enrollment_number || userMeta.enrollmentNumber || 'Not available',
            branch: rawData.branch || userMeta.branch || 'Not available', 
            batch: rawData.year || userMeta.batch || 'Not available'  // Convert year to batch
          };
        }
        
        if (mounted) {
          if (!error && data) {
            setUserProfile(data as StudentProfile);
          } else {
            setUserProfile(null);
          }
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        if (mounted) {
          setUserProfile(null);
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
