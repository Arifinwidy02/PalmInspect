'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/store';

const navItems = [
  { href: '/', label: 'Workspace', icon: 'M3 12l2-2m0 0l7-7 7 7m-14 2l2 2m0 0l7 7 7-7' },
  { href: '/dashboard', label: 'Dashboard', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
];

export function Sidebar() {
  const pathname = usePathname();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);

  return (
    <aside className="w-16 border-r border-border bg-sidebar/80 backdrop-blur-md flex flex-col items-center py-4 gap-2">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        if (item.href === '/dashboard' && !isAuthenticated) return null;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`
              w-10 h-10 rounded-lg flex items-center justify-center
              transition-all duration-200 group relative
              ${isActive ? 'bg-emerald-600/20 text-emerald-400' : 'text-muted-foreground hover:text-foreground hover:bg-accent'}
            `}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} />
            </svg>
            <span className="absolute left-14 bg-popover text-popover-foreground text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap transition-opacity">
              {item.label}
            </span>
          </Link>
        );
      })}
    </aside>
  );
}
