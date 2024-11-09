export const SCENE_NAMES = {
  preload: "PreloadScene",
  game: "GameScene",
};

export const TEXTURES = "mainAtlas";
export const BLUE_BIRD_SHEET = "bird";
export const RED_BIRD_SHEET = "redbird";
export const YELLOW_BIRD_SHEET = "yellowbird";

export const STORAGE_NAME = "bestFlappyBirdScore";

export enum GameState {
  undefined,
  preAction,
  action,
  die,
  result,
}
