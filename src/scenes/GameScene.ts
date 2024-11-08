import { MainView } from "../views/MainView";

export class GameScene extends Phaser.Scene {
  private mainView: MainView;

  public create(): void {
    this.buildMainView();
  }

  public update(): void {
    this.mainView.update();
  }

  private buildMainView(): void {
    this.mainView = new MainView(this);
    this.add.existing(this.mainView);
  }
}
