import * as Phaser from "phaser";
import Stats from "stats.js";
import { SoundController } from "./SoundController";
import { CONFIGS } from "./configs";
import { BKG_DAY, BKG_NIGHT, GameState, STORAGE_NAME, TEXTURES } from "./constants";
import { Bird } from "./views/Bird";
import { Pipes } from "./views/Pipes";
import { GameOverPopup } from "./views/Popup";
import { Score } from "./views/Score";

export class GameScene extends Phaser.Scene {
  private stats: Stats;

  private score = 0;
  private bestScore = getBestScore();
  private scoreText: Score;

  private bkgDay: Phaser.GameObjects.TileSprite;
  private bkgNight: Phaser.GameObjects.TileSprite;
  private base: Phaser.GameObjects.TileSprite;
  private bird: Bird;

  private pipes: Pipes[] = [];
  private gameOverPopup: GameOverPopup;
  private message: Phaser.GameObjects.Image;

  private overlap: Phaser.Physics.Arcade.Collider;

  private state: GameState = GameState.undefined;

  private soundController: SoundController;

  private accumulator = 0;
  private readonly frameTime = 1000 / 60; // 60 FPS

  public create(): void {
    this.soundController = new SoundController(this);
    // this.initStats();
    this.buildBg();
    this.buildBase();
    this.buildBird();
    this.drawScore();

    this.updateGameState(GameState.preAction);
  }

  public update(_time: number, dt: number): void {
    this.accumulator += dt;
    while (this.accumulator >= this.frameTime) {
      this.accumulator -= this.frameTime;

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      this.stats?.update();
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
  }

  private onPointerDown(_e: Phaser.Input.Pointer): void {
    // if (e.wasTouch) return;

    switch (this.state) {
      case GameState.action:
        this.soundController.playWing();
        this.bird.jump();
        break;
      case GameState.preAction:
        this.updateGameState(GameState.action);
        this.soundController.playWing();
        this.startAction();
        break;
      case GameState.result:
        this.gameOverPopup.destroy();
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
    if (this.bird.y > 380) {
      this.updateGameState(GameState.die);
    }
    if (this.bird.y <= 0) {
      this.bird.y = 0;
      this.bird.body.velocity.y = 0;
    }
    this.bird.update();
  }

  private moveBkg(): void {
    const speed = getSpeed(this.score);
    this.bkgDay.tilePositionX += speed * 0.8;
    this.bkgNight.tilePositionX += speed * 0.8;
    this.base.tilePositionX += speed;
  }

  private movePipes(): void {
    const speed = getSpeed(this.score);
    this.pipes.forEach((p) => {
      p.x -= speed;
      if (p.x <= this.bird.x && !p.isScored) {
        p.isScored = true;
        this.updateScoreText(++this.score);
      }

      if (p.x <= -p.getWidth() / 2) {
        p.destroy();
        this.pipes.shift();
        this.addPipe();
        this.updateOverlap();
      }
    });
  }

  private dieUpdates(): void {
    if (this.bird.y > 380) {
      this.bird.y = 400;
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
        this.resetBkg();
        break;
      case GameState.result:
        this.showPopup();
        this.changeLocalStorage();
        break;
      case GameState.die:
        this.soundController.playHit();
        this.soundController.playDie();
        this.bird.die();
        this.stopTweens();
        break;
      case GameState.action:
        this.startDaySwitching();
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
    this.bkgDay = this.add.tileSprite(256, 256, 512, 512, BKG_DAY);
    this.bkgDay.setInteractive();
    this.bkgDay.on("pointerdown", (e: Phaser.Input.Pointer) => this.onPointerDown(e));

    this.bkgNight = this.add.tileSprite(256, 256, 512, 512, BKG_NIGHT);
    this.bkgNight.alpha = 0;
  }

  private buildBase(): void {
    this.base = this.add.tileSprite(160, 460, 330, 112, TEXTURES, "base.png");
    this.base.setDepth(4);
  }

  private buildBird(): void {
    this.bird = new Bird(this);
    this.bird.setDepth(2);
    this.add.existing(this.bird);
  }

  private showPopup(): void {
    this.gameOverPopup = new GameOverPopup(this, this.score, this.bestScore);
    this.add.existing(this.gameOverPopup);
  }

  private addPipe(): void {
    const pipe = new Pipes(this, this.score, this.bkgNight.alpha);
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

    this.scoreText = new Score(this);
    this.scoreText.setDepth(3);
    this.scoreText.x = +this.game.config.width / 2;
    this.scoreText.y = 50;
    this.add.existing(this.scoreText);
  }

  private updateScoreText(score: number): void {
    score !== 0 && this.soundController.playPoint();
    this.score = score;
    this.scoreText.updateScore(this.score);
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

  private resetBkg(): void {
    this.bkgDay.tilePositionX = 0;
    this.bkgNight.tilePositionX = 0;
    this.bkgNight.alpha = 0;
  }

  private stopTweens(): void {
    this.tweens.killTweensOf(this.bkgNight);
    this.tweens.killTweensOf(this.bkgDay);
  }

  private startDaySwitching(): void {
    this.tweens.add({
      targets: this.bkgNight,
      alpha: 1,
      duration: 15000,
      yoyo: true,
      repeat: -1,
    });
  }

  private initStats(): void {
    this.stats = new Stats();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    document.body.appendChild(this.stats.dom);
  }
}

const getSpeed = (score: number): number => {
  return CONFIGS.speed + score * 0.1;
};

const getBestScore = (): number => {
  return localStorage.getItem(STORAGE_NAME) ? +localStorage.getItem(STORAGE_NAME) : 0;
};

// const getScoreText = (currentScore: number, bestScore: number): string => {
//   return `Score - ${currentScore}\nBest - ${bestScore}`;
// };
