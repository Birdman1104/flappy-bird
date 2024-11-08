export class PipeContainer extends Phaser.GameObjects.Container {
  public constructor(scene: Phaser.Scene) {
    super(scene);
    this.init();
  }

  private init(): void {
    const pipe1Y = Math.random() * 150 + 400;
    const pipe1 = this.scene.physics.add.sprite(0, pipe1Y, "pipe");
    pipe1.body.allowGravity = false;

    const pipe2Y = Math.random() * 50 - 50;
    const pipe2 = this.scene.physics.add.sprite(0, pipe2Y, "pipe");
    pipe2.body.allowGravity = false;
    pipe2.scaleY = -1;

    this.add(pipe1);
    this.add(pipe2);
  }
}
