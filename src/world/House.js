import { Assets, Container, Graphics, Sprite, Text } from "pixi.js";

export class House extends Container {
  constructor() {
    super();

    this.build();
  }

  async build() {
    let texture = null;
    try {
      texture = Assets.get("home") || Assets.get("./assets/home.png");
    } catch {
      // Fallback
    }

    if (!texture) {
      try {
        texture = await Assets.load("./assets/home.png");
      } catch (err) {
        console.warn("Failed to load house texture, fallback to graphics", err);
      }
    }

    if (texture) {
      const homeSprite = new Sprite(texture);
      homeSprite.scale = 0.08;
      homeSprite.position.set(-230, -300);
      this.addChild(homeSprite);
    } else {
      const house = new Graphics();
      house
        .rect(-90, -150, 180, 150)
        .fill(0x2c2140)
        .stroke({ width: 3, color: 0xffcf7a });
      house
        .moveTo(-100, -150)
        .lineTo(0, -215)
        .lineTo(100, -150)
        .closePath()
        .fill(0xffcf7a);
      house.roundRect(20, -84, 44, 84, 4).fill(0x0d0a16);
      this.addChild(house);
    }

    // HOME label
    const label = new Text({
      text: "HOME",
      style: {
        fontFamily: "Sans Serif",
        fontSize: 24,
        fill: 0xffcf7a,
        fontWeight: "bold",
      },
    });

    label.anchor.set(0.5);
    label.position.set(-15, -150);

    this.addChild(label);
  }
}
