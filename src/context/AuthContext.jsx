import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { supabase, isSupabaseConfigured } from '../services/supabase';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        if (isSupabaseConfigured() && supabase) {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            setUser(session.user);
            await fetchProfile(session.user.id);
          }

          const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
            setUser(session?.user || null);
            if (session?.user) {
              await fetchProfile(session.user.id);
            } else {
              setProfile(null);
            }
          });

          return () => {
            authListener?.subscription?.unsubscribe();
          };
        } else {
          // Guest / Local session
          const session = await authService.getCurrentSession();
          if (session?.user) {
            setUser(session.user);
            setProfile({
              full_name: session.user.user_metadata?.full_name || 'Guest',
              email: session.user.email,
              currency: localStorage.getItem('moni_currency') || '₱'
            });
          }
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const fetchProfile = async (userId) => {
    if (!isSupabaseConfigured() || !supabase) return;
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      if (data) setProfile(data);
    } catch (err) {
      console.warn('Profile fetch warning:', err);
    }
  };

  const login = async (email, password) => {
    const data = await authService.signIn(email, password);
    setUser(data.user);
    setProfile({
      full_name: data.user.user_metadata?.full_name || 'Guest',
      email: data.user.email,
      currency: localStorage.getItem('moni_currency') || '₱'
    });
    return data;
  };

  const signup = async (email, password, fullName) => {
    const data = await authService.signUp(email, password, fullName);
    setUser(data.user);
    setProfile({
      full_name: fullName,
      email: data.user.email,
      currency: localStorage.getItem('moni_currency') || '₱'
    });
    return data;
  };

  const guestLogin = () => {
    const data = authService.guestLogin();
    setUser(data.user);
    setProfile({
      full_name: data.user.user_metadata?.full_name || 'Guest',
      email: data.user.email,
      currency: localStorage.getItem('moni_currency') || '₱'
    });
  };

  const logout = async () => {
    await authService.signOut();
    setUser(null);
    setProfile(null);
  };

  const updateProfile = async (updates) => {
    if (isSupabaseConfigured() && supabase && user) {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();
      if (error) throw error;
      setProfile(data);
      return data;
    } else {
      const updated = { ...profile, ...updates };
      setProfile(updated);
      if (updates.currency) {
        localStorage.setItem('moni_currency', updates.currency);
      }
      return updated;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        login,
        signup,
        guestLogin,
        logout,
        updateProfile,
        isSupabaseActive: isSupabaseConfigured()
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
