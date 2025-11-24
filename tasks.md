## Wood Worker Builder Guide (Blender-style)

Follow these tasks sequentially to evolve the app into a Blender-inspired woodworking builder with draggable/rotatable lumber, an inspector that edits transforms + metadata, and a GUI reminiscent of Blender’s panels.

### 1. Environment & workflow setup
1. `pnpm install` to sync dependencies (pnpm only; no npm/yarn mixing).
2. Use package scripts for every workflow:
	- `pnpm dev` – run the dev server.
	- `pnpm lint` – enforce `eslint.config.mjs`.
	- `pnpm build` – confirm dynamic imports + client bundles compile.
3. In VS Code, enable the workspace TypeScript version so `@/*` paths resolve.

### 2. Directory scaffolding (builder focus)
1. Keep top-level server composition in `app/page.tsx`; all Blender-like UI lives in new client components under `app/(wood-builder)/` once multi-route flows are needed.
2. Create `app/components/builder/` for client widgets:
	- `SceneViewport` – Three.js canvas with gizmos.
	- `OutlinerPanel` – list of placed parts (think Blender outliner).
	- `InspectorPanel` – transform + wood metadata editors.
3. Store reusable logic under `app/lib/builder/`:
	- `wood-models.ts` – geometry + material presets.
	- `units.ts` – inch ↔︎ meter helpers.
	- `scene-builders.ts` – mesh factories + gizmo helpers.
4. Keep assets/icons under `public/gui/` to mirror Blender glyphs (cursor, rotate, scale icons).

### 3. State & selection architecture
1. Build a `BuilderProvider` (client context) that tracks:
	- `entities`: array of placed lumber objects `{ id, profileId, transform }`.
	- `selection`: currently active entity ids.
	- `tool`: active gizmo mode (`translate | rotate | scale`).
	- Undo stack for transform changes (lightweight array of patches).
2. Expose hooks: `useBuilder()`, `useSelection()`, `useGizmo()`.
3. Persist builder state to `localStorage` (serialize on debounced interval) so reloads keep workspace arrangements.

### 4. SceneViewport (Three.js with gizmos)
1. Base renderer: WebGLRenderer + physically based lighting (sun + fill + ambient) similar to Blender’s default.
2. Add grid + floor helpers sized in inches (use `GridHelper` with custom labels showing inch increments every foot).
3. Integrate transform controls (Three.js `TransformControls`) tied to `selection` and `tool` from context.
4. Enable drag-select / click-select:
	- Raycast on pointer down to set `selection`.
	- Support multi-select with Shift.
5. Keep camera controls: OrbitControls with limited vertical angles to avoid flipping under floor.
6. Mirror Blender viewport overlays: axis widget in corner, toggleable wireframe view.

### 5. InspectorPanel (Blender-like sidebar)
1. Layout columns similar to Blender’s Properties panel: sections for Transform, Lumber, Finish.
2. Transform section must edit `position`, `rotation`, `scale` numerically (fields accept inches/degrees; convert to meters/radians internally).
3. Lumber section:
	- Dropdown for `profileId` referencing metadata.
	- Display raw size + calculated board feet.
4. Finish section lists species presets; selecting updates mesh materials live.
5. Include “Apply Transform” + “Reset Transform” buttons per entity.

### 6. OutlinerPanel & scene ops
1. Render tree of entities grouped by species (or custom folders later).
2. Provide icons for visibility (eye) and lock (cursor) toggles, mirroring Blender.
3. Support rename inline; names persist within entity objects.
4. Context menu actions: duplicate, delete, convert to component (future feature placeholder).

### 7. Wood model + gizmo helpers
1. Expand `woodProfiles` to include bounding box + default orientation (so rotation handles align with grain).
2. Add `woodSpecies` metadata for density, modulus, and finish presets (already present; ensure inspector reads the same source of truth).
3. Implement `buildTimberMesh(profile, overrides)` in `scene-builders.ts` returning both mesh + bounding box helpers for collision checks.
4. Provide gizmo-friendly helpers:
	- `snapToInches(value, increment = 0.25)`.
	- `limitRotation(axis, minDeg, maxDeg)` for joint planning.

### 8. Interaction parity with Blender
1. Keyboard shortcuts (match Blender where possible):
	- `G` translate, `R` rotate, `S` scale.
	- `X/Y/Z` constrain axes after pressing a tool key.
	- `Shift+A` add new lumber profile via quick menu.
	- `Delete` remove selection.
2. Status bar shows current tool + axis + snap increment.
3. Snap toggle in header: 1/4", 1/2", 1" increments.

### 9. GUI theming
1. Tailwind + CSS variables should mimic Blender’s dark neutral palette (#2e2e2e background, #3b3b3b panels, accent orange for active elements).
2. Build a reusable `Panel` component for inspector/outliner with shared shadows/radii.
3. Use Geist font for body text but tighten letter spacing to emulate Blender’s UI density.
4. Provide high-contrast focus rings; ensure keyboard-only interactions mirror Blender’s highlight color.

### 10. Persistence & export
1. Implement `app/api/export/route.ts` (server action) that accepts serialized scene data and returns downloadable JSON or DXF stub.
2. Add “Export Cut List” CTA that aggregates entity volumes, board feet, and counts per profile.
3. Persist user preferences (snap increment, theme, tool) in localStorage alongside entities.

### 11. Quality gates
1. `pnpm lint` – must pass before merging.
2. `pnpm build` – ensure App Router + dynamic imports (SceneViewport) compile without SSR.
3. Manual smoke test checklist:
	- Add ≥3 profiles, move/rotate them, confirm inspector updates.
	- Verify keyboard shortcuts match Blender behavior.
	- Reload page and confirm scene/prefs restore.
	- Export cut list returns expected JSON payload.

Document discoveries or UX constraints back in this file so the next AI agent maintains Blender-level parity.
