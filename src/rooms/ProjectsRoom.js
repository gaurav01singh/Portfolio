import { Container, Graphics, Text, Sprite, Assets } from "pixi.js";
import { Room } from "./Room";
import { Spring } from "../utils/Juice";
import { PORTFOLIO } from "../data/portfolio";
import { createProjectsShader } from "../utils/RoomShaders";
import { projectModal } from "../ui/ProjectModal";

export class ProjectsRoom extends Room {
  constructor(app) {
    super(app, {
      accentColor: PORTFOLIO.projects.accentColor ?? 0x38bdf8,
      title: "Alpine Summit · Projects & Game Lab",
      type: "Showcase",
      icon: "",
    });
  }

  buildRoom() {
    const rw = this.roomWidth;
    const rh = this.roomHeight;
    const floorY = rh * 0.82;

    this.projects = PORTFOLIO.projects.list || [];
    this.time = 0;

    // Animation tracking arrays
    this.clouds = [];
    this.mistPuffs = [];
    this.swayingTrees = [];
    this.stars = [];
    this.particles = [];
    this.lanternGlows = [];

    // Attach Alpine Twilight Mountain Shader
    this.shaderFilter = createProjectsShader();
    if (this.shaderFilter) {
      this.backgroundLayer.filters = [this.shaderFilter];
    }

    // ============================================
    // 1. SKY GRADIENT, CELESTIAL MOON & STARS
    // ============================================
    const skyGfx = new Graphics();

    // Multi-stop Twilight Alpine Sky Gradient Bands
    const skyStops = [
      { y: 0, color: 0x080e1a },
      { y: floorY * 0.18, color: 0x121b33 },
      { y: floorY * 0.38, color: 0x1e274a },
      { y: floorY * 0.58, color: 0x353158 },
      { y: floorY * 0.74, color: 0x663f60 },
      { y: floorY * 0.88, color: 0xa85663 },
      { y: floorY, color: 0xf59868 },
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

    // Glowing Crescent Moon & Ambient Twilight Halo
    const moonContainer = new Container();
    const moonX = rw * 0.82;
    const moonY = rh * 0.16;
    moonContainer.position.set(moonX, moonY);

    const moonHalo = new Graphics();
    moonHalo.circle(0, 0, 80).fill({ color: 0xffd19a, alpha: 0.05 });
    moonHalo.circle(0, 0, 52).fill({ color: 0xffe3b3, alpha: 0.1 });
    moonHalo.circle(0, 0, 32).fill({ color: 0xfff3d4, alpha: 0.18 });

    const moonBody = new Graphics();
    moonBody.circle(0, 0, 22).fill(0xfffae6);
    // Dark silhouette crescent cutout
    moonBody.circle(7, -5, 18).fill(0x182038);

    moonContainer.addChild(moonHalo, moonBody);
    this.backgroundLayer.addChild(moonContainer);

    // Twinkling Upper Atmosphere Stars
    this.starsContainer = new Container();
    for (let i = 0; i < 45; i++) {
      const sx = Math.random() * rw;
      const sy = Math.random() * (floorY * 0.55);
      const size = 0.8 + Math.random() * 1.6;
      const star = new Graphics();
      star.circle(0, 0, size).fill(0xffffff);
      star.x = sx;
      star.y = sy;
      const baseAlpha = 0.35 + Math.random() * 0.65;
      star.alpha = baseAlpha;
      this.starsContainer.addChild(star);
      this.stars.push({
        gfx: star,
        baseAlpha,
        phase: Math.random() * Math.PI * 2,
        speed: 1.2 + Math.random() * 2.5,
      });
    }
    this.backgroundLayer.addChild(this.starsContainer);

    // ============================================
    // 2. HIGH WISPY CIRRUS CLOUDS
    // ============================================
    const cirrusContainer = new Container();
    for (let i = 0; i < 3; i++) {
      const cirrus = this.createCirrusCloud(180 + Math.random() * 120);
      cirrus.x = (rw / 3) * i + Math.random() * 80;
      cirrus.y = 35 + i * 38;
      cirrus.alpha = 0.35;
      cirrusContainer.addChild(cirrus);
      this.clouds.push({
        container: cirrus,
        vx: 4 + i * 2,
        wrapW: rw + 250,
      });
    }
    this.backgroundLayer.addChild(cirrusContainer);

    // ============================================
    // 3. FAR MOUNTAIN RANGE (Majestic Jagged Peaks)
    // ============================================
    const farMountains = new Graphics();
    this.drawFarMountainRange(farMountains, rw, floorY);
    this.backgroundLayer.addChild(farMountains);

    // ============================================
    // 4. MID MOUNTAIN RANGE (Crisp 3D Faceted Ridges & Snowcaps)
    // ============================================
    const midMountains = new Graphics();
    this.drawMidMountainRange(midMountains, rw, floorY);
    this.backgroundLayer.addChild(midMountains);

    // ============================================
    // 5. VALLEY MIST & ATMOSPHERIC FOG BANKS
    // ============================================
    this.mistContainer = new Container();
    for (let i = 0; i < 3; i++) {
      const mist = this.createMistBank(rw * 0.6 + i * 100, 32 + i * 8);
      mist.x = i * (rw * 0.4);
      mist.y = floorY * 0.62 + i * 24;
      this.mistContainer.addChild(mist);
      this.mistPuffs.push({
        container: mist,
        baseY: mist.y,
        vx: 6 + i * 3,
        phase: i * 2.1,
      });
    }
    this.backgroundLayer.addChild(this.mistContainer);

    // ============================================
    // 6. NEAR FOOTHILLS & PINE RIDGE CREST
    // ============================================
    const nearFoothills = new Graphics();
    this.drawNearFoothills(nearFoothills, rw, floorY);
    this.backgroundLayer.addChild(nearFoothills);

    // ============================================
    // 7. DRIFTING FLUFFY CUMULUS CLOUDS (Midground)
    // ============================================
    this.cloudLayer = new Container();
    const cloudConfigs = [
      { x: rw * 0.08, y: floorY * 0.28, scale: 1.1, vx: 14, alpha: 0.92 },
      { x: rw * 0.42, y: floorY * 0.18, scale: 0.85, vx: 10, alpha: 0.85 },
      { x: rw * 0.72, y: floorY * 0.36, scale: 1.25, vx: 18, alpha: 0.95 },
      { x: rw * 0.92, y: floorY * 0.22, scale: 0.9, vx: 12, alpha: 0.88 },
      { x: -rw * 0.15, y: floorY * 0.32, scale: 1.0, vx: 15, alpha: 0.9 },
    ];

    cloudConfigs.forEach((cfg) => {
      const cloud = this.createFluffyCloud();
      cloud.position.set(cfg.x, cfg.y);
      cloud.scale.set(cfg.scale);
      cloud.alpha = cfg.alpha;
      this.cloudLayer.addChild(cloud);
      this.clouds.push({
        container: cloud,
        vx: cfg.vx,
        wrapW: rw + 220,
      });
    });
    this.backgroundLayer.addChild(this.cloudLayer);

    // ============================================
    // 8. DETAILED SCENIC PINE TREES (Flanking & Slopes)
    // ============================================
    this.treesContainer = new Container();

    // Left Overlook Pine Grove
    this.addScenicTree(30, floorY + 4, 1.25, 4, 0);
    this.addScenicTree(75, floorY - 14, 1.05, 4, 1.2);
    this.addScenicTree(125, floorY - 26, 0.88, 3, 2.5);
    this.addScenicTree(170, floorY - 36, 0.72, 3, 0.8);

    // Right Overlook Pine Grove
    this.addScenicTree(rw - 35, floorY + 4, 1.3, 4, 1.5);
    this.addScenicTree(rw - 85, floorY - 12, 1.1, 4, 2.8);
    this.addScenicTree(rw - 135, floorY - 24, 0.9, 3, 0.5);
    this.addScenicTree(rw - 180, floorY - 34, 0.75, 3, 2.0);

    // Distant Slope Accent Trees
    this.addScenicTree(rw * 0.32, floorY - 48, 0.55, 3, 1.0);
    this.addScenicTree(rw * 0.36, floorY - 44, 0.48, 3, 2.2);
    this.addScenicTree(rw * 0.65, floorY - 46, 0.52, 3, 0.7);

    this.backgroundLayer.addChild(this.treesContainer);

    // ============================================
    // 9. AMBIENT FLOATING MOUNTAIN BREEZE PARTICLES
    // ============================================
    this.particleContainer = new Container();
    for (let i = 0; i < 32; i++) {
      const p = new Graphics();
      const pSize = 1.2 + Math.random() * 2.2;
      const pColor = Math.random() > 0.4 ? 0xffe4a0 : 0x7dd3fc;
      p.circle(0, 0, pSize).fill({ color: pColor, alpha: 0.7 });
      p.x = Math.random() * rw;
      p.y = Math.random() * rh;
      this.particleContainer.addChild(p);
      this.particles.push({
        gfx: p,
        x: p.x,
        y: p.y,
        vx: (Math.random() - 0.5) * 14 + 8,
        vy: 12 + Math.random() * 18,
        seed: Math.random() * 10,
        baseAlpha: 0.4 + Math.random() * 0.5,
      });
    }
    this.backgroundLayer.addChild(this.particleContainer);

    // ============================================
    // 10. SCENIC OVERLOOK TERRACE FLOOR & RAILING
    // ============================================
    const floor = new Graphics();

    // Overlook Timber / Cliff Ground
    floor.rect(0, floorY, rw, rh - floorY).fill(0x1a151f);

    // Weathered Alpine Wood Planks
    for (let fx = 0; fx < rw; fx += 55) {
      floor
        .moveTo(fx, floorY)
        .lineTo(fx - 25, rh)
        .stroke({ width: 1.5, color: 0x2d2233, alpha: 0.7 });
    }

    // Top Platform Edge Rim
    floor
      .rect(0, floorY - 6, rw, 6)
      .fill(0x382940)
      .stroke({ width: 1, color: 0x5a4366, alpha: 0.6 });

    // Rustic Overlook Balustrade / Railing
    const railY = floorY - 32;
    floor.rect(0, railY, rw, 5).fill(0x47324a);
    floor.rect(0, railY + 14, rw, 3).fill(0x342236);

    for (let px = 20; px < rw; px += 60) {
      floor.rect(px - 3, railY - 4, 6, 36).fill(0x47324a);
      floor.rect(px - 4, railY - 6, 8, 4).fill(0x5e4463);
    }

    // Warm Overlook Lanterns
    const lanternPositions = [rw * 0.22, rw * 0.5, rw * 0.78];
    lanternPositions.forEach((lx) => {
      // Lantern Post Cap
      floor.roundRect(lx - 7, railY - 26, 14, 18, 3).fill(0x161219);
      floor.rect(lx - 5, railY - 23, 10, 12).fill(0xffd166);

      // Glowing Aura
      const glow = new Graphics();
      glow.circle(lx, railY - 17, 24).fill({ color: 0xffd166, alpha: 0.14 });
      glow.circle(lx, railY - 17, 12).fill({ color: 0xfff0a8, alpha: 0.28 });
      this.foregroundLayer.addChild(glow);
      this.lanternGlows.push(glow);
    });

    // Alpine Grass Tufts & Wildflower Clusters
    for (let gx = 10; gx < rw; gx += 45) {
      const tuftH = 8 + (gx % 5) * 2;
      floor
        .moveTo(gx, floorY - 2)
        .lineTo(gx - 4, floorY - tuftH)
        .stroke({ width: 1.5, color: 0x40916c, alpha: 0.8 });
      floor
        .moveTo(gx + 3, floorY - 2)
        .lineTo(gx + 6, floorY - tuftH - 2)
        .stroke({ width: 1.5, color: 0x52b788, alpha: 0.9 });

      if (gx % 90 === 0) {
        // Tiny Alpine Blossom
        floor.circle(gx + 6, floorY - tuftH - 4, 2.5).fill(0xf472b6);
      } else if (gx % 135 === 0) {
        floor.circle(gx - 4, floorY - tuftH - 2, 2.2).fill(0x38bdf8);
      }
    }

    this.foregroundLayer.addChild(floor);

    // ============================================
    // 11. CLASSIC MONOCHROME OBSIDIAN SLATE & SILVER PROJECT CARDS
    // ============================================
    this.arcadeMachines = [];
    const totalProjects = this.projects.length;

    const cols =
      rw >= 1400 && totalProjects >= 5
        ? 3
        : rw > 1050 && totalProjects >= 4
          ? 2
          : totalProjects <= 2
            ? totalProjects
            : 2;

    const gridW =
      cols === 3 ? Math.min(rw * 0.94, 1680) : Math.min(rw * 0.92, 1560);
    const colGap = cols === 3 ? 24 : 36;
    const cardW = (gridW - (cols - 1) * colGap) / cols;
    const cardH = cols === 3 ? 255 : 260;
    const rowGap = cols === 3 ? 24 : 28;

    const startY = 80 + cardH / 2;

    this.projects.forEach((proj, idx) => {
      const col = idx % cols;
      const row = Math.floor(idx / cols);

      const itemsInRow = Math.min(cols, totalProjects - row * cols);
      const rowGridW = itemsInRow * cardW + (itemsInRow - 1) * colGap;
      const rowStartX = (rw - rowGridW) / 2 + cardW / 2;

      const mx = rowStartX + col * (cardW + colGap);
      const my = startY + row * (cardH + rowGap);

      const machCont = new Container();
      machCont.position.set(mx, my);
      machCont.eventMode = "static";
      machCont.cursor = "pointer";

      const machSpring = new Spring(1.0, 260, 14);

      // 1. Soft Ambient Drop Shadow
      const mShadow = new Graphics()
        .roundRect(-cardW / 2 + 5, -cardH / 2 + 7, cardW, cardH, 16)
        .fill({ color: 0x000000, alpha: 0.65 });

      // 2. Classic Obsidian Slate Glass Shell
      const mShell = new Graphics();
      this.drawCardShell(mShell, cardW, cardH, false);

      // ==========================================
      // LEFT SIDE: OBSERVATORY LENS / THUMBNAIL
      // ==========================================
      const screenW = cols === 3 ? 210 : 240;
      const screenH = cardH - 32;
      const screenX = -cardW / 2 + 16;
      const screenY = -cardH / 2 + 16;

      const screenFrame = new Graphics()
        .roundRect(screenX, screenY, screenW, screenH, 10)
        .fill(0x080d14)
        .stroke({ width: 1.5, color: 0x242e3d });

      // Image Container & Mask
      const imgHolder = new Container();
      const imgMask = new Graphics()
        .roundRect(screenX, screenY, screenW, screenH, 10)
        .fill(0xffffff);

      const projThumbSrc =
        proj.thumbnail || `./assets/projects/${proj.id}-1.jpg`;
      const tex =
        Assets.get(projThumbSrc) ||
        Assets.get(`proj_${proj.id}_1`) ||
        Assets.get("home");

      const imgSprite = new Sprite(tex);

      // Sizing helper: object-fit: scale-down (preserves aspect ratio, never scales up beyond natural size)
      const applyScaleDown = (sprite, texture) => {
        if (!sprite || !texture) return;
        const tw =
          texture.orig?.width ||
          texture.width ||
          texture.source?.width ||
          screenW;
        const th =
          texture.orig?.height ||
          texture.height ||
          texture.source?.height ||
          screenH;
        if (tw <= 1 || th <= 1) return;

        const scale = Math.min(1, screenW / tw, screenH / th);
        const fitW = tw * scale;
        const fitH = th * scale;

        sprite.width = fitW;
        sprite.height = fitH;
        sprite.position.set(
          screenX + (screenW - fitW) / 2,
          screenY + (screenH - fitH) / 2,
        );
      };

      if (tex) {
        applyScaleDown(imgSprite, tex);
        if (
          tex.source &&
          !tex.source.isLoaded &&
          typeof tex.source.on === "function"
        ) {
          tex.source.on("loaded", () => {
            applyScaleDown(imgSprite, tex);
          });
        }
      }

      if (!Assets.get(projThumbSrc) && !Assets.get(`proj_${proj.id}_1`)) {
        Assets.load(projThumbSrc)
          .then((loadedTex) => {
            if (loadedTex && !this.destroyed && imgSprite) {
              imgSprite.texture = loadedTex;
              applyScaleDown(imgSprite, loadedTex);
            }
          })
          .catch(() => {});
      }

      // Classic Lens Sheen (Top-left corner light reflection)
      const lensSheen = new Graphics()
        .moveTo(screenX, screenY)
        .lineTo(screenX + 54, screenY)
        .lineTo(screenX, screenY + 64)
        .closePath()
        .fill({ color: 0xffffff, alpha: 0.12 });

      imgHolder.mask = imgMask;
      imgHolder.addChild(imgSprite, imgMask, lensSheen);

      // Classic Monochrome Photo Badge
      const photoCount = proj.images?.length || 3;
      const photoBadge = new Container();
      photoBadge.position.set(screenX + 8, screenY + screenH - 32);

      const pbBg = new Graphics()
        .roundRect(0, 0, screenW - 16, 24, 6)
        .fill({ color: 0x080d14, alpha: 0.92 })
        .stroke({ width: 1, color: 0x475569, alpha: 0.75 });

      const pbTxt = new Text({
        text: `${photoCount} SCREENSHOTS ↗`,
        style: {
          fontFamily: "system-ui, sans-serif",
          fontSize: 11.5,
          fontWeight: "900",
          fill: 0xe2e8f0,
          letterSpacing: 0.6,
        },
      });
      pbTxt.anchor.set(0.5);
      pbTxt.position.set((screenW - 16) / 2, 12);
      photoBadge.addChild(pbBg, pbTxt);

      // ==========================================
      // RIGHT SIDE: TITLE, ENGINE, TAGS & BUTTONS
      // ==========================================
      const rightX = screenX + screenW + (cols === 3 ? 18 : 24);
      const rightW = cardW - (rightX - -cardW / 2) - (cols === 3 ? 16 : 20);

      const tagTxt = new Text({
        text: `${proj.engine} · ${proj.type}`,
        style: {
          fontFamily: "system-ui, sans-serif",
          fontSize: cols === 3 ? 11.5 : 13,
          fontWeight: "800",
          fill: 0xe2e8f0,
          letterSpacing: 0.6,
        },
      });
      tagTxt.position.set(rightX + 8, -cardH / 2 + (cols === 3 ? 16 : 20));

      // Classic Neutral Slate Pill Tag
      const tagW = Math.min(tagTxt.width + 16, rightW);
      const tagBg = new Graphics()
        .roundRect(
          rightX,
          -cardH / 2 + (cols === 3 ? 13 : 16),
          tagW,
          cols === 3 ? 23 : 26,
          6,
        )
        .fill({ color: 0x1e293b, alpha: 0.75 })
        .stroke({ width: 1, color: 0x475569, alpha: 0.7 });

      // Project Title (Snowcap Pure White)
      const titleTxt = new Text({
        text: proj.title,
        style: {
          fontFamily: "system-ui, -apple-system, sans-serif",
          fontSize: cols === 3 ? 18.5 : 22,
          fontWeight: "900",
          fill: 0xffffff,
          letterSpacing: 0.4,
          wordWrap: true,
          wordWrapWidth: rightW,
        },
      });
      titleTxt.position.set(rightX, -cardH / 2 + (cols === 3 ? 44 : 54));

      // Bullet Preview (Starlight Silver Mist)
      const previewY = titleTxt.height > 30 ? -cardH / 2 + 96 : -cardH / 2 + 76;
      const previewTxt = new Text({
        text: proj.bullets?.[0] ?? "",
        style: {
          fontFamily: "system-ui, sans-serif",
          fontSize: cols === 3 ? 13 : 14.5,
          fill: 0xd1d5db,
          lineHeight: cols === 3 ? 18 : 21,
          wordWrap: true,
          wordWrapWidth: rightW,
        },
      });
      previewTxt.position.set(rightX, cols === 3 ? previewY : -cardH / 2 + 90);

      // Action Buttons Container
      const btnH = cols === 3 ? 34 : 38;
      const btnRow = new Container();
      btnRow.position.set(rightX, cardH / 2 - (btnH + 10));

      // Button 1: VIEW DETAILS & GALLERY (Classic Frosted Charcoal & Silver)
      const viewBtn = new Container();
      viewBtn.eventMode = "static";
      viewBtn.cursor = "pointer";

      const vBg = new Graphics()
        .roundRect(0, 0, proj.link ? rightW * 0.48 : rightW, btnH, 8)
        .fill(0x161e2e)
        .stroke({ width: 1.5, color: 0x475569 });

      const vTxt = new Text({
        text: "EXPLORE ↗",
        style: {
          fontFamily: "system-ui, sans-serif",
          fontSize: cols === 3 ? 12 : 13,
          fontWeight: "900",
          fill: 0xffffff,
          letterSpacing: 0.6,
        },
      });
      vTxt.anchor.set(0.5);
      vTxt.position.set((proj.link ? rightW * 0.48 : rightW) / 2, btnH / 2);
      viewBtn.addChild(vBg, vTxt);

      viewBtn.on("pointerover", () => {
        vBg
          .clear()
          .roundRect(0, 0, proj.link ? rightW * 0.48 : rightW, btnH, 8)
          .fill(0x263348)
          .stroke({ width: 1.5, color: 0xffffff });
      });

      viewBtn.on("pointerout", () => {
        vBg
          .clear()
          .roundRect(0, 0, proj.link ? rightW * 0.48 : rightW, btnH, 8)
          .fill(0x161e2e)
          .stroke({ width: 1.5, color: 0x475569 });
      });

      viewBtn.on("pointertap", (e) => {
        e.stopPropagation();
        this.inspectProject(proj);
      });
      btnRow.addChild(viewBtn);

      // Button 2: OPEN LINK (Classic Crisp Starlight White & Dark Charcoal)
      if (proj.link) {
        const linkBtn = new Container();
        linkBtn.position.set(rightW * 0.52, 0);
        linkBtn.eventMode = "static";
        linkBtn.cursor = "pointer";

        const lBg = new Graphics()
          .roundRect(0, 0, rightW * 0.48, btnH, 8)
          .fill(0xffffff);

        const lTxt = new Text({
          text: "OPEN LINK ↗",
          style: {
            fontFamily: "system-ui, sans-serif",
            fontSize: cols === 3 ? 12 : 13,
            fontWeight: "900",
            fill: 0x090d16,
            letterSpacing: 0.6,
          },
        });
        lTxt.anchor.set(0.5);
        lTxt.position.set((rightW * 0.48) / 2, btnH / 2);
        linkBtn.addChild(lBg, lTxt);

        linkBtn.on("pointerover", () => {
          lBg
            .clear()
            .roundRect(0, 0, rightW * 0.48, btnH, 8)
            .fill(0xe2e8f0);
        });

        linkBtn.on("pointerout", () => {
          lBg
            .clear()
            .roundRect(0, 0, rightW * 0.48, btnH, 8)
            .fill(0xffffff);
        });

        linkBtn.on("pointertap", (e) => {
          e.stopPropagation();
          if (typeof window !== "undefined") {
            window.open(proj.link, "_blank");
          }
        });
        btnRow.addChild(linkBtn);
      }

      machCont.addChild(
        mShadow,
        mShell,
        screenFrame,
        imgHolder,
        photoBadge,
        tagBg,
        tagTxt,
        titleTxt,
        previewTxt,
        btnRow,
      );

      machCont.on("pointerover", () => {
        machSpring.target = 1.04;
        this.drawCardShell(mShell, cardW, cardH, true);
      });

      machCont.on("pointerout", () => {
        machSpring.target = 1.0;
        this.drawCardShell(mShell, cardW, cardH, false);
      });

      machCont.on("pointerdown", () => {
        machSpring.set(0.96);
      });

      machCont.on("pointertap", () => {
        this.inspectProject(proj);
      });

      this.furnitureLayer.addChild(machCont);
      this.arcadeMachines.push({
        container: machCont,
        spring: machSpring,
      });
    });
  }

  drawCardShell(g, cardW, cardH, isHovered) {
    g.clear();

    if (isHovered) {
      // Hovered: Illuminated Classic Obsidian Glass with pure white silver rim
      g.roundRect(-cardW / 2, -cardH / 2, cardW, cardH, 16)
        .fill({ color: 0x0f172a, alpha: 0.75 })
        .stroke({ width: 2.0, color: 0xffffff });

      // Top Glass Frosted Highlight Bevel
      g.roundRect(-cardW / 2 + 3, -cardH / 2 + 2, cardW - 6, 2, 1).fill({
        color: 0xffffff,
        alpha: 0.45,
      });

      // Classic Silver Summit Pip
      g.moveTo(-cardW / 2 + 14, -cardH / 2 + 10)
        .lineTo(-cardW / 2 + 18, -cardH / 2 + 4)
        .lineTo(-cardW / 2 + 22, -cardH / 2 + 10)
        .closePath()
        .fill(0xffffff);
    } else {
      // Default: Deep Neutral Obsidian Slate Frosted Glass Shell with 0.5 alpha
      g.roundRect(-cardW / 2, -cardH / 2, cardW, cardH, 16)
        .fill({ color: 0x0a0f1d, alpha: 0.5 })
        .stroke({ width: 1.5, color: 0x334155, alpha: 0.85 });

      // Top Glass Frosted Highlight Bevel
      g.roundRect(-cardW / 2 + 3, -cardH / 2 + 2, cardW - 6, 2, 1).fill({
        color: 0xffffff,
        alpha: 0.22,
      });

      // Classic Silver Summit Pip
      g.moveTo(-cardW / 2 + 14, -cardH / 2 + 10)
        .lineTo(-cardW / 2 + 18, -cardH / 2 + 4)
        .lineTo(-cardW / 2 + 22, -cardH / 2 + 10)
        .closePath()
        .fill({ color: 0x94a3b8, alpha: 0.8 });
    }
  }

  // ============================================
  // PROCEDURAL SCENERY GRAPHICS HELPERS
  // ============================================

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

  createCirrusCloud(width) {
    const g = new Graphics();
    const h = 10 + Math.random() * 8;
    g.roundRect(-width / 2, -h / 2, width, h, h / 2).fill({
      color: 0xfdf4ff,
      alpha: 0.32,
    });
    g.roundRect(-width * 0.3, -h * 0.8, width * 0.6, h * 0.6, h / 2).fill({
      color: 0xffffff,
      alpha: 0.22,
    });
    return g;
  }

  createFluffyCloud() {
    const cloud = new Container();
    const g = new Graphics();

    // Soft Bottom Shadow / Ambient Shading
    g.ellipse(0, 8, 70, 24).fill({ color: 0x93a3c2, alpha: 0.6 });
    g.ellipse(-42, 10, 40, 18).fill({ color: 0x93a3c2, alpha: 0.5 });
    g.ellipse(45, 10, 42, 18).fill({ color: 0x93a3c2, alpha: 0.5 });

    // Volumetric Crisp White Top Puffs
    g.circle(-40, -4, 28).fill({ color: 0xf8fafc, alpha: 0.95 });
    g.circle(-10, -22, 38).fill({ color: 0xffffff, alpha: 0.98 });
    g.circle(28, -14, 32).fill({ color: 0xf8fafc, alpha: 0.95 });
    g.circle(52, 2, 22).fill({ color: 0xf1f5f9, alpha: 0.92 });
    g.ellipse(0, 2, 75, 20).fill({ color: 0xffffff, alpha: 0.95 });

    // Highlight sheen
    g.circle(-12, -28, 14).fill({ color: 0xffffff, alpha: 0.8 });
    g.circle(25, -20, 10).fill({ color: 0xffffff, alpha: 0.8 });

    cloud.addChild(g);
    return cloud;
  }

  createMistBank(width, height) {
    const g = new Graphics();
    g.ellipse(0, 0, width / 2, height / 2).fill({
      color: 0xc8d7eb,
      alpha: 0.12,
    });
    g.ellipse(-width * 0.2, 0, width * 0.3, height * 0.4).fill({
      color: 0xdbeafe,
      alpha: 0.15,
    });
    g.ellipse(width * 0.2, 0, width * 0.3, height * 0.4).fill({
      color: 0xdbeafe,
      alpha: 0.15,
    });
    return g;
  }

  drawFarMountainRange(g, rw, floorY) {
    // Distant soft purple-blue silhouettes with snow accents
    const baseY = floorY * 0.78;
    g.moveTo(0, baseY);

    const peaks = [
      { x: 0, y: baseY - 60 },
      { x: rw * 0.12, y: baseY - 160 },
      { x: rw * 0.24, y: baseY - 90 },
      { x: rw * 0.38, y: baseY - 200 },
      { x: rw * 0.52, y: baseY - 120 },
      { x: rw * 0.68, y: baseY - 220 },
      { x: rw * 0.82, y: baseY - 130 },
      { x: rw * 0.94, y: baseY - 175 },
      { x: rw, y: baseY - 90 },
    ];

    peaks.forEach((p) => g.lineTo(p.x, p.y));
    g.lineTo(rw, floorY);
    g.lineTo(0, floorY);
    g.closePath();
    g.fill(0x1c243a);

    // Far Mountain Snow Caps
    const snowPeaks = [
      { x: rw * 0.12, y: baseY - 160, w: 42, h: 48 },
      { x: rw * 0.38, y: baseY - 200, w: 56, h: 62 },
      { x: rw * 0.68, y: baseY - 220, w: 60, h: 68 },
      { x: rw * 0.94, y: baseY - 175, w: 46, h: 52 },
    ];

    snowPeaks.forEach((sp) => {
      g.moveTo(sp.x, sp.y)
        .lineTo(sp.x - sp.w / 2, sp.y + sp.h)
        .lineTo(sp.x, sp.y + sp.h * 0.7)
        .lineTo(sp.x + sp.w / 2, sp.y + sp.h)
        .closePath()
        .fill({ color: 0x8fa8c7, alpha: 0.65 });
    });
  }

  drawMidMountainRange(g, rw, floorY) {
    const baseY = floorY * 0.88;

    // Dramatic Faceted Mountain Pyramids
    const mountains = [
      {
        peakX: rw * 0.22,
        peakY: floorY * 0.32,
        leftX: -40,
        rightX: rw * 0.44,
        snowH: 95,
      },
      {
        peakX: rw * 0.55,
        peakY: floorY * 0.26,
        leftX: rw * 0.26,
        rightX: rw * 0.82,
        snowH: 110,
      },
      {
        peakX: rw * 0.86,
        peakY: floorY * 0.36,
        leftX: rw * 0.62,
        rightX: rw + 60,
        snowH: 88,
      },
      {
        peakX: rw * 0.04,
        peakY: floorY * 0.4,
        leftX: -120,
        rightX: rw * 0.25,
        snowH: 80,
      },
    ];

    mountains.forEach((m) => {
      // 1. Left Light-Facing Facet
      g.moveTo(m.peakX, m.peakY)
        .lineTo(m.leftX, baseY)
        .lineTo(m.peakX, baseY)
        .closePath()
        .fill(0x273d5a);

      // 2. Right Shadow-Facing Facet
      g.moveTo(m.peakX, m.peakY)
        .lineTo(m.peakX, baseY)
        .lineTo(m.rightX, baseY)
        .closePath()
        .fill(0x162438);

      // 3. Central Ridge Highlight Line
      g.moveTo(m.peakX, m.peakY)
        .lineTo(m.peakX + (m.rightX - m.leftX) * 0.04, baseY)
        .stroke({ width: 2, color: 0x486585, alpha: 0.7 });

      // 4. Left Sunlit Snowcap
      const leftSnowW = (m.peakX - m.leftX) * (m.snowH / (baseY - m.peakY));
      g.moveTo(m.peakX, m.peakY)
        .lineTo(m.peakX - leftSnowW, m.peakY + m.snowH)
        .lineTo(m.peakX - leftSnowW * 0.5, m.peakY + m.snowH * 0.75)
        .lineTo(m.peakX, m.peakY + m.snowH * 0.9)
        .closePath()
        .fill(0xe2edf8);

      // 5. Right Shaded Snowcap
      const rightSnowW = (m.rightX - m.peakX) * (m.snowH / (baseY - m.peakY));
      g.moveTo(m.peakX, m.peakY)
        .lineTo(m.peakX, m.peakY + m.snowH * 0.9)
        .lineTo(m.peakX + rightSnowW * 0.45, m.peakY + m.snowH * 0.7)
        .lineTo(m.peakX + rightSnowW, m.peakY + m.snowH)
        .closePath()
        .fill(0xa5bad4);
    });
  }

  drawNearFoothills(g, rw, floorY) {
    // Rolling pine-crested ridges
    const baseY = floorY;

    g.moveTo(0, floorY * 0.65)
      .bezierCurveTo(
        rw * 0.25,
        floorY * 0.55,
        rw * 0.45,
        floorY * 0.72,
        rw * 0.7,
        floorY * 0.6,
      )
      .bezierCurveTo(
        rw * 0.85,
        floorY * 0.52,
        rw * 0.95,
        floorY * 0.62,
        rw,
        floorY * 0.58,
      )
      .lineTo(rw, baseY)
      .lineTo(0, baseY)
      .closePath()
      .fill(0x101a26);

    // Serrated Pine silhouettes along crest
    for (let x = 10; x < rw - 10; x += 14) {
      const ridgeY =
        floorY * 0.6 + Math.sin(x * 0.006) * 22 + Math.cos(x * 0.015) * 12;
      const th = 10 + (x % 7) * 3;
      g.moveTo(x, ridgeY)
        .lineTo(x - 5, ridgeY + th)
        .lineTo(x + 5, ridgeY + th)
        .closePath()
        .fill(0x0a121c);
    }
  }

  addScenicTree(x, y, scale = 1, tiers = 4, phaseOffset = 0) {
    const treeCont = new Container();
    treeCont.position.set(x, y);

    const g = new Graphics();
    const trunkW = 10 * scale;
    const trunkH = 28 * scale;

    // Trunk
    g.roundRect(-trunkW / 2, -trunkH, trunkW, trunkH, 3)
      .fill(0x422919)
      .stroke({ width: 1.5, color: 0x1f120a });

    // Multi-tier Pine Cones
    const startY = -trunkH * 0.8;
    const tierH = 26 * scale;
    const maxW = 54 * scale;

    for (let t = 0; t < tiers; t++) {
      const curY = startY - t * (tierH * 0.68);
      const w = maxW * (1 - (t / tiers) * 0.65);
      const h = tierH * (1 - (t / tiers) * 0.25);

      // Left Sunlit Needle Facet
      g.moveTo(0, curY - h)
        .lineTo(-w / 2, curY)
        .lineTo(0, curY - h * 0.2)
        .closePath()
        .fill(0x2d6a4f);

      // Right Shadow Needle Facet
      g.moveTo(0, curY - h)
        .lineTo(0, curY - h * 0.2)
        .lineTo(w / 2, curY)
        .closePath()
        .fill(0x1b4332);

      // Frost / Sun Highlight Tip
      g.moveTo(0, curY - h)
        .lineTo(-w * 0.25, curY - h * 0.45)
        .lineTo(0, curY - h * 0.5)
        .closePath()
        .fill({ color: 0x74c69d, alpha: 0.6 });
    }

    treeCont.addChild(g);
    this.treesContainer.addChild(treeCont);

    this.swayingTrees.push({
      container: treeCont,
      swaySpeed: 1.6 + Math.random() * 0.6,
      swayPhase: phaseOffset,
      swayMaxAngle: 0.025 * scale,
    });
  }

  inspectProject(proj) {
    projectModal.open(proj);
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

    // 1. Drifting Clouds Loop
    if (this.clouds && this.clouds.length) {
      const rw = this.roomWidth;
      this.clouds.forEach((c) => {
        if (c.container && !c.container.destroyed) {
          c.container.x += c.vx * dt;
          if (c.container.x > rw + 150) {
            c.container.x = -180;
          }
        }
      });
    }

    // 2. Valley Mist Banks Undulation
    if (this.mistPuffs && this.mistPuffs.length) {
      const rw = this.roomWidth;
      this.mistPuffs.forEach((m) => {
        if (m.container && !m.container.destroyed) {
          m.container.x += m.vx * dt;
          m.container.y = m.baseY + Math.sin(this.time * 1.2 + m.phase) * 6;
          if (m.container.x > rw + 200) {
            m.container.x = -200;
          }
        }
      });
    }

    // 3. Gentle Wind Sway on Pine Trees
    if (this.swayingTrees && this.swayingTrees.length) {
      this.swayingTrees.forEach((t) => {
        if (t.container && !t.container.destroyed) {
          t.container.rotation =
            Math.sin(this.time * t.swaySpeed + t.swayPhase) * t.swayMaxAngle;
        }
      });
    }

    // 4. Twinkling Upper Sky Stars
    if (this.stars && this.stars.length) {
      this.stars.forEach((s) => {
        if (s.gfx && !s.gfx.destroyed) {
          const wave = Math.sin(this.time * s.speed + s.phase) * 0.5 + 0.5;
          s.gfx.alpha = s.baseAlpha * (0.4 + wave * 0.6);
        }
      });
    }

    // 5. Floating Mountain Particles & Fireflies
    if (this.particles && this.particles.length) {
      const rw = this.roomWidth;
      const rh = this.roomHeight;
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

    // 6. Lantern Light Pulsing
    if (this.lanternGlows && this.lanternGlows.length) {
      this.lanternGlows.forEach((glow, idx) => {
        if (glow && !glow.destroyed) {
          const pulse = Math.sin(this.time * 2.5 + idx * 1.5) * 0.08;
          glow.scale.set(1.0 + pulse);
        }
      });
    }

    // 7. Project Card Spring Animations
    if (this.arcadeMachines && Array.isArray(this.arcadeMachines)) {
      this.arcadeMachines.forEach((m) => {
        if (
          m &&
          m.spring &&
          m.container &&
          !m.container.destroyed &&
          m.container.scale &&
          typeof m.container.scale.set === "function"
        ) {
          const s = m.spring.update(dt);
          m.container.scale.set(s);
        }
      });
    }
  }
}
