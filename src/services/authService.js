// ==============================================================================
// Authentication Service (Supabase Auth + Guest Mode)
// ==============================================================================

import { supabase, isSupabaseConfigured } from './supabase';

const GUEST_USER_KEY = 'moni_guest_user';

export const authService = {
  // Check active session
  async getCurrentSession() {
    if (isSupabaseConfigured() && supabase) {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw error;
      return session;
    } else {
      // Guest / Local session
      const savedUser = localStorage.getItem(GUEST_USER_KEY);
      if (savedUser) {
        return {
          user: JSON.parse(savedUser)
        };
      }
      return null;
    }
  },

  // User Sign Up
  async signUp(email, password, fullName) {
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName
          }
        }
      });
      if (error) throw error;
      return data;
    } else {
      // Create local guest user
      const user = {
        id: 'guest-user-' + Date.now(),
        email,
        user_metadata: { full_name: fullName || 'Guest User' },
        created_at: new Date().toISOString()
      };
      localStorage.setItem(GUEST_USER_KEY, JSON.stringify(user));
      return { user };
    }
  },

  // User Sign In
  async signIn(email, password) {
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      if (error) throw error;
      return data;
    } else {
      // Local guest sign in
      const user = {
        id: 'guest-user-1',
        email: email || 'guest@moni.app',
        user_metadata: { full_name: 'Guest Account' },
        created_at: new Date().toISOString()
      };
      localStorage.setItem(GUEST_USER_KEY, JSON.stringify(user));
      return { user };
    }
  },

  // Guest Quick Login (no credentials needed)
  guestLogin() {
    const user = {
      id: 'guest-user-1',
      email: 'guest@moni.app',
      user_metadata: { full_name: 'Guest' },
      created_at: new Date().toISOString()
    };
    localStorage.setItem(GUEST_USER_KEY, JSON.stringify(user));
    return { user };
  },

  // User Sign Out
  async signOut() {
    if (isSupabaseConfigured() && supabase) {
      await supabase.auth.signOut();
    }
    localStorage.removeItem(GUEST_USER_KEY);
  },

  // Password Reset
  async resetPassword(email) {
    if (isSupabaseConfigured() && supabase) {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/reset-password'
      });
      if (error) throw error;
    }
    return { success: true };
  }
};
