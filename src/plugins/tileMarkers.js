// Tile Markers plugin: draws configurable-color/width tile outlines on the
// ground. Mechanics feed it the tiles to mark (danger zones, safe spots, etc.)
// via setMarkedTiles(); this plugin only owns how they're drawn.

import * as THREE from 'three';
import { TILE_SIZE } from '../constants.js';
import { tileToWorld } from '../utils/grid.js';

export function createTileMarkersPlugin() {
  let group = null;
  let markedTiles = [];

  function rebuild(settings) {
    if (!group) return;
    group.clear();
    if (!settings.enabled) return;

    const material = new THREE.MeshBasicMaterial({ color: settings.color });
    const half = TILE_SIZE / 2;
    const width = settings.width;

    for (const tile of markedTiles) {
      const { x, z } = tileToWorld(tile);
      const edges = [
        { w: TILE_SIZE, h: width, ox: 0, oz: -half + width / 2 },
        { w: TILE_SIZE, h: width, ox: 0, oz: half - width / 2 },
        { w: width, h: TILE_SIZE, ox: -half + width / 2, oz: 0 },
        { w: width, h: TILE_SIZE, ox: half - width / 2, oz: 0 },
      ];
      for (const edge of edges) {
        const mesh = new THREE.Mesh(new THREE.PlaneGeometry(edge.w, edge.h), material);
        mesh.rotation.x = -Math.PI / 2;
        mesh.position.set(x + edge.ox, 0.02, z + edge.oz);
        group.add(mesh);
      }
    }
  }

  return {
    id: 'tileMarkers',
    name: 'Tile Markers',
    defaultSettings: { enabled: true, color: '#3fd1ff', width: 0.08 },
    schema: [
      { key: 'enabled', type: 'boolean', label: 'Enabled' },
      { key: 'color', type: 'color', label: 'Color' },
      { key: 'width', type: 'range', label: 'Width', min: 0.02, max: 0.3, step: 0.01 },
    ],
    init(sceneManager) {
      group = new THREE.Group();
      sceneManager.scene.add(group);
    },
    setMarkedTiles(tiles, settings) {
      markedTiles = tiles;
      rebuild(settings);
    },
    onSettingsChange(settings) {
      rebuild(settings);
    },
  };
}
