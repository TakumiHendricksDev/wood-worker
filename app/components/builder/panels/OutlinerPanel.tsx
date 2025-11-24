"use client";

import { Panel } from "@/app/components/builder/panels/Panel";
import { useBuilder } from "@/app/components/builder/BuilderProvider";

export function OutlinerPanel() {
  const { state, setSelection, toggleVisibility, toggleLock } = useBuilder();

  return (
    <Panel title="Outliner" className="space-y-2">
      {state.entities.length === 0 && (
        <p className="text-sm text-zinc-500">Use Shift+A or the toolbar to add lumber.</p>
      )}
      <ul className="space-y-1">
        {state.entities.map((entity) => {
          const selected = state.selection.includes(entity.id);
          return (
            <li
              key={entity.id}
              className={`flex items-center gap-2 rounded-2xl px-3 py-2 text-sm transition ${
                selected ? "bg-amber-500/20 text-amber-200" : "text-zinc-200 hover:bg-white/5"
              }`}
            >
              <button
                type="button"
                onClick={() => toggleVisibility(entity.id)}
                className={`text-xs ${entity.visible ? "text-emerald-300" : "text-zinc-500"}`}
              >
                {entity.visible ? "👁" : "🚫"}
              </button>
              <button
                type="button"
                onClick={() => toggleLock(entity.id)}
                className={`text-xs ${entity.locked ? "text-red-300" : "text-zinc-500"}`}
              >
                {entity.locked ? "🔒" : "🔓"}
              </button>
              <button
                type="button"
                className="flex-1 text-left"
                onClick={(event) => {
                  if (event.shiftKey) {
                    const nextSelection = selected
                      ? state.selection.filter((id) => id !== entity.id)
                      : [...state.selection, entity.id];
                    setSelection(nextSelection);
                  } else {
                    setSelection([entity.id]);
                  }
                }}
              >
                {entity.name}
              </button>
            </li>
          );
        })}
      </ul>
    </Panel>
  );
}
