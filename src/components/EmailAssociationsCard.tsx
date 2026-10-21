import React from 'react';
import { Mail, ExternalLink, ShieldCheck, AlertCircle, Info } from 'lucide-react';
import { EmailAssociationFinding } from '../types.ts';

interface EmailAssociationsCardProps {
  associations: EmailAssociationFinding[];
}

export const EmailAssociationsCard: React.FC<EmailAssociationsCardProps> = ({ associations }) => {
  const getConfidenceBadge = (confidence: EmailAssociationFinding['confidence']) => {
    switch (confidence) {
      case 'confirmed':
        return (
          <span className="inline-flex items-center gap-1 text-emerald-400 font-medium">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Confirmed Reference</span>
          </span>
        );
      case 'probable':
        return (
          <span className="inline-flex items-center gap-1 text-sky-400 font-medium">
            <Info className="h-3.5 w-3.5" />
            <span>Probable Match</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-amber-400 font-medium">
            <AlertCircle className="h-3.5 w-3.5" />
            <span>Unverified Lead</span>
          </span>
        );
    }
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl backdrop-blur-sm sm:p-7">
      <div className="flex flex-col gap-2 border-b border-slate-800 pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
            <span>Public Email Associations</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums text-emerald-400 font-bold">{associations.length} Discovered</span>
          </div>
          <p className="text-xs text-slate-400">
            Email addresses explicitly published alongside this phone number on public contact pages or business directories.
          </p>
        </div>
      </div>

      <div className="pt-4">
        {associations.length > 0 ? (
          <div className="divide-y divide-slate-800/60">
            {associations.map((item) => (
              <div key={item.id} className="py-4 first:pt-0 last:pb-0 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <Mail className="h-3.5 w-3.5" />
                    </div>
                    <span className="font-mono text-sm font-semibold text-white">{item.email}</span>
                  </div>

                  <div className="flex items-center gap-3 text-xs">
                    {getConfidenceBadge(item.confidence)}
                    {item.sourceUrl && (
                      <a
                        href={item.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-slate-400 hover:text-white transition-colors"
                        title="Open source webpage"
                      >
                        <span className="hidden sm:inline">Verified Source</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                </div>

                <div className="rounded-xl bg-slate-950/60 p-3 text-xs text-slate-300 space-y-1">
                  <div className="flex items-center gap-2 text-slate-400">
                    <span className="font-medium text-slate-300">Evidence:</span>
                    <span>{item.evidence}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-500 font-mono text-[11px] tabular-nums">
                    <span>Discovered: {item.discoveredDate}</span>
                    <span aria-hidden="true">·</span>
                    <span>Domain: {item.domain}</span>
                    <span aria-hidden="true">·</span>
                    <span>Class: {item.isCorporate ? 'Official / Corporate' : 'Public Listing'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-slate-800 p-8 text-center">
            <Mail className="mx-auto h-8 w-8 text-slate-600 mb-2" />
            <h4 className="text-sm font-medium text-slate-300">No verified email association found.</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
              No legitimate public webpage or business directory co-publishes an email address with this phone number.
              TraceLens does not access private databases or infer unlisted personal emails.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
