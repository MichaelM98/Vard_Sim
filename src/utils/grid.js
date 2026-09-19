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

// Splits the arena into 4 quadrants around a center tile, numbered clockwise
// starting from the north-east (0=NE, 1=SE, 2=SW, 3=NW). Used by mechanics
// that rotate an attack around the boss (swinging axes, head gaze).
export function getQuadrant(tile, center) {
  const dx = tile.x - center.x;
  const dy = tile.y - center.y;
  if (dx >= 0 && dy < 0) return 0;
  if (dx >= 0 && dy >= 0) return 1;
  if (dx < 0 && dy >= 0) return 2;
  return 3;
}
