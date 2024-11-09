import { TEXTURES } from "../constants";

export class Score extends Phaser.GameObjects.Container {
  private score = 0;
  private numbers: Phaser.GameObjects.Image[] = [];

  public constructor(scene: Phaser.Scene) {
    super(scene);
  }

  public updateScore(score: number): void {
    this.destroyNumbers();
    this.score = score;

    const scoreString = score.toString();
    scoreString.split("").forEach((number, index) => {
      const numberImage = this.scene.add.image(index * 20, 0, TEXTURES, `${number}.png`);
      this.add(numberImage);
      this.numbers.push(numberImage);
    });
  }

  private destroyNumbers(): void {
    this.numbers.forEach((number) => number.destroy());
    this.numbers = [];
  }
}
