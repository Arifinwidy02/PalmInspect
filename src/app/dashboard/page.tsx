'use client';

import Link from 'next/link';
import { useProjectStore, useAuthStore } from '@/store';
import { Button } from '@/components/shared';
import { formatDate, formatNumber } from '@/utils';
import type { Project } from '@/types';

export default function DashboardPage() {
  const projects = useProjectStore((s) => s.projects);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);
  const setCurrentProject = useProjectStore((s) => s.setCurrentProject);

  const userProjects = isAuthenticated && user
    ? projects.filter((p) => p.userId === user.id)
    : [];

  return (
    <div className="flex-1 p-6 max-w-5xl mx-auto w-full overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your inspection projects
          </p>
        </div>
        {user && (
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Credits</p>
              <p className="text-xl font-bold text-emerald-400">{user.credits}</p>
            </div>
            <Link href="/billing">
              <Button variant="primary" size="sm">
                Buy Credits
              </Button>
            </Link>
          </div>
        )}
      </div>

      {/* Credits Info */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-sm text-muted-foreground">Available Credits</p>
          <p className="text-2xl font-bold text-emerald-400 mt-1">
            {user?.credits ?? 0}
          </p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-sm text-muted-foreground">Total Projects</p>
          <p className="text-2xl font-bold text-foreground mt-1">
            {userProjects.length}
          </p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-sm text-muted-foreground">Total Detections</p>
          <p className="text-2xl font-bold text-foreground mt-1">
            {formatNumber(
              userProjects.reduce((sum, p) => sum + p.detections.length, 0)
            )}
          </p>
        </div>
      </div>

      {/* Project List */}
      <div>
        <h2 className="text-lg font-semibold text-card-foreground mb-4">
          Recent Projects
        </h2>

        {userProjects.length === 0 ? (
          <div className="bg-card border border-border rounded-xl p-12 text-center">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
              <svg className="w-6 h-6 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-muted-foreground">No projects yet</p>
            <Link href="/">
              <Button variant="primary" size="sm" className="mt-4">
                Start New Project
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {userProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onSelect={() => setCurrentProject(project.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ProjectCard({
  project,
  onSelect,
}: {
  project: Project;
  onSelect: () => void;
}) {
  const statusConfig = {
    idle: { color: 'bg-muted-foreground', label: 'Draft' },
    uploading: { color: 'bg-blue-500', label: 'Uploading' },
    processing: { color: 'bg-yellow-500', label: 'Processing' },
    completed: { color: 'bg-emerald-500', label: 'Completed' },
    error: { color: 'bg-red-500', label: 'Failed' },
  };

  const status = statusConfig[project.status];

  return (
    <Link
      href="/"
      onClick={(e) => {
        e.preventDefault();
        onSelect();
        window.location.href = '/';
      }}
      className="block bg-card border border-border hover:border-muted-foreground/40 rounded-xl p-4 transition-colors"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-2 h-2 rounded-full ${status.color}`} />
          <div>
            <h3 className="text-sm font-medium text-card-foreground">
              {project.name}
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {formatDate(project.createdAt)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm">
          <span className="text-muted-foreground">
            {project.detections.length > 0
              ? `${formatNumber(project.detections.length)} trees`
              : '—'}
          </span>
          <span
            className={`px-2 py-0.5 rounded text-xs font-medium ${
              project.isPaid
                ? 'bg-emerald-500/10 text-emerald-400'
                : 'bg-yellow-500/10 text-yellow-400'
            }`}
          >
            {project.isPaid ? 'Unlocked' : 'Locked'}
          </span>
          <span className="text-xs text-muted-foreground">{status.label}</span>
        </div>
      </div>
    </Link>
  );
}
