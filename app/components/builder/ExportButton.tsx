"use client";

import { useState } from "react";
import { useBuilderState } from "@/app/components/builder/BuilderProvider";

export function ExportButton() {
  const state = useBuilderState();
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleExport = async () => {
    setIsExporting(true);
    setError(null);
    try {
      const response = await fetch("/api/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entities: state.entities }),
      });
      if (!response.ok) {
        throw new Error("Export failed");
      }
      const payload = await response.json();
      const blob = new Blob([JSON.stringify(payload, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `wood-worker-cut-list-${Date.now()}.json`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex flex-col gap-1 text-right">
      <button
        type="button"
        onClick={handleExport}
        disabled={isExporting || state.entities.length === 0}
        className="rounded-full border border-amber-500/30 bg-amber-500/10 px-6 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-amber-200 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {isExporting ? "Exporting…" : "Export Cut List"}
      </button>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}
