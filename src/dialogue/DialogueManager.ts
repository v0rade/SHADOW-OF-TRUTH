import type { Suspect, DialogueNode, DialogueChoice, ContradictionChallenge } from '../case/SuspectData';
import type { EvidenceManager } from '../investigation/EvidenceManager';
import type { DeductionEngine } from '../investigation/DeductionEngine';
import type { NotebookManager } from '../investigation/NotebookManager';

export interface ActiveDialogueState {
  suspect: Suspect;
  currentNode: DialogueNode;
  availableChoices: DialogueChoice[];
  activeContradiction?: ContradictionChallenge;
}

export class DialogueManager {
  private evidenceManager: EvidenceManager;
  private deductionEngine: DeductionEngine;
  private notebookManager: NotebookManager;
  private activeState: ActiveDialogueState | null = null;
  private dialogueFlags: Set<string> = new Set();
  private visitedNodes: Set<string> = new Set();

  private onStateChangeListeners: Array<(state: ActiveDialogueState | null) => void> = [];
  private onEvidenceAwardedListeners: Array<(evidenceId: string) => void> = [];
  private onLocationUnlockedListeners: Array<(locationId: string) => void> = [];
  private onContradictionBreakthroughListeners: Array<(challenge: ContradictionChallenge) => void> = [];

  constructor(
    evidenceManager: EvidenceManager,
    deductionEngine: DeductionEngine,
    notebookManager: NotebookManager
  ) {
    this.evidenceManager = evidenceManager;
    this.deductionEngine = deductionEngine;
    this.notebookManager = notebookManager;
  }

  public startDialogue(suspect: Suspect, startNodeId?: string): ActiveDialogueState {
    const nodeId = startNodeId || suspect.initialDialogueNodeId;
    const node = suspect.dialogueNodes[nodeId];

    if (!node) {
      throw new Error(`Node ${nodeId} not found on suspect ${suspect.id}`);
    }

    this.setCurrentNode(suspect, node);
    return this.activeState!;
  }

  public selectChoice(choiceId: string): ActiveDialogueState | null {
    if (!this.activeState) return null;

    const choice = this.activeState.availableChoices.find(c => c.id === choiceId);
    if (!choice) return this.activeState;

    if (choice.setFlag) {
      this.dialogueFlags.add(choice.setFlag);
    }

    if (choice.unlockLocation) {
      for (const l of this.onLocationUnlockedListeners) {
        l(choice.unlockLocation);
      }
    }

    const nextNode = this.activeState.suspect.dialogueNodes[choice.nextNodeId];
    if (!nextNode) {
      // End dialogue
      this.endDialogue();
      return null;
    }

    this.setCurrentNode(this.activeState.suspect, nextNode);
    return this.activeState;
  }

  public presentEvidence(evidenceId: string): { success: boolean; reactionText: string; breakthrough: boolean } {
    if (!this.activeState) {
      return { success: false, reactionText: 'No active interrogation.', breakthrough: false };
    }

    const suspect = this.activeState.suspect;

    // Check if active node has a contradiction challenge expecting this evidence
    if (this.activeState.activeContradiction) {
      const challenge = this.activeState.activeContradiction;
      if (challenge.expectedEvidenceId === evidenceId) {
        // BREAKTHROUGH!
        for (const listener of this.onContradictionBreakthroughListeners) {
          listener(challenge);
        }

        const successNode = suspect.dialogueNodes[challenge.successDialogueNodeId];
        if (successNode) {
          this.setCurrentNode(suspect, successNode);
        }

        return {
          success: true,
          reactionText: challenge.breakthroughDescription,
          breakthrough: true
        };
      }
    }

    // Check suspect's general reactions to presented evidence
    const reaction = suspect.evidenceReactions[evidenceId];
    if (reaction) {
      if (reaction.unlocksTopicId && suspect.dialogueNodes[reaction.unlocksTopicId]) {
        this.setCurrentNode(suspect, suspect.dialogueNodes[reaction.unlocksTopicId]);
      }
      if (reaction.unlocksEvidenceId) {
        this.evidenceManager.collectEvidence(reaction.unlocksEvidenceId);
      }
      if (reaction.unlocksLocationId) {
        for (const l of this.onLocationUnlockedListeners) {
          l(reaction.unlocksLocationId);
        }
      }
      return { success: true, reactionText: reaction.response, breakthrough: false };
    }

    return {
      success: false,
      reactionText: `${suspect.name} glances at the evidence with indifference: "That has nothing to do with me."`,
      breakthrough: false
    };
  }

