// Mechanic 1: Swinging axes — a lethal quadrant rotates clockwise around the
// boss. Pure game logic only; rendering the telegraph lives in
// plugins/attackTelegraphs.js so it stays configurable like any other plugin.

import { SWINGING_AXES } from '../constants.js';
import { getQuadrant } from '../utils/grid.js';

export function createSwingingAxesState(center) {
  return {
    center,
    currentQuadrant: 0,
    ticksInCycle: 0, // 0-indexed tick within the current quadrant's full cycle
  };
}

export function tickSwingingAxes(mechState, playerTile) {
  const { WARNING_TICKS, ACTIVE_TICKS, SKIP_WINDOW_TICKS, QUADRANT_COUNT, DAMAGE } = SWINGING_AXES;
  const cycleLength = WARNING_TICKS + ACTIVE_TICKS;
  const nextQuadrant = (mechState.currentQuadrant + 1) % QUADRANT_COUNT;
  const playerQuadrant = getQuadrant(playerTile, mechState.center);

  const isWarning = mechState.ticksInCycle < WARNING_TICKS;
  const ticksLeftInWarning = WARNING_TICKS - mechState.ticksInCycle;

  // Axe skip: already standing in the next quadrant during the closing
  // warning ticks skips straight to it instead of waiting out this one.
  if (isWarning && ticksLeftInWarning <= SKIP_WINDOW_TICKS && playerQuadrant === nextQuadrant) {
    mechState.currentQuadrant = nextQuadrant;
    mechState.ticksInCycle = 0;
    return { damage: 0, skipped: true, warningQuadrant: null, dangerQuadrant: null };
  }

  const isActive = !isWarning;
  const damage = isActive && playerQuadrant === mechState.currentQuadrant ? DAMAGE : 0;
  const warningQuadrant = isWarning ? mechState.currentQuadrant : null;
  const dangerQuadrant = isActive ? mechState.currentQuadrant : null;

  mechState.ticksInCycle += 1;
  if (mechState.ticksInCycle >= cycleLength) {
    mechState.currentQuadrant = nextQuadrant;
    mechState.ticksInCycle = 0;
  }

  return { damage, skipped: false, warningQuadrant, dangerQuadrant };
}
