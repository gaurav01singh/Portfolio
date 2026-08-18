import { Container, FillGradient, Graphics } from "pixi.js";

export class Skyline extends Container {
  constructor(width, height, groundY) {
    super();

    this.worldWidth = 4000;
    this.screenHeight = height;
    this.groundY = groundY;

    console.log(this.worldWidth);

    this.stars = [];

    this.build();
  }

  build() {
    this.createSky();
    this.createMoon();
    this.createStars();
    this.createClouds();
    this.createSkyline();
  }

  createMoon() {
    const moon = new Graphics();

    // Outer glow
    moon.circle(0, 0, 55).fill({
      color: 0xfff5d6,
      alpha: 0.12,
    });

    moon.circle(0, 0, 42).fill({
      color: 0xfff5d6,
      alpha: 0.18,
    });

    // Moon
    moon.circle(0, 0, 28).fill(0xfff3d4);

    // Craters
    moon.circle(-8, -5, 3).fill(0xffe8b0);

    moon.circle(10, 8, 5).fill(0xffe8b0);

    moon.circle(3, -12, 2).fill(0xffe8b0);

    moon.position.set(400, 200);

    this.addChild(moon);
  }

  createStars() {
    for (let i = 0; i < 40; i++) {
      const star = new Graphics();

      const r = Math.random() * 1.8 + 0.5;

      star.circle(0, 0, r).fill({
        color: 0xffffff,
        alpha: Math.random() * 0.6 + 0.3,
      });

      star.x = Math.random() * this.worldWidth;
      star.y = Math.random() * this.screenHeight;

      star.baseAlpha = star.alpha;
      star.offset = Math.random() * Math.PI * 2;

      this.stars.push(star);
      this.addChild(star);
    }
  }

  createClouds() {
    this.clouds = [];

    for (let i = 0; i < 30; i++) {
      const cloud = new Container();

      const g = new Graphics();

      const color = 0x4a3654;

      g.circle(-35, 0, 24).fill({ color, alpha: 0.85 });
      g.circle(-10, -10, 30).fill({ color, alpha: 0.9 });
      g.circle(22, -4, 26).fill({ color, alpha: 0.9 });
      g.circle(48, 6, 18).fill({ color, alpha: 0.85 });

      g.roundRect(-45, -8, 100, 26, 12).fill({ color, alpha: 0.9 });

      cloud.addChild(g);

      cloud.x = Math.random() * this.worldWidth;
      cloud.y = 40 + Math.random() * (this.screenHeight * 0.35);

      const scale = 0.7 + Math.random() * 1.2;
      cloud.scale.set(scale);

      cloud.speed = 0.05 + Math.random() * 0.08;

      this.clouds.push(cloud);
      this.addChild(cloud);
    }
  }

  createSkyline() {
    const g = new Graphics();

    g.beginFill(0x1a102d);

    let x = -200;

    while (x < this.worldWidth + 300) {
      const w = 60 + Math.random() * 80;
      const h = 80 + Math.random() * 180;

      g.drawRect(x, this.groundY - h, w, h);

      // antennas
      if (Math.random() > 0.6) {
        g.drawRect(x + w * 0.5, this.groundY - h - 25, 3, 25);
      }

      // rooftop
      if (Math.random() > 0.5) {
        g.drawRect(x + w * 0.2, this.groundY - h - 8, w * 0.5, 8);
      }

      x += w + Math.random() * 18;
    }

    g.endFill();
    const glow = new Graphics();

    glow.rect(0, this.groundY - 120, this.worldWidth, 120).fill({
      color: 0xffb26f,
      alpha: 0.18,
    });

    this.addChild(glow);

    this.addChild(g);
  }

  update(delta) {
    const t = performance.now() * 0.0015;

    this.stars.forEach((star) => {
      star.alpha = star.baseAlpha * (0.6 + 0.4 * Math.sin(t * 3 + star.offset));
    });

    this.clouds.forEach((cloud) => {
      cloud.x += cloud.speed * delta;

      if (cloud.x > this.worldWidth + 120) {
        cloud.x = -120;
      }
    });
  }
  createSky() {
    const gradient = new FillGradient({
      type: "linear",
      start: { x: 0, y: 0 },
      end: { x: 0, y: 1 },
    });

    gradient.addColorStop(0, "#17203D");
    gradient.addColorStop(0.35, "#4B3D73");
    gradient.addColorStop(0.75, "#ca7526");
    gradient.addColorStop(1, "#FFB87A");

    const sky = new Graphics();

    sky.rect(0, 0, this.worldWidth, this.screenHeight);

    sky.fill(gradient);

    this.addChild(sky);
  }
}
