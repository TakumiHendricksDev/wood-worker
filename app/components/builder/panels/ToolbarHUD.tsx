"use client";

import clsx from "clsx";
import { useBuilder } from "@/app/components/builder/BuilderProvider";

const TOOL_LABELS = {
  translate: "Move (G)",
  rotate: "Rotate (R)",
  scale: "Scale (S)",
} as const;

export function ToolbarHUD() {
  const { state, setTool, setSnap } = useBuilder();

  return (
    <div className="flex items-center justify-between rounded-full border border-[color:var(--panel-border)] bg-[color:var(--hud-bg)] px-6 py-3 text-xs text-[color:var(--text-primary)] shadow-[var(--panel-shadow)] backdrop-blur">
      <div className="flex items-center gap-2">
        {Object.entries(TOOL_LABELS).map(([tool, label]) => (
          <button
            key={tool}
            type="button"
            onClick={() => setTool(tool as keyof typeof TOOL_LABELS)}
            className={clsx(
              "rounded-full px-3 py-1 font-medium",
              state.tool === tool
                ? "bg-[color:var(--accent)]/30 text-[color:var(--accent)]"
                : "bg-white/5 text-[color:var(--text-muted)] hover:bg-white/10"
            )}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] text-[color:var(--text-muted)]">
        Snap
        {[0.25, 0.5, 1].map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setSnap(value as 0.25 | 0.5 | 1)}
            className={clsx(
              "rounded-full px-3 py-1",
              state.preferences.snapIncrement === value
                ? "bg-[color:var(--accent)]/30 text-[color:var(--accent)]"
                : "bg-white/5 text-[color:var(--text-muted)] hover:bg-white/10"
            )}
          >
            {value}
            {"″"}
          </button>
        ))}
      </div>
    </div>
  );
}
