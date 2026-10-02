(() => {
  'use strict';
  class MobileInput {
    constructor() { this.clear(); }
    clear() { this.stickId = null; this.x = 0; this.y = 0; this.knobX = 0; this.knobY = 0; this.actions = new Map(); }
    beginStick(id, x, y, centerX, centerY, radius) {
      if (this.stickId !== null) return false;
      this.stickId = id; this.centerX = centerX; this.centerY = centerY; this.radius = Math.max(1, radius);
      return this.moveStick(id, x, y);
    }
    moveStick(id, x, y) {
      if (id !== this.stickId) return false;
      const dx = x - this.centerX, dy = y - this.centerY, length = Math.hypot(dx, dy);
      const capped = Math.min(length, this.radius), scale = length ? capped / length : 0;
      this.knobX = dx * scale; this.knobY = dy * scale;
      const strength = Math.max(0, (capped / this.radius - .13) / .87);
      this.x = length ? dx / length * strength : 0; this.y = length ? dy / length * strength : 0;
      return true;
    }
    beginAction(id, action) { if (this.actions.has(id)) return false; this.actions.set(id, action); return true; }
    release(id) {
      if (id === this.stickId) { this.stickId = null; this.x = this.y = this.knobX = this.knobY = 0; }
      this.actions.delete(id);
    }
    get attack() { return [...this.actions.values()].includes('attack'); }
  }
  function assistAim(player, enemies, range = 220) {
    let best = range, target = null;
    for (const enemy of enemies) {
      if (enemy.hp <= 0) continue;
      const distance = Math.hypot(enemy.x - player.x, enemy.y - player.y);
      if (distance < best) { best = distance; target = enemy; }
    }
    return target ? Math.atan2(target.y - player.y, target.x - player.x) : undefined;
  }
  globalThis.LongdanMobile = { MobileInput, assistAim };
})();
