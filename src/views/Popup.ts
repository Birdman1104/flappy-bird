import * as Phaser from "phaser";
import { CONFIGS } from "../configs";
import { TEXTURES } from "../constants";

export class GameOverPopup extends Phaser.GameObjects.Container {
  private bg: Phaser.GameObjects.Image;
  private gameOver: Phaser.GameObjects.Image;
  private playerScoreText: Phaser.GameObjects.Text;
  private bestScoreText: Phaser.GameObjects.Text;
  private proposal: Phaser.GameObjects.Text;

  public constructor(public scene: Phaser.Scene) {
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

  public show(currentScore: number): void {
    if (this.alpha === 1) return;

    this.alpha = 1;
    this.proposal.alpha = 1;

    this.bestScoreText.text = this.getBestScoreText(CONFIGS.bestScore);
    this.playerScoreText.text = this.getScoreText(currentScore);

    this.scene.tweens.add({
      targets: this.proposal,
      alpha: 0,
      duration: 700,
      ease: "SineInOut",
      yoyo: true,
      repeat: -1,
    });
  }

  public hide(): void {
    this.scene.tweens.killTweensOf(this.proposal);
    this.alpha = 0;
    this.proposal.alpha = 0;
  }

  private build(): void {
    const { width: w, height: h } = this.scene.game.config;
    this.bg = this.scene.add.image(+w / 2, +h / 2, TEXTURES, "popup.png");
    this.gameOver = this.scene.add.image(+w / 2, +h / 2 - 42, TEXTURES, "gameover.png");
    this.playerScoreText = this.scene.add.text(+w / 2, +h / 2, this.getScoreText());
    this.bestScoreText = this.scene.add.text(+w / 2, +h / 2 + 21, this.getBestScoreText(CONFIGS.bestScore));
    this.proposal = this.scene.add.text(+w / 2, +h / 2 + 52, this.getProposalText(), { fontSize: "20px" });

    this.playerScoreText.setOrigin(0.5);
    this.bestScoreText.setOrigin(0.5);
    this.proposal.setOrigin(0.5);

    this.add([this.bg, this.gameOver, this.playerScoreText, this.bestScoreText, this.proposal]);
  }

  private getScoreText(score = 0): string {
    return `You scored - ${score}`;
  }

  private getBestScoreText(score: number): string {
    return `Best score - ${score}`;
  }

  private getProposalText(): string {
    return `TAP TO PLAY AGAIN`;
  }
}
