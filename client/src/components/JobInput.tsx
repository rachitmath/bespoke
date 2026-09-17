"use client";

import React from "react";
import { Briefcase, FileCode } from "lucide-react";

interface JobInputProps {
  value: string;
  onChange: (val: string) => void;
  disabled?: boolean;
}

export const JobInput: React.FC<JobInputProps> = ({
  value,
  onChange,
  disabled,
}) => {
  const charCount = value.trim().length;

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden focus-within:border-emerald-500 dark:focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500/30 transition-all">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-50/70 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800/80">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-400">
            <Briefcase className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
              1. Paste Job Description
            </h2>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Target role responsibilities & requirements
            </p>
          </div>
        </div>
        <div className="text-[11px] font-mono text-slate-400 dark:text-slate-500">
          {charCount} chars
        </div>
      </div>

      {/* Textarea */}
      <div className="p-4 flex-1 flex flex-col min-h-[260px]">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          placeholder="Paste the target job listing here (job title, requirements, responsibilities, company details)..."
          className="w-full flex-1 bg-transparent text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none resize-none leading-relaxed"
          rows={10}
        />
      </div>
    </div>
  );
};
