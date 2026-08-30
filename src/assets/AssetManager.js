import { Assets } from "pixi.js";
import { manifest } from "./manifest";

export class AssetManager {
  constructor() {
    this.isInitialized = false;
    this.loadedAssets = {};
  }

  async init() {
    if (this.isInitialized) return;

    await Assets.init({
      manifest,
      basePath: "",
    });

    this.isInitialized = true;
  }

  async loadAll(onProgress = () => {}) {
    await this.init();

    // 1. Initial stage: Fonts and basic layout
    onProgress({
      percent: 15,
      status: "INITIALIZING GRAPHICS ENGINE...",
    });

    try {
      if (document.fonts) {
        await document.fonts.ready;
      }
    } catch {
      // Font loading fallback
    }

    onProgress({
      percent: 35,
      status: "LOADING WORLD TEXTURES & ASSETS...",
    });

    // 2. Load manifest bundle
    try {
      this.loadedAssets = await Assets.loadBundle("game-assets", (prog) => {
        // Map bundle loading 35% -> 80%
        const percent = Math.min(80, Math.round(35 + prog * 45));
        onProgress({
          percent,
          status: `DOWNLOADING TEXTURES (${Math.round(prog * 100)}%)...`,
        });
      });
    } catch (err) {
      console.warn("Bundle load warning, falling back to direct load:", err);
      // Fallback direct load
      try {
        await Assets.load("./assets/home.png");
      } catch (e) {
        console.warn("Asset load fallback error:", e);
      }
    }

    onProgress({
      percent: 85,
      status: "COMPILING SHADERS & LIGHTING...",
    });

    // Short tick to allow DOM rendering & shader compilation
    await new Promise((resolve) => setTimeout(resolve, 80));

    onProgress({
      percent: 95,
      status: "CALIBRATING PHYSICS & CONTROLS...",
    });

    await new Promise((resolve) => setTimeout(resolve, 80));

    onProgress({
      percent: 100,
      status: "SYSTEM READY // INITIALIZING WORLD...",
    });

    return this.loadedAssets;
  }

  get(alias) {
    try {
      return Assets.get(alias);
    } catch {
      return null;
    }
  }
}

export const assetManager = new AssetManager();
