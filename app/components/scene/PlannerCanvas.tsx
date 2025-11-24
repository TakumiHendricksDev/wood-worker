"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { usePlanner } from "@/app/components/providers/PlannerProvider";
import { buildTimberMesh } from "@/app/lib/scene-builders";

export function PlannerCanvas() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const activeMeshRef = useRef<THREE.Mesh | null>(null);
  const { profile, finish } = usePlanner();

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.shadowMap.enabled = true;
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(container.clientWidth, container.clientHeight);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#f8f5f0");

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(3.5, 2.5, 5);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.target.set(0, 0.75, 0);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    const keyLight = new THREE.DirectionalLight(0xffffff, 1);
    keyLight.position.set(5, 6, 3);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;

    const backLight = new THREE.DirectionalLight(0xffffff, 0.3);
    backLight.position.set(-4, 3, -4);

    const floor = new THREE.Mesh(
      new THREE.CircleGeometry(10, 64),
      new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 1 })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;

    scene.add(ambientLight, keyLight, backLight, floor);

    container.appendChild(renderer.domElement);

    rendererRef.current = renderer;
    cameraRef.current = camera;
    sceneRef.current = scene;
    controlsRef.current = controls;

    let animationFrame: number;
    const renderLoop = () => {
      controls.update();
      renderer.render(scene, camera);
      animationFrame = window.requestAnimationFrame(renderLoop);
    };
    renderLoop();

    const handleResize = () => {
      if (!containerRef.current) return;
      const { clientWidth, clientHeight } = containerRef.current;
      renderer.setSize(clientWidth, clientHeight);
      camera.aspect = clientWidth / clientHeight;
      camera.updateProjectionMatrix();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", handleResize);
      controls.dispose();
      renderer.dispose();
      scene.clear();
      container.removeChild(renderer.domElement);
    };
  }, []);

  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    if (activeMeshRef.current) {
      scene.remove(activeMeshRef.current);
      activeMeshRef.current.geometry.dispose();
      if (Array.isArray(activeMeshRef.current.material)) {
        activeMeshRef.current.material.forEach((material) => material.dispose());
      } else {
        activeMeshRef.current.material.dispose();
      }
    }

    const timber = buildTimberMesh(profile, { finish });
    timber.position.y = profile.sizeInches.height * 0.0254 * 0.5 + 0.1;
    scene.add(timber);
    activeMeshRef.current = timber;
  }, [profile, finish]);

  return (
    <div
      ref={containerRef}
      className="h-[480px] w-full rounded-3xl border border-white/10 bg-gradient-to-br from-amber-50 via-white to-slate-100 shadow-inner shadow-white/30 dark:border-white/5 dark:from-zinc-900 dark:via-zinc-900 dark:to-black"
    />
  );
}
