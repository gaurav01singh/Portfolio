import { Container, Graphics, Text } from "pixi.js";
import { Spring } from "../utils/Juice";

export class Room extends Container {
  constructor(app, options = {}) {
    super();

    this.app = app;
    this.options = options;
    this.onClose = null;

    this.screenWidth = this.app.screen.width;
    this.screenHeight = this.app.screen.height;

    this.accentColor = options.accentColor ?? 0x3ecf8e;
    this.roomTitle = options.title ?? "Room";
    this.roomType = options.type ?? "Studio";
    this.icon = options.icon ?? "🏛️";

    // Room boundaries
    this.roomWidth = this.screenWidth;
    this.roomHeight = this.screenHeight;
    this.floorY = this.roomHeight * 0.76;

    // Spring physics for room entrance & inspection popups
    this.roomScaleSpring = new Spring(0.85, 180, 14);
    this.roomScaleSpring.target = 1.0;
    this.roomAlphaSpring = new Spring(0, 140, 16);
    this.roomAlphaSpring.target = 1.0;

    this.isClosing = false;
    this.props = [];
    this.activeInspector = null;

    this.buildBase();
    this.buildRoom();
  }

  buildBase() {
    this.eventMode = "static";

    // 1. Dark Backdrop Vignette
    this.backdrop = new Graphics()
      .rect(0, 0, this.screenWidth, this.screenHeight)
      .fill(0x060810);
    this.addChild(this.backdrop);

    // 2. Main Room Stage Container
    this.roomStage = new Container();
    this.roomStage.position.set(this.screenWidth / 2, this.screenHeight / 2);
    this.roomStage.pivot.set(this.roomWidth / 2, this.roomHeight / 2);
    this.roomStage.scale.set(this.roomScaleSpring.value);
    this.roomStage.alpha = this.roomAlphaSpring.value;
    this.addChild(this.roomStage);

    // Room Layers for Depth & Parallax
    this.backgroundLayer = new Container();
    this.ambientLightLayer = new Container();
    this.furnitureLayer = new Container();
    this.characterLayer = new Container();
    this.foregroundLayer = new Container();
    this.uiLayer = new Container();

    this.roomStage.addChild(
      this.backgroundLayer,
      this.ambientLightLayer,
      this.furnitureLayer,
      this.characterLayer,
      this.foregroundLayer,
      this.uiLayer,
    );

    // 3. Top Room Header Banner
    this.createRoomHUD();

    // 4. Exit Door / Close Button
    this.createExitControls();
  }

  createRoomHUD() {
    this.hudContainer = new Container();
    this.hudContainer.position.set(24, 20);

    const hudBg = new Graphics()
      .roundRect(0, 0, 390, 52, 10)
      .fill({ color: 0x090c16, alpha: 0.94 })
      .stroke({ width: 2, color: this.accentColor, alpha: 0.85 });

    const titleTxt = new Text({
      text: this.roomTitle.toUpperCase(),
      style: {
        fontFamily: "system-ui, -apple-system, sans-serif",
        fontSize: 14.5,
        fontWeight: "900",
        fill: 0xffffff,
        letterSpacing: 1.2,
      },
    });
    titleTxt.position.set(20, 10);

    const hintTxt = new Text({
      text: "Click any object to inspect details",
      style: {
        fontFamily: "system-ui, sans-serif",
        fontSize: 11.5,
        fontWeight: "bold",
        fill: this.accentColor,
      },
    });
    hintTxt.position.set(20, 30);

    this.hudContainer.addChild(hudBg, titleTxt, hintTxt);
    this.uiLayer.addChild(this.hudContainer);
  }

