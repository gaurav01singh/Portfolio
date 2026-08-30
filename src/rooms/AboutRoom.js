import { Container, Graphics, Text } from "pixi.js";
import { Room } from "./Room";
import { Spring } from "../utils/Juice";
import { PORTFOLIO } from "../data/portfolio";
import { createAboutShader } from "../utils/RoomShaders";

export class AboutRoom extends Room {
  constructor(app) {
    super(app, {
      accentColor: PORTFOLIO.about.accentColor ?? 0xffffff,
      title: `${PORTFOLIO.about.title} · ${PORTFOLIO.about.fullName}`,
      type: "Observatory",
      icon: "",
    });
  }

  buildRoom() {
    const rw = this.roomWidth;
    const rh = this.roomHeight;
    const floorY = rh * 0.78;

    this.time = 0;

    // Animation tracking arrays
    this.stars = [];
    this.shootingStars = [];
    this.astrolabeRings = [];
    this.stations = [];

    // Attach Cosmic Nebula Shader
    this.shaderFilter = createAboutShader();
    if (this.shaderFilter) {
      this.backgroundLayer.filters = [this.shaderFilter];
    }

    // ============================================
    // 1. DEEP SPACE SKY & INTERSTELLAR NEBULA
    // ============================================
    const skyGfx = new Graphics();

    const skyStops = [
      { y: 0, color: 0x030712 },
      { y: floorY * 0.35, color: 0x070d1e },
      { y: floorY * 0.65, color: 0x0f172a },
      { y: floorY * 0.88, color: 0x1e1b4b },
      { y: floorY, color: 0x312e81 },
    ];

    for (let i = 0; i < skyStops.length - 1; i++) {
      const top = skyStops[i];
      const bot = skyStops[i + 1];
      const bandH = bot.y - top.y;
      const subSteps = 6;
      for (let s = 0; s < subSteps; s++) {
        const t = s / subSteps;
        const cy = top.y + t * bandH;
        const ch = bandH / subSteps + 1;
        const color = this.interpolateColor(top.color, bot.color, t);
        skyGfx.rect(0, cy, rw, ch).fill(color);
      }
    }
    this.backgroundLayer.addChild(skyGfx);

    // Glowing Celestial Moon
    const moonCont = new Container();
    const moonX = rw * 0.85;
    const moonY = floorY * 0.28;
    moonCont.position.set(moonX, moonY);

    const moonHalo = new Graphics();
    moonHalo.circle(0, 0, 80).fill({ color: 0xe0e7ff, alpha: 0.08 });
    moonHalo.circle(0, 0, 52).fill({ color: 0xe0e7ff, alpha: 0.16 });
    moonHalo.circle(0, 0, 32).fill({ color: 0xf8fafc, alpha: 0.35 });
    moonHalo.circle(0, 0, 22).fill(0xffffff);

    // Subtle moon craters
    moonHalo.circle(-6, -4, 4).fill({ color: 0xc7d2fe, alpha: 0.5 });
    moonHalo.circle(5, 6, 3).fill({ color: 0xc7d2fe, alpha: 0.45 });
    moonHalo.circle(7, -6, 2.5).fill({ color: 0xc7d2fe, alpha: 0.4 });

    moonCont.addChild(moonHalo);
    this.backgroundLayer.addChild(moonCont);

    // Cosmic Constellation Wireframes
    const constellationGfx = new Graphics();
    const constPoints = [
      { x: rw * 0.14, y: 70 },
      { x: rw * 0.22, y: 110 },
      { x: rw * 0.32, y: 85 },
      { x: rw * 0.44, y: 140 },
      { x: rw * 0.55, y: 95 },
      { x: rw * 0.68, y: 130 },
      { x: rw * 0.78, y: 75 },
    ];

    constellationGfx.moveTo(constPoints[0].x, constPoints[0].y);
    for (let i = 1; i < constPoints.length; i++) {
      constellationGfx.lineTo(constPoints[i].x, constPoints[i].y);
    }
    constellationGfx.stroke({ width: 1, color: 0x818cf8, alpha: 0.4 });

    constPoints.forEach((p) => {
      constellationGfx.circle(p.x, p.y, 3).fill(0xffffff);
      constellationGfx
        .circle(p.x, p.y, 7)
        .fill({ color: 0x818cf8, alpha: 0.35 });
    });
    this.backgroundLayer.addChild(constellationGfx);

    // Twinkling Star Field
    this.starsContainer = new Container();
    for (let i = 0; i < 65; i++) {
      const star = new Graphics();
      const r = 0.8 + Math.random() * 1.8;
      star.circle(0, 0, r).fill(0xffffff);
      star.x = Math.random() * rw;
      star.y = Math.random() * (floorY - 20);
      star.alpha = 0.3 + Math.random() * 0.7;
      this.starsContainer.addChild(star);
      this.stars.push({
        gfx: star,
        baseAlpha: star.alpha,
        twinkleSpeed: 1.5 + Math.random() * 3.0,
        seed: Math.random() * 10,
      });
    }
    this.backgroundLayer.addChild(this.starsContainer);

    // Shooting Stars Layer
    this.shootingStarsGfx = new Graphics();
    this.backgroundLayer.addChild(this.shootingStarsGfx);

    // ============================================
    // 2. OBSERVATORY STONE TERRACE & PROPS
    // ============================================
    const floor = new Graphics();
    floor.rect(0, floorY, rw, rh - floorY).fill(0x0f172a);

    // Stone Terrace Pavers
    for (let fx = 0; fx < rw; fx += 60) {
      floor
        .moveTo(fx, floorY)
        .lineTo(fx - 25, rh)
        .stroke({ width: 1.5, color: 0x1e293b, alpha: 0.7 });
    }

    // Celestial Zodiac Inlay Ring on Floor
    floor
      .circle(rw * 0.5, floorY + 48, 85)
      .stroke({ width: 2, color: 0x334155, alpha: 0.6 });
    floor
      .circle(rw * 0.5, floorY + 48, 55)
      .stroke({ width: 1, color: 0x475569, alpha: 0.5 });
    floor
      .circle(rw * 0.5, floorY + 48, 18)
      .fill({ color: 0x1e293b, alpha: 0.8 });

    // Stone Balustrade & Carved Railing
    floor.rect(0, floorY - 8, rw, 8).fill(0x1e293b);

    for (let bx = 20; bx < rw; bx += 65) {
      floor.roundRect(bx - 4, floorY - 26, 8, 26, 2).fill(0x334155);
      floor.rect(bx - 6, floorY - 28, 12, 4).fill(0x64748b);
    }
    floor.rect(0, floorY - 20, rw, 4).fill(0x475569);

    this.foregroundLayer.addChild(floor);

    // Stargazer Astronomical Telescope (Left Corner)
    this.createStargazerTelescope(rw * 0.08, floorY - 8);

    // Rotating Armillary Astrolabe (Right Corner)
    this.createArmillaryAstrolabe(rw * 0.92, floorY - 8);

    // ============================================
    // 3. THREE FROSTED OBSIDIAN DOSSIER STATIONS (FROM PORTFOLIO.JS)
    // ============================================
    const stationW = Math.min(360, (rw - 120) / 3);
    const stationH = 340;
    const startX = (rw - (stationW * 3 + 40)) / 2 + stationW / 2;
    const cardY = 82 + stationH / 2;

    // --- Station 1: VOYAGER BIOGRAPHY (Left) ---
    this.createVoyagerStation(startX, cardY, stationW, stationH);

    // --- Station 2: CAREER & EDUCATION HIGHLIGHTS (Center) ---
    this.createMetricsStation(
      startX + stationW + 20,
      cardY,
      stationW,
      stationH,
    );

    // --- Station 3: DEV MANTRAS & CHANNELS (Right) ---
    this.createPhilosophyStation(
      startX + (stationW + 20) * 2,
      cardY,
      stationW,
      stationH,
    );
  }

