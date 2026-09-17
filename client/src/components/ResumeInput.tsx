"use client";

import React, { useState, useRef } from "react";
import { FileText, Upload, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { extractTextFromFile } from "@/lib/pdf-parser";

interface ResumeInputProps {
  value: string;
  onChange: (val: string) => void;
  disabled?: boolean;
}

export const ResumeInput: React.FC<ResumeInputProps> = ({
  value,
  onChange,
  disabled,
}) => {
  const [isParsing, setIsParsing] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const charCount = value.trim().length;

  const handleFileProcess = async (file: File) => {
    setParseError(null);
    setIsParsing(true);
    setFileName(file.name);

    try {
      const extracted = await extractTextFromFile(file);
      onChange(extracted);
    } catch (err: any) {
      setParseError(err.message || "Failed to extract text from file");
      setFileName(null);
    } finally {
      setIsParsing(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileProcess(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileProcess(file);
    }
  };

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      className={`flex flex-col h-full bg-white dark:bg-slate-900 rounded-2xl border ${
        isDragging
          ? "border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-50/20"
          : "border-slate-200 dark:border-slate-800"
      } shadow-sm overflow-hidden focus-within:border-emerald-500 dark:focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500/30 transition-all`}
    >
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.txt"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-50/70 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800/80">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-teal-100 dark:bg-teal-950/70 text-teal-700 dark:text-teal-400">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
              2. Paste or Upload Your Resume
            </h2>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Supports .pdf and .txt client extraction
            </p>
          </div>
        </div>

        {/* Upload Button */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled || isParsing}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg text-emerald-700 dark:text-emerald-300 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/50 dark:hover:bg-emerald-900/50 border border-emerald-200/80 dark:border-emerald-800/60 transition-colors disabled:opacity-50"
          >
            {isParsing ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Upload className="w-3.5 h-3.5" />
            )}
            <span>{isParsing ? "Extracting..." : "Upload File"}</span>
          </button>
        </div>
      </div>

      {/* Status Bar if file uploaded or error */}
      {fileName && !parseError && (
        <div className="px-4 py-1.5 bg-emerald-50 dark:bg-emerald-950/30 border-b border-emerald-100 dark:border-emerald-900/40 text-xs text-emerald-800 dark:text-emerald-300 flex items-center justify-between">
          <span className="flex items-center gap-1.5 truncate">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
            Loaded from <strong className="font-medium truncate">{fileName}</strong>
          </span>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-mono">
            {charCount} chars
          </span>
        </div>
      )}

      {parseError && (
        <div className="px-4 py-1.5 bg-rose-50 dark:bg-rose-950/30 border-b border-rose-100 dark:border-rose-900/40 text-xs text-rose-800 dark:text-rose-300 flex items-center gap-1.5">
          <AlertCircle className="w-3.5 h-3.5 text-rose-600 flex-shrink-0" />
          <span>{parseError}</span>
        </div>
      )}

      {/* Textarea */}
      <div className="p-4 flex-1 flex flex-col min-h-[260px]">
        <textarea
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            if (fileName) setFileName(null);
          }}
          disabled={disabled || isParsing}
          placeholder="Paste your existing resume text here, or click 'Upload File' above to extract from a .pdf or .txt file..."
          className="w-full flex-1 bg-transparent text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none resize-none leading-relaxed"
          rows={10}
        />
      </div>
    </div>
  );
};
