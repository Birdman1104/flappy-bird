import { CONFIGS } from "./configs";
import { STORAGE_NAME } from "./constants";

export const getSpeed = (score: number): number => {
  return CONFIGS.speed + score * 0.1;
};

export const getBestScore = (): number => {
  return localStorage.getItem(STORAGE_NAME) ? +localStorage.getItem(STORAGE_NAME) : 0;
};

export const updateBestScore = (score: number): void => {
  const bestScore = getBestScore();
  if (score > bestScore) {
    localStorage.setItem(STORAGE_NAME, score.toString());
  }
};
