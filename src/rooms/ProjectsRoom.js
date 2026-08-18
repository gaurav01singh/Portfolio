import { Container, Graphics, Text } from "pixi.js";
import { Room } from "./Room";
import { Spring } from "../utils/Juice";
import { PORTFOLIO } from "../data/portfolio";
import { createProjectsShader } from "../utils/RoomShaders";

export class ProjectsRoom extends Room {
  constructor(app) {
    super(app, {
      accentColor: PORTFOLIO.projects.accentColor ?? 0x4dabf7,
      title: "Indie Game & Web Arcade Lab",
      type: "Arcade",
      icon: "",
    });
  }

  buildRoom() {
    const rw = this.roomWidth;
    const rh = this.roomHeight;
    const floorY = rh * 0.82;

    this.projects = PORTFOLIO.projects.list || [];
    this.miniScreens = [];

    // Attach Retro CRT Arcade Phosphor Shader
    this.shaderFilter = createProjectsShader();
    if (this.shaderFilter) {
      this.backgroundLayer.filters = [this.shaderFilter];
    }

    // ============================================
    // 1. BACKGROUND: ARCADE WALL & GRID TILES
    // ============================================
    const wall = new Graphics();
    wall.rect(0, 0, rw, floorY).fill(0x0a0d16);

    for (let by = 20; by < floorY; by += 28) {
      for (let bx = 0; bx < rw; bx += 70) {
        const off = (Math.floor(by / 28) % 2) * 35;
        wall
          .moveTo(bx + off, by)
          .lineTo(bx + off + 55, by)
          .stroke({ width: 1, color: 0x141b2c });
      }
    }

    wall
      .roundRect(rw * 0.28, 22, rw * 0.44, 44, 10)
      .fill(0x131124)
      .stroke({ width: 2, color: 0x4dabf7 });

    const signTxt = new Text({
      text: "DEVELOPER ARCADE & PROJECT SHOWCASE",
      style: {
        fontFamily: "system-ui, -apple-system, sans-serif",
        fontSize: 14,
        fontWeight: "900",
        fill: 0xffffff,
        letterSpacing: 2,
      },
    });
    signTxt.anchor.set(0.5);
    signTxt.position.set(rw * 0.5, 44);

    this.backgroundLayer.addChild(wall, signTxt);

    // ============================================
    // 2. FLOOR: RETRO ARCADE FLOOR
    // ============================================
    const floor = new Graphics();
    floor.rect(0, floorY, rw, rh - floorY).fill(0x100e1f);

    for (let cx = 20; cx < rw; cx += 80) {
      for (let cy = floorY + 12; cy < rh; cy += 28) {
        floor
          .moveTo(cx, cy)
          .lineTo(cx + 14, cy - 12)
          .lineTo(cx + 28, cy)
          .closePath()
          .fill({ color: 0x4dabf7, alpha: 0.18 });
      }
    }

    this.foregroundLayer.addChild(floor);

    // ============================================
    // 3. STRUCTURED 2-COLUMN / MULTI-ROW PROJECT GRID
    // ============================================
    this.arcadeMachines = [];
    const totalProjects = this.projects.length;

    const cols = rw > 1050 && totalProjects >= 4 ? 2 : totalProjects <= 2 ? totalProjects : 2;
    const rows = Math.ceil(totalProjects / cols);

    const gridW = Math.min(rw * 0.9, 960);
    const colGap = 28;
    const cardW = (gridW - (cols - 1) * colGap) / cols;
    const cardH = 170;
    const rowGap = 24;

    const startX = (rw - gridW) / 2 + cardW / 2;
    const startY = 95 + cardH / 2;

    this.projects.forEach((proj, idx) => {
      const col = idx % cols;
      const row = Math.floor(idx / cols);

      const mx = startX + col * (cardW + colGap);
      const my = startY + row * (cardH + rowGap);

      const machCont = new Container();
      machCont.position.set(mx, my);
      machCont.eventMode = "static";
      machCont.cursor = "pointer";

      const machSpring = new Spring(1.0, 260, 14);

      // Card Shadow
      const mShadow = new Graphics()
        .roundRect(-cardW / 2 + 6, -cardH / 2 + 8, cardW, cardH, 14)
        .fill({ color: 0x000000, alpha: 0.7 });

      // Main Card Body
      const mShell = new Graphics()
        .roundRect(-cardW / 2, -cardH / 2, cardW, cardH, 14)
        .fill(0x0e1322)
        .stroke({ width: 2, color: proj.color });

      // Top Accent Stripe
      const mStripe = new Graphics()
        .roundRect(-cardW / 2, -cardH / 2, cardW, 5, 2)
        .fill(proj.color);

      // ==========================================
      // LEFT SIDE: CRT MONITOR (width: ~130px)
      // ==========================================
      const screenW = Math.min(136, cardW * 0.35);
      const screenH = cardH - 34;
      const screenX = -cardW / 2 + 16;
      const screenY = -cardH / 2 + 16;

      const screenFrame = new Graphics()
        .roundRect(screenX, screenY, screenW, screenH, 8)
        .fill(0x060810)
        .stroke({ width: 1.5, color: 0x1f2b42 });

      const animScreen = new Graphics();
      animScreen.pId = proj.id;
      animScreen.pColor = proj.color;
      animScreen.screenX = screenX;
      animScreen.screenY = screenY;
      animScreen.screenW = screenW;
      animScreen.screenH = screenH;
      this.miniScreens.push(animScreen);

      // CRT Scanline Overlay
      const scanlines = new Graphics();
      for (let sl = screenY + 4; sl < screenY + screenH; sl += 4) {
        scanlines
          .moveTo(screenX + 2, sl)
          .lineTo(screenX + screenW - 2, sl)
          .stroke({ width: 1, color: 0x000000, alpha: 0.35 });
      }

      // ==========================================
      // RIGHT SIDE: TITLE, ENGINE, TAGS & BUTTONS
      // ==========================================
      const rightX = screenX + screenW + 16;
      const rightW = cardW - (rightX - -cardW / 2) - 16;

      // Engine / Type Tag
      const tagBg = new Graphics()
        .roundRect(rightX, -cardH / 2 + 16, Math.min(140, rightW), 20, 4)
        .fill({ color: proj.color, alpha: 0.2 })
        .stroke({ width: 1, color: proj.color });

      const tagTxt = new Text({
        text: `${proj.engine} · ${proj.type}`,
        style: {
          fontFamily: "system-ui, sans-serif",
          fontSize: 9.5,
          fontWeight: "900",
          fill: proj.color,
          letterSpacing: 0.8,
        },
      });
      tagTxt.position.set(rightX + 8, -cardH / 2 + 20);

      // Project Title
      const titleTxt = new Text({
        text: proj.title,
        style: {
          fontFamily: "system-ui, -apple-system, sans-serif",
          fontSize: 14.5,
          fontWeight: "900",
          fill: 0xffffff,
          wordWrap: true,
          wordWrapWidth: rightW,
        },
      });
      titleTxt.position.set(rightX, -cardH / 2 + 42);

      // Bullet Preview
      const previewTxt = new Text({
        text: proj.bullets[0] ?? "",
        style: {
          fontFamily: "system-ui, sans-serif",
          fontSize: 11,
          fill: 0x94a3b8,
          lineHeight: 15,
          wordWrap: true,
          wordWrapWidth: rightW,
        },
      });
      previewTxt.position.set(rightX, -cardH / 2 + 66);

      // Action Buttons Container
      const btnRow = new Container();
      btnRow.position.set(rightX, cardH / 2 - 36);

      // Button 1: VIEW DETAILS
      const viewBtn = new Container();
      viewBtn.eventMode = "static";
      viewBtn.cursor = "pointer";

      const vBg = new Graphics()
        .roundRect(0, 0, proj.link ? rightW * 0.48 : rightW, 26, 6)
        .fill(0x182236)
        .stroke({ width: 1.5, color: proj.color });

      const vTxt = new Text({
        text: "VIEW DETAILS",
        style: {
          fontFamily: "system-ui, sans-serif",
          fontSize: 10,
          fontWeight: "900",
          fill: 0xffffff,
          letterSpacing: 0.5,
        },
      });
      vTxt.anchor.set(0.5);
      vTxt.position.set((proj.link ? rightW * 0.48 : rightW) / 2, 13);
      viewBtn.addChild(vBg, vTxt);

      viewBtn.on("pointertap", (e) => {
        e.stopPropagation();
        this.inspectProject(proj);
      });
      btnRow.addChild(viewBtn);

      // Button 2: OPEN LINK (if available)
      if (proj.link) {
        const linkBtn = new Container();
        linkBtn.position.set(rightW * 0.52, 0);
        linkBtn.eventMode = "static";
        linkBtn.cursor = "pointer";

        const lBg = new Graphics()
          .roundRect(0, 0, rightW * 0.48, 26, 6)
          .fill(proj.color);

        const lTxt = new Text({
          text: "OPEN LINK ↗",
          style: {
            fontFamily: "system-ui, sans-serif",
            fontSize: 10,
            fontWeight: "900",
            fill: 0x05070e,
            letterSpacing: 0.5,
          },
        });
        lTxt.anchor.set(0.5);
        lTxt.position.set((rightW * 0.48) / 2, 13);
        linkBtn.addChild(lBg, lTxt);

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
        mStripe,
        screenFrame,
        animScreen,
        scanlines,
        tagBg,
        tagTxt,
        titleTxt,
        previewTxt,
        btnRow,
      );

      machCont.on("pointerover", () => {
        machSpring.target = 1.05;
        mShell
          .clear()
          .roundRect(-cardW / 2, -cardH / 2, cardW, cardH, 14)
          .fill(0x131a2c)
          .stroke({ width: 2.5, color: 0xffffff });
      });

      machCont.on("pointerout", () => {
        machSpring.target = 1.0;
        mShell
          .clear()
          .roundRect(-cardW / 2, -cardH / 2, cardW, cardH, 14)
          .fill(0x0e1322)
          .stroke({ width: 2, color: proj.color });
      });

      machCont.on("pointerdown", () => {
        machSpring.set(0.95);
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

  inspectProject(proj) {
    const c = new Container();

    const title = new Text({
      text: proj.title,
      style: {
        fontFamily: "system-ui, -apple-system, sans-serif",
        fontSize: 17,
        fontWeight: "900",
        fill: proj.color,
      },
    });
    title.position.set(0, 0);

    const tag = new Text({
      text: `${proj.engine} PLATFORM  ·  ${proj.type}`,
      style: {
        fontFamily: "system-ui, sans-serif",
        fontSize: 12,
        fontWeight: "800",
        fill: 0xfacc15,
        letterSpacing: 0.8,
      },
    });
    tag.position.set(0, 24);

    let by = 54;
    proj.bullets.forEach((b) => {
      const bCont = new Container();
      bCont.position.set(0, by);

      const dot = new Graphics().circle(6, 8, 3).fill(proj.color);

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
      text: "TECHNOLOGIES: " + proj.stack.join("  •  "),
      style: {
        fontFamily: "system-ui, sans-serif",
        fontSize: 12,
        fontWeight: "900",
        fill: 0xffffff,
        wordWrap: true,
        wordWrapWidth: 490,
        lineHeight: 18,
      },
    });
    stackTxt.position.set(0, by + 8);
    c.addChild(stackTxt);

    let lastY = stackTxt.y + stackTxt.height + 14;

    // Launch Project Link Button
    if (proj.link) {
      const linkBtn = new Container();
      linkBtn.position.set(0, lastY);
      linkBtn.eventMode = "static";
      linkBtn.cursor = "pointer";

      const lBg = new Graphics()
        .roundRect(0, 0, 490, 42, 8)
        .fill(proj.color)
        .stroke({ width: 1.5, color: 0xffffff });

      const lTxt = new Text({
        text: "LAUNCH PROJECT / OPEN LIVE DEMO ↗",
        style: {
          fontFamily: "system-ui, sans-serif",
          fontSize: 13,
          fontWeight: "900",
          fill: 0x05070e,
          letterSpacing: 0.8,
        },
      });
      lTxt.anchor.set(0.5);
      lTxt.position.set(245, 21);

      linkBtn.addChild(lBg, lTxt);
      linkBtn.on("pointertap", () => {
        if (typeof window !== "undefined") {
          window.open(proj.link, "_blank");
        }
      });

      c.addChild(linkBtn);
      lastY += 50;
    }

    this.showInspector({
      title: `${proj.title} Arcade Dossier`,
      icon: "",
      color: proj.color,
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
    const t = performance.now() * 0.003;

    if (this.shaderFilter?.resources?.filterUniforms?.uniforms) {
      this.shaderFilter.resources.filterUniforms.uniforms.uTime = performance.now() * 0.001;
    }

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

    if (this.miniScreens && Array.isArray(this.miniScreens)) {
      this.miniScreens.forEach((g) => {
        if (!g || g.destroyed || !g.context) return;
        g.clear();
        const sx = g.screenX;
        const sy = g.screenY;
        const sw = g.screenW;
        const sh = g.screenH;

        if (g.pId === "flappy") {
          // Flappy Bird simulation
          const birdY = sy + sh * 0.5 + Math.sin(t * 3.5) * (sh * 0.28);
          g.circle(sx + sw * 0.3, birdY, 5).fill(0xfacc15);

          const pipeOffset = (t * 22) % (sw * 0.7);
          const px = sx + sw - pipeOffset;
          g.rect(px, sy, 10, sh * 0.32).fill(0x22c55e);
          g.rect(px, sy + sh * 0.68, 10, sh * 0.32).fill(0x22c55e);
        } else if (g.pId === "runner") {
          // Endless Runner track
          g.moveTo(sx, sy + sh * 0.75)
            .lineTo(sx + sw, sy + sh * 0.75)
            .stroke({ width: 2, color: 0xf59e0b });

          const runnerY = sy + sh * 0.68 + (Math.sin(t * 5.0) > 0.4 ? -12 : 0);
          g.rect(sx + 18, runnerY, 7, 10).fill(0x38bdf8);

          const obsOffset = (t * 30) % sw;
          g.rect(sx + sw - obsOffset, sy + sh * 0.65, 8, 8).fill(0xef4444);
        } else if (g.pId === "ecommerce") {
          // E-commerce animated shopping cart & products
          const py = sy + sh * 0.4 + Math.sin(t * 2.0) * 4;
          g.roundRect(sx + sw * 0.2, py, 24, 20, 3).fill(0x10b981);
          g.roundRect(sx + sw * 0.55, py - 4, 20, 24, 3).fill(0x38bdf8);
          g.circle(sx + sw * 0.8, sy + sh * 0.7, 4).fill(0xfacc15);
        } else {
          // Tutorial Haven real-time code editor lines
          for (let l = 0; l < 4; l++) {
            const lineY = sy + 14 + l * 12;
            const lineW = (Math.sin(t * 1.5 + l) * 0.3 + 0.6) * (sw - 20);
            g.roundRect(sx + 10, lineY, Math.max(16, lineW), 4, 2).fill(
              l === 0 ? g.pColor : 0x475569,
            );
          }
        }
      });
    }
  }
}
