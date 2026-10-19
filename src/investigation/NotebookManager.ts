import type { CaseDefinition, CaseObjective } from '../case/CaseData';
import type { EvidenceManager } from './EvidenceManager';
import type { TimelineManager } from './TimelineManager';
import type { DeductionEngine } from './DeductionEngine';
import type { Suspect } from '../case/SuspectData';

export interface WitnessStatementRecord {
  id: string;
  suspectId: string;
  suspectName: string;
  statement: string;
  timestamp: string;
  isContradicted?: boolean;
}

export class NotebookManager {
  private caseData: CaseDefinition;
  private evidenceManager: EvidenceManager;
  private timelineManager: TimelineManager;
  private deductionEngine: DeductionEngine;
  private statements: WitnessStatementRecord[] = [];
  private activeTab: 'summary' | 'evidence' | 'suspects' | 'statements' | 'timeline' | 'hypotheses' = 'summary';

  constructor(
    caseData: CaseDefinition,
    evidenceManager: EvidenceManager,
    timelineManager: TimelineManager,
    deductionEngine: DeductionEngine
  ) {
    this.caseData = caseData;
    this.evidenceManager = evidenceManager;
    this.timelineManager = timelineManager;
    this.deductionEngine = deductionEngine;
  }

  public getActiveTab(): 'summary' | 'evidence' | 'suspects' | 'statements' | 'timeline' | 'hypotheses' {
    return this.activeTab;
  }

  public setActiveTab(tab: 'summary' | 'evidence' | 'suspects' | 'statements' | 'timeline' | 'hypotheses'): void {
    this.activeTab = tab;
  }

  public getCaseSummary() {
    return {
      title: this.caseData.title,
      subtitle: this.caseData.subtitle,
      victim: this.caseData.victimName,
      date: this.caseData.date,
      synopsis: this.caseData.synopsis,
      briefing: this.caseData.briefing,
      objectives: this.getObjectives()
    };
  }

  public getObjectives(): CaseObjective[] {
    return this.caseData.objectives.map(obj => {
      let completed = obj.completed;
      if (obj.requiredEvidenceIds && obj.requiredEvidenceIds.every(id => this.evidenceManager.hasEvidence(id))) {
        completed = true;
      }
      if (obj.requiredDeductionIds && obj.requiredDeductionIds.every(id => this.deductionEngine.isDeductionUnlocked(id))) {
        completed = true;
      }
      return { ...obj, completed };
    });
  }

  public getSuspects(): Suspect[] {
    return Object.values(this.caseData.suspects);
  }

  public recordStatement(suspectId: string, suspectName: string, statement: string): void {
    const exists = this.statements.some(
      s => s.suspectId === suspectId && s.statement === statement
    );
    if (!exists) {
      this.statements.push({
        id: `stmt_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        suspectId,
        suspectName,
        statement,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
    }
  }

  public getStatements(): WitnessStatementRecord[] {
    return this.statements;
  }

  public getTimelineEvents() {
    return this.timelineManager.getDiscoveredEvents(this.evidenceManager);
  }

  public getHypotheses() {
    return this.deductionEngine.getUnlockedDeductions();
  }

  public serialize(): WitnessStatementRecord[] {
    return this.statements;
  }

  public deserialize(savedStatements: WitnessStatementRecord[]): void {
    this.statements = savedStatements || [];
  }
}
