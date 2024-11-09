import * as Phaser from "phaser";
import { CONFIGS } from "./configs";
import { GameState, STORAGE_NAME, TEXTURES } from "./constants";
import { BirdComponent } from "./views/bird-component";
import { PipesComponent } from "./views/pipes-component";
import { PopupComponent } from "./views/popup-component";

export class GameScene extends Phaser.Scene {
  private score = 0;
  private bestScore = 0;
  private scoreText: Phaser.GameObjects.Text;

  private bkg: Phaser.GameObjects.TileSprite;
  private bird: BirdComponent;

  private pipes: PipesComponent[] = [];
  private popup: PopupComponent;
  private message: Phaser.GameObjects.Image;

  private overlap: Phaser.Physics.Arcade.Collider;

  private state: GameState = GameState.undefined;

  public create(): void {
    this.buildBg();
    this.buildBird();
    this.drawScore();

    this.updateGameState(GameState.preAction);
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

  private onPointerDown(e: Phaser.Input.Pointer): void {
    if (e.wasTouch) return;

    switch (this.state) {
      case GameState.action:
        this.bird.jump();
        break;
      case GameState.preAction:
        this.updateGameState(GameState.action);
        this.startAction();
        break;
      case GameState.result:
        this.popup.destroy();
        this.updateGameState(GameState.preAction);
        break;

      default:
        break;
    }
  }

  private actionsUpdates(): void {
    this.updateBird();
    this.moveBkg();
    this.movePipes();
  }

  private updateBird(): void {
    if (this.bird.y > +this.game.config.height) {
      this.updateGameState(GameState.die);
    }
    if (this.bird.y <= 0) {
      this.bird.y = 0;
      this.bird.body.velocity.y = 0;
    }
    this.bird.update();
  }

  private moveBkg(): void {
    this.bkg.tilePositionX += CONFIGS.speed;
  }

  private movePipes(): void {
    const speed = getSpeed(this.score);
    this.pipes.forEach((p, i) => {
      p.x -= speed;
      if (p.x <= -p.getWidth() / 2) {
        p.destroy();
        this.pipes.splice(i, 1);
        this.addPipe();
        this.updateOverlap();

        this.updateScoreText(this.score + 1);
      }
    });
  }

  private dieUpdates(): void {
    if (this.bird.y > +this.game.config.height) {
      this.bird.y = +this.game.config.height - 5;
      this.bird.disablePhysics();
      this.updateGameState(GameState.result);
    }
  }

  private updateGameState(state: GameState): void {
    if (this.state === state) return;

    this.state = state;

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

  private startAction(): void {
    this.addPipe();
    this.addPipe();
    this.addPipe();
    this.updateOverlap();
    this.hideMessage();
    this.bird.enablePhysics();
    this.bird.jump();
  }

  private reset(): void {
    this.updateScoreText(0);
    this.destroyPipes();
    this.bird.resetPosition();
    this.showMessage();
  }

  private buildBg(): void {
    this.bkg = this.add.tileSprite(256, 256, 512, 512, TEXTURES, "bg.png");
    this.bkg.setInteractive();
    this.bkg.on("pointerdown", (e: Phaser.Input.Pointer) => this.onPointerDown(e));
  }

  private buildBird(): void {
    this.bird = new BirdComponent(this);
    this.bird.setDepth(2);
    this.add.existing(this.bird);
  }

  private showPopup(): void {
    this.popup = new PopupComponent(this, this.score, this.bestScore);
    this.add.existing(this.popup);
  }

  private addPipe(): void {
    const pipe = new PipesComponent(this, this.score);
    const pipeX = this.pipes.length
      ? this.pipes[this.pipes.length - 1].x + 200
      : +this.game.config.width + pipe.getWidth() / 2;
    pipe.x = pipeX;
    this.add.existing(pipe);
    this.pipes.push(pipe);
  }

  private destroyPipes(): void {
    this.pipes.forEach((p) => p.destroy());
    this.pipes = [];
    this.overlap?.destroy();
    this.overlap = null;
  }

  private drawScore(): void {
    this.score = 0;

    this.bestScore = getBestScore();
    this.scoreText = this.add.text(10, 10, getScoreText(this.score, this.bestScore));

    this.scoreText.setDepth(3);
    this.updateScoreText(0);
  }

  private updateScoreText(score: number): void {
    this.score = score;
    this.scoreText.text = getScoreText(this.score, this.bestScore);
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

  private updateOverlap(): void {
    const allPipes = this.pipes.map((p) => p.pipes).flat();
    this.overlap?.destroy();
    this.overlap = this.physics.add.overlap(this.bird, allPipes, () => this.updateGameState(GameState.die));
  }

  private changeLocalStorage(): void {
    this.bestScore = Math.max(this.score, this.bestScore);
    localStorage.setItem(STORAGE_NAME, `${this.bestScore}`);
  }
}

const getSpeed = (score: number): number => {
  return CONFIGS.speed + score * 0.1;
};

const getBestScore = (): number => {
  return localStorage.getItem(STORAGE_NAME) ? +localStorage.getItem(STORAGE_NAME) : 0;
};

const getScoreText = (currentScore: number, bestScore: number): string => {
  return `Score - ${currentScore}\nBest - ${bestScore}`;
};
