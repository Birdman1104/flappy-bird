export class PipeContainer extends Phaser.GameObjects.Container {
  private pipeTop: Phaser.Physics.Arcade.Sprite;
  private pipeBottom: Phaser.Physics.Arcade.Sprite;

  public constructor(scene: Phaser.Scene) {
    super(scene);
    this.init();
  }

  public get pipes(): Phaser.Physics.Arcade.Sprite[] {
    return [this.pipeTop, this.pipeBottom];
  }

  private init(): void {
    const pipe1Y = Math.random() * 150 + 400;
    this.pipeBottom = this.scene.physics.add.sprite(0, pipe1Y, "pipe");
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.pipeBottom.body.allowGravity = false;

    const pipe2Y = Math.random() * 50 - 50;
    this.pipeTop = this.scene.physics.add.sprite(0, pipe2Y, "pipe");
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.pipeTop.body.allowGravity = false;
    this.pipeTop.scaleY = -1;

    this.add(this.pipeBottom);
    this.add(this.pipeTop);
  }
}
