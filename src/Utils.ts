import { CONFIGS } from "./configs";
import { STORAGE_NAME } from "./constants";

export const getSpeed = (score: number): number => {
  return CONFIGS.speed + score * 0.05;
};

export const getBestScore = (): number => {
  return localStorage.getItem(STORAGE_NAME) ? +localStorage.getItem(STORAGE_NAME) : 0;
};

export const updateBestScore = (score: number): void => {
  updateLocalStorage(score);
};

const updateLocalStorage = (score: number): void => {
  if (score > CONFIGS.bestScore) {
    CONFIGS.bestScore = score;
    localStorage.setItem(STORAGE_NAME, score.toString());
  }
};
