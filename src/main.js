import { Application } from "pixi.js";
import { World } from "./world/World";
import { Camera } from "./utils/Camera";
import { assetManager } from "./assets/AssetManager";

(async () => {
  // Fixed Logical / Design Resolution for crisp universal scaling
  const DESIGN_WIDTH = 1920;
  const DESIGN_HEIGHT = 1080;

  // DOM element references
  const loadingScreen = document.getElementById("loading-screen");
  const loadingStatus = document.getElementById("loading-status");
  const loadingPercent = document.getElementById("loading-percent");
  const progressFill = document.getElementById("progress-fill");
  const actionTrigger = document.getElementById("action-trigger");
  const enterBtn = document.getElementById("enter-btn");
  const pixiContainer = document.getElementById("pixi-container");
  const mobileControls = document.getElementById("mobile-controls");

  let currentPercent = 0;
  let isLanded = false;

  const updateProgress = ({ percent, status }) => {
    currentPercent = Math.max(currentPercent, percent);
    if (progressFill) {
      progressFill.style.width = `${currentPercent}%`;
    }
    if (loadingPercent) {
      loadingPercent.textContent = `${currentPercent < 10 ? "0" : ""}${currentPercent}%`;
    }
    if (loadingStatus && status) {
      loadingStatus.textContent = status;
    }
  };

  const landOnPage = () => {
    if (isLanded) return;
    isLanded = true;

    // Clean up event listeners
    window.removeEventListener("keydown", handleFirstKeyPress);
    window.removeEventListener("pointerdown", handleFirstPointer);

    // Smooth transition
    if (loadingScreen) {
      loadingScreen.classList.add("fade-out");
    }
    if (pixiContainer) {
      pixiContainer.classList.add("ready");
    }

    // Activate mobile controls if touch device
    checkMobileControls();

    // After animation completes, deactivate loading screen overlay
    setTimeout(() => {
      if (loadingScreen) {
        loadingScreen.style.display = "none";
      }
    }, 750);
  };

  const handleFirstKeyPress = (e) => {
    if (["Alt", "Control", "Meta", "Shift"].includes(e.key)) return;
    if (currentPercent >= 100) {
      landOnPage();
    }
  };

  const handleFirstPointer = () => {
    if (currentPercent >= 100) {
      landOnPage();
    }
  };

  const checkMobileControls = () => {
    if (!mobileControls) return;
    const isTouchDevice =
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0 ||
      window.matchMedia("(pointer: coarse)").matches ||
      window.innerWidth <= 1024;

    if (isTouchDevice) {
      mobileControls.classList.add("active");
    }
  };

  try {
    updateProgress({
      percent: 10,
      status: "INITIALIZING GRAPHICS ENGINE...",
    });

    // 1. Initialize Pixi Application with Fixed Design Resolution
    const app = new Application();

    await app.init({
      width: DESIGN_WIDTH,
      height: DESIGN_HEIGHT,
      background: "#000000",
      antialias: true,
      autoDensity: true,
      resolution: Math.min(window.devicePixelRatio || 1, 2),
    });

    if (pixiContainer) {
      pixiContainer.appendChild(app.canvas);
    }

    // 2. Aspect-Fit Responsive Canvas Scaling Function
    const resizeCanvas = () => {
      const screenW = window.innerWidth;
      const screenH = window.innerHeight;
      const targetAspect = DESIGN_WIDTH / DESIGN_HEIGHT; // 16:9
      const windowAspect = screenW / screenH;

      let canvasW, canvasH;
      if (windowAspect > targetAspect) {
        canvasH = screenH;
        canvasW = canvasH * targetAspect;
      } else {
        canvasW = screenW;
        canvasH = canvasW / targetAspect;
      }

      if (app.canvas) {
        app.canvas.style.width = `${Math.floor(canvasW)}px`;
        app.canvas.style.height = `${Math.floor(canvasH)}px`;
      }

      checkMobileControls();
    };

    window.addEventListener("resize", resizeCanvas);
    window.addEventListener("orientationchange", () => {
      setTimeout(resizeCanvas, 150);
    });
    resizeCanvas();

    updateProgress({
      percent: 25,
      status: "DOWNLOADING ASSETS & FONTS...",
    });

    // 3. Preload all textures, fonts, and assets through AssetManager
    await assetManager.loadAll(({ percent, status }) => {
      updateProgress({ percent, status });
    });

    updateProgress({
      percent: 85,
      status: "GENERATING WORLD ENVIRONMENT...",
    });

    // 4. Build World & Entities
    const world = new World(app);
    app.stage.addChild(world);

    // 5. Setup Camera
    const camera = new Camera(app, world);
    camera.follow(world.player);

    // 6. Main Game Loop
    app.ticker.add((ticker) => {
      world.update(ticker.deltaTime);
      camera.update(ticker.deltaTime);
    });

    // 7. Setup On-Screen Mobile Touch Controls Binding
    const touchLeft = document.getElementById("touch-left");
    const touchRight = document.getElementById("touch-right");
    const touchJump = document.getElementById("touch-jump");
    const touchEnter = document.getElementById("touch-enter");

    const bindTouchButton = (btn, onDown, onUp) => {
      if (!btn) return;
      const startHandler = (e) => {
        if (e.cancelable) e.preventDefault();
        e.stopPropagation();
        onDown();
      };
      const endHandler = (e) => {
        if (e.cancelable) e.preventDefault();
        e.stopPropagation();
        onUp();
      };

      btn.addEventListener("pointerdown", startHandler);
      btn.addEventListener("pointerup", endHandler);
      btn.addEventListener("pointercancel", endHandler);
      btn.addEventListener("pointerleave", endHandler);

      btn.addEventListener("touchstart", startHandler, { passive: false });
      btn.addEventListener("touchend", endHandler, { passive: false });
      btn.addEventListener("touchcancel", endHandler, { passive: false });
    };

    if (world && world.player) {
      // Left button
      bindTouchButton(
        touchLeft,
        () => {
          world.player.keys["ArrowLeft"] = true;
          world.player.keys["KeyA"] = true;
        },
        () => {
          world.player.keys["ArrowLeft"] = false;
          world.player.keys["KeyA"] = false;
        },
      );

      // Right button
      bindTouchButton(
        touchRight,
        () => {
          world.player.keys["ArrowRight"] = true;
          world.player.keys["KeyD"] = true;
        },
        () => {
          world.player.keys["ArrowRight"] = false;
          world.player.keys["KeyD"] = false;
        },
      );

      // Jump button
      bindTouchButton(
        touchJump,
        () => {
          world.player.keys["Space"] = true;
          world.player.keys["KeyW"] = true;
        },
        () => {
          world.player.keys["Space"] = false;
          world.player.keys["KeyW"] = false;
        },
      );

      // Enter / Interact button
      if (touchEnter) {
        const handleEnter = (e) => {
          if (e.cancelable) e.preventDefault();
          e.stopPropagation();
          if (
            world.nearbyBuilding &&
            !world.roomManager.currentRoom &&
            world.player.canControl
          ) {
            world.openRoomById(world.nearbyBuilding.data.id);
          } else if (world.roomManager.currentRoom) {
            world.roomManager.close();
          }
        };
        touchEnter.addEventListener("pointerdown", handleEnter);
        touchEnter.addEventListener("touchstart", handleEnter, {
          passive: false,
        });
      }
    }

    // 8. Setup Fast-Travel Quick Teleport HUD Navigation
    const teleportBtns = document.querySelectorAll(".teleport-btn");
    teleportBtns.forEach((btn) => {
      const handleTeleport = (e) => {
        if (e.cancelable) e.preventDefault();
        e.stopPropagation();
        const targetId = btn.getAttribute("data-target");
        if (targetId && world) {
          world.teleportToBuilding(targetId, true);
        }
      };

      btn.addEventListener("click", handleTeleport);
      btn.addEventListener("touchend", handleTeleport, { passive: false });
    });

    updateProgress({
      percent: 100,
      status: "SYSTEM READY // WELCOME TO GAURAV'S PORTFOLIO",
    });

    // Reveal Action Trigger
    if (actionTrigger) {
      actionTrigger.classList.add("visible");
    }

    if (enterBtn) {
      enterBtn.addEventListener("click", landOnPage);
      enterBtn.addEventListener("touchend", (e) => {
        if (e.cancelable) e.preventDefault();
        landOnPage();
      });
    }

    window.addEventListener("keydown", handleFirstKeyPress);
    window.addEventListener("pointerdown", handleFirstPointer);
    window.addEventListener("touchstart", handleFirstPointer, {
      passive: false,
    });
    window.addEventListener("resize", checkMobileControls);
    checkMobileControls();

    // Smooth auto-transition into page after a short pleasant pause
    setTimeout(() => {
      landOnPage();
    }, 450);
  } catch (error) {
    console.error("Initialization error:", error);
    updateProgress({
      percent: 100,
      status: "SYSTEM READY",
    });
    setTimeout(() => {
      landOnPage();
    }, 300);
  }
})();