  createVoyagerStation(x, y, w, h) {
    const cont = new Container();
    cont.position.set(x, y);
    cont.eventMode = "static";
    cont.cursor = "pointer";

    const spring = new Spring(1.0, 260, 14);

    // Drop Shadow
    const shadow = new Graphics()
      .roundRect(-w / 2 + 5, -h / 2 + 7, w, h, 16)
      .fill({ color: 0x000000, alpha: 0.65 });

    // 0.5 Alpha Frosted Glass Body
    const bg = new Graphics();
    this.drawObservatoryShell(bg, w, h, false);

    // Milestone Badge (From PORTFOLIO.about.eyebrow)
    const badgeTxt = new Text({
      text: PORTFOLIO.about.eyebrow || "DEVELOPER PROFILE",
      style: {
        fontFamily: "system-ui, sans-serif",
        fontSize: 9,
        fontWeight: "900",
        fill: 0xe2e8f0,
        letterSpacing: 0.8,
      },
    });
    badgeTxt.position.set(8, 4);

    const bBg = new Graphics()
      .roundRect(0, 0, badgeTxt.width + 16, 22, 6)
      .fill({ color: 0x1e293b, alpha: 0.8 })
      .stroke({ width: 1, color: 0x475569, alpha: 0.8 });

    const badgeCont = new Container();
    badgeCont.position.set(-w / 2 + 16, -h / 2 + 16);
    badgeCont.addChild(bBg, badgeTxt);

    // Name & Title (From PORTFOLIO.about)
    const nameTxt = new Text({
      text: PORTFOLIO.about.fullName,
      style: {
        fontFamily: "system-ui, -apple-system, sans-serif",
        fontSize: 16,
        fontWeight: "900",
        fill: 0xffffff,
        letterSpacing: 0.6,
      },
    });
    nameTxt.position.set(-w / 2 + 16, -h / 2 + 48);

    const roleTxt = new Text({
      text: `${PORTFOLIO.about.role} · ${PORTFOLIO.about.location}`,
      style: {
        fontFamily: "system-ui, sans-serif",
        fontSize: 11.5,
        fontWeight: "700",
        fill: 0x94a3b8,
        lineHeight: 16,
        wordWrap: true,
        wordWrapWidth: w - 32,
      },
    });
    roleTxt.position.set(-w / 2 + 16, -h / 2 + 74);

    // Summary Text (From PORTFOLIO.about.summary)
    const summaryTxt = new Text({
      text: PORTFOLIO.about.summary,
      style: {
        fontFamily: "system-ui, sans-serif",
        fontSize: 11,
        fill: 0xd1d5db,
        lineHeight: 16.5,
        wordWrap: true,
        wordWrapWidth: w - 32,
      },
    });
    summaryTxt.position.set(-w / 2 + 16, -h / 2 + 116);

    // Action Button
    const ctaBg = new Graphics()
      .roundRect(-w / 2 + 16, h / 2 - 38, w - 32, 28, 6)
      .fill(0x161e2e)
      .stroke({ width: 1.5, color: 0x475569 });

    const ctaTxt = new Text({
      text: "EXPLORE FULL DOSSIER ↗",
      style: {
        fontFamily: "system-ui, sans-serif",
        fontSize: 10,
        fontWeight: "900",
        fill: 0xffffff,
        letterSpacing: 0.6,
      },
    });
    ctaTxt.anchor.set(0.5);
    ctaTxt.position.set(0, h / 2 - 24);

    cont.addChild(
      shadow,
      bg,
      badgeCont,
      nameTxt,
      roleTxt,
      summaryTxt,
      ctaBg,
      ctaTxt,
    );

    cont.on("pointerover", () => {
      spring.target = 1.04;
      this.drawObservatoryShell(bg, w, h, true);
    });

    cont.on("pointerout", () => {
      spring.target = 1.0;
      this.drawObservatoryShell(bg, w, h, false);
    });

    cont.on("pointerdown", () => {
      spring.set(0.96);
    });

    cont.on("pointertap", () => {
      this.inspectBiography();
    });

    this.furnitureLayer.addChild(cont);
    this.stations.push({ container: cont, spring });
  }

