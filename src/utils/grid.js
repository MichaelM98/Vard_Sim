// Shared tile-grid math: tile<->pixel conversion, distance, clamping to arena bounds.

import { TILE_SIZE, GRID_COLS, GRID_ROWS } from '../constants.js';

export function tileToPixel(tile) {
  return { x: tile.x * TILE_SIZE, y: tile.y * TILE_SIZE };
}

export function pixelToTile(px, py) {
  return { x: Math.floor(px / TILE_SIZE), y: Math.floor(py / TILE_SIZE) };
}

export function isInBounds(tile) {
  return tile.x >= 0 && tile.x < GRID_COLS && tile.y >= 0 && tile.y < GRID_ROWS;
}
