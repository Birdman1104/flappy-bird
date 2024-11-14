import * as Phaser from "phaser";
import { BLUE_BIRD_SHEET, RED_BIRD_SHEET, YELLOW_BIRD_SHEET } from "./constants";

export const CONFIGS: {
  speed: number;
  birdGravity: number;
  birdJump: number;
  bestScore: number;
  adFrequency: number;
} = {
  speed: 2,
  birdGravity: 800,
  birdJump: 200,
  bestScore: 0,
  adFrequency: 3,
};

export const birdKeys = ["blue", "red", "yellow"];

export const blueBirdAnimationConfig: Phaser.Types.Animations.Animation = {
  key: birdKeys[0],
  frames: BLUE_BIRD_SHEET,
  frameRate: 12,
  repeat: -1,
};

export const redBirdAnimationConfig: Phaser.Types.Animations.Animation = {
  key: birdKeys[1],
  frames: RED_BIRD_SHEET,
  frameRate: 12,
  repeat: -1,
};

export const yellowBirdAnimationConfig: Phaser.Types.Animations.Animation = {
  key: birdKeys[2],
  frames: YELLOW_BIRD_SHEET,
  frameRate: 12,
  repeat: -1,
};
