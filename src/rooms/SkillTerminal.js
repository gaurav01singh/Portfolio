import { Container, Graphics, Text } from "pixi.js";

export class SkillTerminal extends Container {
  constructor(skillData) {
    super();

    this.skill = skillData;
    this.title = skillData.name;
    this.icon = skillData.icon ?? "";
    this.level = skillData.level ?? "Advanced";
    this.progress = skillData.progress ?? 0.9;
    this.category = skillData.category ?? "Tech";
    this.color = skillData.color ?? 0xfacc15;
    this.desc = skillData.desc ?? "";

    this.isHovered = false;
    this.widthVal = 175;
    this.heightVal = 100;

    this.eventMode = "static";
    this.cursor = "pointer";

    this.build();
    this.bindEvents();
  }

  build() {
    this.cardContainer = new Container();
    this.addChild(this.cardContainer);

    // Shadow
    this.shadow = new Graphics()
      .roundRect(4, 6, this.widthVal, this.heightVal, 10)
      .fill({ color: 0x000000, alpha: 0.4 });

    // Base Casing
    this.casing = new Graphics()
      .roundRect(0, 0, this.widthVal, this.heightVal, 10)
      .fill(0x131724)
      .stroke({ width: 2, color: 0x27324c });

    // Glowing top accent stripe
    this.accentLine = new Graphics()
      .roundRect(0, 0, this.widthVal, 4, 2)
      .fill(this.color);

    this.cardContainer.addChild(this.shadow, this.casing, this.accentLine);

    // Icon Box
    const iconBg = new Graphics()
      .roundRect(10, 14, 30, 30, 6)
      .fill({ color: this.color, alpha: 0.15 })
      .stroke({ width: 1.5, color: this.color, alpha: 0.6 });

    const iconTxt = new Text({
      text: this.icon,
      style: { fontSize: 16 },
    });
    iconTxt.anchor.set(0.5);
    iconTxt.position.set(25, 29);

    this.cardContainer.addChild(iconBg, iconTxt);

    // Skill Name
    this.titleTxt = new Text({
      text: this.title,
      style: {
        fontFamily: "system-ui, -apple-system, sans-serif",
        fontSize: 14,
        fontWeight: "bold",
        fill: 0xffffff,
      },
    });
    this.titleTxt.position.set(48, 14);

    // Category / Subtext
    const catTxt = new Text({
      text: this.category.toUpperCase(),
      style: {
        fontFamily: "system-ui, sans-serif",
        fontSize: 9.5,
        fontWeight: "700",
        fill: 0x7e8ea8,
        letterSpacing: 1,
      },
    });
    catTxt.position.set(48, 30);

    this.cardContainer.addChild(this.titleTxt, catTxt);

    // Proficiency Progress Bar
    const barBg = new Graphics()
      .roundRect(10, 56, this.widthVal - 20, 7, 3.5)
      .fill(0x0e111a);

    const barFill = new Graphics()
      .roundRect(10, 56, (this.widthVal - 20) * this.progress, 7, 3.5)
      .fill(this.color);

    this.cardContainer.addChild(barBg, barFill);

    // Level text & Status LED
    this.led = new Graphics().circle(16, 78, 3.5).fill(this.color);

    const lvlTxt = new Text({
      text: this.level,
      style: {
        fontFamily: "system-ui, sans-serif",
        fontSize: 10,
        fontWeight: "600",
        fill: 0xabbcd5,
      },
    });
    lvlTxt.position.set(26, 71);

    this.cardContainer.addChild(this.led, lvlTxt);
  }

  bindEvents() {
    this.on("pointerover", () => {
      this.isHovered = true;
      this.casing
        .clear()
        .roundRect(0, 0, this.widthVal, this.heightVal, 10)
        .fill(0x1a2133)
        .stroke({ width: 2, color: this.color });

      this.titleTxt.style.fill = this.color;
      this.cardContainer.scale.set(1.04);
      this.cardContainer.position.set(
        -this.widthVal * 0.02,
        -this.heightVal * 0.02,
      );
    });

    this.on("pointerout", () => {
      this.isHovered = false;
      this.casing
        .clear()
        .roundRect(0, 0, this.widthVal, this.heightVal, 10)
        .fill(0x131724)
        .stroke({ width: 2, color: 0x27324c });

      this.titleTxt.style.fill = 0xffffff;
      this.cardContainer.scale.set(1.0);
      this.cardContainer.position.set(0, 0);
    });
  }
}
