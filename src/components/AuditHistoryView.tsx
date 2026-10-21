import React from 'react';
import { History, Shield, Trash2, ArrowRight, ExternalLink } from 'lucide-react';
import { HistoryItem } from '../types.ts';

interface AuditHistoryViewProps {
  history: HistoryItem[];
  onSelectReport: (reportId: string) => void;
  onPurge: () => void;
}

export const AuditHistoryView: React.FC<AuditHistoryViewProps> = ({
  history,
  onSelectReport,
  onPurge,
}) => {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl backdrop-blur-sm sm:p-7">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 mb-1">
              <History className="h-5 w-5" />
              <h2 className="text-lg font-bold text-white sm:text-xl">In-Session Audit History</h2>
            </div>
            <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
              TraceLens maintains minimal, ephemeral session storage in memory. You can inspect previous analyses or immediately purge all records to enforce zero-retention privacy.
            </p>
          </div>

          {history.length > 0 && (
            <button
              onClick={onPurge}
              className="inline-flex items-center gap-2 rounded-lg border border-rose-500/30 bg-rose-500/10 px-3.5 py-2 text-xs font-semibold text-rose-300 hover:bg-rose-500/20 transition-colors self-start"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Purge All Records</span>
            </button>
          )}
        </div>
      </div>

      {history.length > 0 ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl backdrop-blur-sm sm:p-7">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-medium">
                  <th className="py-2.5 pr-4">Audited Target (Masked)</th>
                  <th className="py-2.5 px-4">Country</th>
                  <th className="py-2.5 px-4">Exposure Rating</th>
                  <th className="py-2.5 px-4 text-right">Findings</th>
                  <th className="py-2.5 px-4 text-right">Timestamp</th>
                  <th className="py-2.5 pl-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {history.map((item) => (
                  <tr key={item.reportId} className="hover:bg-slate-850/50 transition-colors">
                    <td className="py-3 pr-4 font-bold text-emerald-400 tabular-nums">
                      {item.targetMasked}
                    </td>
                    <td className="py-3 px-4 font-sans text-slate-300">{item.country}</td>
                    <td className="py-3 px-4 font-sans">
                      <span className="capitalize text-slate-200">{item.overallRiskRating}</span>
                    </td>
                    <td className="py-3 px-4 text-right text-slate-300 tabular-nums">
                      {item.findingsCount}
                    </td>
                    <td className="py-3 px-4 text-right text-slate-500 text-[11px] tabular-nums">
                      {new Date(item.generatedAt).toLocaleTimeString()}
                    </td>
                    <td className="py-3 pl-4 text-right">
                      <button
                        onClick={() => onSelectReport(item.reportId)}
                        className="inline-flex items-center gap-1 rounded bg-slate-800 px-2.5 py-1 text-xs text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
                      >
                        <span>View</span>
                        <ArrowRight className="h-3 w-3" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-800 p-12 text-center bg-slate-900/30">
          <History className="mx-auto h-8 w-8 text-slate-600 mb-2" />
          <h4 className="text-sm font-medium text-slate-300">No session investigations recorded yet</h4>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Completed phone audits will be cataloged here for the duration of this browser session.
          </p>
        </div>
      )}
    </div>
  );
};
