## Wood Worker

Wood Worker is a small-project planning environment for wood enthusiasts. It runs on Next.js 16 (App Router), Tailwind CSS v4, and Three.js to let you preview common lumber profiles, swap finishes, and gut-check proportions before stepping into the shop.

### Stack highlights

- **Next.js 16 App Router** with strict TypeScript and the `@/*` path alias.
- **Tailwind v4** via `@tailwindcss/postcss` – theme tokens live in `app/globals.css`.
- **Three.js** scene rendered in a client-only `PlannerCanvas` component, loaded dynamically to keep the server payload lean.

### Project layout

```
app/
	components/
		controls/PlannerControls.tsx   # Finish + profile UI
		providers/PlannerProvider.tsx  # Client context for selections
		scene/PlannerCanvas.tsx        # Three.js renderer + OrbitControls
	lib/
		units.ts                       # Inch ↔︎ meter helpers
		wood-models.ts                 # Wood species + profile metadata
		scene-builders.ts              # Mesh factory helpers
	page.tsx                         # Server hero + planner layout
```

### Getting started

```bash
pnpm install
pnpm dev
```

Visit http://localhost:3000 to interact with the planner. The hero shell is a server component while the controls/canvas live inside a client-side provider.

### Quality gates

```bash
pnpm lint   # ESLint (core-web-vitals + TypeScript)
pnpm build  # Next.js production build with dynamic imports
```

Run lint before committing any React/TS files and ensure `pnpm build` passes so dynamic imports remain SSR-safe.

### Try it

1. Choose a lumber profile from the **Profile** dropdown (2×4 studs, 4×4 posts, boards, etc.).
2. Toggle finishes to preview stain/coat presets defined per species.
3. Rotate, pan, and zoom the canvas to evaluate proportions from multiple angles.
4. Update or extend metadata in `app/lib/wood-models.ts` to add your own cuts or species.

Document any new workflows or shop learnings in `tasks.md` so the next contributor can keep the builds consistent.
