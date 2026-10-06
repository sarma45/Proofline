import React from 'react';
import { prisma } from '../../../lib/prisma';

import { getSessionProjectId } from '../../../lib/auth';
import { notFound, redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function PoliciesPage() {
  const projectId = await getSessionProjectId(new Request('http://localhost')); 
  
  if (!projectId) {
    redirect('/api/auth/signin');
  }

  const policies = await prisma.policy.findMany({
    where: { projectId },
    include: {
      project: true
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col p-8 max-w-6xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Organization Policies</h1>
        <p className="text-muted mt-2">Manage and view versioned assurance policies across projects.</p>
      </header>

      <div className="bg-background-elevated border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 bg-muted/10 border-b border-border flex justify-between items-center">
          <h2 className="font-medium">Active Policies</h2>
          <button className="px-4 py-2 bg-accent text-white rounded-md text-sm font-medium hover:opacity-90">
            Create Policy
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/5 border-b border-border text-muted">
              <tr>
                <th className="px-6 py-4 font-medium">Project</th>
                <th className="px-6 py-4 font-medium">Version</th>
                <th className="px-6 py-4 font-medium">Rules Overview</th>
                <th className="px-6 py-4 font-medium">Updated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {policies.map(policy => (
                <tr key={policy.id} className="hover:bg-muted/5">
                  <td className="px-6 py-4 font-medium">{policy.project.name}</td>
                  <td className="px-6 py-4"><span className="px-2 py-1 bg-accent/10 text-accent rounded-full text-xs">{policy.version}</span></td>
                  <td className="px-6 py-4 text-muted truncate max-w-xs">{JSON.stringify(policy.rules).substring(0, 50)}...</td>
                  <td className="px-6 py-4 text-muted">{new Date(policy.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
              {policies.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-muted">
                    No policies defined yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
