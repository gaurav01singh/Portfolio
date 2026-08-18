export class Camera {
  constructor(app, world) {
    this.app = app;
    this.world = world;

    this.x = 0;

    this.followTarget = null;
    this.followSpeed = 0.1;

    this.offsetX = app.screen.width * 0.35;

    this.minX = 0;
    this.maxX = 6000;
  }

  follow(target) {
    this.followTarget = target;
  }

  update(delta) {
    if (!this.followTarget) return;

    const targetX = this.followTarget.x - this.offsetX;

    this.x += (targetX - this.x) * this.followSpeed * delta;

    this.x = Math.max(
      this.minX,
      Math.min(this.x, this.maxX - this.app.screen.width),
    );

    for (const layer of this.world.layers) {
      layer.container.x = -this.x * layer.speed;
    }
  }
}
