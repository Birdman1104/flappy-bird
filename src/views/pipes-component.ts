import * as Phaser from "phaser";
import { TEXTURES } from "../constants";

export class PipesComponent extends Phaser.GameObjects.Container {
  public pipeBottom: Phaser.Physics.Arcade.Sprite;
  public pipeTop: Phaser.Physics.Arcade.Sprite;

  public constructor(public scene: Phaser.Scene, private score: number) {
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
    const pipe1Y = Math.random() * 150 + 380;
    const pipe1 = this.scene.physics.add.sprite(this.x, pipe1Y, TEXTURES, "pipe-1.png");

    const pipe2Y = pipe1Y - pipe1.height - (Math.random() * 80 + 100) + this.score * 2;
    const pipe2 = this.scene.physics.add.sprite(this.x, pipe2Y, TEXTURES, "pipe-2.png");

    pipe1.setImmovable(true);
    pipe2.setImmovable(true);

    pipe1.body.allowGravity = false;
    pipe2.body.allowGravity = false;

    this.pipeBottom = pipe1;
    this.pipeTop = pipe2;

    this.add(this.pipeBottom);
    this.add(this.pipeTop);
  }
}
