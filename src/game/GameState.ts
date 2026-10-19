import { CASE_01 } from '../data/case01/case';
import type { CaseDefinition, CaseLocation } from '../case/CaseData';
import { EvidenceManager } from '../investigation/EvidenceManager';
import { TimelineManager } from '../investigation/TimelineManager';
import { DeductionEngine } from '../investigation/DeductionEngine';
import { InvestigationBoard } from '../investigation/InvestigationBoard';
import { NotebookManager } from '../investigation/NotebookManager';
import { DialogueManager } from '../dialogue/DialogueManager';
import { AudioManager } from '../audio/AudioManager';
import { SaveManager, type GameSaveData } from '../persistence/SaveManager';

export class GameState {
  private static instance: GameState | null = null;

  public caseData: CaseDefinition;
  public evidenceManager: EvidenceManager;
  public timelineManager: TimelineManager;
  public deductionEngine: DeductionEngine;
  public investigationBoard: InvestigationBoard;
  public notebookManager: NotebookManager;
  public dialogueManager: DialogueManager;
  public audio: AudioManager;

  public currentLocationId: string = 'loc_office';
  public playerPosition: { x: number; y: number } = { x: 200, y: 440 };
  public examinedInspectionPoints: Set<string> = new Set();
  public unlockedLocations: Set<string> = new Set(['loc_office', 'loc_crime_scene', 'loc_newspaper_office']);

  // Callbacks for UI updates
  private onLocationChangeListeners: Array<(location: CaseLocation) => void> = [];
  private onSaveListeners: Array<() => void> = [];

  private constructor() {
    this.caseData = JSON.parse(JSON.stringify(CASE_01));
    this.evidenceManager = new EvidenceManager(this.caseData.evidence);
    this.timelineManager = new TimelineManager(this.caseData.timeline);
    this.deductionEngine = new DeductionEngine(this.caseData.deductionRules);
    this.investigationBoard = new InvestigationBoard();
    this.notebookManager = new NotebookManager(
      this.caseData,
      this.evidenceManager,
      this.timelineManager,
      this.deductionEngine
    );
    this.dialogueManager = new DialogueManager(
      this.evidenceManager,
      this.deductionEngine,
      this.notebookManager
    );
    this.audio = AudioManager.getInstance();

    // Wire up events
    this.evidenceManager.onEvidenceCollected(evidence => {
      this.investigationBoard.syncWithCollectedEvidence(this.evidenceManager);
      this.audio.playInspectChime();
    });

    this.deductionEngine.onDeductionUnlocked(rule => {
      this.audio.playBreakthroughChord();
      if (rule.unlocksLocationId) {
        this.unlockLocation(rule.unlocksLocationId);
      }
    });

    this.dialogueManager.onLocationUnlocked(locId => {
      this.unlockLocation(locId);
    });

    this.dialogueManager.onBreakthrough(() => {
      this.audio.playBreakthroughChord();
    });

    // Populate initial board state with already known notes if any
    this.investigationBoard.syncWithCollectedEvidence(this.evidenceManager);
  }

  public static getInstance(): GameState {
    if (!GameState.instance) {
      GameState.instance = new GameState();
    }
    return GameState.instance;
  }

  public static resetInstance(): GameState {
    GameState.instance = new GameState();
    return GameState.instance;
  }

  public getCurrentLocation(): CaseLocation {
    const loc = this.caseData.locations[this.currentLocationId];
    if (!loc) {
      return this.caseData.locations['loc_office'];
    }
    return loc;
  }

  public changeLocation(locationId: string, spawnPos?: { x: number; y: number }): boolean {
    const targetLoc = this.caseData.locations[locationId];
    if (!targetLoc) return false;

    if (!this.isLocationUnlocked(locationId)) {
      return false;
    }

    this.currentLocationId = locationId;
    if (spawnPos) {
      this.playerPosition = { ...spawnPos };
    } else {
      // Default spawn position for side-scrolling
      this.playerPosition = { x: 180, y: 440 };
    }

    this.audio.playDoor();

    for (const listener of this.onLocationChangeListeners) {
      listener(targetLoc);
    }

    return true;
  }

  public unlockLocation(locationId: string): void {
    if (this.caseData.locations[locationId]) {
      this.unlockedLocations.add(locationId);
      this.caseData.locations[locationId].isUnlocked = true;
    }
  }

  public isLocationUnlocked(locationId: string): boolean {
    return this.unlockedLocations.has(locationId) || (this.caseData.locations[locationId]?.isUnlocked ?? false);
  }

  public markInspectionPointExamined(id: string): void {
    this.examinedInspectionPoints.add(id);
  }

  public isInspectionPointExamined(id: string): boolean {
    return this.examinedInspectionPoints.has(id);
  }

  public onLocationChange(listener: (location: CaseLocation) => void): () => void {
    this.onLocationChangeListeners.push(listener);
    return () => {
      this.onLocationChangeListeners = this.onLocationChangeListeners.filter(l => l !== listener);
    };
  }

  public saveCurrentGame(): boolean {
    const data: GameSaveData = {
      version: 1,
      timestamp: Date.now(),
      currentLocationId: this.currentLocationId,
      playerPos: this.playerPosition,
      collectedEvidenceIds: this.evidenceManager.serialize(),
      examinedInspectionPointIds: Array.from(this.examinedInspectionPoints),
      unlockedLocationIds: Array.from(this.unlockedLocations),
      unlockedDeductionIds: this.deductionEngine.serialize(),
      dialogueState: this.dialogueManager.serialize(),
      boardState: this.investigationBoard.serialize(),
      statements: this.notebookManager.serialize(),
      settings: {
        musicVolume: this.audio.getMusicVolume(),
        sfxVolume: this.audio.getSfxVolume(),
        textSpeed: 'normal'
      }
    };

    const ok = SaveManager.saveGame(data);
    if (ok) {
      for (const listener of this.onSaveListeners) {
        listener();
      }
    }
    return ok;
  }

  public loadSavedGame(): boolean {
    const data = SaveManager.loadGame();
    if (!data) return false;

    this.currentLocationId = data.currentLocationId || 'loc_office';
    this.playerPosition = data.playerPos || { x: 200, y: 440 };
    this.evidenceManager.deserialize(data.collectedEvidenceIds || []);
    this.examinedInspectionPoints = new Set(data.examinedInspectionPointIds || []);
    this.unlockedLocations = new Set(data.unlockedLocationIds || ['loc_office', 'loc_crime_scene']);
    for (const locId of this.unlockedLocations) {
      if (this.caseData.locations[locId]) {
        this.caseData.locations[locId].isUnlocked = true;
      }
    }
    this.deductionEngine.deserialize(data.unlockedDeductionIds || []);
    this.dialogueManager.deserialize(data.dialogueState || { flags: [], visited: [] });
    if (data.boardState) {
      this.investigationBoard.deserialize(data.boardState);
    }
    this.investigationBoard.syncWithCollectedEvidence(this.evidenceManager);
    this.notebookManager.deserialize(data.statements || []);

    if (data.settings) {
      this.audio.setMusicVolume(data.settings.musicVolume ?? 0.5);
      this.audio.setSfxVolume(data.settings.sfxVolume ?? 0.7);
    }

    return true;
  }
}