  createExitControls() {
    this.exitBtn = new Container();
    this.exitBtn.position.set(this.roomWidth - 150, 20);
    this.exitBtn.eventMode = "static";
    this.exitBtn.cursor = "pointer";

    this.exitSpring = new Spring(1.0, 240, 14);

    const exitBg = new Graphics()
      .roundRect(0, 0, 130, 50, 12)
      .fill({ color: 0x1a1218, alpha: 0.94 })
      .stroke({ width: 2, color: 0xef4444, alpha: 0.9 });

    const exitTxt = new Text({
      text: "EXIT [ESC]",
      style: {
        fontFamily: "system-ui, sans-serif",
        fontSize: 13,
        fontWeight: "900",
        fill: 0xff8fa3,
        letterSpacing: 1,
      },
    });
    exitTxt.anchor.set(0.5);
    exitTxt.position.set(65, 25);

    this.exitBtn.addChild(exitBg, exitTxt);

    this.exitBtn.on("pointerover", () => {
      this.exitSpring.target = 1.08;
      exitBg
        .clear()
        .roundRect(0, 0, 130, 50, 12)
        .fill(0xef4444)
        .stroke({ width: 2, color: 0xffffff });
      exitTxt.style.fill = 0xffffff;
    });

    this.exitBtn.on("pointerout", () => {
      this.exitSpring.target = 1.0;
      exitBg
        .clear()
        .roundRect(0, 0, 130, 50, 12)
        .fill({ color: 0x1a1218, alpha: 0.94 })
        .stroke({ width: 2, color: 0xef4444, alpha: 0.9 });
      exitTxt.style.fill = 0xff8fa3;
    });

    this.exitBtn.on("pointerdown", () => {
      this.exitSpring.set(0.88);
    });

    this.exitBtn.on("pointertap", () => {
      this.close();
    });

    this.uiLayer.addChild(this.exitBtn);
  }

  buildRoom() {}

  // Helper: Register an interactive prop / furniture with hover indicator & inspector
  addInteractiveProp(options) {
    const propCont = new Container();
    propCont.position.set(options.x, options.y);
    propCont.eventMode = "static";
    propCont.cursor = "pointer";

    const gfxHolder = new Container();
    propCont.addChild(gfxHolder);

    if (options.graphics) {
      gfxHolder.addChild(options.graphics);
    }

    const badge = new Container();
    const badgeY = options.badgeY ?? -28;
    badge.position.set(options.badgeX ?? 0, badgeY);

    const bTxt = new Text({
      text: options.label ?? "INSPECT",
      style: {
        fontFamily: "system-ui, -apple-system, sans-serif",
        fontSize: 11.5,
        fontWeight: "900",
        fill: options.color ?? this.accentColor,
        letterSpacing: 0.8,
      },
    });
    bTxt.anchor.set(0.5);

    const badgeW = Math.max(120, bTxt.width + 26);
    const badgeH = 30;

    const badgeBg = new Graphics()
      .roundRect(-badgeW / 2, -badgeH / 2, badgeW, badgeH, 8)
      .fill({ color: 0x090c16, alpha: 0.95 })
      .stroke({ width: 2, color: options.color ?? this.accentColor });

    badge.addChild(badgeBg, bTxt);
    propCont.addChild(badge);

    const propSpring = new Spring(1.0, 240, 14);

    propCont.on("pointerover", () => {
      propSpring.target = 1.08;
      badge.scale.set(1.12);
    });

    propCont.on("pointerout", () => {
      propSpring.target = 1.0;
      badge.scale.set(1.0);
    });

    propCont.on("pointerdown", () => {
      propSpring.set(0.92);
    });

    propCont.on("pointertap", (e) => {
      e.stopPropagation();
      if (typeof options.onInspect === "function") {
        options.onInspect();
      }
    });

    this.furnitureLayer.addChild(propCont);
    this.props.push({ container: propCont, spring: propSpring, badge, badgeY });

    return propCont;
  }

