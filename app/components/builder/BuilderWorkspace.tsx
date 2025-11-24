"use client";

import { BuilderProvider } from "@/app/components/builder/BuilderProvider";
import { OutlinerPanel } from "@/app/components/builder/panels/OutlinerPanel";
import { InspectorPanel } from "@/app/components/builder/panels/InspectorPanel";
import { ToolbarHUD } from "@/app/components/builder/panels/ToolbarHUD";
import { SceneViewport } from "@/app/components/builder/viewport/SceneViewport";
import { StatusBar } from "@/app/components/builder/panels/StatusBar";
import { ExportButton } from "@/app/components/builder/ExportButton";

export function BuilderWorkspace() {
  return (
    <BuilderProvider>
      <div className="space-y-6">
        <ToolbarHUD />
        <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)_280px]">
          <OutlinerPanel />
          <SceneViewport />
          <InspectorPanel />
        </div>
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <StatusBar />
          <ExportButton />
        </div>
      </div>
    </BuilderProvider>
  );
}
