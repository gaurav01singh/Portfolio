import { Container, Graphics, Text } from "pixi.js";
import { Room } from "./Room";
import { Spring } from "../utils/Juice";
import { PORTFOLIO } from "../data/portfolio";
import { createSkillsShader } from "../utils/RoomShaders";

export class SkillsRoom extends Room {
  constructor(app) {
    super(app, {
      accentColor: PORTFOLIO.skills.accentColor ?? 0xffb347,
      title: "Technology Reactor Core",
      type: "Reactor",
      icon: "",
    });
  }

  buildRoom() {
    const rw = this.roomWidth;
    const rh = this.roomHeight;
    const floorY = rh * 0.76;

    this.skillGroups = PORTFOLIO.skills.groups || [];

    // Attach Quantum Energy Flux Shader to background
    this.shaderFilter = createSkillsShader();
    if (this.shaderFilter) {
      this.backgroundLayer.filters = [this.shaderFilter];
    }

    // ============================================
    // 1. BACKGROUND: SCI-FI REACTOR BAY WALL
    // ============================================
    const wall = new Graphics();
    wall.rect(0, 0, rw, floorY).fill(0x0a0e18);

    for (let gx = 0; gx < rw; gx += 80) {
      wall
        .moveTo(gx, 0)
        .lineTo(gx, floorY)
        .stroke({ width: 1, color: 0x151d30, alpha: 0.6 });
    }
    for (let gy = 0; gy < floorY; gy += 60) {
      wall
        .moveTo(0, gy)
        .lineTo(rw, gy)
        .stroke({ width: 1, color: 0x151d30, alpha: 0.6 });
    }

    wall
      .moveTo(0, 40)
      .lineTo(rw * 0.4, 40)
      .lineTo(rw * 0.5, 75)
      .lineTo(rw * 0.6, 40)
      .lineTo(rw, 40)
      .stroke({ width: 3, color: 0x00f2fe, alpha: 0.5 });

    this.backgroundLayer.addChild(wall);

    // ============================================
    // 2. FLOOR: HEX REACTOR FLOOR
    // ============================================
    const floor = new Graphics();
    floor.rect(0, floorY, rw, rh - floorY).fill(0x101422);

    for (let fx = 0; fx < rw; fx += 70) {
      floor
        .moveTo(fx, floorY)
        .lineTo(fx - 40, rh)
        .stroke({ width: 1.5, color: 0x1c2438, alpha: 0.8 });
    }

    this.foregroundLayer.addChild(floor);

    // ============================================
    // 3. CENTRAL TECHNOLOGY REACTOR OBJECT
    // ============================================
    const centerX = rw * 0.5;
    const centerY = floorY * 0.52;

    this.reactorCenterX = centerX;
    this.reactorCenterY = centerY;

    this.reactorWireGraphics = new Graphics();
    this.furnitureLayer.addChild(this.reactorWireGraphics);

    this.reactorRingsGraphics = new Graphics();
    this.furnitureLayer.addChild(this.reactorRingsGraphics);

    this.coreCont = new Container();
    this.coreCont.position.set(centerX, centerY);
    this.coreCont.eventMode = "static";
    this.coreCont.cursor = "pointer";

    const coreGlow = new Graphics()
      .circle(0, 0, 72)
      .fill({ color: 0xffb347, alpha: 0.15 });

    const coreBase = new Graphics()
      .circle(0, 0, 60)
      .fill(0x0e1424)
      .stroke({ width: 3.5, color: 0xffb347 });

    const coreInner = new Graphics()
      .circle(0, 0, 46)
      .fill(0x162238)
      .stroke({ width: 2, color: 0x00f2fe, alpha: 0.85 });

    const coreTitle = new Text({
      text: "SKILLS",
      style: {
        fontFamily: "system-ui, -apple-system, sans-serif",
        fontSize: 15,
        fontWeight: "900",
        fill: 0xffffff,
        letterSpacing: 2,
      },
    });
    coreTitle.anchor.set(0.5);
    coreTitle.position.set(0, -7);

    const coreSub = new Text({
      text: "TECH CORE",
      style: {
        fontFamily: "system-ui, sans-serif",
        fontSize: 10,
        fontWeight: "800",
        fill: 0xffb347,
        letterSpacing: 1.5,
      },
    });
    coreSub.anchor.set(0.5);
    coreSub.position.set(0, 12);

    this.coreCont.addChild(coreGlow, coreBase, coreInner, coreTitle, coreSub);

    // Floating Badge above Reactor
    const coreBadge = new Container();
    coreBadge.position.set(0, -84);

    const cbTxt = new Text({
      text: "TECH REACTOR",
      style: {
        fontFamily: "system-ui, sans-serif",
        fontSize: 12,
        fontWeight: "900",
        fill: 0xffb347,
        letterSpacing: 1,
      },
    });
    cbTxt.anchor.set(0.5);

    const cbW = Math.max(140, cbTxt.width + 36);
    const cbBg = new Graphics()
      .roundRect(-cbW / 2, -16, cbW, 32, 8)
      .fill({ color: 0x090c16, alpha: 0.95 })
      .stroke({ width: 2, color: 0xffb347 });

    coreBadge.addChild(cbBg, cbTxt);
    this.coreCont.addChild(coreBadge);

    this.coreSpring = new Spring(1.0, 240, 14);

    this.coreCont.on("pointerover", () => {
      this.coreSpring.target = 1.1;
      cbTxt.style.fill = 0xffffff;
    });

    this.coreCont.on("pointerout", () => {
      this.coreSpring.target = 1.0;
      cbTxt.style.fill = 0xffb347;
    });

    this.coreCont.on("pointertap", () => {
      this.inspectFullSkillStack();
    });

    this.furnitureLayer.addChild(this.coreCont);

    // ============================================
    // 4. GENERATE SATELLITE TECHNOLOGY NODES
    // ============================================
    this.techNodes = [];
    const allFlatNodes = [];

    this.skillGroups.forEach((group) => {
      group.nodes.forEach((node) => {
        allFlatNodes.push({
          ...node,
          category: group.category,
          color: group.color,
        });
      });
    });

    const totalNodes = allFlatNodes.length;
    const radiusX = Math.min(rw * 0.43, 440);
    const radiusY = Math.min(floorY * 0.45, 220);

    allFlatNodes.forEach((node, idx) => {
      const angle = (idx / totalNodes) * Math.PI * 2 - Math.PI / 2;
      const nx = centerX + Math.cos(angle) * radiusX;
      const ny = centerY + Math.sin(angle) * radiusY;

      const nodeCont = new Container();
      nodeCont.position.set(nx, ny);
      nodeCont.eventMode = "static";
      nodeCont.cursor = "pointer";

      const nodeSpring = new Spring(1.0, 260, 14);

      const nTxt = new Text({
        text: node.name,
        style: {
          fontFamily: "system-ui, -apple-system, sans-serif",
          fontSize: 12.5,
          fontWeight: "800",
          fill: 0xffffff,
          letterSpacing: 0.5,
        },
      });
      nTxt.anchor.set(0.5);

      const pillW = Math.max(84, nTxt.width + 26);
      const pillH = 32;

      const nGlow = new Graphics()
        .roundRect(-pillW / 2 - 4, -pillH / 2 - 4, pillW + 8, pillH + 8, 10)
        .fill({ color: node.color, alpha: 0.22 });

      const nBg = new Graphics()
        .roundRect(-pillW / 2, -pillH / 2, pillW, pillH, 8)
        .fill(0x0e1424)
        .stroke({ width: 2, color: node.color });

      nodeCont.addChild(nGlow, nBg, nTxt);

      nodeCont.on("pointerover", () => {
        nodeSpring.target = 1.18;
        nBg
          .clear()
          .roundRect(-pillW / 2, -pillH / 2, pillW, pillH, 8)
          .fill(node.color)
          .stroke({ width: 2, color: 0xffffff });
        nTxt.style.fill = 0x05070e;
        this.activeHoverNode = node;
      });

      nodeCont.on("pointerout", () => {
        nodeSpring.target = 1.0;
        nBg
          .clear()
          .roundRect(-pillW / 2, -pillH / 2, pillW, pillH, 8)
          .fill(0x0e1424)
          .stroke({ width: 2, color: node.color });
        nTxt.style.fill = 0xffffff;
        if (this.activeHoverNode === node) {
          this.activeHoverNode = null;
        }
      });

      nodeCont.on("pointerdown", () => {
        nodeSpring.set(0.9);
      });

      nodeCont.on("pointertap", () => {
        this.inspectSpecificNode(node);
      });

      this.furnitureLayer.addChild(nodeCont);
      this.techNodes.push({
        container: nodeCont,
        spring: nodeSpring,
        x: nx,
        y: ny,
        node,
      });
    });

    this.sparks = [];
    for (let s = 0; s < 12; s++) {
      this.sparks.push({
        nodeIdx: Math.floor(Math.random() * this.techNodes.length),
        progress: Math.random(),
        speed: 0.006 + Math.random() * 0.008,
      });
    }
  }

