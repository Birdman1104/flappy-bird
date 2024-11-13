import PhaserDoms from "@rollinsafary/phaser3-doms-plugin";
import * as Phaser from "phaser";
import Stats from "stats.js";
import { SoundController } from "./SoundController";
import { getBestScore, getSpeed, updateBestScore } from "./Utils";
import { BASE, BKG_DAY, BKG_NIGHT, GameState, MESSAGE } from "./constants";
import { Bird } from "./views/Bird";
import { Pipes } from "./views/Pipes";
import { GameOverPopup } from "./views/Popup";
import { Score } from "./views/Score";

export class GameScene extends PhaserDoms.Scene {
  private stats: Stats;

  // private spaceKey: Phaser.Input.Keyboard.Key;

  private score = 0;
  private bestScore = getBestScore();
  private scoreText: Score;

  // private flash: Phaser.GameObjects.Graphics;
  private bkgDay: PhaserDoms.GameObjects.Image;
  private bkgNight: PhaserDoms.GameObjects.Image;
  private base: PhaserDoms.GameObjects.Image;
  private bird: Bird;

  private pipes: Pipes[] = [];
  private gameOverPopup: GameOverPopup;
  private message: PhaserDoms.GameObjects.Image;

  private overlap: Phaser.Physics.Arcade.Collider;

  private state: GameState = GameState.undefined;

  private soundController: SoundController;

  private accumulator = 0;
  private readonly frameTime = 1000 / 60; // 60 FPS

  public create(): void {
    this.soundController = new SoundController(this);

    // this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    // this.initStats();
    this.buildBg();
    this.buildBase();
    this.buildBird();
    this.drawScore();
    // this.drawFlash();

    this.updateGameState(GameState.preAction);
  }

  public update(_time: number, dt: number): void {
    this.accumulator += dt;
    while (this.accumulator >= this.frameTime) {
      this.accumulator -= this.frameTime;

      // if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
      //   this.onInputDown();
      // }

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

  private onInputDown(): void {
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
    // const speed = getSpeed(this.score);
    // this.bkgDay.tilePositionX += speed * 0.8;
    // this.bkgNight.tilePositionX += speed * 0.8;
    // this.base.tilePositionX += speed;
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
        // this.flashScreen();
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
    this.bkgDay = this.add.existing(new PhaserDoms.GameObjects.Image(this, 256, 256, BKG_DAY));
    this.bkgDay.on("pointerdown", () => this.onInputDown());

    this.bkgNight = this.add.existing(new PhaserDoms.GameObjects.Image(this, 256, 256, BKG_NIGHT));
    this.bkgNight.alpha = 0;
  }

  private buildBase(): void {
    this.base = this.add.existing(new PhaserDoms.GameObjects.Image(this, 256, 256, BASE));
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

  private drawFlash(): void {
    // this.flash = this.add.graphics();
    // this.flash.fillStyle(0xffffff, 1);
    // this.flash.fillRect(0, 0, +this.game.config.width, +this.game.config.height);
    // this.flash.setDepth(5);
    // this.flash.setInteractive();
    // this.tweens.add({
    //   targets: this.flash,
    //   alpha: 0,
    //   duration: 1000,
    //   ease: "Linear",
    //   repeat: 0,
    //   onComplete: () => {
    //     // this.flash.disableInteractive();
    //     this.bkgDay.setInteractive();
    //   },
    // });
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
      this.message = this.add.existing(new PhaserDoms.GameObjects.Image(this, +w / 2, +h / 2, MESSAGE));
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
    updateBestScore(this.bestScore);
  }

  private resetBkg(): void {
    // this.bkgDay.tilePositionX = 0;
    // this.bkgNight.tilePositionX = 0;
    this.bkgNight.alpha = 0;
  }

  private stopTweens(): void {
    this.tweens.killTweensOf(this.bkgNight);
    this.tweens.killTweensOf(this.bkgDay);
  }

  private flashScreen(): void {
    // this.tweens.add({
    //   targets: this.flash,
    //   alpha: 0.7,
    //   duration: 200,
    //   yoyo: true,
    //   ease: Phaser.Math.Easing.Sine.InOut,
    //   repeat: 0,
    //   onComplete: () => {
    //     this.flash.alpha = 0;
    //   },
    // });
    // this.flash.alpha = 1;
    // this.flash.setInteractive();
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
