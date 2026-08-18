import { Container, Graphics, Text } from "pixi.js";
import { Room } from "./Room";
import { PORTFOLIO } from "../data/portfolio";
import { createContactShader } from "../utils/RoomShaders";

export class ContactRoom extends Room {
  constructor(app) {
    super(app, {
      accentColor: PORTFOLIO.contact.accentColor ?? 0xff8fab,
      title: "Rooftop Coffee Lounge",
      type: "Cafe",
      icon: "",
    });
  }

  buildRoom() {
    const rw = this.roomWidth;
    const rh = this.roomHeight;
    const floorY = rh * 0.72;

    this.steamPuffs = [];

    // Attach Sunset Vaporwave Twilight Mirage Shader
    this.shaderFilter = createContactShader();
    if (this.shaderFilter) {
      this.backgroundLayer.filters = [this.shaderFilter];
    }

    // ============================================
    // 1. BACKGROUND: ROOFTOP SKYLINE & LIGHTS
    // ============================================
    const wall = new Graphics();

    // Sunset / Twilight city gradient
    wall.rect(0, 0, rw, floorY).fill(0x1a1224);

    // City Skyline Silhouette
    for (let bx = 0; bx < rw; bx += 42) {
      const bh = 60 + (bx % 9) * 16;
      wall.rect(bx, floorY - bh, 36, bh).fill(0x0c0914);

      // Lit windows
      for (let wy = floorY - bh + 10; wy < floorY - 10; wy += 14) {
        if ((bx + wy) % 4 === 0) {
          wall.rect(bx + 6, wy, 4, 6).fill(0xffd166, 0.5);
        }
      }
    }

    // Pergola Wooden Beams along ceiling
    wall.rect(0, 15, rw, 14).fill(0x3e2417);
    for (let px = 40; px < rw; px += 80) {
      wall.rect(px, 15, 12, 35).fill(0x2b180e);
    }

    // Hanging warm fairy lights
    for (let lx = 30; lx < rw; lx += 45) {
      wall.circle(lx, 56, 5).fill(0xffd166);
      wall.moveTo(lx, 29).lineTo(lx, 56).stroke({ width: 1, color: 0x111111 });
    }

    // Glowing Neon Coffee Sign
    wall
      .roundRect(rw * 0.76, 55, 75, 55, 10)
      .fill(0x200a16)
      .stroke({ width: 2.5, color: 0xff8fab });

    const neonCup = new Text({
      text: "☕",
      style: { fontSize: 26 },
    });
    neonCup.anchor.set(0.5);
    neonCup.position.set(rw * 0.76 + 37, 82);

    this.backgroundLayer.addChild(wall, neonCup);

    // ============================================
    // 2. FLOOR: CEDAR ROOFTOP DECK & PLANTS
    // ============================================
    const floor = new Graphics();

    floor.rect(0, floorY, rw, rh - floorY).fill(0x381f12);

    for (let fx = 0; fx < rw; fx += 75) {
      floor
        .moveTo(fx, floorY)
        .lineTo(fx - 35, rh)
        .stroke({ width: 1.5, color: 0x221109, alpha: 0.8 });
    }

    // Balcony glass railing
    floor
      .rect(0, floorY - 32, rw, 32)
      .fill({ color: 0x38bdf8, alpha: 0.15 })
      .stroke({ width: 2, color: 0x38bdf8, alpha: 0.5 });

    // Potted Fiddle-Leaf Plant (Right Corner)
    floor.roundRect(rw * 0.94 - 14, floorY - 25, 28, 30, 4).fill(0x5c4033);
    floor.circle(rw * 0.94, floorY - 45, 22).fill(0x22c55e);
    floor.circle(rw * 0.94 - 12, floorY - 38, 16).fill(0x16a34a);

    this.foregroundLayer.addChild(floor);

    // ============================================
    // 3. PHYSICAL INTERACTIVE CAFE PROPS
    // ============================================

    // PROP 1: Espresso Bar Counter & Steaming Machine (Left)
    const barGfx = new Graphics();

    // Wooden Counter
    barGfx
      .roundRect(-90, -45, 180, 45, 6)
      .fill(0x4a2a18)
      .stroke({ width: 3, color: 0x221109 });
    barGfx.rect(-80, 0, 12, floorY * 0.14).fill(0x221109);
    barGfx.rect(68, 0, 12, floorY * 0.14).fill(0x221109);

    // Stainless Espresso Machine with Steam
    barGfx
      .roundRect(-60, -95, 60, 50, 4)
      .fill(0x94a3b8)
      .stroke({ width: 2, color: 0x334155 });
    barGfx.rect(-52, -88, 44, 22).fill(0x1e293b); // Gauge & dial
    barGfx.circle(-40, -77, 4).fill(0xff8fab);

    // Ceramic Coffee Cups
    barGfx.roundRect(15, -60, 16, 15, 3).fill(0xffffff);
    barGfx.roundRect(38, -60, 16, 15, 3).fill(0xffffff);

    this.steamLayer = new Container();
    this.steamLayer.position.set(rw * 0.2 - 30, floorY - 80);
    this.furnitureLayer.addChild(this.steamLayer);

    for (let s = 0; s < 6; s++) {
      const p = new Graphics()
        .circle(0, 0, 2.5 + Math.random() * 2)
        .fill({ color: 0xffffff, alpha: 0.35 });
      p.x = (Math.random() - 0.5) * 6;
      p.y = -s * 6;
      p.vy = 0.35 + Math.random() * 0.2;
      p.vx = (Math.random() - 0.5) * 0.25;
      this.steamLayer.addChild(p);
      this.steamPuffs.push(p);
    }

    this.addInteractiveProp({
      x: rw * 0.2,
      y: floorY + 15,
      graphics: barGfx,
      label: "☕ DIRECT CONTACT BAR",
      color: 0xff8fab,
      badgeY: -125,
      onInspect: () => {
        this.inspectDirectContact();
      },
    });

    // PROP 2: Balcony Cafe Table & Postcard (Center)
    const tableGfx = new Graphics();

    tableGfx
      .ellipse(0, 0, 55, 20)
      .fill(0x422818)
      .stroke({ width: 2.5, color: 0x1b0e06 });
    tableGfx.rect(-5, 0, 10, 30).fill(0x1b0e06);

    // Postcard & Stamp on table
    tableGfx
      .roundRect(-25, -16, 32, 22, 2)
      .fill(0xfffbeb)
      .stroke({ width: 1, color: 0xff8fab });
    tableGfx.circle(-10, -8, 4).fill(0xff8fab);

    // Ceramic Latte Mug
    tableGfx.roundRect(14, -18, 14, 14, 2).fill(0xffffff);

    this.addInteractiveProp({
      x: rw * 0.5,
      y: floorY + 20,
      graphics: tableGfx,
      label: "💌 COLLABORATE & CHAT",
      color: 0x38bdf8,
      badgeY: -75,
      onInspect: () => {
        this.inspectCollaboration();
      },
    });

    // PROP 3: Social Jukebox & Bulletin Board (Right)
    const boardGfx = new Graphics();

    boardGfx
      .roundRect(-55, -135, 110, 135, 6)
      .fill(0x281810)
      .stroke({ width: 3, color: 0xf97316 });

    // Hanging Plaques for GitHub & LinkedIn
    boardGfx
      .roundRect(-45, -120, 90, 42, 4)
      .fill(0x141b28)
      .stroke({ width: 1.5, color: 0xf97316 });

    boardGfx
      .roundRect(-45, -68, 90, 42, 4)
      .fill(0x141b28)
      .stroke({ width: 1.5, color: 0x38bdf8 });

    this.addInteractiveProp({
      x: rw * 0.8,
      y: floorY + 15,
      graphics: boardGfx,
      label: "🐙 SOCIAL CHANNELS",
      color: 0xf97316,
      badgeY: -155,
      onInspect: () => {
        this.inspectSocials();
      },
    });
  }