  inspectFullSkillStack() {
    const c = new Container();

    const title = new Text({
      text: "Technology Stack & Core Competencies",
      style: {
        fontFamily: "system-ui, sans-serif",
        fontSize: 16.5,
        fontWeight: "900",
        fill: 0xffb347,
      },
    });
    title.position.set(0, 0);

    const desc = new Text({
      text: "Gaurav's technology reactor combines real-time game engines, graphics rendering, full-stack web frameworks, and high-performance desktop architecture:",
      style: {
        fontFamily: "system-ui, sans-serif",
        fontSize: 13,
        fill: 0xd0d7de,
        lineHeight: 19,
        wordWrap: true,
        wordWrapWidth: 500,
      },
    });
    desc.position.set(0, 26);

    let cy = desc.y + desc.height + 16;
    this.skillGroups.forEach((group) => {
      const gCont = new Container();
      gCont.position.set(0, cy);

      const gLabel = new Text({
        text: group.category.toUpperCase(),
        style: {
          fontFamily: "system-ui, sans-serif",
          fontSize: 12.5,
          fontWeight: "900",
          fill: group.color,
          letterSpacing: 1,
        },
      });
      gLabel.position.set(0, 0);

      const tags = group.nodes.map((n) => n.name).join("  •  ");
      const gTags = new Text({
        text: tags,
        style: {
          fontFamily: "system-ui, sans-serif",
          fontSize: 12,
          fontWeight: "600",
          fill: 0xffffff,
          lineHeight: 18,
          wordWrap: true,
          wordWrapWidth: 490,
        },
      });
      gTags.position.set(0, 20);

      gCont.addChild(gLabel, gTags);
      c.addChild(gCont);
      cy += gTags.y + gTags.height + 16;
    });

    this.showInspector({
      title: "Technology Stack Dossier",
      icon: "",
      color: 0xffb347,
      width: 550,
      x: (this.roomWidth - 550) / 2,
      y: 60,
      content: c,
    });
  }

