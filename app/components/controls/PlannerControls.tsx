"use client";

import { useMemo } from "react";
import { usePlanner } from "@/app/components/providers/PlannerProvider";
import { formatInches } from "@/app/lib/units";

export function PlannerControls() {
  const { profile, availableProfiles, species, finish, setProfileId, setFinishByIndex } =
    usePlanner();

  const finishOptions = species.finishPresets;

  const dimensionsLabel = useMemo(() => {
    const { width, height, length } = profile.sizeInches;
    return `${formatInches(width)} × ${formatInches(height)} × ${formatInches(length)}`;
  }, [profile]);

  return (
    <section className="flex w-full flex-col gap-6 rounded-3xl border border-white/10 bg-white/80 p-6 shadow-2xl shadow-black/5 backdrop-blur dark:border-white/5 dark:bg-zinc-900/80">
      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-zinc-500">Profile</p>
        <select
          className="mt-2 w-full rounded-2xl border border-zinc-200/70 bg-white px-4 py-3 text-base font-medium text-zinc-900 outline-none transition focus:border-amber-400 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50"
          value={profile.id}
          onChange={(event) => setProfileId(event.target.value)}
        >
          {availableProfiles.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-zinc-500">Finish</p>
        <div className="mt-2 grid grid-cols-2 gap-2">
          {finishOptions.map((option, index) => (
            <button
              key={option.name}
              type="button"
              onClick={() => setFinishByIndex(index)}
              className={`rounded-2xl border px-4 py-3 text-left text-sm font-medium transition ${
                option.name === finish.name
                  ? "border-amber-400 bg-amber-50 text-amber-900 dark:border-amber-300 dark:bg-amber-400/10 dark:text-amber-100"
                  : "border-transparent bg-zinc-100 text-zinc-700 hover:border-zinc-300 dark:bg-zinc-800 dark:text-zinc-200"
              }`}
            >
              {option.name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-3 rounded-2xl bg-zinc-900/90 p-4 text-zinc-200 dark:bg-black/40">
        <div className="flex items-center justify-between text-sm uppercase tracking-[0.2em] text-zinc-500">
          Species
          <span className="text-base normal-case tracking-normal text-zinc-100">
            {species.label}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm uppercase tracking-[0.2em] text-zinc-500">
          Dimensions
          <span className="text-base normal-case tracking-normal text-zinc-100">
            {dimensionsLabel}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm uppercase tracking-[0.2em] text-zinc-500">
          Density
          <span className="text-base normal-case tracking-normal text-zinc-100">
            {species.density} lb/ft³
          </span>
        </div>
        <div className="flex items-center justify-between text-sm uppercase tracking-[0.2em] text-zinc-500">
          Modulus
          <span className="text-base normal-case tracking-normal text-zinc-100">
            {Intl.NumberFormat("en-US", { notation: "compact" }).format(species.modulus)} psi
          </span>
        </div>
      </div>
    </section>
  );
}
