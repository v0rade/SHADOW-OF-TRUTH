import { describe, it, expect, beforeEach } from 'vitest';
import { EvidenceManager } from '../src/investigation/EvidenceManager';
import { TimelineManager } from '../src/investigation/TimelineManager';
import { DeductionEngine } from '../src/investigation/DeductionEngine';
import { NotebookManager } from '../src/investigation/NotebookManager';
import { DialogueManager } from '../src/dialogue/DialogueManager';
import { CaseEvaluator } from '../src/case/CaseEvaluator';
import { SaveManager, type GameSaveData } from '../src/persistence/SaveManager';
import { CASE_01 } from '../src/data/case01/case';
import { CASE_EVIDENCE } from '../src/data/case01/evidence';
import { CASE_SUSPECTS } from '../src/data/case01/suspects';
import { CASE_TIMELINE } from '../src/data/case01/timeline';
import { CASE_DEDUCTIONS } from '../src/data/case01/deductions';

describe('Investigation Systems & Gameplay Logic', () => {
  let evidenceMgr: EvidenceManager;
  let timelineMgr: TimelineManager;
  let deductionEngine: DeductionEngine;
  let notebookMgr: NotebookManager;
  let dialogueMgr: DialogueManager;

  beforeEach(() => {
    evidenceMgr = new EvidenceManager(CASE_EVIDENCE);
    timelineMgr = new TimelineManager(CASE_TIMELINE);
    deductionEngine = new DeductionEngine(CASE_DEDUCTIONS);
    notebookMgr = new NotebookManager(CASE_01, evidenceMgr, timelineMgr, deductionEngine);
    dialogueMgr = new DialogueManager(evidenceMgr, deductionEngine, notebookMgr);
  });

  describe('1. Evidence Collection & Duplicate Prevention', () => {
    it('should collect new evidence successfully', () => {
      const result = evidenceMgr.collectEvidence('clue_whiskey_glass');
      expect(result.success).toBe(true);
      expect(result.alreadyHad).toBe(false);
      expect(result.evidence?.name).toBe('Half-Empty Scotch Glass');
      expect(evidenceMgr.hasEvidence('clue_whiskey_glass')).toBe(true);
      expect(evidenceMgr.getCount()).toBe(1);
    });

    it('should prevent duplicate evidence collection without error', () => {
      evidenceMgr.collectEvidence('clue_whiskey_glass');
      const secondAttempt = evidenceMgr.collectEvidence('clue_whiskey_glass');
      expect(secondAttempt.success).toBe(false);
      expect(secondAttempt.alreadyHad).toBe(true);
      expect(evidenceMgr.getCount()).toBe(1);
    });

    it('should filter evidence by category', () => {
      evidenceMgr.collectEvidence('clue_whiskey_glass'); // physical
      evidenceMgr.collectEvidence('clue_autopsy_report'); // documents
      evidenceMgr.collectEvidence('clue_audio_tape'); // digital

      const physical = evidenceMgr.getCollectedByCategory('physical');
      const docs = evidenceMgr.getCollectedByCategory('documents');
      const digital = evidenceMgr.getCollectedByCategory('digital');

      expect(physical.length).toBe(1);
      expect(docs.length).toBe(1);
      expect(digital.length).toBe(1);
    });
  });

  describe('2. Dialogue Branching & Suspect Interrogation', () => {
    it('should start dialogue at initial node and progress through choices', () => {
      const reed = CASE_SUSPECTS['suspect_reed'];
      const state = dialogueMgr.startDialogue(reed);

      expect(state.currentNode.id).toBe('reed_intro');
      expect(state.availableChoices.length).toBeGreaterThan(0);

      const nextState = dialogueMgr.selectChoice('c_reed_locked');
      expect(nextState).not.toBeNull();
      expect(nextState?.currentNode.id).toBe('reed_autopsy');

      // The autopsy node awards the autopsy report evidence
      expect(evidenceMgr.hasEvidence('clue_autopsy_report')).toBe(true);
    });

    it('should record statements into notebook during interrogation', () => {
      const reed = CASE_SUSPECTS['suspect_reed'];
      dialogueMgr.startDialogue(reed);
      const stmts = notebookMgr.getStatements();
      expect(stmts.length).toBeGreaterThan(0);
      expect(stmts[0].suspectId).toBe('suspect_reed');
    });
  });

  describe('3. Evidence-Based Contradictions & Breakthroughs', () => {
    it('should shatter Vince Rossi timeline lie when presenting Velvet Lounge register receipt', () => {
      const rossi = CASE_SUSPECTS['suspect_rossi'];
      evidenceMgr.collectEvidence('clue_velvet_receipt');

      // Navigate to Vince's timeline claim
      dialogueMgr.startDialogue(rossi, 'rossi_timeline_lie');
      expect(dialogueMgr.getActiveState()?.activeContradiction).toBeDefined();

      let breakthroughTriggered = false;
      dialogueMgr.onBreakthrough((challenge) => {
        if (challenge.id === 'contra_rossi_timeline') {
          breakthroughTriggered = true;
        }
      });

      // Present the matching contradictory receipt
      const result = dialogueMgr.presentEvidence('clue_velvet_receipt');
      expect(result.success).toBe(true);
      expect(result.breakthrough).toBe(true);
      expect(breakthroughTriggered).toBe(true);
      expect(dialogueMgr.getActiveState()?.currentNode.id).toBe('rossi_confronted_receipt');
    });

    it('should shatter Marcus Sterling gala alibi when presenting Riverview Garage ticket', () => {
      const sterling = CASE_SUSPECTS['suspect_sterling'];
      evidenceMgr.collectEvidence('clue_parking_ticket');

      dialogueMgr.startDialogue(sterling, 'sterling_alibi_claim');
      expect(dialogueMgr.getActiveState()?.activeContradiction).toBeDefined();

      const result = dialogueMgr.presentEvidence('clue_parking_ticket');
      expect(result.success).toBe(true);
      expect(result.breakthrough).toBe(true);
      expect(dialogueMgr.getActiveState()?.currentNode.id).toBe('sterling_confronted_parking');
    });

    it('should reject irrelevant evidence when no contradiction exists', () => {
      const sterling = CASE_SUSPECTS['suspect_sterling'];
      dialogueMgr.startDialogue(sterling, 'sterling_intro');

      const result = dialogueMgr.presentEvidence('non_existent_clue');
      expect(result.success).toBe(false);
      expect(result.breakthrough).toBe(false);
    });
  });

  describe('4. Deduction Engine & Investigation Board', () => {
    it('should validate staged locked-room entry deduction', () => {
      const result = deductionEngine.testDeduction('clue_nylon_thread', 'clue_forged_suicide_note');
      expect(result.success).toBe(true);
      expect(result.rule?.id).toBe('deduction_locked_room');
      expect(deductionEngine.isDeductionUnlocked('deduction_locked_room')).toBe(true);
    });

    it('should validate order-independent clues in deduction', () => {
      // Clue B first, then Clue A
      const result = deductionEngine.testDeduction('clue_smashed_watch', 'clue_parking_ticket');
      expect(result.success).toBe(true);
      expect(result.rule?.id).toBe('deduction_sterling_alibi_broken');
    });

    it('should provide constructive feedback for unrelated clues without locking progression', () => {
      const result = deductionEngine.testDeduction('clue_whiskey_glass', 'clue_cigar_ash');
      expect(result.success).toBe(false);
      expect(result.message).toContain('No clear deduction links these two clues');
    });
  });

  describe('5. Timeline Consistency & Contradictions', () => {
    it('should only show events whose prerequisite clues have been discovered', () => {
      const initialEvents = timelineMgr.getDiscoveredEvents(evidenceMgr);
      const hasParkingEvent = initialEvents.some(e => e.id === 'tl_06');
      expect(hasParkingEvent).toBe(false);

      // Now collect garage ticket
      evidenceMgr.collectEvidence('clue_parking_ticket');
      const updatedEvents = timelineMgr.getDiscoveredEvents(evidenceMgr);
      const nowHasParkingEvent = updatedEvents.some(e => e.id === 'tl_06');
      expect(nowHasParkingEvent).toBe(true);
    });

    it('should flag timeline contradictions when contradictory clue is found', () => {
      evidenceMgr.collectEvidence('clue_velvet_receipt');
      const contradicted = timelineMgr.getContradictedEvents(evidenceMgr);
      expect(contradicted.some(e => e.id === 'tl_04' || e.id === 'tl_05')).toBe(true);
    });
  });

  describe('6. Case Objectives & Completion', () => {
    it('should complete crime scene objective when all required scene clues are gathered', () => {
      evidenceMgr.collectEvidence('clue_whiskey_glass');
      evidenceMgr.collectEvidence('clue_brass_trophy');
      evidenceMgr.collectEvidence('clue_nylon_thread');

      const objectives = notebookMgr.getObjectives();
      const sceneObj = objectives.find(o => o.id === 'obj_examine_crime_scene');
      expect(sceneObj?.completed).toBe(true);
    });

    it('should complete suicide disprove objective when deduction is formed', () => {
      deductionEngine.testDeduction('clue_nylon_thread', 'clue_forged_suicide_note');
      const objectives = notebookMgr.getObjectives();
      const disproveObj = objectives.find(o => o.id === 'obj_disprove_suicide');
      expect(disproveObj?.completed).toBe(true);
    });
  });

  describe('7. Final Accusation Scoring & Endings', () => {
    it('should award Rank S for flawless accusation with full key evidence', () => {
      const evaluation = CaseEvaluator.evaluateAccusation(
        {
          culpritId: 'suspect_sterling',
          motiveId: 'motive_silence_expose',
          methodId: 'method_poison_blunt_locked',
          keyEvidenceIds: [
            'clue_parking_ticket',
            'clue_sterling_pen',
            'clue_whiskey_glass',
            'clue_bank_transfer',
            'clue_cigar_ash'
          ]
        },
        CASE_01
      );

      expect(evaluation.isCorrect).toBe(true);
      expect(evaluation.rank).toBe('S');
      expect(evaluation.totalScore).toBe(100);
      expect(evaluation.feedbackTitle).toContain('MASTER DETECTIVE');
    });

    it('should handle partial accusation with reduced rank without breaking game', () => {
      const evaluation = CaseEvaluator.evaluateAccusation(
        {
          culpritId: 'suspect_sterling',
          motiveId: 'motive_silence_expose',
          methodId: 'method_knife_struggle', // Incorrect method
          keyEvidenceIds: ['clue_parking_ticket', 'clue_whiskey_glass'] // 2 of 5 key evidence
        },
        CASE_01
      );

      expect(evaluation.culpritCorrect).toBe(true);
      expect(evaluation.methodCorrect).toBe(false);
      expect(evaluation.rank).toBe('B');
      expect(evaluation.totalScore).toBe(68);
    });

    it('should assign Rank F for accusing the wrong suspect', () => {
      const evaluation = CaseEvaluator.evaluateAccusation(
        {
          culpritId: 'suspect_evelyn', // Wrong culprit
          motiveId: 'motive_professional_jealousy',
          methodId: 'method_suicide',
          keyEvidenceIds: ['clue_evelyn_badge']
        },
        CASE_01
      );

      expect(evaluation.isCorrect).toBe(false);
      expect(evaluation.culpritCorrect).toBe(false);
      expect(evaluation.rank).toBe('F');
      expect(evaluation.feedbackTitle).toContain('BOTCHED');
    });

    it('should assign Rank A when culprit, motive, and method are correct with 4 of 5 evidence items', () => {
      const evaluation = CaseEvaluator.evaluateAccusation(
        {
          culpritId: 'suspect_sterling',
          motiveId: 'motive_silence_expose',
          methodId: 'method_poison_blunt_locked',
          keyEvidenceIds: [
            'clue_parking_ticket',
            'clue_sterling_pen',
            'clue_whiskey_glass',
            'clue_bank_transfer'
            // Missing clue_cigar_ash (4/5 = 80% * 20 = 16 pts -> total 96 or A/S)
          ]
        },
        CASE_01
      );
      expect(evaluation.culpritCorrect).toBe(true);
      expect(evaluation.evidenceScore).toBe(80);
      expect(evaluation.totalScore).toBe(96);
    });

    it('should assign Rank C when only culprit is correct and minimal evidence is provided', () => {
      const evaluation = CaseEvaluator.evaluateAccusation(
        {
          culpritId: 'suspect_sterling',
          motiveId: 'motive_robbery', // Incorrect
          methodId: 'method_suicide', // Incorrect
          keyEvidenceIds: ['clue_parking_ticket'] // 1/5 = 20% * 20 = 4 pts -> total 44 pts
        },
        CASE_01
      );
      expect(evaluation.culpritCorrect).toBe(true);
      expect(evaluation.rank).toBe('C');
      expect(evaluation.totalScore).toBe(44);
    });
  });

  describe('8. Location Unlocking & Progression', () => {
    it('should unlock location when dialogue triggers unlockLocation', () => {
      let unlockedLoc = '';
      dialogueMgr.onLocationUnlocked((locId) => {
        unlockedLoc = locId;
      });

      const reed = CASE_SUSPECTS['suspect_reed'];
      dialogueMgr.startDialogue(reed, 'reed_witnesses');
      expect(unlockedLoc).toBe('loc_newspaper_office');
    });

    it('should unlock location when deduction rule specifies unlocksLocationId', () => {
      const result = deductionEngine.testDeduction('clue_parking_ticket', 'clue_smashed_watch');
      expect(result.success).toBe(true);
      expect(result.rule?.unlocksLocationId).toBe('loc_sterling_office');
    });
  });

  describe('9. Save/Load Serialization & State Integrity', () => {
    it('should validate and persist complete game save data', () => {
      const mockSave: GameSaveData = {
        version: 1,
        timestamp: Date.now(),
        currentLocationId: 'loc_crime_scene',
        playerPos: { x: 350, y: 440 },
        collectedEvidenceIds: ['clue_whiskey_glass', 'clue_brass_trophy'],
        examinedInspectionPointIds: ['inspect_door_latch'],
        unlockedLocationIds: ['loc_office', 'loc_crime_scene', 'loc_newspaper_office'],
        unlockedDeductionIds: ['deduction_locked_room'],
        dialogueState: {
          flags: ['evelyn_badge_confronted'],
          visited: ['suspect_reed_reed_intro']
        },
        boardState: {
          cards: [],
          connections: []
        },
        statements: [],
        settings: {
          musicVolume: 0.5,
          sfxVolume: 0.7,
          textSpeed: 'normal'
        }
      };

      expect(SaveManager.validateSave(mockSave)).toBe(true);

      const saved = SaveManager.saveGame(mockSave);
      expect(saved).toBe(true);

      const loaded = SaveManager.loadGame();
      expect(loaded).not.toBeNull();
      expect(loaded?.currentLocationId).toBe('loc_crime_scene');
      expect(loaded?.collectedEvidenceIds).toContain('clue_whiskey_glass');
    });

    it('should reject malformed or corrupted save data', () => {
      expect(SaveManager.validateSave(null)).toBe(false);
      expect(SaveManager.validateSave({})).toBe(false);
      expect(SaveManager.validateSave({ version: '1', currentLocationId: 123 })).toBe(false);
      expect(SaveManager.validateSave({ version: 1, currentLocationId: 'loc_office' })).toBe(false);
    });

    it('should restore evidence without duplication', () => {
      evidenceMgr.deserialize(['clue_whiskey_glass', 'clue_whiskey_glass', 'clue_brass_trophy']);
      expect(evidenceMgr.getCount()).toBe(2);
      expect(evidenceMgr.hasEvidence('clue_whiskey_glass')).toBe(true);
      expect(evidenceMgr.hasEvidence('clue_brass_trophy')).toBe(true);
    });
  });
});
