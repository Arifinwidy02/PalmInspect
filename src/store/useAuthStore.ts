import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '@/services/supabase-client';
import type { UserProfile } from '@/types';

function supabaseUserToProfile(user: { id: string; email?: string; user_metadata?: Record<string, unknown>; created_at: string }): UserProfile {
  const meta = user.user_metadata ?? {};
  return {
    id: user.id,
    email: user.email ?? '',
    name: (meta.full_name as string) ?? (meta.name as string) ?? null,
    avatarUrl: (meta.avatar_url as string) ?? null,
    credits: 10,
    createdAt: user.created_at,
  };
}

interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  authModalOpen: boolean;
  authModalMode: 'login' | 'signup';
  pendingAction: string | null;

  initialize: () => void;
  setUser: (user: UserProfile | null) => void;
  login: (user: UserProfile) => void;
  logout: () => Promise<void>;
  openAuthModal: (mode?: 'login' | 'signup', action?: string) => void;
  closeAuthModal: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => {
      let initialized = false;

      const syncSession = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          set({
            user: supabaseUserToProfile(session.user),
            isAuthenticated: true,
            isLoading: false,
          });
        } else {
          set({ isLoading: false });
        }
      };

      return {
        user: null,
        isAuthenticated: false,
        isLoading: true,
        authModalOpen: false,
        authModalMode: 'login',
        pendingAction: null,

        initialize: () => {
          if (initialized) return;
          initialized = true;

          syncSession();

          supabase.auth.onAuthStateChange((_event, session) => {
            if (session?.user) {
              set({
                user: supabaseUserToProfile(session.user),
                isAuthenticated: true,
                isLoading: false,
                authModalOpen: false,
              });
            } else {
              set({
                user: null,
                isAuthenticated: false,
                isLoading: false,
              });
            }
          });
        },

        setUser: (user) =>
          set({ user, isAuthenticated: !!user, isLoading: false }),

        login: (user) =>
          set({ user, isAuthenticated: true, isLoading: false, authModalOpen: false }),

        logout: async () => {
          await supabase.auth.signOut();
          set({
            user: null,
            isAuthenticated: false,
            authModalOpen: false,
            pendingAction: null,
          });
        },

        openAuthModal: (mode = 'login', action) =>
          set({ authModalOpen: true, authModalMode: mode, pendingAction: action ?? null }),

        closeAuthModal: () =>
          set({ authModalOpen: false, pendingAction: null }),
      };
    },
    {
      name: 'palminspect-auth',
      partialize: (state) => ({
        authModalMode: state.authModalMode,
        pendingAction: state.pendingAction,
      }),
    }
  )
);
