// Shared tile-grid math: tile<->3D world conversion, distance, bounds checking.
// Three.js convention: X/Z form the ground plane, Y is height (up).

import { TILE_SIZE, GRID_COLS, GRID_ROWS } from '../constants.js';

export function tileToWorld(tile) {
  return {
    x: (tile.x - GRID_COLS / 2 + 0.5) * TILE_SIZE,
    z: (tile.y - GRID_ROWS / 2 + 0.5) * TILE_SIZE,
  };
}

export function worldToTile(worldX, worldZ) {
  return {
    x: Math.floor(worldX / TILE_SIZE + GRID_COLS / 2),
    y: Math.floor(worldZ / TILE_SIZE + GRID_ROWS / 2),
  };
}

export function isInBounds(tile) {
  return tile.x >= 0 && tile.x < GRID_COLS && tile.y >= 0 && tile.y < GRID_ROWS;
}

export function tileDistance(a, b) {
  return Math.max(Math.abs(a.x - b.x), Math.abs(a.y - b.y));
}
