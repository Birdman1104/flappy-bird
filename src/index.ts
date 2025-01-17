import * as Phaser from "phaser";
import { Game } from "./game";

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: "content",
  width: 288,
  height: 512,
  backgroundColor: "#353535",
  scene: [],
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 500 },
    },
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    parent: "content",
    width: 288,
    height: 512,
  },
};

const game = new Game(config);

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
globalThis.__PHASER_GAME__ = game;
