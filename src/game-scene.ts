import * as Phaser from "phaser";
import { CONFIGS } from "./configs";
import { GameState, STORAGE_NAME, TEXTURES } from "./constants";
import { BirdComponent } from "./views/bird-component";
import { PipesComponent } from "./views/pipes-component";
import { PopupComponent } from "./views/popup-component";

export class GameScene extends Phaser.Scene {
  private bg: Phaser.GameObjects.TileSprite;
  private bird: BirdComponent;
  private pipes: PipesComponent;
  private popup: PopupComponent;
  private message: Phaser.GameObjects.Image;
  private score = 0;
  private bestScore = 0;
  private scoreText: Phaser.GameObjects.Text;
  private overlap: Phaser.Physics.Arcade.Collider;
  private state: GameState = GameState.undefined;

  public create(): void {
    this.buildBg();
    this.buildBird();
    this.drawScore();

    this.setGameState(GameState.preAction);
  }

  public update(): void {
    switch (this.state) {
      case GameState.action:
        this.actionsUpdates();
        break;
      case GameState.die:
        this.dieUpdates();
        break;

      default:
        break;
    }
  }

  private onStateUpdate(): void {
    switch (this.state) {
      case GameState.preAction:
        this.reset();
        break;
      case GameState.result:
        this.showPopup();
        this.changeLocalStorage();
        break;
      case GameState.die:
        this.bird.die();
        break;
      default:
        break;
    }
  }

  private onPointerDown(e: Phaser.Input.Pointer): void {
    if (e.wasTouch) {
      return;
    }

    switch (this.state) {
      case GameState.action:
        this.bird.jump();
        break;
      case GameState.preAction:
        this.setGameState(GameState.action);
        this.startAction();
        break;
      case GameState.result:
        this.popup.destroy();
        this.setGameState(GameState.preAction);
        break;

      default:
        break;
    }
  }

  private actionsUpdates(): void {
    if (this.bird.y > +this.game.config.height) {
      this.setGameState(GameState.die);
    }

    if (this.bird.y <= 0) {
      this.bird.y = 0;
      this.bird.body.velocity.y = 0;
    }

    const speed = this.getSpeed();

    this.bird.update();
    this.bg.tilePositionX += CONFIGS.speed;
    this.pipes.move(speed);
  }

  private dieUpdates(): void {
    if (this.bird.y > +this.game.config.height) {
      this.bird.y = +this.game.config.height - 5;
      this.bird.disablePhysics();
      this.setGameState(GameState.result);
    }
  }

  private setGameState(state: GameState): void {
    if (this.state !== state) {
      this.state = state;
      this.onStateUpdate();
    }
  }

  private startAction(): void {
    this.buildPipe();
    this.hideMessage();
    this.bird.enablePhysics();
    this.bird.jump();
  }

  private reset(): void {
    this.score = 0;
    this.updateScoreText();
    this.pipes && this.pipes.destroy();
    this.bird.resetPosition();
    this.showMessage();
  }

  private buildBg(): void {
    this.bg = this.add.tileSprite(256, 256, 512, 512, TEXTURES, "bg.png");
    this.bg.setInteractive();
    this.bg.on("pointerdown", (e: Phaser.Input.Pointer) => this.onPointerDown(e));
  }

  private buildBird(): void {
    this.add.existing((this.bird = new BirdComponent(this)));
    this.bird.setDepth(2);
  }

  private showPopup(): void {
    this.add.existing((this.popup = new PopupComponent(this, this.score, this.bestScore)));
  }

  private buildPipe(): void {
    this.add.existing((this.pipes = new PipesComponent(this, 400, this.score)));
    this.pipes.setDepth(1);
    this.overlap = this.physics.add.overlap(this.bird, [...this.pipes.pipes], () => this.onCollision());
    this.pipes.on("outOfScreen", () => this.destroyPipes());
  }

  private destroyPipes(): void {
    this.pipes.destroy();
    this.pipes = null;
    this.overlap.destroy();
    this.buildPipe();

    ++this.score;
    this.updateScoreText();
  }

  private drawScore(): void {
    this.score = 0;
    this.bestScore = localStorage.getItem(STORAGE_NAME) ? +localStorage.getItem(STORAGE_NAME) : 0;

    this.scoreText = this.add.text(10, 10, `Score - ${this.score}\nBest - ${this.bestScore}`);

    this.scoreText.setDepth(3);
    this.updateScoreText();
  }

  private updateScoreText(): void {
    this.scoreText.text = `Score - ${this.score}\nBest - ${this.bestScore}`;
  }

  private showMessage(): void {
    if (this.message) {
      this.message.alpha = 1;
    } else {
      const { width: w, height: h } = this.game.config;
      this.message = this.add.image(+w / 2, +h / 2, TEXTURES, "message.png");
    }
  }

  private hideMessage(): void {
    this.message.alpha = 0;
  }

  private onCollision(): void {
    this.setGameState(GameState.die);
  }

  private changeLocalStorage(): void {
    this.bestScore = Math.max(this.score, this.bestScore);
    localStorage.setItem(STORAGE_NAME, `${this.bestScore}`);
  }

  private getSpeed(): number {
    return CONFIGS.speed + this.score * 0.1;
  }
}