  public endDialogue(): void {
    this.activeState = null;
    this.notifyState();
  }

  public getActiveState(): ActiveDialogueState | null {
    return this.activeState;
  }

  private setCurrentNode(suspect: Suspect, node: DialogueNode): void {
    this.visitedNodes.add(`${suspect.id}_${node.id}`);

    // Record statement in notebook
    this.notebookManager.recordStatement(suspect.id, suspect.name, node.text);

    // Award evidence if configured
    if (node.awardEvidenceId) {
      this.evidenceManager.collectEvidence(node.awardEvidenceId);
      for (const listener of this.onEvidenceAwardedListeners) {
        listener(node.awardEvidenceId);
      }
    }

    if (node.unlockLocation) {
      for (const listener of this.onLocationUnlockedListeners) {
        listener(node.unlockLocation);
      }
    }

    // Check for contradiction challenge on this node
    let activeContradiction: ContradictionChallenge | undefined;
    if (node.triggerContradictionId) {
      activeContradiction = suspect.contradictions.find(c => c.id === node.triggerContradictionId);
    }

    // Filter choices
    const availableChoices = (node.choices || []).filter(c => {
      if (!c.condition) return true;
      if (c.condition.requiredEvidenceId && !this.evidenceManager.hasEvidence(c.condition.requiredEvidenceId)) {
        return false;
      }
      if (c.condition.requiredDeductionId && !this.deductionEngine.isDeductionUnlocked(c.condition.requiredDeductionId)) {
        return false;
      }
      if (c.condition.requiredFlag && !this.dialogueFlags.has(c.condition.requiredFlag)) {
        return false;
      }
      return true;
    });

    this.activeState = {
      suspect,
      currentNode: node,
      availableChoices,
      activeContradiction
    };

    this.notifyState();
  }

  private notifyState(): void {
    for (const listener of this.onStateChangeListeners) {
      try {
        listener(this.activeState);
      } catch (err) {
        console.error('Error in dialogue listener:', err);
      }
    }
  }

  public onStateChange(listener: (state: ActiveDialogueState | null) => void): () => void {
    this.onStateChangeListeners.push(listener);
    return () => {
      this.onStateChangeListeners = this.onStateChangeListeners.filter(l => l !== listener);
    };
  }

  public onBreakthrough(listener: (challenge: ContradictionChallenge) => void): () => void {
    this.onContradictionBreakthroughListeners.push(listener);
    return () => {
      this.onContradictionBreakthroughListeners = this.onContradictionBreakthroughListeners.filter(l => l !== listener);
    };
  }

  public onLocationUnlocked(listener: (locationId: string) => void): () => void {
    this.onLocationUnlockedListeners.push(listener);
    return () => {
      this.onLocationUnlockedListeners = this.onLocationUnlockedListeners.filter(l => l !== listener);
    };
  }

  public serialize(): { flags: string[]; visited: string[] } {
    return {
      flags: Array.from(this.dialogueFlags),
      visited: Array.from(this.visitedNodes)
    };
  }

  public deserialize(data: { flags: string[]; visited: string[] }): void {
    this.dialogueFlags = new Set(data.flags || []);
    this.visitedNodes = new Set(data.visited || []);
  }
}