  inspectDirectContact() {
    const c = new Container();

    const title = new Text({
      text: "Direct Contact Channels (Click to Copy)",
      style: {
        fontFamily: "system-ui, sans-serif",
        fontSize: 13.5,
        fontWeight: "bold",
        fill: 0xff8fab,
      },
    });
    title.position.set(0, 0);

    // Email Button
    const emailBtn = new Container();
    emailBtn.position.set(0, 24);
    emailBtn.eventMode = "static";
    emailBtn.cursor = "pointer";

    const eBg = new Graphics()
      .roundRect(0, 0, 370, 44, 8)
      .fill(0x161e2e)
      .stroke({ width: 1.5, color: 0xff8fab });

    const eTxt = new Text({
      text: "Email: gauravsingh02195@gmail.com  (Click to Copy)",
      style: {
        fontFamily: "system-ui, sans-serif",
        fontSize: 11.5,
        fontWeight: "bold",
        fill: 0xffffff,
      },
    });
    eTxt.position.set(10, 14);

    emailBtn.addChild(eBg, eTxt);
    emailBtn.on("pointertap", () => {
      this.copyToClipboard(
        "gauravsingh02195@gmail.com",
        "Email copied to clipboard!",
      );
    });

    // Phone Button
    const phoneBtn = new Container();
    phoneBtn.position.set(0, 76);
    phoneBtn.eventMode = "static";
    phoneBtn.cursor = "pointer";

    const pBg = new Graphics()
      .roundRect(0, 0, 370, 44, 8)
      .fill(0x161e2e)
      .stroke({ width: 1.5, color: 0x4dabf7 });

    const pTxt = new Text({
      text: "Phone / WhatsApp: +91 6388474535  (Click to Copy)",
      style: {
        fontFamily: "system-ui, sans-serif",
        fontSize: 11.5,
        fontWeight: "bold",
        fill: 0xffffff,
      },
    });
    pTxt.position.set(10, 14);

    phoneBtn.addChild(pBg, pTxt);
    phoneBtn.on("pointertap", () => {
      this.copyToClipboard(
        "+91 6388474535",
        "Phone number copied to clipboard!",
      );
    });

    // Location
    const loc = new Text({
      text: "Location: India (Open to Worldwide Remote & On-Site Roles)",
      style: {
        fontFamily: "system-ui, sans-serif",
        fontSize: 10.5,
        fontWeight: "bold",
        fill: 0x3ecf8e,
      },
    });
    loc.position.set(0, 130);

    c.addChild(title, emailBtn, phoneBtn, loc);

    this.showInspector({
      title: "Espresso Bar — Direct Contact",
      icon: "",
      color: 0xff8fab,
      width: 410,
      height: 220,
      x: this.roomWidth * 0.08,
      y: 90,
      content: c,
    });
  }

