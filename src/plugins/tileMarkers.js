// Tile Markers plugin: OSRS RuneLite-style manual tile marking. Right-click a
// tile to place a marker, right-click it again to remove it. Markers persist
// across reloads and are drawn using the plugin's configured color/width.

import * as THREE from 'three';
import { TILE_SIZE } from '../constants.js';
import { tileToWorld } from '../utils/grid.js';

const STORAGE_KEY = 'vardorvis-sim.tile-markers';
const keyOf = (tile) => `${tile.x},${tile.y}`;

function loadMarkers() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveMarkers(tiles) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tiles));
  } catch {
    // ignore storage errors (private browsing, quota, etc.)
  }
}

export function createTileMarkersPlugin() {
  let group = null;
  let settings = null;
  const markers = new Map(loadMarkers().map((tile) => [keyOf(tile), tile]));

  function rebuild() {
    if (!group || !settings) return;
    group.clear();
    if (!settings.enabled) return;

    const material = new THREE.MeshBasicMaterial({ color: settings.color });
    const half = TILE_SIZE / 2;
    const width = settings.width;
    const edgeSpecs = [
      { w: TILE_SIZE, h: width, ox: 0, oz: -half + width / 2 },
      { w: TILE_SIZE, h: width, ox: 0, oz: half - width / 2 },
      { w: width, h: TILE_SIZE, ox: -half + width / 2, oz: 0 },
      { w: width, h: TILE_SIZE, ox: half - width / 2, oz: 0 },
    ];

    for (const tile of markers.values()) {
      const { x, z } = tileToWorld(tile);
      for (const edge of edgeSpecs) {
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
    onSettingsChange(newSettings) {
      settings = newSettings;
      rebuild();
    },
    toggleTile(tile) {
      const key = keyOf(tile);
      if (markers.has(key)) {
        markers.delete(key);
      } else {
        markers.set(key, tile);
      }
      saveMarkers(Array.from(markers.values()));
      rebuild();
    },
  };
}
