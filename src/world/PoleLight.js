import { Container, Graphics } from "pixi.js";

export class PoleLight extends Container {
  constructor(height = 290) {
    super();

    this.poleHeight = height;

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
    const poleColor = 0x707070;
    const shadow = this.shade(poleColor, -0.35);

    //==============================
    // GROUND GLOW
    //==============================

    const glowGround = new Graphics();

    glowGround.ellipse(20, 0, 60, 14).fill({
      color: 0xffeaa0,
      alpha: 0.45,
    });

    glowGround.ellipse(20, 0, 38, 8).fill({
      color: 0xfff7d6,
      alpha: 0.55,
    });

    this.addChild(glowGround);

    //==============================
    // LIGHT GLOW
    //==============================

    const glow = new Graphics();

    glow.circle(25, -this.poleHeight + 30, 44).fill({
      color: 0xfff5bf,
      alpha: 0.22,
    });

    glow.circle(25, -this.poleHeight + 30, 26).fill({
      color: 0xfff5bf,
      alpha: 0.38,
    });

    glow.circle(25, -this.poleHeight + 30, 12).fill({
      color: 0xffffff,
      alpha: 0.6,
    });

    this.addChild(glow);

    //==============================
    // POLE
    //==============================

    const pole = new Graphics();

    // Base

    pole.roundRect(-12, -10, 24, 10, 4).fill(0x454545).stroke({
      width: 4,
      color: 0x111111,
    });

    // Pole

    pole

      .roundRect(-4, -this.poleHeight, 8, this.poleHeight, 4)
      .fill(poleColor)
      .stroke({
        width: 4,
        color: 0x111111,
      });

    // Comic shadow

    pole.rect(0, -this.poleHeight, 4, this.poleHeight).fill(shadow);

    // Highlight

    pole.rect(-3, -this.poleHeight + 4, 2, this.poleHeight - 8).fill({
      color: 0xffffff,
      alpha: 0.18,
    });

    //==============================
    // ARM
    //==============================

    pole

      .moveTo(0, -this.poleHeight + 18)

      .bezierCurveTo(
        12,
        -this.poleHeight + 10,

        22,
        -this.poleHeight + 16,

        28,
        -this.poleHeight + 30,
      )

      .stroke({
        width: 6,
        color: poleColor,
        cap: "round",
      });

    //==============================
    // LAMP
    //==============================

    pole

      .roundRect(18, -this.poleHeight + 22, 18, 10, 4)

      .fill(0x444444)

      .stroke({
        width: 4,
        color: 0x111111,
      });

    // Lamp underside

    pole

      .circle(27, -this.poleHeight + 34, 5)

      .fill(0xffe784)

      .stroke({
        width: 2,
        color: 0x111111,
      });

    //==============================
    // BOLTS
    //==============================

    pole.circle(0, -8, 2).fill(0xdddddd);

    pole.circle(0, -22, 2).fill(0xdddddd);

    pole.circle(0, -36, 2).fill(0xdddddd);

    //==============================
    // BASE SHADOW
    //==============================

    pole.ellipse(0, 2, 16, 4).fill({
      color: 0x000000,
      alpha: 0.2,
    });

    this.addChild(pole);
  }
}
