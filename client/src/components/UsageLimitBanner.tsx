"use client";

import React from "react";
import { AlertCircle, CheckCircle2, Mail, RotateCcw } from "lucide-react";

interface UsageLimitBannerProps {
  usageCount: number;
  maxLimit: number;
  onReset: () => void;
  contactEmail?: string;
}

export const UsageLimitBanner: React.FC<UsageLimitBannerProps> = ({
  usageCount,
  maxLimit,
  onReset,
  contactEmail = "support@bespoke.ai",
}) => {
  const isLimitReached = usageCount >= maxLimit;
  const remaining = Math.max(0, maxLimit - usageCount);

  if (isLimitReached) {
    return (
      <div className="rounded-xl border border-amber-300 dark:border-amber-700/60 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/40 dark:to-orange-950/30 p-4 text-amber-900 dark:text-amber-200 shadow-sm animate-fade-in">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-sm">
                Free limit reached — contact{" "}
                <a
                  href={`mailto:${contactEmail}`}
                  className="underline font-bold text-amber-800 dark:text-amber-300 hover:text-amber-950 dark:hover:text-amber-100"
                >
                  {contactEmail}
                </a>{" "}
                to keep using this.
              </p>
              <p className="text-xs text-amber-700/80 dark:text-amber-300/80 mt-0.5">
                You have used all {maxLimit} of your free daily generations.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onReset}
            title="Reset counter for testing/demo"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-amber-800 dark:text-amber-200 bg-amber-200/60 hover:bg-amber-200 dark:bg-amber-900/60 dark:hover:bg-amber-900 rounded-lg transition-colors ml-auto sm:ml-0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Local Counter (Demo)
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1 py-0.5">
      <div className="flex items-center gap-1.5">
        <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        <span>
          Daily Free Usage: <strong className="text-slate-700 dark:text-slate-200">{usageCount}</strong> / {maxLimit} used
        </span>
      </div>
      <span className="text-slate-400 dark:text-slate-500">
        {remaining} generation{remaining === 1 ? "" : "s"} remaining
      </span>
    </div>
  );
};
