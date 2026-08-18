import { Container, Graphics } from "pixi.js";

export class Building extends Container {
  constructor() {
    super();

    this.create();
  }

  create() {
    const g = new Graphics();

    const width = 70 + Math.random() * 80;
    const height = 160 + Math.random() * 220;

    const color = [0x2d2a36, 0x241d3b, 0x2c2545, 0x352c55][
      Math.floor(Math.random() * 4)
    ];

    const shadow = this.shade(color, -0.35);

    // ====================================
    // BUILDING
    // ====================================

    g.roundRect(-width / 2, -height, width, height, 6)
      .fill(color)
      .stroke({
        width: 4,
        color: 0x111111,
        join: "round",
      });

    // ====================================
    // CEL SHADOW
    // ====================================

    g.rect(width * 0.15, -height, width * 0.35, height).fill(shadow);

    // ====================================
    // TOP HIGHLIGHT
    // ====================================

    g.rect(-width / 2 + 4, -height + 4, width - 8, 6).fill({
      color: 0xffffff,
      alpha: 0.22,
    });

    // ====================================
    // ROOF
    // ====================================

    const roof = Math.floor(Math.random() * 4);

    switch (roof) {
      case 0:
        g.roundRect(-width / 2, -height - 8, width, 8, 3)
          .fill(color)
          .stroke({
            width: 4,
            color: 0x111111,
          });

        break;

      case 1:
        g.moveTo(-width / 2, -height)
          .lineTo(0, -height - 25)
          .lineTo(width / 2, -height)
          .closePath()
          .fill(color)
          .stroke({
            width: 4,
            color: 0x111111,
          });

        break;

      case 2:
        g.roundRect(-12, -height - 25, 24, 25, 4)
          .fill(color)
          .stroke({
            width: 4,
            color: 0x111111,
          });

        break;

      case 3:
        g.roundRect(-width / 2, -height - 6, width * 0.45, 6, 3)
          .fill(color)
          .stroke({
            width: 4,
            color: 0x111111,
          });

        break;
    }

    // ====================================
    // ANTENNA
    // ====================================

    if (Math.random() > 0.6) {
      g.rect(-1, -height - 40, 3, 40).fill(0x666666);

      g.circle(0, -height - 42, 5)
        .fill(0xff4b4b)
        .stroke({
          width: 2,
          color: 0x111111,
        });
    }

    // ====================================
    // WATER TANK
    // ====================================

    if (Math.random() > 0.7) {
      g.roundRect(width * 0.2, -height - 18, 22, 18, 4)
        .fill(0x555555)
        .stroke({
          width: 3,
          color: 0x111111,
        });
    }

    // ====================================
    // WINDOWS
    // ====================================

    const cols = Math.floor(width / 22);
    const rows = Math.floor(height / 22);

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        if (Math.random() < 0.15) continue;

        const wx = -width / 2 + 8 + x * 20;
        const wy = -height + 10 + y * 20;

        const lit = Math.random() > 0.35;

        g.roundRect(wx, wy, 10, 12, 2)
          .fill(lit ? 0xffd96b : 0x222222)
          .stroke({
            width: 2,
            color: 0x111111,
          });

        if (lit) {
          g.rect(wx + 1, wy + 1, 8, 2).fill({
            color: 0xffffff,
            alpha: 0.45,
          });
        }
      }
    }

    // ====================================
    // VERTICAL COMIC LINES
    // ====================================

    for (let x = -width / 2 + 18; x < width / 2; x += 28) {
      g.moveTo(x, -height + 8)
        .lineTo(x, -6)
        .stroke({
          width: 1.5,
          color: this.shade(color, -0.45),
          alpha: 0.4,
        });
    }

    this.addChild(g);
  }

  shade(hex, amount) {
    const r = (hex >> 16) & 255;
    const g = (hex >> 8) & 255;
    const b = hex & 255;

    const mix = (c) => {
      const target = amount < 0 ? 0 : 255;

      return Math.round(c + (target - c) * Math.abs(amount));
    };

    return (mix(r) << 16) | (mix(g) << 8) | mix(b);
  }
}
