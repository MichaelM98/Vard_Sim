// Entry point: wires together game state, the tick engine, and the renderer.
// Mechanics/input/HUD get connected here as each one is built.

import { createGameState } from './engine/GameState.js';
import { TickEngine } from './engine/TickEngine.js';
import { Renderer } from './render/Renderer.js';
import { GAME_PHASE } from './constants.js';

const state = createGameState();
const canvas = document.getElementById('arena');
const renderer = new Renderer(canvas);

// Logic runs on fixed 600ms ticks (mechanics resolve here).
const engine = new TickEngine((tickCount) => {
  state.tick = tickCount;
});

// Rendering runs on the browser's own refresh rate, independent of ticks,
// so movement/animations can later be interpolated smoothly between ticks.
function renderLoop() {
  renderer.render(state);
  requestAnimationFrame(renderLoop);
}

state.phase = GAME_PHASE.RUNNING;
engine.start();
requestAnimationFrame(renderLoop);
