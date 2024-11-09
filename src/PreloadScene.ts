import * as Phaser from "phaser";
import {
  BKG_DAY,
  BKG_NIGHT,
  BLUE_BIRD_SHEET,
  RED_BIRD_SHEET,
  SCENE_NAMES,
  TEXTURES,
  YELLOW_BIRD_SHEET,
} from "./constants";

export class PreloadScene extends Phaser.Scene {
  public preload(): void {
    //
  }

  public create(): void {
    this.load.image(BKG_DAY, "./assets/bkg-day.png");
    this.load.image(BKG_NIGHT, "./assets/bkg-night.png");
    this.load.atlas(TEXTURES, "./atlases/main.png", "./atlases/main.json");
    this.load.atlas(BLUE_BIRD_SHEET, "./atlases/bird.png", "./atlases/bird.json");
    this.load.atlas(RED_BIRD_SHEET, "./atlases/redbird.png", "./atlases/redbird.json");
    this.load.atlas(YELLOW_BIRD_SHEET, "./atlases/yellowbird.png", "./atlases/yellowbird.json");
    this.load.on("progress", this.onFileLoadComplete, this);
    this.load.on("complete", this.onLoadComplete, this);
    this.load.start();
  }

  private onFileLoadComplete(progress: number): void {
    console.log("LOAD_PROGRESS", progress);
  }

  private onLoadComplete(): void {
    // this.game.scene.stop(SCENE_NAMES.preload);
    this.game.scene.start(SCENE_NAMES.game);
  }
}
