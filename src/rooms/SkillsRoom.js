import { Container, Graphics, Text } from "pixi.js";
import { Room } from "./Room";
import { Spring } from "../utils/Juice";
import { PORTFOLIO } from "../data/portfolio";
import { createSkillsShader } from "../utils/RoomShaders";

export class SkillsRoom extends Room {
  constructor(app) {
    super(app, {
      accentColor: PORTFOLIO.skills.accentColor ?? 0xfacc15,
      title: "Alpine Highway of Mastery · Categorized Skill Stones",
      type: "Mountain Pass",
      icon: "",
    });
  }

  buildRoom() {
    const rw = this.roomWidth;
    const rh = this.roomHeight;
    const floorY = rh * 0.84;

    this.skillGroups = PORTFOLIO.skills.groups || [];
    this.time = 0;

    // Animation tracking arrays
    this.skillStones = [];
    this.clouds = [];
    this.trees = [];
    this.particles = [];
    this.lanternGlows = [];

    // Attach Alpine Mountain Shader
    this.shaderFilter = createSkillsShader();
    if (this.shaderFilter) {
      this.backgroundLayer.filters = [this.shaderFilter];
    }

    // ============================================
    // 1. SKY GRADIENT, SUN & MOUNTAIN PEAKS
    // ============================================
    const skyGfx = new Graphics();
    const horizonY = floorY * 0.42;

    const skyStops = [
      { y: 0, color: 0x0a1426 },
      { y: horizonY * 0.35, color: 0x12243d },
      { y: horizonY * 0.65, color: 0x1e3a5f },
      { y: horizonY * 0.88, color: 0x3b5f7e },
      { y: horizonY, color: 0xfde047 },
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

    // Glowing Alpine Morning Sun
    const sunContainer = new Container();
    const sunX = rw * 0.84;
    const sunY = horizonY * 0.32;
    sunContainer.position.set(sunX, sunY);

    const sunHalo = new Graphics();
    sunHalo.circle(0, 0, 80).fill({ color: 0xfef08a, alpha: 0.12 });
    sunHalo.circle(0, 0, 52).fill({ color: 0xfef08a, alpha: 0.24 });
    sunHalo.circle(0, 0, 32).fill({ color: 0xffedd5, alpha: 0.42 });
    sunHalo.circle(0, 0, 20).fill(0xffffff);

    sunContainer.addChild(sunHalo);
    this.backgroundLayer.addChild(sunContainer);

    // Drifting Cumulus Clouds
    this.cloudsContainer = new Container();
    for (let i = 0; i < 4; i++) {
      const cloud = this.createMountainCloud(130 + Math.random() * 90);
      cloud.x = (rw / 4) * i + Math.random() * 60;
      cloud.y = 20 + i * 24;
      cloud.scale.set(0.85 + Math.random() * 0.35);
      cloud.alpha = 0.85;
      this.cloudsContainer.addChild(cloud);
      this.clouds.push({
        container: cloud,
        vx: 7 + i * 3,
      });
    }
    this.backgroundLayer.addChild(this.cloudsContainer);

    // ============================================
    // 2. MOUNTAIN RIDGES & BACKGROUND SLOPES
    // ============================================
    const mountainGfx = new Graphics();
    this.drawMountainPassSlopes(mountainGfx, rw, floorY, horizonY);
    this.backgroundLayer.addChild(mountainGfx);

    // ============================================
    // 3. WINDING MOUNTAIN ROAD / HIGHWAY
    // ============================================
    const roadGfx = new Graphics();
    this.drawWindingMountainRoad(roadGfx, rw, floorY);
    this.backgroundLayer.addChild(roadGfx);

    // Road Pulse Light / Headlight
    this.roadBeaconGfx = new Graphics();
    this.backgroundLayer.addChild(this.roadBeaconGfx);
    this.roadProgress = 0;

    // Pine Trees on Mountain Slopes
    this.treesContainer = new Container();
    this.addPine(rw * 0.06, horizonY + 30, 0.75, 0);
    this.addPine(rw * 0.12, horizonY + 55, 0.95, 1.2);
    this.addPine(rw * 0.88, horizonY + 25, 0.8, 2.0);
    this.addPine(rw * 0.94, horizonY + 60, 1.05, 0.6);
    this.addPine(rw * 0.03, floorY - 20, 1.3, 1.8);
    this.addPine(rw * 0.97, floorY - 15, 1.35, 2.5);
    this.backgroundLayer.addChild(this.treesContainer);

    // ============================================
    // 4. FOREGROUND MOUNTAIN OVERLOOK TERRACE
    // ============================================
    const floor = new Graphics();
    floor.rect(0, floorY, rw, rh - floorY).fill(0x131a26);

    // Stone / Asphalt Highway Texture
    for (let fx = 0; fx < rw; fx += 55) {
      floor
        .moveTo(fx, floorY)
        .lineTo(fx - 25, rh)
        .stroke({ width: 1.5, color: 0x1f2b3e, alpha: 0.6 });
    }

    // Mountain Road Curb & Guard Posts
    floor.rect(0, floorY - 6, rw, 6).fill(0x27354a);

    for (let gx = 25; gx < rw; gx += 70) {
      floor.roundRect(gx - 4, floorY - 24, 8, 24, 2).fill(0x384a63);
      floor.rect(gx - 6, floorY - 26, 12, 4).fill(0xfacc15);
    }
    floor.rect(0, floorY - 18, rw, 4).fill(0x475569);

    // Roadside Lanterns
    const lanternXs = [rw * 0.2, rw * 0.5, rw * 0.8];
    lanternXs.forEach((lx) => {
      floor.roundRect(lx - 6, floorY - 38, 12, 16, 2).fill(0x0f172a);
      floor.rect(lx - 4, floorY - 35, 8, 10).fill(0xfef08a);

      const glow = new Graphics();
      glow.circle(lx, floorY - 30, 20).fill({ color: 0xfef08a, alpha: 0.16 });
      this.foregroundLayer.addChild(glow);
      this.lanternGlows.push(glow);
    });

    this.foregroundLayer.addChild(floor);

    // ============================================
    // 5. CATEGORIZED SKILL STONE TERRACES & STATIONS
    // ============================================
    const startX = 64;
    const contentW = rw - 128;
    let currentY = 72;

    this.skillGroups.forEach((grp) => {
      if (!grp.nodes || grp.nodes.length === 0) return;

      const groupContainer = new Container();
      groupContainer.position.set(startX, currentY);

      // Category Header Milestone Signpost
      const catColor = grp.color ?? 0xfacc15;
      const catHeader = new Container();

      // Category Milestone Plate
      const catTxt = new Text({
        text: `${grp.category.toUpperCase()}:`,
        style: {
          fontFamily: "system-ui, -apple-system, sans-serif",
          fontSize: 13,
          fontWeight: "900",
          fill: 0xffffff,
          letterSpacing: 1.2,
        },
      });
      catTxt.position.set(22, 5);

      const catBadge = new Graphics();
      // Classic Silver Pip
      catBadge
        .moveTo(6, 12)
        .lineTo(12, 6)
        .lineTo(18, 12)
        .lineTo(12, 18)
        .closePath()
        .fill(0xffffff);

      const headerW = catTxt.width + 36;
      const headerBg = new Graphics()
        .roundRect(0, 0, headerW, 26, 6)
        .fill({ color: 0x0f172a, alpha: 0.85 })
        .stroke({ width: 1.5, color: 0x475569, alpha: 0.85 });

      catHeader.addChild(headerBg, catBadge, catTxt);
      groupContainer.addChild(catHeader);

      // Skill Stones for this Category
      const stonesContainer = new Container();
      stonesContainer.position.set(0, 34);

      let stoneX = 0;
      let stoneY = 0;
      const stoneH = 42;
      const stoneGapX = 12;
      const stoneGapY = 10;

      grp.nodes.forEach((node) => {
        // Measure stone width based on skill name
        const tempName = new Text({
          text: node.name,
          style: {
            fontFamily: "system-ui, -apple-system, sans-serif",
            fontSize: 12.5,
            fontWeight: "800",
          },
        });
        const stoneW = Math.max(120, tempName.width + 42);

        // Wrap to next line if stone overflows
        if (stoneX + stoneW > contentW && stoneX > 0) {
          stoneX = 0;
          stoneY += stoneH + stoneGapY;
        }

        const stoneCont = new Container();
        stoneCont.position.set(stoneX + stoneW / 2, stoneY + stoneH / 2);
        stoneCont.eventMode = "static";
        stoneCont.cursor = "pointer";

        const stoneSpring = new Spring(1.0, 260, 14);

        // Stone Drop Shadow
        const sShadow = new Graphics()
          .roundRect(-stoneW / 2 + 3, -stoneH / 2 + 4, stoneW, stoneH, 8)
          .fill({ color: 0x000000, alpha: 0.6 });

        // Sculpted 0.5 Alpha Mountain Stone Body
        const sBg = new Graphics();
        this.drawCategorizedStone(sBg, stoneW, stoneH, 0x94a3b8, false);

        // Engraved Skill Title
        const nameTxt = new Text({
          text: node.name,
          style: {
            fontFamily: "system-ui, -apple-system, sans-serif",
            fontSize: 12,
            fontWeight: "800",
            fill: 0xffffff,
            letterSpacing: 0.3,
          },
        });
        nameTxt.position.set(-stoneW / 2 + 20, -7);

        // Info hint icon
        const infoPip = new Graphics();
        infoPip.circle(stoneW / 2 - 12, 0, 2.5).fill({ color: 0x94a3b8, alpha: 0.8 });

        stoneCont.addChild(sShadow, sBg, nameTxt, infoPip);

        stoneCont.on("pointerover", () => {
          stoneSpring.target = 1.08;
          this.drawCategorizedStone(sBg, stoneW, stoneH, 0x94a3b8, true);
        });

        stoneCont.on("pointerout", () => {
          stoneSpring.target = 1.0;
          this.drawCategorizedStone(sBg, stoneW, stoneH, 0x94a3b8, false);
        });

        stoneCont.on("pointerdown", () => {
          stoneSpring.set(0.94);
        });

        stoneCont.on("pointertap", () => {
          this.inspectSkill(node, grp.category);
        });

        stonesContainer.addChild(stoneCont);
        this.skillStones.push({
          container: stoneCont,
          spring: stoneSpring,
          node,
          category: grp.category,
        });

        stoneX += stoneW + stoneGapX;
      });

      groupContainer.addChild(stonesContainer);
      this.furnitureLayer.addChild(groupContainer);

      currentY += 40 + stoneY + stoneH + 18;
    });

    // Ambient Mountain Breeze Particles
    this.particlesContainer = new Container();
    for (let i = 0; i < 28; i++) {
      const p = new Graphics();
      const pSize = 1.2 + Math.random() * 2.0;
      p.circle(0, 0, pSize).fill({ color: 0xfef08a, alpha: 0.75 });
      p.x = Math.random() * rw;
      p.y = Math.random() * rh;
      this.particlesContainer.addChild(p);
      this.particles.push({
        gfx: p,
        x: p.x,
        y: p.y,
        vx: (Math.random() - 0.5) * 12 + 6,
        vy: 10 + Math.random() * 16,
        seed: Math.random() * 10,
        baseAlpha: 0.35 + Math.random() * 0.5,
      });
    }
    this.backgroundLayer.addChild(this.particlesContainer);
  }

  drawCategorizedStone(g, stoneW, stoneH, catColor, isHovered) {
    g.clear();

    if (isHovered) {
      // Hovered: Illuminated Mountain Rune Stone with brilliant white rim
      g.roundRect(-stoneW / 2, -stoneH / 2, stoneW, stoneH, 8)
        .fill({ color: 0x131d2e, alpha: 0.75 })
        .stroke({ width: 2.0, color: 0xffffff });

      // Top Mineral Highlight Bevel
      g.roundRect(-stoneW / 2 + 2, -stoneH / 2 + 2, stoneW - 4, 2, 1).fill({
        color: 0xffffff,
        alpha: 0.5,
      });

      // Rock Gem Inlay
      g.moveTo(-stoneW / 2 + 7, 0)
        .lineTo(-stoneW / 2 + 12, -4)
        .lineTo(-stoneW / 2 + 15, 0)
        .lineTo(-stoneW / 2 + 12, 4)
        .closePath()
        .fill(0xffffff);
    } else {
      // Default: Chiseled Alpine Slate Stone with 0.5 alpha
      g.roundRect(-stoneW / 2, -stoneH / 2, stoneW, stoneH, 8)
        .fill({ color: 0x0a101d, alpha: 0.5 })
        .stroke({ width: 1.5, color: 0x334155, alpha: 0.85 });

      // Top Mineral Highlight Bevel
      g.roundRect(-stoneW / 2 + 2, -stoneH / 2 + 2, stoneW - 4, 2, 1).fill({
        color: 0xffffff,
        alpha: 0.22,
      });

      // Rock Gem Inlay
      g.moveTo(-stoneW / 2 + 7, 0)
        .lineTo(-stoneW / 2 + 12, -4)
        .lineTo(-stoneW / 2 + 15, 0)
        .lineTo(-stoneW / 2 + 12, 4)
        .closePath()
        .fill(catColor);
    }
  }

  drawMountainPassSlopes(g, rw, floorY, horizonY) {
    // Distant jagged snowy peaks
    g.moveTo(0, horizonY);
    const peaks = [
      { x: 0, y: horizonY - 40 },
      { x: rw * 0.15, y: horizonY - 140 },
      { x: rw * 0.32, y: horizonY - 80 },
      { x: rw * 0.5, y: horizonY - 180 },
      { x: rw * 0.68, y: horizonY - 100 },
      { x: rw * 0.85, y: horizonY - 160 },
      { x: rw, y: horizonY - 60 },
    ];
    peaks.forEach((p) => g.lineTo(p.x, p.y));
    g.lineTo(rw, floorY);
    g.lineTo(0, floorY);
    g.closePath();
    g.fill(0x192236);

    // Snowcaps
    const snowCaps = [
      { x: rw * 0.15, y: horizonY - 140, w: 45, h: 48 },
      { x: rw * 0.5, y: horizonY - 180, w: 60, h: 65 },
      { x: rw * 0.85, y: horizonY - 160, w: 50, h: 54 },
    ];
    snowCaps.forEach((sc) => {
      g.moveTo(sc.x, sc.y)
        .lineTo(sc.x - sc.w / 2, sc.y + sc.h)
        .lineTo(sc.x, sc.y + sc.h * 0.7)
        .lineTo(sc.x + sc.w / 2, sc.y + sc.h)
        .closePath()
        .fill({ color: 0x93c5fd, alpha: 0.65 });
    });

    // Midground Rocky Ridge Slopes
    g.moveTo(0, horizonY + 30)
      .lineTo(rw * 0.35, horizonY - 20)
      .lineTo(rw * 0.7, horizonY + 50)
      .lineTo(rw, horizonY + 10)
      .lineTo(rw, floorY)
      .lineTo(0, floorY)
      .closePath()
      .fill(0x131a28);
  }

  drawWindingMountainRoad(g, rw, floorY) {
    // Winding Serpentine Alpine Road ribbon across the mountain slopes
    const rY1 = floorY * 0.52;
    const rY2 = floorY * 0.72;
    const rY3 = floorY;

    // Road 1 (Upper Switchback)
    g.moveTo(0, rY1)
      .quadraticCurveTo(rw * 0.4, rY1 - 25, rw * 0.85, rY1 + 15)
      .stroke({ width: 22, color: 0x1e293b });

    // Road 2 (Middle Switchback)
    g.moveTo(rw, rY2)
      .quadraticCurveTo(rw * 0.6, rY2 + 25, rw * 0.15, rY2 - 15)
      .stroke({ width: 26, color: 0x1e293b });

    // Road 3 (Main Foreground Road Base)
    g.moveTo(0, rY3 - 10)
      .quadraticCurveTo(rw * 0.5, rY3 - 35, rw, rY3 - 10)
      .stroke({ width: 32, color: 0x1e293b });

    // Yellow Dashed Centerline on road
    g.moveTo(0, rY3 - 10)
      .quadraticCurveTo(rw * 0.5, rY3 - 35, rw, rY3 - 10)
      .stroke({ width: 2, color: 0xfacc15, alpha: 0.8 });
  }

  createMountainCloud(width) {
    const cloud = new Container();
    const g = new Graphics();

    g.ellipse(0, 4, width / 2, 16).fill({ color: 0x93a3c2, alpha: 0.5 });
    g.circle(-width * 0.25, -2, 18).fill({ color: 0xf8fafc, alpha: 0.95 });
    g.circle(0, -10, 24).fill(0xffffff);
    g.circle(width * 0.25, -4, 20).fill({ color: 0xf8fafc, alpha: 0.95 });

    cloud.addChild(g);
    return cloud;
  }

  addPine(x, y, scale = 1, phase = 0) {
    const pine = new Container();
    pine.position.set(x, y);

    const g = new Graphics();
    const trunkW = 8 * scale;
    const trunkH = 24 * scale;

    // Trunk
    g.roundRect(-trunkW / 2, -trunkH, trunkW, trunkH, 2).fill(0x3e2718);

    // Needles
    const tierH = 22 * scale;
    const maxW = 46 * scale;

    for (let t = 0; t < 3; t++) {
      const curY = -trunkH * 0.8 - t * (tierH * 0.65);
      const w = maxW * (1 - t * 0.25);
      const h = tierH * (1 - t * 0.15);

      g.moveTo(0, curY - h)
        .lineTo(-w / 2, curY)
        .lineTo(0, curY - h * 0.2)
        .closePath()
        .fill(0x2d6a4f);

      g.moveTo(0, curY - h)
        .lineTo(0, curY - h * 0.2)
        .lineTo(w / 2, curY)
        .closePath()
        .fill(0x1b4332);
    }

    pine.addChild(g);
    this.treesContainer.addChild(pine);

    this.trees.push({
      container: pine,
      swaySpeed: 1.5 + Math.random() * 0.5,
      phase,
      maxAngle: 0.025 * scale,
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

  inspectSkill(node, category) {
    const c = new Container();

    const title = new Text({
      text: node.name,
      style: {
        fontFamily: "system-ui, -apple-system, sans-serif",
        fontSize: 18,
        fontWeight: "900",
        fill: 0xffffff,
        letterSpacing: 0.5,
      },
    });
    title.position.set(0, 0);

    const cat = new Text({
      text: `CATEGORY: ${category.toUpperCase()}`,
      style: {
        fontFamily: "system-ui, sans-serif",
        fontSize: 11,
        fontWeight: "900",
        fill: 0x94a3b8,
        letterSpacing: 0.8,
      },
    });
    cat.position.set(0, 26);

    const desc = new Text({
      text: node.desc || "Technical mastery and practical implementation.",
      style: {
        fontFamily: "system-ui, sans-serif",
        fontSize: 13,
        fill: 0xd1d5db,
        lineHeight: 20,
        wordWrap: true,
        wordWrapWidth: 480,
      },
    });
    desc.position.set(0, 56);

    c.addChild(title, cat, desc);

    this.showInspector({
      title: `${node.name} · Skill Stone`,
      icon: "",
      color: 0xffffff,
      width: 520,
      x: (this.roomWidth - 520) / 2,
      y: 100,
      content: c,
    });
  }

  update(delta) {
    if (this.destroyed) return;
    super.update(delta);
    if (this.destroyed || this.isClosing) return;

    const dt = (delta || 1) * 0.016;
    this.time += dt;

    // Update Room Atmospheric Shader
    if (this.shaderFilter?.resources?.filterUniforms?.uniforms) {
      this.shaderFilter.resources.filterUniforms.uniforms.uTime = this.time;
    }

    const rw = this.roomWidth;
    const rh = this.roomHeight;
    const floorY = rh * 0.84;

    // 1. Drifting Clouds
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

    // 2. Road Traveling Beacon Light
    if (this.roadBeaconGfx && !this.roadBeaconGfx.destroyed) {
      this.roadBeaconGfx.clear();
      this.roadProgress += 0.25 * dt;
      if (this.roadProgress > 1.0) this.roadProgress = 0;

      const t = this.roadProgress;
      const bx = t * rw;
      const by = floorY - 10 - Math.sin(t * Math.PI) * 25;

      this.roadBeaconGfx.circle(bx, by, 6).fill(0xfef08a);
      this.roadBeaconGfx
        .circle(bx, by, 16)
        .fill({ color: 0xfef08a, alpha: 0.2 });
    }

    // 3. Swaying Trees
    if (this.trees && this.trees.length) {
      this.trees.forEach((t) => {
        if (t.container && !t.container.destroyed) {
          t.container.rotation =
            Math.sin(this.time * t.swaySpeed + t.phase) * t.maxAngle;
        }
      });
    }

    // 4. Floating Breeze Particles
    if (this.particles && this.particles.length) {
      this.particles.forEach((p) => {
        if (p.gfx && !p.gfx.destroyed) {
          p.y -= p.vy * dt;
          p.x += Math.sin(this.time * 2.0 + p.seed) * p.vx * dt;
          p.gfx.position.set(p.x, p.y);

          if (p.y < -20) {
            p.y = rh + 10;
            p.x = Math.random() * rw;
          }
          if (p.x > rw + 20) p.x = -20;
          if (p.x < -20) p.x = rw + 20;

          p.gfx.alpha =
            p.baseAlpha * (0.5 + Math.sin(this.time * 3.0 + p.seed) * 0.5);
        }
      });
    }

    // 5. Lantern Light Pulsing
    if (this.lanternGlows && this.lanternGlows.length) {
      this.lanternGlows.forEach((glow, idx) => {
        if (glow && !glow.destroyed) {
          const pulse = Math.sin(this.time * 2.5 + idx * 1.5) * 0.08;
          glow.scale.set(1.0 + pulse);
        }
      });
    }

    // 6. Skill Stone Spring Physics
    if (this.skillStones && Array.isArray(this.skillStones)) {
      this.skillStones.forEach((st) => {
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
