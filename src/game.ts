import { SCENE_NAMES } from "./constants";
import { GameScene } from "./game-scene";
import { PreloadScene } from "./preload-scene";

export class Game extends Phaser.Game {
  public constructor(private gameConfig: Phaser.Types.Core.GameConfig) {
    super(gameConfig);

    this.initializeScenes();

    this.scene.start(SCENE_NAMES.preload);
  }

  private initializeScenes(): void {
    this.scene.add(SCENE_NAMES.preload, new PreloadScene(this.gameConfig));
    this.scene.add(SCENE_NAMES.game, new GameScene(this.gameConfig));
  }
}
