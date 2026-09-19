// HUD: player/boss HP bars, rendered as simple HTML bars updated every frame.

import { PLAYER, BOSS, COLORS } from '../constants.js';

export class Hud {
  constructor(bossContainer, playerContainer) {
    this.bossBar = this._buildBar(bossContainer, BOSS.NAME, COLORS.HP_BOSS);
    this.playerBar = this._buildBar(playerContainer, 'Player', COLORS.HP_PLAYER);
  }

  _buildBar(container, label, color) {
    container.innerHTML = '';
    container.classList.add('hp-bar');

    const labelEl = document.createElement('div');
    labelEl.className = 'hp-label';
    container.appendChild(labelEl);

    const track = document.createElement('div');
    track.className = 'hp-track';
    const fill = document.createElement('div');
    fill.className = 'hp-fill';
    fill.style.backgroundColor = color;
    track.appendChild(fill);
    container.appendChild(track);

    return { labelEl, fill, label };
  }

  update(state) {
    this._updateBar(this.bossBar, state.boss.hp, BOSS.MAX_HP);
    this._updateBar(this.playerBar, state.player.hp, PLAYER.MAX_HP);
  }

  _updateBar(bar, hp, maxHp) {
    const clamped = Math.max(0, hp);
    const pct = Math.max(0, Math.min(1, clamped / maxHp));
    bar.fill.style.width = `${pct * 100}%`;
    bar.labelEl.textContent = `${bar.label}: ${clamped}/${maxHp}`;
  }
}
