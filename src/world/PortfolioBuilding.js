import { Container, Graphics, Text } from "pixi.js";

export class PortfolioBuilding extends Container {
  constructor(data) {
    super();

    this.data = data;

    this.build();
    this.eventMode = "static";
    this.cursor = "pointer";

    this.on("pointerover", () => {
      this.scale.set(1.02);
    });

    this.on("pointerout", () => {
      this.scale.set(1.0);
    });

    this.on("pointertap", () => {
      this.emit("open-room", this.data.id);
    });
  }

  build() {
    this.createShadow();

    switch (this.data.id) {
      case "about":
        this.createHouse();
        break;

      case "skills":
        this.createOffice();
        break;

      case "experience":
        this.createTower();
        break;

      case "education":
        this.createSchool();
        break;

      case "projects":
        this.createStudio();
        break;

      case "contact":
        this.createCafe();
        break;
    }

    this.createSign();
  }

  // ---------- color helpers ----------

  shade(hex, amt) {
    // amt in [-1,1]. negative darkens, positive lightens.
    const r = (hex >> 16) & 0xff;
    const g = (hex >> 8) & 0xff;
    const b = hex & 0xff;

    const mix = (c) => {
      const target = amt < 0 ? 0 : 255;
      const t = Math.abs(amt);
      return Math.round(c + (target - c) * t);
    };

    return (mix(r) << 16) | (mix(g) << 8) | mix(b);
  }

  createShadow() {
    const g = new Graphics();

    g.ellipse(0, 6, 95, 18).fill({ color: 0x000000, alpha: 0.35 });

    this.addChild(g);
  }

  // ---------- buildings ----------

  createHouse() {
    const g = new Graphics();

    const roof = this.data.color;
    const wall = 0xc9b2ff;
    const darkWall = this.shade(wall, -0.35);
    const roofDark = this.shade(roof, -0.35);

    //==============================
    // WALL
    //==============================

    g.roundRect(-72, -120, 140, 120, 10).fill(wall).stroke({
      width: 5,
      color: 0x111111,
      join: "round",
    });

    // right comic shadow

    g.moveTo(20, -120)
      .lineTo(68, -120)
      .lineTo(68, 0)
      .lineTo(42, 0)
      .closePath()
      .fill(darkWall);

    // top highlight

    g.rect(-68, -116, 130, 8).fill(0xffffff, 0.35);

    //==============================
    // BRICKS
    //==============================

    for (let y = -105; y < -8; y += 18) {
      for (let x = -65; x < 60; x += 28) {
        g.moveTo(x, y)
          .lineTo(x + 20, y)
          .stroke({
            width: 1,
            color: 0x7e6fa5,
            alpha: 0.45,
          });
      }
    }

    //==============================
    // ROOF
    //==============================

    g.moveTo(-92, -118)
      .lineTo(0, -192)
      .lineTo(92, -118)
      .closePath()
      .fill(roof)
      .stroke({
        width: 5,
        color: 0x111111,
      });

    // shadow

    g.moveTo(0, -192)
      .lineTo(92, -118)
      .lineTo(65, -118)
      .closePath()
      .fill(roofDark);

    // highlight

    g.moveTo(0, -192)
      .lineTo(-92, -118)
      .lineTo(-60, -118)
      .closePath()
      .fill(0xffffff, 0.25);

    //==============================
    // ROOF TILES
    //==============================

    for (let y = -178; y < -125; y += 12) {
      for (let x = -60; x < 60; x += 18) {
        g.moveTo(x, y)
          .lineTo(x + 10, y + 4)
          .stroke({
            width: 2,
            color: roofDark,
          });
      }
    }

    //==============================
    // CHIMNEY
    //==============================

    g.roundRect(38, -185, 18, 42, 4).fill(0x9f8d8d).stroke({
      width: 5,
      color: 0x111111,
    });

    //==============================
    // WINDOWS
    //==============================

    [-48, 22].forEach((x) => {
      g.roundRect(x, -94, 30, 30, 6).fill(0xffefa8).stroke({
        width: 4,
        color: 0x111111,
      });

      g.rect(x + 14, -94, 2, 30).fill(0x111111);

      g.rect(x, -80, 30, 2).fill(0x111111);

      // shine

      g.moveTo(x + 5, -90)
        .lineTo(x + 14, -84)
        .stroke({
          width: 2,
          color: 0xffffff,
          alpha: 0.7,
        });
    });

    //==============================
    // DOOR
    //==============================

    g.roundRect(-18, -60, 36, 60, 6).fill(0x593c28).stroke({
      width: 5,
      color: 0x111111,
    });

    g.rect(-16, -58, 6, 56).fill(0xffffff, 0.15);

    g.circle(8, -28, 3).fill(0xffd05e);

    //==============================
    // GRASS
    //==============================

    for (let x = -80; x < 80; x += 10) {
      g.moveTo(x, 0)
        .lineTo(x + 3, -7)
        .lineTo(x + 6, 0)
        .stroke({
          width: 2,
          color: 0x2d8734,
        });
    }

    this.smokeContainer = new Container();
    this.addChild(this.smokeContainer);

    this.smokePuffs = [];

    for (let i = 0; i < 8; i++) {
      const puff = new Graphics();

      puff.circle(0, 0, 8 + Math.random() * 6).fill({
        color: 0xffffff,
        alpha: 0.25,
      });

      puff.x = 47 + (Math.random() - 0.5) * 4; // Chimney X
      puff.y = -185 - i * 18; // Chimney Y

      puff.speed = 0.3 + Math.random() * 0.25;
      puff.drift = (Math.random() - 0.5) * 0.4;
      puff.scaleValue = 0.7 + Math.random() * 0.4;

      puff.scale.set(puff.scaleValue);

      this.smokeContainer.addChild(puff);
      this.smokePuffs.push(puff);
    }

    this.addChild(g);
  }

