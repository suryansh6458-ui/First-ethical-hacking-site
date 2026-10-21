import React, { useState } from 'react';
import { Eye, EyeOff, Radio, Globe, PhoneCall, Building2, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';
import { TelecomMetadata } from '../types.ts';

interface TelecomProfileCardProps {
  telecom: TelecomMetadata;
  generatedAt: string;
}

export const TelecomProfileCard: React.FC<TelecomProfileCardProps> = ({ telecom, generatedAt }) => {
  const [isMasked, setIsMasked] = useState(true);

  const displayTarget = isMasked ? telecom.maskedE164 : telecom.e164;

  const getActivityBadge = (status: TelecomMetadata['activityEstimate']) => {
    switch (status) {
      case 'likely_active':
        return (
          <span className="inline-flex items-center gap-1 text-emerald-400">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>Potentially Active Line</span>
          </span>
        );
      case 'reachable':
        return (
          <span className="inline-flex items-center gap-1 text-amber-400">
            <Radio className="h-3.5 w-3.5" />
            <span>Reachable Range</span>
          </span>
        );
      case 'invalid_range':
        return (
          <span className="inline-flex items-center gap-1 text-rose-400">
            <XCircle className="h-3.5 w-3.5" />
            <span>Invalid Prefix / Non-Routable</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-slate-400">
            <AlertTriangle className="h-3.5 w-3.5" />
            <span>Unconfirmed Activity</span>
          </span>
        );
    }
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl backdrop-blur-sm sm:p-7">
      {/* Header with Title and Unmask Toggle */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
            <span>Telecom & Numbering Metadata</span>
            <span aria-hidden="true">·</span>
            <span className="text-slate-500 font-mono tabular-nums">{new Date(generatedAt).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-3">
            <h3 className="font-mono text-2xl font-bold tracking-tight text-white tabular-nums sm:text-3xl">
              {displayTarget}
            </h3>
            <button
              onClick={() => setIsMasked(!isMasked)}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1 text-xs text-slate-300 hover:text-white hover:bg-slate-750 transition-colors"
              title={isMasked ? 'Reveal full phone number' : 'Mask sensitive digits'}
            >
              {isMasked ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
              <span>{isMasked ? 'Reveal' : 'Mask'}</span>
            </button>
          </div>
        </div>

        <div className="text-xs text-right">
          {getActivityBadge(telecom.activityEstimate)}
          <div className="text-[11px] text-slate-500 mt-0.5">Verified via ITU-T Numbering Plan</div>
        </div>
      </div>

      {/* Grid of Key Technical Attributes */}
      <div className="grid grid-cols-1 gap-4 pt-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Globe className="h-3.5 w-3.5 text-slate-500" />
            <span>Country & ISO</span>
          </div>
          <p className="text-sm font-semibold text-slate-100">
            {telecom.country} <span className="font-mono text-xs text-slate-400">({telecom.countryIso})</span>
          </p>
          <p className="text-xs text-slate-500 font-mono tabular-nums">Dialing Code {telecom.dialCode}</p>
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Radio className="h-3.5 w-3.5 text-slate-500" />
            <span>Line Allocation Type</span>
          </div>
          <p className="text-sm font-semibold text-slate-100">{telecom.lineTypeLabel}</p>
          <p className="text-xs text-slate-500">RFC 3966 Standard Class</p>
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Building2 className="h-3.5 w-3.5 text-slate-500" />
            <span>Network Operator / Carrier</span>
          </div>
          <p className="text-sm font-semibold text-slate-100 truncate" title={telecom.carrier}>
            {telecom.carrier}
          </p>
          <p className="text-xs text-slate-500">Assigned Routing Block</p>
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <PhoneCall className="h-3.5 w-3.5 text-slate-500" />
            <span>National Notation</span>
          </div>
          <p className="font-mono text-sm font-semibold text-slate-100 tabular-nums">
            {telecom.nationalNumber || telecom.e164}
          </p>
          <p className="text-xs text-slate-500">Local Dialing Format</p>
        </div>
      </div>
    </div>
  );
};
