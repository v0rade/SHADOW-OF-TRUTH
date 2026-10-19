export type EvidenceCategory =
  | 'physical'
  | 'documents'
  | 'digital'
  | 'photographs'
  | 'testimony'
  | 'timeline';

export interface EvidenceItem {
  id: string;
  name: string;
  description: string;
  details: string; // Extended lore / forensic notes
  discoveryLocation: string;
  category: EvidenceCategory;
  relevantCharacters: string[];
  relatedEvidenceIds: string[];
  investigationRelevance: string;
  examined: boolean;
  iconName: string; // Key for visual icon
  tags?: string[];
}

export interface ClueInspectionPoint {
  id: string;
  name: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
  evidenceId: string;
  interactPrompt: string;
  flavorText: string;
  examinedText: string;
  requiredClueId?: string; // Optional unlock condition
}
