// Attack Telegraphs plugin: colors the ground quadrant threatened by the
// swinging axes — orange while telegraphing, red once lethal. Driven every
// tick by main.js via updateMechanicState(); purely visual, no game logic.

import * as THREE from 'three';
import { GRID_COLS, GRID_ROWS, TILE_SIZE } from '../constants.js';
import { tileToWorld } from '../utils/grid.js';

function quadrantBounds(index, center) {
  const { x: cx, y: cy } = center;
  switch (index) {
    case 0:
      return { minX: cx, maxX: GRID_COLS - 1, minY: 0, maxY: cy - 1 };
    case 1:
      return { minX: cx, maxX: GRID_COLS - 1, minY: cy, maxY: GRID_ROWS - 1 };
    case 2:
      return { minX: 0, maxX: cx - 1, minY: cy, maxY: GRID_ROWS - 1 };
    default:
      return { minX: 0, maxX: cx - 1, minY: 0, maxY: cy - 1 };
  }
}

function quadrantWorldRect(index, center) {
  const { minX, maxX, minY, maxY } = quadrantBounds(index, center);
  if (minX > maxX || minY > maxY) return null;

  const half = TILE_SIZE / 2;
  const topLeft = tileToWorld({ x: minX, y: minY });
  const bottomRight = tileToWorld({ x: maxX, y: maxY });
  const x0 = topLeft.x - half;
  const x1 = bottomRight.x + half;
  const z0 = topLeft.z - half;
  const z1 = bottomRight.z + half;

  return { x: (x0 + x1) / 2, z: (z0 + z1) / 2, width: x1 - x0, depth: z1 - z0 };
}

export function createAttackTelegraphsPlugin() {
  let group = null;
  let settings = null;
  let latest = { warningQuadrant: null, dangerQuadrant: null, center: null };

  function rebuild() {
    if (!group || !settings) return;
    group.clear();
    if (!settings.enabled) return;

    const quadrant = latest.dangerQuadrant ?? latest.warningQuadrant;
    if (quadrant === null || !latest.center) return;

    const rect = quadrantWorldRect(quadrant, latest.center);
    if (!rect) return;

    const color = latest.dangerQuadrant !== null ? settings.activeColor : settings.warningColor;
    const material = new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity: settings.opacity,
      side: THREE.DoubleSide,
    });
    const plane = new THREE.Mesh(new THREE.PlaneGeometry(rect.width, rect.depth), material);
    plane.rotation.x = -Math.PI / 2;
    plane.position.set(rect.x, 0.015, rect.z);
    group.add(plane);
  }

  return {
    id: 'attackTelegraphs',
    name: 'Attack Telegraphs',
    defaultSettings: { enabled: true, warningColor: '#e0a000', activeColor: '#d13f3f', opacity: 0.35 },
    schema: [
      { key: 'enabled', type: 'boolean', label: 'Enabled' },
      { key: 'warningColor', type: 'color', label: 'Warning Color' },
      { key: 'activeColor', type: 'color', label: 'Active Color' },
      { key: 'opacity', type: 'range', label: 'Opacity', min: 0.1, max: 0.8, step: 0.05 },
    ],
    init(sceneManager) {
      group = new THREE.Group();
      sceneManager.scene.add(group);
    },
    onSettingsChange(newSettings) {
      settings = newSettings;
      rebuild();
    },
    updateMechanicState(mechanicResult, center) {
      latest = {
        warningQuadrant: mechanicResult.warningQuadrant,
        dangerQuadrant: mechanicResult.dangerQuadrant,
        center,
      };
      rebuild();
    },
  };
}
