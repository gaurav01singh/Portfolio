import { Container, Graphics, Text } from "pixi.js";
import { Room } from "./Room";
import { Spring } from "../utils/Juice";
import { PORTFOLIO } from "../data/portfolio";
import { createEducationShader } from "../utils/RoomShaders";

export class EducationRoom extends Room {
  constructor(app) {
    super(app, {
      accentColor: PORTFOLIO.education.accentColor ?? 0x9775fa,
      title: "Digital Knowledge Archive",
      type: "Archive",
      icon: "",
    });
  }

  buildRoom() {
    const rw = this.roomWidth;
    const rh = this.roomHeight;
    const floorY = rh * 0.76;

    this.degree = PORTFOLIO.education.degree || {};
    this.coursework = PORTFOLIO.education.coursework || [];
    this.certificates = PORTFOLIO.education.certificates || [];

    // Attach Celestial Knowledge Nebula Shader
    this.shaderFilter = createEducationShader();
    if (this.shaderFilter) {
      this.backgroundLayer.filters = [this.shaderFilter];
    }

    // ============================================
    // 1. BACKGROUND: VAULT WALL & HOLOGRAPHIC RAYS
    // ============================================
    const wall = new Graphics();
    wall.rect(0, 0, rw, floorY).fill(0x0c0b16);

    for (let ax = rw * 0.1; ax < rw * 0.9; ax += 140) {
      wall
        .moveTo(ax, floorY)
        .lineTo(ax, 60)
        .bezierCurveTo(ax, 20, ax + 100, 20, ax + 100, 60)
        .lineTo(ax + 100, floorY)
        .stroke({ width: 1.5, color: 0x241b38, alpha: 0.6 });
    }

    this.backgroundLayer.addChild(wall);

    // ============================================
    // 2. CENTRAL DEGREE KNOWLEDGE CORE OBJECT
    // ============================================
    const degCenterX = rw * 0.5;
    const degCenterY = floorY * 0.44;
    this.degreeCenterX = degCenterX;
    this.degreeCenterY = degCenterY;

    this.archiveRingsGfx = new Graphics();
    this.furnitureLayer.addChild(this.archiveRingsGfx);

    const floor = new Graphics();
    floor.rect(0, floorY, rw, rh - floorY).fill(0x131020);

    for (let fx = 0; fx < rw; fx += 80) {
      floor
        .moveTo(fx, floorY)
        .lineTo(fx - 50, rh)
        .stroke({ width: 1.5, color: 0x201a35, alpha: 0.8 });
    }

    this.foregroundLayer.addChild(floor);

    const degW = Math.min(320, rw * 0.34);
    const degH = 220;
    const degX = degCenterX;
    const degY = degCenterY;

    const degCont = new Container();
    degCont.position.set(degX, degY);
    degCont.eventMode = "static";
    degCont.cursor = "pointer";

    const degSpring = new Spring(1.0, 240, 14);

    const dShadow = new Graphics()
      .roundRect(-degW / 2 + 8, -degH / 2 + 10, degW, degH, 16)
      .fill({ color: 0x000000, alpha: 0.6 });

    const dBg = new Graphics()
      .roundRect(-degW / 2, -degH / 2, degW, degH, 16)
      .fill(0x100e20)
      .stroke({ width: 3, color: 0x9775fa });

    const dStripe = new Graphics()
      .roundRect(-degW / 2, -degH / 2, degW, 6, 3)
      .fill(0x9775fa);

    const dTitle = new Text({
      text: "B.TECH IN COMPUTER SCIENCE\n& ENGINEERING",
      style: {
        fontFamily: "system-ui, -apple-system, sans-serif",
        fontSize: 14,
        fontWeight: "900",
        fill: 0xffffff,
        align: "center",
        lineHeight: 19,
      },
    });
    dTitle.anchor.set(0.5);
    dTitle.position.set(0, -degH / 2 + 48);

    const dUni = new Text({
      text: "Dr. A.P.J Abdul Kalam Technical Univ.",
      style: {
        fontFamily: "system-ui, sans-serif",
        fontSize: 12,
        fontWeight: "700",
        fill: 0x9775fa,
      },
    });
    dUni.anchor.set(0.5);
    dUni.position.set(0, -degH / 2 + 90);

    const dPeriod = new Text({
      text: "2021 — 2025 · Graduated",
      style: {
        fontFamily: "system-ui, sans-serif",
        fontSize: 11.5,
        fill: 0xabbcd5,
      },
    });
    dPeriod.anchor.set(0.5);
    dPeriod.position.set(0, -degH / 2 + 114);

    // CGPA Highlight Metric Chip
    const cgpaBox = new Container();
    cgpaBox.position.set(0, degH / 2 - 28);

    const cBg = new Graphics()
      .roundRect(-85, -14, 170, 28, 8)
      .fill(0x231a3d)
      .stroke({ width: 1.5, color: 0xfacc15 });

    const cTxt = new Text({
      text: "CGPA: 7.0 / 10.0",
      style: {
        fontFamily: "system-ui, sans-serif",
        fontSize: 12,
        fontWeight: "900",
        fill: 0xfacc15,
      },
    });
    cTxt.anchor.set(0.5);

    cgpaBox.addChild(cBg, cTxt);

    degCont.addChild(dShadow, dBg, dStripe, dTitle, dUni, dPeriod, cgpaBox);

    degCont.on("pointerover", () => {
      degSpring.target = 1.08;
      dBg
        .clear()
        .roundRect(-degW / 2, -degH / 2, degW, degH, 16)
        .fill(0x1c1536)
        .stroke({ width: 3, color: 0xffffff });
    });

    degCont.on("pointerout", () => {
      degSpring.target = 1.0;
      dBg
        .clear()
        .roundRect(-degW / 2, -degH / 2, degW, degH, 16)
        .fill(0x130f24)
        .stroke({ width: 3, color: 0x9775fa });
    });

    degCont.on("pointerdown", () => {
      degSpring.set(0.92);
    });

    degCont.on("pointertap", () => {
      this.inspectDegree();
    });

    this.furnitureLayer.addChild(degCont);
    this.degreeObject = { container: degCont, spring: degSpring };

    // 2. FLOATING CS COURSEWORK ARCHIVE (Left)
    const courseW = Math.min(270, rw * 0.28);
    const courseH = 185;
    const courseX = rw * 0.18;
    const courseY = degY;

    const courseCont = new Container();
    courseCont.position.set(courseX, courseY);
    courseCont.eventMode = "static";
    courseCont.cursor = "pointer";

    const courseSpring = new Spring(1.0, 260, 14);

    const cwShadow = new Graphics()
      .roundRect(-courseW / 2 + 6, -courseH / 2 + 8, courseW, courseH, 14)
      .fill({ color: 0x000000, alpha: 0.6 });

    const cwBg = new Graphics()
      .roundRect(-courseW / 2, -courseH / 2, courseW, courseH, 14)
      .fill(0x0e1322)
      .stroke({ width: 2.5, color: 0xfacc15 });

    const cwStripe = new Graphics()
      .roundRect(-courseW / 2, -courseH / 2, courseW, 5, 2)
      .fill(0xfacc15);

    const cwHead = new Text({
      text: "CS COURSEWORK",
      style: {
        fontFamily: "system-ui, sans-serif",
        fontSize: 12.5,
        fontWeight: "900",
        fill: 0xfacc15,
        letterSpacing: 1,
      },
    });
    cwHead.position.set(-courseW / 2 + 14, -courseH / 2 + 14);

    courseCont.addChild(cwShadow, cwBg, cwStripe, cwHead);

    let cy = -courseH / 2 + 40;
    this.coursework.slice(0, 4).forEach((cw) => {
      const row = new Container();
      row.position.set(-courseW / 2 + 14, cy);

      const dot = new Graphics().circle(4, 7, 3).fill(0xfacc15);

      const rTxt = new Text({
        text: cw.name,
        style: {
          fontFamily: "system-ui, sans-serif",
          fontSize: 11.5,
          fontWeight: "700",
          fill: 0xffffff,
        },
      });
      rTxt.position.set(12, 0);

      row.addChild(dot, rTxt);
      courseCont.addChild(row);
      cy += 24;
    });

    const cwCta = new Text({
      text: "CLICK TO VIEW ALL (6)",
      style: {
        fontFamily: "system-ui, sans-serif",
        fontSize: 10.5,
        fontWeight: "900",
        fill: 0xfacc15,
      },
    });
    cwCta.position.set(-courseW / 2 + 14, courseH / 2 - 24);
    courseCont.addChild(cwCta);

    courseCont.on("pointerover", () => {
      courseSpring.target = 1.08;
    });
    courseCont.on("pointerout", () => {
      courseSpring.target = 1.0;
    });
    courseCont.on("pointertap", () => {
      this.inspectCoursework();
    });

    this.furnitureLayer.addChild(courseCont);
    this.courseObject = { container: courseCont, spring: courseSpring };

    // 3. FLOATING CERTIFICATES VAULT (Right)
    const certW = Math.min(270, rw * 0.28);
    const certH = 185;
    const certX = rw * 0.82;
    const certY = degY;

    const certCont = new Container();
    certCont.position.set(certX, certY);
    certCont.eventMode = "static";
    certCont.cursor = "pointer";

    const certSpring = new Spring(1.0, 260, 14);

    const ctShadow = new Graphics()
      .roundRect(-certW / 2 + 6, -certH / 2 + 8, certW, certH, 14)
      .fill({ color: 0x000000, alpha: 0.6 });

    const ctBg = new Graphics()
      .roundRect(-certW / 2, -certH / 2, certW, certH, 14)
      .fill(0x0e1322)
      .stroke({ width: 2.5, color: 0x38bdf8 });

    const ctStripe = new Graphics()
      .roundRect(-certW / 2, -certH / 2, certW, 5, 2)
      .fill(0x38bdf8);

    const ctHead = new Text({
      text: "VERIFIED CERTIFICATES",
      style: {
        fontFamily: "system-ui, sans-serif",
        fontSize: 12.5,
        fontWeight: "900",
        fill: 0x38bdf8,
        letterSpacing: 1,
      },
    });
    ctHead.position.set(-certW / 2 + 14, -certH / 2 + 14);

    certCont.addChild(ctShadow, ctBg, ctStripe, ctHead);

    let rcy = -certH / 2 + 40;
    this.certificates.forEach((cert) => {
      const cRow = new Container();
      cRow.position.set(-certW / 2 + 14, rcy);

      const nTxt = new Text({
        text: cert.title,
        style: {
          fontFamily: "system-ui, sans-serif",
          fontSize: 12,
          fontWeight: "800",
          fill: 0xffffff,
        },
      });

      const sTxt = new Text({
        text: `${cert.issuer} · ${cert.period}`,
        style: {
          fontFamily: "system-ui, sans-serif",
          fontSize: 10.5,
          fontWeight: "600",
          fill: cert.color,
        },
      });
      sTxt.position.set(0, 18);

      cRow.addChild(nTxt, sTxt);
      certCont.addChild(cRow);
      rcy += 44;
    });

    const ctCta = new Text({
      text: "CLICK TO VIEW DETAILS",
      style: {
        fontFamily: "system-ui, sans-serif",
        fontSize: 10.5,
        fontWeight: "900",
        fill: 0x38bdf8,
      },
    });
    ctCta.position.set(-certW / 2 + 14, certH / 2 - 24);
    certCont.addChild(ctCta);

    certCont.on("pointerover", () => {
      certSpring.target = 1.08;
    });
    certCont.on("pointerout", () => {
      certSpring.target = 1.0;
    });
    certCont.on("pointertap", () => {
      this.inspectCertificates();
    });

    this.furnitureLayer.addChild(certCont);
    this.certObject = { container: certCont, spring: certSpring };
  }

