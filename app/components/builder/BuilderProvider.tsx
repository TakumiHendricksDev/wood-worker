"use client";

import { createContext, useContext, useMemo, useRef, useState, useCallback } from "react";
import {
  type BuilderEntity,
  type BuilderStateSnapshot,
  type SnapIncrement,
  type ToolMode,
  EMPTY_STATE,
  DEFAULT_TRANSFORM,
} from "@/app/lib/builder/types";
import { readPersistedState, usePersistentState } from "@/app/lib/builder/storage";

export type BuilderAction =
  | { type: "ADD_ENTITY"; payload: { profileId: string; name?: string } }
  | { type: "UPDATE_ENTITY"; payload: { id: string; entity: Partial<BuilderEntity> } }
  | { type: "SET_TRANSFORM"; payload: { id: string; transform: BuilderEntity["transform"] } }
  | { type: "DELETE_ENTITY"; payload: { ids: string[] } }
  | { type: "SET_SELECTION"; payload: { ids: string[] } }
  | { type: "SET_TOOL"; payload: { tool: ToolMode } }
  | { type: "SET_SNAP"; payload: { snap: SnapIncrement } }
  | { type: "TOGGLE_VISIBILITY"; payload: { id: string } }
  | { type: "TOGGLE_LOCK"; payload: { id: string } }
  | { type: "HYDRATE"; payload: BuilderStateSnapshot }
  | { type: "UNDO" }
  | { type: "REDO" };

function builderReducer(state: BuilderStateSnapshot, action: BuilderAction): BuilderStateSnapshot {
  switch (action.type) {
    case "HYDRATE":
      return action.payload;
    case "ADD_ENTITY": {
      const id = crypto.randomUUID();
      const name = action.payload.name ?? `Lumber ${state.entities.length + 1}`;
      const newEntity: BuilderEntity = {
        id,
        name,
        profileId: action.payload.profileId,
        transform: DEFAULT_TRANSFORM,
        locked: false,
        visible: true,
      };
      return {
        ...state,
        entities: [...state.entities, newEntity],
        selection: [id],
      };
    }
    case "UPDATE_ENTITY":
      return {
        ...state,
        entities: state.entities.map((entity) =>
          entity.id === action.payload.id ? { ...entity, ...action.payload.entity } : entity
        ),
      };
    case "SET_TRANSFORM":
      return {
        ...state,
        entities: state.entities.map((entity) =>
          entity.id === action.payload.id ? { ...entity, transform: action.payload.transform } : entity
        ),
      };
    case "DELETE_ENTITY":
      return {
        ...state,
        entities: state.entities.filter((entity) => !action.payload.ids.includes(entity.id)),
        selection: state.selection.filter((id) => !action.payload.ids.includes(id)),
      };
    case "SET_SELECTION":
      return { ...state, selection: action.payload.ids };
    case "SET_TOOL":
      return { ...state, tool: action.payload.tool };
    case "SET_SNAP":
      return {
        ...state,
        preferences: { ...state.preferences, snapIncrement: action.payload.snap },
      };
    case "TOGGLE_VISIBILITY":
      return {
        ...state,
        entities: state.entities.map((entity) =>
          entity.id === action.payload.id ? { ...entity, visible: !entity.visible } : entity
        ),
      };
    case "TOGGLE_LOCK":
      return {
        ...state,
        entities: state.entities.map((entity) =>
          entity.id === action.payload.id ? { ...entity, locked: !entity.locked } : entity
        ),
      };
    default:
      return state;
  }
}

const BuilderContext = createContext<{
  state: BuilderStateSnapshot;
  dispatch: React.Dispatch<BuilderAction>;
} | null>(null);

export function BuilderProvider({ children }: { children: React.ReactNode }) {
  const persisted = typeof window !== "undefined" ? readPersistedState() : null;
  const [state, setState] = useState<BuilderStateSnapshot>(persisted ?? EMPTY_STATE);
  const pastRef = useRef<BuilderStateSnapshot[]>([]);
  const futureRef = useRef<BuilderStateSnapshot[]>([]);

  const dispatch = useCallback((action: BuilderAction) => {
    setState((current) => {
      if (action.type === "UNDO") {
        const previous = pastRef.current.pop();
        if (!previous) return current;
        futureRef.current = [...futureRef.current, current];
        return previous;
      }

      if (action.type === "REDO") {
        const next = futureRef.current.pop();
        if (!next) return current;
        pastRef.current = [...pastRef.current, current];
        return next;
      }

      const nextState = builderReducer(current, action);
      if (nextState === current) return current;
      pastRef.current = [...pastRef.current.slice(-19), current];
      futureRef.current = [];
      return nextState;
    });
  }, []);

  usePersistentState(state);

  const value = useMemo(() => ({ state, dispatch }), [state, dispatch]);

  return <BuilderContext.Provider value={value}>{children}</BuilderContext.Provider>;
}

export function useBuilderContext() {
  const context = useContext(BuilderContext);
  if (!context) throw new Error("useBuilderContext must be used within BuilderProvider");
  return context;
}

export function useBuilderState() {
  return useBuilderContext().state;
}

export function useBuilderDispatch() {
  return useBuilderContext().dispatch;
}

export function useBuilder() {
  const { state, dispatch } = useBuilderContext();
  return {
    state,
    addEntity: (profileId: string, name?: string) =>
      dispatch({ type: "ADD_ENTITY", payload: { profileId, name } }),
    updateEntity: (id: string, entity: Partial<BuilderEntity>) =>
      dispatch({ type: "UPDATE_ENTITY", payload: { id, entity } }),
    setTransform: (id: string, transform: BuilderEntity["transform"]) =>
      dispatch({ type: "SET_TRANSFORM", payload: { id, transform } }),
    deleteEntities: (ids: string[]) => dispatch({ type: "DELETE_ENTITY", payload: { ids } }),
    setSelection: (ids: string[]) => dispatch({ type: "SET_SELECTION", payload: { ids } }),
    setTool: (tool: ToolMode) => dispatch({ type: "SET_TOOL", payload: { tool } }),
    setSnap: (snap: SnapIncrement) => dispatch({ type: "SET_SNAP", payload: { snap } }),
    toggleVisibility: (id: string) => dispatch({ type: "TOGGLE_VISIBILITY", payload: { id } }),
    toggleLock: (id: string) => dispatch({ type: "TOGGLE_LOCK", payload: { id } }),
    undo: () => dispatch({ type: "UNDO" }),
    redo: () => dispatch({ type: "REDO" }),
  };
}