  createOffice() {
    const g = new Graphics();

    const wall = 0x45536e;
    const dark = this.shade(wall, -0.35);

    //==============================
    // BUILDING
    //==============================

    g.roundRect(-80, -220, 150, 220, 10).fill(wall).stroke({
      width: 5,
      color: 0x111111,
    });

    // shadow

    g.rect(20, -220, 50, 220).fill(dark);

    // highlight

    g.rect(-75, -216, 140, 8).fill(0xffffff, 0.25);

    //==============================
    // WINDOWS
    //==============================

    for (let y = -195; y < -25; y += 32) {
      for (let x = -55; x < 40; x += 34) {
        const lit = Math.random() > 0.25;

        g.roundRect(x, y, 22, 20, 4)
          .fill(lit ? 0xffe17a : 0x2b3444)
          .stroke({
            width: 3,
            color: 0x111111,
          });

        if (lit) {
          g.moveTo(x + 4, y + 4)
            .lineTo(x + 14, y + 8)
            .stroke({
              width: 2,
              color: 0xffffff,
              alpha: 0.7,
            });
        }
      }
    }

    //==============================
    // ROOF
    //==============================

    g.roundRect(-88, -232, 166, 14, 6).fill(0x262b36).stroke({
      width: 5,
      color: 0x111111,
    });

    // AC

    g.roundRect(-25, -248, 50, 14, 4).fill(0xb0b7c4).stroke({
      width: 4,
      color: 0x111111,
    });

    //==============================
    // SIGN
    //==============================

    g.roundRect(-42, -212, 84, 18, 6).fill(this.data.color).stroke({
      width: 4,
      color: 0x111111,
    });

    //==============================
    // ENTRANCE
    //==============================

    g.roundRect(-28, -56, 56, 56, 6).fill(0x1b202b).stroke({
      width: 5,
      color: 0x111111,
    });

    g.rect(-2, -56, 4, 56).fill(0x111111);

    g.rect(-24, -52, 48, 10).fill(0xffffff, 0.12);

    //==============================
    // STEPS
    //==============================

    g.roundRect(-36, 0, 72, 10, 4).fill(0x6b7488).stroke({
      width: 4,
      color: 0x111111,
    });

    g.roundRect(-42, 10, 84, 10, 4).fill(0x565e70).stroke({
      width: 4,
      color: 0x111111,
    });

    //==============================
    // SIDE BANNERS
    //==============================

    [-92, 72].forEach((x) => {
      g.roundRect(x, -170, 16, 70, 4).fill(this.data.color).stroke({
        width: 4,
        color: 0x111111,
      });
    });

    this.addChild(g);
  }

