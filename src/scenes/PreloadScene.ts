import { Scenes } from "../constants";

export class PreloadScene extends Phaser.Scene {
  public preload(): void {
    //
  }

  public create(): void {
    this.load.image("bkg", "src/assets/background-day.png");
    this.load.image("bird", "src/assets/bluebird-downflap.png");
    this.load.image("pipe", "src/assets/pipe-1.png");

    this.load.on("progress", this.onFileLoadComplete, this);
    this.load.on("complete", this.onLoadComplete, this);
    this.load.start();
  }

  private onFileLoadComplete(progress: number): void {
    console.log("LOAD_PROGRESS", progress);
  }

  private onLoadComplete(): void {
    this.game.scene.stop(Scenes.preload);
    this.game.scene.start(Scenes.game);
  }
}
