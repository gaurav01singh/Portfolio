import { Container, Graphics, Text } from "pixi.js";
import { Room } from "./Room";
import { Player } from "../player/Player";
import { Spring } from "../utils/Juice";
import { PORTFOLIO } from "../data/portfolio";
import { createAboutShader } from "../utils/RoomShaders";

export class AboutRoom extends Room {
  constructor(app) {
    super(app, {
      accentColor: PORTFOLIO.about.accentColor ?? 0x3ecf8e,
      title: "Gaurav's Dev Studio",
      type: "Studio",
      icon: "",
    });
  }

  buildRoom() {
    const rw = this.roomWidth;
    const rh = this.roomHeight;
    const floorY = rh * 0.72;

    // Attach Warm Ambient Studio Shader
    this.shaderFilter = createAboutShader();
    if (this.shaderFilter) {
      this.backgroundLayer.filters = [this.shaderFilter];
    }

    // ============================================
    // 1. BACKGROUND: ROOM WALLS & WINDOW
    // ============================================
    const wall = new Graphics();

    // Studio Wall with warm ambient gradient styling
    wall.rect(0, 0, rw, floorY).fill(0x181c28);

    // Warm brick/paneling texture
    for (let by = 20; by < floorY - 20; by += 28) {
      for (let bx = 10; bx < rw; bx += 70) {
        const offset = (Math.floor(by / 28) % 2) * 35;
        wall
          .moveTo(bx + offset, by)
          .lineTo(bx + offset + 50, by)
          .stroke({ width: 1, color: 0x222838, alpha: 0.7 });
      }
    }

    // Cozy Night Window (Center-Left)
    wall
      .roundRect(rw * 0.15, 60, 140, 160, 12)
      .fill(0x0a1020)
      .stroke({ width: 6, color: 0x3d3028 });

    // Moon & Stars outside window
    wall.circle(rw * 0.15 + 100, 105, 16).fill(0xffeaa7);
    wall.circle(rw * 0.15 + 40, 90, 2).fill(0xffffff);
    wall.circle(rw * 0.15 + 65, 140, 2).fill(0xffffff);
    wall.circle(rw * 0.15 + 115, 170, 1.5).fill(0xffffff);

    // Window crossbeams
    wall.rect(rw * 0.15 + 68, 60, 4, 160).fill(0x3d3028);
    wall.rect(rw * 0.15, 140, 140, 4).fill(0x3d3028);

    // Motivational Poster: "EAT. CODE. SHIP."
    wall
      .roundRect(rw * 0.46, 70, 100, 70, 4)
      .fill(0x111624)
      .stroke({ width: 3, color: 0x3ecf8e });
    wall.rect(rw * 0.46 + 6, 76, 88, 58).fill(0x0c101c);
    wall.circle(rw * 0.46 + 50, 105, 12).fill({ color: 0x3ecf8e, alpha: 0.8 });

    // Fairy String Lights hanging along the wall
    for (let lx = 40; lx < rw - 40; lx += 45) {
      wall.circle(lx, 42, 4.5).fill(0xffd166);
    }

    this.backgroundLayer.addChild(wall);

    // ============================================
    // 2. FLOOR & FOREGROUND RUG
    // ============================================
    const floor = new Graphics();

    // Wood floor planks
    floor.rect(0, floorY, rw, rh - floorY).fill(0x281d14);

    for (let fx = 0; fx < rw; fx += 80) {
      floor
        .moveTo(fx, floorY)
        .lineTo(fx - 40, rh)
        .stroke({ width: 2, color: 0x1a120b, alpha: 0.8 });
    }

    // Cozy patterned oval rug
    floor
      .ellipse(rw * 0.5, floorY + 40, rw * 0.28, 48)
      .fill(0x2d3a4f)
      .stroke({ width: 4, color: 0x3ecf8e, alpha: 0.6 });

    this.foregroundLayer.addChild(floor);

    // Ambient warm light cone from ceiling lamp
    const lightCone = new Graphics()
      .moveTo(rw * 0.5, 0)
      .lineTo(rw * 0.25, rh)
      .lineTo(rw * 0.75, rh)
      .closePath()
      .fill({ color: 0xffe8a1, alpha: 0.05 });
    this.ambientLightLayer.addChild(lightCone);

    // ============================================
    // 3. INTERACTIVE PHYSICAL FURNITURE PROPS
    // ============================================

    // PROP 1: Dual-Monitor Battlestation Desk (Right)
    const deskGfx = new Graphics();

    // Desk Wooden Table
    deskGfx
      .roundRect(-90, -40, 180, 40, 6)
      .fill(0x4f372a)
      .stroke({ width: 3, color: 0x1f1510 });

    // Desk Legs
    deskGfx.rect(-80, 0, 10, floorY * 0.15).fill(0x1f1510);
    deskGfx.rect(70, 0, 10, floorY * 0.15).fill(0x1f1510);

    // Dual Monitors
    deskGfx
      .roundRect(-75, -110, 70, 52, 4)
      .fill(0x0a0d14)
      .stroke({ width: 2.5, color: 0x3ecf8e });

    deskGfx.rect(-70, -105, 60, 42).fill(0x081c14); // Screen 1 Glow

    for (let l = 0; l < 5; l++) {
      deskGfx.rect(-66, -100 + l * 8, 30 + (l % 2) * 16, 3).fill(0x3ecf8e, 0.8);
    }

    deskGfx
      .roundRect(5, -108, 65, 48, 4)
      .fill(0x0a0d14)
      .stroke({ width: 2.5, color: 0x38bdf8 });

    deskGfx.rect(10, -103, 55, 38).fill(0x091829); // Screen 2 Glow

    // RGB Mechanical Keyboard & Mouse
    deskGfx.roundRect(-40, -32, 50, 10, 2).fill(0x1a2130);
    deskGfx.roundRect(20, -30, 12, 8, 2).fill(0x3ecf8e);

    this.addInteractiveProp({
      x: rw * 0.76,
      y: floorY + 10,
      graphics: deskGfx,
      label: "BATTLESTATION",
      color: 0x3ecf8e,
      badgeY: -130,
      onInspect: () => {
        this.inspectBattlestation();
      },
    });

    // PROP 2: Tall Bookshelf & Retro Trophy (Left)
    const shelfGfx = new Graphics();

    shelfGfx
      .roundRect(-55, -160, 110, 160, 6)
      .fill(0x3a281e)
      .stroke({ width: 3, color: 0x1b120c });

    // Shelves
    shelfGfx.rect(-50, -120, 100, 6).fill(0x271911);
    shelfGfx.rect(-50, -75, 100, 6).fill(0x271911);
    shelfGfx.rect(-50, -30, 100, 6).fill(0x271911);

    // Books on shelves
    shelfGfx.rect(-44, -152, 14, 30).fill(0x3ecf8e);
    shelfGfx.rect(-28, -156, 16, 34).fill(0xffa94d);
    shelfGfx.rect(-10, -148, 14, 26).fill(0x748ffc);
    shelfGfx.rect(8, -154, 18, 32).fill(0xf43f5e);

    // Mini Golden Trophy & Game Cartridge
    shelfGfx.roundRect(-35, -112, 16, 24, 2).fill(0xfacc15);
    shelfGfx.circle(-27, -114, 6).fill(0xfacc15);
    shelfGfx.roundRect(6, -108, 26, 20, 3).fill(0x94a3b8);

    this.addInteractiveProp({
      x: rw * 0.12,
      y: floorY + 10,
      graphics: shelfGfx,
      label: "CS & GAME ARCHIVE",
      color: 0xffa94d,
      badgeY: -180,
      onInspect: () => {
        this.inspectBookshelf();
      },
    });

    // PROP 3: Steaming Chai Table & Acoustic Guitar (Center-Left)
    const loungeGfx = new Graphics();

    // Round Coffee Table
    loungeGfx
      .ellipse(0, 0, 48, 18)
      .fill(0x422d21)
      .stroke({ width: 2.5, color: 0x1b120c });
    loungeGfx.rect(-4, 0, 8, 26).fill(0x1b120c);

    // Steaming Mug
    loungeGfx.roundRect(-6, -16, 12, 14, 2).fill(0xffffff);

    // Acoustic Guitar leaning against the table
    loungeGfx
      .ellipse(40, -18, 16, 24)
      .fill(0xc87d47)
      .stroke({ width: 2, color: 0x111111 });
    loungeGfx
      .rect(37, -65, 6, 45)
      .fill(0x6b4423)
      .stroke({ width: 1.5, color: 0x111111 });

    this.addInteractiveProp({
      x: rw * 0.36,
      y: floorY + 20,
      graphics: loungeGfx,
      label: "CHAI & GUITAR",
      color: 0xec4899,
      badgeY: -80,
      onInspect: () => {
        this.inspectLounge();
      },
    });

    // ============================================
    // 4. ANIMATED GAURAV AVATAR (Center-Right)
    // ============================================
    this.avatarSpring = new Spring(1.0, 260, 14);

    this.avatarHolder = new Container();
    this.avatarHolder.position.set(rw * 0.58, floorY);
    this.avatarHolder.eventMode = "static";
    this.avatarHolder.cursor = "pointer";

    this.avatar = new Player();
    this.avatar.scale.set(1.5);

    this.avatarHolder.addChild(this.avatar);
    this.characterLayer.addChild(this.avatarHolder);

    // Gaurav Badge
    const gBadge = new Container();
    gBadge.position.set(0, -175);

    const gbBg = new Graphics()
      .roundRect(-60, -12, 120, 24, 6)
      .fill({ color: 0x090c16, alpha: 0.9 })
      .stroke({ width: 1.5, color: 0x3ecf8e });

    const gbTxt = new Text({
      text: "GAURAV (CLICK ME)",
      style: {
        fontFamily: "system-ui, sans-serif",
        fontSize: 9.5,
        fontWeight: "900",
        fill: 0x3ecf8e,
        letterSpacing: 0.5,
      },
    });
    gbTxt.anchor.set(0.5);

    gBadge.addChild(gbBg, gbTxt);
    this.avatarHolder.addChild(gBadge);

    this.avatarQuotes = [
      "Welcome to my studio! I build games in Unity and real-time apps with PixiJS!",
      "Ctrl+S is my daily love language.",
      "99 bugs in the code, fix 1... 127 bugs in the code!",
      "Check out the Battlestation and Bookshelf to explore my work!",
    ];
    this.quoteIdx = 0;

    this.avatarHolder.on("pointertap", () => {
      this.avatarSpring.set(0.7);
      this.quoteIdx = (this.quoteIdx + 1) % this.avatarQuotes.length;
      this.inspectAvatar(this.avatarQuotes[this.quoteIdx]);
    });
  }

