import React from 'react';
import { X, Download, Printer, ShieldCheck, FileText, CheckCircle2 } from 'lucide-react';
import { FootprintReport } from '../types.ts';

interface ReportExportModalProps {
  report: FootprintReport;
  isOpen: boolean;
  onClose: () => void;
}

export const ReportExportModal: React.FC<ReportExportModalProps> = ({ report, isOpen, onClose }) => {
  if (!isOpen) return null;

  const handleDownloadJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(report, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `TraceLens_Audit_${report.reportId}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 p-5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <FileText className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Export Audit Report</h3>
              <p className="text-xs text-slate-400 font-mono">ID: {report.reportId}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Modal Body / Report Preview */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs">
          <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 space-y-3">
            <div className="flex justify-between items-center border-b border-slate-800/80 pb-2">
              <span className="font-semibold text-slate-300">Audited Number (Masked):</span>
              <span className="font-mono text-emerald-400 text-sm font-bold tabular-nums">
                {report.targetMasked}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Creation Timestamp:</span>
              <span className="font-mono text-slate-300">{new Date(report.generatedAt).toUTCString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Country & Line Type:</span>
              <span className="text-slate-300">{report.telecom.country} · {report.telecom.lineTypeLabel}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Carrier Allocation:</span>
              <span className="text-slate-300">{report.telecom.carrier}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Public Web References:</span>
              <span className="font-mono text-slate-300">{report.webReferences.length} verified listings</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Public Email Associations:</span>
              <span className="font-mono text-slate-300">{report.emailAssociations.length} citations</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Exposure Risk Rating:</span>
              <span className="font-semibold uppercase text-emerald-400">{report.overallRiskRating}</span>
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4 text-[11px] leading-relaxed text-slate-400">
            <span className="font-semibold text-slate-300 block mb-1">Audit Limitations & Verification Standard:</span>
            {report.limitationsStatement}
          </div>
        </div>

        {/* Modal Footer / Actions */}
        <div className="flex items-center justify-between border-t border-slate-800 p-5 bg-slate-950/40">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-200 hover:text-white hover:bg-slate-750 transition-colors"
          >
            <Printer className="h-3.5 w-3.5" />
            <span>Print Report (PDF)</span>
          </button>

          <button
            onClick={handleDownloadJson}
            className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500 px-5 py-2 text-xs font-semibold text-slate-950 hover:bg-emerald-400 transition-colors shadow-sm"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Download JSON Audit</span>
          </button>
        </div>
      </div>
    </div>
  );
};
