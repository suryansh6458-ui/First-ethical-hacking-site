import React, { useState, useEffect } from 'react';
import { Network, Search, Globe, Shield, Radio, Info, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';
import { IPAnalysisResult } from '../types.ts';

export const NetworkIPView: React.FC = () => {
  const [ipInput, setIpInput] = useState('');
  const [ipData, setIpData] = useState<IPAnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchIpInfo = async (voluntaryIp?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const url = voluntaryIp ? `/api/network/ip-info?ip=${encodeURIComponent(voluntaryIp)}` : '/api/network/ip-info';
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to query IP intelligence endpoint.');
      const data = await res.json();
      setIpData(data);
    } catch (err: any) {
      setError(err?.message || 'Error querying IP intelligence service.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleManualSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ipInput.trim()) return;
    fetchIpInfo(ipInput.trim());
  };

  return (
    <div className="space-y-6">
      {/* Educational Banner: Why Phone != Live IP */}
      <div className="rounded-2xl border border-sky-500/20 bg-sky-500/5 p-6 shadow-xl backdrop-blur-sm sm:p-7">
        <div className="flex items-start gap-3">
          <Info className="h-5 w-5 text-sky-400 shrink-0 mt-0.5" />
          <div className="space-y-2">
            <h3 className="text-base font-bold text-white">
              PSTN Telecom Routing vs. Internet Protocol (IP) Architecture
            </h3>
            <p className="text-xs leading-relaxed text-slate-300">
              A telephone number operates over the <strong>Public Switched Telephone Network (SS7 / Diameter)</strong> and cellular base stations using IMSI/MSISDN protocols. It does <em>not</em> possess a static or discoverable public IP address. Cellular handsets connect through <strong>Carrier-Grade NAT (CGNAT)</strong>, where a single carrier gateway IP is dynamically shared among thousands of mobile devices.
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-sky-300/85">
              <span>Public Gateway IP (ISP Node)</span>
              <span aria-hidden="true">≠</span>
              <span>Carrier CGNAT (RFC 6598 Shared Pool)</span>
              <span aria-hidden="true">≠</span>
              <span>Device Local IP (RFC 1918 Private LAN)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Tools: Voluntary Self-Lookup & Manual IP Query */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Lookup Controls */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl backdrop-blur-sm sm:p-7 space-y-6">
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-200">
              Authorized IP Intelligence
            </h4>
            <p className="text-xs text-slate-400 mt-1">
              Inspect your current egress IP or analyze a voluntarily supplied IPv4 address.
            </p>
          </div>

          {/* User Self-Lookup Action */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
              <Globe className="h-4 w-4 text-emerald-400" />
              <span>Audit Your Current Public IP</span>
            </div>
            <p className="text-xs text-slate-400">
              Queries the public egress IP of your active browser connection with your explicit authorization.
            </p>
            <button
              onClick={() => fetchIpInfo()}
              disabled={isLoading}
              className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-slate-800 border border-slate-700 px-4 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-750 hover:text-white transition-colors"
            >
              <span>Inspect My Connection IP</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Voluntary IP Input */}
          <form onSubmit={handleManualSearch} className="space-y-3">
            <label className="text-xs font-medium text-slate-300">
              Voluntary IP Address Lookup:
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="e.g. 8.8.8.8 or 100.64.1.1"
                value={ipInput}
                onChange={(e) => setIpInput(e.target.value)}
                className="h-10 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 font-mono text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading || !ipInput.trim()}
              className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-500 px-4 py-2 text-xs font-semibold text-slate-950 hover:bg-emerald-400 transition-colors disabled:opacity-50"
            >
              <span>Lookup Autonomous System (ASN)</span>
              <Search className="h-3.5 w-3.5" />
            </button>
          </form>

          {error && (
            <div className="flex items-center gap-2 text-xs text-rose-400 bg-rose-500/10 p-3 rounded-lg border border-rose-500/20">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Results Card */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl backdrop-blur-sm sm:p-7 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
              <div>
                <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-200">
                  Network Node Findings & ASN Routing
                </h4>
                <p className="text-xs text-slate-400">
                  Legitimate public routing metadata from autonomous system registries.
                </p>
              </div>
              {ipData && (
                <span className="font-mono text-xs text-emerald-400 tabular-nums">
                  {new Date(ipData.queriedAt).toLocaleTimeString()}
                </span>
              )}
            </div>

            {ipData ? (
              <div className="space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                  <div>
                    <div className="text-[11px] uppercase tracking-wider text-slate-500">Query Target IP</div>
                    <div className="font-mono text-xl font-bold text-white tabular-nums">{ipData.ip}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[11px] uppercase tracking-wider text-slate-500">Classification</div>
                    <div className="font-semibold text-xs text-emerald-400 capitalize">
                      {ipData.networkExplanation.type.replace('_', ' ')}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1">
                    <span className="text-slate-400">Internet Service Provider (ISP):</span>
                    <p className="font-semibold text-slate-200">{ipData.isp || 'Telecom Transit Carrier'}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-slate-400">Autonomous System Number:</span>
                    <p className="font-mono font-semibold text-slate-200">{ipData.asn || 'AS-PUBLIC'}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-slate-400">Organization / Carrier:</span>
                    <p className="font-semibold text-slate-200">{ipData.organization || 'Global Network'}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-slate-400">Geographic Region / Country:</span>
                    <p className="font-semibold text-slate-200">
                      {ipData.city ? `${ipData.city}, ` : ''}{ipData.country || 'International'}
                    </p>
                  </div>
                  <div className="space-y-1 sm:col-span-2">
                    <span className="text-slate-400">Data Source:</span>
                    <p className="text-[11px] text-slate-400 font-mono">{ipData.lookupSource}</p>
                  </div>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-1.5">
                  <span className="text-xs font-semibold text-slate-300">Why a Phone Number Doesn't Reveal this IP:</span>
                  <p className="text-xs leading-relaxed text-slate-400">
                    {ipData.networkExplanation.whyPhoneDoesNotExposeLiveIp}
                  </p>
                </div>
              </div>
            ) : (
              <div className="h-64 flex flex-col items-center justify-center text-center p-6 border border-dashed border-slate-800 rounded-xl">
                <Network className="h-8 w-8 text-slate-600 mb-2" />
                <h5 className="text-sm font-medium text-slate-300">No IP query executed yet</h5>
                <p className="text-xs text-slate-500 mt-1 max-w-sm">
                  Click "Inspect My Connection IP" or enter a public IPv4 address to inspect legitimate ASN and network routing information.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
