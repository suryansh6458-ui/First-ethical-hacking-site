import React from 'react';
import { CheckCircle2, XCircle, AlertTriangle, HelpCircle, Layers } from 'lucide-react';
import { SourceExecutionLog } from '../types.ts';

interface SourceLedgerCardProps {
  logs: SourceExecutionLog[];
  limitationsStatement: string;
}

export const SourceLedgerCard: React.FC<SourceLedgerCardProps> = ({ logs, limitationsStatement }) => {
  const getStatusIcon = (status: SourceExecutionLog['status']) => {
    switch (status) {
      case 'succeeded':
        return <CheckCircle2 className="h-4 w-4 text-emerald-400" />;
      case 'no_results':
        return <CheckCircle2 className="h-4 w-4 text-slate-400" />;
      case 'not_configured':
        return <HelpCircle className="h-4 w-4 text-amber-400" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-rose-400" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-slate-500" />;
    }
  };

  const getStatusLabel = (status: SourceExecutionLog['status']) => {
    switch (status) {
      case 'succeeded':
        return <span className="text-emerald-400 font-medium">Verified / Results Found</span>;
      case 'no_results':
        return <span className="text-slate-400">Queried (0 Matches)</span>;
      case 'not_configured':
        return <span className="text-amber-400">Provider Unconfigured</span>;
      case 'failed':
        return <span className="text-rose-400">Query Failed / Rate Limited</span>;
      default:
        return <span className="text-slate-500">Skipped</span>;
    }
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl backdrop-blur-sm sm:p-7">
      <div className="flex flex-col gap-2 border-b border-slate-800 pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
            <Layers className="h-4 w-4 text-emerald-400" />
            <span>Source Transparency & Diagnostic Ledger</span>
          </div>
          <p className="text-xs text-slate-400">
            Audit of all research engines queried, latency metrics, and unconfigured optional integration status.
          </p>
        </div>
      </div>

      {/* Source Execution Table */}
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 font-medium">
              <th className="py-2.5 pr-4">Provider / Source Engine</th>
              <th className="py-2.5 px-4">Execution Status</th>
              <th className="py-2.5 px-4 text-right">Latency</th>
              <th className="py-2.5 pl-4">Diagnostic Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono">
            {logs.map((log) => (
              <tr key={log.providerId} className="hover:bg-slate-850/50 transition-colors">
                <td className="py-3 pr-4 font-sans font-medium text-slate-200">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(log.status)}
                    <span>{log.name}</span>
                  </div>
                </td>
                <td className="py-3 px-4 font-sans text-xs">
                  {getStatusLabel(log.status)}
                </td>
                <td className="py-3 px-4 text-right text-slate-400 tabular-nums">
                  {log.durationMs > 0 ? `${log.durationMs}ms` : '—'}
                </td>
                <td className="py-3 pl-4 font-sans text-xs text-slate-400 max-w-xs sm:max-w-md truncate" title={log.message}>
                  {log.message}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Statement of Limits */}
      <div className="mt-5 rounded-xl border border-slate-800 bg-slate-950/60 p-4">
        <h5 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
          Statement on the Limits of This Investigation
        </h5>
        <p className="text-xs leading-relaxed text-slate-400">
          {limitationsStatement}
        </p>
      </div>
    </div>
  );
};
