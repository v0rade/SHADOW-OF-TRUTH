import { GameState } from '../game/GameState';
import { CaseEvaluator } from '../case/CaseEvaluator';
import type { AccusationSubmission, AccusationEvaluation } from '../case/CaseData';

export class AccusationUI {
  private modal: HTMLElement;
  private formView: HTMLElement;
  private resultsView: HTMLElement;
  private closeBtn: HTMLElement;
  private submitBtn: HTMLElement;
  private isOpen = false;

  constructor(parent: HTMLElement) {
    this.modal = document.createElement('div');
    this.modal.className = 'noir-modal';
    this.modal.id = 'accusation-modal';

    this.modal.innerHTML = `
      <div class="modal-frame" style="width: 880px; height: 500px;">
        <div class="modal-header">
          <span class="modal-title">⚖️ GRAND JURY INDICTMENT — FINAL ACCUSATION</span>
          <button class="modal-close-btn" id="accuse-modal-close">✕</button>
        </div>

        <!-- Accusation Form View -->
        <div id="accuse-form-container" style="display: flex; flex-direction: column; flex: 1; overflow: hidden;">
          <div class="accusation-grid">
            <div class="accusation-section">
              <div class="accusation-section-title">1. Identify the Culprit</div>
              <select class="accusation-select" id="select-culprit">
                <option value="">-- Select Prime Suspect --</option>
                <option value="suspect_reed">Sergeant Thomas Reed (Police Sergeant)</option>
                <option value="suspect_evelyn">Evelyn Cross (Junior Reporter)</option>
                <option value="suspect_rossi">Vincent "Vince" Rossi (Velvet Lounge Owner)</option>
                <option value="suspect_sterling">Councilman Marcus Sterling (City Council Mogul)</option>
              </select>
            </div>

            <div class="accusation-section">
              <div class="accusation-section-title">2. State the Primary Motive</div>
              <select class="accusation-select" id="select-motive">
                <option value="">-- Select Motive --</option>
                <option value="motive_robbery">Desperate Armed Robbery / Stolen Cash</option>
                <option value="motive_silence_expose">Silence the Harbor Scandal Exposé before morning publication</option>
                <option value="motive_professional_jealousy">Rivalry and ambition over newspaper bylines</option>
                <option value="motive_gambling_debts">Unpaid loanshark gambling debts at the Velvet Lounge</option>
              </select>
            </div>

            <div class="accusation-section">
              <div class="accusation-section-title">3. Establish the Execution Method</div>
              <select class="accusation-select" id="select-method">
                <option value="">-- Select Murder Method --</option>
                <option value="method_suicide">Depression & Self-inflicted trauma</option>
                <option value="method_poison_blunt_locked">Aconite poisoning, blunt trauma with trophy, locked-room wire staging</option>
                <option value="method_knife_struggle">Stab wound struggle during a late-night burglary</option>
                <option value="method_balcony_fall">Pushed from the exterior balcony onto the alleyway</option>
              </select>
            </div>

            <div class="accusation-section">
              <div class="accusation-section-title">4. Select Supporting Physical Evidence (Up to 5)</div>
              <div class="accusation-evidence-checklist" id="accuse-evidence-checklist">
                <!-- Checkboxes populated dynamically from collected evidence -->
              </div>
            </div>
          </div>

          <div class="accusation-submit-bar">
            <button class="hud-btn" id="btn-accuse-cancel">Review Notebook More</button>
            <button class="present-evidence-btn" id="btn-accuse-submit">Submit Formal Accusation ⚖️</button>
          </div>
        </div>

        <!-- Case Results Screen View -->
        <div id="accuse-results-container" class="results-container" style="display: none;">
          <div class="results-rank-banner" id="res-rank-banner">RANK: S</div>
          <div class="results-score-badge" id="res-score-badge">Investigation Score: 100/100</div>

          <div style="background: rgba(16, 20, 28, 0.9); border: 1px solid #3a4556; padding: 12px; border-radius: 3px;">
            <div style="color: #d4af37; font-weight: bold; margin-bottom: 6px;">Evaluation Breakdown:</div>
            <ul id="res-feedback-list" style="padding-left: 20px; font-size: 11px; line-height: 1.6;"></ul>
          </div>

          <div class="results-epilogue-box" id="res-epilogue-text"></div>

          <div style="display: flex; justify-content: center; gap: 14px; margin-top: 10px;">
            <button class="hud-btn" id="btn-res-retry">Review Evidence / Retry</button>
            <button class="present-evidence-btn" id="btn-res-newgame">Start New Investigation</button>
          </div>
        </div>

      </div>
    `;

    parent.appendChild(this.modal);

    this.formView = this.modal.querySelector('#accuse-form-container')!;
    this.resultsView = this.modal.querySelector('#accuse-results-container')!;
    this.closeBtn = this.modal.querySelector('#accuse-modal-close')!;
    this.submitBtn = this.modal.querySelector('#btn-accuse-submit')!;

    this.bindEvents();
  }

