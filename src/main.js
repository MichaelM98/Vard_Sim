// Entry point: wires together game state, the tick engine, and the renderer.
// Mechanics/input/HUD get connected here as each one is built.

import { createGameState } from './engine/GameState.js';
import { TickEngine } from './engine/TickEngine.js';
import { Renderer } from './render/Renderer.js';

const state = createGameState();
const canvas = document.getElementById('arena');
const renderer = new Renderer(canvas);

const engine = new TickEngine((tickCount) => {
  state.tick = tickCount;
  renderer.render(state);
});

renderer.render(state);
engine.start();
