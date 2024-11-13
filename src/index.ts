import * as Phaser from "phaser";
import PhaserDoms from "@rollinsafary/phaser3-doms-plugin";
import { Game } from "./game";

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: "birdman",
  width: 288,
  height: 512,
  backgroundColor: "#353535",
  scene: [],
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 500, x: 0 },
    },
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    parent: "birdman",
    width: 288,
    height: 512,
  },
  plugins: {
    global: [{ key: "PhaserDoms", plugin: PhaserDoms, start: true }],
  },
};

new Game(config);

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// globalThis.__PHASER_GAME__ = game;
