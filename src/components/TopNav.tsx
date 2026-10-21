import React from 'react';
import { ShieldCheck, Plus, Trash2 } from 'lucide-react';

interface TopNavProps {
  activeTab: 'analyzer' | 'network' | 'remediation' | 'providers' | 'history';
  setActiveTab: (tab: 'analyzer' | 'network' | 'remediation' | 'providers' | 'history') => void;
  onNewInvestigation: () => void;
  historyCount: number;
  onPurgeData: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  activeTab,
  setActiveTab,
  onNewInvestigation,
  historyCount,
  onPurgeData,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-8 px-4 sm:px-6">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <ShieldCheck className="h-4 w-4" />
          </div>
          <button
            onClick={() => setActiveTab('analyzer')}
            className="text-base font-bold tracking-tight text-white hover:text-emerald-400 transition-colors whitespace-nowrap shrink-0"
          >
            TraceLens Intelligence
          </button>
        </div>

        {/* Zone 2: Clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <button
            onClick={() => setActiveTab('analyzer')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              activeTab === 'analyzer'
                ? 'text-emerald-400 border-b-2 border-emerald-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Footprint Analyzer
          </button>
          <button
            onClick={() => setActiveTab('network')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              activeTab === 'network'
                ? 'text-emerald-400 border-b-2 border-emerald-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            IP & Network
          </button>
          <button
            onClick={() => setActiveTab('remediation')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              activeTab === 'remediation'
                ? 'text-emerald-400 border-b-2 border-emerald-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Remediation Guide
          </button>
          <button
            onClick={() => setActiveTab('providers')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              activeTab === 'providers'
                ? 'text-emerald-400 border-b-2 border-emerald-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Provider Status
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              activeTab === 'history'
                ? 'text-emerald-400 border-b-2 border-emerald-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Audit History {historyCount > 0 && `(${historyCount})`}
          </button>
        </nav>

        {/* Zone 3: Primary Action & Data Minimization Purge */}
        <div className="flex items-center gap-2.5 shrink-0">
          {historyCount > 0 && (
            <button
              onClick={onPurgeData}
              title="Purge session memory (Data Minimization)"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors whitespace-nowrap"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Purge Data</span>
            </button>
          )}

          <button
            onClick={onNewInvestigation}
            className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500 px-3.5 py-1.5 text-xs font-semibold text-slate-950 hover:bg-emerald-400 transition-colors shadow-sm whitespace-nowrap shrink-0"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>New Investigation</span>
          </button>
        </div>
      </div>
    </header>
  );
};
