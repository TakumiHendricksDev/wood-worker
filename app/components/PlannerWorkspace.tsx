"use client";

import dynamic from "next/dynamic";
import { PlannerControls } from "@/app/components/controls/PlannerControls";
import { PlannerProvider } from "@/app/components/providers/PlannerProvider";

const PlannerCanvas = dynamic(
  () =>
    import("@/app/components/scene/PlannerCanvas").then((module) => module.PlannerCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[480px] w-full items-center justify-center rounded-3xl border border-dashed border-amber-200 bg-amber-50/40 text-amber-900">
        Loading 3D workspace…
      </div>
    ),
  }
);

export function PlannerWorkspace() {
  return (
    <PlannerProvider>
      <div className="grid gap-8 lg:grid-cols-[360px_1fr]">
        <PlannerControls />
        <PlannerCanvas />
      </div>
    </PlannerProvider>
  );
}
