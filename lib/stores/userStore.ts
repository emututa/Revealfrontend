// ============================================
// lib/stores/userStore.ts - User Store with AsyncStorage
// ============================================
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
  id: string;
  email: string;
  displayName?: string;
  name?: string;
  phone?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface UserStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Actions
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  login: (user: User, token: string) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  clearAuth: () => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      setUser: (user) => 
        set({ user, isAuthenticated: true }),
      
      setToken: (token) => 
        set({ token }),
      
      login: (user, token) => 
        set({ 
          user, 
          token, 
          isAuthenticated: true,
          isLoading: false 
        }),
      
      logout: () => 
        set({ 
          user: null, 
          token: null, 
          isAuthenticated: false,
          isLoading: false 
        }),
      
      setLoading: (loading) => 
        set({ isLoading: loading }),

      clearAuth: () =>
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false
        }),
    }),
    {
      name: 'reveal-auth-storage', // Key name in AsyncStorage
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);