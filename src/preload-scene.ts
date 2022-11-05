import * as Phaser from "phaser";
import { BIRD_SHEET, SCENE_NAMES, TEXTURES } from "./constants";

export class PreloadScene extends Phaser.Scene {
  public preload(): void {
    //
  }

  public create(): void {
    this.load.atlas(TEXTURES, "./atlases/main.png", "./atlases/main.json");
    this.load.atlas(BIRD_SHEET, "./atlases/bird.png", "./atlases/bird.json");
    this.load.on("progress", this._onFileLoadComplete, this);
    this.load.on("complete", this._onLoadComplete, this);
    this.load.start();
  }

  private _onFileLoadComplete(progress: number): void {
    console.log("LOAD_PROGRESS", progress);
  }

  private _onLoadComplete(): void {
    // this.game.scene.stop(SCENE_NAMES.preload);
    this.game.scene.start(SCENE_NAMES.game);
  }
}
