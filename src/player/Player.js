import { Container, Graphics, Text } from "pixi.js";

export class Player extends Container {
  constructor() {
    super();

    this.speed = 5;

    this.velocityX = 0;
    this.velocityY = 0;

    this.gravity = 0.8;
    this.jumpForce = -16;

    this.isGrounded = true;

    this.keys = {};

    window.addEventListener("keydown", (e) => {
      this.keys[e.code] = true;
    });

    window.addEventListener("keyup", (e) => {
      this.keys[e.code] = false;
    });

    this.build();

    this.showNameTag = true;
    this.canControl = true;
  }

  build() {
    const shadow = new Graphics();

    shadow.ellipse(0, 6, 28, 10).fill({
      color: 0x000000,
      alpha: 0.22,
    });

    shadow.ellipse(0, 6, 18, 5).fill({
      color: 0xffffff,
      alpha: 0.05,
    });

    this.addChild(shadow);

    // =====================================
    // LEFT LEG
    // =====================================

    this.leftLeg = new Container();
    this.leftLeg.position.set(-9, -44);

    const leftLeg = new Graphics();

    // Main leg

    leftLeg.roundRect(-6, 0, 12, 38, 5).fill(0x27314e).stroke({
      width: 4,
      color: 0x111111,
    });

    // Cel shadow

    leftLeg.rect(1, 0, 5, 38).fill(0x1c2337);

    // Highlight

    leftLeg.rect(-4, 2, 2, 34).fill({
      color: 0xffffff,
      alpha: 0.15,
    });

    // Shoe

    leftLeg.roundRect(-9, 36, 18, 8, 4).fill(0x2d2d2d).stroke({
      width: 3,
      color: 0x111111,
    });

    // Shoe highlight

    leftLeg.rect(-6, 38, 10, 2).fill({
      color: 0xffffff,
      alpha: 0.12,
    });

    this.leftLeg.addChild(leftLeg);

    // =====================================
    // RIGHT LEG
    // =====================================

    this.rightLeg = new Container();
    this.rightLeg.position.set(9, -44);

    const rightLeg = new Graphics();

    rightLeg.roundRect(-6, 0, 12, 38, 5).fill(0x324062).stroke({
      width: 4,
      color: 0x111111,
    });

    rightLeg.rect(1, 0, 5, 38).fill(0x202944);

    rightLeg.rect(-4, 2, 2, 34).fill({
      color: 0xffffff,
      alpha: 0.15,
    });

    rightLeg.roundRect(-9, 36, 18, 8, 4).fill(0x2d2d2d).stroke({
      width: 3,
      color: 0x111111,
    });

    rightLeg.rect(-6, 38, 10, 2).fill({
      color: 0xffffff,
      alpha: 0.12,
    });

    this.rightLeg.addChild(rightLeg);

    const body = new Graphics();

    // Hoodie

    body.roundRect(-20, -84, 40, 46, 8).fill(0xc62828).stroke({
      width: 5,
      color: 0x111111,
    });

    // Cel shadow

    body
      .moveTo(2, -84)
      .lineTo(20, -84)
      .lineTo(20, -38)
      .lineTo(8, -38)
      .closePath()
      .fill(0x8e1c1c);

    // Left highlight

    body.rect(-17, -80, 3, 38).fill({
      color: 0xffffff,
      alpha: 0.18,
    });

    // Hoodie pocket

    body.roundRect(-12, -60, 24, 14, 4).fill(0xb01e1e).stroke({
      width: 2,
      color: 0x111111,
    });

    // Zipper

    body.rect(-1, -82, 2, 44).fill(0xffffff, 0.25);

    // Collar

    body.moveTo(-10, -84).lineTo(0, -74).lineTo(10, -84).stroke({
      width: 3,
      color: 0x111111,
    });

    // Hoodie strings

    body.moveTo(-5, -74).lineTo(-5, -60).stroke({
      width: 2,
      color: 0xeeeeee,
    });

    body.moveTo(5, -74).lineTo(5, -58).stroke({
      width: 2,
      color: 0xeeeeee,
    });

    // Bottom shirt line

    body.moveTo(-16, -40).lineTo(16, -40).stroke({
      width: 2,
      color: 0x8e1c1c,
    });

    this.addChild(this.leftLeg, this.rightLeg);

    this.leftArm = new Container();
    this.leftArm.position.set(-22, -80);

    const leftArm = new Graphics();

    // Sleeve

    leftArm.roundRect(-5, 0, 10, 32, 5).fill(0xc62828).stroke({
      width: 4,
      color: 0x111111,
    });

    // Shadow

    leftArm.rect(1, 0, 4, 32).fill(0x8e1c1c);

    // Highlight

    leftArm.rect(-3, 2, 2, 28).fill({
      color: 0xffffff,
      alpha: 0.18,
    });

    // Hand

    leftArm.circle(0, 36, 6).fill(0xf2c38b).stroke({
      width: 3,
      color: 0x111111,
    });

    this.leftArm.addChild(leftArm);

    // =====================================
    // RIGHT ARM
    // =====================================

    this.rightArm = new Container();
    this.rightArm.position.set(22, -80);

    const rightArm = new Graphics();

    rightArm.roundRect(-5, 0, 10, 32, 5).fill(0xd32f2f).stroke({
      width: 4,
      color: 0x111111,
    });

    rightArm.rect(1, 0, 4, 32).fill(0x8e1c1c);

    rightArm.rect(-3, 2, 2, 28).fill({
      color: 0xffffff,
      alpha: 0.18,
    });

    rightArm.circle(0, 36, 6).fill(0xf2c38b).stroke({
      width: 3,
      color: 0x111111,
    });

    this.rightArm.addChild(rightArm);

    // =====================================
    // HEAD
    // =====================================

    const head = new Graphics();

    // Face

    head

      .roundRect(-18, -122, 36, 36, 8)

      .fill(0xf2c38b)

      .stroke({
        width: 5,
        color: 0x111111,
      });

    // Face shadow

    head

      .moveTo(3, -122)
      .lineTo(18, -122)
      .lineTo(18, -86)
      .lineTo(8, -86)
      .closePath()

      .fill(0xd8a86f);

    // Face highlight

    head

      .circle(-7, -113, 6)

      .fill({
        color: 0xffffff,
        alpha: 0.18,
      });

    // =====================================
    // EARS
    // =====================================

    head

      .circle(-20, -104, 4)

      .fill(0xf2c38b)

      .stroke({
        width: 3,
        color: 0x111111,
      });

    head

      .circle(20, -104, 4)

      .fill(0xf2c38b)

      .stroke({
        width: 3,
        color: 0x111111,
      });

    // =====================================
    // HAIR
    // =====================================

    head

      .roundRect(-20, -126, 40, 16, 8)

      .fill(0x2a1f1a)

      .stroke({
        width: 5,
        color: 0x111111,
      });

    // Hair spikes

    head

      .moveTo(-18, -114)
      .lineTo(-12, -126)
      .lineTo(-6, -114)
      .closePath()
      .fill(0x2a1f1a);

    head

      .moveTo(-4, -114)
      .lineTo(2, -128)
      .lineTo(8, -114)
      .closePath()
      .fill(0x2a1f1a);

    head

      .moveTo(10, -114)
      .lineTo(16, -124)
      .lineTo(20, -114)
      .closePath()
      .fill(0x2a1f1a);

    // Hair highlight

    head

      .rect(-15, -123, 18, 3)

      .fill({
        color: 0xffffff,
        alpha: 0.12,
      });

    // =====================================
    // EYEBROWS
    // =====================================

    head

      .moveTo(-10, -108)
      .lineTo(-3, -109)

      .stroke({
        width: 2,
        color: 0x3a2415,
      });

    head

      .moveTo(3, -109)
      .lineTo(10, -108)

      .stroke({
        width: 2,
        color: 0x3a2415,
      });

    // =====================================
    // EYES
    // =====================================

    head

      .circle(-7, -101, 3)

      .fill(0xffffff)

      .stroke({
        width: 2,
        color: 0x111111,
      });

    head

      .circle(7, -101, 3)

      .fill(0xffffff)

      .stroke({
        width: 2,
        color: 0x111111,
      });

    head

      .circle(-7, -101, 1.5)

      .fill(0x111111);

    head

      .circle(7, -101, 1.5)

      .fill(0x111111);

    // Eye shine

    head

      .circle(-6, -102, 0.5)

      .fill(0xffffff);

    head

      .circle(8, -102, 0.5)

      .fill(0xffffff);

    this.addChild(this.leftArm, body, this.rightArm, head);
    // =====================================
    // COMIC NAME TAG
    // =====================================

    this.nameTag = new Container();

    const TAG_WIDTH = 170;
    const TAG_HEIGHT = 50;

    // Shadow

    const tagShadow = new Graphics();

    tagShadow

      .roundRect(-TAG_WIDTH / 2 + 3, -205 + 4, TAG_WIDTH, TAG_HEIGHT, 14)

      .fill({
        color: 0x000000,
        alpha: 0.18,
      });

    this.nameTag.addChild(tagShadow);

    // Bubble

    const tagBg = new Graphics();

    tagBg

      .roundRect(-TAG_WIDTH / 2, -205, TAG_WIDTH, TAG_HEIGHT, 14)

      .fill(0xffffff)

      .stroke({
        width: 5,
        color: 0x111111,
        join: "round",
      });

    this.nameTag.addChild(tagBg);

    // Green status dot

    const status = new Graphics();

    status

      .circle(-TAG_WIDTH / 2 + 18, -180, 7)

      .fill(0x45d95b)

      .stroke({
        width: 3,
        color: 0x111111,
      });

    this.nameTag.addChild(status);

    // Name

    const tagText = new Text({
      text: "PLAYER",

      style: {
        fontFamily: "Arial",

        fontSize: 20,

        fontWeight: "900",

        fill: 0x222222,
      },
    });

    tagText.anchor.set(0.5);
    tagText.position.set(8, -181);

    this.nameTag.addChild(tagText);

    const arrow = new Graphics();

    arrow

      .moveTo(0, -155)

      .lineTo(-10, -170)

      .lineTo(10, -170)

      .closePath()

      .fill(0xffffff)

      .stroke({
        width: 5,
        color: 0x111111,
      });

    this.nameTag.addChild(arrow);

    // Small shine

    const shine = new Graphics();

    shine

      .roundRect(-58, -198, 46, 6, 3)

      .fill({
        color: 0xffffff,
        alpha: 0.35,
      });

    this.nameTag.addChild(shine);

    this.nameTag.alpha = 1;

    this.addChild(this.nameTag);

    // =====================================
    // ADD ALL PARTS
    // =====================================

    this.addChild(
      this.leftLeg,
      this.rightLeg,
      this.rightArm,
      body,
      this.leftArm,
      head,
    );
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
  addControls() {
    window.addEventListener("keydown", (e) => {
      switch (e.code) {
        case "ArrowLeft":
        case "KeyA":
          this.keys.left = true;
          break;

        case "ArrowRight":
        case "KeyD":
          this.keys.right = true;
          break;

        case "ArrowUp":
        case "KeyW":
          this.keys.up = true;
          break;

        case "ArrowDown":
        case "KeyS":
          this.keys.down = true;
          break;
      }
    });

    window.addEventListener("keyup", (e) => {
      switch (e.code) {
        case "ArrowLeft":
        case "KeyA":
          this.keys.left = false;
          break;

        case "ArrowRight":
        case "KeyD":
          this.keys.right = false;
          break;

        case "ArrowUp":
        case "KeyW":
          this.keys.up = false;
          break;

        case "ArrowDown":
        case "KeyS":
          this.keys.down = false;
          break;
      }
    });
  }

  waveHand(deltaTime) {
    if (this.destroyed) return;
    this.waveTime ??= 0;
    this.waveTime += (deltaTime || 1) * 0.15;

    if (this.rightArm) {
      this.rightArm.rotation = -Math.PI / 1.5 + Math.sin(this.waveTime) * 0.5;
    }
  }

  update(delta, groundY, worldWidth) {
    if (!this.canControl) {
      this.velocityX = 0;
      this.leftLeg.rotation = 0;
      this.rightLeg.rotation = 0;
      this.leftArm.rotation = 0;
      this.rightArm.rotation = 0;
      return;
    }

    // Horizontal Movement
    if (this.keys["ArrowLeft"] || this.keys["KeyA"]) {
      this.velocityX = -this.speed;
    } else if (this.keys["ArrowRight"] || this.keys["KeyD"]) {
      this.velocityX = this.speed;
    } else {
      this.velocityX = 0;
    }

    this.x += this.velocityX * delta;

    // Jump
    if (
      (this.keys["ArrowUp"] || this.keys["KeyW"] || this.keys["Space"]) &&
      this.isGrounded
    ) {
      this.velocityY = this.jumpForce;
      this.isGrounded = false;
    }

    // Gravity
    this.velocityY += this.gravity * delta;

    this.y += this.velocityY * delta;
    const PLAYER_HALF_WIDTH = 12;

    if (this.x < PLAYER_HALF_WIDTH) {
      this.x = PLAYER_HALF_WIDTH;
    }

    // Right boundary
    if (this.x > worldWidth - PLAYER_HALF_WIDTH) {
      this.x = worldWidth - PLAYER_HALF_WIDTH;
    }

    // Ground Collision
    if (this.y >= groundY) {
      this.y = groundY;

      this.velocityY = 0;

      this.isGrounded = true;
    }

    if (this.velocityX !== 0) {
      const t = performance.now() * 0.015;

      this.leftLeg.rotation = Math.sin(t) * 0.5;
      this.rightLeg.rotation = -Math.sin(t) * 0.5;

      this.leftArm.rotation = -Math.sin(t) * 0.35;
      this.rightArm.rotation = Math.sin(t) * 0.35;

      this.scale.x = this.velocityX > 0 ? 1 : -1;
    } else {
      this.leftLeg.rotation = 0;
      this.rightLeg.rotation = 0;

      this.leftArm.rotation = 0;
      this.rightArm.rotation = 0;
    }

    if (this.velocityX !== 0) {
      this.showNameTag = false;
    }

    const targetAlpha = this.showNameTag ? 1 : 0;
    this.nameTag.alpha += (targetAlpha - this.nameTag.alpha) * 0.1;

    const t = performance.now() * 0.003;

    this.nameTag.y = Math.sin(t) * 4;
    // const s = 1 + Math.sin(t * 1.5) * 0.03;

    // this.nameTag.scale.set(s);
  }
}
