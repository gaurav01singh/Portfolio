import { Container, Graphics, Text } from "pixi.js";
import { Player } from "../player/Player";
import { House } from "./House";
import { Building } from "./Building";
import { Tree } from "./Tree";
import { Ground } from "./Ground";
import { buildingDefs } from "../data/buildings";
import { PortfolioBuilding } from "./PortfolioBuilding";
import { Skyline } from "./Skyline";
import { RoomManager } from "./RoomManager";
import { AboutRoom } from "../rooms/AboutRoom";
import { SkillsRoom } from "../rooms/SkillsRoom";
import { ExperienceRoom } from "../rooms/ExperienceRoom";
import { ProjectsRoom } from "../rooms/ProjectsRoom";
import { EducationRoom } from "../rooms/EducationRoom";
import { ContactRoom } from "../rooms/ContactRoom";

export class World extends Container {
  constructor(app) {
    super();

    this.app = app;
    this.worldWidth = 4600;
    this.worldHeight = app.screen.height;

    this.create();
  }

  create() {
    this.groundY = this.app.screen.height - 120;

    this.farLayer = new Container();
    this.midLayer = new Container();
    this.gameLayer = new Container();

    this.skyline = new Skyline(
      this.app.screen.width,
      this.app.screen.height,
      this.groundY,
    );
    this.farLayer.addChild(this.skyline);

    // Ground
    this.ground = new Ground(this.groundY);
    this.gameLayer.addChild(this.ground);

    this.layers = [
      { container: this.farLayer, speed: 0.2 },
      { container: this.midLayer, speed: 0.5 },
      { container: this.gameLayer, speed: 1.0 },
    ];

    this.addChild(this.farLayer, this.midLayer, this.gameLayer);

    // Background Far Buildings
    this.farBuildings = new Container();
    let x1 = -300;
    while (x1 < 6000) {
      const b = new Building();
      b.alpha = 0.45;
      b.scale.set(0.9);
      b.position.set(x1, this.groundY);
      this.farBuildings.addChild(b);
      x1 += 60 + Math.random() * 40;
    }
    this.farLayer.addChild(this.farBuildings);

    // Mid Layer Buildings
    this.nearBuildings = new Container();
    let x = -300;
    while (x < 6000) {
      const b = new Building();
      b.position.set(x, this.groundY);
      this.nearBuildings.addChild(b);
      x += 70 + Math.random() * 60;
    }
    this.midLayer.addChild(this.nearBuildings);

    // Mid Layer Trees
    for (let i = 0; i < 35; i++) {
      const tree = new Tree(0.8 + Math.random() * 0.7);
      tree.position.set(i * 150 + Math.random() * 40, this.groundY);
      this.midLayer.addChild(tree);
    }

    // Spawn House
    this.house = new House();
    this.house.position.set(120, this.groundY);
    this.gameLayer.addChild(this.house);

    // Instantiate Single Room Manager
    this.roomManager = new RoomManager(this.app, this);

    // Buildings Collection
    this.portfolioBuildings = [];

    buildingDefs.forEach((def) => {
      const building = new PortfolioBuilding(def);
      building.position.set(def.x, this.groundY);

      this.gameLayer.addChild(building);
      this.portfolioBuildings.push(building);

      building.on("open-room", (id) => {
        this.openRoomById(id);
      });
    });

    // Player
    this.player = new Player();
    this.player.position.set(300, this.groundY);
    this.gameLayer.addChild(this.player);

    // Proximity Prompt UI (Above nearby building / player)
    this.promptContainer = new Container();
    this.promptContainer.visible = false;
    this.promptContainer.alpha = 0;

    const promptBg = new Graphics()
      .roundRect(-120, -18, 240, 36, 18)
      .fill(0x0f131c)
      .stroke({ width: 2, color: 0x38bdf8 });

    this.promptText = new Text({
      text: "Press [E] or Click to Enter",
      style: {
        fontFamily: "system-ui, -apple-system, sans-serif",
        fontSize: 12,
        fontWeight: "900",
        fill: 0xffffff,
      },
    });
    this.promptText.anchor.set(0.5);

    this.promptContainer.addChild(promptBg, this.promptText);
    this.gameLayer.addChild(this.promptContainer);

    // Keyboard interaction for 'E' / 'Enter' to open nearby room
    window.addEventListener("keydown", (e) => {
      if (
        e.code === "KeyE" ||
        e.key === "e" ||
        e.key === "E" ||
        e.code === "Enter"
      ) {
        if (!this.roomManager.currentRoom && this.nearbyBuilding) {
          this.openRoomById(this.nearbyBuilding.data.id);
        }
      }
    });

    // Add top-left HUD Controls
    this.createHUD();
  }

