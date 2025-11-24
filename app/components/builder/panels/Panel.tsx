"use client";

import clsx from "clsx";

export function Panel({
  title,
  children,
  className,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={clsx(
        "rounded-[var(--radius-card)] border border-[color:var(--panel-border)] bg-[color:var(--panel-bg)] p-5 text-[color:var(--text-primary)] shadow-[var(--panel-shadow)] backdrop-blur-xl",
        className
      )}
    >
      <header className="mb-4 flex items-center justify-between border-b border-[color:var(--panel-border)]/70 pb-3 text-xs uppercase tracking-[0.35em] text-[color:var(--text-muted)]">
        <span>{title}</span>
      </header>
      {children}
    </section>
  );
}
