import { Container, Graphics } from "pixi.js";

export class BuildingLayer extends Container {
  constructor(width, groundY, options = {}) {
    super();

    this.width = width;
    this.groundY = groundY;

    this.color = options.color ?? 0x221530;
    this.alpha = options.alpha ?? 1;
    this.minHeight = options.minHeight ?? 80;
    this.maxHeight = options.maxHeight ?? 260;

    this.create();
  }

  create() {
    const g = new Graphics();

    g.beginFill(this.color, this.alpha);

    let x = -300;

    while (x < this.width + 300) {
      const w = 60 + Math.random() * 90;
      const h =
        this.minHeight + Math.random() * (this.maxHeight - this.minHeight);

      g.drawRect(x, this.groundY - h, w, h);

      // Rooftop details
      if (Math.random() > 0.4)
        g.drawRect(x + w * 0.25, this.groundY - h - 18, 8, 18);

      if (Math.random() > 0.7)
        g.drawRect(x + w * 0.65, this.groundY - h - 25, 6, 25);

      if (Math.random() > 0.8)
        g.drawCircle(x + w * 0.5, this.groundY - h - 12, 5);

      // Random lit windows
      for (let wy = 16; wy < h - 20; wy += 18) {
        const cols = Math.floor((w - 20) / 16);

        for (let c = 0; c < cols; c++) {
          if (Math.random() > 0.7) {
            g.beginFill(0xffd76a, 0.45);

            g.drawRect(x + 10 + c * 16, this.groundY - h + wy, 8, 10);

            g.endFill();

            g.beginFill(this.color, this.alpha);
          }
        }
      }

      x += w + Math.random() * 12;
    }

    g.endFill();

    this.addChild(g);
  }
}