  createMetricsStation(x, y, w, h) {
    const cont = new Container();
    cont.position.set(x, y);
    cont.eventMode = "static";
    cont.cursor = "pointer";

    const spring = new Spring(1.0, 260, 14);

    const shadow = new Graphics()
      .roundRect(-w / 2 + 5, -h / 2 + 7, w, h, 16)
      .fill({ color: 0x000000, alpha: 0.65 });

    const bg = new Graphics();
    this.drawObservatoryShell(bg, w, h, false);

    // Milestone Badge (From PORTFOLIO.education.eyebrow)
    const badgeTxt = new Text({
      text: PORTFOLIO.education.eyebrow || "EXPEDITION HIGHLIGHTS",
      style: {
        fontFamily: "system-ui, sans-serif",
        fontSize: 9,
        fontWeight: "900",
        fill: 0xe2e8f0,
        letterSpacing: 0.8,
      },
    });
    badgeTxt.position.set(8, 4);

    const bBg = new Graphics()
      .roundRect(0, 0, badgeTxt.width + 16, 22, 6)
      .fill({ color: 0x1e293b, alpha: 0.8 })
      .stroke({ width: 1, color: 0x475569, alpha: 0.8 });

    const badgeCont = new Container();
    badgeCont.position.set(-w / 2 + 16, -h / 2 + 16);
    badgeCont.addChild(bBg, badgeTxt);

    // Dynamic metrics pulled 100% from PORTFOLIO
    const totalProjects = PORTFOLIO.projects?.list?.length || 0;
    const currentJob = PORTFOLIO.experience?.jobs?.[0];
    const pastJob = PORTFOLIO.experience?.jobs?.[1];
    const degree = PORTFOLIO.education?.degree;

    const metrics = [
      {
        num: `${totalProjects} PROJECTS`,
        label: PORTFOLIO.projects?.eyebrow || "Real-Time Games & Applications",
      },
      {
        num: currentJob ? currentJob.company.toUpperCase() : "EXPERIENCE",
        label: currentJob
          ? `${currentJob.role} (${currentJob.period})`
          : "Creative Technologist",
      },
      {
        num: pastJob ? pastJob.company.toUpperCase() : "GAME DEV",
        label: pastJob
          ? `${pastJob.role} (${pastJob.period})`
          : "Unity Game Developer",
      },
      {
        num: degree ? degree.score : "B.TECH CSE",
        label: degree
          ? `${degree.title} · ${degree.period}`
          : "Computer Science and Engineering",
      },
    ];

    const metricsCont = new Container();
    metricsCont.position.set(-w / 2 + 16, -h / 2 + 48);

    metrics.forEach((m, idx) => {
      const my = idx * 60;

      const mBg = new Graphics()
        .roundRect(0, my, w - 32, 50, 8)
        .fill({ color: 0x0f172a, alpha: 0.6 })
        .stroke({ width: 1, color: 0x334155, alpha: 0.7 });

      const numTxt = new Text({
        text: m.num,
        style: {
          fontFamily: "system-ui, -apple-system, sans-serif",
          fontSize: 13.5,
          fontWeight: "900",
          fill: 0xffffff,
          letterSpacing: 0.5,
        },
      });
      numTxt.position.set(12, my + 8);

      const labelTxt = new Text({
        text: m.label,
        style: {
          fontFamily: "system-ui, sans-serif",
          fontSize: 10,
          fontWeight: "600",
          fill: 0x94a3b8,
          wordWrap: true,
          wordWrapWidth: w - 60,
        },
      });
      labelTxt.position.set(12, my + 28);

      metricsCont.addChild(mBg, numTxt, labelTxt);
    });

    // Action Button
    const ctaBg = new Graphics()
      .roundRect(-w / 2 + 16, h / 2 - 38, w - 32, 28, 6)
      .fill(0x161e2e)
      .stroke({ width: 1.5, color: 0x475569 });

    const ctaTxt = new Text({
      text: "VIEW CREDENTIALS ↗",
      style: {
        fontFamily: "system-ui, sans-serif",
        fontSize: 10,
        fontWeight: "900",
        fill: 0xffffff,
        letterSpacing: 0.6,
      },
    });
    ctaTxt.anchor.set(0.5);
    ctaTxt.position.set(0, h / 2 - 24);

    cont.addChild(shadow, bg, badgeCont, metricsCont, ctaBg, ctaTxt);

    cont.on("pointerover", () => {
      spring.target = 1.04;
      this.drawObservatoryShell(bg, w, h, true);
    });

    cont.on("pointerout", () => {
      spring.target = 1.0;
      this.drawObservatoryShell(bg, w, h, false);
    });

    cont.on("pointerdown", () => {
      spring.set(0.96);
    });

    cont.on("pointertap", () => {
      this.inspectBiography();
    });

    this.furnitureLayer.addChild(cont);
    this.stations.push({ container: cont, spring });
  }

