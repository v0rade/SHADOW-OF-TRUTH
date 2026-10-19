import Phaser from 'phaser';
import { GameState } from '../game/GameState';
import { SaveManager } from '../persistence/SaveManager';

export class MenuScene extends Phaser.Scene {
  constructor() {
    super('MenuScene');
  }

  public create(): void {
    const { width, height } = this.scale;

    // Dark background
    this.add.rectangle(width / 2, height / 2, width, height, 0x07090d);

    // Rainy window backdrop
    this.add.image(width / 2, height / 2, 'bg_loc_office').setAlpha(0.35);

    // Atmospheric rain particle emitter
    this.add.particles(0, -20, 'particle_rain', {
      x: { min: 0, max: width },
      speedY: { min: 380, max: 550 },
      speedX: { min: -40, max: -10 },
      lifespan: 1200,
      quantity: 3,
      alpha: { start: 0.7, end: 0.1 }
    });

    // Title Texts
    const titleText = this.add.text(width / 2, 120, 'SHADOWS OF TRUTH', {
      fontFamily: 'Georgia, "Times New Roman", serif',
      fontSize: '44px',
      color: '#d4af37',
      stroke: '#000',
      strokeThickness: 6
    }).setOrigin(0.5);

    this.add.text(width / 2, 170, 'A 2D Noir Detective Investigation', {
      fontFamily: '"Courier New", monospace',
      fontSize: '15px',
      color: '#c4a77d',
      letterSpacing: 2
    }).setOrigin(0.5);

    this.add.text(width / 2, 205, 'Case 01: The Fall of Arthur Vance', {
      fontFamily: '"Courier New", monospace',
      fontSize: '13px',
      color: '#8a9aa8'
    }).setOrigin(0.5);

    // Subtle title breathing animation
    this.tweens.add({
      targets: titleText,
      scaleX: 1.02,
      scaleY: 1.02,
      yoyo: true,
      duration: 2500,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    // Menu Buttons Container
    let startY = 270;
    const buttonSpacing = 55;

    // New Game Button
    this.createMenuButton(width / 2, startY, 'NEW INVESTIGATION', () => {
      this.startGame(false);
    });

    // Continue Game Button (if save exists)
    const hasSave = SaveManager.hasSave();
    startY += buttonSpacing;
    const continueBtn = this.createMenuButton(
      width / 2,
      startY,
      hasSave ? 'CONTINUE CASE' : 'CONTINUE CASE (NO SAVE)',
      () => {
        if (hasSave) {
          this.startGame(true);
        }
      }
    );
    if (!hasSave) {
      continueBtn.setAlpha(0.4);
    }

    // Controls text at bottom
    this.add.text(width / 2, height - 35, '[A/D or Arrows] Move  |  [W] Doors  |  [E] Inspect  |  [Tab] Notebook  |  [B] Murder Board', {
      fontFamily: '"Courier New", monospace',
      fontSize: '11px',
      color: '#657383'
    }).setOrigin(0.5);
  }

  private createMenuButton(x: number, y: number, text: string, callback: () => void): Phaser.GameObjects.Container {
    const container = this.add.container(x, y);

    const bg = this.add.graphics();
    bg.fillStyle(0x131a24, 0.9);
    bg.lineStyle(2, 0xc4a77d, 1);
    bg.fillRoundedRect(-140, -18, 280, 36, 4);
    bg.strokeRoundedRect(-140, -18, 280, 36, 4);

    const label = this.add.text(0, 0, text, {
      fontFamily: '"Courier New", monospace',
      fontSize: '14px',
      color: '#f0e8dc',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    container.add([bg, label]);
    container.setSize(280, 36);
    container.setInteractive({ useHandCursor: true });

    container.on('pointerover', () => {
      bg.clear();
      bg.fillStyle(0x273447, 0.95);
      bg.lineStyle(2, 0xd4af37, 1);
      bg.fillRoundedRect(-140, -18, 280, 36, 4);
      bg.strokeRoundedRect(-140, -18, 280, 36, 4);
      label.setColor('#d4af37');
      GameState.getInstance().audio.playUiClick();
    });

    container.on('pointerout', () => {
      bg.clear();
      bg.fillStyle(0x131a24, 0.9);
      bg.lineStyle(2, 0xc4a77d, 1);
      bg.fillRoundedRect(-140, -18, 280, 36, 4);
      bg.strokeRoundedRect(-140, -18, 280, 36, 4);
      label.setColor('#f0e8dc');
    });

    container.on('pointerdown', () => {
      callback();
    });

    return container;
  }

  private startGame(isContinue: boolean): void {
    const state = GameState.getInstance();
    state.audio.ensureContext();
    state.audio.startNoirMusic();
    state.audio.startRain();

    if (isContinue) {
      state.loadSavedGame();
    }

    this.scene.start('LocationScene', { locationId: state.currentLocationId });
  }
}
