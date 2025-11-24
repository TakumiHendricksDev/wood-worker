# Copilot Instructions

## Big-picture architecture
- This is a stock Next.js 16 **App Router** project (`app/` directory). `app/layout.tsx` wires up the Geist font pair via `next/font` and applies global Tailwind-compatible CSS variables from `app/globals.css`.
- The home experience currently lives entirely in `app/page.tsx`. Treat it as the staging ground for the 3D woodworking experience until we split features into nested route segments or colocated components under `app/(wood-planner)/`.
- Static assets (logos, icons, future texture references) belong under `public/`; import them with `next/image` like the existing Vercel/Next logos in `app/page.tsx`.

## Styling & theming rules
- Tailwind CSS v4 is enabled through `@tailwindcss/postcss` (see `postcss.config.mjs`). All tokens are declared via CSS custom properties and the `@theme inline` block in `app/globals.css`. Update the variables first, then rely on Tailwind utility classes to consume them.
- Keep typography hooked into the `--font-geist-sans` / `--font-geist-mono` variables established in `app/layout.tsx`; avoid importing additional fonts ad hoc.
- Favor container classes + utility-first composition over bespoke CSS files. Add component-scoped styles via CSS Modules only when utilities become unwieldy.

## Client/server component expectations
- Default to **server components** in `app/`. Only add `"use client"` to files that require browser-only APIs (e.g., Three.js scenes, pointer interactions, hydration-only widgets).
- When building Three.js experiences, colocate scene setup inside a dedicated client component (e.g., `app/components/SceneCanvas.tsx`) and render it from `app/page.tsx` to keep server output lean.

## Three.js + wood models (planned)
- Store reusable geometry/material definitions under `app/lib/wood-models.ts` (or similar). Each model should export dimensions, material props, and metadata (wood species, grade, finish presets) so UI builders can consume structured data.
- Gate WebGL loaders behind dynamic imports (`const Scene = dynamic(() => import("@/components/Scene"), { ssr: false })`) to prevent Next.js from trying to render them server-side.
- Keep unit measurements consistent (inches by default). When accepting user input, normalize it before feeding into Three.js meshes.

## Tooling & workflows
- Use **pnpm** for everything: `pnpm dev`, `pnpm build`, `pnpm start`, and `pnpm lint`. The scripts live in `package.json`.
- Linting relies on `eslint.config.mjs`, which merges `eslint-config-next`'s `core-web-vitals` + `typescript` configs and relaxes ignore paths. Run `pnpm lint` before committing anything touching React/TS files.
- TypeScript is strict (`tsconfig.json`); prefer typed helpers in `app/lib/` and reuse the `@/*` path alias already configured.

## Contributor tips
- Metadata (SEO, open graph) belongs in `app/layout.tsx`'s exported `metadata`. Keep titles/descriptions in sync with new surfaces.
- When documenting workflows or domain rules, update `tasks.md` so future agents can follow the same process.
- Small assets or icons should be SVGs placed under `public/` and imported with `next/image` for automatic optimization.
- After feature work, add a short "Try it" section to `README.md` or dedicated docs so others know how to interact with the new 3D tools.