  createPhilosophyStation(x, y, w, h) {
    const cont = new Container();
    cont.position.set(x, y);
    cont.eventMode = "static";
    cont.cursor = "pointer";

    const spring = new Spring(1.0, 260, 14);

    const shadow = new Graphics()
      .roundRect(-w / 2 + 5, -h / 2 + 7, w, h, 16)
      .fill({ color: 0x000000, alpha: 0.65 });

    const bg = new Graphics();
    this.drawObservatoryShell(bg, w, h, false);

    // Milestone Badge (From PORTFOLIO.experience.eyebrow)
    const badgeTxt = new Text({
      text: PORTFOLIO.experience.eyebrow || "DEVELOPER MANTRAS & LINKS",
      style: {
        fontFamily: "system-ui, sans-serif",
        fontSize: 9,
        fontWeight: "900",
        fill: 0xe2e8f0,
        letterSpacing: 0.8,
      },
    });
    badgeTxt.position.set(8, 4);

    const bBg = new Graphics()
      .roundRect(0, 0, badgeTxt.width + 16, 22, 6)
      .fill({ color: 0x1e293b, alpha: 0.8 })
      .stroke({ width: 1, color: 0x475569, alpha: 0.8 });

    const badgeCont = new Container();
    badgeCont.position.set(-w / 2 + 16, -h / 2 + 16);
    badgeCont.addChild(bBg, badgeTxt);

    // Quotes directly from PORTFOLIO.about.quotes
    const quotes = PORTFOLIO.about.quotes || [];
    const quotesCont = new Container();
    quotesCont.position.set(-w / 2 + 16, -h / 2 + 48);

    quotes.slice(0, 3).forEach((quote, idx) => {
      const qy = idx * 62;

      const qBg = new Graphics()
        .roundRect(0, qy, w - 32, 54, 8)
        .fill({ color: 0x0f172a, alpha: 0.6 })
        .stroke({ width: 1, color: 0x334155, alpha: 0.7 });

      const qTitle = new Text({
        text: `MANTRA 0${idx + 1}`,
        style: {
          fontFamily: "system-ui, -apple-system, sans-serif",
          fontSize: 10,
          fontWeight: "900",
          fill: 0xffffff,
          letterSpacing: 0.5,
        },
      });
      qTitle.position.set(10, qy + 7);

      const qDesc = new Text({
        text: `"${quote}"`,
        style: {
          fontFamily: "system-ui, sans-serif",
          fontSize: 10,
          fill: 0x94a3b8,
          lineHeight: 14,
          wordWrap: true,
          wordWrapWidth: w - 52,
        },
      });
      qDesc.position.set(10, qy + 24);

      quotesCont.addChild(qBg, qTitle, qDesc);
    });

    // Action Button
    const ctaBg = new Graphics()
      .roundRect(-w / 2 + 16, h / 2 - 38, w - 32, 28, 6)
      .fill(0x161e2e)
      .stroke({ width: 1.5, color: 0x475569 });

    const ctaTxt = new Text({
      text: "OPEN CONTACT & LINKS ↗",
      style: {
        fontFamily: "system-ui, sans-serif",
        fontSize: 10,
        fontWeight: "900",
        fill: 0xffffff,
        letterSpacing: 0.6,
      },
    });
    ctaTxt.anchor.set(0.5);
    ctaTxt.position.set(0, h / 2 - 24);

    cont.addChild(shadow, bg, badgeCont, quotesCont, ctaBg, ctaTxt);

    cont.on("pointerover", () => {
      spring.target = 1.04;
      this.drawObservatoryShell(bg, w, h, true);
    });

    cont.on("pointerout", () => {
      spring.target = 1.0;
      this.drawObservatoryShell(bg, w, h, false);
    });

    cont.on("pointerdown", () => {
      spring.set(0.96);
    });

    cont.on("pointertap", () => {
      this.inspectBiography();
    });

    this.furnitureLayer.addChild(cont);
    this.stations.push({ container: cont, spring });
  }

