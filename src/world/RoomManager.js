export class RoomManager {
  constructor(app, world) {
    this.app = app;
    this.world = world;
    this.currentRoom = null;
    this.isTransitioning = false;

    // Ticker update loop for current active room
    this.app.ticker.add((ticker) => {
      if (
        this.currentRoom &&
        !this.currentRoom.destroyed &&
        typeof this.currentRoom.update === "function"
      ) {
        this.currentRoom.update(ticker.deltaTime);
      }
    });

    // Global ESC key to close active room
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape" || e.code === "Escape") {
        if (this.currentRoom && !this.isTransitioning) {
          this.close();
        }
      }
    });
  }

  open(room) {
    if (this.isTransitioning) return;

    // If another room is open, clean it up immediately
    if (this.currentRoom) {
      const prevRoom = this.currentRoom;
      this.currentRoom = null;
      this.app.stage.removeChild(prevRoom);
      try {
        prevRoom.destroy({ children: true });
      } catch (err) {
        console.warn("Room cleanup warning:", err);
      }
    }

    this.currentRoom = room;

    // Pause player movement while modal room is active
    if (this.world && this.world.player) {
      this.world.player.canControl = false;
    }

    // Attach close callback
    room.onClose = () => {
      this.close();
    };

    this.app.stage.addChild(room);

    if (typeof room.enter === "function") {
      room.enter();
    }
  }

  close() {
    if (!this.currentRoom || this.isTransitioning) return;

    this.isTransitioning = true;
    let isCleanedUp = false;

    const cleanup = () => {
      if (isCleanedUp) return;
      isCleanedUp = true;

      if (this.currentRoom) {
        const roomToClean = this.currentRoom;
        this.currentRoom = null;
        this.app.stage.removeChild(roomToClean);
        try {
          roomToClean.destroy({ children: true });
        } catch (err) {
          console.warn("Room cleanup warning:", err);
        }
      }

      // Restore player controls in world
      if (this.world && this.world.player) {
        this.world.player.canControl = true;
      }

      this.isTransitioning = false;
    };

    // Fallback safety timeout so controls always restore even if a frame drops
    setTimeout(() => {
      if (this.isTransitioning && !isCleanedUp) {
        cleanup();
      }
    }, 400);

    if (typeof this.currentRoom.exit === "function") {
      this.currentRoom.exit(() => {
        cleanup();
      });
    } else {
      cleanup();
    }
  }
}
