"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  Loader2,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  LayoutDashboard,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Header } from "@/components/Header";
import { JobInput } from "@/components/JobInput";
import { ResumeInput } from "@/components/ResumeInput";
import { OutputSection } from "@/components/OutputSection";
import { generateApi, GenerateResponsePayload } from "@/lib/api";
import { SAMPLE_JOB_DESCRIPTION, SAMPLE_RESUME } from "@/lib/sample-data";

export default function GeneratePage() {
  const { user, usage, loading, refreshMe } = useAuth();
  const router = useRouter();

  const [jobDescription, setJobDescription] = useState("");
  const [resume, setResume] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<GenerateResponsePayload | null>(null);

  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

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

  if (loading || !user) {
    return (
      <div className="min-h-screen flex flex-col justify-between bg-slate-50 dark:bg-slate-950">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
            <p className="text-sm text-slate-500">Checking authentication...</p>
          </div>
        </div>
      </div>
    );
  }

  const used = usage?.usedThisMonth ?? 0;
  const limit = usage?.monthlyLimit ?? 3;
  const remaining = usage?.remainingThisMonth ?? Math.max(0, limit - used);
  const isLimitReached = user.plan === "FREE" && used >= 3;

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
      const data = await generateApi.generate({
        jobDescription: jobDescription.trim(),
        resume: resume.trim(),
      });

      setResult(data);
      await refreshMe(); // Refresh monthly usage & history from DB

      setTimeout(() => {
        resultsRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 150);
    } catch (err: any) {
      setError(
        err.message || "An error occurred while generating tailored content."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-slate-50 dark:bg-slate-950">
      <Header />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 w-full space-y-8">
        {/* Top Control Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-600" />
              Tailored Resume & Outreach Studio
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Transform your resume and generate targeted LinkedIn notes for any job listing
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleLoadSample}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
              Load Sample Data
            </button>
            {(jobDescription || resume || result) && (
              <button
                type="button"
                onClick={handleClear}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg text-slate-600 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Usage Limit Bar */}
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
          <div className="flex items-center gap-1.5">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>
              Monthly Free Usage:{" "}
              <strong className="text-slate-700 dark:text-slate-200">
                {used}
              </strong>{" "}
              / {user.plan === "PRO" ? "Unlimited" : `${limit} max`}
            </span>
          </div>
          <span className="text-slate-400 dark:text-slate-500">
            {user.plan === "PRO" ? "Unlimited Plan" : `${remaining} generation(s) remaining this month`}
          </span>
        </div>

        {isLimitReached && (
          <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-bold text-sm">
                Monthly free limit reached (3/3 generations)
              </p>
              <p className="mt-0.5">
                You have used your 3 free generations for this month. Upgrade to Pro for unlimited generations or contact{" "}
                <strong className="underline">contact@bespoke.ai</strong>.
              </p>
            </div>
          </div>
        )}

        {/* Input Form */}
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

          {/* Error Notice */}
          {error && (
            <div className="rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 p-4 text-xs text-rose-800 dark:text-rose-200 flex items-start gap-3 animate-fade-in">
              <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="font-semibold">Generation Notice</p>
                <p className="mt-0.5 whitespace-pre-wrap">{error}</p>
              </div>
            </div>
          )}

          {/* Submit Action */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <div className="text-xs text-slate-500 dark:text-slate-400">
              Min 30 chars required for both job description and resume.
            </div>

            <button
              type="submit"
              disabled={!canGenerate}
              className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-sm transition-all shadow-md ${
                canGenerate
                  ? "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-500/20 active:scale-98 cursor-pointer"
                  : "bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed shadow-none"
              }`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Tailoring & Saving to Database...</span>
                </>
              ) : isLimitReached ? (
                <>
                  <span>Monthly Limit Reached (3/3)</span>
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

        {/* Results */}
        <div ref={resultsRef} className="pt-4">
          {result && (
            <div className="space-y-4">
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs text-emerald-800 dark:text-emerald-300 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Saved to your generation history in PostgreSQL!
                </span>
                <Link
                  href="/dashboard"
                  className="font-semibold underline flex items-center gap-1 hover:text-emerald-950"
                >
                  View on Dashboard <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <OutputSection
                tailoredResume={result.tailoredResume}
                outreachMessage={result.outreachMessage}
              />
            </div>
          )}
        </div>
      </main>

      <footer className="py-6 text-center text-xs text-slate-400 border-t border-slate-200 dark:border-slate-800">
        Bespoke SaaS Studio • Server-Side Gemini API & PostgreSQL Storage
      </footer>
    </div>
  );
}