  drawObservatoryShell(g, w, h, isHovered) {
    g.clear();

    if (isHovered) {
      // Hovered: Illuminated Starlight Glass with pure white silver rim
      g.roundRect(-w / 2, -h / 2, w, h, 16)
        .fill({ color: 0x131d2e, alpha: 0.75 })
        .stroke({ width: 2.0, color: 0xffffff });

      // Top Glass Highlight Bevel
      g.roundRect(-w / 2 + 3, -h / 2 + 2, w - 6, 2, 1).fill({
        color: 0xffffff,
        alpha: 0.45,
      });
    } else {
      // Default: Deep Neutral Obsidian Slate Frosted Glass Shell with 0.5 alpha
      g.roundRect(-w / 2, -h / 2, w, h, 16)
        .fill({ color: 0x0a101d, alpha: 0.5 })
        .stroke({ width: 1.5, color: 0x334155, alpha: 0.85 });

      // Top Glass Highlight Bevel
      g.roundRect(-w / 2 + 3, -h / 2 + 2, w - 6, 2, 1).fill({
        color: 0xffffff,
        alpha: 0.22,
      });
    }
  }

  createStargazerTelescope(x, y) {
    const cont = new Container();
    cont.position.set(x, y);

    const g = new Graphics();

    // Tripod Stand
    g.moveTo(-18, 0).lineTo(0, -50).stroke({ width: 3, color: 0x334155 });
    g.moveTo(18, 0).lineTo(0, -50).stroke({ width: 3, color: 0x334155 });
    g.moveTo(0, 0).lineTo(0, -50).stroke({ width: 3.5, color: 0x475569 });

    // Pivot Mount
    g.circle(0, -50, 6).fill(0x64748b);

    // Brass/Slate Telescope Tube (Angled at 40 degrees towards the stars)
    g.moveTo(-16, -42)
      .lineTo(36, -82)
      .lineTo(44, -76)
      .lineTo(-8, -36)
      .closePath()
      .fill(0x1e293b)
      .stroke({ width: 1.5, color: 0x94a3b8 });

    // Brass Rings
    g.rect(6, -60, 5, 12).fill(0xffffff);

    // Front Lens Glass Glow
    g.ellipse(40, -79, 6, 3).fill({ color: 0x818cf8, alpha: 0.85 });

    cont.addChild(g);
    this.furnitureLayer.addChild(cont);
  }

