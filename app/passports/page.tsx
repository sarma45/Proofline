import React from 'react';
import Link from 'next/link';
import { Shield, Filter, Search } from 'lucide-react';
import { allFixtures } from '../../lib/fixtures';
import { StatusPill } from '../../components/StatusPill';

export default function PassportList() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-background-elevated px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="text-accent" size={24} />
            <span className="font-semibold text-lg tracking-tight">Proofline</span>
          </div>
          <div className="flex items-center gap-4 text-sm font-medium">
            <Link href="/projects" className="text-muted hover:text-foreground transition-colors">Projects</Link>
            <Link href="/passports" className="text-foreground">Passports</Link>
            <Link href="/settings" className="text-muted hover:text-foreground transition-colors">Settings</Link>
            <div className="w-8 h-8 bg-border rounded-full ml-2"></div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">Passports</h1>
            <p className="text-muted mt-1">Review all AI-assisted changes across your organization.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={16} />
              <input 
                type="text" 
                placeholder="Search PR or hash..." 
                className="pl-9 pr-4 py-2 bg-background-elevated border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-accent text-sm w-64"
              />
            </div>
            <button className="flex items-center gap-2 px-3 py-2 border border-border rounded-md hover:bg-background-elevated transition-colors text-sm">
              <Filter size={16} /> Filter
            </button>
          </div>
        </div>

        <div className="border border-border rounded-lg bg-background-elevated overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-background border-b border-border">
              <tr>
                <th className="px-6 py-3 font-medium text-muted">Status</th>
                <th className="px-6 py-3 font-medium text-muted">Summary</th>
                <th className="px-6 py-3 font-medium text-muted">Repository</th>
                <th className="px-6 py-3 font-medium text-muted">Updated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {allFixtures.map(passport => (
                <tr key={passport.id} className="hover:bg-background/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusPill status={passport.status} size="sm" />
                  </td>
                  <td className="px-6 py-4">
                    <Link href={`/passports/${passport.id}`} className="font-medium hover:text-accent transition-colors block max-w-sm truncate" title={passport.scopeSummary}>
                      {passport.scopeSummary}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-muted font-mono text-xs">
                    {passport.repo}
                  </td>
                  <td className="px-6 py-4 text-muted whitespace-nowrap">
                    {new Date(passport.updatedAt).toLocaleTimeString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
