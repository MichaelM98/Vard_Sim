// Entry point: wires together game state, the tick engine, and the 3D scene.
// Mechanics/input/HUD/plugins get connected here as each one is built.

import { createGameState } from './engine/GameState.js';
import { TickEngine } from './engine/TickEngine.js';
import { SceneManager } from './scene/SceneManager.js';
import { createPlayerMesh, createBossMesh } from './entities/meshes.js';
import { stepTowardTarget, getVisualTile } from './entities/Player.js';
import { tileToWorld } from './utils/grid.js';
import { GAME_PHASE, CAMERA, TICK_MS } from './constants.js';
import { PluginRegistry } from './plugins/PluginRegistry.js';
import { createTileMarkersPlugin } from './plugins/tileMarkers.js';
import { createAttackTelegraphsPlugin } from './plugins/attackTelegraphs.js';
import { SettingsPanel } from './ui/SettingsPanel.js';
import { ContextMenu } from './ui/ContextMenu.js';
import { setupInput } from './systems/input.js';
import { tickSwingingAxes } from './mechanics/swingingAxes.js';
import { Hud } from './render/Hud.js';

const state = createGameState();
const canvas = document.getElementById('arena');
const sceneManager = new SceneManager(canvas);

const playerMesh = createPlayerMesh();
const bossMesh = createBossMesh();
sceneManager.scene.add(playerMesh);
sceneManager.scene.add(bossMesh);

const plugins = new PluginRegistry(sceneManager);
plugins.register(createTileMarkersPlugin());
plugins.register(createAttackTelegraphsPlugin());

const hud = new Hud(document.getElementById('hud-boss'), document.getElementById('hud-player'));

const settingsPanel = document.getElementById('settings-panel');
const settingsToggle = document.getElementById('settings-toggle');
new SettingsPanel(settingsPanel, plugins);
settingsToggle.addEventListener('click', () => {
  settingsPanel.classList.toggle('hidden');
});

const contextMenu = new ContextMenu();

setupInput({
  canvas,
  camera: sceneManager.camera,
  ground: sceneManager.ground,
  onMoveClick: (tile) => {
    state.player.targetTile = tile;
  },
  onContextMenu: (tile, x, y) => {
    const items = [
      { label: 'Walk here', onClick: () => { state.player.targetTile = tile; } },
      ...plugins.collectContextMenuItems(tile),
    ];
    contextMenu.show(x, y, items);
  },
});

function syncMeshesToState() {
  const visualTile = getVisualTile(state.player, performance.now(), TICK_MS);
  const playerPos = tileToWorld(visualTile);
  playerMesh.position.set(playerPos.x, 0, playerPos.z);

  const bossPos = tileToWorld(state.boss.tile);
  bossMesh.position.set(bossPos.x, 0, bossPos.z);
}

function updateCamera() {
  const { camera } = sceneManager;
  camera.position.set(
    playerMesh.position.x + CAMERA.OFFSET.x,
    CAMERA.OFFSET.y,
    playerMesh.position.z + CAMERA.OFFSET.z
  );
  camera.lookAt(
    playerMesh.position.x + CAMERA.LOOK_AHEAD.x,
    CAMERA.LOOK_AHEAD.y,
    playerMesh.position.z + CAMERA.LOOK_AHEAD.z
  );
}

// Logic runs on fixed 600ms ticks (mechanics resolve here).
const engine = new TickEngine((tickCount) => {
  state.tick = tickCount;
  stepTowardTarget(state.player, performance.now());

  const axesResult = tickSwingingAxes(state.mechanics.swingingAxes, state.player.tile);
  if (axesResult.damage > 0) {
    state.player.hp = Math.max(0, state.player.hp - axesResult.damage);
  }
  plugins.get('attackTelegraphs').updateMechanicState(axesResult, state.mechanics.swingingAxes.center);
});

// Rendering runs on the browser's own refresh rate, independent of ticks.
function renderLoop() {
  syncMeshesToState();
  updateCamera();
  hud.update(state);
  sceneManager.render();
  requestAnimationFrame(renderLoop);
}

state.phase = GAME_PHASE.RUNNING;
engine.start();
requestAnimationFrame(renderLoop);
