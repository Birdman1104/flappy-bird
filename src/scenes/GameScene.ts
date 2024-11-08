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
    console.warn(345678);

    this.mainView = new MainView(this);
    this.add.existing(this.mainView);
  }
}
