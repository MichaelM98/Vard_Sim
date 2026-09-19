// Original low-poly mesh factories for the player and boss — simple primitives
// styled to read as OSRS-blocky, not derived from any ripped game assets.

import * as THREE from 'three';
import { COLORS, BOSS, TILE_SIZE } from '../constants.js';

export function createPlayerMesh() {
  const group = new THREE.Group();

  const body = new THREE.Mesh(
    new THREE.CylinderGeometry(0.28, 0.32, 1.1, 8),
    new THREE.MeshStandardMaterial({ color: COLORS.PLAYER })
  );
  body.position.y = 0.65;
  group.add(body);

  const head = new THREE.Mesh(
    new THREE.ConeGeometry(0.32, 0.5, 8),
    new THREE.MeshStandardMaterial({ color: COLORS.PLAYER })
  );
  head.position.y = 1.45;
  group.add(head);

  return group;
}

export function createBossMesh() {
  const size = BOSS.SIZE_TILES * TILE_SIZE;
  const group = new THREE.Group();

  const torso = new THREE.Mesh(
    new THREE.BoxGeometry(size * 0.6, size * 0.9, size * 0.5),
    new THREE.MeshStandardMaterial({ color: COLORS.BOSS })
  );
  torso.position.y = size * 0.45;
  group.add(torso);

  const head = new THREE.Mesh(
    new THREE.BoxGeometry(size * 0.3, size * 0.3, size * 0.3),
    new THREE.MeshStandardMaterial({ color: COLORS.BOSS })
  );
  head.position.y = size * 0.9 + size * 0.15;
  group.add(head);

  return group;
}

// Cosmetic room pillars, matching the real arena's look — purely visual,
// not part of tile-safety logic (safety is just "not on a danger tile").
export function createPillarMesh() {
  return new THREE.Mesh(
    new THREE.CylinderGeometry(0.45, 0.5, 3, 10),
    new THREE.MeshStandardMaterial({ color: 0x4a4a52 })
  );
}