  inspectCollaboration() {
    const c = new Container();

    const title = new Text({
      text: "Let's Build Games & Interactive Software",
      style: {
        fontFamily: "system-ui, sans-serif",
        fontSize: 14,
        fontWeight: "bold",
        fill: 0x38bdf8,
      },
    });
    title.position.set(0, 0);

    const desc = new Text({
      text: "Whether you're developing a Unity title that needs gameplay polish and physics feel, building a high-speed PixiJS / Canvas web experience, or structuring a full-stack Node.js backend — I'm always eager to collaborate.\n\nI love tackling tricky performance bottlenecks, designing juicy animations, and turning complex ideas into software people genuinely enjoy using.",
      style: {
        fontFamily: "system-ui, sans-serif",
        fontSize: 11.5,
        fill: 0xd0d7de,
        lineHeight: 18,
        wordWrap: true,
        wordWrapWidth: 380,
      },
    });
    desc.position.set(0, 24);

    c.addChild(title, desc);

    this.showInspector({
      title: "Collaboration Invitation",
      icon: "",
      color: 0x38bdf8,
      width: 410,
      height: 200,
      x: this.roomWidth * 0.36,
      y: 90,
      content: c,
    });
  }

  inspectSocials() {
    const c = new Container();

    const title = new Text({
      text: "Social Channels & Profiles",
      style: {
        fontFamily: "system-ui, sans-serif",
        fontSize: 14,
        fontWeight: "bold",
        fill: 0xf97316,
      },
    });
    title.position.set(0, 0);

    const socials = [
      {
        name: "GitHub Profile",
        desc: "Open-source game experiments, repos, and web tools.",
        color: 0xf97316,
      },
      {
        name: "LinkedIn Network",
        desc: "Professional endorsements, background, and updates.",
        color: 0x38bdf8,
      },
    ];

    let sy = 24;
    socials.forEach((s) => {
      const n = new Text({
        text: s.name,
        style: {
          fontFamily: "system-ui, sans-serif",
          fontSize: 12,
          fontWeight: "bold",
          fill: s.color,
        },
      });
      n.position.set(0, sy);

      const d = new Text({
        text: s.desc,
        style: {
          fontFamily: "system-ui, sans-serif",
          fontSize: 10.5,
          fill: 0x8b9ab8,
        },
      });
      d.position.set(0, sy + 18);

      c.addChild(n, d);
      sy += 44;
    });

    this.showInspector({
      title: "Social Bulletin Board",
      icon: "",
      color: 0xf97316,
      width: 410,
      height: 180,
      x: this.roomWidth * 0.52,
      y: 90,
      content: c,
    });
  }

  copyToClipboard(text, message) {
    if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).catch(() => {});
    }
    if (typeof window !== "undefined" && window.alert) {
      window.alert(message);
    }
  }

  update(delta) {
    if (this.destroyed) return;
    super.update(delta);
    if (this.destroyed || this.isClosing) return;

    if (this.shaderFilter?.resources?.filterUniforms?.uniforms) {
      this.shaderFilter.resources.filterUniforms.uniforms.uTime =
        performance.now() * 0.001;
    }

    // Animate coffee steam
    if (this.steamPuffs) {
      for (const puff of this.steamPuffs) {
        puff.y -= puff.vy * delta;
        puff.x += puff.vx * delta;
        puff.alpha -= 0.006 * delta;

        if (puff.y < -35 || puff.alpha <= 0) {
          puff.x = (Math.random() - 0.5) * 4;
          puff.y = 0;
          puff.alpha = 0.35;
        }
      }
    }
  }
}