  createArmillaryAstrolabe(x, y) {
    const cont = new Container();
    cont.position.set(x, y);

    const g = new Graphics();

    // Marble Pedestal
    g.roundRect(-16, -24, 32, 24, 4).fill(0x1e293b);
    g.roundRect(-12, -42, 24, 18, 2).fill(0x334155);

    cont.addChild(g);

    // Rotating Astrolabe Rings
    this.astrolabeCont = new Container();
    this.astrolabeCont.position.set(0, -62);

    const ring1 = new Graphics();
    ring1.circle(0, 0, 22).stroke({ width: 2, color: 0x94a3b8, alpha: 0.85 });

    const ring2 = new Graphics();
    ring2.circle(0, 0, 16).stroke({ width: 1.5, color: 0xffffff, alpha: 0.9 });

    const coreStar = new Graphics();
    coreStar.circle(0, 0, 4).fill(0xffffff);
    coreStar.circle(0, 0, 8).fill({ color: 0x818cf8, alpha: 0.4 });

    this.astrolabeCont.addChild(ring1, ring2, coreStar);
    cont.addChild(this.astrolabeCont);
    this.furnitureLayer.addChild(cont);
  }

  interpolateColor(c1, c2, t) {
    const r1 = (c1 >> 16) & 255;
    const g1 = (c1 >> 8) & 255;
    const b1 = c1 & 255;

    const r2 = (c2 >> 16) & 255;
    const g2 = (c2 >> 8) & 255;
    const b2 = c2 & 255;

    const r = Math.round(r1 + (r2 - r1) * t);
    const g = Math.round(g1 + (g2 - g1) * t);
    const b = Math.round(b1 + (b2 - b1) * t);

    return (r << 16) | (g << 8) | b;
  }

