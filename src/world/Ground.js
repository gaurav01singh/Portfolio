import { Container, Graphics } from "pixi.js";
import { PoleLight } from "./PoleLight";

export class Ground extends Container {
  constructor(groundY) {
    super();

    this.worldWidth = 6000;
    this.groundY = groundY;

    this.build();
  }

  build() {
    const g = new Graphics();

    // Main ground
    g.rect(-300, this.groundY, this.worldWidth + 600, 400).fill(0x404040);

    // Top highlight
    g.rect(-300, this.groundY, this.worldWidth + 600, 6).fill(0x352548);

    // Road center line
    for (let x = -200; x < this.worldWidth + 200; x += 60) {
      g.rect(x, this.groundY + 34, 32, 4).fill({
        color: 0xf4c95d,
        alpha: 0.7,
      });
    }

    // Small cracks
    for (let i = 0; i < 250; i++) {
      const x = Math.random() * this.worldWidth;

      const y = this.groundY + 12 + Math.random() * 18;

      const len = 4 + Math.random() * 10;

      g.moveTo(x, y)
        .lineTo(x + len, y + Math.random() * 3)
        .stroke({
          width: 1,
          color: 0x43315e,
          alpha: 0.5,
        });
    }

    this.addChild(g);
    for (let x = 250; x < this.worldWidth; x += 500) {
      const pole = new PoleLight(270 + Math.random() * 30);

      pole.position.set(x, this.groundY);

      this.addChild(pole);
    }
  }
}