  inspectBattlestation() {
    const c = new Container();

    const title = new Text({
      text: "Gaurav Kumar Singh — Creative Technologist",
      style: {
        fontFamily: "system-ui, sans-serif",
        fontSize: 14,
        fontWeight: "bold",
        fill: 0x3ecf8e,
      },
    });
    title.position.set(0, 0);

    const bio = new Text({
      text: "Hi, I'm Gaurav! I currently build real-time interactive applications and games at Binaire Pvt. Ltd. with Electron.js, PixiJS, Node.js, and Unity C#.\n\nI love building things that respond instantly: tight gameplay mechanics, responsive desktop experiences, and particle-rich canvas scenes.",
      style: {
        fontFamily: "system-ui, sans-serif",
        fontSize: 11.5,
        fill: 0xd0d7de,
        lineHeight: 18,
        wordWrap: true,
        wordWrapWidth: 380,
      },
    });
    bio.position.set(0, 24);

    const current = new Text({
      text: "CURRENT: Binaire Pvt. Ltd. · India · Unity & Full-Stack",
      style: {
        fontFamily: "system-ui, sans-serif",
        fontSize: 10.5,
        fontWeight: "bold",
        fill: 0xfacc15,
      },
    });
    current.position.set(0, 130);

    c.addChild(title, bio, current);

    this.showInspector({
      title: "Gaurav's Battlestation",
      icon: "",
      color: 0x3ecf8e,
      width: 410,
      height: 230,
      x: this.roomWidth * 0.45,
      y: 90,
      content: c,
    });
  }

