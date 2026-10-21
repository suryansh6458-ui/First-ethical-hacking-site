import React, { useState } from 'react';
import { ExternalLink, ShieldCheck, CheckSquare, Square, Smartphone, Key, Lock, ArrowUpRight } from 'lucide-react';
import { FootprintReport } from '../types.ts';

interface RemediationGuideProps {
  optOutList: FootprintReport['optOutChecklist'];
  adviceList: string[];
}

export const RemediationGuide: React.FC<RemediationGuideProps> = ({ optOutList, adviceList }) => {
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({});

  const toggleStep = (key: string) => {
    setCompletedSteps((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl backdrop-blur-sm sm:p-7">
        <div className="flex items-center gap-2.5 text-emerald-400 mb-2">
          <ShieldCheck className="h-5 w-5" />
          <h2 className="text-lg font-bold text-white sm:text-xl">
            Digital Footprint Remediation & Defense Framework
          </h2>
        </div>
        <p className="text-xs text-slate-400 max-w-3xl leading-relaxed">
          Actionable steps to suppress your telephone number from public search brokers, secure your cellular account against unauthorized SIM-swap attacks, and decouple sensitive credentials from SMS verification.
        </p>
      </div>

      {/* Two Column Grid: Data Broker Opt-Outs + Account Security Hardening */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Card 1: Data Broker Suppression Portal */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl backdrop-blur-sm sm:p-7 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-200">
                  Data Broker Suppression Links
                </h3>
                <p className="text-xs text-slate-400">
                  Direct official opt-out portals for public directories that aggregate phone numbers.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {optOutList.map((broker) => (
                <div
                  key={broker.serviceName}
                  className="rounded-xl border border-slate-800 bg-slate-950/60 p-3.5 space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs text-white">{broker.serviceName}</span>
                    <a
                      href={broker.optOutUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-400 hover:bg-emerald-500/20 transition-colors"
                    >
                      <span>Opt-Out Portal</span>
                      <ArrowUpRight className="h-3 w-3" />
                    </a>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {broker.instructions}
                  </p>
                  <div className="text-[11px] text-slate-500">
                    Category: {broker.category}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Card 2: Security Hardening Checklist */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl backdrop-blur-sm sm:p-7 flex flex-col justify-between">
          <div>
            <div className="border-b border-slate-800 pb-4 mb-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-200">
                Identity & Telecom Hardening Checklist
              </h3>
              <p className="text-xs text-slate-400">
                Essential defenses to prevent account takeover via phone number correlation.
              </p>
            </div>

            <div className="space-y-3">
              {adviceList.map((advice, index) => {
                const key = `advice-${index}`;
                const isChecked = !!completedSteps[key];

                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => toggleStep(key)}
                    className={`w-full flex items-start gap-3 rounded-xl border p-3.5 text-left text-xs transition-colors ${
                      isChecked
                        ? 'border-emerald-500/30 bg-emerald-500/5 text-slate-300'
                        : 'border-slate-800 bg-slate-950/60 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="mt-0.5 shrink-0 text-emerald-400">
                      {isChecked ? <CheckSquare className="h-4 w-4" /> : <Square className="h-4 w-4 text-slate-600" />}
                    </div>
                    <span className={isChecked ? 'line-through text-slate-500' : 'text-slate-300'}>
                      {advice}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Technical Tip */}
          <div className="mt-5 rounded-xl border border-slate-800 bg-slate-800/40 p-3.5 text-xs text-slate-400 space-y-1">
            <div className="flex items-center gap-1.5 font-medium text-slate-200">
              <Lock className="h-3.5 w-3.5 text-emerald-400" />
              <span>SIM-Swap Port Freeze Tip</span>
            </div>
            <p className="text-[11px] leading-relaxed text-slate-400">
              Most telecom carriers (Verizon, AT&T, T-Mobile, Vodafone, EE) offer a free "Port Freeze" or "Number Transfer PIN" feature. Enabling this prevents any port-out requests without multi-factor biometric verification.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
