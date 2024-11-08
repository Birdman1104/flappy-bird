export class MainView extends Phaser.GameObjects.Container {
  private bkg: Phaser.GameObjects.Image;
  private bird: Phaser.GameObjects.Image;

  public constructor(scene: Phaser.Scene) {
    super(scene);
    this.build();
  }

  public update(): void {
    const { height } = this.scene.scale;
    if (this.bird && this.bird.y > height - this.bird.height / 2) {
      this.scene.physics.world.disable(this.bird);
      this.bkg.disableInteractive();
    }
  }

  private build(): void {
    this.buildBkg();
    this.buildBird();
  }

  private buildBkg(): void {
    this.bkg = this.scene.add.image(0, 0, "bkg");
    this.bkg.setOrigin(0);
    this.bkg.setInteractive();
    this.bkg.on("pointerdown", this.onBkgClick, this);
    this.add(this.bkg);
  }

  private buildBird(): void {
    const { width, height } = this.scene.scale;
    this.bird = this.scene.add.image(width * 0.2, height / 2, "bird");
    this.scene.physics.add.existing(this.bird);
    this.add(this.bird);
  }

  private onBkgClick(): void {
    this.bird.x += 10;
  }
}
