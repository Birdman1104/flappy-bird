import * as Phaser from "phaser";
import {
  birdKeys,
  blueBirdAnimationConfig,
  CONFIGS,
  redBirdAnimationConfig,
  yellowBirdAnimationConfig,
} from "../configs";
import { RED_BIRD_SHEET } from "../constants";

export class Bird extends Phaser.Physics.Arcade.Sprite {
  public isAlive = true;
  private keyIndex = 0;

  public constructor(public scene: Phaser.Scene) {
    super(scene, 100, 287, RED_BIRD_SHEET);

    this.initialSetup();
  }

  public update(): void {
    const v = Math.min(Math.max(this.body.velocity.y, -CONFIGS.birdJump), CONFIGS.birdJump);
    this.rotation = (Math.PI * v) / (6 * 180);
  }

  public resetPosition(): void {
    this.setPosition(50, 302);
    this.setInteractive();
    this.rotation = 0;
    this.isAlive = true;
    this.play({ key: birdKeys[this.keyIndex], repeat: -1 });
  }

  public jump(velocity = -CONFIGS.birdJump): void {
    this.rotation = -Math.PI / 4;
    this.body.velocity.y = velocity;
  }

  public die(): void {
    this.jump(-CONFIGS.birdJump);
    this.isAlive = false;
    this.rotation = Math.PI / 4;

    this.stop();
  }

  public disablePhysics(): void {
    this.disableInteractive();
    this.scene.physics.world.disable(this);
  }

  public enablePhysics(): void {
    this.disableInteractive();
    this.scene.physics.world.enable(this);
  }

  private initialSetup(): void {
    this.createAnimations();
    this.play({ key: birdKeys[this.keyIndex], repeat: -1 });
    this.setInteractive();
    this.on("pointerdown", () => this.onPointerDown());
  }

  private createAnimations(): void {
    [blueBirdAnimationConfig, redBirdAnimationConfig, yellowBirdAnimationConfig].forEach((config) =>
      this.anims.create(config)
    );
  }

  private onPointerDown(): void {
    if (!this.isAlive) return;

    this.keyIndex = (this.keyIndex + 1) % birdKeys.length;
    this.play({ key: birdKeys[this.keyIndex], repeat: -1 });
  }
}
