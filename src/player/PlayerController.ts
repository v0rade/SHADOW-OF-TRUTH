import Phaser from 'phaser';
import { GameState } from '../game/GameState';

export class PlayerController {
  private scene: Phaser.Scene;
  public sprite: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  private keyA: Phaser.Input.Keyboard.Key;
  private keyD: Phaser.Input.Keyboard.Key;
  private keyW: Phaser.Input.Keyboard.Key;
  private keyE: Phaser.Input.Keyboard.Key;
  private isLocked: boolean = false;
  private footstepTimer: number = 0;
  private readonly moveSpeed: number = 180;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    this.scene = scene;

    // Create player arcade physics sprite
    this.sprite = scene.physics.add.sprite(x, y, 'player', 0);
    this.sprite.setCollideWorldBounds(true);
    this.sprite.setDepth(10);
    this.sprite.setSize(20, 44);
    this.sprite.setOffset(6, 4);

    // Setup input keys
    this.cursors = scene.input.keyboard!.createCursorKeys();
    this.keyA = scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.keyD = scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    this.keyW = scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    this.keyE = scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.E);

    // Create animations if not already registered
    if (!scene.anims.exists('player_idle')) {
      scene.anims.create({
        key: 'player_idle',
        frames: scene.anims.generateFrameNumbers('player', { start: 0, end: 0 }),
        frameRate: 1,
        repeat: -1
      });

      scene.anims.create({
        key: 'player_walk',
        frames: scene.anims.generateFrameNumbers('player', { start: 1, end: 3 }),
        frameRate: 7,
        repeat: -1
      });
    }

    this.sprite.play('player_idle');
  }

  public update(time: number, delta: number): void {
    if (this.isLocked) {
      this.sprite.setVelocityX(0);
      this.sprite.play('player_idle', true);
      return;
    }

    let moveX = 0;
    if (this.cursors.left.isDown || this.keyA.isDown) {
      moveX = -1;
    } else if (this.cursors.right.isDown || this.keyD.isDown) {
      moveX = 1;
    }

    if (moveX !== 0) {
      this.sprite.setVelocityX(moveX * this.moveSpeed);
      this.sprite.setFlipX(moveX < 0);
      this.sprite.play('player_walk', true);

      // Footstep audio pacing
      this.footstepTimer += delta;
      if (this.footstepTimer >= 360) {
        GameState.getInstance().audio.playFootstep();
        this.footstepTimer = 0;
      }
    } else {
      this.sprite.setVelocityX(0);
      this.sprite.play('player_idle', true);
      this.footstepTimer = 200; // Reset so next step sounds snappy
    }

    // Keep player grounded at baseline y (440)
    this.sprite.setY(440);

    // Sync player position to GameState
    GameState.getInstance().playerPosition = {
      x: Math.round(this.sprite.x),
      y: Math.round(this.sprite.y)
    };
  }

  public setLocked(locked: boolean): void {
    this.isLocked = locked;
    if (locked) {
      this.sprite.setVelocityX(0);
      this.sprite.play('player_idle', true);
    }
  }

  public getIsLocked(): boolean {
    return this.isLocked;
  }

  public getPosition(): { x: number; y: number } {
    return { x: this.sprite.x, y: this.sprite.y };
  }
}
