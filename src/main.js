import { Application } from "pixi.js";
import { World } from "./world/World";
import { Camera } from "./utils/Camera";

(async () => {
  const app = new Application();

  await app.init({
    resizeTo: window,
    background: "#000000",
  });

  document.getElementById("pixi-container").appendChild(app.canvas);

  const world = new World(app);

  app.stage.addChild(world);

  const camera = new Camera(app, world);

  camera.follow(world.player);

  app.ticker.add((ticker) => {
    world.update(ticker.deltaTime);

    camera.update(ticker.deltaTime);
  });
})();
