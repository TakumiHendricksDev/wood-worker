import type { BuilderEntity } from "@/app/lib/builder/types";
import { getWoodProfile, getWoodSpecies, getBoardFeet } from "@/app/lib/wood-models";

export type CutListRow = {
  profileId: string;
  label: string;
  species: string;
  count: number;
  boardFeet: number;
  lengthInches: number;
};

export function generateCutList(entities: BuilderEntity[]): CutListRow[] {
  const map = new Map<string, CutListRow>();

  entities.forEach((entity) => {
    const profile = getWoodProfile(entity.profileId);
    if (!profile) return;
    const key = profile.id;
    const existing = map.get(key);
    const boardFeet = getBoardFeet(profile, entity.transform.scale);
    if (existing) {
      existing.count += 1;
      existing.boardFeet += boardFeet;
    } else {
      const species = getWoodSpecies(profile.species);
      map.set(key, {
        profileId: profile.id,
        label: profile.label,
        species: species.label,
        count: 1,
        boardFeet,
        lengthInches: profile.sizeInches.length * entity.transform.scale.z,
      });
    }
  });

  return Array.from(map.values()).map((row) => ({
    ...row,
    boardFeet: Number(row.boardFeet.toFixed(2)),
  }));
}