  inspectSpecificNode(node) {
    const c = new Container();

    const title = new Text({
      text: `${node.name} — ${node.category}`,
      style: {
        fontFamily: "system-ui, sans-serif",
        fontSize: 17,
        fontWeight: "900",
        fill: node.color,
      },
    });
    title.position.set(0, 0);

    const cat = new Text({
      text: `CATEGORY: ${node.category}`,
      style: {
        fontFamily: "system-ui, sans-serif",
        fontSize: 11.5,
        fontWeight: "800",
        fill: 0xfacc15,
        letterSpacing: 1,
      },
    });
    cat.position.set(0, 24);

    const desc = new Text({
      text: node.desc,
      style: {
        fontFamily: "system-ui, sans-serif",
        fontSize: 13,
        fill: 0xd0d7de,
        lineHeight: 19,
        wordWrap: true,
        wordWrapWidth: 490,
      },
    });
    desc.position.set(0, 48);

    const practical = new Text({
      text: `Production Experience: Utilized in Gaurav's commercial titles & interactive systems at Binaire / Qwcodes.`,
      style: {
        fontFamily: "system-ui, sans-serif",
        fontSize: 12,
        fontWeight: "bold",
        fill: 0x38bdf8,
        wordWrap: true,
        wordWrapWidth: 490,
        lineHeight: 18,
      },
    });
    practical.position.set(0, desc.y + desc.height + 14);

    c.addChild(title, cat, desc, practical);

    this.showInspector({
      title: node.name,
      icon: "",
      color: node.color,
      width: 550,
      x: (this.roomWidth - 550) / 2,
      y: 85,
      content: c,
    });
  }

