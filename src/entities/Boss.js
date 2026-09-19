// Boss entity: HP, enrage state transition, and per-tick mechanic scheduling.
// TODO: drive which mechanic fires each tick and apply enrage thresholds.

import { BOSS } from '../constants.js';

export function checkEnrage(boss) {
  return boss.hp / BOSS.MAX_HP <= BOSS.ENRAGE_HP_PERCENT;
}
