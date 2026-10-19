export interface GameSaveData {
  version: number;
  timestamp: number;
  currentLocationId: string;
  playerPos: { x: number; y: number };
  collectedEvidenceIds: string[];
  examinedInspectionPointIds: string[];
  unlockedLocationIds: string[];
  unlockedDeductionIds: string[];
  dialogueState: {
    flags: string[];
    visited: string[];
  };
  boardState: {
    cards: Array<{
      id: string;
      type: 'evidence' | 'suspect' | 'hypothesis';
      refId: string;
      title: string;
      x: number;
      y: number;
      width: number;
      height: number;
    }>;
    connections: Array<{
      id: string;
      cardAId: string;
      cardBId: string;
      status: 'hypothesis' | 'confirmed' | 'contradicted';
      deductionId?: string;
    }>;
  };
  statements: Array<{
    id: string;
    suspectId: string;
    suspectName: string;
    statement: string;
    timestamp: string;
    isContradicted?: boolean;
  }>;
  settings: {
    musicVolume: number;
    sfxVolume: number;
    textSpeed: 'fast' | 'normal' | 'instant';
  };
}

const STORAGE_KEY = 'shadows_of_truth_save_v1';
const SETTINGS_KEY = 'shadows_of_truth_settings';

const memoryStore = new Map<string, string>();
function getStorage(): { getItem(k: string): string | null; setItem(k: string, v: string): void; removeItem(k: string): void } {
  if (typeof localStorage !== 'undefined') return localStorage;
  return {
    getItem: (k: string) => memoryStore.get(k) ?? null,
    setItem: (k: string, v: string) => { memoryStore.set(k, v); },
    removeItem: (k: string) => { memoryStore.delete(k); }
  };
}

export class SaveManager {
  public static hasSave(): boolean {
    try {
      const raw = getStorage().getItem(STORAGE_KEY);
      if (!raw) return false;
      const data = JSON.parse(raw);
      return Boolean(data && data.version && Array.isArray(data.collectedEvidenceIds));
    } catch {
      return false;
    }
  }

  public static saveGame(data: GameSaveData): boolean {
    try {
      getStorage().setItem(STORAGE_KEY, JSON.stringify(data));
      return true;
    } catch (err) {
      console.error('Failed to save game:', err);
      return false;
    }
  }

  public static loadGame(): GameSaveData | null {
    try {
      const raw = getStorage().getItem(STORAGE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw) as GameSaveData;
      if (!this.validateSave(parsed)) {
        console.warn('Invalid save data format. Discarding corrupted save.');
        return null;
      }
      return parsed;
    } catch (err) {
      console.error('Failed to load game save:', err);
      return null;
    }
  }

  public static resetSave(): void {
    try {
      getStorage().removeItem(STORAGE_KEY);
    } catch (err) {
      console.error('Failed to clear save:', err);
    }
  }

  public static saveSettings(settings: { musicVolume: number; sfxVolume: number; textSpeed: 'fast' | 'normal' | 'instant' }): void {
    try {
      getStorage().setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch (err) {
      console.error('Failed to save settings:', err);
    }
  }

  public static loadSettings(): { musicVolume: number; sfxVolume: number; textSpeed: 'fast' | 'normal' | 'instant' } {
    try {
      const raw = getStorage().getItem(SETTINGS_KEY);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch (err) {
      console.warn('Could not parse settings:', err);
    }
    return {
      musicVolume: 0.5,
      sfxVolume: 0.7,
      textSpeed: 'normal'
    };
  }

  public static validateSave(data: unknown): data is GameSaveData {
    if (!data || typeof data !== 'object') return false;
    const d = data as Partial<GameSaveData>;
    return (
      typeof d.version === 'number' &&
      typeof d.currentLocationId === 'string' &&
      Boolean(d.playerPos && typeof d.playerPos.x === 'number') &&
      Array.isArray(d.collectedEvidenceIds) &&
      Array.isArray(d.examinedInspectionPointIds) &&
      Array.isArray(d.unlockedLocationIds) &&
      Array.isArray(d.unlockedDeductionIds) &&
      Boolean(d.dialogueState && Array.isArray(d.dialogueState.flags))
    );
  }
}
