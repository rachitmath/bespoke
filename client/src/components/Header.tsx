"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Sparkles, LayoutDashboard, Wand2, LogOut, User, LogIn, ArrowRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export const Header: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <header className="border-b border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
        {/* Logo & Brand */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                Bespoke
              </span>
              <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60">
                SaaS
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">
              AI Tailored Resumes & LinkedIn Outreach
            </p>
          </div>
        </Link>

        {/* Navigation Links (when authenticated) */}
        {!loading && user && (
          <nav className="hidden md:flex items-center gap-1 bg-slate-100 dark:bg-slate-800/60 p-1 rounded-xl border border-slate-200/60 dark:border-slate-700/50 text-xs font-medium">
            <Link
              href="/dashboard"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
                pathname === "/dashboard"
                  ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-semibold"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              Dashboard
            </Link>
            <Link
              href="/generate"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
                pathname === "/generate"
                  ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-semibold"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Wand2 className="w-3.5 h-3.5" />
              Generate
            </Link>
          </nav>
        )}

        {/* Auth Buttons / Profile Menu */}
        <div className="flex items-center gap-3">
          {loading ? (
            <div className="h-8 w-24 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-lg" />
          ) : user ? (
            <div className="flex items-center gap-2.5">
              <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/50">
                <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold">
                  {user.email[0].toUpperCase()}
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-xs font-medium text-slate-800 dark:text-slate-200 truncate max-w-[130px]">
                    {user.email}
                  </p>
                  <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold tracking-wide">
                    {user.plan} PLAN
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                title="Log Out"
                className="p-2 text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              >
                <LogIn className="w-3.5 h-3.5" />
                Log In
              </Link>
              <Link
                href="/signup"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-all shadow-sm shadow-emerald-600/20"
              >
                Get Started
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