  inspectDegree() {
    const c = new Container();

    const title = new Text({
      text: "B.Tech in Computer Science & Engineering",
      style: {
        fontFamily: "system-ui, -apple-system, sans-serif",
        fontSize: 17.5,
        fontWeight: "900",
        fill: 0x9775fa,
      },
    });
    title.position.set(0, 0);

    const uni = new Text({
      text: "Dr. A.P.J Abdul Kalam Technical University (AKTU)",
      style: {
        fontFamily: "system-ui, sans-serif",
        fontSize: 13.5,
        fontWeight: "bold",
        fill: 0xfacc15,
      },
    });
    uni.position.set(0, 26);

    const meta = new Text({
      text: "Oct 2021 – Jun 2025  ·  Cumulative Academic Score: CGPA 7.0 / 10.0",
      style: {
        fontFamily: "system-ui, sans-serif",
        fontSize: 12.5,
        fontWeight: "600",
        fill: 0xffffff,
      },
    });
    meta.position.set(0, 52);

    const desc = new Text({
      text: "Comprehensive 4-year engineering curriculum focused on Object-Oriented Programming, Data Structures & Algorithms, Database Architecture, and Operating Systems.\n\nGraduated in 2025 with strong problem-solving skills, deep game engine physics understanding, and real-time interactive development experience.",
      style: {
        fontFamily: "system-ui, sans-serif",
        fontSize: 13,
        fill: 0xd0d7de,
        lineHeight: 19,
        wordWrap: true,
        wordWrapWidth: 500,
      },
    });
    desc.position.set(0, 80);

    c.addChild(title, uni, meta, desc);

    this.showInspector({
      title: "University Degree Dossier",
      icon: "",
      color: 0x9775fa,
      width: 550,
      x: (this.roomWidth - 550) / 2,
      y: 80,
      content: c,
    });
  }

