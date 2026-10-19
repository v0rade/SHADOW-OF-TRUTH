import type Phaser from 'phaser';

export class SceneManager {
  private game: Phaser.Game;

  constructor(game: Phaser.Game) {
    this.game = game;
  }

  public goToScene(key: string, data?: object): void {
    const currentScenes = this.game.scene.getScenes(true);
    for (const sc of currentScenes) {
      this.game.scene.stop(sc.scene.key);
    }
    this.game.scene.start(key, data);
  }

  public getActiveScene(): Phaser.Scene | undefined {
    const currentScenes = this.game.scene.getScenes(true);
    return currentScenes[0];
  }
}
