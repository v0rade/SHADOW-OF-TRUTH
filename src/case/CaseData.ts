import type { EvidenceItem, ClueInspectionPoint } from './EvidenceData';
import type { Suspect } from './SuspectData';

export interface TimelineEvent {
  id: string;
  timeString: string; // e.g. "10:00 PM"
  timestampMinutes: number; // For sorting
  title: string;
  description: string;
  verified: boolean;
  source: string; // e.g. "Bar Register", "Autopsy", "Statement"
  contradictedBy?: string; // Evidence ID that proves this false
  requiredEvidenceId?: string; // Clue needed to reveal this timeline event
}

export interface DeductionRule {
  id: string;
  title: string;
  description: string;
  clueAId: string;
  clueBId: string;
  resultingFact: string;
  explanation: string;
  hint: string;
  unlocksObjectiveId?: string;
  unlocksLocationId?: string;
}

export interface CaseObjective {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  requiredFlag?: string;
  requiredEvidenceIds?: string[];
  requiredDeductionIds?: string[];
}

export interface CaseLocation {
  id: string;
  name: string;
  description: string;
  sceneKey: string;
  isUnlocked: boolean;
  unlockReason?: string;
  inspectionPoints: ClueInspectionPoint[];
  npcs: {
    suspectId: string;
    x: number;
    y: number;
    name: string;
  }[];
  doors: {
    x: number;
    y: number;
    targetLocationId: string;
    prompt: string;
  }[];
}

export interface AccusationSubmission {
  culpritId: string;
  motiveId: string;
  methodId: string;
  keyEvidenceIds: string[];
}

export interface AccusationEvaluation {
  isCorrect: boolean;
  culpritCorrect: boolean;
  motiveCorrect: boolean;
  methodCorrect: boolean;
  evidenceScore: number; // 0 to 100
  totalScore: number; // 0 to 100
  rank: 'S' | 'A' | 'B' | 'C' | 'F';
  feedbackTitle: string;
  feedbackDetails: string[];
  epilogue: string;
}

export interface CaseDefinition {
  id: string;
  title: string;
  subtitle: string;
  victimName: string;
  date: string;
  synopsis: string;
  briefing: string[];
  locations: Record<string, CaseLocation>;
  evidence: Record<string, EvidenceItem>;
  suspects: Record<string, Suspect>;
  timeline: TimelineEvent[];
  deductionRules: DeductionRule[];
  objectives: CaseObjective[];
  correctAccusation: {
    culpritId: string;
    motiveId: string;
    methodId: string;
    requiredKeyEvidenceIds: string[];
  };
}
