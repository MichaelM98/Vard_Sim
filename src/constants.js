// ============================================================
// Vardorvis Boss Simulator — Constants
// All game-balance numbers below are approximated from the real
// OSRS fight and tuned for playability. Adjust freely.
// ============================================================

// ---- Core tick engine ----
export const TICK_MS = 600; // OSRS game tick length
export const RENDER_FPS = 60; // render loop runs faster than logic ticks for smooth interpolation

// ---- Game phases ----
export const GAME_PHASE = {
  IDLE: 'idle',
  RUNNING: 'running',
  VICTORY: 'victory',
  DEFEAT: 'defeat',
};

// ---- Arena / grid ----
export const TILE_SIZE = 32; // px per tile on canvas
export const GRID_COLS = 21;
export const GRID_ROWS = 21;
export const CANVAS_WIDTH = GRID_COLS * TILE_SIZE;
export const CANVAS_HEIGHT = GRID_ROWS * TILE_SIZE;

// Arena center, used by mechanics that radiate from the boss (axes, gaze)
export const ARENA_CENTER = { x: Math.floor(GRID_COLS / 2), y: Math.floor(GRID_ROWS / 2) };

// ---- Player ----
export const PLAYER = {
  MAX_HP: 99,
  START_TILE: { x: 10, y: 17 },
  WALK_TILES_PER_TICK: 1,
  RUN_TILES_PER_TICK: 2,
};

// ---- Boss ----
export const BOSS = {
  NAME: 'Vardorvis',
  MAX_HP: 640,
  START_TILE: { x: 8, y: 3 },
  SIZE_TILES: 5, // Vardorvis occupies a 5x5 footprint
  ENRAGE_HP_PERCENT: 0.33, // enrage triggers below this fraction of max HP
  ENRAGE_ATTACK_SPEED_MULTIPLIER: 0.75, // lower = faster attack cadence
  ENRAGE_DAMAGE_MULTIPLIER: 1.5,
};

// ---- Prayers ----
export const PRAYERS = {
  PROTECT_MELEE: {
    id: 'protect_melee',
    label: 'Protect from Melee',
    drainPerTick: 0.2,
  },
  PROTECT_MAGIC: {
    id: 'protect_magic',
    label: 'Protect from Magic',
    drainPerTick: 0.2,
  },
  PROTECT_MISSILES: {
    id: 'protect_missiles',
    label: 'Protect from Missiles',
    drainPerTick: 0.2,
  },
};
export const MAX_PRAYER_POINTS = 99;

// ---- Mechanic 1: Swinging axes (quadrant sweep + axe skip) ----
export const SWINGING_AXES = {
  QUADRANT_COUNT: 4,
  WARNING_TICKS: 2, // telegraph ticks before a quadrant becomes lethal
  ACTIVE_TICKS: 2, // ticks a quadrant stays lethal once triggered
  ROTATION_TICKS: 3, // ticks between quadrant advances
  DAMAGE: 40,
  // "Axe skip": stepping into the *next* quadrant during the final
  // warning tick of the current one, before it goes active, to skip
  // a full rotation instead of waiting it out.
  SKIP_WINDOW_TICKS: 1,
};

// ---- Mechanic 2: Head gaze (prayer-switch attack) ----
export const HEAD_GAZE = {
  CYCLE_TICKS: 5, // ticks between gaze attacks
  WARNING_TICKS: 2, // telegraph before the gaze resolves
  PRAYER_OPTIONS: [PRAYERS.PROTECT_MELEE.id, PRAYERS.PROTECT_MAGIC.id],
  WRONG_PRAYER_DAMAGE: 50,
  CORRECT_PRAYER_DAMAGE: 0,
};

// ---- Mechanic 3: Darting spikes ----
export const DARTING_SPIKES = {
  SPEED_TILES_PER_TICK: 1,
  LANE_WIDTH_TILES: 1,
  WARNING_TICKS: 1,
  DAMAGE: 30,
  SPAWN_EDGE_MARGIN: 1, // tiles from arena edge spikes originate
};

// ---- Mechanic 4: Strangle vines (spore click-to-cut) ----
export const STRANGLE_VINES = {
  GROW_TICKS: 3, // ticks until a vine fully strangles if not cut
  CLICKS_REQUIRED: 1, // spore clicks needed to sever a vine
  DAMAGE_PER_TICK_IF_STRANGLED: 15,
  MAX_ACTIVE_VINES: 2,
};

// ---- Rendering colors ----
export const COLORS = {
  GRID_LINE: '#2a2a2a',
  TILE_SAFE: '#1c1c1c',
  TILE_WARNING: '#7a5c00',
  TILE_DANGER: '#8c1c1c',
  PLAYER: '#3fa7ff',
  BOSS: '#b03fff',
  VINE: '#2e8b2e',
  SPIKE: '#cfcfcf',
  HP_PLAYER: '#3fd15a',
  HP_BOSS: '#d13f3f',
  HP_BACKGROUND: '#3a3a3a',
  ENRAGE_OVERLAY: 'rgba(140, 0, 0, 0.15)',
};

// ---- Input ----
export const INPUT = {
  MOVE_BUTTON: 0, // left click to move
};
