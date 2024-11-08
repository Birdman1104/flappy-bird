export const Scenes = {
  preload: "preloadScene",
  game: "gameScene",
};

export const STORAGE_NAME = "bestFlappyBirdScore";

export enum GameState {
  undefined,
  preAction,
  action,
  die,
  result,
}
