import React from 'react';
import Link from 'next/link';
import { Shield, Plus, ArrowRight } from 'lucide-react';
import { StatusPill } from '../../components/StatusPill';

export default function ProjectsDashboard() {
  const projects = [
    { id: 'proj_1', name: 'api-gateway', owner: 'acme-corp', status: 'healthy', openPassports: 3, debt: 'low' },
    { id: 'proj_2', name: 'web-frontend', owner: 'acme-corp', status: 'attention', openPassports: 12, debt: 'high' },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-background-elevated px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="text-accent" size={24} />
            <span className="font-semibold text-lg tracking-tight">Proofline</span>
          </div>
          <div className="flex items-center gap-4 text-sm font-medium">
            <Link href="/projects" className="text-foreground">Projects</Link>
            <Link href="#" className="text-muted hover:text-foreground transition-colors">Settings</Link>
            <div className="w-8 h-8 bg-border rounded-full ml-2"></div>
          </div>
        </div>
      </header>

      <main id="main-content" className="max-w-6xl mx-auto px-6 py-12 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Projects</h1>
            <p className="text-muted mt-1">Manage connected repositories and verification policies.</p>
          </div>
          <button className="flex items-center gap-2 bg-accent text-white px-4 py-2 rounded-md hover:bg-accent/90 transition-colors text-sm font-medium">
            <Plus size={16} /> Connect Repository
          </button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((p) => (
            <Link key={p.id} href={`/projects/${p.id}`} className="group block bg-background-elevated border border-border rounded-lg p-6 hover:border-muted transition-colors">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="text-xs text-muted mb-1 font-mono">{p.owner} /</div>
                  <h2 className="text-lg font-semibold group-hover:text-accent transition-colors">{p.name}</h2>
                </div>
                <div className={`w-2 h-2 rounded-full ${p.status === 'healthy' ? 'bg-status-verified' : 'bg-status-review'}`}></div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mt-6 pt-4 border-t border-border text-sm">
                <div>
                  <div className="text-muted mb-1">Open PRs</div>
                  <div className="font-semibold text-lg">{p.openPassports}</div>
                </div>
                <div>
                  <div className="text-muted mb-1">Verification Debt</div>
                  <div className="font-semibold text-lg capitalize">{p.debt}</div>
                </div>
              </div>
            </Link>
          ))}
          
          <Link href="/onboarding" className="flex flex-col items-center justify-center bg-background border border-dashed border-border rounded-lg p-6 hover:border-muted hover:bg-background-elevated transition-colors text-muted hover:text-foreground">
            <Plus size={24} className="mb-2" />
            <span className="font-medium">Connect Repository</span>
          </Link>
        </div>
      </main>
    </div>
  );
}