  inspectCoursework() {
    const c = new Container();

    const title = new Text({
      text: "Core Computer Science Disciplines",
      style: {
        fontFamily: "system-ui, -apple-system, sans-serif",
        fontSize: 17,
        fontWeight: "900",
        fill: 0xfacc15,
      },
    });
    title.position.set(0, 0);

    let cy = 30;
    this.coursework.forEach((cw) => {
      const row = new Container();
      row.position.set(0, cy);

      const nTxt = new Text({
        text: cw.name,
        style: {
          fontFamily: "system-ui, sans-serif",
          fontSize: 13,
          fontWeight: "bold",
          fill: 0xffffff,
        },
      });

      const dTxt = new Text({
        text: cw.desc,
        style: {
          fontFamily: "system-ui, sans-serif",
          fontSize: 12,
          fill: 0x94a3b8,
          lineHeight: 16,
          wordWrap: true,
          wordWrapWidth: 500,
        },
      });
      dTxt.position.set(0, 18);

      row.addChild(nTxt, dTxt);
      c.addChild(row);
      cy += 46;
    });

    this.showInspector({
      title: "CS Disciplines Archive",
      icon: "",
      color: 0xfacc15,
      width: 550,
      x: (this.roomWidth - 550) / 2,
      y: 80,
      content: c,
    });
  }

