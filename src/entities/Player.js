// Player entity: position, per-tick movement resolution, and the bleed
// status effect (currently inflicted by the swinging axes mechanic, but
// kept generic here since it's player state, not mechanic-specific logic).
// OSRS walk speed is 1 tile per tick, 8-directional (diagonal counts as 1 tile).

export function stepTowardTarget(player, now) {
  const { tile, targetTile } = player;
  if (!targetTile) return false;

  const from = { ...tile };
  tile.x += Math.sign(targetTile.x - tile.x);
  tile.y += Math.sign(targetTile.y - tile.y);
  player.moveAnim = { from, to: { ...tile }, startTime: now };

  if (tile.x === targetTile.x && tile.y === targetTile.y) {
    player.targetTile = null;
  }
  return true;
}

export function getVisualTile(player, now, tickMs) {
  if (!player.moveAnim) return player.tile;
  const t = Math.min((now - player.moveAnim.startTime) / tickMs, 1);
  const { from, to } = player.moveAnim;
  return {
    x: from.x + (to.x - from.x) * t,
    y: from.y + (to.y - from.y) * t,
  };
}

export function applyBleed(player, { procs, damagePerProc, interval }) {
  player.bleed = { procsRemaining: procs, damagePerProc, interval, ticksSinceProc: 0 };
}

// Bleed procs on a fixed interval while standing still, but every tick
// while moving — matching the real fight's "don't run while bleeding" trap.
export function tickBleed(player, moved) {
  const bleed = player.bleed;
  if (!bleed || bleed.procsRemaining <= 0) {
    player.bleed = null;
    return 0;
  }

  bleed.ticksSinceProc += 1;
  const effectiveInterval = moved ? 1 : bleed.interval;
  if (bleed.ticksSinceProc >= effectiveInterval) {
    bleed.ticksSinceProc = 0;
    bleed.procsRemaining -= 1;
    return bleed.damagePerProc;
  }
  return 0;
}
