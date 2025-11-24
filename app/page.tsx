import { BuilderWorkspace } from "@/app/components/builder/BuilderWorkspace";

export default function Home() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_20%_20%,#1c2842,#050710)] px-6 py-16 text-[color:var(--text-primary)] sm:px-12 lg:px-20">
      <div className="mx-auto flex max-w-6xl flex-col gap-12">
        <header className="flex flex-col gap-7 rounded-[var(--radius-card)] border border-[color:var(--panel-border)] bg-[color:var(--panel-bg)] px-8 py-10 shadow-[var(--panel-shadow)] backdrop-blur-xl">
          <p className="text-sm uppercase tracking-[0.35em] text-[color:var(--accent)] opacity-90">Wood Worker Builder</p>
          <h1 className="text-4xl font-semibold leading-tight text-white md:text-5xl">
            A Blender-like bench for layout, joinery, & cut-list planning.
          </h1>
          <p className="max-w-3xl text-lg text-[color:var(--text-muted)]">
            Rotate, snap, and iterate on lumber arrangements using the same orbit, transform, and inspector
            paradigms you rely on in Blender. The viewport, panels, and HUD stay in sync so your small-shop
            experiments feel tactile—even before you mill the first board.
          </p>
          <dl className="grid gap-4 text-sm text-[color:var(--text-muted)] sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <dt className="text-xs uppercase tracking-[0.35em] text-[color:var(--accent)]">Snap Flow</dt>
              <dd className="text-base text-white">Set 1/4”, 1/2”, or 1” increments on the fly.</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-[0.35em] text-[color:var(--accent)]">Shortcuts</dt>
              <dd className="text-base text-white">G/R/S tools, Shift+A to add, Delete to clear.</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-[0.35em] text-[color:var(--accent)]">Cut Lists</dt>
              <dd className="text-base text-white">Export board-feet JSON tuned for your stock.</dd>
            </div>
          </dl>
        </header>

        <BuilderWorkspace />
      </div>
    </main>
  );
}
