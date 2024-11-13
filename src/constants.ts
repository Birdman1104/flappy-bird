export const SCENE_NAMES = {
  preload: "PreloadScene",
  game: "GameScene",
};

export const BKG_DAY = "bkg-day";
export const BKG_NIGHT = "bkg-night";
export const BASE = "base";
export const MESSAGE = "message";

export const TEXTURES = "main";
export const BLUE_BIRD_SHEET = "bird";
export const RED_BIRD_SHEET = "redbird";
export const YELLOW_BIRD_SHEET = "yellowbird";

export const SOUNDS = Object.freeze({
  die: "die",
  hit: "hit",
  point: "point",
  swoosh: "swoosh",
  wing: "wing",
});

export const STORAGE_NAME = "bestFlappyBirdScore";

export enum GameState {
  undefined,
  preAction,
  action,
  die,
  result,
}
