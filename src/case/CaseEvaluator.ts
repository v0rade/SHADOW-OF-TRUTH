import type { AccusationSubmission, AccusationEvaluation, CaseDefinition } from './CaseData';

export class CaseEvaluator {
  public static evaluateAccusation(
    submission: AccusationSubmission,
    caseData: CaseDefinition
  ): AccusationEvaluation {
    const correct = caseData.correctAccusation;
    const culpritCorrect = submission.culpritId === correct.culpritId;
    const motiveCorrect = submission.motiveId === correct.motiveId;
    const methodCorrect = submission.methodId === correct.methodId;

    // Check key evidence matches
    const requiredEvidence = correct.requiredKeyEvidenceIds;
    let matchingEvidenceCount = 0;
    for (const reqId of requiredEvidence) {
      if (submission.keyEvidenceIds.includes(reqId)) {
        matchingEvidenceCount++;
      }
    }

    const evidenceScore = requiredEvidence.length > 0
      ? Math.round((matchingEvidenceCount / requiredEvidence.length) * 100)
      : 100;

    let points = 0;
    if (culpritCorrect) points += 40;
    if (motiveCorrect) points += 20;
    if (methodCorrect) points += 20;
    points += Math.round((evidenceScore / 100) * 20);

    const isFullyCorrect = culpritCorrect && motiveCorrect && methodCorrect && evidenceScore >= 75;

    let rank: 'S' | 'A' | 'B' | 'C' | 'F' = 'F';
    if (points >= 95) rank = 'S';
    else if (points >= 80) rank = 'A';
    else if (points >= 65) rank = 'B';
    else if (points >= 40) rank = 'C';
    else rank = 'F';

    const feedbackDetails: string[] = [];

    if (culpritCorrect) {
      feedbackDetails.push('✓ Culprit accurately identified: Councilman Marcus Sterling was the mastermind behind the murder.');
    } else {
      feedbackDetails.push('✗ Incorrect Culprit: The evidence does not support convicting this suspect as the killer.');
    }

    if (motiveCorrect) {
      feedbackDetails.push('✓ Motive identified: Silencing Vance before he could publish the Harbor Scandal exposé.');
    } else {
      feedbackDetails.push('✗ Flawed Motive: The primary driving motive was the impending publication of the harbor graft dossier.');
    }

    if (methodCorrect) {
      feedbackDetails.push('✓ Method identified: Aconite poisoning followed by blunt trauma, staged with a locked-door wire trick.');
    } else {
      feedbackDetails.push('✗ Method inaccuracies: Arthur was first incapacitated by poison, struck with the brass trophy, and locked from outside.');
    }

    if (evidenceScore === 100) {
      feedbackDetails.push('✓ All critical pieces of corroborating physical evidence were flawlessly presented.');
    } else if (evidenceScore >= 50) {
      feedbackDetails.push(`△ Partially backed by evidence (${matchingEvidenceCount}/${requiredEvidence.length} key clues presented).`);
    } else {
      feedbackDetails.push(`✗ Insufficient physical evidence presented (${matchingEvidenceCount}/${requiredEvidence.length} key clues). The court requires stronger proof.`);
    }

    let feedbackTitle = '';
    let epilogue = '';

    if (rank === 'S') {
      feedbackTitle = 'MASTER DETECTIVE — FLAWLESS CASE';
      epilogue =
        'Confronted with the airtight web of evidence—the parking garage timestamp placing him outside the apartment, the rare Bolivar cigar ash on the rainy balcony, the matching peacock ink on the forged suicide note, and the bank transfer payoff to Vince Rossi—Marcus Sterling breaks down in front of District Attorney investigators. ' +
        'Vince Rossi turns state witness to save himself from life imprisonment. Evelyn Cross recovers Arthur Vance\'s original audio tape and prints the complete exposé on the front page of the Metro Herald: "THE WATERFRONT GRIFT UNMASKED: IN HONOR OF ARTHUR VANCE". ' +
        'Justice is served in the rain-swept city, and Arthur Vance\'s name is immortalized in journalistic courage.';
    } else if (rank === 'A') {
      feedbackTitle = 'CASE RESOLVED — CONVICTION SECURED';
      epilogue =
        'Marcus Sterling is arrested and indicted for second-degree murder and conspiracy. Although his high-priced defense lawyers attempt to exploit minor gaps in the evidence, the core physical proof holds up in court. ' +
        'Sterling is sentenced to 25 years without parole. The waterfront redevelopment deal is frozen, and Arthur Vance\'s memory is vindicated.';
    } else if (rank === 'B') {
      feedbackTitle = 'PARTIAL RESOLUTION — CONTESTED TRIAL';
      epilogue =
        'Sterling is brought to trial, but due to gaps in the forensic trail and timeline inconsistencies, the trial drags on for months before a deadlocked jury. He avoids a murder conviction on a technicality, though he is stripped of his council seat for financial fraud.';
    } else if (rank === 'C') {
      feedbackTitle = 'MISTRIAL — INSUFFICIENT PROOF';
      epilogue =
        'The evidence presented was too flimsy to withstand grand jury scrutiny. Marcus Sterling walks free through the courthouse steps with a smirk, while the true story of Arthur Vance\'s death remains an unsolved tragedy in the precinct cold cases.';
    } else {
      feedbackTitle = 'BOTCHED ACCUSATION — GRAVE MISCARRIAGE';
      epilogue =
        'An innocent person was wrongfully accused while the true architect of the conspiracy escaped justice. Marcus Sterling smoothly completes his corrupt harbor takeover, and Arthur Vance\'s murder is officially filed away as a closed robbery-suicide.';
    }

    return {
      isCorrect: isFullyCorrect,
      culpritCorrect,
      motiveCorrect,
      methodCorrect,
      evidenceScore,
      totalScore: points,
      rank,
      feedbackTitle,
      feedbackDetails,
      epilogue
    };
  }
}
