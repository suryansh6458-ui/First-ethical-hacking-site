import React from 'react';
import { ExternalLink, ShieldAlert, Share2, Info } from 'lucide-react';
import { SocialProfileFinding } from '../types.ts';

interface SocialAccountsCardProps {
  profiles: SocialProfileFinding[];
}

export const SocialAccountsCard: React.FC<SocialAccountsCardProps> = ({ profiles }) => {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl backdrop-blur-sm sm:p-7">
      {/* Header */}
      <div className="border-b border-slate-800 pb-5">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
          <span>Public Social & Directory Profiles</span>
          <span aria-hidden="true">·</span>
          <span className="font-mono tabular-nums text-emerald-400 font-bold">{profiles.length} Public Matches</span>
        </div>
        <p className="text-xs text-slate-400">
          Public platform profiles and online accounts indexed with this phone number across open web directories.
        </p>
      </div>

      {/* Strict Privacy & Account Possession Notice */}
      <div className="my-4 rounded-xl border border-amber-500/20 bg-amber-500/5 p-3.5 text-xs text-amber-300">
        <div className="flex items-start gap-2.5">
          <ShieldAlert className="h-4 w-4 shrink-0 text-amber-400 mt-0.5" />
          <div className="space-y-1">
            <span className="font-semibold text-amber-200">OSINT Boundary & Possession Disclaimer</span>
            <p className="text-[11px] leading-relaxed text-amber-400/90">
              A public profile reference indicates open indexing, NOT active account possession or live login status. Third-party applications cannot and must never attempt to inspect active sessions, private credentials, or recovery tokens.
            </p>
          </div>
        </div>
      </div>

      {/* Profiles List */}
      <div className="pt-2">
        {profiles.length > 0 ? (
          <div className="divide-y divide-slate-800/60">
            {profiles.map((p) => (
              <div key={p.id} className="py-4 first:pt-0 last:pb-0 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20">
                      <Share2 className="h-3.5 w-3.5" />
                    </div>
                    <div>
                      <span className="font-semibold text-sm text-white">{p.platform}</span>
                      {p.handle && (
                        <span className="ml-2 font-mono text-xs text-slate-400">{p.handle}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-xs">
                    <span className="font-mono text-[11px] text-slate-400 tabular-nums">
                      Discovered {p.timestamp}
                    </span>
                    <a
                      href={p.profileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-slate-300 hover:text-white transition-colors"
                    >
                      <span className="hidden sm:inline">Public Page</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>

                <div className="rounded-xl bg-slate-950/60 p-3 text-xs text-slate-300 space-y-1">
                  <div className="flex items-start gap-2">
                    <span className="font-medium text-slate-400 shrink-0">Citation Evidence:</span>
                    <span className="text-slate-300">{p.associationEvidence}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-500 font-mono text-[11px]">
                    <span className="capitalize">{p.profileType.replace('_', ' ')}</span>
                    <span aria-hidden="true">·</span>
                    <span>Confidence: {p.confidence}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-slate-800 p-8 text-center">
            <Share2 className="mx-auto h-8 w-8 text-slate-600 mb-2" />
            <h4 className="text-sm font-medium text-slate-300">No public social media profiles indexed.</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
              This phone number is not publicly listed on indexed social profiles or open user directories.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