  inspectBookshelf() {
    const c = new Container();

    const title = new Text({
      text: "Academic Roots & Engineering Philosophy",
      style: {
        fontFamily: "system-ui, sans-serif",
        fontSize: 14,
        fontWeight: "bold",
        fill: 0xffa94d,
      },
    });
    title.position.set(0, 0);

    const text = new Text({
      text: "• B.Tech in Computer Science & Engineering (AKTU, 2021–2025, CGPA 7.0)\n• Shipped multiple Unity commercial casual titles (Bubble Shooter, Ludo, QuickJack) at Qwcodes.\n• Passionate about clean state machines, fast game loops, and reducing memory overhead.",
      style: {
        fontFamily: "system-ui, sans-serif",
        fontSize: 11.5,
        fill: 0xd0d7de,
        lineHeight: 18,
        wordWrap: true,
        wordWrapWidth: 380,
      },
    });
    text.position.set(0, 24);

    c.addChild(title, text);

    this.showInspector({
      title: "CS & Game Archive",
      icon: "",
      color: 0xffa94d,
      width: 410,
      height: 190,
      x: this.roomWidth * 0.1,
      y: 90,
      content: c,
    });
  }

  inspectLounge() {
    const c = new Container();

    const title = new Text({
      text: "Creative Flow & Downtime",
      style: {
        fontFamily: "system-ui, sans-serif",
        fontSize: 14,
        fontWeight: "bold",
        fill: 0xec4899,
      },
    });
    title.position.set(0, 0);

    const text = new Text({
      text: "When not optimizing draw calls or profiling shaders, I'm drinking hot chai, playing acoustic tunes, or experimenting with new physics engines and generative AI.\n\nAlways ready to build cool games and interactive apps with ambitious teams.",
      style: {
        fontFamily: "system-ui, sans-serif",
        fontSize: 11.5,
        fill: 0xd0d7de,
        lineHeight: 18,
        wordWrap: true,
        wordWrapWidth: 360,
      },
    });
    text.position.set(0, 24);

    c.addChild(title, text);

    this.showInspector({
      title: "Studio Lounge",
      icon: "",
      color: 0xec4899,
      width: 390,
      height: 170,
      x: this.roomWidth * 0.25,
      y: 110,
      content: c,
    });
  }

