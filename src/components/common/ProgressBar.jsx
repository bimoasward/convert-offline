import React from 'react';
import { Loader2 } from 'lucide-react';

export default function ProgressBar({ progress = 0, statusMessage = '', isIndeterminate = false }) {
  const percentage = Math.min(Math.max(progress, 0), 100);

  return (
    <div className="w-full space-y-2.5">
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2 text-slate-300 font-medium">
          <Loader2 className="h-4 w-4 animate-spin text-indigo-400" />
          <span>{statusMessage || 'Memproses...'}</span>
        </div>
        <span className="font-mono text-sm font-semibold text-indigo-400">
          {isIndeterminate ? 'Loading engine...' : `${percentage}%`}
        </span>
      </div>

      {/* Progress Track */}
      <div className="relative h-3 w-full overflow-hidden rounded-full bg-slate-800 border border-slate-700/50 p-0.5">
        {isIndeterminate ? (
          <div className="h-full w-1/3 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 animate-[indeterminate_1.5s_infinite_linear]" />
        ) : (
          <div
            className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-indigo-400 to-purple-500 transition-all duration-300 ease-out shadow-[0_0_12px_rgba(99,102,241,0.5)]"
            style={{ width: `${percentage}%` }}
          />
        )}
      </div>
    </div>
  );
}
