import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bespoke | AI Tailored Resumes & LinkedIn Outreach",
  description:
    "Transform your resume and generate personalized LinkedIn outreach messages perfectly tailored to any job description in seconds.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-slate-50/50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-emerald-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
