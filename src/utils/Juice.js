// Juicy animation and spring physics helpers for human-crafted game feel
export class Spring {
  constructor(val = 0, tension = 160, friction = 12) {
    this.target = val;
    this.value = val;
    this.velocity = 0;
    this.tension = tension;
    this.friction = friction;
  }

  set(val) {
    this.value = val;
    this.velocity = 0;
  }

  update(dt = 0.016) {
    const force = -this.tension * (this.value - this.target);
    const damping = -this.friction * this.velocity;
    const accel = force + damping;
    this.velocity += accel * dt;
    this.value += this.velocity * dt;
    return this.value;
  }
}

export function easeOutElastic(t) {
  const p = 0.3;
  return Math.pow(2, -10 * t) * Math.sin(((t - p / 4) * (2 * Math.PI)) / p) + 1;
}

export function easeOutBack(t, s = 1.70158) {
  return (t = t - 1) * t * ((s + 1) * t + s) + 1;
}
