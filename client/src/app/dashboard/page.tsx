"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  Wand2,
  Calendar,
  FileText,
  Linkedin,
  Copy,
  Check,
  Eye,
  X,
  AlertCircle,
  TrendingUp,
  ShieldCheck,
  ChevronRight,
  Loader2,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useAuth } from "@/context/AuthContext";
import { Header } from "@/components/Header";
import { GenerationRecord } from "@/lib/api";

export default function DashboardPage() {
  const { user, usage, generations, loading, refreshMe } = useAuth();
  const router = useRouter();
  const [selectedGen, setSelectedGen] = useState<GenerationRecord | null>(null);
  const [copiedResume, setCopiedResume] = useState(false);
  const [copiedOutreach, setCopiedOutreach] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  const handleCopy = async (text: string, type: "resume" | "outreach") => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === "resume") {
        setCopiedResume(true);
        setTimeout(() => setCopiedResume(false), 2000);
      } else {
        setCopiedOutreach(true);
        setTimeout(() => setCopiedOutreach(false), 2000);
      }
    } catch (e) {
      console.error("Failed to copy", e);
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex flex-col justify-between bg-slate-50 dark:bg-slate-950">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
            <p className="text-sm text-slate-500">Loading your dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  const used = usage?.usedThisMonth ?? 0;
  const limit = usage?.monthlyLimit ?? 3;
  const remaining = usage?.remainingThisMonth ?? Math.max(0, limit - used);
  const isLimitReached = user.plan === "FREE" && used >= 3;

  return (
    <div className="min-h-screen flex flex-col justify-between bg-slate-50 dark:bg-slate-950">
      <Header />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 w-full space-y-8">
        {/* Welcome & Usage Stats Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                  Welcome, {user.email.split("@")[0]}
                </h1>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                  {user.plan} PLAN
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Track your generation activity and access your past tailored applications
              </p>
            </div>

            {/* CTA Button */}
            <Link
              href="/generate"
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-white shadow-md transition-all ${
                isLimitReached
                  ? "bg-slate-400 dark:bg-slate-700 cursor-not-allowed"
                  : "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-emerald-500/20 active:scale-95"
              }`}
            >
              <Wand2 className="w-4 h-4" />
              <span>Create New Tailored Resume</span>
            </Link>
          </div>

          {/* Usage Stats Gauge */}
          <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800/80 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/60 dark:border-slate-800/60">
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Used This Month
              </p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                {used}{" "}
                <span className="text-xs font-normal text-slate-400">
                  / {user.plan === "PRO" ? "Unlimited" : `${limit} max`}
                </span>
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/60 dark:border-slate-800/60">
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Remaining Generations
              </p>
              <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                {user.plan === "PRO" ? "∞" : remaining}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/60 dark:border-slate-800/60">
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Lifetime Saved
              </p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                {generations.length}
              </p>
            </div>
          </div>

          {/* Rate Limit Alert */}
          {isLimitReached && (
            <div className="mt-4 p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 flex items-start gap-2.5 text-xs text-amber-900 dark:text-amber-200">
              <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
              <div>
                <span className="font-semibold">
                  You have reached your 3 free generations for this calendar month.
                </span>{" "}
                Your quota will reset on the 1st of next month, or contact{" "}
                <strong className="underline">contact@bespoke.ai</strong> to upgrade to Pro.
              </div>
            </div>
          )}
        </div>

        {/* Past Generations List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-emerald-600" />
              Generation History ({generations.length})
            </h2>
            <button
              onClick={() => refreshMe()}
              className="text-xs text-slate-500 hover:text-emerald-600 font-medium"
            >
              Refresh
            </button>
          </div>

          {generations.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 mx-auto flex items-center justify-center text-slate-400">
                <Wand2 className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-slate-800 dark:text-slate-200">
                No tailored resumes yet
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                Paste a job description and your resume to generate your first ATS-tailored resume and LinkedIn outreach message!
              </p>
              <Link
                href="/generate"
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl transition-all shadow-sm"
              >
                Generate First Application
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {generations.map((gen) => (
                <div
                  key={gen.id}
                  onClick={() => setSelectedGen(gen)}
                  className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs hover:border-emerald-500/50 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(gen.createdAt).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-semibold group-hover:underline flex items-center gap-1">
                        View Details <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>

                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white line-clamp-2">
                      {gen.jobDescription.split("\n")[0] || "Target Job Position"}
                    </h3>

                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                      {gen.outreachMessage}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                    <span>{gen.tailoredResume.length} chars resume</span>
                    <span>Postgres Saved</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Detail Modal */}
      {selectedGen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-4xl max-h-[88vh] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden animate-fade-in">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  Saved Application Details
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Created on {new Date(selectedGen.createdAt).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => setSelectedGen(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              {/* LinkedIn Outreach */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <Linkedin className="w-4 h-4 text-sky-500" />
                    LinkedIn Outreach Message
                  </span>
                  <button
                    onClick={() => handleCopy(selectedGen.outreachMessage, "outreach")}
                    className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg bg-sky-50 dark:bg-sky-950 text-sky-700 dark:text-sky-300 hover:bg-sky-100"
                  >
                    {copiedOutreach ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedOutreach ? "Copied" : "Copy Message"}
                  </button>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 text-xs text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap border border-slate-200 dark:border-slate-800">
                  {selectedGen.outreachMessage}
                </div>
              </div>

              {/* Tailored Resume */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-emerald-500" />
                    Tailored Resume (Markdown)
                  </span>
                  <button
                    onClick={() => handleCopy(selectedGen.tailoredResume, "resume")}
                    className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100"
                  >
                    {copiedResume ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedResume ? "Copied" : "Copy Resume"}
                  </button>
                </div>
                <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-950 text-xs text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 prose prose-sm dark:prose-invert max-w-none">
                  <ReactMarkdown>{selectedGen.tailoredResume}</ReactMarkdown>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <footer className="py-6 text-center text-xs text-slate-400 border-t border-slate-200 dark:border-slate-800">
        Bespoke SaaS Dashboard • Powered by PostgreSQL & Supabase
      </footer>
    </div>
  );
}
