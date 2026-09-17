"use client";

import React, { useState } from "react";
import {
  Check,
  Copy,
  Download,
  FileCheck,
  Linkedin,
  MessageSquareText,
  Sparkles,
  Eye,
  Code,
} from "lucide-react";
import ReactMarkdown from "react-markdown";

interface OutputSectionProps {
  tailoredResume: string;
  outreachMessage: string;
}

export const OutputSection: React.FC<OutputSectionProps> = ({
  tailoredResume,
  outreachMessage,
}) => {
  const [copiedResume, setCopiedResume] = useState(false);
  const [copiedOutreach, setCopiedOutreach] = useState(false);
  const [resumeViewMode, setResumeViewMode] = useState<"preview" | "raw">(
    "preview"
  );

  const handleCopyResume = async () => {
    try {
      await navigator.clipboard.writeText(tailoredResume);
      setCopiedResume(true);
      setTimeout(() => setCopiedResume(false), 2200);
    } catch (err) {
      console.error("Failed to copy resume", err);
    }
  };

  const handleCopyOutreach = async () => {
    try {
      await navigator.clipboard.writeText(outreachMessage);
      setCopiedOutreach(true);
      setTimeout(() => setCopiedOutreach(false), 2200);
    } catch (err) {
      console.error("Failed to copy outreach message", err);
    }
  };

  const handleDownloadResume = () => {
    const blob = new Blob([tailoredResume], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "Bespoke_Tailored_Resume.md";
    link.click();
    URL.revokeObjectURL(url);
  };

  const outreachWordCount = outreachMessage.trim().split(/\s+/).filter(Boolean).length;
  const outreachCharCount = outreachMessage.length;

  return (
    <section className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-2 pb-2 border-b border-slate-200 dark:border-slate-800">
        <Sparkles className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
        <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
          Generated Tailored Assets
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Tailored Resume Box (7 cols on large screens) */}
        <div className="lg:col-span-7 flex flex-col bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          {/* Box Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-slate-50/80 dark:bg-slate-800/50 border-b border-slate-200/80 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-400">
                <FileCheck className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                  Tailored Resume
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  ATS-optimized with matched keywords & impact metrics
                </p>
              </div>
            </div>

            {/* View switch & Copy */}
            <div className="flex items-center gap-2">
              <div className="inline-flex rounded-lg p-0.5 bg-slate-200/70 dark:bg-slate-800 text-[11px] font-medium">
                <button
                  type="button"
                  onClick={() => setResumeViewMode("preview")}
                  className={`px-2 py-1 rounded-md transition-colors flex items-center gap-1 ${
                    resumeViewMode === "preview"
                      ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                  }`}
                >
                  <Eye className="w-3 h-3" />
                  Preview
                </button>
                <button
                  type="button"
                  onClick={() => setResumeViewMode("raw")}
                  className={`px-2 py-1 rounded-md transition-colors flex items-center gap-1 ${
                    resumeViewMode === "raw"
                      ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                  }`}
                >
                  <Code className="w-3 h-3" />
                  Markdown
                </button>
              </div>

              <button
                type="button"
                onClick={handleDownloadResume}
                title="Download as Markdown file"
                className="p-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800 transition-colors"
              >
                <Download className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handleCopyResume}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all shadow-xs ${
                  copiedResume
                    ? "bg-emerald-600 text-white"
                    : "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-white"
                }`}
              >
                {copiedResume ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    Copy Resume
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Resume Content */}
          <div className="p-5 max-h-[620px] overflow-y-auto">
            {resumeViewMode === "preview" ? (
              <div className="prose prose-sm dark:prose-invert max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-h1:text-xl prose-h2:text-base prose-h2:border-b prose-h2:border-slate-200 dark:prose-h2:border-slate-800 prose-h2:pb-1 prose-h2:mt-4 prose-h2:mb-2 prose-p:text-slate-700 dark:prose-p:text-slate-300 prose-p:leading-relaxed prose-li:text-slate-700 dark:prose-li:text-slate-300 prose-li:my-0.5 prose-ul:my-2">
                <ReactMarkdown>{tailoredResume}</ReactMarkdown>
              </div>
            ) : (
              <pre className="text-xs font-mono bg-slate-50 dark:bg-slate-950 p-4 rounded-xl text-slate-800 dark:text-slate-200 whitespace-pre-wrap break-words border border-slate-100 dark:border-slate-800/60 select-all">
                {tailoredResume}
              </pre>
            )}
          </div>
        </div>

        {/* LinkedIn Outreach Box (5 cols on large screens) */}
        <div className="lg:col-span-5 flex flex-col bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden sticky top-24">
          {/* Box Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-slate-50/80 dark:bg-slate-800/50 border-b border-slate-200/80 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-sky-100 dark:bg-sky-950/70 text-sky-600 dark:text-sky-400">
                <Linkedin className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                  LinkedIn Outreach Note
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Ready to send to hiring managers & recruiters
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleCopyOutreach}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all shadow-xs ${
                copiedOutreach
                  ? "bg-emerald-600 text-white"
                  : "bg-sky-600 hover:bg-sky-700 text-white"
              }`}
            >
              {copiedOutreach ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  Copy Note
                </>
              )}
            </button>
          </div>

          {/* Message Content */}
          <div className="p-5 flex flex-col justify-between min-h-[300px]">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200/80 dark:border-slate-800/70 text-slate-800 dark:text-slate-200 text-sm leading-relaxed whitespace-pre-wrap select-all">
              {outreachMessage}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-2 font-mono text-[11px]">
                <span>{outreachWordCount} words</span>
                <span>•</span>
                <span>{outreachCharCount} chars</span>
              </div>
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                Optimized for InMail / Connection
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
