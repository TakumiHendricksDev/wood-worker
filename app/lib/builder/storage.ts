"use client";

import { useEffect, useRef } from "react";
import type { BuilderStateSnapshot } from "./types";

const STORAGE_KEY = "wood-worker:builder-state";

export function readPersistedState(): BuilderStateSnapshot | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as BuilderStateSnapshot;
  } catch (error) {
    console.warn("Failed to parse builder state", error);
    return null;
  }
}

export function usePersistentState(state: BuilderStateSnapshot) {
  const frame = useRef<number | null>(null);

  useEffect(() => {
    frame.current = window.requestAnimationFrame(() => {
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch (error) {
        console.warn("Failed to persist builder state", error);
      }
    });

    return () => {
      if (frame.current) window.cancelAnimationFrame(frame.current);
    };
  }, [state]);
}
