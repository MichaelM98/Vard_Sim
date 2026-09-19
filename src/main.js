// Entry point: wires together game state, the tick engine, and the 3D scene.
// Mechanics/input/HUD/plugins get connected here as each one is built.

import { createGameState } from './engine/GameState.js';
import { TickEngine } from './engine/TickEngine.js';
import { SceneManager } from './scene/SceneManager.js';
import { createPlayerMesh, createBossMesh } from './entities/meshes.js';
import { tileToWorld } from './utils/grid.js';
import { GAME_PHASE, CAMERA, BOSS } from './constants.js';
import { PluginRegistry } from './plugins/PluginRegistry.js';
import { createTileMarkersPlugin } from './plugins/tileMarkers.js';
import { SettingsPanel } from './ui/SettingsPanel.js';

const state = createGameState();
const canvas = document.getElementById('arena');
const sceneManager = new SceneManager(canvas);

const playerMesh = createPlayerMesh();
const bossMesh = createBossMesh();
sceneManager.scene.add(playerMesh);
sceneManager.scene.add(bossMesh);

const plugins = new PluginRegistry(sceneManager);
plugins.register(createTileMarkersPlugin());

const settingsPanel = document.getElementById('settings-panel');
const settingsToggle = document.getElementById('settings-toggle');
new SettingsPanel(settingsPanel, plugins);
settingsToggle.addEventListener('click', () => {
  settingsPanel.classList.toggle('hidden');
});

// Demo tiles around the boss so the Tile Markers plugin has something to
// show before a mechanic (swinging axes) is driving it for real.
const demoTiles = [
  { x: BOSS.START_TILE.x - 1, y: BOSS.START_TILE.y + 3 },
  { x: BOSS.START_TILE.x + 1, y: BOSS.START_TILE.y + 3 },
  { x: BOSS.START_TILE.x, y: BOSS.START_TILE.y + 4 },
];
plugins.get('tileMarkers').setMarkedTiles(demoTiles, plugins.getSettings('tileMarkers'));

function syncMeshesToState() {
  const playerPos = tileToWorld(state.player.tile);
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
});

// Rendering runs on the browser's own refresh rate, independent of ticks.
function renderLoop() {
  syncMeshesToState();
  updateCamera();
  sceneManager.render();
  requestAnimationFrame(renderLoop);
}

state.phase = GAME_PHASE.RUNNING;
engine.start();
requestAnimationFrame(renderLoop);
