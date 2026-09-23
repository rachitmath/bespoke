"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sparkles, ArrowRight, Loader2, AlertCircle, Lock, Mail } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Header } from "@/components/Header";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setError(null);
    setIsLoading(true);

    try {
      await login(email.trim(), password);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Failed to log in. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-slate-50 dark:bg-slate-950">
      <Header />

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex h-12 w-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 items-center justify-center text-white shadow-lg shadow-emerald-500/20 mb-2">
              <Sparkles className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Welcome back to Bespoke
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Log in to manage your tailored resumes and LinkedIn outreach
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            {error && (
              <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-xs text-rose-800 dark:text-rose-200 flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 mt-0.5 flex-shrink-0" />
                <span className="leading-relaxed">{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 transition-all shadow-md shadow-emerald-600/20 disabled:opacity-60 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="pt-2 text-center text-xs text-slate-500 dark:text-slate-400">
              Don&apos;t have an account?{" "}
              <Link
                href="/signup"
                className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline"
              >
                Create a free account
              </Link>
            </div>
          </div>
        </div>
      </main>

      <footer className="py-6 text-center text-xs text-slate-400 border-t border-slate-200 dark:border-slate-800">
        Bespoke SaaS • Secure JWT & httpOnly Auth
      </footer>
    </div>
  );
}
