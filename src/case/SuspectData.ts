export interface DialogueChoice {
  id: string;
  text: string;
  nextNodeId: string;
  condition?: {
    requiredEvidenceId?: string;
    requiredDeductionId?: string;
    requiredFlag?: string;
  };
  presentsEvidence?: boolean; // If true, opening this choice prompts evidence presentation
  setFlag?: string;
  unlockLocation?: string;
}

export interface DialogueNode {
  id: string;
  speaker: string;
  text: string;
  portraitMood?: 'neutral' | 'nervous' | 'angry' | 'smug' | 'shocked';
  choices?: DialogueChoice[];
  awardEvidenceId?: string;
  triggerContradictionId?: string;
  unlockLocation?: string;
  isEndNode?: boolean;
}

export interface ContradictionChallenge {
  id: string;
  statementId: string;
  statementText: string;
  expectedEvidenceId: string;
  successDialogueNodeId: string;
  failureDialogueNodeId: string;
  breakthroughTitle: string;
  breakthroughDescription: string;
}

export interface Suspect {
  id: string;
  name: string;
  title: string;
  avatar: string; // Portrait key
  bio: string;
  relationshipToVictim: string;
  knownAlibi: string;
  hiddenInformation: string;
  currentLocation: string;
  initialDialogueNodeId: string;
  dialogueNodes: Record<string, DialogueNode>;
  evidenceReactions: Record<string, {
    response: string;
    mood?: 'neutral' | 'nervous' | 'angry' | 'smug' | 'shocked';
    unlocksTopicId?: string;
    unlocksEvidenceId?: string;
    unlocksLocationId?: string;
  }>;
  contradictions: ContradictionChallenge[];
}
