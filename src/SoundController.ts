import { SOUNDS } from "./constants";

export class SoundController {
  public constructor(private scene: Phaser.Scene) {
    this.initSounds();
  }

  public playDie(): void {
    this.scene.sound.play(SOUNDS.die);
  }

  public playHit(): void {
    this.scene.sound.play(SOUNDS.hit);
  }

  public playPoint(): void {
    this.scene.sound.play(SOUNDS.point);
  }

  public playSwoosh(): void {
    this.scene.sound.play(SOUNDS.swoosh);
  }

  public playWing(): void {
    this.scene.sound.play(SOUNDS.wing);
  }

  private initSounds(): void {
    Object.keys(SOUNDS).forEach((key) => {
      this.scene.sound.add(key);
    });
  }
}
