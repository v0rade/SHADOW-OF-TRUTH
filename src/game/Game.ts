import Phaser from 'phaser';
import { BootScene } from '../scenes/BootScene';
import { MenuScene } from '../scenes/MenuScene';
import { LocationScene } from '../scenes/LocationScene';
import { OfficeScene } from '../scenes/OfficeScene';
import { CrimeScene } from '../scenes/CrimeScene';
import { SceneManager } from './SceneManager';

export class Game {
  public phaserGame: Phaser.Game;
  public sceneManager: SceneManager;

  constructor(parentContainerId: string = 'phaser-canvas-container') {
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: 960,
      height: 540,
      parent: parentContainerId,
      pixelArt: true,
      antialias: false,
      roundPixels: true,
      backgroundColor: '#07090d',
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { x: 0, y: 0 },
          debug: false
        }
      },
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
      },
      scene: [BootScene, MenuScene, LocationScene, OfficeScene, CrimeScene]
    };

    this.phaserGame = new Phaser.Game(config);
    this.sceneManager = new SceneManager(this.phaserGame);
  }
}
