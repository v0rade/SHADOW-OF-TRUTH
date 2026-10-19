import type { EvidenceItem, EvidenceCategory } from '../case/EvidenceData';

export class EvidenceManager {
  private allEvidence: Record<string, EvidenceItem>;
  private collectedIds: Set<string> = new Set();
  private onEvidenceCollectedListeners: Array<(evidence: EvidenceItem) => void> = [];

  constructor(evidenceCatalog: Record<string, EvidenceItem>) {
    // Deep clone catalog so mutations don't alter original template
    this.allEvidence = JSON.parse(JSON.stringify(evidenceCatalog));
  }

  public collectEvidence(evidenceId: string): { success: boolean; evidence?: EvidenceItem; alreadyHad: boolean } {
    if (!this.allEvidence[evidenceId]) {
      return { success: false, alreadyHad: false };
    }

    if (this.collectedIds.has(evidenceId)) {
      return { success: false, evidence: this.allEvidence[evidenceId], alreadyHad: true };
    }

    this.collectedIds.add(evidenceId);
    const item = this.allEvidence[evidenceId];
    item.examined = true;

    // Notify listeners immediately
    for (const listener of this.onEvidenceCollectedListeners) {
      try {
        listener(item);
      } catch (err) {
        console.error('Error in evidence listener:', err);
      }
    }

    return { success: true, evidence: item, alreadyHad: false };
  }

  public hasEvidence(evidenceId: string): boolean {
    return this.collectedIds.has(evidenceId);
  }

  public getEvidence(evidenceId: string): EvidenceItem | undefined {
    return this.allEvidence[evidenceId];
  }

  public getAllCollected(): EvidenceItem[] {
    return Array.from(this.collectedIds)
      .map(id => this.allEvidence[id])
      .filter((item): item is EvidenceItem => item !== undefined);
  }

  public getCollectedByCategory(category: EvidenceCategory): EvidenceItem[] {
    return this.getAllCollected().filter(item => item.category === category);
  }

  public getCollectedForCharacter(characterId: string): EvidenceItem[] {
    return this.getAllCollected().filter(item => item.relevantCharacters.includes(characterId));
  }

  public getCount(): number {
    return this.collectedIds.size;
  }

  public getTotalCatalogCount(): number {
    return Object.keys(this.allEvidence).length;
  }

  public onEvidenceCollected(listener: (evidence: EvidenceItem) => void): () => void {
    this.onEvidenceCollectedListeners.push(listener);
    return () => {
      this.onEvidenceCollectedListeners = this.onEvidenceCollectedListeners.filter(l => l !== listener);
    };
  }

  public examine(evidenceId: string): boolean {
    const item = this.allEvidence[evidenceId];
    if (item) {
      item.examined = true;
      return true;
    }
    return false;
  }

  public serialize(): string[] {
    return Array.from(this.collectedIds);
  }

  public deserialize(savedIds: string[]): void {
    this.collectedIds.clear();
    for (const id of savedIds) {
      if (this.allEvidence[id]) {
        this.collectedIds.add(id);
        this.allEvidence[id].examined = true;
      }
    }
  }
}