  createTower() {
    const g = new Graphics();

    const wall = 0x5867a8;
    const shadow = this.shade(wall, -0.35);

    //==========================
    // MAIN BODY
    //==========================

    g.roundRect(-60, -305, 120, 305, 12).fill(wall).stroke({
      width: 5,
      color: 0x111111,
    });

    // comic shadow

    g.roundRect(18, -305, 42, 305, 0).fill(shadow);

    // highlight

    g.rect(-56, -301, 108, 8).fill(0xffffff, 0.25);

    //==========================
    // TOP FLOOR
    //==========================

    g.roundRect(-40, -350, 80, 45, 10).fill(this.data.color).stroke({
      width: 5,
      color: 0x111111,
    });

    //==========================
    // ANTENNA
    //==========================

    g.rect(-2, -385, 4, 35).fill(0x333333);

    g.circle(0, -390, 7).fill(0xff5959).stroke({
      width: 4,
      color: 0x111111,
    });

    //==========================
    // WINDOW STRIPS
    //==========================

    for (let y = -320; y < -15; y += 26) {
      g.roundRect(-32, y, 64, 12, 5).fill(0x7ee9ff).stroke({
        width: 3,
        color: 0x111111,
      });

      g.rect(-28, y + 2, 56, 4).fill(0xffffff, 0.25);
    }

    //==========================
    // VERTICAL LINES
    //==========================

    [-20, 0, 20].forEach((x) => {
      g.moveTo(x, -300).lineTo(x, -5).stroke({
        width: 2,
        color: 0x2f3962,
        alpha: 0.7,
      });
    });

    //==========================
    // ENTRANCE
    //==========================

    g.roundRect(-22, -45, 44, 45, 6).fill(0x232323).stroke({
      width: 5,
      color: 0x111111,
    });

    g.rect(-18, -42, 36, 8).fill(0xffffff, 0.12);

    //==========================
    // STAIRS
    //==========================

    g.roundRect(-30, 0, 60, 10, 4).fill(0x6a7590).stroke({
      width: 4,
      color: 0x111111,
    });

    g.roundRect(-36, 10, 72, 10, 4).fill(0x596378).stroke({
      width: 4,
      color: 0x111111,
    });

    //==========================
    // SIDE LIGHTS
    //==========================

    [-72, 62].forEach((x) => {
      g.circle(x, -250, 8).fill(0xffd44d).stroke({
        width: 3,
        color: 0x111111,
      });
    });

    this.addChild(g);
  }

  createSchool() {
    const g = new Graphics();

    const wall = 0xf4d89a;
    const roof = this.data.color;

    //==========================
    // MAIN BUILDING
    //==========================

    g.roundRect(-90, -165, 180, 165, 10).fill(wall).stroke({
      width: 5,
      color: 0x111111,
    });

    // comic shadow

    g.rect(40, -165, 50, 165).fill(this.shade(wall, -0.28));

    // highlight

    g.rect(-86, -161, 170, 8).fill(0xffffff, 0.25);

    //==========================
    // ROOF
    //==========================

    g.moveTo(-105, -165)
      .lineTo(0, -235)
      .lineTo(105, -165)
      .closePath()
      .fill(roof)
      .stroke({
        width: 5,
        color: 0x111111,
      });

    // shadow

    g.moveTo(0, -235)
      .lineTo(105, -165)
      .lineTo(65, -165)
      .closePath()
      .fill(this.shade(roof, -0.35));

    //==========================
    // ROOF LINES
    //==========================

    for (let y = -215; y < -175; y += 10) {
      g.moveTo(-55, y)
        .lineTo(55, y + 8)
        .stroke({
          width: 2,
          color: this.shade(roof, -0.45),
        });
    }

    //==========================
    // CLOCK
    //==========================

    g.circle(0, -192, 17).fill(0xffffff).stroke({
      width: 4,
      color: 0x111111,
    });

    g.circle(0, -192, 2).fill(0x111111);

    g.moveTo(0, -192).lineTo(0, -202).stroke({
      width: 3,
      color: 0x111111,
    });

    g.moveTo(0, -192).lineTo(8, -188).stroke({
      width: 3,
      color: 0x111111,
    });

    //==========================
    // WINDOWS
    //==========================

    [-66, -26, 14, 54].forEach((x) => {
      g.roundRect(x, -132, 24, 32, 5).fill(0x87d7ff).stroke({
        width: 4,
        color: 0x111111,
      });

      g.rect(x + 11, -132, 2, 32).fill(0x111111);

      g.rect(x, -117, 24, 2).fill(0x111111);

      g.moveTo(x + 4, -128)
        .lineTo(x + 12, -122)
        .stroke({
          width: 2,
          color: 0xffffff,
          alpha: 0.7,
        });
    });

    //==========================
    // COLUMNS
    //==========================

    [-34, 24].forEach((x) => {
      g.roundRect(x, -100, 12, 100, 3).fill(0xfff9e9).stroke({
        width: 4,
        color: 0x111111,
      });
    });

    //==========================
    // DOOR
    //==========================

    g.roundRect(-20, -65, 40, 65, 6).fill(0x734d2d).stroke({
      width: 5,
      color: 0x111111,
    });

    g.circle(10, -30, 3).fill(0xffd75a);

    //==========================
    // SCHOOL FLAG
    //==========================

    g.rect(72, -235, 4, 60).fill(0x555555);

    g.moveTo(76, -230)
      .lineTo(105, -220)
      .lineTo(76, -208)
      .closePath()
      .fill(this.data.color)
      .stroke({
        width: 3,
        color: 0x111111,
      });

    //==========================
    // STAIRS
    //==========================

    g.roundRect(-35, 0, 70, 10, 4).fill(0x8f8f8f).stroke({
      width: 4,
      color: 0x111111,
    });

    g.roundRect(-42, 10, 84, 10, 4).fill(0x777777).stroke({
      width: 4,
      color: 0x111111,
    });

    this.addChild(g);
  }

