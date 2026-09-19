// Three.js scene bootstrap: renderer, camera, lighting, and the ground tile grid.
// Owns nothing about game logic — just the 3D world and how it's presented.

import * as THREE from 'three';
import { ARENA_WIDTH, ARENA_DEPTH, GRID_COLS, GRID_ROWS, SCENE, CAMERA, LIGHTING } from '../constants.js';

export class SceneManager {
  constructor(canvas) {
    this.canvas = canvas;

    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(SCENE.BACKGROUND_COLOR);
    this.scene.fog = new THREE.Fog(SCENE.FOG_COLOR, SCENE.FOG_NEAR, SCENE.FOG_FAR);

    this.camera = new THREE.PerspectiveCamera(CAMERA.FOV, 1, CAMERA.NEAR, CAMERA.FAR);

    this._buildLighting();
    this._buildGround();

    window.addEventListener('resize', () => this.handleResize());
    this.handleResize();
  }

  _buildLighting() {
    const ambient = new THREE.AmbientLight(LIGHTING.AMBIENT_COLOR, LIGHTING.AMBIENT_INTENSITY);
    this.scene.add(ambient);

    const sun = new THREE.DirectionalLight(LIGHTING.SUN_COLOR, LIGHTING.SUN_INTENSITY);
    sun.position.set(LIGHTING.SUN_POSITION.x, LIGHTING.SUN_POSITION.y, LIGHTING.SUN_POSITION.z);
    this.scene.add(sun);
  }

  _buildGround() {
    const groundGeo = new THREE.PlaneGeometry(ARENA_WIDTH, ARENA_DEPTH);
    const groundMat = new THREE.MeshStandardMaterial({ color: SCENE.GROUND_COLOR });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    this.scene.add(ground);

    const grid = new THREE.GridHelper(Math.max(ARENA_WIDTH, ARENA_DEPTH), Math.max(GRID_COLS, GRID_ROWS), SCENE.GRID_LINE_COLOR, SCENE.GRID_LINE_COLOR);
    grid.position.y = 0.01; // avoid z-fighting with the ground plane
    this.scene.add(grid);
  }

  handleResize() {
    const width = this.canvas.clientWidth;
    const height = this.canvas.clientHeight;
    this.renderer.setSize(width, height, false);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }
}
