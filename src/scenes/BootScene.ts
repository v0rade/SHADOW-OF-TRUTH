import Phaser from 'phaser';
import { AssetGenerator } from './AssetGenerator';

export class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  public preload(): void {
    // Generate all procedural pixel-art textures and portraits
    AssetGenerator.generateAllTextures(this);
  }

  public create(): void {
    this.scene.start('MenuScene');
  }
}
