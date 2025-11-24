"use client";

import { createContext, useContext, useMemo, useState } from "react";
import {
  defaultProfileId,
  getWoodProfile,
  woodProfiles,
  woodSpecies,
  type FinishPreset,
  type WoodProfile,
  type WoodSpecies,
  type WoodSpeciesId,
} from "@/app/lib/wood-models";

const DEFAULT_FINISH_INDEX = 0;

type PlannerContextValue = {
  profileId: string;
  profile: WoodProfile;
  species: WoodSpecies;
  finish: FinishPreset;
  availableProfiles: WoodProfile[];
  setProfileId: (id: string) => void;
  setFinishByIndex: (index: number) => void;
};

const PlannerContext = createContext<PlannerContextValue | null>(null);

export function PlannerProvider({ children }: { children: React.ReactNode }) {
  const [profileId, setProfileId] = useState(defaultProfileId);
  const profile = useMemo(() => getWoodProfile(profileId) ?? woodProfiles[0], [profileId]);
  const species = woodSpecies[profile.species];
  const [finishSelection, setFinishSelection] = useState<Partial<Record<WoodSpeciesId, number>>>(
    {}
  );
  const finishIndex = finishSelection[profile.species] ?? DEFAULT_FINISH_INDEX;
  const finish = species.finishPresets[finishIndex] ?? species.finishPresets[0];

  const value: PlannerContextValue = {
    profileId,
    profile,
    species,
    finish,
    availableProfiles: woodProfiles,
    setProfileId,
    setFinishByIndex: (index: number) =>
      setFinishSelection((prev) => ({
        ...prev,
        [profile.species]: index,
      })),
  };

  return <PlannerContext.Provider value={value}>{children}</PlannerContext.Provider>;
}

export function usePlanner(): PlannerContextValue {
  const context = useContext(PlannerContext);
  if (!context) {
    throw new Error("usePlanner must be used within PlannerProvider");
  }
  return context;
}
