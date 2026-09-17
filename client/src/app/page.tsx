"use client";

import React, { useState, useEffect, useRef } from "react";
import { Sparkles, ArrowRight, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { Header } from "@/components/Header";
import { JobInput } from "@/components/JobInput";
import { ResumeInput } from "@/components/ResumeInput";
import { OutputSection } from "@/components/OutputSection";
import { UsageLimitBanner } from "@/components/UsageLimitBanner";
import { generateContent, GenerateResponsePayload } from "@/lib/api";
import { SAMPLE_JOB_DESCRIPTION, SAMPLE_RESUME } from "@/lib/sample-data";

const MAX_FREE_LIMIT = 3;
const STORAGE_KEY = "bespoke_usage_count";
const CONTACT_EMAIL = "contact@bespoke.ai";

export default function Home() {
  const [jobDescription, setJobDescription] = useState("");
  const [resume, setResume] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<GenerateResponsePayload | null>(null);
  const [usageCount, setUsageCount] = useState<number>(0);
  const [isClient, setIsClient] = useState(false);

  const resultsRef = useRef<HTMLDivElement>(null);

  // Initialize usage count from localStorage on client mount
  useEffect(() => {
    setIsClient(true);
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored !== null) {
        const parsed = parseInt(stored, 10);
        if (!isNaN(parsed)) {
          setUsageCount(parsed);
        }
      }
    } catch (e) {
      console.error("Failed to read localStorage usage count", e);
    }
  }, []);

  // Update localStorage when usage count changes
  const updateUsageCount = (newCount: number) => {
    setUsageCount(newCount);
    try {
      localStorage.setItem(STORAGE_KEY, newCount.toString());
    } catch (e) {
      console.error("Failed to set localStorage usage count", e);
    }
  };

  const handleResetUsage = () => {
    updateUsageCount(0);
  };

  const handleLoadSample = () => {
    setJobDescription(SAMPLE_JOB_DESCRIPTION);
    setResume(SAMPLE_RESUME);
    setError(null);
  };

  const handleClear = () => {
    setJobDescription("");
    setResume("");
    setError(null);
    setResult(null);
  };

  const isLimitReached = usageCount >= MAX_FREE_LIMIT;
  const canGenerate =
    jobDescription.trim().length >= 30 &&
    resume.trim().length >= 30 &&
    !isLoading &&
    !isLimitReached;

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canGenerate) return;

    setError(null);
    setIsLoading(true);

    try {
      const data = await generateContent({
        jobDescription: jobDescription.trim(),
        resume: resume.trim(),
      });

      setResult(data);
      updateUsageCount(usageCount + 1);

      // Smooth scroll to results
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred while generating tailored content.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <div>
        {/* Navigation & Header */}
        <Header
          onLoadSample={handleLoadSample}
          onClear={handleClear}
          hasInputs={Boolean(jobDescription || resume || result)}
        />

        {/* Main Content */}
        <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
          {/* Usage Limit Tracker & Status Banner */}
          {isClient && (
            <UsageLimitBanner
              usageCount={usageCount}
              maxLimit={MAX_FREE_LIMIT}
              onReset={handleResetUsage}
              contactEmail={CONTACT_EMAIL}
            />
          )}

          {/* Form & Input Section */}
          <form onSubmit={handleGenerate} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <JobInput
                value={jobDescription}
                onChange={setJobDescription}
                disabled={isLoading}
              />
              <ResumeInput
                value={resume}
                onChange={setResume}
                disabled={isLoading}
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 p-4 text-sm text-rose-800 dark:text-rose-200 flex items-start gap-3 animate-fade-in">
                <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="font-semibold">Generation Failed</p>
                  <p className="text-xs text-rose-700/90 dark:text-rose-300/90 mt-0.5 whitespace-pre-wrap">
                    {error}
                  </p>
                </div>
              </div>
            )}

            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
              <div className="text-xs text-slate-500 dark:text-slate-400 text-center sm:text-left">
                {!jobDescription && !resume ? (
                  <span>Click <strong>Load Sample Data</strong> above to test instantly.</span>
                ) : (
                  <span>
                    Minimum 30 characters required for both Job Description & Resume.
                  </span>
                )}
              </div>

              <button
                type="submit"
                disabled={!canGenerate}
                className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-sm transition-all shadow-md ${
                  canGenerate
                    ? "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-500/20 active:scale-[0.98] cursor-pointer"
                    : "bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed shadow-none"
                }`}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Tailoring with Gemini AI...</span>
                  </>
                ) : isLimitReached ? (
                  <>
                    <span>Free Limit Reached (3/3)</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Generate Tailored Resume & Outreach</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Results Output Section */}
          <div ref={resultsRef} className="pt-4">
            {result && (
              <OutputSection
                tailoredResume={result.tailoredResume}
                outreachMessage={result.outreachMessage}
              />
            )}
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="mt-16 border-t border-slate-200/80 dark:border-slate-800/80 py-6 text-center text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            <strong>Bespoke</strong> — Built with Next.js, NestJS & Gemini 2.5 Flash
          </div>
          <div>
            Secure API Architecture • Zero Client-Side Keys
          </div>
        </div>
      </footer>
    </div>
  );
}
