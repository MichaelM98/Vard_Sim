// Mechanic 1: Swinging axes — axes spawn at the edge of the room and travel
// in a straight or diagonal line to the opposite side, one tile per tick.
// Pure game logic only; plugins/attackTelegraphs.js renders the result.
//
// There's no separate "axe skip" logic here: since danger is just "don't be
// on this tile this tick," the real skip trick from the actual fight is just
// clicking precisely with the click-to-move system, which the engine
// already supports — no special-casing needed.

import { SWINGING_AXES, GRID_COLS, GRID_ROWS, ARENA_CENTER } from '../constants.js';

function buildLanes() {
  const { x: cx, y: cy } = ARENA_CENTER;
  const maxX = GRID_COLS - 1;
  const maxY = GRID_ROWS - 1;
  return [
    { start: { x: cx, y: 0 }, dir: { x: 0, y: 1 } }, // N -> S
    { start: { x: cx, y: maxY }, dir: { x: 0, y: -1 } }, // S -> N
    { start: { x: 0, y: cy }, dir: { x: 1, y: 0 } }, // W -> E
    { start: { x: maxX, y: cy }, dir: { x: -1, y: 0 } }, // E -> W
    { start: { x: 0, y: 0 }, dir: { x: 1, y: 1 } }, // NW -> SE
    { start: { x: maxX, y: 0 }, dir: { x: -1, y: 1 } }, // NE -> SW
    { start: { x: 0, y: maxY }, dir: { x: 1, y: -1 } }, // SW -> NE
    { start: { x: maxX, y: maxY }, dir: { x: -1, y: -1 } }, // SE -> NW
  ];
}

const LANES = buildLanes();

function buildPath(lane) {
  const path = [];
  let { x, y } = lane.start;
  while (x >= 0 && x < GRID_COLS && y >= 0 && y < GRID_ROWS) {
    path.push({ x, y });
    x += lane.dir.x;
    y += lane.dir.y;
  }
  return path;
}

function axeCountForHp(hp) {
  if (hp > SWINGING_AXES.HP_THRESHOLD_TWO_AXES) return 1;
  if (hp > SWINGING_AXES.HP_THRESHOLD_THREE_AXES) return 2;
  return 3;
}

function pickLanes(count) {
  return [...LANES].sort(() => Math.random() - 0.5).slice(0, count);
}

export function createSwingingAxesState() {
  return {
    axes: [], // { path: [{x,y}, ...], index }
    ticksUntilNextWave: SWINGING_AXES.WAVE_INTERVAL_TICKS,
  };
}

export function tickSwingingAxes(mechState, playerTile, bossHp) {
  mechState.ticksUntilNextWave -= 1;
  if (mechState.ticksUntilNextWave <= 0) {
    const count = axeCountForHp(bossHp);
    for (const lane of pickLanes(count)) {
      mechState.axes.push({ path: buildPath(lane), index: 0 });
    }
    mechState.ticksUntilNextWave = SWINGING_AXES.WAVE_INTERVAL_TICKS;
  }

  const dangerTiles = [];
  const warningTiles = [];
  let hit = false;

  for (const axe of mechState.axes) {
    const currentTile = axe.path[axe.index];
    if (currentTile) {
      dangerTiles.push(currentTile);
      if (currentTile.x === playerTile.x && currentTile.y === playerTile.y) {
        hit = true;
      }
    }
    const nextTile = axe.path[axe.index + SWINGING_AXES.WARNING_TICKS];
    if (nextTile) warningTiles.push(nextTile);
  }

  mechState.axes = mechState.axes
    .map((axe) => ({ ...axe, index: axe.index + 1 }))
    .filter((axe) => axe.index < axe.path.length);

  return { damage: hit ? SWINGING_AXES.DAMAGE : 0, hit, dangerTiles, warningTiles };
}
