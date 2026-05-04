import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserProfile } from '@/types';

interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  authModalOpen: boolean;
  authModalMode: 'login' | 'signup';
  pendingAction: string | null;

  setUser: (user: UserProfile | null) => void;
  setLoading: (loading: boolean) => void;
  login: (user: UserProfile) => void;
  logout: () => void;
  openAuthModal: (mode?: 'login' | 'signup', action?: string) => void;
  closeAuthModal: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true,
      authModalOpen: false,
      authModalMode: 'login',
      pendingAction: null,

      setUser: (user) =>
        set({
          user,
          isAuthenticated: !!user,
          isLoading: false,
        }),

      setLoading: (isLoading) => set({ isLoading }),

      login: (user) =>
        set({
          user,
          isAuthenticated: true,
          isLoading: false,
          authModalOpen: false,
        }),

      logout: () =>
        set({
          user: null,
          isAuthenticated: false,
          authModalOpen: false,
          pendingAction: null,
        }),

      openAuthModal: (mode = 'login', action) =>
        set({
          authModalOpen: true,
          authModalMode: mode,
          pendingAction: action ?? null,
        }),

      closeAuthModal: () =>
        set({ authModalOpen: false, pendingAction: null }),
    }),
    {
      name: 'palminspect-auth',
    }
  )
);
