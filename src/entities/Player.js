// Player entity: position and per-tick movement resolution toward a click target.
// OSRS walk speed is 1 tile per tick, 8-directional (diagonal counts as 1 tile).

export function stepTowardTarget(player) {
  const { tile, targetTile } = player;
  if (!targetTile) return;

  tile.x += Math.sign(targetTile.x - tile.x);
  tile.y += Math.sign(targetTile.y - tile.y);

  if (tile.x === targetTile.x && tile.y === targetTile.y) {
    player.targetTile = null;
  }
}
