/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { TopNav } from './components/TopNav.tsx';
import { PhoneIntakeCard } from './components/PhoneIntakeCard.tsx';
import { StageProgress } from './components/StageProgress.tsx';
import { TelecomProfileCard } from './components/TelecomProfileCard.tsx';
import { PublicWebMentionsCard } from './components/PublicWebMentionsCard.tsx';
import { EmailAssociationsCard } from './components/EmailAssociationsCard.tsx';
import { SocialAccountsCard } from './components/SocialAccountsCard.tsx';
import { SourceLedgerCard } from './components/SourceLedgerCard.tsx';
import { RemediationGuide } from './components/RemediationGuide.tsx';
import { NetworkIPView } from './components/NetworkIPView.tsx';
import { ProviderStatusView } from './components/ProviderStatusView.tsx';
import { AuditHistoryView } from './components/AuditHistoryView.tsx';
import { ReportExportModal } from './components/ReportExportModal.tsx';
import { FootprintReport, HistoryItem } from './types.ts';
import { ShieldCheck, Download, AlertTriangle, ArrowRight, ShieldAlert, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'analyzer' | 'network' | 'remediation' | 'providers' | 'history'>('analyzer');
  const [currentReport, setCurrentReport] = useState<FootprintReport | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [historyList, setHistoryList] = useState<HistoryItem[]>([]);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [prefillNumber, setPrefillNumber] = useState<string>('');

  const fetchHistory = async () => {
    try {
      const res = await fetch('/api/history');
      if (res.ok) {
        const data = await res.json();
        setHistoryList(data.history || []);
      }
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleStartAnalysis = async (rawNumber: string, countryIso: string, consent: boolean) => {
    setIsLoading(true);
    setError(null);
    setCurrentReport(null);
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rawNumber, countryCode: countryIso, userConsent: consent }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Intelligence analysis request failed.');
      }

      const data = await res.json();
      setCurrentReport(data.report);
      fetchHistory();
    } catch (err: any) {
      setError(err?.message || 'Failed to complete analysis inquiry.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewInvestigation = () => {
    setCurrentReport(null);
    setError(null);
    setPrefillNumber('');
    setActiveTab('analyzer');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePurgeData = async () => {
    try {
      await fetch('/api/history', { method: 'DELETE' });
      setHistoryList([]);
      setCurrentReport(null);
      setError(null);
    } catch {
      // ignore
    }
  };

  const getRiskColor = (rating: FootprintReport['overallRiskRating']) => {
    switch (rating) {
      case 'high':
        return 'text-rose-400 border-rose-500/30 bg-rose-500/10';
      case 'elevated':
        return 'text-amber-400 border-amber-500/30 bg-amber-500/10';
      case 'moderate':
        return 'text-sky-400 border-sky-500/30 bg-sky-500/10';
      case 'low':
      case 'minimal':
      default:
        return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-slate-950 font-sans">
      {/* Top Bar Navigation */}
      <TopNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onNewInvestigation={handleNewInvestigation}
        historyCount={historyList.length}
        onPurgeData={handlePurgeData}
      />

      {/* Main Viewport */}
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
        {activeTab === 'analyzer' && (
          <div className="space-y-8">
            {/* Phone Intake & Presets */}
            <PhoneIntakeCard
              onStartAnalysis={handleStartAnalysis}
              isLoading={isLoading}
              prefillNumber={prefillNumber}
            />

            {/* Error Message */}
            {error && (
              <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-5 text-sm text-rose-300 flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-rose-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="font-semibold text-rose-200">Investigation Error</span>
                  <p className="text-xs leading-relaxed text-rose-300/90">{error}</p>
                </div>
              </div>
            )}

            {/* Live Multi-Stage Progress Tracker */}
            <StageProgress isLoading={isLoading} />

            {/* Complete Intelligence Results Matrix */}
            {currentReport && !isLoading && (
              <div className="space-y-8 animate-in fade-in duration-300">
                {/* Executive Findings Strip */}
                <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl backdrop-blur-sm sm:p-7">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-800 pb-5">
                    <div>
                      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                        <span>Audit Findings Summary</span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono text-slate-500">Ref: {currentReport.reportId}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xl font-bold text-white tabular-nums">
                          {currentReport.targetMasked}
                        </span>
                        <span className={`inline-flex items-center rounded-lg border px-2.5 py-0.5 text-xs font-semibold capitalize ${getRiskColor(currentReport.overallRiskRating)}`}>
                          {currentReport.overallRiskRating} Risk Footprint
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setActiveTab('remediation')}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3.5 py-2 text-xs font-medium text-slate-200 hover:text-white hover:bg-slate-750 transition-colors"
                      >
                        <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                        <span>Remediation Plan</span>
                      </button>

                      <button
                        onClick={() => setIsExportModalOpen(true)}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500 px-4 py-2 text-xs font-semibold text-slate-950 hover:bg-emerald-400 transition-colors shadow-sm"
                      >
                        <Download className="h-3.5 w-3.5" />
                        <span>Export Report</span>
                      </button>
                    </div>
                  </div>

                  {/* High Level Risk Factor Callouts */}
                  <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <div className="rounded-xl bg-slate-950/60 p-3.5 border border-slate-800/80">
                      <div className="text-[11px] text-slate-400 uppercase tracking-wider">Public Web References</div>
                      <div className="text-xl font-bold font-mono text-white mt-1 tabular-nums">
                        {currentReport.webReferences.length}
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">Deduplicated indexing hits</div>
                    </div>

                    <div className="rounded-xl bg-slate-950/60 p-3.5 border border-slate-800/80">
                      <div className="text-[11px] text-slate-400 uppercase tracking-wider">Public Email Associations</div>
                      <div className="text-xl font-bold font-mono text-white mt-1 tabular-nums">
                        {currentReport.emailAssociations.length}
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">Verified public citations</div>
                    </div>

                    <div className="rounded-xl bg-slate-950/60 p-3.5 border border-slate-800/80">
                      <div className="text-[11px] text-slate-400 uppercase tracking-wider">Social / Directory Mentions</div>
                      <div className="text-xl font-bold font-mono text-white mt-1 tabular-nums">
                        {currentReport.socialProfiles.length}
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">Open user directories</div>
                    </div>
                  </div>
                </div>

                {/* 1. Telecom & Carrier Metadata Card */}
                <TelecomProfileCard
                  telecom={currentReport.telecom}
                  generatedAt={currentReport.generatedAt}
                />

                {/* 2. Public Web Index Mentions */}
                <PublicWebMentionsCard findings={currentReport.webReferences} />

                {/* 3. Public Email Associations Card */}
                <EmailAssociationsCard associations={currentReport.emailAssociations} />

                {/* 4. Public Social Media & Online Profiles */}
                <SocialAccountsCard profiles={currentReport.socialProfiles} />

                {/* 5. Source Transparency & Diagnostic Ledger */}
                <SourceLedgerCard
                  logs={currentReport.sourcesLog}
                  limitationsStatement={currentReport.limitationsStatement}
                />
              </div>
            )}
          </div>
        )}

        {activeTab === 'network' && <NetworkIPView />}

        {activeTab === 'remediation' && (
          <RemediationGuide
            optOutList={currentReport?.optOutChecklist || [
              {
                serviceName: 'Whitepages Inc.',
                category: 'Public Directory / People Search',
                optOutUrl: 'https://www.whitepages.com/suppression-requests',
                instructions: 'Submit your listing URL to suppress telephone records from the public index.',
                recommended: true,
              },
              {
                serviceName: 'Spokeo People Search',
                category: 'Data Aggregator',
                optOutUrl: 'https://www.spokeo.com/optout',
                instructions: 'Paste your public Spokeo listing link and verify via confirmation email.',
                recommended: true,
              },
              {
                serviceName: 'Radaris Public Records',
                category: 'Background Directory',
                optOutUrl: 'https://radaris.com/control/privacy',
                instructions: 'Request record removal via the automated privacy verification portal.',
                recommended: true,
              },
              {
                serviceName: 'FastPeopleSearch',
                category: 'Directory Aggregator',
                optOutUrl: 'https://www.fastpeoplesearch.com/removal',
                instructions: 'Search phone number, open record, and click "Remove My Record".',
                recommended: true,
              },
            ]}
            adviceList={currentReport?.remediationAdvice || [
              'Lock down Carrier Account PIN: Set a verbal account password to defend against unauthorized SIM-swap attacks.',
              'Migrate away from SMS 2FA: Switch email, banking, and cloud logins to Hardware Security Keys (FIDO2) or Authenticator Apps (TOTP).',
              'Submit Suppression Requests: Use the Data Broker Opt-Out links to delete indexed phone listings from people-search websites.',
              'Review Voicemail Security: Ensure your carrier voicemail box has a custom secure PIN instead of default factory code.',
              'Use VoIP Virtual Numbers: For non-essential online signups, use temporary or virtual numbers to keep your primary line private.',
            ]}
          />
        )}

        {activeTab === 'providers' && <ProviderStatusView />}

        {activeTab === 'history' && (
          <AuditHistoryView
            history={historyList}
            onSelectReport={(reportId) => {
              // Switch to analyzer view and show notification
              setActiveTab('analyzer');
            }}
            onPurge={handlePurgeData}
          />
        )}
      </main>

      {/* Report Export Modal */}
      {currentReport && (
        <ReportExportModal
          report={currentReport}
          isOpen={isExportModalOpen}
          onClose={() => setIsExportModalOpen(false)}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-8 text-center text-xs text-slate-500">
        <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-400">TraceLens Intelligence</span>
            <span aria-hidden="true">·</span>
            <span>Ethical OSINT & Footprint Audit</span>
          </div>
          <div className="text-slate-600">
            Compliant with ITU-T RFC 3966 · Authorized Public Search Indexing Only · Zero Plaintext Retention
          </div>
        </div>
      </footer>
    </div>
  );
}
