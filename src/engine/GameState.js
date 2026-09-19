// Central mutable game state — single source of truth read by the renderer and mechanics.

import { PLAYER, BOSS, GAME_PHASE, MAX_PRAYER_POINTS } from '../constants.js';
import { createSwingingAxesState } from '../mechanics/swingingAxes.js';

export function createGameState() {
  return {
    phase: GAME_PHASE.IDLE,
    tick: 0,
    player: {
      tile: { ...PLAYER.START_TILE },
      targetTile: null,
      hp: PLAYER.MAX_HP,
      bleed: null,
      prayerPoints: MAX_PRAYER_POINTS,
      activePrayer: null,
    },
    boss: {
      tile: { ...BOSS.START_TILE },
      hp: BOSS.MAX_HP,
      enraged: false,
    },
    mechanics: {
      swingingAxes: createSwingingAxesState(),
    },
  };
}
