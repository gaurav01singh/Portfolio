import { Container, Graphics } from "pixi.js";

export class Tree extends Container {
  constructor(scale = 1) {
    super();

    this.scale.set(scale);

    this.build();
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

  build() {
    const trunkColor = 0x6a4427;
    const trunkShadow = this.shade(trunkColor, -0.35);

    //==================================
    // TRUNK
    //==================================

    const trunk = new Graphics();

    trunk.roundRect(-8, -82, 16, 82, 6).fill(trunkColor).stroke({
      width: 4,
      color: 0x111111,
    });

    // Cel shadow

    trunk.rect(1, -82, 7, 82).fill(trunkShadow);

    // Highlight

    trunk.rect(-6, -80, 3, 78).fill({
      color: 0xffffff,
      alpha: 0.18,
    });

    // Roots

    trunk
      .moveTo(-8, 0)
      .lineTo(-18, 8)
      .lineTo(-4, 4)
      .closePath()
      .fill(trunkColor)
      .stroke({
        width: 3,
        color: 0x111111,
      });

    trunk
      .moveTo(8, 0)
      .lineTo(18, 8)
      .lineTo(4, 4)
      .closePath()
      .fill(trunkColor)
      .stroke({
        width: 3,
        color: 0x111111,
      });

    this.addChild(trunk);

    //==================================
    // LEAVES
    //==================================

    const leaves = new Graphics();

    const colors = [0x2e8b57, 0x3e9d49, 0x4caf50, 0x66bb6a];

    const blobs = [
      { x: 0, y: -122, r: 32 },
      { x: -24, y: -105, r: 28 },
      { x: 24, y: -105, r: 28 },
      { x: -14, y: -82, r: 26 },
      { x: 14, y: -82, r: 26 },
      { x: 0, y: -96, r: 36 },
      { x: -40, y: -92, r: 18 },
      { x: 40, y: -92, r: 18 },
    ];

    blobs.forEach((blob) => {
      const color = colors[Math.floor(Math.random() * colors.length)];

      leaves.circle(blob.x, blob.y, blob.r).fill(color).stroke({
        width: 4,
        color: 0x111111,
      });

      // Comic highlight

      leaves
        .circle(blob.x - blob.r * 0.25, blob.y - blob.r * 0.25, blob.r * 0.35)
        .fill({
          color: 0xffffff,
          alpha: 0.18,
        });

      // Cel shadow

      leaves
        .circle(blob.x + blob.r * 0.35, blob.y + blob.r * 0.15, blob.r * 0.45)
        .fill({
          color: this.shade(color, -0.3),
          alpha: 0.55,
        });
    });

    this.addChild(leaves);

    //==================================
    // FRUITS
    //==================================

    if (Math.random() > 0.6) {
      const fruits = new Graphics();

      for (let i = 0; i < 8; i++) {
        fruits
          .circle((Math.random() - 0.5) * 55, -120 + Math.random() * 55, 3)
          .fill(0xff5a36)
          .stroke({
            width: 2,
            color: 0x111111,
          });
      }

      this.addChild(fruits);
    }

    //==================================
    // GRASS
    //==================================

    const grass = new Graphics();

    for (let i = -18; i <= 18; i += 5) {
      grass
        .moveTo(i, 0)
        .lineTo(i + 2, -6)
        .lineTo(i + 4, 0)
        .stroke({
          width: 2,
          color: 0x3fae3a,
        });
    }

    this.addChild(grass);
  }
}