  inspectAvatar(quote) {
    const c = new Container();

    const text = new Text({
      text: `“${quote}”`,
      style: {
        fontFamily: "Georgia, serif",
        fontSize: 13,
        fontStyle: "italic",
        fill: 0xffffff,
        lineHeight: 19,
        wordWrap: true,
        wordWrapWidth: 320,
      },
    });
    text.position.set(0, 0);

    c.addChild(text);

    this.showInspector({
      title: "Gaurav Speaks",
      icon: "",
      color: 0x3ecf8e,
      width: 350,
      height: 120,
      x: this.roomWidth * 0.48,
      y: 110,
      content: c,
    });
  }

  update(delta) {
    if (this.destroyed) return;
    super.update(delta);
    if (this.isClosing) return;
    const dt = (delta || 1) * 0.016;

    if (this.shaderFilter?.resources?.filterUniforms?.uniforms) {
      this.shaderFilter.resources.filterUniforms.uniforms.uTime =
        performance.now() * 0.001;
    }

    if (
      this.avatarSpring &&
      this.avatarHolder &&
      !this.avatarHolder.destroyed &&
      this.avatarHolder.scale &&
      typeof this.avatarHolder.scale.set === "function"
    ) {
      const s = this.avatarSpring.update(dt);
      this.avatarHolder.scale.set(s, 2.0 - s);
    }

    if (
      this.avatar &&
      !this.avatar.destroyed &&
      typeof this.avatar.waveHand === "function"
    ) {
      this.avatar.waveHand(delta);
    }
  }
}
