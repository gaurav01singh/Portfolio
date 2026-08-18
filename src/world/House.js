import { Assets, Container, Graphics, Sprite, Text } from "pixi.js";

export class House extends Container {
  constructor() {
    super();

    this.build();
  }

  async build() {
    // Main building
    const house = new Graphics();

    house
      .rect(-90, -150, 180, 150)
      .fill(0x2c2140)
      .stroke({ width: 3, color: 0xffcf7a });

    // Roof
    house
      .moveTo(-100, -150)
      .lineTo(0, -215)
      .lineTo(100, -150)
      .closePath()
      .fill(0xffcf7a);

    // Door
    house.roundRect(20, -84, 44, 84, 4).fill(0x0d0a16);

    // Window
    house
      .roundRect(-64, -110, 36, 36, 3)
      .fill({ color: 0xffe9b8, alpha: 0.85 })
      .stroke({ width: 2, color: 0xffcf7a });

    // this.addChild(house);

    const texture = await Assets.load("./assets/home.png");
    console.log(texture);

    const homeSprite = new Sprite(texture);
    console.log(homeSprite.width, homeSprite.height);
    homeSprite.scale = 0.08;
    homeSprite.position.set(-230, -300);

    this.addChild(homeSprite);

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
