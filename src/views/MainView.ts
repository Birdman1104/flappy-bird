import { CONFIGS } from "../configs";
import { PipeContainer } from "./PipeContainer";

export class MainView extends Phaser.GameObjects.Container {
  private bkg: Phaser.GameObjects.TileSprite;
  private bird: Phaser.GameObjects.Image;
  private pipes: PipeContainer[] = [];

  public constructor(scene: Phaser.Scene) {
    super(scene);
    this.build();
  }

  public update(): void {
    this.pipes.forEach((p, i) => {
      p.x -= CONFIGS.speed;
      if (p.x <= -26) {
        p.destroy();
        this.pipes.splice(i, 1);
        this.addPipe();
      }
    });

    const { height } = this.scene.scale;
    if (this.bird && this.bird.y > height - this.bird.height / 2) {
      this.scene.physics.world.disable(this.bird);
      this.bkg.disableInteractive();
    }

    this.bkg.tilePositionX += CONFIGS.speed;
  }

  private build(): void {
    this.buildBkg();
    this.buildBird();
    this.addPipe();
    this.addPipe();
    this.addPipe();
    this.addPipe();
  }

  private buildBkg(): void {
    this.bkg = this.scene.add.tileSprite(0, 0, 288, 512, "bkg");
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

  private addPipe(): void {
    const pipeX = this.pipes.length ? this.pipes[this.pipes.length - 1].x + 200 : 300;
    const pipe = new PipeContainer(this.scene);
    pipe.x = pipeX;
    this.add(pipe);
    this.pipes.push(pipe);
  }

  private onBkgClick(): void {
    this.bird.body.velocity.y = CONFIGS.birdVelocity;
  }
}
