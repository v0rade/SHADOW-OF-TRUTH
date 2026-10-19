import type { TimelineEvent } from '../case/CaseData';
import type { EvidenceManager } from './EvidenceManager';

export class TimelineManager {
  private events: TimelineEvent[];

  constructor(initialEvents: TimelineEvent[]) {
    this.events = JSON.parse(JSON.stringify(initialEvents));
  }

  public getDiscoveredEvents(evidenceManager: EvidenceManager): TimelineEvent[] {
    return this.events
      .filter(event => {
        // If no required evidence, it is known from the start
        if (!event.requiredEvidenceId) return true;
        // Otherwise player must have found the supporting clue
        return evidenceManager.hasEvidence(event.requiredEvidenceId);
      })
      .map(event => {
        const copy = { ...event };
        // Check if contradicted by any collected evidence
        if (event.contradictedBy && evidenceManager.hasEvidence(event.contradictedBy)) {
          copy.verified = false;
        }
        return copy;
      })
      .sort((a, b) => a.timestampMinutes - b.timestampMinutes);
  }

  public getContradictedEvents(evidenceManager: EvidenceManager): TimelineEvent[] {
    return this.getDiscoveredEvents(evidenceManager).filter(e => !e.verified && e.contradictedBy);
  }

  public getVerifiedEvents(evidenceManager: EvidenceManager): TimelineEvent[] {
    return this.getDiscoveredEvents(evidenceManager).filter(e => e.verified);
  }
}
