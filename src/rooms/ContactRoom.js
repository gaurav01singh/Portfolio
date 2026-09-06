import { Container, Graphics, Text } from "pixi.js";
import { Room } from "./Room";
import { Spring } from "../utils/Juice";
import { PORTFOLIO } from "../data/portfolio";
import { createContactShader } from "../utils/RoomShaders";

export class ContactRoom extends Room {
  constructor(app) {
    super(app, {
      accentColor: PORTFOLIO.contact.accentColor ?? 0xff8fab,
      title: "Rooftop Coffee Lounge · Contact & Collaboration",
      type: "Cafe",
      icon: "",
    });
  }

  buildRoom() {
    const rw = this.roomWidth;
    const rh = this.roomHeight;
    const floorY = rh * 0.72;

    this.steamPuffs = [];
    this.contactCards = [];

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
      text: "COFFEE",
      style: {
        fontFamily: "system-ui, sans-serif",
        fontSize: 14,
        fontWeight: "900",
        fill: 0xff8fab,
        letterSpacing: 1,
      },
    });
    neonCup.anchor.set(0.5);
    neonCup.position.set(rw * 0.76 + 37, 82);

    this.backgroundLayer.addChild(wall, neonCup);

    // ============================================
    // 1.5 FLOATING ROOFTOP CONTACT DOSSIER CARDS
    // ============================================
    const cardW = Math.min(480, (rw - 140) / 3);
    const cardH = 340;
    const cardGap = 32;
    const startX = (rw - (cardW * 3 + cardGap * 2)) / 2 + cardW / 2;
    const cardY = 88 + cardH / 2;

    this.createDirectContactCard(startX, cardY, cardW, cardH);
    this.createCollabCard(startX + cardW + cardGap, cardY, cardW, cardH);
    this.createSocialsCard(startX + (cardW + cardGap) * 2, cardY, cardW, cardH);

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
      label: "DIRECT CONTACT BAR",
      color: 0xff8fab,
      badgeY: -130,
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
      label: "COLLABORATE & CHAT",
      color: 0x38bdf8,
      badgeY: -80,
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
      label: "SOCIAL CHANNELS",
      color: 0xf97316,
      badgeY: -155,
      onInspect: () => {
        this.inspectSocials();
      },
    });
  }

  createDirectContactCard(x, y, w, h) {
    const cont = new Container();
    cont.position.set(x, y);
    cont.eventMode = "static";
    cont.cursor = "pointer";

    const spring = new Spring(1.0, 260, 14);

    const shadow = new Graphics()
      .roundRect(-w / 2 + 6, -h / 2 + 8, w, h, 16)
      .fill({ color: 0x000000, alpha: 0.65 });

    const bg = new Graphics();
    this.drawContactCardShell(bg, w, h, false, 0xff8fab);

    const badgeTxt = new Text({
      text: "DIRECT COMMUNICATION",
      style: {
        fontFamily: "system-ui, sans-serif",
        fontSize: 12.5,
        fontWeight: "900",
        fill: 0xff8fab,
        letterSpacing: 0.8,
      },
    });
    badgeTxt.position.set(10, 5);

    const bBg = new Graphics()
      .roundRect(0, 0, badgeTxt.width + 20, 26, 6)
      .fill({ color: 0x1e1524, alpha: 0.85 })
      .stroke({ width: 1.2, color: 0xff8fab, alpha: 0.75 });

    const badgeCont = new Container();
    badgeCont.position.set(-w / 2 + 18, -h / 2 + 18);
    badgeCont.addChild(bBg, badgeTxt);

    const titleTxt = new Text({
      text: "GET IN TOUCH",
      style: {
        fontFamily: "system-ui, -apple-system, sans-serif",
        fontSize: 22,
        fontWeight: "900",
        fill: 0xffffff,
        letterSpacing: 0.5,
      },
    });
    titleTxt.position.set(-w / 2 + 18, -h / 2 + 54);

    // Email Pill
    const emailBtn = new Container();
    emailBtn.position.set(-w / 2 + 18, -h / 2 + 92);
    emailBtn.eventMode = "static";
    emailBtn.cursor = "pointer";

    const eBg = new Graphics()
      .roundRect(0, 0, w - 36, 44, 8)
      .fill({ color: 0x161220, alpha: 0.85 })
      .stroke({ width: 1.2, color: 0x473950 });

    const eTxt = new Text({
      text: `✉  ${PORTFOLIO.contact.email}`,
      style: {
        fontFamily: "system-ui, sans-serif",
        fontSize: 13.5,
        fontWeight: "bold",
        fill: 0xffffff,
      },
    });
    eTxt.position.set(14, 12);
    emailBtn.addChild(eBg, eTxt);
    emailBtn.on("pointertap", (e) => {
      e.stopPropagation();
      this.copyToClipboard(
        PORTFOLIO.contact.email,
        "Email copied to clipboard!",
      );
      if (typeof window !== "undefined") {
        window.open(`mailto:${PORTFOLIO.contact.email}`, "_self");
      }
    });

    // Phone Pill
    const phoneBtn = new Container();
    phoneBtn.position.set(-w / 2 + 18, -h / 2 + 144);
    phoneBtn.eventMode = "static";
    phoneBtn.cursor = "pointer";

    const pBg = new Graphics()
      .roundRect(0, 0, w - 36, 44, 8)
      .fill({ color: 0x161220, alpha: 0.85 })
      .stroke({ width: 1.2, color: 0x473950 });

    const pTxt = new Text({
      text: `☎  ${PORTFOLIO.contact.phone}`,
      style: {
        fontFamily: "system-ui, sans-serif",
        fontSize: 13.5,
        fontWeight: "bold",
        fill: 0xffffff,
      },
    });
    pTxt.position.set(14, 12);
    phoneBtn.addChild(pBg, pTxt);
    phoneBtn.on("pointertap", (e) => {
      e.stopPropagation();
      this.copyToClipboard(
        PORTFOLIO.contact.phone,
        "Phone number copied to clipboard!",
      );
      if (typeof window !== "undefined") {
        window.open(`tel:${PORTFOLIO.contact.phone}`, "_self");
      }
    });

    // Location
    const locTxt = new Text({
      text: `📍 ${PORTFOLIO.contact.location} (Worldwide Remote)`,
      style: {
        fontFamily: "system-ui, sans-serif",
        fontSize: 13,
        fontWeight: "600",
        fill: 0x94a3b8,
      },
    });
    locTxt.position.set(-w / 2 + 18, -h / 2 + 200);

    // CTA Button
    const ctaBg = new Graphics()
      .roundRect(-w / 2 + 18, h / 2 - 46, w - 36, 36, 8)
      .fill(0x1e1526)
      .stroke({ width: 1.5, color: 0xff8fab });

    const ctaTxt = new Text({
      text: "OPEN CONTACT DOSSIER ↗",
      style: {
        fontFamily: "system-ui, sans-serif",
        fontSize: 13,
        fontWeight: "900",
        fill: 0xffffff,
        letterSpacing: 0.8,
      },
    });
    ctaTxt.anchor.set(0.5);
    ctaTxt.position.set(0, h / 2 - 28);

    cont.addChild(
      shadow,
      bg,
      badgeCont,
      titleTxt,
      emailBtn,
      phoneBtn,
      locTxt,
      ctaBg,
      ctaTxt,
    );

    cont.on("pointerover", () => {
      spring.target = 1.04;
      this.drawContactCardShell(bg, w, h, true, 0xff8fab);
    });

    cont.on("pointerout", () => {
      spring.target = 1.0;
      this.drawContactCardShell(bg, w, h, false, 0xff8fab);
    });

    cont.on("pointerdown", () => {
      spring.set(0.96);
    });

    cont.on("pointertap", () => {
      this.inspectDirectContact();
    });

    this.furnitureLayer.addChild(cont);
    if (!this.contactCards) this.contactCards = [];
    this.contactCards.push({ container: cont, spring });
  }

  createCollabCard(x, y, w, h) {
    const cont = new Container();
    cont.position.set(x, y);
    cont.eventMode = "static";
    cont.cursor = "pointer";

    const spring = new Spring(1.0, 260, 14);

    const shadow = new Graphics()
      .roundRect(-w / 2 + 6, -h / 2 + 8, w, h, 16)
      .fill({ color: 0x000000, alpha: 0.65 });

    const bg = new Graphics();
    this.drawContactCardShell(bg, w, h, false, 0x38bdf8);

    const badgeTxt = new Text({
      text: "COLLABORATION & ROLES",
      style: {
        fontFamily: "system-ui, sans-serif",
        fontSize: 12.5,
        fontWeight: "900",
        fill: 0x38bdf8,
        letterSpacing: 0.8,
      },
    });
    badgeTxt.position.set(10, 5);

    const bBg = new Graphics()
      .roundRect(0, 0, badgeTxt.width + 20, 26, 6)
      .fill({ color: 0x0e1b2e, alpha: 0.85 })
      .stroke({ width: 1.2, color: 0x38bdf8, alpha: 0.75 });

    const badgeCont = new Container();
    badgeCont.position.set(-w / 2 + 18, -h / 2 + 18);
    badgeCont.addChild(bBg, badgeTxt);

    const titleTxt = new Text({
      text: "LET'S BUILD TOGETHER",
      style: {
        fontFamily: "system-ui, -apple-system, sans-serif",
        fontSize: 22,
        fontWeight: "900",
        fill: 0xffffff,
        letterSpacing: 0.5,
      },
    });
    titleTxt.position.set(-w / 2 + 18, -h / 2 + 54);

    const subTxt = new Text({
      text: "Open to Full-Time, Remote & Contract Roles",
      style: {
        fontFamily: "system-ui, sans-serif",
        fontSize: 14,
        fontWeight: "700",
        fill: 0x38bdf8,
      },
    });
    subTxt.position.set(-w / 2 + 18, -h / 2 + 88);

    const descTxt = new Text({
      text: "Available to engineer high-performance Unity gameplay systems, physics simulations, PixiJS / Canvas web interactive experiences, and robust Node.js architectures.",
      style: {
        fontFamily: "system-ui, sans-serif",
        fontSize: 13.5,
        fill: 0xd1d5db,
        lineHeight: 20,
        wordWrap: true,
        wordWrapWidth: w - 36,
      },
    });
    descTxt.position.set(-w / 2 + 18, -h / 2 + 118);

    // Focus chips
    const chipsTxt = new Text({
      text: "FOCUS: UNITY C#  •  PIXIJS  •  PHYSICS  •  NODE.JS",
      style: {
        fontFamily: "system-ui, sans-serif",
        fontSize: 12,
        fontWeight: "900",
        fill: 0x94a3b8,
        letterSpacing: 0.6,
      },
    });
    chipsTxt.position.set(-w / 2 + 18, -h / 2 + 200);

    // CTA Button
    const ctaBg = new Graphics()
      .roundRect(-w / 2 + 18, h / 2 - 46, w - 36, 36, 8)
      .fill(0x0f1c2d)
      .stroke({ width: 1.5, color: 0x38bdf8 });

    const ctaTxt = new Text({
      text: "VIEW COLLAB DETAILS ↗",
      style: {
        fontFamily: "system-ui, sans-serif",
        fontSize: 13,
        fontWeight: "900",
        fill: 0xffffff,
        letterSpacing: 0.8,
      },
    });
    ctaTxt.anchor.set(0.5);
    ctaTxt.position.set(0, h / 2 - 28);

    cont.addChild(
      shadow,
      bg,
      badgeCont,
      titleTxt,
      subTxt,
      descTxt,
      chipsTxt,
      ctaBg,
      ctaTxt,
    );

    cont.on("pointerover", () => {
      spring.target = 1.04;
      this.drawContactCardShell(bg, w, h, true, 0x38bdf8);
    });

    cont.on("pointerout", () => {
      spring.target = 1.0;
      this.drawContactCardShell(bg, w, h, false, 0x38bdf8);
    });

    cont.on("pointerdown", () => {
      spring.set(0.96);
    });

    cont.on("pointertap", () => {
      this.inspectCollaboration();
    });

    this.furnitureLayer.addChild(cont);
    if (!this.contactCards) this.contactCards = [];
    this.contactCards.push({ container: cont, spring });
  }

  createSocialsCard(x, y, w, h) {
    const cont = new Container();
    cont.position.set(x, y);
    cont.eventMode = "static";
    cont.cursor = "pointer";

    const spring = new Spring(1.0, 260, 14);

    const shadow = new Graphics()
      .roundRect(-w / 2 + 6, -h / 2 + 8, w, h, 16)
      .fill({ color: 0x000000, alpha: 0.65 });

    const bg = new Graphics();
    this.drawContactCardShell(bg, w, h, false, 0xf97316);

    const badgeTxt = new Text({
      text: "DEVELOPER NETWORKS",
      style: {
        fontFamily: "system-ui, sans-serif",
        fontSize: 12.5,
        fontWeight: "900",
        fill: 0xf97316,
        letterSpacing: 0.8,
      },
    });
    badgeTxt.position.set(10, 5);

    const bBg = new Graphics()
      .roundRect(0, 0, badgeTxt.width + 20, 26, 6)
      .fill({ color: 0x24160e, alpha: 0.85 })
      .stroke({ width: 1.2, color: 0xf97316, alpha: 0.75 });

    const badgeCont = new Container();
    badgeCont.position.set(-w / 2 + 18, -h / 2 + 18);
    badgeCont.addChild(bBg, badgeTxt);

    const titleTxt = new Text({
      text: "ONLINE PROFILES",
      style: {
        fontFamily: "system-ui, -apple-system, sans-serif",
        fontSize: 22,
        fontWeight: "900",
        fill: 0xffffff,
        letterSpacing: 0.5,
      },
    });
    titleTxt.position.set(-w / 2 + 18, -h / 2 + 54);

    // GitHub Pill
    const ghBtn = new Container();
    ghBtn.position.set(-w / 2 + 18, -h / 2 + 92);
    ghBtn.eventMode = "static";
    ghBtn.cursor = "pointer";

    const ghBg = new Graphics()
      .roundRect(0, 0, w - 36, 44, 8)
      .fill({ color: 0x161622, alpha: 0.85 })
      .stroke({ width: 1.2, color: 0xf97316 });

    const ghTxt = new Text({
      text: "🐙  GitHub · @gaurav01singh ↗",
      style: {
        fontFamily: "system-ui, sans-serif",
        fontSize: 13.5,
        fontWeight: "bold",
        fill: 0xffffff,
      },
    });
    ghTxt.position.set(14, 12);
    ghBtn.addChild(ghBg, ghTxt);
    ghBtn.on("pointertap", (e) => {
      e.stopPropagation();
      if (typeof window !== "undefined") {
        window.open(PORTFOLIO.about.github, "_blank");
      }
    });

    // LinkedIn Pill
    const liBtn = new Container();
    liBtn.position.set(-w / 2 + 18, -h / 2 + 144);
    liBtn.eventMode = "static";
    liBtn.cursor = "pointer";

    const liBg = new Graphics()
      .roundRect(0, 0, w - 36, 44, 8)
      .fill({ color: 0x161622, alpha: 0.85 })
      .stroke({ width: 1.2, color: 0x38bdf8 });

    const liTxt = new Text({
      text: "💼  LinkedIn · @gaurav10singh ↗",
      style: {
        fontFamily: "system-ui, sans-serif",
        fontSize: 13.5,
        fontWeight: "bold",
        fill: 0xffffff,
      },
    });
    liTxt.position.set(14, 12);
    liBtn.addChild(liBg, liTxt);
    liBtn.on("pointertap", (e) => {
      e.stopPropagation();
      if (typeof window !== "undefined") {
        window.open(PORTFOLIO.about.linkedin, "_blank");
      }
    });

    const infoTxt = new Text({
      text: "All repositories & credentials public and verified",
      style: {
        fontFamily: "system-ui, sans-serif",
        fontSize: 13,
        fontWeight: "600",
        fill: 0x94a3b8,
      },
    });
    infoTxt.position.set(-w / 2 + 18, -h / 2 + 200);

    // CTA Button
    const ctaBg = new Graphics()
      .roundRect(-w / 2 + 18, h / 2 - 46, w - 36, 36, 8)
      .fill(0x22130c)
      .stroke({ width: 1.5, color: 0xf97316 });

    const ctaTxt = new Text({
      text: "OPEN BULLETIN BOARD ↗",
      style: {
        fontFamily: "system-ui, sans-serif",
        fontSize: 13,
        fontWeight: "900",
        fill: 0xffffff,
        letterSpacing: 0.8,
      },
    });
    ctaTxt.anchor.set(0.5);
    ctaTxt.position.set(0, h / 2 - 28);

    cont.addChild(
      shadow,
      bg,
      badgeCont,
      titleTxt,
      ghBtn,
      liBtn,
      infoTxt,
      ctaBg,
      ctaTxt,
    );

    cont.on("pointerover", () => {
      spring.target = 1.04;
      this.drawContactCardShell(bg, w, h, true, 0xf97316);
    });

    cont.on("pointerout", () => {
      spring.target = 1.0;
      this.drawContactCardShell(bg, w, h, false, 0xf97316);
    });

    cont.on("pointerdown", () => {
      spring.set(0.96);
    });

    cont.on("pointertap", () => {
      this.inspectSocials();
    });

    this.furnitureLayer.addChild(cont);
    if (!this.contactCards) this.contactCards = [];
    this.contactCards.push({ container: cont, spring });
  }

  drawContactCardShell(g, w, h, isHovered, accentColor = 0xff8fab) {
    g.clear();

    if (isHovered) {
      g.roundRect(-w / 2, -h / 2, w, h, 16)
        .fill({ color: 0x161320, alpha: 0.82 })
        .stroke({ width: 2.0, color: 0xffffff });

      g.roundRect(-w / 2 + 2, -h / 2 + 2, w - 4, 3, 1.5).fill({
        color: 0xffffff,
        alpha: 0.5,
      });
    } else {
      g.roundRect(-w / 2, -h / 2, w, h, 16)
        .fill({ color: 0x0c0814, alpha: 0.65 })
        .stroke({ width: 1.5, color: accentColor, alpha: 0.65 });

      g.roundRect(-w / 2 + 2, -h / 2 + 2, w - 4, 3, 1.5).fill({
        color: accentColor,
        alpha: 0.75,
      });
    }
  }

  inspectDirectContact() {
    const c = new Container();

    const title = new Text({
      text: "Direct Contact Channels (Click to Open / Copy)",
      style: {
        fontFamily: "system-ui, -apple-system, sans-serif",
        fontSize: 22,
        fontWeight: "900",
        fill: 0xffffff,
      },
    });
    title.position.set(0, 0);

    // Email Button
    const emailBtn = new Container();
    emailBtn.position.set(0, 36);
    emailBtn.eventMode = "static";
    emailBtn.cursor = "pointer";

    const eBg = new Graphics()
      .roundRect(0, 0, 700, 54, 8)
      .fill({ color: 0x161e2e, alpha: 0.85 })
      .stroke({ width: 1.5, color: 0x475569 });

    const eTxt = new Text({
      text: `✉  Email: ${PORTFOLIO.contact.email}  (Click to Copy / Open ↗)`,
      style: {
        fontFamily: "system-ui, sans-serif",
        fontSize: 15,
        fontWeight: "bold",
        fill: 0xffffff,
      },
    });
    eTxt.position.set(16, 17);

    emailBtn.addChild(eBg, eTxt);
    emailBtn.on("pointertap", () => {
      this.copyToClipboard(
        PORTFOLIO.contact.email,
        "Email copied to clipboard!",
      );
      if (typeof window !== "undefined") {
        window.open(`mailto:${PORTFOLIO.contact.email}`, "_self");
      }
    });

    // Phone Button
    const phoneBtn = new Container();
    phoneBtn.position.set(0, 102);
    phoneBtn.eventMode = "static";
    phoneBtn.cursor = "pointer";

    const pBg = new Graphics()
      .roundRect(0, 0, 700, 54, 8)
      .fill({ color: 0x161e2e, alpha: 0.85 })
      .stroke({ width: 1.5, color: 0x475569 });

    const pTxt = new Text({
      text: `☎  Phone / WhatsApp: ${PORTFOLIO.contact.phone}  (Click to Copy / Call ↗)`,
      style: {
        fontFamily: "system-ui, sans-serif",
        fontSize: 15,
        fontWeight: "bold",
        fill: 0xffffff,
      },
    });
    pTxt.position.set(16, 17);

    phoneBtn.addChild(pBg, pTxt);
    phoneBtn.on("pointertap", () => {
      this.copyToClipboard(
        PORTFOLIO.contact.phone,
        "Phone number copied to clipboard!",
      );
      if (typeof window !== "undefined") {
        window.open(`tel:${PORTFOLIO.contact.phone}`, "_self");
      }
    });

    // GitHub Link Button
    const ghBtn = new Container();
    ghBtn.position.set(0, 168);
    ghBtn.eventMode = "static";
    ghBtn.cursor = "pointer";

    const ghBg = new Graphics()
      .roundRect(0, 0, 340, 48, 8)
      .fill({ color: 0x161e2e, alpha: 0.85 })
      .stroke({ width: 1.5, color: 0x475569 });

    const ghTxt = new Text({
      text: "🐙  GitHub Profile ↗",
      style: {
        fontFamily: "system-ui, sans-serif",
        fontSize: 14.5,
        fontWeight: "bold",
        fill: 0xffffff,
      },
    });
    ghTxt.position.set(16, 14);
    ghBtn.addChild(ghBg, ghTxt);
    ghBtn.on("pointertap", () => {
      if (typeof window !== "undefined") {
        window.open(PORTFOLIO.about.github, "_blank");
      }
    });

    // LinkedIn Link Button
    const liBtn = new Container();
    liBtn.position.set(360, 168);
    liBtn.eventMode = "static";
    liBtn.cursor = "pointer";

    const liBg = new Graphics()
      .roundRect(0, 0, 340, 48, 8)
      .fill({ color: 0x161e2e, alpha: 0.85 })
      .stroke({ width: 1.5, color: 0x475569 });

    const liTxt = new Text({
      text: "💼  LinkedIn Profile ↗",
      style: {
        fontFamily: "system-ui, sans-serif",
        fontSize: 14.5,
        fontWeight: "bold",
        fill: 0xffffff,
      },
    });
    liTxt.position.set(16, 14);
    liBtn.addChild(liBg, liTxt);
    liBtn.on("pointertap", () => {
      if (typeof window !== "undefined") {
        window.open(PORTFOLIO.about.linkedin, "_blank");
      }
    });

    // Location
    const loc = new Text({
      text: `📍 Location: ${PORTFOLIO.contact.location} (Worldwide Remote / On-Site Available)`,
      style: {
        fontFamily: "system-ui, sans-serif",
        fontSize: 14,
        fontWeight: "bold",
        fill: 0x94a3b8,
      },
    });
    loc.position.set(0, 230);

    c.addChild(title, emailBtn, phoneBtn, ghBtn, liBtn, loc);

    this.showInspector({
      title: "Espresso Bar — Direct Contact & Profiles",
      icon: "",
      color: 0xffffff,
      width: 760,
      x: (this.roomWidth - 760) / 2,
      y: 60,
      content: c,
    });
  }

  inspectCollaboration() {
    const c = new Container();

    const title = new Text({
      text: "Let's Build Games & Interactive Software",
      style: {
        fontFamily: "system-ui, -apple-system, sans-serif",
        fontSize: 22,
        fontWeight: "900",
        fill: 0xffffff,
      },
    });
    title.position.set(0, 0);

    const desc = new Text({
      text: "Whether you're developing a Unity title that needs gameplay polish and physics feel, building a high-speed PixiJS / Canvas web experience, or structuring a full-stack Node.js backend — I'm always eager to collaborate.\n\nI love tackling tricky performance bottlenecks, designing juicy animations, and turning complex ideas into software people genuinely enjoy using.",
      style: {
        fontFamily: "system-ui, sans-serif",
        fontSize: 15.5,
        fill: 0xd0d7de,
        lineHeight: 23,
        wordWrap: true,
        wordWrapWidth: 680,
      },
    });
    desc.position.set(0, 36);

    c.addChild(title, desc);

    this.showInspector({
      title: "Collaboration Invitation",
      icon: "",
      color: 0xffffff,
      width: 760,
      x: (this.roomWidth - 760) / 2,
      y: 60,
      content: c,
    });
  }

  inspectSocials() {
    const c = new Container();

    const title = new Text({
      text: "Social Channels & Profiles (Click to Open)",
      style: {
        fontFamily: "system-ui, -apple-system, sans-serif",
        fontSize: 22,
        fontWeight: "900",
        fill: 0xffffff,
      },
    });
    title.position.set(0, 0);

    const socials = PORTFOLIO.contact.socials || [
      {
        name: "GitHub",
        handle: "gaurav01singh",
        url: PORTFOLIO.about.github || "https://github.com/gaurav01singh",
      },
      {
        name: "LinkedIn",
        handle: "gaurav10singh",
        url:
          PORTFOLIO.about.linkedin || "https://linkedin.com/in/gaurav10singh",
      },
    ];

    let sy = 36;
    socials.forEach((s) => {
      const btn = new Container();
      btn.position.set(0, sy);
      btn.eventMode = "static";
      btn.cursor = "pointer";

      const bg = new Graphics()
        .roundRect(0, 0, 700, 64, 8)
        .fill({ color: 0x161e2e, alpha: 0.85 })
        .stroke({ width: 1.5, color: 0x475569 });

      const n = new Text({
        text: `${s.name.toUpperCase()} (Click to Open ↗)`,
        style: {
          fontFamily: "system-ui, sans-serif",
          fontSize: 16,
          fontWeight: "900",
          fill: 0xffffff,
          letterSpacing: 0.5,
        },
      });
      n.position.set(16, 12);

      const d = new Text({
        text: `${s.url}`,
        style: {
          fontFamily: "system-ui, sans-serif",
          fontSize: 13.5,
          fontWeight: "600",
          fill: 0x38bdf8,
        },
      });
      d.position.set(16, 36);

      btn.addChild(bg, n, d);

      btn.on("pointerover", () => {
        bg.clear()
          .roundRect(0, 0, 700, 64, 8)
          .fill({ color: 0x1e293b, alpha: 0.95 })
          .stroke({ width: 2, color: 0xffffff });
      });

      btn.on("pointerout", () => {
        bg.clear()
          .roundRect(0, 0, 700, 64, 8)
          .fill({ color: 0x161e2e, alpha: 0.85 })
          .stroke({ width: 1.5, color: 0x475569 });
      });

      btn.on("pointertap", () => {
        if (typeof window !== "undefined") {
          window.open(s.url, "_blank");
        }
      });

      c.addChild(btn);
      sy += 76;
    });

    this.showInspector({
      title: "Social Bulletin Board",
      icon: "",
      color: 0xffffff,
      width: 760,
      x: (this.roomWidth - 760) / 2,
      y: 60,
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

    // Animate contact cards spring physics
    if (this.contactCards && this.contactCards.length) {
      const dt = (delta || 1) * 0.016;
      this.contactCards.forEach((c) => {
        if (c && c.spring && c.container && !c.container.destroyed) {
          const s = c.spring.update(dt);
          c.container.scale.set(s);
        }
      });
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
