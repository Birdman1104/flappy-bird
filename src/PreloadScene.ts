import * as Phaser from "phaser";
import { getBestScore } from "./Utils";
import { CONFIGS } from "./configs";
import {
  BASE,
  BKG_DAY,
  BKG_NIGHT,
  BLUE_BIRD_SHEET,
  RED_BIRD_SHEET,
  SCENE_NAMES,
  SOUNDS,
  TEXTURES,
  YELLOW_BIRD_SHEET,
} from "./constants";

export class PreloadScene extends Phaser.Scene {
  public preload(): void {
    //
  }

  public async create(): Promise<void> {
    this.load.image(BKG_DAY, "./assets/bkg-day.png");
    this.load.image(BKG_NIGHT, "./assets/bkg-night.png");
    this.load.image(BASE, "./assets/base.png");

    [TEXTURES, BLUE_BIRD_SHEET, RED_BIRD_SHEET, YELLOW_BIRD_SHEET].forEach((key) => {
      this.load.atlas(key, `./atlases/${key}.png`, `./atlases/${key}.json`);
    });

    Object.keys(SOUNDS).forEach((key) => {
      this.load.audio(key, `./sounds/${key}.wav`);
    });

    try {
      CONFIGS.bestScore = await getBestScore();
    } catch (error) {
      console.error("ERROR", error);
      CONFIGS.bestScore = 0;
    }

    this.load.on("progress", this.onFileLoadComplete, this);
    this.load.on("complete", this.onLoadComplete, this);
    this.load.start();
  }

  private onFileLoadComplete(progress: number): void {
    console.log("LOAD_PROGRESS", progress);
  }

  private onLoadComplete(): void {
    this.game.scene.start(SCENE_NAMES.game);
  }
}