  private bindEvents(): void {
    this.closeBtn.addEventListener('click', () => this.hide());
    this.modal.querySelector('#btn-accuse-cancel')!.addEventListener('click', () => this.hide());
    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) this.hide();
    });

    this.submitBtn.addEventListener('click', () => {
      this.handleSubmit();
    });

    this.modal.querySelector('#btn-res-retry')!.addEventListener('click', () => {
      this.formView.style.display = 'flex';
      this.resultsView.style.display = 'none';
    });

    this.modal.querySelector('#btn-res-newgame')!.addEventListener('click', () => {
      GameState.getInstance().saveCurrentGame();
      window.location.reload();
    });
  }

  public show(): void {
    GameState.getInstance().audio.playPageTurn();
    this.modal.classList.add('active');
    this.isOpen = true;

    this.formView.style.display = 'flex';
    this.resultsView.style.display = 'none';

    this.populateEvidenceChecklist();
  }

  public hide(): void {
    this.modal.classList.remove('active');
    this.isOpen = false;
  }

  public isVisible(): boolean {
    return this.isOpen;
  }

  private populateEvidenceChecklist(): void {
    const listEl = this.modal.querySelector('#accuse-evidence-checklist')!;
    listEl.innerHTML = '';

    const collected = GameState.getInstance().evidenceManager.getAllCollected();
    if (collected.length === 0) {
      listEl.innerHTML = '<div style="color: #9aa5b5; font-size: 11px;">No evidence collected yet.</div>';
      return;
    }

    for (const ev of collected) {
      const label = document.createElement('label');
      label.className = 'accusation-check-label';
      label.innerHTML = `
        <input type="checkbox" name="accuse_evidence" value="${ev.id}" style="accent-color: #d4af37;" />
        <span>${ev.name} <em style="color: #8a7356;">(${ev.category})</em></span>
      `;
      listEl.appendChild(label);
    }
  }

  private handleSubmit(): void {
    const culpritSelect = this.modal.querySelector('#select-culprit') as HTMLSelectElement;
    const motiveSelect = this.modal.querySelector('#select-motive') as HTMLSelectElement;
    const methodSelect = this.modal.querySelector('#select-method') as HTMLSelectElement;

    const checkedBoxes = Array.from(
      this.modal.querySelectorAll('input[name="accuse_evidence"]:checked')
    ) as HTMLInputElement[];

    const submission: AccusationSubmission = {
      culpritId: culpritSelect.value,
      motiveId: motiveSelect.value,
      methodId: methodSelect.value,
      keyEvidenceIds: checkedBoxes.map(b => b.value)
    };

    if (!submission.culpritId || !submission.motiveId || !submission.methodId) {
      alert('Please select a culprit, motive, and murder method before submitting charges.');
      return;
    }

    const evaluation = CaseEvaluator.evaluateAccusation(submission, GameState.getInstance().caseData);
    this.displayResults(evaluation);
  }

  private displayResults(evaluation: AccusationEvaluation): void {
    GameState.getInstance().audio.playBreakthroughChord();

    this.formView.style.display = 'none';
    this.resultsView.style.display = 'flex';

    const rankEl = this.modal.querySelector('#res-rank-banner') as HTMLElement;
    const scoreEl = this.modal.querySelector('#res-score-badge')!;
    const feedbackList = this.modal.querySelector('#res-feedback-list')!;
    const epilogueEl = this.modal.querySelector('#res-epilogue-text')!;

    if (rankEl) {
      rankEl.textContent = `VERDICT: ${evaluation.feedbackTitle} (GRADE ${evaluation.rank})`;
      rankEl.style.color = evaluation.rank === 'S' || evaluation.rank === 'A' ? '#48bb78' : '#e5c158';
    }

    scoreEl.textContent = `Prosecution Case Score: ${evaluation.totalScore}/100`;

    feedbackList.innerHTML = evaluation.feedbackDetails.map(f => {
      const color = f.startsWith('✓') ? '#48bb78' : f.startsWith('△') ? '#e5c158' : '#ff6666';
      return `<li style="color: ${color}; margin-bottom: 4px;">${f}</li>`;
    }).join('');

    epilogueEl.textContent = evaluation.epilogue;
  }
}
