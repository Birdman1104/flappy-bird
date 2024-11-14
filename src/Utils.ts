import { CONFIGS } from "./configs";
import { STORAGE_NAME } from "./constants";

export const getSpeed = (score: number): number => {
  return CONFIGS.speed + score * 0.1;
};

export const getBestScore = async (): Promise<number> => {
  if (window.thePlayer) {
    return window.thePlayer.getData("score");
  } else {
    return localStorage.getItem(STORAGE_NAME) ? +localStorage.getItem(STORAGE_NAME) : 0;
  }
};

export const updateBestScore = (score: number): void => {
  if (!window.thePlayer) {
    updateLocalStorage(score);
  } else {
    updateYandexPlayerData(score);
  }
};

const updateLocalStorage = (score: number): void => {
  if (score > CONFIGS.bestScore) {
    CONFIGS.bestScore = score;
    localStorage.setItem(STORAGE_NAME, score.toString());
  }
};

const updateYandexPlayerData = (score: number): void => {
  window.thePlayer.setData({
    score: score,
  });
};
