// Attack Telegraphs plugin: colors individual ground tiles threatened by
// traveling hazards (currently the swinging axes) — orange for the tile a
// hazard will step onto next, red for the tile it occupies right now.
// Driven every tick by main.js via updateDangerTiles(); purely visual.

import * as THREE from 'three';
import { TILE_SIZE } from '../constants.js';
import { tileToWorld } from '../utils/grid.js';

export function createAttackTelegraphsPlugin() {
  let group = null;
  let settings = null;
  let dangerTiles = [];
  let warningTiles = [];

  function addTileQuad(tile, material) {
    const { x, z } = tileToWorld(tile);
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(TILE_SIZE * 0.9, TILE_SIZE * 0.9), material);
    mesh.rotation.x = -Math.PI / 2;
    mesh.position.set(x, 0.015, z);
    group.add(mesh);
  }

  function rebuild() {
    if (!group || !settings) return;
    group.clear();
    if (!settings.enabled) return;

    const warningMat = new THREE.MeshBasicMaterial({
      color: settings.warningColor,
      transparent: true,
      opacity: settings.opacity,
      side: THREE.DoubleSide,
    });
    const dangerMat = new THREE.MeshBasicMaterial({
      color: settings.activeColor,
      transparent: true,
      opacity: settings.opacity,
      side: THREE.DoubleSide,
    });

    for (const tile of warningTiles) addTileQuad(tile, warningMat);
    for (const tile of dangerTiles) addTileQuad(tile, dangerMat);
  }

  return {
    id: 'attackTelegraphs',
    name: 'Attack Telegraphs',
    defaultSettings: { enabled: true, warningColor: '#e0a000', activeColor: '#d13f3f', opacity: 0.55 },
    schema: [
      { key: 'enabled', type: 'boolean', label: 'Enabled' },
      { key: 'warningColor', type: 'color', label: 'Warning Color' },
      { key: 'activeColor', type: 'color', label: 'Active Color' },
      { key: 'opacity', type: 'range', label: 'Opacity', min: 0.1, max: 0.9, step: 0.05 },
    ],
    init(sceneManager) {
      group = new THREE.Group();
      sceneManager.scene.add(group);
    },
    onSettingsChange(newSettings) {
      settings = newSettings;
      rebuild();
    },
    updateDangerTiles(newDangerTiles, newWarningTiles) {
      dangerTiles = newDangerTiles;
      warningTiles = newWarningTiles;
      rebuild();
    },
  };
}
