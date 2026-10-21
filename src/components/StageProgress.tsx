import React, { useState, useEffect } from 'react';
import { CheckCircle2, Loader2, Circle } from 'lucide-react';

interface StageProgressProps {
  isLoading: boolean;
}

const STAGES = [
  { id: 1, label: 'E.164 ITU-T Registry & Syntax Normalization' },
  { id: 2, label: 'Carrier Network & Line Type Verification' },
  { id: 3, label: 'Public Web Search Index & Directory Harvesting' },
  { id: 4, label: 'Correlating Public Email & Social Account Mentions' },
  { id: 5, label: 'Synthesizing Exposure Score & Remediation Guide' },
];

export const StageProgress: React.FC<StageProgressProps> = ({ isLoading }) => {
  const [currentStage, setCurrentStage] = useState(1);

  useEffect(() => {
    if (!isLoading) {
      setCurrentStage(1);
      return;
    }

    const intervals = [
      setTimeout(() => setCurrentStage(2), 600),
      setTimeout(() => setCurrentStage(3), 1400),
      setTimeout(() => setCurrentStage(4), 2600),
      setTimeout(() => setCurrentStage(5), 4200),
    ];

    return () => {
      intervals.forEach((timer) => clearTimeout(timer));
    };
  }, [isLoading]);

  if (!isLoading) return null;

  return (
    <div className="w-full rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl backdrop-blur-md">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300">
          Investigation Pipeline In Progress
        </h3>
        <span className="font-mono text-xs text-emerald-400 tabular-nums">
          Stage {currentStage} of {STAGES.length}
        </span>
      </div>

      <div className="space-y-3">
        {STAGES.map((stage) => {
          const isDone = stage.id < currentStage;
          const isCurrent = stage.id === currentStage;
          const isPending = stage.id > currentStage;

          return (
            <div
              key={stage.id}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-xs transition-colors ${
                isCurrent
                  ? 'border border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                  : isDone
                  ? 'text-slate-400'
                  : 'text-slate-600'
              }`}
            >
              {isDone ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              ) : isCurrent ? (
                <Loader2 className="h-4 w-4 animate-spin text-emerald-400 shrink-0" />
              ) : (
                <Circle className="h-4 w-4 text-slate-700 shrink-0" />
              )}
              <span className="font-medium">{stage.label}</span>
              {isDone && <span className="ml-auto font-mono text-[10px] text-emerald-500/80">COMPLETED</span>}
              {isCurrent && <span className="ml-auto font-mono text-[10px] text-emerald-400 animate-pulse">RUNNING</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
};
