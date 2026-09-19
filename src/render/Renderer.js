// Canvas renderer: draws the tile grid, player, boss, and (later) mechanic telegraphs.
// Reads game state but never mutates it — the tick engine owns state changes.

import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  GRID_COLS,
  GRID_ROWS,
  TILE_SIZE,
  COLORS,
  BOSS,
} from '../constants.js';
import { tileToPixel } from '../utils/grid.js';

export class Renderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;
  }

  render(state) {
    this.drawBackground();
    this.drawGrid();
    this.drawBoss(state.boss);
    this.drawPlayer(state.player);
  }

  drawBackground() {
    const { ctx } = this;
    ctx.fillStyle = COLORS.TILE_SAFE;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  }

  drawGrid() {
    const { ctx } = this;
    ctx.strokeStyle = COLORS.GRID_LINE;
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let col = 0; col <= GRID_COLS; col += 1) {
      const x = col * TILE_SIZE + 0.5;
      ctx.moveTo(x, 0);
      ctx.lineTo(x, CANVAS_HEIGHT);
    }
    for (let row = 0; row <= GRID_ROWS; row += 1) {
      const y = row * TILE_SIZE + 0.5;
      ctx.moveTo(0, y);
      ctx.lineTo(CANVAS_WIDTH, y);
    }
    ctx.stroke();
  }

  drawBoss(boss) {
    const { ctx } = this;
    const { x, y } = tileToPixel(boss.tile);
    const size = BOSS.SIZE_TILES * TILE_SIZE;
    ctx.fillStyle = COLORS.BOSS;
    ctx.fillRect(x, y, size, size);
  }

  drawPlayer(player) {
    const { ctx } = this;
    const { x, y } = tileToPixel(player.tile);
    const radius = TILE_SIZE / 2 - 4;
    ctx.fillStyle = COLORS.PLAYER;
    ctx.beginPath();
    ctx.arc(x + TILE_SIZE / 2, y + TILE_SIZE / 2, radius, 0, Math.PI * 2);
    ctx.fill();
  }
}
