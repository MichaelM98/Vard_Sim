// Fixed 600ms game-logic tick loop, decoupled from the render loop.
// OSRS mechanics resolve on ticks, not frames, so all combat/mechanic
// logic must be driven from here rather than requestAnimationFrame.

import { TICK_MS } from '../constants.js';

export class TickEngine {
  constructor(onTick) {
    this.onTick = onTick;
    this.tickCount = 0;
    this.timerId = null;
  }

  start() {
    if (this.timerId !== null) return;
    this.timerId = setInterval(() => {
      this.tickCount += 1;
      this.onTick(this.tickCount);
    }, TICK_MS);
  }

  stop() {
    if (this.timerId === null) return;
    clearInterval(this.timerId);
    this.timerId = null;
  }
}
