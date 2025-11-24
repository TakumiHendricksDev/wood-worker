"use client";

import * as THREE from "three";
import type { FinishPreset, WoodProfile } from "./wood-models";
import { dimensionsToMeters } from "./units";

THREE.ColorManagement.enabled = true;

export function buildTimberMesh(
  profile: WoodProfile,
  override?: Partial<THREE.MeshStandardMaterialParameters> & { finish?: FinishPreset }
): THREE.Mesh {
  const sizeMeters = dimensionsToMeters(profile.sizeInches);
  const geometry = new THREE.BoxGeometry(
    sizeMeters.width,
    sizeMeters.height,
    sizeMeters.length
  );

  const finishOverride = override?.finish;
  const material = new THREE.MeshStandardMaterial({
    color: finishOverride?.color ?? override?.color ?? profile.material.color,
    roughness:
      finishOverride?.roughness ?? override?.roughness ?? profile.material.roughness ?? 0.8,
    metalness:
      finishOverride?.metalness ?? override?.metalness ?? profile.material.metalness ?? 0.05,
  });

  const mesh = new THREE.Mesh(geometry, material);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  mesh.name = profile.label;
  mesh.userData.profileId = profile.id;

  return mesh;
}
