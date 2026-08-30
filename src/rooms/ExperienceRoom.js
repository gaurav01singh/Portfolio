import { Container, Graphics, Text } from "pixi.js";
import { Room } from "./Room";
import { Spring } from "../utils/Juice";
import { PORTFOLIO } from "../data/portfolio";
import { createExperienceShader } from "../utils/RoomShaders";

export class ExperienceRoom extends Room {
  constructor(app) {
    super(app, {
      accentColor: PORTFOLIO.experience.accentColor ?? 0x0ea5e9,
      title: "Coastal Voyage · Career & Milestones",
      type: "Beach",
      icon: "",
    });
  }

  buildRoom() {
    const rw = this.roomWidth;
    const rh = this.roomHeight;
    const floorY = rh * 0.8;

    this.experiences = PORTFOLIO.experience.jobs || [];
    this.time = 0;

    // Animation tracking arrays
    this.boats = [];
    this.wakeParticles = [];
    this.clouds = [];
    this.seagulls = [];
    this.palms = [];
    this.seafoamPuffs = [];

    // Attach Ocean Caustics Shader
    this.shaderFilter = createExperienceShader();
    if (this.shaderFilter) {
      this.backgroundLayer.filters = [this.shaderFilter];
    }

    // ============================================
    // 1. TROPICAL SKY GRADIENT & SUN
    // ============================================
    const skyGfx = new Graphics();
    const horizonY = floorY * 0.48;

    const skyStops = [
      { y: 0, color: 0x0369a1 },
      { y: horizonY * 0.3, color: 0x0284c7 },
      { y: horizonY * 0.6, color: 0x38bdf8 },
      { y: horizonY * 0.85, color: 0x7dd3fc },
      { y: horizonY, color: 0xfef08a },
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

    // Radiant Golden Sun
    const sunContainer = new Container();
    const sunX = rw * 0.78;
    const sunY = horizonY * 0.36;
    sunContainer.position.set(sunX, sunY);

    const sunHalo = new Graphics();
    sunHalo.circle(0, 0, 85).fill({ color: 0xfef08a, alpha: 0.12 });
    sunHalo.circle(0, 0, 56).fill({ color: 0xfef08a, alpha: 0.22 });
    sunHalo.circle(0, 0, 36).fill({ color: 0xffedd5, alpha: 0.4 });
    sunHalo.circle(0, 0, 22).fill(0xffffff);

    sunContainer.addChild(sunHalo);
    this.backgroundLayer.addChild(sunContainer);

    // Coastal Cumulus Clouds
    this.cloudsContainer = new Container();
    for (let i = 0; i < 4; i++) {
      const cloud = this.createBeachCloud(120 + Math.random() * 80);
      cloud.x = (rw / 4) * i + Math.random() * 60;
      cloud.y = 25 + i * 22;
      cloud.scale.set(0.85 + Math.random() * 0.4);
      cloud.alpha = 0.85;
      this.cloudsContainer.addChild(cloud);
      this.clouds.push({
        container: cloud,
        vx: 8 + i * 3,
      });
    }
    this.backgroundLayer.addChild(this.cloudsContainer);

    // Soaring Seagulls
    this.seagullsContainer = new Container();
    for (let i = 0; i < 5; i++) {
      const gull = this.createSeagull();
      gull.x = Math.random() * rw;
      gull.y = 30 + Math.random() * (horizonY - 50);
      this.seagullsContainer.addChild(gull);
      this.seagulls.push({
        container: gull,
        baseY: gull.y,
        vx: 24 + Math.random() * 18,
        flapSpeed: 4 + Math.random() * 3,
        seed: Math.random() * 10,
      });
    }
    this.backgroundLayer.addChild(this.seagullsContainer);

    // ============================================
    // 2. OCEAN WATER, WAVES & SUN SHIMMER
    // ============================================
    const oceanGfx = new Graphics();

    // Ocean Gradient Bands
    const oceanStops = [
      { y: horizonY, color: 0x0284c7 },
      { y: horizonY + (floorY - horizonY) * 0.35, color: 0x0ea5e9 },
      { y: horizonY + (floorY - horizonY) * 0.7, color: 0x06b6d4 },
      { y: floorY, color: 0x2dd4bf },
    ];

    for (let i = 0; i < oceanStops.length - 1; i++) {
      const top = oceanStops[i];
      const bot = oceanStops[i + 1];
      const bandH = bot.y - top.y;
      const subSteps = 6;
      for (let s = 0; s < subSteps; s++) {
        const t = s / subSteps;
        const cy = top.y + t * bandH;
        const ch = bandH / subSteps + 1;
        const color = this.interpolateColor(top.color, bot.color, t);
        oceanGfx.rect(0, cy, rw, ch).fill(color);
      }
    }

    // Sun reflection light path on ocean
    const sunBeamW = 90;
    oceanGfx
      .moveTo(sunX - 10, horizonY)
      .lineTo(sunX + 10, horizonY)
      .lineTo(sunX + sunBeamW, floorY)
      .lineTo(sunX - sunBeamW, floorY)
      .closePath()
      .fill({ color: 0xffedd5, alpha: 0.16 });

    this.backgroundLayer.addChild(oceanGfx);

    // Animated Dynamic Wave Crests
    this.wavesGraphics = new Graphics();
    this.backgroundLayer.addChild(this.wavesGraphics);

    // ============================================
    // 3. ANIMATED BOATS DRIVING & SAILING IN OCEAN
    // ============================================
    this.boatLayer = new Container();
    this.backgroundLayer.addChild(this.boatLayer);

    // Wake Particles Container
    this.wakeContainer = new Container();
    this.boatLayer.addChild(this.wakeContainer);

    // Boat 1: High-Speed Motorboat (Midground)
    const speedBoat = this.createSpeedboat();
    speedBoat.position.set(rw * 0.15, horizonY + 52);
    this.boatLayer.addChild(speedBoat);
    this.boats.push({
      container: speedBoat,
      baseY: horizonY + 52,
      vx: 45,
      bobSpeed: 7,
      bobAmount: 2.2,
      type: "speedboat",
      scale: 1.0,
    });

    // Boat 2: Classic White & Cyan Sailboat (Upper Ocean)
    const sailBoat1 = this.createSailboat(0x38bdf8);
    sailBoat1.position.set(rw * 0.65, horizonY + 24);
    sailBoat1.scale.set(0.85);
    this.boatLayer.addChild(sailBoat1);
    this.boats.push({
      container: sailBoat1,
      baseY: horizonY + 24,
      vx: 18,
      bobSpeed: 2.5,
      bobAmount: 3.5,
      type: "sailboat",
      scale: 0.85,
    });

    // Boat 3: Red & Gold Striped Catamaran / Sloop (Near Horizon)
    const sailBoat2 = this.createSailboat(0xf43f5e);
    sailBoat2.position.set(rw * 0.35, horizonY + 12);
    sailBoat2.scale.set(0.65);
    this.boatLayer.addChild(sailBoat2);
    this.boats.push({
      container: sailBoat2,
      baseY: horizonY + 12,
      vx: 12,
      bobSpeed: 2.0,
      bobAmount: 2.0,
      type: "sailboat",
      scale: 0.65,
    });

    // Boat 4: Luxury Cruiser / Yacht (Lower Ocean)
    const cruiser = this.createCruiser();
    cruiser.position.set(-80, horizonY + 88);
    this.boatLayer.addChild(cruiser);
    this.boats.push({
      container: cruiser,
      baseY: horizonY + 88,
      vx: 28,
      bobSpeed: 3.2,
      bobAmount: 2.8,
      type: "cruiser",
      scale: 1.1,
    });

    // ============================================
    // 4. GOLDEN SAND BEACH COASTLINE & PALM TREES
    // ============================================
    const shoreGfx = new Graphics();

    // Sandy Shoreline Floor
    shoreGfx.rect(0, floorY, rw, rh - floorY).fill(0xfde047);

    // Deep Sand Shading / Shore Wet Sand
    const sandStops = [
      { y: floorY, color: 0xd97706 },
      { y: floorY + 18, color: 0xf59e0b },
      { y: floorY + 45, color: 0xfbbf24 },
      { y: rh, color: 0xfde047 },
    ];

    for (let i = 0; i < sandStops.length - 1; i++) {
      const top = sandStops[i];
      const bot = sandStops[i + 1];
      const bandH = bot.y - top.y;
      const subSteps = 5;
      for (let s = 0; s < subSteps; s++) {
        const t = s / subSteps;
        const cy = top.y + t * bandH;
        const ch = bandH / subSteps + 1;
        const color = this.interpolateColor(top.color, bot.color, t);
        shoreGfx.rect(0, cy, rw, ch).fill(color);
      }
    }

    // Beach Boardwalk Wooden Planks
    for (let bx = 0; bx < rw; bx += 60) {
      shoreGfx
        .moveTo(bx, floorY + 30)
        .lineTo(bx - 30, rh)
        .stroke({ width: 1.5, color: 0xb45309, alpha: 0.4 });
    }

    // Sea Shells & Starfish on Beach
    const shells = [
      { x: rw * 0.18, y: floorY + 16, color: 0xf43f5e },
      { x: rw * 0.45, y: floorY + 22, color: 0xec4899 },
      { x: rw * 0.82, y: floorY + 18, color: 0xf97316 },
      { x: rw * 0.92, y: floorY + 28, color: 0xfb7185 },
    ];

    shells.forEach((sh) => {
      // Starfish
      for (let arm = 0; arm < 5; arm++) {
        const a = (arm * Math.PI * 2) / 5;
        shoreGfx
          .moveTo(sh.x, sh.y)
          .lineTo(sh.x + Math.cos(a) * 6, sh.y + Math.sin(a) * 6)
          .stroke({ width: 2.5, color: sh.color });
      }
      shoreGfx.circle(sh.x, sh.y, 2.5).fill(sh.color);
    });

    this.foregroundLayer.addChild(shoreGfx);

    // Dynamic Foam Wave Edge on Sand
    this.foamGraphics = new Graphics();
    this.foregroundLayer.addChild(this.foamGraphics);

    // ============================================
    // 5. TROPICAL PALM TREES (Left & Right Coast)
    // ============================================
    this.palmsContainer = new Container();

    // Left Palm Grove
    this.addPalmTree(45, floorY + 12, 1.2, -0.15, 0);
    this.addPalmTree(105, floorY - 6, 0.95, -0.08, 1.4);
    this.addPalmTree(160, floorY - 18, 0.8, -0.05, 2.8);

    // Right Palm Grove
    this.addPalmTree(rw - 45, floorY + 10, 1.25, 0.16, 1.0);
    this.addPalmTree(rw - 110, floorY - 8, 1.0, 0.09, 2.3);
    this.addPalmTree(rw - 165, floorY - 20, 0.82, 0.05, 0.5);

    this.backgroundLayer.addChild(this.palmsContainer);

    // ============================================
    // 6. CLASSIC MONOCHROME CAREER STATIONS
    // ============================================
    this.milestoneStations = [];
    const totalExp = this.experiences.length;

    const cols = totalExp <= 3 ? totalExp : rw > 1100 ? 3 : 2;

    const gridW = Math.min(rw * 0.92, 1080);
    const colGap = 28;
    const cellW = (gridW - (cols - 1) * colGap) / cols;
    const stationW = Math.min(340, cellW);
    const stationH = 225;
    const rowGap = 28;

    const startX = (rw - gridW) / 2 + stationW / 2;
    const startY = 88 + stationH / 2;

    // Golden Nautical Route Spine Connector
    this.gridBusGraphics = new Graphics();
    this.furnitureLayer.addChild(this.gridBusGraphics);

    this.experiences.forEach((exp, idx) => {
      const col = idx % cols;
      const row = Math.floor(idx / cols);

      const sx = startX + col * (stationW + colGap);
      const sy = startY + row * (stationH + rowGap);

      const stationCont = new Container();
      stationCont.position.set(sx, sy);
      stationCont.eventMode = "static";
      stationCont.cursor = "pointer";

      const stationSpring = new Spring(1.0, 260, 14);

      // Drop Shadow
      const sShadow = new Graphics()
        .roundRect(-stationW / 2 + 6, -stationH / 2 + 8, stationW, stationH, 16)
        .fill({ color: 0x000000, alpha: 0.65 });

      // Classic Frosted Obsidian Glass Body
      const sBg = new Graphics();
      this.drawStationShell(sBg, stationW, stationH, false);

      // Status Pill
      const statusPill = new Container();
      statusPill.position.set(-stationW / 2 + 16, -stationH / 2 + 16);

      const statusTxt = new Text({
        text: exp.status,
        style: {
          fontFamily: "system-ui, sans-serif",
          fontSize: 9.5,
          fontWeight: "800",
          fill: 0xe2e8f0,
          letterSpacing: 0.6,
        },
      });
      statusTxt.position.set(8, 4);

      const pillW = Math.min(statusTxt.width + 16, stationW - 32);
      const spBg = new Graphics()
        .roundRect(0, 0, pillW, 22, 6)
        .fill({ color: 0x1e293b, alpha: 0.8 })
        .stroke({ width: 1, color: 0x475569, alpha: 0.75 });

      statusPill.addChild(spBg, statusTxt);

      // Role Title
      const roleTxt = new Text({
        text: exp.role,
        style: {
          fontFamily: "system-ui, -apple-system, sans-serif",
          fontSize: 15,
          fontWeight: "900",
          fill: 0xffffff,
          letterSpacing: 0.3,
          wordWrap: true,
          wordWrapWidth: stationW - 32,
        },
      });
      roleTxt.position.set(-stationW / 2 + 16, -stationH / 2 + 46);

      // Company & Tech (Classic Snowcap / Silver)
      const compTxt = new Text({
        text: exp.company,
        style: {
          fontFamily: "system-ui, sans-serif",
          fontSize: 12.5,
          fontWeight: "700",
          fill: 0xe2e8f0,
        },
      });
      compTxt.position.set(-stationW / 2 + 16, -stationH / 2 + 70);

      // Period (Neutral Slate Starlight)
      const dateTxt = new Text({
        text: exp.period,
        style: {
          fontFamily: "system-ui, sans-serif",
          fontSize: 11.5,
          fontWeight: "600",
          fill: 0x94a3b8,
        },
      });
      dateTxt.position.set(-stationW / 2 + 16, -stationH / 2 + 90);

      // Bullet Preview
      const previewTxt = new Text({
        text: exp.bullets[0] ?? "",
        style: {
          fontFamily: "system-ui, sans-serif",
          fontSize: 11,
          fill: 0x94a3b8,
          lineHeight: 15.5,
          wordWrap: true,
          wordWrapWidth: stationW - 32,
        },
      });
      previewTxt.position.set(-stationW / 2 + 16, -stationH / 2 + 114);

      // Inspect Call to Action
      const ctaBg = new Graphics()
        .roundRect(-stationW / 2 + 16, stationH / 2 - 38, stationW - 32, 28, 6)
        .fill(0x161e2e)
        .stroke({ width: 1.5, color: 0x475569 });

      const ctaTxt = new Text({
        text: "EXPLORE DOSSIER ↗",
        style: {
          fontFamily: "system-ui, sans-serif",
          fontSize: 10,
          fontWeight: "900",
          fill: 0xffffff,
          letterSpacing: 0.6,
        },
      });
      ctaTxt.anchor.set(0.5);
      ctaTxt.position.set(0, stationH / 2 - 24);

      stationCont.addChild(
        sShadow,
        sBg,
        statusPill,
        roleTxt,
        compTxt,
        dateTxt,
        previewTxt,
        ctaBg,
        ctaTxt,
      );

      stationCont.on("pointerover", () => {
        stationSpring.target = 1.04;
        this.drawStationShell(sBg, stationW, stationH, true);
        ctaBg
          .clear()
          .roundRect(
            -stationW / 2 + 16,
            stationH / 2 - 38,
            stationW - 32,
            28,
            6,
          )
          .fill(0x263348)
          .stroke({ width: 1.5, color: 0xffffff });
      });

      stationCont.on("pointerout", () => {
        stationSpring.target = 1.0;
        this.drawStationShell(sBg, stationW, stationH, false);
        ctaBg
          .clear()
          .roundRect(
            -stationW / 2 + 16,
            stationH / 2 - 38,
            stationW - 32,
            28,
            6,
          )
          .fill(0x161e2e)
          .stroke({ width: 1.5, color: 0x475569 });
      });

      stationCont.on("pointerdown", () => {
        stationSpring.set(0.96);
      });

      stationCont.on("pointertap", () => {
        this.inspectMilestone(exp);
      });

      this.furnitureLayer.addChild(stationCont);
      this.milestoneStations.push({
        container: stationCont,
        spring: stationSpring,
        x: sx,
        y: sy,
        exp,
      });
    });

    this.pulseProgress = 0;
  }

  drawStationShell(g, stationW, stationH, isHovered) {
    g.clear();

    if (isHovered) {
      g.roundRect(-stationW / 2, -stationH / 2, stationW, stationH, 16)
        .fill({ color: 0x0f172a, alpha: 0.75 })
        .stroke({ width: 2.0, color: 0xffffff });

      // Top Glass Frosted Bevel Highlight
      g.roundRect(
        -stationW / 2 + 3,
        -stationH / 2 + 2,
        stationW - 6,
        2,
        1,
      ).fill({
        color: 0xffffff,
        alpha: 0.45,
      });
    } else {
      g.roundRect(-stationW / 2, -stationH / 2, stationW, stationH, 16)
        .fill({ color: 0x0a0f1d, alpha: 0.5 })
        .stroke({ width: 1.5, color: 0x475569, alpha: 0.85 });

      // Top Glass Frosted Bevel Highlight
      g.roundRect(
        -stationW / 2 + 3,
        -stationH / 2 + 2,
        stationW - 6,
        2,
        1,
      ).fill({
        color: 0xffffff,
        alpha: 0.22,
      });
    }
  }

  // ============================================
  // PROCEDURAL GRAPHICS HELPERS (BOATS, PALMS, ETC)
  // ============================================

  createSpeedboat() {
    const boat = new Container();
    const g = new Graphics();

    // Speedboat Hull
    g.moveTo(-28, 4)
      .lineTo(24, 4)
      .lineTo(34, -2)
      .lineTo(24, -8)
      .lineTo(-24, -8)
      .closePath()
      .fill(0xf8fafc)
      .stroke({ width: 1.5, color: 0x0f172a });

    // Sleek Cyan Speed Stripe
    g.rect(-24, -3, 50, 3).fill(0x0ea5e9);

    // Tinted Windshield / Cabin
    g.moveTo(-4, -8)
      .lineTo(12, -8)
      .lineTo(8, -16)
      .lineTo(-2, -16)
      .closePath()
      .fill(0x0284c7)
      .stroke({ width: 1, color: 0x0f172a });

    // Outboard Motor
    g.roundRect(-32, -6, 6, 12, 2).fill(0x1e293b);

    // Bow spray splash
    g.ellipse(32, 2, 8, 3).fill({ color: 0xffffff, alpha: 0.75 });

    boat.addChild(g);
    return boat;
  }

  createSailboat(accentColor = 0x38bdf8) {
    const boat = new Container();
    const g = new Graphics();

    // Wooden Hull
    g.moveTo(-24, 4)
      .lineTo(20, 4)
      .lineTo(28, -4)
      .lineTo(-20, -4)
      .closePath()
      .fill(0x78350f)
      .stroke({ width: 1.5, color: 0x451a03 });

    // Deck Trim
    g.rect(-18, -6, 40, 2).fill(0xfef3c7);

    // Mast
    g.rect(2, -42, 2.5, 38).fill(0x451a03);

    // Main Sail (Large Front Triangle)
    g.moveTo(4, -40)
      .lineTo(22, -10)
      .lineTo(4, -10)
      .closePath()
      .fill(0xffffff)
      .stroke({ width: 1, color: 0x94a3b8, alpha: 0.6 });

    // Colorful accent stripe on sail
    g.moveTo(4, -28)
      .lineTo(14, -10)
      .lineTo(4, -10)
      .closePath()
      .fill(accentColor);

    // Jib Sail (Back Triangle)
    g.moveTo(0, -36)
      .lineTo(-18, -10)
      .lineTo(0, -10)
      .closePath()
      .fill({ color: 0xf1f5f9, alpha: 0.95 });

    // Flag pennant
    g.moveTo(2, -42)
      .lineTo(-6, -39)
      .lineTo(2, -36)
      .closePath()
      .fill(accentColor);

    boat.addChild(g);
    return boat;
  }

  createCruiser() {
    const boat = new Container();
    const g = new Graphics();

    // Modern White Yacht Hull
    g.moveTo(-38, 6)
      .lineTo(34, 6)
      .lineTo(46, -4)
      .lineTo(32, -10)
      .lineTo(-34, -10)
      .closePath()
      .fill(0xffffff)
      .stroke({ width: 1.5, color: 0x0f172a });

    // Dark Blue Waterline
    g.rect(-34, 1, 72, 3).fill(0x0369a1);

    // Upper Deck Cabin
    g.roundRect(-22, -22, 42, 12, 3)
      .fill(0xf1f5f9)
      .stroke({ width: 1, color: 0x0f172a });

    // Tinted Cabin Windows
    for (let w = -16; w <= 12; w += 8) {
      g.rect(w, -19, 5, 6).fill(0x0284c7);
    }

    // Flybridge & Radar Mast
    g.roundRect(-10, -28, 20, 6, 2).fill(0xffffff);
    g.rect(2, -35, 2, 7).fill(0x64748b);
    g.ellipse(3, -35, 4, 1.5).fill(0x0ea5e9);

    boat.addChild(g);
    return boat;
  }

  createBeachCloud(width) {
    const cloud = new Container();
    const g = new Graphics();

    g.ellipse(0, 4, width / 2, 16).fill({ color: 0xe0f2fe, alpha: 0.5 });
    g.circle(-width * 0.25, -2, 18).fill({ color: 0xffffff, alpha: 0.95 });
    g.circle(0, -10, 24).fill(0xffffff);
    g.circle(width * 0.25, -4, 20).fill({ color: 0xffffff, alpha: 0.95 });

    cloud.addChild(g);
    return cloud;
  }

  createSeagull() {
    const gull = new Container();
    const g = new Graphics();

    // Simple V-wing seagull silhouette
    g.moveTo(-10, -3)
      .quadraticCurveTo(-4, -8, 0, 0)
      .quadraticCurveTo(4, -8, 10, -3)
      .stroke({ width: 1.8, color: 0xffffff });

    gull.addChild(g);
    return gull;
  }

  addPalmTree(x, y, scale = 1, curve = 0.1, phase = 0) {
    const palm = new Container();
    palm.position.set(x, y);

    const g = new Graphics();
    const trunkH = 110 * scale;

    // Curved Trunk
    const topX = trunkH * curve;
    const topY = -trunkH;

    g.moveTo(-7 * scale, 0)
      .quadraticCurveTo(
        topX * 0.5 - 5 * scale,
        topY * 0.5,
        topX - 4 * scale,
        topY,
      )
      .lineTo(topX + 4 * scale, topY)
      .quadraticCurveTo(topX * 0.5 + 5 * scale, topY * 0.5, 7 * scale, 0)
      .closePath()
      .fill(0x78350f)
      .stroke({ width: 1.5, color: 0x451a03 });

    // Trunk Bark Rings
    for (let r = 1; r < 6; r++) {
      const rt = r / 6;
      const rx = topX * rt;
      const ry = topY * (1 - rt);
      g.ellipse(rx, ry, 6 * scale, 2.5 * scale).fill(0x92400e);
    }

    // Coconuts Cluster
    g.circle(topX - 4 * scale, topY + 4 * scale, 4 * scale).fill(0x451a03);
    g.circle(topX + 4 * scale, topY + 3 * scale, 4.5 * scale).fill(0x78350f);
    g.circle(topX, topY + 6 * scale, 4 * scale).fill(0x92400e);

    // Sprawling Palm Fronds (Leaves)
    const frondAngles = [-2.4, -1.8, -1.2, -0.6, 0, 0.6, 1.2];
    frondAngles.forEach((angle) => {
      const len = (45 + Math.random() * 15) * scale;
      const fx = topX + Math.cos(angle - Math.PI / 2) * len;
      const fy = topY + Math.sin(angle - Math.PI / 2) * len + 12 * scale;

      g.moveTo(topX, topY)
        .quadraticCurveTo(
          topX + Math.cos(angle - Math.PI / 2) * len * 0.6,
          topY + Math.sin(angle - Math.PI / 2) * len * 0.4 - 10 * scale,
          fx,
          fy,
        )
        .stroke({ width: 3.5 * scale, color: 0x15803d });

      // Secondary highlight frond
      g.moveTo(topX, topY)
        .quadraticCurveTo(
          topX + Math.cos(angle - Math.PI / 2) * len * 0.6,
          topY + Math.sin(angle - Math.PI / 2) * len * 0.4 - 12 * scale,
          fx - 2 * scale,
          fy,
        )
        .stroke({ width: 1.5 * scale, color: 0x4ade80, alpha: 0.8 });
    });

    palm.addChild(g);
    this.palmsContainer.addChild(palm);

    this.palms.push({
      container: palm,
      swaySpeed: 1.4 + Math.random() * 0.4,
      phase,
      maxAngle: 0.03 * scale,
    });
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

  inspectMilestone(exp) {
    const c = new Container();

    const title = new Text({
      text: exp.role,
      style: {
        fontFamily: "system-ui, -apple-system, sans-serif",
        fontSize: 17,
        fontWeight: "900",
        fill: 0xffffff,
      },
    });
    title.position.set(0, 0);

    const comp = new Text({
      text: `${exp.company}  ·  ${exp.period}`,
      style: {
        fontFamily: "system-ui, sans-serif",
        fontSize: 12,
        fontWeight: "800",
        fill: 0x94a3b8,
        letterSpacing: 0.5,
      },
    });
    comp.position.set(0, 24);

    let by = 54;
    exp.bullets.forEach((b) => {
      const bCont = new Container();
      bCont.position.set(0, by);

      const dot = new Graphics().circle(6, 8, 3).fill(0x94a3b8);

      const bTxt = new Text({
        text: b,
        style: {
          fontFamily: "system-ui, sans-serif",
          fontSize: 13,
          fill: 0xd0d7de,
          lineHeight: 19,
          wordWrap: true,
          wordWrapWidth: 490,
        },
      });
      bTxt.position.set(18, 0);

      bCont.addChild(dot, bTxt);
      c.addChild(bCont);
      by += bTxt.height + 10;
    });

    const stackTxt = new Text({
      text: "TECH STACK: " + exp.stack.join("  •  "),
      style: {
        fontFamily: "system-ui, sans-serif",
        fontSize: 11.5,
        fontWeight: "900",
        fill: 0xffffff,
      },
    });
    stackTxt.position.set(0, by + 8);
    c.addChild(stackTxt);

    this.showInspector({
      title: `${exp.company} Career Dossier`,
      icon: "",
      color: 0xffffff,
      width: 550,
      x: (this.roomWidth - 550) / 2,
      y: 80,
      content: c,
    });
  }

  update(delta) {
    if (this.destroyed) return;
    super.update(delta);
    if (this.destroyed || this.isClosing) return;

    const dt = (delta || 1) * 0.016;
    this.time += dt;

    // Update Ocean Caustics Shader
    if (this.shaderFilter?.resources?.filterUniforms?.uniforms) {
      this.shaderFilter.resources.filterUniforms.uniforms.uTime = this.time;
    }

    const rw = this.roomWidth;
    const rh = this.roomHeight;
    const floorY = rh * 0.8;
    const horizonY = floorY * 0.48;

    // 1. Animate Driving & Sailing Boats
    if (this.boats && this.boats.length) {
      this.boats.forEach((b) => {
        if (b.container && !b.container.destroyed) {
          b.container.x += b.vx * dt;
          b.container.y =
            b.baseY + Math.sin(this.time * b.bobSpeed) * b.bobAmount;

          if (b.type === "sailboat") {
            b.container.rotation =
              Math.sin(this.time * b.bobSpeed * 0.8) * 0.04;
          } else if (b.type === "speedboat") {
            b.container.rotation =
              Math.sin(this.time * b.bobSpeed * 1.5) * 0.02 - 0.03;
          }

          // Spawn Wake Particles behind boats
          if (Math.random() < 0.35) {
            const p = new Graphics();
            const pSize = (2 + Math.random() * 3) * b.scale;
            p.circle(0, 0, pSize).fill({ color: 0xffffff, alpha: 0.85 });
            p.x = b.container.x - (b.type === "speedboat" ? 30 : 22) * b.scale;
            p.y = b.container.y + 2;
            p.vx = -b.vx * 0.2 + (Math.random() - 0.5) * 4;
            p.vy = (Math.random() - 0.5) * 2;
            p.alpha = 0.85;
            p.scaleStep = 1.0;
            this.wakeContainer.addChild(p);
            this.wakeParticles.push(p);
          }

          if (b.container.x > rw + 150) {
            b.container.x = -150;
          }
        }
      });
    }

    // 2. Update Wake Particles
    if (this.wakeParticles && this.wakeParticles.length) {
      for (let i = this.wakeParticles.length - 1; i >= 0; i--) {
        const p = this.wakeParticles[i];
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.alpha -= 0.8 * dt;
        p.scale.x += 0.8 * dt;
        p.scale.y += 0.4 * dt;

        if (p.alpha <= 0.05) {
          this.wakeContainer.removeChild(p);
          this.wakeParticles.splice(i, 1);
        }
      }
    }

    // 3. Animate Rolling Ocean Waves
    if (this.wavesGraphics && !this.wavesGraphics.destroyed) {
      this.wavesGraphics.clear();
      for (let wy = horizonY + 10; wy < floorY; wy += 22) {
        const waveProgress = (wy - horizonY) / (floorY - horizonY);
        const waveSpeed = 2.0 + waveProgress * 1.5;
        const waveAmp = 2 + waveProgress * 3.5;

        this.wavesGraphics.moveTo(0, wy);
        for (let wx = 0; wx < rw; wx += 25) {
          const cy =
            wy + Math.sin(this.time * waveSpeed + wx * 0.02) * waveAmp;
          this.wavesGraphics.lineTo(wx, cy);
        }
        this.wavesGraphics.stroke({
          width: 1.5 + waveProgress * 1.5,
          color: 0xffffff,
          alpha: 0.2 + waveProgress * 0.35,
        });
      }
    }

    // 4. Animate Coastal Seafoam on Sand
    if (this.foamGraphics && !this.foamGraphics.destroyed) {
      this.foamGraphics.clear();
      const foamOffset = Math.sin(this.time * 1.6) * 8;
      const foamY = floorY + 4 + foamOffset;

      this.foamGraphics
        .moveTo(0, foamY)
        .bezierCurveTo(rw * 0.3, foamY - 6, rw * 0.7, foamY + 6, rw, foamY)
        .stroke({ width: 4, color: 0xffffff, alpha: 0.75 });
    }

    // 5. Animate Trade Wind Clouds
    if (this.clouds && this.clouds.length) {
      this.clouds.forEach((c) => {
        if (c.container && !c.container.destroyed) {
          c.container.x += c.vx * dt;
          if (c.container.x > rw + 150) {
            c.container.x = -150;
          }
        }
      });
    }

    // 6. Animate Soaring Seagulls
    if (this.seagulls && this.seagulls.length) {
      this.seagulls.forEach((g) => {
        if (g.container && !g.container.destroyed) {
          g.container.x += g.vx * dt;
          g.container.y =
            g.baseY + Math.sin(this.time * 2.0 + g.seed) * 8;
          g.container.scale.y =
            0.7 + Math.sin(this.time * g.flapSpeed + g.seed) * 0.3;

          if (g.container.x > rw + 50) {
            g.container.x = -50;
            g.container.y = 30 + Math.random() * (horizonY - 50);
            g.baseY = g.container.y;
          }
        }
      });
    }

    // 7. Swaying Palm Trees
    if (this.palms && this.palms.length) {
      this.palms.forEach((p) => {
        if (p.container && !p.container.destroyed) {
          p.container.rotation =
            Math.sin(this.time * p.swaySpeed + p.phase) * p.maxAngle;
        }
      });
    }

    // 8. Career Station Spring Physics
    if (this.milestoneStations && Array.isArray(this.milestoneStations)) {
      this.milestoneStations.forEach((st) => {
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

    // 9. Nautical Path Connector & Pulse
    if (
      this.gridBusGraphics &&
      !this.gridBusGraphics.destroyed &&
      this.gridBusGraphics.context &&
      this.milestoneStations.length > 1
    ) {
      this.gridBusGraphics.clear();

      for (let i = 0; i < this.milestoneStations.length - 1; i++) {
        const a = this.milestoneStations[i];
        const b = this.milestoneStations[i + 1];

        this.gridBusGraphics
          .moveTo(a.x, a.y)
          .lineTo(b.x, b.y)
          .stroke({ width: 1.5, color: 0x475569, alpha: 0.6 });
      }

      this.pulseProgress += 0.008 * delta;
      if (this.pulseProgress >= this.milestoneStations.length - 1) {
        this.pulseProgress = 0;
      }

      const segIdx = Math.floor(this.pulseProgress);
      const segT = this.pulseProgress - segIdx;
      const p1 = this.milestoneStations[segIdx];
      const p2 = this.milestoneStations[segIdx + 1];

      if (p1 && p2) {
        const px = p1.x + (p2.x - p1.x) * segT;
        const py = p1.y + (p2.y - p1.y) * segT;

        this.gridBusGraphics.circle(px, py, 4.5).fill(0x38bdf8);
      }
    }
  }
}
