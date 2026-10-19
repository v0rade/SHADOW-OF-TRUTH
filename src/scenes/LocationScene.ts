import Phaser from 'phaser';
import { GameState } from '../game/GameState';
import { PlayerController } from '../player/PlayerController';
import { InteractionSystem, type NearbyInteractable } from '../player/InteractionSystem';
import type { CaseLocation } from '../case/CaseData';

export class LocationScene extends Phaser.Scene {
  private locationId: string = 'loc_office';
  private locationData!: CaseLocation;
  private player!: PlayerController;
  private interactionSystem!: InteractionSystem;
  private keyTab!: Phaser.Input.Keyboard.Key;
  private keyB!: Phaser.Input.Keyboard.Key;
  private keyEsc!: Phaser.Input.Keyboard.Key;

  // External UI references dispatches
  public static onInspectClue?: (clueId: string, pointId: string) => void;
  public static onOpenNotebook?: () => void;
  public static onOpenBoard?: () => void;
  public static onOpenSettings?: () => void;
  public static onUpdateHud?: () => void;

  constructor(key: string = 'LocationScene') {
    super(key);
  }

  public init(data: { locationId?: string }): void {
    if (data.locationId) {
      this.locationId = data.locationId;
    } else {
      this.locationId = GameState.getInstance().currentLocationId;
    }
  }

  public create(): void {
    const state = GameState.getInstance();
    const loc = state.caseData.locations[this.locationId];
    if (!loc) {
      console.warn(`Location ${this.locationId} not found, defaulting to loc_office`);
      this.locationData = state.caseData.locations['loc_office'];
    } else {
      this.locationData = loc;
    }

    state.currentLocationId = this.locationData.id;

    const { width, height } = this.scale;

    // Set world bounds (walkable corridor x: 40 to 920, y: 0 to 540)
    this.physics.world.setBounds(40, 0, width - 80, height);

    // Add background texture for this location
    const bgKey = `bg_${this.locationData.id}`;
    if (this.textures.exists(bgKey)) {
      this.add.image(width / 2, height / 2, bgKey).setDepth(0);
    } else {
      this.add.image(width / 2, height / 2, 'bg_loc_office').setDepth(0);
    }

    // Atmospheric rain particles for scenes with rain windows/outdoors
    if (this.locationData.id === 'loc_office' || this.locationData.id === 'loc_crime_scene' || this.locationData.id === 'loc_sterling_office') {
      this.add.particles(0, -20, 'particle_rain', {
        x: { min: 0, max: width },
        speedY: { min: 420, max: 600 },
        speedX: { min: -40, max: -10 },
        lifespan: 1200,
        quantity: 2,
        alpha: { start: 0.35, end: 0.05 }
      }).setDepth(1);
    }

    // Spawn NPCs
    for (const npcData of this.locationData.npcs) {
      const suspect = state.caseData.suspects[npcData.suspectId];
      const npcSpriteKey = `npc_${suspect?.avatar || 'reed'}`;
      const npcSprite = this.physics.add.sprite(npcData.x, 440, npcSpriteKey);
      npcSprite.setCollideWorldBounds(true);
      npcSprite.setImmovable(true);
      npcSprite.setDepth(8);

      // Floating name label
      this.add.text(npcData.x, 400, npcData.name, {
        fontFamily: '"Courier New", monospace',
        fontSize: '11px',
        color: '#c4a77d',
        backgroundColor: 'rgba(10, 14, 20, 0.85)',
        padding: { x: 4, y: 2 }
      }).setOrigin(0.5).setDepth(9);
    }

    // Spawn Player
    const spawnX = state.playerPosition.x || 180;
    const spawnY = 440;
    this.player = new PlayerController(this, spawnX, spawnY);

    // Initialize Proximity Interaction System
    this.interactionSystem = new InteractionSystem(this, this.locationData);
    this.interactionSystem.setOnInteract((item) => this.handleInteraction(item));

    // Setup global keyboard shortcuts
    this.keyTab = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.TAB);
    this.keyB = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.B);
    this.keyEsc = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);

    // Notify HUD to update location and clues
    LocationScene.onUpdateHud?.();
  }

  public update(time: number, delta: number): void {
    if (this.player) {
      this.player.update(time, delta);
      const pos = this.player.getPosition();
      this.interactionSystem.update(pos.x, pos.y);
    }

    // Tab key: Toggle Notebook
    if (Phaser.Input.Keyboard.JustDown(this.keyTab)) {
      LocationScene.onOpenNotebook?.();
    }

    // B key: Toggle Investigation Board
    if (Phaser.Input.Keyboard.JustDown(this.keyB)) {
      LocationScene.onOpenBoard?.();
    }

    // Esc key: Toggle Settings / Menu
    if (Phaser.Input.Keyboard.JustDown(this.keyEsc)) {
      LocationScene.onOpenSettings?.();
    }
  }

  private handleInteraction(item: NearbyInteractable): void {
    const state = GameState.getInstance();

    if (item.type === 'door') {
      const targetLocationId = item.id;
      const canChange = state.changeLocation(targetLocationId);
      if (canChange) {
        this.scene.restart({ locationId: targetLocationId });
      } else {
        alert('This location is currently locked. Uncover more clues or speak with witnesses to unlock.');
      }
      return;
    }

    if (item.type === 'npc') {
      const suspect = state.caseData.suspects[item.id];
      if (suspect) {
        this.player.setLocked(true);
        state.dialogueManager.startDialogue(suspect);
      }
      return;
    }

    if (item.type === 'clue') {
      state.markInspectionPointExamined(item.id);

      const inspectPoint = this.locationData.inspectionPoints.find(p => p.id === item.id);
      if (inspectPoint && inspectPoint.evidenceId) {
        state.evidenceManager.collectEvidence(inspectPoint.evidenceId);
        LocationScene.onInspectClue?.(inspectPoint.evidenceId, item.id);
      } else if (item.id === 'inspect_office_board') {
        LocationScene.onOpenBoard?.();
      } else if (item.id === 'inspect_office_desk') {
        LocationScene.onOpenNotebook?.();
      }
      LocationScene.onUpdateHud?.();
    }
  }

  public setPlayerLocked(locked: boolean): void {
    if (this.player) {
      this.player.setLocked(locked);
    }
  }
}
