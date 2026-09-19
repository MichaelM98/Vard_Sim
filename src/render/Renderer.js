// Canvas renderer: draws the tile grid, player, boss, and mechanic telegraphs.
// TODO: implement drawGrid, drawEntities, drawMechanicOverlays.

import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../constants.js';

export class Renderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;
  }

  render(state) {
    // placeholder — filled in when we build the grid + entity drawing
  }
}
