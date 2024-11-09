import * as Phaser from "phaser";
import { TEXTURES } from "../constants";

export class Pipes extends Phaser.GameObjects.Container {
  public pipeBottom: Phaser.Physics.Arcade.Sprite;
  public pipeTop: Phaser.Physics.Arcade.Sprite;

  public constructor(public scene: Phaser.Scene, private score: number, private nightAlpha: number) {
    super(scene);

    this.setup();
  }

  public get pipes(): Phaser.Physics.Arcade.Sprite[] {
    return [this.pipeTop, this.pipeBottom];
  }

  public getWidth(): number {
    return this.pipeBottom.width;
  }

  private setup(): void {
    // const frame = this.isNight ? "pipe-green.png" : "pipe-red.png";
    const pipe1Y = Math.random() * 150 + 380;
    const pipe1 = this.scene.physics.add.sprite(0, pipe1Y, TEXTURES, "pipe-green.png");

    const pipe2Y = pipe1Y - pipe1.height - (Math.random() * 80 + 100) + this.score * 2;
    const pipe2 = this.scene.physics.add.sprite(0, pipe2Y, TEXTURES, "pipe-green.png");
    pipe2.scaleY = -1;

    const pipe1Cover = this.scene.add.sprite(0, pipe1Y, TEXTURES, "pipe-red.png");
    const pipe2Cover = this.scene.add.sprite(0, pipe2Y, TEXTURES, "pipe-red.png");

    pipe2Cover.scaleY = -1;

    pipe1Cover.alpha = this.nightAlpha;
    pipe2Cover.alpha = this.nightAlpha;

    pipe1.setImmovable(true);
    pipe2.setImmovable(true);

    pipe1.body.allowGravity = false;
    pipe2.body.allowGravity = false;

    this.pipeBottom = pipe1;
    this.pipeTop = pipe2;

    this.add(this.pipeBottom);
    this.add(this.pipeTop);

    this.add(pipe1Cover);
    this.add(pipe2Cover);
  }
}
