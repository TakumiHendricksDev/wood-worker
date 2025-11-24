"use client";

import { useMemo } from "react";
import { Panel } from "@/app/components/builder/panels/Panel";
import { useBuilder } from "@/app/components/builder/BuilderProvider";
import { woodProfiles, woodSpecies } from "@/app/lib/wood-models";
import { formatInches } from "@/app/lib/units";

export function InspectorPanel() {
  const { state, setTransform, updateEntity } = useBuilder();
  const activeEntity = useMemo(() => {
    if (state.selection.length === 0) return null;
    return state.entities.find((entity) => entity.id === state.selection[0]) ?? null;
  }, [state.entities, state.selection]);

  const profile = activeEntity ? woodProfiles.find((p) => p.id === activeEntity.profileId) : null;
  const species = profile ? woodSpecies[profile.species] : null;

  const handleTransformChange = (field: "position" | "rotation" | "scale", axis: "x" | "y" | "z") =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (!activeEntity) return;
      const value = Number(event.target.value);
      const next = structuredClone(activeEntity.transform);
      next[field][axis] = Number.isFinite(value) ? value : 0;
      setTransform(activeEntity.id, next);
    };

  if (!activeEntity) {
    return (
      <Panel title="Inspector">
        <p className="text-sm text-zinc-500">Select a lumber object to edit its properties.</p>
      </Panel>
    );
  }

  return (
    <Panel title="Inspector" className="space-y-6">
      <div className="space-y-2">
        <label className="text-xs uppercase tracking-[0.3em] text-zinc-500">Name</label>
        <input
          className="w-full rounded-2xl border border-white/5 bg-black/30 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-amber-400"
          value={activeEntity.name}
          onChange={(event) => updateEntity(activeEntity.id, { name: event.target.value })}
        />
      </div>

      <section className="space-y-3">
        <header className="text-xs uppercase tracking-[0.3em] text-zinc-500">Transform</header>
        {(["position", "rotation", "scale"] as const).map((field) => (
          <div key={field} className="grid grid-cols-[60px_1fr] items-center gap-2">
            <span className="text-xs font-medium text-zinc-400">{field}</span>
            <div className="grid grid-cols-3 gap-2">
              {(["x", "y", "z"] as const).map((axis) => (
                <input
                  key={`${field}-${axis}`}
                  type="number"
                  step={field === "rotation" ? 5 : 0.25}
                  value={Number(activeEntity.transform[field][axis].toFixed(3))}
                  onChange={handleTransformChange(field, axis)}
                  className="rounded-xl border border-white/10 bg-black/40 px-2 py-2 text-center text-xs text-zinc-100 focus:border-amber-400"
                />
              ))}
            </div>
          </div>
        ))}
        <p className="text-[11px] text-zinc-500">
          Position units are inches. Rotation rounded to degrees. Scale is unitless multiplier.
        </p>
      </section>

      {profile && species && (
        <section className="space-y-4">
          <div className="space-y-1">
            <header className="text-xs uppercase tracking-[0.3em] text-zinc-500">Lumber</header>
            <p className="text-sm text-zinc-200">{profile.label}</p>
            <p className="text-xs text-zinc-400">{species.label}</p>
            <p className="text-xs text-zinc-400">
              {formatInches(profile.sizeInches.width)} × {formatInches(profile.sizeInches.height)} × {" "}
              {formatInches(profile.sizeInches.length)}
            </p>
          </div>
          <div className="space-y-2">
            <header className="text-xs uppercase tracking-[0.3em] text-zinc-500">Finish</header>
            <div className="grid grid-cols-2 gap-2">
              {species.finishPresets.map((preset) => (
                <button
                  key={preset.name}
                  type="button"
                  className="rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-left text-xs text-zinc-200 hover:border-amber-400"
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>
        </section>
      )}
    </Panel>
  );
}