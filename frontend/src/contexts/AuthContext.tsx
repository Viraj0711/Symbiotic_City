import React, { createContext, useContext, useEffect, useState } from 'react';
import { api, User } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  uploadAvatar: (file: File) => Promise<string>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for existing authentication on app load
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('auth_token');
      
      if (!token) {
        setLoading(false);
        return;
      }

      // Verify token and get user data
      const response = await api.getProfile();
      setUser(response.user);
    } catch (error) {
      console.error('Auth check failed:', error);
      // Clear invalid token
      api.clearToken();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await api.login(email, password);
      setUser(response.user);
    } catch (error) {
      console.error('Sign in failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    setLoading(true);
    try {
      const response = await api.register(email, password, name);
      setUser(response.user);
    } catch (error) {
      console.error('Sign up failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await api.logout();
      setUser(null);
    } catch (error) {
      console.error('Sign out failed:', error);
      throw error;
    }
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!user) throw new Error('No user logged in');
    
    try {
      // Filter out fields that shouldn't be updated directly
      const allowedUpdates = {
        name: updates.name,
        bio: updates.bio,
        location: updates.location,
        avatar: updates.avatar
      };
      
      // Remove undefined values
      const filteredUpdates = Object.fromEntries(
        Object.entries(allowedUpdates).filter(([_, value]) => value !== undefined)
      );

      if (Object.keys(filteredUpdates).length === 0) {
        return; // No updates to make
      }

      const response = await api.updateProfile(filteredUpdates);
      setUser(response.user);
    } catch (error) {
      console.error('Profile update failed:', error);
      throw error;
    }
  };

  const uploadAvatar = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      try {
        const reader = new FileReader();
        
        reader.onload = () => {
          const dataUrl = reader.result as string;
          if (dataUrl) {
            resolve(dataUrl);
          } else {
            reject(new Error('Failed to read file'));
          }
        };
        
        reader.onerror = () => {
          reject(new Error('File reading failed'));
        };
        
        reader.readAsDataURL(file);
      } catch (error) {
        reject(error);
      }
    });
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile,
    uploadAvatar,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};