  inspectCertificates() {
    const c = new Container();

    const title = new Text({
      text: "Verified Industry Training & Internships",
      style: {
        fontFamily: "system-ui, -apple-system, sans-serif",
        fontSize: 17,
        fontWeight: "900",
        fill: 0x38bdf8,
      },
    });
    title.position.set(0, 0);

    let cy = 30;
    this.certificates.forEach((cert) => {
      const row = new Container();
      row.position.set(0, cy);

      const nTxt = new Text({
        text: `${cert.title} — ${cert.issuer}`,
        style: {
          fontFamily: "system-ui, sans-serif",
          fontSize: 13.5,
          fontWeight: "bold",
          fill: cert.color,
        },
      });

      const pTxt = new Text({
        text: cert.period,
        style: {
          fontFamily: "system-ui, sans-serif",
          fontSize: 11.5,
          fontWeight: "600",
          fill: 0xfacc15,
        },
      });
      pTxt.position.set(0, 20);

      const dTxt = new Text({
        text: cert.desc,
        style: {
          fontFamily: "system-ui, sans-serif",
          fontSize: 12.5,
          fill: 0xd0d7de,
          lineHeight: 18,
          wordWrap: true,
          wordWrapWidth: 500,
        },
      });
      dTxt.position.set(0, 40);

      row.addChild(nTxt, pTxt, dTxt);
      c.addChild(row);
      cy += 90;
    });

    this.showInspector({
      title: "Verified Credentials Showcase",
      icon: "",
      color: 0x38bdf8,
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
    const t = performance.now() * 0.002;

    if (this.shaderFilter?.resources?.filterUniforms?.uniforms) {
      this.shaderFilter.resources.filterUniforms.uniforms.uTime =
        performance.now() * 0.001;
    }

    if (
      this.degreeObject &&
      this.degreeObject.container &&
      !this.degreeObject.container.destroyed &&
      this.degreeObject.container.scale &&
      typeof this.degreeObject.container.scale.set === "function"
    ) {
      const s = this.degreeObject.spring.update(dt);
      this.degreeObject.container.scale.set(s);
    }
    if (
      this.courseObject &&
      this.courseObject.container &&
      !this.courseObject.container.destroyed &&
      this.courseObject.container.scale &&
      typeof this.courseObject.container.scale.set === "function"
    ) {
      const s = this.courseObject.spring.update(dt);
      this.courseObject.container.scale.set(s);
    }
    if (
      this.certObject &&
      this.certObject.container &&
      !this.certObject.container.destroyed &&
      this.certObject.container.scale &&
      typeof this.certObject.container.scale.set === "function"
    ) {
      const s = this.certObject.spring.update(dt);
      this.certObject.container.scale.set(s);
    }

    if (
      this.archiveRingsGfx &&
      !this.archiveRingsGfx.destroyed &&
      this.archiveRingsGfx.context
    ) {
      const cx = this.degreeCenterX;
      const cy = this.degreeCenterY;

      this.archiveRingsGfx.clear();

      const r1 = 130;
      this.archiveRingsGfx
        .circle(cx, cy, r1)
        .stroke({ width: 1.5, color: 0x9775fa, alpha: 0.35 });

      for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI * 2 + t * 0.4;
        const x = cx + Math.cos(angle) * r1;
        const y = cy + Math.sin(angle) * r1;
        this.archiveRingsGfx.circle(x, y, 2.5).fill(0x9775fa);
      }
    }
  }
}
