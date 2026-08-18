import { Container, Graphics, Text } from "pixi.js";
import { Room } from "./Room";
import { Spring } from "../utils/Juice";
import { PORTFOLIO } from "../data/portfolio";
import { createExperienceShader } from "../utils/RoomShaders";

export class ExperienceRoom extends Room {
  constructor(app) {
    super(app, {
      accentColor: PORTFOLIO.experience.accentColor ?? 0xff6b6b,
      title: "Holographic Career Timeline",
      type: "Timeline",
      icon: "",
    });
  }

  buildRoom() {
    const rw = this.roomWidth;
    const rh = this.roomHeight;
    const floorY = rh * 0.82;

    this.experiences = PORTFOLIO.experience.jobs || [];

    // Attach Holographic Laser Timeline Shader
    this.shaderFilter = createExperienceShader();
    if (this.shaderFilter) {
      this.backgroundLayer.filters = [this.shaderFilter];
    }

    // ============================================
    // 1. BACKGROUND: HOLOGRAPHIC GRID WALL
    // ============================================
    const wall = new Graphics();
    wall.rect(0, 0, rw, floorY).fill(0x0a0e1a);

    for (let gx = 0; gx < rw; gx += 80) {
      wall
        .moveTo(gx, 0)
        .lineTo(gx, floorY)
        .stroke({ width: 1, color: 0x151f33, alpha: 0.6 });
    }
    for (let gy = 0; gy < floorY; gy += 60) {
      wall
        .moveTo(0, gy)
        .lineTo(rw, gy)
        .stroke({ width: 1, color: 0x151f33, alpha: 0.6 });
    }

    wall
      .roundRect(rw * 0.28, 22, rw * 0.44, 44, 10)
      .fill(0x131828)
      .stroke({ width: 2, color: 0xff6b6b });

    const signTxt = new Text({
      text: "HOLOGRAPHIC CAREER & INTERNSHIP MATRIX",
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
    // 2. FLOOR: HOLOGRAPHIC GRID FLOOR
    // ============================================
    const floor = new Graphics();
    floor.rect(0, floorY, rw, rh - floorY).fill(0x111624);

    for (let fx = 0; fx < rw; fx += 75) {
      floor
        .moveTo(fx, floorY)
        .lineTo(fx - 40, rh)
        .stroke({ width: 1.5, color: 0x1c2438, alpha: 0.8 });
    }

    this.foregroundLayer.addChild(floor);

    // ============================================
    // 3. STRUCTURED GRID STATIONS
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
    const startY = 100 + stationH / 2;

    // Grid Circuit Spine Connector
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

      const sShadow = new Graphics()
        .roundRect(
          -stationW / 2 + 8,
          -stationH / 2 + 10,
          stationW,
          stationH,
          16,
        )
        .fill({ color: 0x000000, alpha: 0.7 });

      const sBg = new Graphics()
        .roundRect(-stationW / 2, -stationH / 2, stationW, stationH, 16)
        .fill(0x0e1424)
        .stroke({ width: 2.5, color: exp.color });

      const sStripe = new Graphics()
        .roundRect(-stationW / 2, -stationH / 2, stationW, 6, 3)
        .fill(exp.color);

      // Status Pill
      const statusPill = new Container();
      statusPill.position.set(-stationW / 2 + 16, -stationH / 2 + 16);

      const spBg = new Graphics()
        .roundRect(0, 0, 115, 22, 6)
        .fill({ color: exp.color, alpha: 0.2 })
        .stroke({ width: 1, color: exp.color });

      const statusTxt = new Text({
        text: exp.status,
        style: {
          fontFamily: "system-ui, sans-serif",
          fontSize: 10,
          fontWeight: "900",
          fill: exp.color,
          letterSpacing: 0.8,
        },
      });
      statusTxt.anchor.set(0.5);
      statusTxt.position.set(57.5, 11);
      statusPill.addChild(spBg, statusTxt);

      // Role Title
      const roleTxt = new Text({
        text: exp.role,
        style: {
          fontFamily: "system-ui, -apple-system, sans-serif",
          fontSize: 15,
          fontWeight: "900",
          fill: 0xffffff,
          wordWrap: true,
          wordWrapWidth: stationW - 32,
        },
      });
      roleTxt.position.set(-stationW / 2 + 16, -stationH / 2 + 46);

      // Company & Tech
      const compTxt = new Text({
        text: exp.company,
        style: {
          fontFamily: "system-ui, sans-serif",
          fontSize: 12.5,
          fontWeight: "700",
          fill: 0x93c5fd,
        },
      });
      compTxt.position.set(-stationW / 2 + 16, -stationH / 2 + 70);

      // Period
      const dateTxt = new Text({
        text: exp.period,
        style: {
          fontFamily: "system-ui, sans-serif",
          fontSize: 11.5,
          fontWeight: "600",
          fill: 0xfacc15,
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
          lineHeight: 15,
          wordWrap: true,
          wordWrapWidth: stationW - 32,
        },
      });
      previewTxt.position.set(-stationW / 2 + 16, -stationH / 2 + 114);

      // Inspect Call to Action
      const ctaBg = new Graphics()
        .roundRect(-stationW / 2 + 16, stationH / 2 - 38, stationW - 32, 26, 6)
        .fill({ color: exp.color, alpha: 0.25 })
        .stroke({ width: 1.5, color: exp.color });

      const ctaTxt = new Text({
        text: "VIEW FULL CAREER DOSSIER",
        style: {
          fontFamily: "system-ui, sans-serif",
          fontSize: 10,
          fontWeight: "900",
          fill: 0xffffff,
          letterSpacing: 0.8,
        },
      });
      ctaTxt.anchor.set(0.5);
      ctaTxt.position.set(0, stationH / 2 - 25);

      stationCont.addChild(
        sShadow,
        sBg,
        sStripe,
        statusPill,
        roleTxt,
        compTxt,
        dateTxt,
        previewTxt,
        ctaBg,
        ctaTxt,
      );

      stationCont.on("pointerover", () => {
        stationSpring.target = 1.06;
        sBg
          .clear()
          .roundRect(-stationW / 2, -stationH / 2, stationW, stationH, 16)
          .fill(0x131a2c)
          .stroke({ width: 3, color: 0xffffff });
      });

      stationCont.on("pointerout", () => {
        stationSpring.target = 1.0;
        sBg
          .clear()
          .roundRect(-stationW / 2, -stationH / 2, stationW, stationH, 16)
          .fill(0x0e1424)
          .stroke({ width: 2.5, color: exp.color });
      });

      stationCont.on("pointerdown", () => {
        stationSpring.set(0.94);
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

    // Moving timeline pulse light
    this.pulseGraphics = new Graphics();
    this.furnitureLayer.addChild(this.pulseGraphics);
    this.pulseProgress = 0;
  }

  inspectMilestone(exp) {
    const c = new Container();

    const title = new Text({
      text: exp.role,
      style: {
        fontFamily: "system-ui, -apple-system, sans-serif",
        fontSize: 17,
        fontWeight: "900",
        fill: exp.color,
      },
    });
    title.position.set(0, 0);

    const comp = new Text({
      text: `${exp.company}  ·  ${exp.period}`,
      style: {
        fontFamily: "system-ui, sans-serif",
        fontSize: 12,
        fontWeight: "800",
        fill: 0xfacc15,
        letterSpacing: 0.5,
      },
    });
    comp.position.set(0, 24);

    let by = 54;
    exp.bullets.forEach((b) => {
      const bCont = new Container();
      bCont.position.set(0, by);

      const dot = new Graphics().circle(6, 8, 3).fill(exp.color);

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
      color: exp.color,
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

    if (this.shaderFilter?.resources?.filterUniforms?.uniforms) {
      this.shaderFilter.resources.filterUniforms.uniforms.uTime =
        performance.now() * 0.001;
    }

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

    // Draw connecting bus lines between stations in the grid
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
          .stroke({ width: 1.5, color: 0x1f2b45, alpha: 0.8 });
      }

      // Traveling light pulse
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

        this.gridBusGraphics.circle(px, py, 4.5).fill(0xff6b6b);
      }
    }
  }
}