  createStudio() {
    const g = new Graphics();

    const wall = 0x6f63d8;
    const shadow = this.shade(wall, -0.35);
    const accent = this.data.color;

    // ==========================
    // MAIN BUILDING
    // ==========================

    g.roundRect(-100, -170, 200, 170, 14).fill(wall).stroke({
      width: 5,
      color: 0x111111,
    });

    // Comic shadow
    g.rect(40, -170, 60, 170).fill(shadow);

    // Highlight
    g.rect(-95, -165, 180, 8).fill(0xffffff, 0.25);

    // ==========================
    // BIG DISPLAY WINDOW
    // ==========================

    g.roundRect(-70, -125, 140, 72, 8).fill(0xa9f2ff).stroke({
      width: 5,
      color: 0x111111,
    });

    // Reflection

    g.moveTo(-58, -118).lineTo(-20, -90).stroke({
      width: 4,
      color: 0xffffff,
      alpha: 0.55,
    });

    g.moveTo(-8, -118).lineTo(30, -90).stroke({
      width: 4,
      color: 0xffffff,
      alpha: 0.35,
    });

    // ==========================
    // PAINT PALETTE
    // ==========================

    g.circle(0, -88, 18).fill(accent).stroke({
      width: 4,
      color: 0x111111,
    });

    [
      [-6, -5, 0xff595e],
      [7, -8, 0xffca3a],
      [8, 6, 0x8ac926],
      [-8, 8, 0x1982c4],
    ].forEach(([dx, dy, c]) => {
      g.circle(dx, -88 + dy, 4).fill(c);
    });

    // ==========================
    // PAINT BRUSH
    // ==========================

    g.moveTo(35, -145).lineTo(70, -105).stroke({
      width: 7,
      color: 0x8b5a2b,
    });

    g.circle(72, -103, 7).fill(accent).stroke({
      width: 3,
      color: 0x111111,
    });

    // ==========================
    // DOOR
    // ==========================

    g.roundRect(-18, -46, 36, 46, 6).fill(0x2e2538).stroke({
      width: 5,
      color: 0x111111,
    });

    g.circle(8, -24, 3).fill(0xffd95b);

    // ==========================
    // COLOR SPLASHES
    // ==========================

    [
      [-85, -150],
      [82, -145],
      [-60, -25],
      [72, -38],
    ].forEach(([x, y]) => {
      g.circle(x, y, 6).fill(accent).stroke({
        width: 2,
        color: 0x111111,
      });
    });

    // ==========================
    // STEPS
    // ==========================

    g.roundRect(-34, 0, 68, 10, 4).fill(0x888888).stroke({
      width: 4,
      color: 0x111111,
    });

    g.roundRect(-40, 10, 80, 10, 4).fill(0x6d6d6d).stroke({
      width: 4,
      color: 0x111111,
    });

    this.addChild(g);
  }

