import * as Phaser from "phaser";
import { TEXTURES } from "../constants";

export class PopupComponent extends Phaser.GameObjects.Container {
  private bg: Phaser.GameObjects.Image;
  private gameOver: Phaser.GameObjects.Image;
  private playerScoreText: Phaser.GameObjects.Text;
  private bestScoreText: Phaser.GameObjects.Text;
  private proposal: Phaser.GameObjects.Text;
  public constructor(public scene: Phaser.Scene, private score: number, private bestScore: number) {
    super(scene);

    this.build();
  }

  public destroy(): void {
    this.scene.tweens.killTweensOf(this.proposal);
    this.bg.destroy();
    this.gameOver.destroy();
    this.playerScoreText.destroy();
    this.bestScoreText.destroy();
    this.proposal.destroy();

    super.destroy();
  }

  private build(): void {
    const { width: w, height: h } = this.scene.game.config;
    this.bg = this.scene.add.image(+w / 2, +h / 2, TEXTURES, "popup.png");
    this.gameOver = this.scene.add.image(+w / 2, +h / 2 - 42, TEXTURES, "gameover.png");
    this.playerScoreText = this.scene.add.text(+w / 2, +h / 2, `You scored - ${this.score}`);
    this.bestScoreText = this.scene.add.text(
      +w / 2,
      +h / 2 + 21,
      `Best score - ${Math.max(this.score, this.bestScore)}`
    );
    this.proposal = this.scene.add.text(+w / 2, +h / 2 + 52, `TAP TO PLAY AGAIN`, { fontSize: "20px" });

    this.playerScoreText.setOrigin(0.5);
    this.bestScoreText.setOrigin(0.5);
    this.proposal.setOrigin(0.5);

    this.scene.tweens.add({
      targets: this.proposal,
      alpha: 0,
      duration: 700,
      ease: "SineInOut",
      yoyo: true,
      repeat: -1,
    });
  }
}
