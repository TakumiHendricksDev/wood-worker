"use client";

import { useBuilder } from "@/app/components/builder/BuilderProvider";

export function StatusBar() {
  const { state } = useBuilder();
  const active = state.selection[0];
  const entity = state.entities.find((item) => item.id === active);

  return (
    <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-white/10 bg-black/50 px-4 py-2 text-[11px] uppercase tracking-[0.25em] text-zinc-400">
      <span>Tool: {state.tool}</span>
      <span>Snap: {state.preferences.snapIncrement}&quot;</span>
      <span>Selection: {entity ? entity.name : "None"}</span>
    </div>
  );
}