  inspectBiography() {
    const c = new Container();

    const title = new Text({
      text: PORTFOLIO.about.fullName,
      style: {
        fontFamily: "system-ui, -apple-system, sans-serif",
        fontSize: 18,
        fontWeight: "900",
        fill: 0xffffff,
        letterSpacing: 0.6,
      },
    });
    title.position.set(0, 0);

    const role = new Text({
      text: `${PORTFOLIO.about.role} · ${PORTFOLIO.about.location}`,
      style: {
        fontFamily: "system-ui, sans-serif",
        fontSize: 11,
        fontWeight: "800",
        fill: 0x94a3b8,
        letterSpacing: 0.8,
      },
    });
    role.position.set(0, 26);

    const summaryTxt = new Text({
      text: PORTFOLIO.about.summary,
      style: {
        fontFamily: "system-ui, sans-serif",
        fontSize: 12.5,
        fill: 0xd1d5db,
        lineHeight: 19,
        wordWrap: true,
        wordWrapWidth: 490,
      },
    });
    summaryTxt.position.set(0, 52);

    const contactHeader = new Text({
      text: "CONTACT & CHANNELS",
      style: {
        fontFamily: "system-ui, sans-serif",
        fontSize: 11,
        fontWeight: "900",
        fill: 0xffffff,
        letterSpacing: 0.8,
      },
    });
    contactHeader.position.set(0, summaryTxt.y + summaryTxt.height + 14);

    const contactLinks = new Text({
      text: `GitHub: ${PORTFOLIO.about.github}\nLinkedIn: ${PORTFOLIO.about.linkedin}\nEmail: ${PORTFOLIO.about.email}\nPhone: ${PORTFOLIO.about.phone}`,
      style: {
        fontFamily: "system-ui, sans-serif",
        fontSize: 12,
        fill: 0x94a3b8,
        lineHeight: 18,
      },
    });
    contactLinks.position.set(0, contactHeader.y + 22);

    c.addChild(title, role, summaryTxt, contactHeader, contactLinks);

    this.showInspector({
      title: `${PORTFOLIO.about.title} · ${PORTFOLIO.about.fullName}`,
      icon: "",
      color: 0xffffff,
      width: 550,
      x: (this.roomWidth - 550) / 2,
      y: 70,
      content: c,
    });
  }

  update(delta) {
    if (this.destroyed) return;
    super.update(delta);
    if (this.destroyed || this.isClosing) return;

    const dt = (delta || 1) * 0.016;
    this.time += dt;

    // Update Cosmic Nebula Shader
    if (this.shaderFilter?.resources?.filterUniforms?.uniforms) {
      this.shaderFilter.resources.filterUniforms.uniforms.uTime = this.time;
    }

    const rw = this.roomWidth;
    const floorY = this.roomHeight * 0.78;

    // 1. Twinkling Stars
    if (this.stars && this.stars.length) {
      this.stars.forEach((s) => {
        if (s.gfx && !s.gfx.destroyed) {
          s.gfx.alpha =
            s.baseAlpha *
            (0.5 + Math.sin(this.time * s.twinkleSpeed + s.seed) * 0.5);
        }
      });
    }

    // 2. Spawn and Animate Shooting Stars
    if (Math.random() < 0.012 && this.shootingStars.length < 3) {
      this.shootingStars.push({
        x: Math.random() * rw * 0.8,
        y: Math.random() * (floorY * 0.5),
        length: 40 + Math.random() * 35,
        vx: 380 + Math.random() * 200,
        vy: 200 + Math.random() * 100,
        alpha: 1.0,
      });
    }

    if (this.shootingStarsGfx && !this.shootingStarsGfx.destroyed) {
      this.shootingStarsGfx.clear();
      for (let i = this.shootingStars.length - 1; i >= 0; i--) {
        const ss = this.shootingStars[i];
        ss.x += ss.vx * dt;
        ss.y += ss.vy * dt;
        ss.alpha -= 1.2 * dt;

        if (ss.alpha <= 0.05) {
          this.shootingStars.splice(i, 1);
        } else {
          this.shootingStarsGfx
            .moveTo(ss.x, ss.y)
            .lineTo(ss.x - ss.length, ss.y - ss.length * 0.5)
            .stroke({ width: 1.8, color: 0xffffff, alpha: ss.alpha });
        }
      }
    }

    // 3. Rotating Armillary Astrolabe in 3D Motion
    if (this.astrolabeCont && !this.astrolabeCont.destroyed) {
      this.astrolabeCont.rotation = this.time * 0.8;
      this.astrolabeCont.scale.x = Math.sin(this.time * 1.2);
    }

    // 4. Station Spring Physics
    if (this.stations && Array.isArray(this.stations)) {
      this.stations.forEach((st) => {
        if (
          st &&
          st.spring &&
          st.container &&
          !st.container.destroyed &&
          st.container.scale &&
          typeof st.container.scale.set === "function"
        ) {
          const s = st.spring.update(dt);
          st.container.scale.set(s);
        }
      });
    }
  }
}
