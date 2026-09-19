// Input system: left click on the ground = move target, right click = toggle
// a tile marker. Both resolve a screen click to a tile via raycasting.

import * as THREE from 'three';
import { worldToTile, isInBounds } from '../utils/grid.js';

export function setupInput({ canvas, camera, ground, onMoveClick, onMarkerClick }) {
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();

  function raycastToTile(event) {
    const rect = canvas.getBoundingClientRect();
    pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(pointer, camera);

    const hits = raycaster.intersectObject(ground);
    if (hits.length === 0) return null;

    const tile = worldToTile(hits[0].point.x, hits[0].point.z);
    return isInBounds(tile) ? tile : null;
  }

  canvas.addEventListener('click', (event) => {
    const tile = raycastToTile(event);
    if (tile) onMoveClick(tile);
  });

  canvas.addEventListener('contextmenu', (event) => {
    event.preventDefault();
    const tile = raycastToTile(event);
    if (tile) onMarkerClick(tile);
  });
}