  createHUD() {
    this.hud = new Container();
    this.hud.position.set(16, 16);

    const hudBg = new Graphics()
      .roundRect(0, 0, 420, 34, 10)
      .fill({ color: 0x090c14, alpha: 0.85 })
      .stroke({ width: 1.5, color: 0x222a3d });

    const hudTxt = new Text({
      text: "[A][D]/Arrows: Walk · [W]/Space: Jump · [E]/Click: Enter · [ESC]: Exit",
      style: {
        fontFamily: "system-ui, sans-serif",
        fontSize: 11,
        fontWeight: "bold",
        fill: 0xabbcd5,
      },
    });
    hudTxt.position.set(12, 9);

    this.hud.addChild(hudBg, hudTxt);
    this.app.stage.addChild(this.hud);
  }

  openRoomById(id) {
    switch (id) {
      case "about":
        this.roomManager.open(new AboutRoom(this.app));
        break;

      case "skills":
        this.roomManager.open(new SkillsRoom(this.app));
        break;

      case "experience":
        this.roomManager.open(new ExperienceRoom(this.app));
        break;

      case "projects":
        this.roomManager.open(new ProjectsRoom(this.app));
        break;

      case "education":
        this.roomManager.open(new EducationRoom(this.app));
        break;

      case "contact":
        this.roomManager.open(new ContactRoom(this.app));
        break;

      default:
        console.warn("Unknown room id:", id);
    }
  }

  teleportToBuilding(id, autoOpen = false) {
    // If a room is currently active, close it
    if (this.roomManager && this.roomManager.currentRoom) {
      this.roomManager.close();
    }

    const building = this.portfolioBuildings.find((b) => b.data.id === id);
    if (!building) return;

    // Teleport player directly in front of the building
    this.player.x = building.x;
    this.player.y = this.groundY;
    this.player.vx = 0;
    this.player.vy = 0;

    // Trigger proximity check immediately
    this.checkProximity(1);

    // If autoOpen is true, open the room after a brief smooth transition
    if (autoOpen) {
      setTimeout(() => {
        if (!this.roomManager.currentRoom) {
          this.openRoomById(id);
        }
      }, 180);
    }
  }

  update(delta) {
    this.player.update(delta, this.groundY, this.worldWidth);
    this.skyline.update(delta);

    // Update smoke puffs & building animations
    this.portfolioBuildings.forEach((b) => {
      if (typeof b.update === "function") {
        b.update(delta);
      }
    });

    // Check proximity to portfolio buildings
    this.checkProximity(delta);
  }

  checkProximity(delta) {
    if (this.roomManager.currentRoom) {
      this.promptContainer.visible = false;
      this.nearbyBuilding = null;
      return;
    }

    let closest = null;
    let minDist = 130; // Proximity radius

    for (const building of this.portfolioBuildings) {
      const dist = Math.abs(this.player.x - building.x);
      if (dist < minDist) {
        closest = building;
        minDist = dist;
      }
    }

    this.nearbyBuilding = closest;

    if (closest) {
      this.promptText.text = `Press [E] or Click to Enter ${closest.data.label}`;
      this.promptContainer.position.set(
        closest.x,
        this.groundY - closest.data.h - 60,
      );
      this.promptContainer.visible = true;
      this.promptContainer.alpha +=
        (1.0 - this.promptContainer.alpha) * 0.15 * delta;

      // Subtle bobbing animation
      const t = performance.now() * 0.005;
      this.promptContainer.y =
        this.groundY - closest.data.h - 60 + Math.sin(t) * 3;
    } else {
      this.promptContainer.alpha -= 0.2 * delta;
      if (this.promptContainer.alpha <= 0.05) {
        this.promptContainer.visible = false;
      }
    }
  }
}
