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
// TILE_SIZE is now a Three.js world-unit measurement (1 tile = 1 OSRS square),
// not a pixel size — the 3D scene scales with the browser window instead.
export const TILE_SIZE = 1;
export const GRID_COLS = 21;
export const GRID_ROWS = 21;
export const ARENA_WIDTH = GRID_COLS * TILE_SIZE;
export const ARENA_DEPTH = GRID_ROWS * TILE_SIZE;

// Arena center, used by mechanics that radiate from the boss (axes, gaze)
export const ARENA_CENTER = { x: Math.floor(GRID_COLS / 2), y: Math.floor(GRID_ROWS / 2) };

// ---- 3D scene ----
export const SCENE = {
  BACKGROUND_COLOR: 0x0d0d10,
  FOG_COLOR: 0x0d0d10,
  FOG_NEAR: 15,
  FOG_FAR: 40,
  GROUND_COLOR: 0x1c1c1c,
  GRID_LINE_COLOR: 0x3a3a3a,
};

export const CAMERA = {
  FOV: 55,
  NEAR: 0.1,
  FAR: 100,
  // Offset from the player's world position — OSRS-style over-the-shoulder angle.
  OFFSET: { x: 0, y: 9, z: 7 },
  LOOK_AHEAD: { x: 0, y: 0.5, z: -2 },
};

export const LIGHTING = {
  AMBIENT_COLOR: 0x8888aa,
  AMBIENT_INTENSITY: 0.6,
  SUN_COLOR: 0xfff2d0,
  SUN_INTENSITY: 1.2,
  SUN_POSITION: { x: 10, y: 20, z: 10 },
};

// ---- Player ----
export const PLAYER = {
  MAX_HP: 99,
  START_TILE: { x: 12, y: 14 }, // off the axis/diagonal lanes through the boss
  WALK_TILES_PER_TICK: 1,
  RUN_TILES_PER_TICK: 2,
};

// ---- Boss ----
// Vardorvis stands at the arena's center, matching the real fight's room
// (axes travel wall-to-wall through the boss's position).
export const BOSS = {
  NAME: 'Vardorvis',
  MAX_HP: 700, // OSRS Wiki infobox value
  START_TILE: { ...ARENA_CENTER },
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

// ---- Mechanic 1: Swinging axes ----
// Per the OSRS Wiki: axes spawn and travel in straight or diagonal lines
// across the room to the opposite side. 1 axe above 690 HP, 2 between 231
// and 690, 3 at or below 231. A hit deals DAMAGE plus a stacking bleed that
// procs faster if the player keeps moving instead of standing still.
// There's no separate "axe skip" logic — since danger is just "don't be on
// this tile this tick," the real skip trick is just clicking precisely with
// the click-to-move system, which the engine already supports.
export const SWINGING_AXES = {
  WAVE_INTERVAL_TICKS: 6, // ticks between axe waves
  WARNING_TICKS: 1, // ticks a tile is telegraphed before an axe steps onto it
  DAMAGE: 35,
  HP_THRESHOLD_TWO_AXES: 690,
  HP_THRESHOLD_THREE_AXES: 231,
  BLEED_PROC_COUNT: 5,
  BLEED_DAMAGE_PER_PROC: 3,
  BLEED_PROC_INTERVAL_TICKS: 3, // while standing still; every tick while moving
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