  // Show a floating inspector card — automatically sized to fit all content cleanly
  showInspector(options) {
    if (this.activeInspector) {
      this.uiLayer.removeChild(this.activeInspector);
      this.activeInspector = null;
    }

    const insp = new Container();
    const inspW = Math.min(this.roomWidth - 48, options.width ?? 560);

    // Measure custom content height dynamically to ensure NO text ever overflows
    const content = new Container();
    content.position.set(22, 66);
    if (options.content) {
      content.addChild(options.content);
    }

    // Dynamic height calculation — ALWAYS encloses the full content height with generous padding
    const calculatedH = options.content ? content.height + 95 : 260;
    const inspH = Math.max(180, options.height ?? calculatedH);

    let posX = options.x ?? (this.roomWidth - inspW) / 2;
    let posY = options.y ?? 60;

    // If card fits vertically, center it nicely; otherwise anchor near top
    if (inspH <= this.roomHeight - 60) {
      posY = Math.max(30, (this.roomHeight - inspH) / 2);
    } else {
      posY = 30;
    }

    posX = Math.max(16, Math.min(posX, this.roomWidth - inspW - 16));

    insp.position.set(posX, posY);
    insp.eventMode = "static";

    const inspSpring = new Spring(0.75, 220, 14);
    inspSpring.target = 1.0;

    // Shadow
    const shadow = new Graphics()
      .roundRect(10, 14, inspW, inspH, 16)
      .fill({ color: 0x000000, alpha: 0.8 });

    // Body
    const bg = new Graphics()
      .roundRect(0, 0, inspW, inspH, 16)
      .fill(0x0e1322)
      .stroke({ width: 2.5, color: options.color ?? this.accentColor });

    // Top Stripe
    const stripe = new Graphics()
      .roundRect(0, 0, inspW, 6, 3)
      .fill(options.color ?? this.accentColor);

    insp.addChild(shadow, bg, stripe);

    // Header Icon & Title
    const hasIcon = Boolean(options.icon && options.icon.trim() !== "");
    if (hasIcon) {
      const iconTxt = new Text({
        text: options.icon,
        style: { fontSize: 24 },
      });
      iconTxt.position.set(20, 18);
      insp.addChild(iconTxt);
    }

    const titleTxt = new Text({
      text: options.title ?? "Inspection Dossier",
      style: {
        fontFamily: "system-ui, -apple-system, sans-serif",
        fontSize: 18,
        fontWeight: "900",
        fill: 0xffffff,
      },
    });
    titleTxt.position.set(hasIcon ? 58 : 22, 18);
    insp.addChild(titleTxt);

    // Close '✕' button
    const closeBtn = new Container();
    closeBtn.position.set(inspW - 32, 28);
    closeBtn.eventMode = "static";
    closeBtn.cursor = "pointer";

    const cBg = new Graphics()
      .circle(0, 0, 16)
      .fill(0x1a2336)
      .stroke({ width: 1.5, color: 0x475569 });

    const cTxt = new Text({
      text: "✕",
      style: { fontSize: 13, fontWeight: "bold", fill: 0xffffff },
    });
    cTxt.anchor.set(0.5);

    closeBtn.addChild(cBg, cTxt);
    closeBtn.on("pointertap", () => {
      this.closeInspector();
    });

    insp.addChild(closeBtn);

    // Separator line
    const sep = new Graphics()
      .moveTo(20, 54)
      .lineTo(inspW - 20, 54)
      .stroke({ width: 1.5, color: 0x222e44 });
    insp.addChild(sep);

    insp.addChild(content);

    this.uiLayer.addChild(insp);
    this.activeInspector = insp;
    this.activeInspectorSpring = inspSpring;
  }

  closeInspector() {
    if (this.activeInspector) {
      this.uiLayer.removeChild(this.activeInspector);
      this.activeInspector = null;
      this.activeInspectorSpring = null;
    }
  }

  requestClose() {
    if (this.isClosing) return;
    if (typeof this.onClose === "function") {
      this.onClose();
    }
  }

  enter() {
    this.roomScaleSpring.set(0.85);
    this.roomScaleSpring.target = 1.0;
    this.roomAlphaSpring.set(0);
    this.roomAlphaSpring.target = 1.0;
    this.isClosing = false;
  }

  exit(onComplete) {
    this.isClosing = true;
    this.roomScaleSpring.target = 0.85;
    this.roomAlphaSpring.target = 0;
    this.exitCallback = onComplete;
  }

  update(delta) {
    if (this.destroyed) return;
    const dt = (delta || 1) * 0.016;

    const currentScale = this.roomScaleSpring.update(dt);
    const currentAlpha = this.roomAlphaSpring.update(dt);

    this.roomStage.scale.set(Math.max(0.1, currentScale));
    this.roomStage.alpha = Math.max(0, Math.min(1, currentAlpha));

    if (
      this.exitSpring &&
      this.exitBtn &&
      !this.exitBtn.destroyed &&
      this.exitBtn.scale
    ) {
      const es = this.exitSpring.update(dt);
      this.exitBtn.scale.set(es);
    }

    if (
      this.activeInspectorSpring &&
      this.activeInspector &&
      !this.activeInspector.destroyed &&
      this.activeInspector.scale
    ) {
      const is = this.activeInspectorSpring.update(dt);
      this.activeInspector.scale.set(is);
    }

    const t = performance.now() * 0.003;
    if (this.props) {
      this.props.forEach((p, idx) => {
        if (
          p.spring &&
          p.container &&
          !p.container.destroyed &&
          p.container.scale
        ) {
          const s = p.spring.update(dt);
          p.container.scale.set(s);
          if (p.badge) {
            p.badge.y = p.badgeY + Math.sin(t + idx) * 3;
          }
        }
      });
    }

    if (this.isClosing && currentAlpha <= 0.08) {
      if (this.exitCallback) {
        const cb = this.exitCallback;
        this.exitCallback = null;
        cb();
      }
      return;
    }
  }
}
