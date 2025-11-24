import type { MeshStandardMaterialParameters } from "three";

export type WoodSpeciesId = "pine" | "cedar" | "oak" | "walnut";

export type FinishPreset = {
  name: string;
  color: number;
  roughness: number;
  metalness?: number;
};

export type WoodSpecies = {
  label: string;
  density: number; // lb/ft^3
  modulus: number; // psi
  finishPresets: FinishPreset[];
};

export type WoodProfile = {
  id: string;
  label: string;
  species: WoodSpeciesId;
  sizeInches: { width: number; height: number; length: number };
  material: MeshStandardMaterialParameters;
  orientation: {
    lengthAxis: "x" | "y" | "z";
    upAxis: "x" | "y" | "z";
  };
  notes?: string;
};

export const woodSpecies: Record<WoodSpeciesId, WoodSpecies> = {
  pine: {
    label: "Douglas Fir / Pine",
    density: 34,
    modulus: 1200000,
    finishPresets: [
      { name: "Bare", color: 0xe5c39d, roughness: 0.85 },
      { name: "Clear Coat", color: 0xd7b38b, roughness: 0.45 },
    ],
  },
  cedar: {
    label: "Western Red Cedar",
    density: 23,
    modulus: 1100000,
    finishPresets: [
      { name: "Natural", color: 0xc68f5d, roughness: 0.75 },
      { name: "Oil", color: 0xb0723c, roughness: 0.6 },
    ],
  },
  oak: {
    label: "White Oak",
    density: 47,
    modulus: 1500000,
    finishPresets: [
      { name: "Natural", color: 0xc9a27a, roughness: 0.65 },
      { name: "Walnut Stain", color: 0x8a5b30, roughness: 0.5 },
    ],
  },
  walnut: {
    label: "Black Walnut",
    density: 40,
    modulus: 1400000,
    finishPresets: [
      { name: "Bare", color: 0x5c3a21, roughness: 0.55 },
      { name: "Polish", color: 0x402414, roughness: 0.35 },
    ],
  },
};

export const woodProfiles: WoodProfile[] = [
  {
    id: "stud-2x4",
    label: "2×4 Stud",
    species: "pine",
    sizeInches: { width: 1.5, height: 3.5, length: 96 },
    material: { color: 0xe5c39d, roughness: 0.8, metalness: 0.05 },
    orientation: { lengthAxis: "z", upAxis: "y" },
    notes: "Standard framing stud",
  },
  {
    id: "beam-4x4",
    label: "4×4 Post",
    species: "cedar",
    sizeInches: { width: 3.5, height: 3.5, length: 96 },
    material: { color: 0xc68f5d, roughness: 0.7, metalness: 0.04 },
    orientation: { lengthAxis: "z", upAxis: "y" },
    notes: "Outdoor pergola post",
  },
  {
    id: "board-1x6",
    label: "1×6 Board",
    species: "oak",
    sizeInches: { width: 0.75, height: 5.5, length: 72 },
    material: { color: 0xc9a27a, roughness: 0.65, metalness: 0.04 },
    orientation: { lengthAxis: "z", upAxis: "y" },
  },
  {
    id: "panel-3-4",
    label: "3/4″ Walnut Panel",
    species: "walnut",
    sizeInches: { width: 0.75, height: 24, length: 48 },
    material: { color: 0x5c3a21, roughness: 0.55, metalness: 0.03 },
    orientation: { lengthAxis: "x", upAxis: "y" },
  },
];

export const defaultProfileId = woodProfiles[0]?.id ?? "stud-2x4";

export function getWoodProfile(id: string): WoodProfile | undefined {
  return woodProfiles.find((profile) => profile.id === id);
}

export function getWoodSpecies(id: WoodSpeciesId): WoodSpecies {
  return woodSpecies[id];
}

export function getBoardFeet(profile: WoodProfile, scale: { x: number; y: number; z: number } = { x: 1, y: 1, z: 1 }) {
  const volumeInches =
    profile.sizeInches.width * scale.x *
    profile.sizeInches.height * scale.y *
    profile.sizeInches.length * scale.z;
  const cubicInchesPerBoardFoot = 144;
  return volumeInches / cubicInchesPerBoardFoot;
}
