import * as Phaser from "phaser";
import { Game } from "./game";

const config: Phaser.Types.Core.GameConfig = {
  transparent: false,
  antialiasGL: false,
  type: Phaser.WEBGL,
  width: 288,
  height: 512,
  input: {
    mouse: {
      preventDefaultWheel: false,
    },
  },
  scale: {
    parent: "phaser-game",
    autoCenter: Phaser.Scale.CENTER_BOTH,
    mode: Phaser.Scale.FIT,
  },
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 500 },
    },
  },
  antialias: true,
};

new Game(config);
