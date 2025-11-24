export type Vector3 = {
  x: number;
  y: number;
  z: number;
};

export type Euler = Vector3; // degrees for UI, converted to radians for Three.

export type Transform = {
  position: Vector3; // inches
  rotation: Euler; // degrees
  scale: Vector3; // multiplier (1 = original size)
};

export type ToolMode = "translate" | "rotate" | "scale";

export type SnapIncrement = 0.25 | 0.5 | 1;

export type BuilderEntity = {
  id: string;
  name: string;
  profileId: string;
  transform: Transform;
  locked: boolean;
  visible: boolean;
};

export type BuilderPreferences = {
  snapIncrement: SnapIncrement;
  theme: "dark" | "light";
};

export type BuilderStateSnapshot = {
  entities: BuilderEntity[];
  selection: string[];
  tool: ToolMode;
  preferences: BuilderPreferences;
};

export const DEFAULT_TRANSFORM: Transform = {
  position: { x: 0, y: 0, z: 0 },
  rotation: { x: 0, y: 0, z: 0 },
  scale: { x: 1, y: 1, z: 1 },
};

export const DEFAULT_PREFERENCES: BuilderPreferences = {
  snapIncrement: 0.25,
  theme: "dark",
};

export const EMPTY_STATE: BuilderStateSnapshot = {
  entities: [],
  selection: [],
  tool: "translate",
  preferences: DEFAULT_PREFERENCES,
};