  createCafe() {
    const g = new Graphics();

    const wall = 0xd68c74;
    const shadow = this.shade(wall, -0.3);
    const awning = this.data.color;

    // ==========================
    // BUILDING
    // ==========================

    g.roundRect(-80, -130, 160, 130, 12).fill(wall).stroke({
      width: 5,
      color: 0x111111,
    });

    // Comic shadow

    g.rect(35, -130, 45, 130).fill(shadow);

    // Highlight

    g.rect(-75, -126, 145, 8).fill(0xffffff, 0.25);

    // ==========================
    // AWNING
    // ==========================

    g.roundRect(-95, -150, 190, 22, 8).fill(awning).stroke({
      width: 5,
      color: 0x111111,
    });

    for (let x = -90; x < 90; x += 20) {
      g.circle(x + 10, -128, 10)
        .fill(awning)
        .stroke({
          width: 3,
          color: 0x111111,
        });
    }

    // ==========================
    // COFFEE SIGN
    // ==========================

    g.circle(0, -172, 20).fill(0xffffff).stroke({
      width: 5,
      color: 0x111111,
    });

    // Cup

    g.roundRect(-8, -168, 16, 12, 3).fill(0x8b5a2b);

    g.moveTo(-4, -174).lineTo(-4, -182).stroke({
      width: 2,
      color: 0xffffff,
    });

    g.moveTo(4, -174).lineTo(4, -182).stroke({
      width: 2,
      color: 0xffffff,
    });

    // ==========================
    // WINDOWS
    // ==========================

    [-58, 28].forEach((x) => {
      g.roundRect(x, -104, 30, 36, 6).fill(0xfff1a8).stroke({
        width: 4,
        color: 0x111111,
      });

      g.rect(x + 14, -104, 2, 36).fill(0x111111);

      g.rect(x, -87, 30, 2).fill(0x111111);

      g.moveTo(x + 5, -98)
        .lineTo(x + 14, -90)
        .stroke({
          width: 2,
          color: 0xffffff,
          alpha: 0.7,
        });
    });

    // ==========================
    // DOOR
    // ==========================

    g.roundRect(-18, -58, 36, 58, 6).fill(0x5a3726).stroke({
      width: 5,
      color: 0x111111,
    });

    g.circle(8, -30, 3).fill(0xffd65c);

    // ==========================
    // SMALL TABLE
    // ==========================

    g.circle(-110, -20, 10).fill(0xc8c8c8).stroke({
      width: 3,
      color: 0x111111,
    });

    g.rect(-111, -20, 2, 18).fill(0x555555);

    // Chair

    g.roundRect(-126, -6, 10, 10, 2).fill(0x7c4b33).stroke({
      width: 2,
      color: 0x111111,
    });

    g.roundRect(-100, -6, 10, 10, 2).fill(0x7c4b33).stroke({
      width: 2,
      color: 0x111111,
    });

    // ==========================
    // FLOWER POT
    // ==========================

    g.rect(92, -16, 12, 12).fill(0x7b4d25).stroke({
      width: 2,
      color: 0x111111,
    });

    g.circle(98, -24, 8).fill(0x5fcb55).stroke({
      width: 2,
      color: 0x111111,
    });

    // ==========================
    // STEPS
    // ==========================

    g.roundRect(-30, 0, 60, 10, 4).fill(0x909090).stroke({
      width: 4,
      color: 0x111111,
    });

    g.roundRect(-38, 10, 76, 10, 4).fill(0x727272).stroke({
      width: 4,
      color: 0x111111,
    });

    this.addChild(g);
  }

  // ---------- sign ----------

  createSign() {
    const plate = new Graphics();

    const label = this.data.label ?? "";
    const plateWidth = Math.max(200, label.length * 9 + 24);

    plate
      .roundRect(-plateWidth / 2, -this.data.h - 25, plateWidth, 50, 6)
      .fill({ color: 0x0d0d14, alpha: 0.75 });

    plate
      .roundRect(-plateWidth / 2, -this.data.h - 25, plateWidth, 50, 6)
      .stroke({ width: 5, color: this.data.color, alpha: 0.8 });

    // small pole connecting sign to roofline
    plate.rect(-1, -350, 2, 25).fill({ color: 0x0d0d14, alpha: 0.6 });

    this.addChild(plate);

    const sign = new Text({
      text: label,
      style: {
        fontFamily: "Sans Serif",
        fontSize: 30,
        fontWeight: "bold",
        fill: 0xffffff,
        align: "center",
      },
    });

    sign.anchor.set(0.5);
    sign.y = -this.data.h;

    this.addChild(sign);
  }

  update(delta) {
    if (!this.smokePuffs) return;

    for (const puff of this.smokePuffs) {
      puff.y -= puff.speed * delta;
      puff.x += Math.sin(performance.now() * 0.001 + puff.y) * puff.drift;

      puff.scale.x += 0.0025 * delta;
      puff.scale.y += 0.0025 * delta;

      puff.alpha -= 0.0018 * delta;

      if (puff.alpha <= 0) {
        puff.x = 47 + (Math.random() - 0.5) * 4;
        puff.y = -185;

        puff.alpha = 0.25;

        puff.scale.set(0.7 + Math.random() * 0.4);
      }
    }
  }
}
