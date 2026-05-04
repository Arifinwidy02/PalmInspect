'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useAuthStore, useProjectStore, useThemeStore } from '@/store';

function ThemeToggle() {
  const theme = useThemeStore((s) => s.theme);
  const setTheme = useThemeStore((s) => s.setTheme);

  const cycleTheme = () => {
    const next: Record<typeof theme, typeof theme> = {
      light: 'dark',
      dark: 'system',
      system: 'light',
    };
    setTheme(next[theme]);
  };

  const icons: Record<typeof theme, React.ReactNode> = {
    light: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
    dark: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
      </svg>
    ),
    system: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  };

  return (
    <button
      onClick={cycleTheme}
      title={`Theme: ${theme}`}
      className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
    >
      {icons[theme]}
    </button>
  );
}

export function Navbar() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);
  const initialize = useAuthStore((s) => s.initialize);
  const openAuthModal = useAuthStore((s) => s.openAuthModal);
  const logout = useAuthStore((s) => s.logout);
  const currentProject = useProjectStore((s) => {
    const cp = s.projects.find((p) => p.id === s.currentProjectId);
    return cp ?? null;
  });

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <nav className="h-14 border-b border-border bg-navbar backdrop-blur-md flex items-center justify-between px-4 z-40">
      <div className="flex items-center gap-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-emerald-400 font-bold text-lg tracking-tight">
            Palmspect
          </span>
          <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
            GIS
          </span>
        </Link>

        {currentProject && (
          <div className="hidden sm:flex items-center gap-2 text-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="text-muted-foreground truncate max-w-[200px]">
              {currentProject.name}
            </span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-3">
        <ThemeToggle />

        {isAuthenticated && user ? (
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Dashboard
            </Link>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-emerald-400 font-medium">
                {user.credits} credits
              </span>
              <span className="text-border">|</span>
              <span className="text-muted-foreground">{user.name ?? user.email}</span>
            </div>
            <button
              onClick={logout}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Sign out
            </button>
          </div>
        ) : (
          <button
            onClick={() => openAuthModal('login')}
            className="text-sm text-muted-foreground hover:text-emerald-400 transition-colors"
          >
            Sign in
          </button>
        )}
      </div>
    </nav>
  );
}
