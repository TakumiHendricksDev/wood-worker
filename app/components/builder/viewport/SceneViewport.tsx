"use client";

import { useCallback, useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { TransformControls } from "three/examples/jsm/controls/TransformControls.js";
import { useBuilderDispatch, useBuilderState } from "@/app/components/builder/BuilderProvider";
import { woodProfiles } from "@/app/lib/wood-models";
import type { BuilderEntity } from "@/app/lib/builder/types";
import { buildTimberMesh } from "@/app/lib/scene-builders";
import { inchesToMeters, metersToInches } from "@/app/lib/units";

THREE.ColorManagement.enabled = true;

export function SceneViewport() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const orbitRef = useRef<OrbitControls | null>(null);
  const transformRef = useRef<TransformControls | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const meshMap = useRef<Map<string, THREE.Mesh>>(new Map());
  const raycasterRef = useRef(new THREE.Raycaster());
  const pointerRef = useRef(new THREE.Vector2());
  const state = useBuilderState();
  const dispatch = useBuilderDispatch();
  const selectionRef = useRef<string[]>(state.selection);
  const preferencesRef = useRef(state.preferences);

  useEffect(() => {
    selectionRef.current = state.selection;
  }, [state.selection]);

  useEffect(() => {
    preferencesRef.current = state.preferences;
    if (transformRef.current) {
      transformRef.current.setTranslationSnap(inchesToMeters(state.preferences.snapIncrement));
    }
  }, [state.preferences]);

  const setSelection = useCallback(
    (ids: string[]) => dispatch({ type: "SET_SELECTION", payload: { ids } }),
    [dispatch]
  );
  const setTool = useCallback((tool: "translate" | "rotate" | "scale") => {
    dispatch({ type: "SET_TOOL", payload: { tool } });
  }, [dispatch]);
  const deleteEntities = useCallback((ids: string[]) => {
    dispatch({ type: "DELETE_ENTITY", payload: { ids } });
  }, [dispatch]);
  const addEntity = useCallback((profileId: string) => {
    dispatch({ type: "ADD_ENTITY", payload: { profileId } });
  }, [dispatch]);
  const setTransformAction = useCallback((id: string, transform: BuilderEntity["transform"]) => {
    dispatch({ type: "SET_TRANSFORM", payload: { id, transform } });
  }, [dispatch]);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.shadowMap.enabled = true;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#232323");

    const camera = new THREE.PerspectiveCamera(50, container.clientWidth / container.clientHeight, 0.1, 200);
    camera.position.set(3, 2, 4);

    const orbit = new OrbitControls(camera, renderer.domElement);
    orbit.enableDamping = true;
    orbit.maxPolarAngle = Math.PI / 2.1;
    orbit.target.set(0, 0.5, 0);

    const transform = new TransformControls(camera, renderer.domElement);
    transform.addEventListener("dragging-changed", (event) => {
      orbit.enabled = !event.value;
    });
    transform.addEventListener("objectChange", () => {
      const target = transform.object as THREE.Mesh | null;
      if (!target) return;
      const entityId = target.userData.entityId as string | undefined;
      if (!entityId) return;
      const nextTransform = {
        position: {
          x: Number(metersToInches(target.position.x).toFixed(3)),
          y: Number(metersToInches(target.position.y).toFixed(3)),
          z: Number(metersToInches(target.position.z).toFixed(3)),
        },
        rotation: {
          x: Number(THREE.MathUtils.radToDeg(target.rotation.x).toFixed(2)),
          y: Number(THREE.MathUtils.radToDeg(target.rotation.y).toFixed(2)),
          z: Number(THREE.MathUtils.radToDeg(target.rotation.z).toFixed(2)),
        },
        scale: {
          x: Number(target.scale.x.toFixed(3)),
          y: Number(target.scale.y.toFixed(3)),
          z: Number(target.scale.z.toFixed(3)),
        },
      } as BuilderEntity["transform"];
      setTransformAction(entityId, nextTransform);
    });
    scene.add(transform as unknown as THREE.Object3D);

    const ambient = new THREE.AmbientLight(0xffffff, 0.5);
    const key = new THREE.DirectionalLight(0xffffff, 0.8);
    key.position.set(5, 8, 4);
    key.castShadow = true;

    const fill = new THREE.DirectionalLight(0xffffff, 0.3);
    fill.position.set(-4, 4, -6);

    const grid = new THREE.GridHelper(20, 20, 0x4b5563, 0x27272a);
    (grid.material as THREE.Material).opacity = 0.4;
    (grid.material as THREE.Material).transparent = true;

    const axes = new THREE.AxesHelper(2);

    scene.add(ambient, key, fill, grid, axes);

    container.appendChild(renderer.domElement);

    rendererRef.current = renderer;
    cameraRef.current = camera;
    orbitRef.current = orbit;
    transformRef.current = transform;
    sceneRef.current = scene;

    const handleResize = () => {
      if (!containerRef.current || !cameraRef.current || !rendererRef.current) return;
      const { clientWidth, clientHeight } = containerRef.current;
      cameraRef.current.aspect = clientWidth / clientHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(clientWidth, clientHeight);
    };

    window.addEventListener("resize", handleResize);

    let frame: number;
    const renderLoop = () => {
      orbit.update();
      renderer.render(scene, camera);
      frame = requestAnimationFrame(renderLoop);
    };
    renderLoop();

    const handlePointerDown = (event: MouseEvent) => {
      if (!rendererRef.current || !cameraRef.current) return;
      const bounds = rendererRef.current.domElement.getBoundingClientRect();
      pointerRef.current.x = ((event.clientX - bounds.left) / bounds.width) * 2 - 1;
      pointerRef.current.y = -((event.clientY - bounds.top) / bounds.height) * 2 + 1;
      raycasterRef.current.setFromCamera(pointerRef.current, cameraRef.current);
      const intersects = raycasterRef.current.intersectObjects(Array.from(meshMap.current.values()));
      if (intersects.length > 0) {
        const mesh = intersects[0].object as THREE.Mesh;
        const entityId = mesh.userData.entityId as string;
        if (mesh.userData.locked) {
          return;
        }
        if (event.shiftKey) {
          const current = selectionRef.current;
          const next = current.includes(entityId)
            ? current.filter((id) => id !== entityId)
            : [...current, entityId];
          setSelection(next);
        } else {
          setSelection([entityId]);
        }
      } else if (!event.shiftKey) {
        setSelection([]);
      }
    };

    renderer.domElement.addEventListener("pointerdown", handlePointerDown);

    const handleKey = (event: KeyboardEvent) => {
      if (event.target && (event.target as HTMLElement).tagName === "INPUT") return;
      switch (event.key.toLowerCase()) {
        case "g":
          setTool("translate");
          break;
        case "r":
          setTool("rotate");
          break;
        case "s":
          setTool("scale");
          break;
        case "x":
          transform.setSpace("local");
          transform.showX = true;
          transform.showY = false;
          transform.showZ = false;
          break;
        case "y":
          transform.showX = false;
          transform.showY = true;
          transform.showZ = false;
          break;
        case "z":
          transform.showX = false;
          transform.showY = false;
          transform.showZ = true;
          break;
        case "delete":
        case "backspace": {
          const selectedIds = selectionRef.current;
          if (selectedIds.length) {
            deleteEntities(selectedIds);
          }
          break;
        }
        default:
          if (event.key === "A" && event.shiftKey) {
            const firstProfile = woodProfiles[0];
            if (firstProfile) addEntity(firstProfile.id);
          }
      }
    };

    window.addEventListener("keydown", handleKey);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("keydown", handleKey);
      renderer.domElement.removeEventListener("pointerdown", handlePointerDown);
      cancelAnimationFrame(frame);
      transform.dispose();
      orbit.dispose();
      renderer.dispose();
      container.removeChild(renderer.domElement);
    };
  }, [addEntity, deleteEntities, setSelection, setTool, setTransformAction]);

  useEffect(() => {
    if (!sceneRef.current) return;
    const scene = sceneRef.current;

    // Sync entities with meshes
    const seenIds = new Set<string>();
    state.entities.forEach((entity) => {
      const profile = woodProfiles.find((p) => p.id === entity.profileId);
      if (!profile) return;
      let mesh = meshMap.current.get(entity.id);
      if (!mesh) {
        mesh = buildTimberMesh(profile);
        mesh.userData.entityId = entity.id;
        meshMap.current.set(entity.id, mesh);
        scene.add(mesh);
      }
  mesh.visible = entity.visible;
  mesh.userData.locked = entity.locked;
      mesh.position.set(
        inchesToMeters(entity.transform.position.x),
        inchesToMeters(entity.transform.position.y),
        inchesToMeters(entity.transform.position.z)
      );
      mesh.rotation.set(
        THREE.MathUtils.degToRad(entity.transform.rotation.x),
        THREE.MathUtils.degToRad(entity.transform.rotation.y),
        THREE.MathUtils.degToRad(entity.transform.rotation.z)
      );
      mesh.scale.set(
        entity.transform.scale.x,
        entity.transform.scale.y,
        entity.transform.scale.z
      );
      mesh.layers.enable(0);
      seenIds.add(entity.id);
    });

    meshMap.current.forEach((mesh, id) => {
      if (!seenIds.has(id)) {
        scene.remove(mesh);
        mesh.geometry.dispose();
        if (Array.isArray(mesh.material)) {
          mesh.material.forEach((m) => m.dispose());
        } else {
          mesh.material.dispose();
        }
        meshMap.current.delete(id);
      }
    });
  }, [state.entities]);

  useEffect(() => {
    const transform = transformRef.current;
    if (!transform) return;
    transform.showX = true;
    transform.showY = true;
    transform.showZ = true;
    transform.setMode(state.tool);
    const firstSelected = state.selection[0];
    if (!firstSelected) {
      transform.detach();
      return;
    }
    const entity = state.entities.find((item) => item.id === firstSelected);
    if (entity?.locked) {
      transform.detach();
      return;
    }
    const mesh = meshMap.current.get(firstSelected);
    if (mesh) {
      transform.attach(mesh);
    }
  }, [state.entities, state.selection, state.tool]);

  return (
    <div
      ref={containerRef}
      className="h-[520px] w-full rounded-[var(--radius-card)] border border-[color:var(--panel-border)] bg-[color:var(--panel-bg)] shadow-[inset_0_0_40px_rgba(0,0,0,0.5)]"
    />
  );
}
