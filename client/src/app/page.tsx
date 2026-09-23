"use client";

import React from "react";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  Target,
  FileCheck,
  Linkedin,
  Database,
  Lock,
  CheckCircle2,
} from "lucide-react";
import { Header } from "@/components/Header";
import { useAuth } from "@/context/AuthContext";

export default function LandingPage() {
  const { user, loading } = useAuth();

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <Header />

      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 py-16 flex flex-col items-center justify-center text-center space-y-16">
        {/* Hero Section */}
        <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI-Powered Full-Stack SaaS for Job Seekers & Recruiters</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
            Land More Interviews with{" "}
            <span className="bg-gradient-to-r from-emerald-600 via-teal-500 to-sky-600 bg-clip-text text-transparent">
              Bespoke Applications
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto">
            Stop sending generic resumes into ATS black holes. Bespoke tailors your bullet points to match any job description perfectly and writes high-converting LinkedIn outreach messages in seconds.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
            {!loading && user ? (
              <>
                <Link
                  href="/generate"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 transition-all shadow-lg shadow-emerald-500/25"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Launch Generator Studio</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/dashboard"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition-all"
                >
                  View Dashboard & History
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/signup"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 transition-all shadow-lg shadow-emerald-500/25 active:scale-95"
                >
                  <span>Start Free (3 Generates/Month)</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/login"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition-all"
                >
                  Log In
                </Link>
              </>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-xs text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              Zero Credit Card Required
            </span>
            <span className="flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-emerald-500" />
              Secure httpOnly Cookie Auth
            </span>
            <span className="flex items-center gap-1.5">
              <Database className="w-4 h-4 text-emerald-500" />
              PostgreSQL History Storage
            </span>
          </div>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left w-full">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="h-10 w-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-400 flex items-center justify-center">
              <FileCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              ATS-Optimized Resumes
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Aligns bullet points with the target job keywords using the XYZ achievement framework without fabricating work history.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="h-10 w-10 rounded-xl bg-sky-100 dark:bg-sky-950/70 text-sky-600 dark:text-sky-400 flex items-center justify-center">
              <Linkedin className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              Personalized LinkedIn Outreach
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Generates concise, high-converting messages ready to send to hiring managers and recruiters for instant connection.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="h-10 w-10 rounded-xl bg-purple-100 dark:bg-purple-950/70 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              Generation History Dashboard
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              All generated resumes and outreach notes are securely stored in your PostgreSQL database with one-click access and copying.
            </p>
          </div>
        </div>
      </main>

      <footer className="py-6 border-t border-slate-200/80 dark:border-slate-800/80 text-center text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            <strong>Bespoke SaaS</strong> — Next.js 14, NestJS, Prisma & PostgreSQL
          </span>
          <span>
            Database-Backed Monthly Quotas • Zero Client API Key Exposure
          </span>
        </div>
      </footer>
    </div>
  );
}
