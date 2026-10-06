import React from 'react';
import { AlertCircle } from 'lucide-react';

export interface FileChange {
  path: string;
  changeType: 'added' | 'modified' | 'deleted';
  linesAdded: number;
  linesRemoved: number;
  unplanned?: boolean;
}

export function DataTable({ files }: { files: FileChange[] }) {
  return (
    <div className="border border-border rounded-md overflow-hidden bg-background-elevated">
      <table className="w-full text-left text-sm">
        <thead className="bg-background border-b border-border">
          <tr>
            <th className="px-4 py-3 font-medium text-muted">File Path</th>
            <th className="px-4 py-3 font-medium text-muted">Type</th>
            <th className="px-4 py-3 font-medium text-muted text-right">Lines +/-</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {files.map((f, i) => (
            <tr key={i} className="hover:bg-background/50 transition-colors">
              <td className="px-4 py-3 font-mono flex items-center gap-2">
                {f.path}
                {f.unplanned && (
                  <span title="Unplanned File Change" className="text-status-review flex items-center">
                    <AlertCircle size={14} />
                  </span>
                )}
              </td>
              <td className="px-4 py-3">
                <span className={`inline-flex px-2 py-0.5 rounded text-xs capitalize ${
                  f.changeType === 'added' ? 'bg-status-verified/10 text-status-verified' : 
                  f.changeType === 'deleted' ? 'bg-status-failed/10 text-status-failed' : 'bg-status-conditional/10 text-status-conditional'
                }`}>
                  {f.changeType}
                </span>
              </td>
              <td className="px-4 py-3 text-right">
                <span className="text-status-verified mr-2">+{f.linesAdded}</span>
                <span className="text-status-failed">-{f.linesRemoved}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