  update(delta) {
    if (this.destroyed) return;
    super.update(delta);
    if (this.destroyed || this.isClosing) return;

    const dt = (delta || 1) * 0.016;
    const t = performance.now() * 0.002;

    if (this.shaderFilter?.resources?.filterUniforms?.uniforms) {
      this.shaderFilter.resources.filterUniforms.uniforms.uTime =
        performance.now() * 0.001;
    }

    if (
      this.coreSpring &&
      this.coreCont &&
      !this.coreCont.destroyed &&
      this.coreCont.scale &&
      typeof this.coreCont.scale.set === "function"
    ) {
      const cs = this.coreSpring.update(dt);
      this.coreCont.scale.set(cs);
    }

    if (this.techNodes && Array.isArray(this.techNodes)) {
      this.techNodes.forEach((tn) => {
        if (
          tn &&
          tn.spring &&
          tn.container &&
          !tn.container.destroyed &&
          tn.container.scale &&
          typeof tn.container.scale.set === "function"
        ) {
          const s = tn.spring.update(dt);
          tn.container.scale.set(s);
        }
      });
    }

    const cx = this.reactorCenterX;
    const cy = this.reactorCenterY;

    if (
      this.reactorWireGraphics &&
      !this.reactorWireGraphics.destroyed &&
      this.reactorWireGraphics.context
    ) {
      this.reactorWireGraphics.clear();

      if (this.techNodes) {
        this.techNodes.forEach((tn) => {
          const isHovered = this.activeHoverNode === tn.node;
          this.reactorWireGraphics
            .moveTo(cx, cy)
            .lineTo(tn.x, tn.y)
            .stroke({
              width: isHovered ? 2.5 : 1,
              color: isHovered ? 0xffffff : tn.node.color,
              alpha: isHovered ? 0.9 : 0.35,
            });
        });
      }

      if (this.sparks && this.techNodes.length > 0) {
        this.sparks.forEach((sp) => {
          sp.progress += sp.speed * delta;
          if (sp.progress >= 1) {
            sp.progress = 0;
            sp.nodeIdx = Math.floor(Math.random() * this.techNodes.length);
          }

          const targetNode = this.techNodes[sp.nodeIdx];
          if (targetNode) {
            const sx = cx + (targetNode.x - cx) * sp.progress;
            const sy = cy + (targetNode.y - cy) * sp.progress;
            this.reactorWireGraphics
              .circle(sx, sy, 3)
              .fill(targetNode.node.color);
          }
        });
      }
    }

    if (
      this.reactorRingsGraphics &&
      !this.reactorRingsGraphics.destroyed &&
      this.reactorRingsGraphics.context
    ) {
      this.reactorRingsGraphics.clear();

      const ringRadius = 82;
      this.reactorRingsGraphics
        .circle(cx, cy, ringRadius)
        .stroke({ width: 1.5, color: 0x00f2fe, alpha: 0.5 });

      for (let i = 0; i < 16; i++) {
        const angle = (i / 16) * Math.PI * 2 + t * 0.5;
        const x1 = cx + Math.cos(angle) * (ringRadius - 5);
        const y1 = cy + Math.sin(angle) * (ringRadius - 5);
        const x2 = cx + Math.cos(angle) * (ringRadius + 5);
        const y2 = cy + Math.sin(angle) * (ringRadius + 5);
        this.reactorRingsGraphics
          .moveTo(x1, y1)
          .lineTo(x2, y2)
          .stroke({ width: 2, color: 0x00f2fe, alpha: 0.7 });
      }

      const midRadius = 102;
      this.reactorRingsGraphics
        .circle(cx, cy, midRadius)
        .stroke({ width: 1, color: 0xffb347, alpha: 0.4 });

      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2 - t * 0.4;
        const x1 = cx + Math.cos(angle) * (midRadius - 4);
        const y1 = cy + Math.sin(angle) * (midRadius - 4);
        const x2 = cx + Math.cos(angle) * (midRadius + 4);
        const y2 = cy + Math.sin(angle) * (midRadius + 4);
        this.reactorRingsGraphics
          .moveTo(x1, y1)
          .lineTo(x2, y2)
          .stroke({ width: 2, color: 0xffb347, alpha: 0.8 });
      }
    }
  }
}
