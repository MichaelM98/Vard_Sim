// Player entity: position and per-tick movement resolution toward a click target.
// OSRS walk speed is 1 tile per tick, 8-directional (diagonal counts as 1 tile).
// The logical tile jumps once per tick; moveAnim records that jump so the
// renderer can glide the mesh across it smoothly instead of snapping.

export function stepTowardTarget(player, now) {
  const { tile, targetTile } = player;
  if (!targetTile) return;

  const from = { ...tile };
  tile.x += Math.sign(targetTile.x - tile.x);
  tile.y += Math.sign(targetTile.y - tile.y);
  player.moveAnim = { from, to: { ...tile }, startTime: now };

  if (tile.x === targetTile.x && tile.y === targetTile.y) {
    player.targetTile = null;
  }
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
