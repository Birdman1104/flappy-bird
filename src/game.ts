import { Scenes } from "./constants";
import { GameScene } from "./scenes/GameScene";
import { PreloadScene } from "./scenes/PreloadScene";

export class Game extends Phaser.Game {
  public constructor(private gameConfig: Phaser.Types.Core.GameConfig) {
    super(gameConfig);

    this.initializeScenes();

    this.scene.start(Scenes.preload);
  }

  private initializeScenes(): void {
    this.scene.add(Scenes.preload, new PreloadScene(this.gameConfig));
    this.scene.add(Scenes.game, new GameScene(this.gameConfig));
  }
}
