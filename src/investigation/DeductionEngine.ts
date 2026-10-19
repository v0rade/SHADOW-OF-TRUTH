import type { DeductionRule } from '../case/CaseData';

export interface DeductionResult {
  success: boolean;
  rule?: DeductionRule;
  message: string;
  isNew?: boolean;
}

export class DeductionEngine {
  private rules: DeductionRule[];
  private unlockedDeductionIds: Set<string> = new Set();
  private onDeductionUnlockedListeners: Array<(rule: DeductionRule) => void> = [];

  constructor(rules: DeductionRule[]) {
    this.rules = rules;
  }

  public testDeduction(clueAId: string, clueBId: string): DeductionResult {
    if (clueAId === clueBId) {
      return {
        success: false,
        message: 'You cannot connect a clue to itself. Combine two different pieces of evidence.'
      };
    }

    const matchedRule = this.rules.find(
      r =>
        (r.clueAId === clueAId && r.clueBId === clueBId) ||
        (r.clueAId === clueBId && r.clueBId === clueAId)
    );

    if (!matchedRule) {
      return {
        success: false,
        message: 'No clear deduction links these two clues. Review their categories, timestamps, and physical properties.'
      };
    }

    const isNew = !this.unlockedDeductionIds.has(matchedRule.id);
    if (isNew) {
      this.unlockedDeductionIds.add(matchedRule.id);
      for (const listener of this.onDeductionUnlockedListeners) {
        try {
          listener(matchedRule);
        } catch (err) {
          console.error('Error in deduction listener:', err);
        }
      }
    }

    return {
      success: true,
      rule: matchedRule,
      message: matchedRule.resultingFact,
      isNew
    };
  }

  public isDeductionUnlocked(ruleId: string): boolean {
    return this.unlockedDeductionIds.has(ruleId);
  }

  public getUnlockedDeductions(): DeductionRule[] {
    return this.rules.filter(r => this.unlockedDeductionIds.has(r.id));
  }

  public getAllRules(): DeductionRule[] {
    return this.rules;
  }

  public onDeductionUnlocked(listener: (rule: DeductionRule) => void): () => void {
    this.onDeductionUnlockedListeners.push(listener);
    return () => {
      this.onDeductionUnlockedListeners = this.onDeductionUnlockedListeners.filter(l => l !== listener);
    };
  }

  public serialize(): string[] {
    return Array.from(this.unlockedDeductionIds);
  }

  public deserialize(savedIds: string[]): void {
    this.unlockedDeductionIds.clear();
    for (const id of savedIds) {
      if (this.rules.some(r => r.id === id)) {
        this.unlockedDeductionIds.add(id);
      }
    }
  }
}
