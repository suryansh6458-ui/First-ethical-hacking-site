import React, { useState, useEffect } from 'react';
import { Layers, CheckCircle2, AlertTriangle, HelpCircle, ExternalLink, RefreshCw, Key } from 'lucide-react';
import { ProviderStatus } from '../types.ts';

export const ProviderStatusView: React.FC = () => {
  const [providers, setProviders] = useState<ProviderStatus[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastChecked, setLastChecked] = useState<string>('');

  const fetchProviders = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/providers');
      if (res.ok) {
        const data = await res.json();
        setProviders(data.providers);
        setLastChecked(new Date(data.timestamp).toLocaleTimeString());
      }
    } catch {
      // error
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProviders();
  }, []);

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl backdrop-blur-sm sm:p-7">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 mb-1">
              <Layers className="h-5 w-5" />
              <h2 className="text-lg font-bold text-white sm:text-xl">
                Research Integrations & Diagnostics
              </h2>
            </div>
            <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
              TraceLens connects to standardized ITU-T telecommunication databases, Gemini AI Search Grounding, and optional commercial threat intelligence providers.
            </p>
          </div>

          <button
            onClick={fetchProviders}
            disabled={isLoading}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-3.5 py-2 text-xs font-medium text-slate-200 hover:text-white hover:bg-slate-750 transition-colors self-start"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Re-Probe Providers</span>
          </button>
        </div>
      </div>

      {/* Providers Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {providers.map((prov) => {
          const isActive = prov.status === 'active';

          return (
            <div
              key={prov.id}
              className={`rounded-2xl border p-5 shadow-lg backdrop-blur-sm flex flex-col justify-between ${
                isActive
                  ? 'border-slate-800 bg-slate-900/70'
                  : 'border-slate-800/80 bg-slate-950/70'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-sm font-semibold text-white">{prov.name}</h4>
                  {isActive ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>Active</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-400">
                      <HelpCircle className="h-3.5 w-3.5" />
                      <span>Unconfigured</span>
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">
                  {prov.description}
                </p>

                <div className="flex items-center gap-2 text-[11px] text-slate-500 font-mono">
                  <span>Type: {prov.isBuiltIn ? 'Native Built-In' : 'External Adapter'}</span>
                  <span aria-hidden="true">·</span>
                  <span className="capitalize">{prov.category.replace('_', ' ')}</span>
                </div>
              </div>

              {!isActive && prov.configInstruction && (
                <div className="mt-4 rounded-xl border border-amber-500/20 bg-amber-500/5 p-3 text-[11px] text-amber-300 space-y-1">
                  <div className="flex items-center gap-1.5 font-semibold text-amber-200">
                    <Key className="h-3 w-3" />
                    <span>Setup Required:</span>
                  </div>
                  <p className="text-amber-400/90">{prov.configInstruction}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
