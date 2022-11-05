import * as Phaser from "phaser";
import { CONFIGS } from "./configs";
import { GameState, STORAGE_NAME, TEXTURES } from "./constants";
import { BirdComponent } from "./views/bird-component";
import { PipesComponent } from "./views/pipes-component";
import { PopupComponent } from "./views/popup-component";

export class GameScene extends Phaser.Scene {
  private _bg: Phaser.GameObjects.TileSprite;
  private _bird: BirdComponent;
  private _pipes: PipesComponent;
  private _popup: PopupComponent;
  private _message: Phaser.GameObjects.Image;
  private _score = 0;
  private _bestScore = 0;
  private _scoreText: Phaser.GameObjects.Text;
  private _overlap: Phaser.Physics.Arcade.Collider;
  private _state: GameState = GameState.undefined;

  public create(): void {
    this._buildBg();
    this._buildBird();
    this._drawScore();

    this._setGameState(GameState.preAction);
  }

  public update(): void {
    switch (this._state) {
      case GameState.action:
        this._actionsUpdates();
        break;
      case GameState.die:
        this._dieUpdates();
        break;

      default:
        break;
    }
  }

  private _onStateUpdate(): void {
    switch (this._state) {
      case GameState.preAction:
        this._reset();
        break;
      case GameState.result:
        this._showPopup();
        this._changeLocalStorage();
        break;
      case GameState.die:
        this._bird.die();
        break;
      default:
        break;
    }
  }

  private _onPointerDown(e: Phaser.Input.Pointer): void {
    if (e.wasTouch) {
      return;
    }

    switch (this._state) {
      case GameState.action:
        this._bird.jump();
        break;
      case GameState.preAction:
        this._setGameState(GameState.action);
        this._startAction();
        break;
      case GameState.result:
        this._popup.destroy();
        this._setGameState(GameState.preAction);
        break;

      default:
        break;
    }
  }

  private _actionsUpdates(): void {
    if (this._bird.y > this.game.config.height) {
      this._setGameState(GameState.die);
    }

    if (this._bird.y <= 0) {
      this._bird.y = 0;
      this._bird.body.velocity.y = 0;
    }

    const speed = this._getSpeed();

    this._bird.update();
    this._bg.tilePositionX += CONFIGS.speed;
    this._pipes.move(speed);
  }

  private _dieUpdates(): void {
    if (this._bird.y > +this.game.config.height) {
      this._bird.y = +this.game.config.height - 5;
      this._bird.disablePhysics();
      this._setGameState(GameState.result);
    }
  }

  private _setGameState(state: GameState): void {
    if (this._state !== state) {
      this._state = state;
      this._onStateUpdate();
    }
  }

  private _startAction(): void {
    this._buildPipe();
    this._hideMessage();
    this._bird.enablePhysics();
    this._bird.jump();
  }

  private _reset(): void {
    this._score = 0;
    this._updateScoreText();
    this._pipes && this._pipes.destroy();
    this._bird.resetPosition();
    this._showMessage();
  }

  private _buildBg(): void {
    this._bg = this.add.tileSprite(256, 256, 512, 512, TEXTURES, "bg.png");
    this._bg.setInteractive();
    this._bg.on("pointerdown", (e: Phaser.Input.Pointer) => this._onPointerDown(e));
  }

  private _buildBird(): void {
    this.add.existing((this._bird = new BirdComponent(this)));
    this._bird.setDepth(2);
  }

  private _showPopup(): void {
    this.add.existing((this._popup = new PopupComponent(this, this._score, this._bestScore)));
  }

  private _buildPipe(): void {
    this.add.existing((this._pipes = new PipesComponent(this, 400, this._score)));
    this._pipes.setDepth(1);
    this._overlap = this.physics.add.overlap(this._bird, [...this._pipes.getPipes()], () => this._onCollision());
    this._pipes.on("outOfScreen", () => this._destroyPipes());
  }

  private _destroyPipes(): void {
    this._pipes.destroy();
    this._pipes = null;
    this._overlap.destroy();
    this._buildPipe();

    ++this._score;
    this._updateScoreText();
  }

  private _drawScore(): void {
    this._score = 0;
    this._bestScore = localStorage.getItem(STORAGE_NAME) ? +localStorage.getItem(STORAGE_NAME) : 0;

    this._scoreText = this.add.text(10, 10, `Score - ${this._score}\nBest - ${this._bestScore}`);

    this._scoreText.setDepth(3);
    this._updateScoreText();
  }

  private _updateScoreText(): void {
    this._scoreText.text = `Score - ${this._score}\nBest - ${this._bestScore}`;
  }

  private _showMessage(): void {
    if (this._message) {
      this._message.alpha = 1;
    } else {
      const { width: w, height: h } = this.game.config;
      this._message = this.add.image(+w / 2, +h / 2, TEXTURES, "message.png");
    }
  }

  private _hideMessage(): void {
    this._message.alpha = 0;
  }

  private _onCollision(): void {
    this._setGameState(GameState.die);
  }

  private _changeLocalStorage(): void {
    this._bestScore = Math.max(this._score, this._bestScore);
    localStorage.setItem(STORAGE_NAME, `${this._bestScore}`);
  }

  private _getSpeed(): number {
    return CONFIGS.speed + this._score * 0.1;
  }
}
