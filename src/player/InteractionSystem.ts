import Phaser from 'phaser';
import type { CaseLocation } from '../case/CaseData';
import type { ClueInspectionPoint } from '../case/EvidenceData';
import { GameState } from '../game/GameState';

export interface NearbyInteractable {
  type: 'clue' | 'npc' | 'door';
  id: string;
  name: string;
  promptText: string;
  x: number;
  y: number;
  distance: number;
  targetRef?: unknown;
}

export class InteractionSystem {
  private scene: Phaser.Scene;
  private location: CaseLocation;
  private promptContainer: Phaser.GameObjects.Container;
  private promptBg: Phaser.GameObjects.Graphics;
  private promptText: Phaser.GameObjects.Text;
  private currentInteractable: NearbyInteractable | null = null;
  private keyE: Phaser.Input.Keyboard.Key;
  private keyW: Phaser.Input.Keyboard.Key;
  private keyUp: Phaser.Input.Keyboard.Key;
  private keyEnter: Phaser.Input.Keyboard.Key;
  private keySpace: Phaser.Input.Keyboard.Key;

  private onInteractCallback?: (interactable: NearbyInteractable) => void;

  constructor(scene: Phaser.Scene, location: CaseLocation) {
    this.scene = scene;
    this.location = location;

    // Create interactive floating prompt HUD element
    this.promptContainer = scene.add.container(0, 0).setDepth(20).setVisible(false);
    this.promptBg = scene.add.graphics();
    this.promptText = scene.add.text(0, 0, '', {
      fontFamily: '"Courier New", monospace',
      fontSize: '13px',
      color: '#f4ede2',
      align: 'center'
    }).setOrigin(0.5);

    this.promptContainer.add([this.promptBg, this.promptText]);

    // Setup input listeners (W, Up, E, Enter, Space)
    this.keyE = scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.E);
    this.keyW = scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    this.keyUp = scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
    this.keyEnter = scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    this.keySpace = scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    // Mouse click on prompt container triggers interaction
    this.promptContainer.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      pointer.event?.stopPropagation();
      if (this.currentInteractable) {
        this.triggerInteraction(this.currentInteractable);
      }
    });

    this.setupVisualMarkers();
  }

  private setupVisualMarkers(): void {
    // Add pulsing ambient markers over clues
    for (const point of this.location.inspectionPoints) {
      const marker = this.scene.add.image(point.x, point.y - 30, 'marker_inspect')
        .setDepth(5)
        .setAlpha(0.75);

      this.scene.tweens.add({
        targets: marker,
        y: point.y - 36,
        alpha: 1,
        yoyo: true,
        duration: 900,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });
    }

    // Add doorway indicators for doors
    for (const door of this.location.doors) {
      const doorMarker = this.scene.add.text(door.x, door.y - 25, '🚪', {
        fontSize: '22px'
      }).setOrigin(0.5).setDepth(5).setAlpha(0.85);

      this.scene.tweens.add({
        targets: doorMarker,
        y: door.y - 30,
        alpha: 1,
        yoyo: true,
        duration: 1000,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });
    }
  }

  public update(playerX: number, playerY: number): void {
    const interactables: NearbyInteractable[] = [];
    const maxInteractDist = 65;
    const maxDoorDist = 90; // Generous trigger zone for doorways

    // Check inspection points
    for (const pt of this.location.inspectionPoints) {
      const dist = Math.abs(playerX - pt.x);
      if (dist < maxInteractDist) {
        interactables.push({
          type: 'clue',
          id: pt.id,
          name: pt.name,
          promptText: `[E / Click] ${pt.interactPrompt}`,
          x: pt.x,
          y: pt.y - 50,
          distance: dist,
          targetRef: pt
        });
      }
    }

    // Check NPCs
    for (const npc of this.location.npcs) {
      const dist = Math.abs(playerX - npc.x);
      if (dist < maxInteractDist) {
        interactables.push({
          type: 'npc',
          id: npc.suspectId,
          name: npc.name,
          promptText: `[E / Click] Question ${npc.name}`,
          x: npc.x,
          y: npc.y - 65,
          distance: dist,
          targetRef: npc
        });
      }
    }

    // Check Doors
    for (const door of this.location.doors) {
      const dist = Math.abs(playerX - door.x);
      if (dist < maxDoorDist) {
        interactables.push({
          type: 'door',
          id: door.targetLocationId,
          name: door.prompt,
          promptText: `🚪 [W / E / ↑ / Click] ${door.prompt}`,
          x: door.x,
          y: door.y - 70,
          distance: dist,
          targetRef: door
        });
      }
    }

    // Select nearest interactable
    if (interactables.length > 0) {
      interactables.sort((a, b) => a.distance - b.distance);
      this.currentInteractable = interactables[0];
      this.showPrompt(this.currentInteractable);
    } else {
      this.currentInteractable = null;
      this.promptContainer.setVisible(false);
    }

    // Check key presses (both E and W/Up/Enter work seamlessly for doors)
    if (this.currentInteractable) {
      const isDoor = this.currentInteractable.type === 'door';
      const pressedInteract =
        Phaser.Input.Keyboard.JustDown(this.keyE) ||
        Phaser.Input.Keyboard.JustDown(this.keyEnter) ||
        Phaser.Input.Keyboard.JustDown(this.keySpace);
      const pressedDoor =
        Phaser.Input.Keyboard.JustDown(this.keyW) ||
        Phaser.Input.Keyboard.JustDown(this.keyUp);

      if ((isDoor && (pressedDoor || pressedInteract)) || (!isDoor && pressedInteract)) {
        this.triggerInteraction(this.currentInteractable);
      }
    }
  }

  private showPrompt(item: NearbyInteractable): void {
    this.promptContainer.setPosition(item.x, item.y);
    this.promptText.setText(item.promptText);

    const bounds = this.promptText.getBounds();
    const padX = 14;
    const padY = 8;
    const w = bounds.width + padX * 2;
    const h = bounds.height + padY * 2;

    this.promptBg.clear();
    this.promptBg.fillStyle(0x0e1218, 0.92);
    this.promptBg.lineStyle(1.5, item.type === 'door' ? 0x48bb78 : 0xd4af37, 1);
    this.promptBg.fillRoundedRect(-w / 2, -h / 2, w, h, 4);
    this.promptBg.strokeRoundedRect(-w / 2, -h / 2, w, h, 4);

    this.promptContainer.setSize(w, h);
    this.promptContainer.setInteractive(
      new Phaser.Geom.Rectangle(-w / 2, -h / 2, w, h),
      Phaser.Geom.Rectangle.Contains
    );

    this.promptContainer.setVisible(true);
  }

  public triggerInteraction(item: NearbyInteractable): void {
    if (this.onInteractCallback) {
      this.onInteractCallback(item);
    }
  }

  public setOnInteract(callback: (interactable: NearbyInteractable) => void): void {
    this.onInteractCallback = callback;
  }

  public getCurrentInteractable(): NearbyInteractable | null {
    return this.currentInteractable;
  }
}
