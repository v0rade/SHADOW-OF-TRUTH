import { GameState } from '../game/GameState';
import type { ActiveDialogueState } from '../dialogue/DialogueManager';
import type { EvidenceItem } from '../case/EvidenceData';

export class DialogueUI {
  private overlay: HTMLElement;
  private portraitBox: HTMLElement;
  private speakerNameEl: HTMLElement;
  private textBodyEl: HTMLElement;
  private choicesContainer: HTMLElement;
  private presentBtn: HTMLElement;
  private endBtn: HTMLElement;
  private evidenceDrawer: HTMLElement;

  private activeState: ActiveDialogueState | null = null;
  private typewriterInterval: number | null = null;
  private fullText: string = '';
  private displayedLength: number = 0;
  private isTyping: boolean = false;

  private onDialogueEndCallback?: () => void;

  constructor(parent: HTMLElement) {
    this.overlay = document.createElement('div');
    this.overlay.id = 'dialogue-overlay';

    this.overlay.innerHTML = `
      <div class="dialogue-portrait-box" id="dialogue-portrait">
        <!-- Rendered Canvas / Image -->
      </div>
      <div class="dialogue-content-area">
        <div>
          <div class="dialogue-speaker-name" id="dialogue-speaker">SPEAKER</div>
          <div class="dialogue-text-body" id="dialogue-text">...</div>
        </div>
        <div class="dialogue-action-row">
          <div class="dialogue-choices-list" id="dialogue-choices"></div>
          <div class="dialogue-util-buttons">
            <button class="present-evidence-btn" id="btn-dialogue-present">🔍 Present Evidence</button>
            <button class="hud-btn" id="btn-dialogue-end">Leave [Esc]</button>
          </div>
        </div>
      </div>
    `;

    // Evidence presentation drawer modal
    this.evidenceDrawer = document.createElement('div');
    this.evidenceDrawer.className = 'noir-modal';
    this.evidenceDrawer.id = 'dialogue-evidence-drawer';
    this.evidenceDrawer.innerHTML = `
      <div class="modal-frame" style="width: 700px; height: 380px;">
        <div class="modal-header">
          <span class="modal-title">SELECT EVIDENCE TO CONFRONT WITNESS</span>
          <button class="modal-close-btn" id="drawer-close">✕</button>
        </div>
        <div style="flex: 1; padding: 16px; overflow-y: auto;">
          <div class="evidence-grid" id="drawer-evidence-list"></div>
        </div>
      </div>
    `;

    parent.appendChild(this.overlay);
    parent.appendChild(this.evidenceDrawer);

    this.portraitBox = this.overlay.querySelector('#dialogue-portrait')!;
    this.speakerNameEl = this.overlay.querySelector('#dialogue-speaker')!;
    this.textBodyEl = this.overlay.querySelector('#dialogue-text')!;
    this.choicesContainer = this.overlay.querySelector('#dialogue-choices')!;
    this.presentBtn = this.overlay.querySelector('#btn-dialogue-present')!;
    this.endBtn = this.overlay.querySelector('#btn-dialogue-end')!;

    this.bindEvents();

    // Listen to GameState dialogue manager state changes
    GameState.getInstance().dialogueManager.onStateChange(state => {
      if (state) {
        this.show(state);
      } else {
        this.hide();
      }
    });
  }

  private bindEvents(): void {
    this.endBtn.addEventListener('click', () => {
      GameState.getInstance().dialogueManager.endDialogue();
      this.onDialogueEndCallback?.();
    });

    this.presentBtn.addEventListener('click', () => {
      this.openEvidenceDrawer();
    });

    this.evidenceDrawer.querySelector('#drawer-close')!.addEventListener('click', () => {
      this.evidenceDrawer.classList.remove('active');
    });

    this.textBodyEl.addEventListener('click', () => {
      if (this.isTyping) {
        this.finishTypewriter();
      }
    });

    // Spacebar to advance typewriter or pick first choice
    window.addEventListener('keydown', (e) => {
      if (this.overlay.classList.contains('active')) {
        if (e.code === 'Space') {
          if (this.isTyping) {
            this.finishTypewriter();
          }
        }
      }
    });
  }

  public show(state: ActiveDialogueState): void {
    this.activeState = state;
    this.overlay.classList.add('active');

    // Update speaker name and portrait
    this.speakerNameEl.textContent = state.currentNode.speaker;
    this.updatePortrait(state.suspect.avatar);

    // Typewriter text streaming
    this.startTypewriter(state.currentNode.text);

    // Render choice buttons
    this.renderChoices(state);
  }

  public hide(): void {
    this.overlay.classList.remove('active');
    this.evidenceDrawer.classList.remove('active');
    this.activeState = null;
    if (this.typewriterInterval) {
      clearInterval(this.typewriterInterval);
      this.typewriterInterval = null;
    }
  }

  public isVisible(): boolean {
    return this.overlay.classList.contains('active');
  }

  private updatePortrait(avatarKey: string): void {
    this.portraitBox.innerHTML = '';
    const img = document.createElement('div');
    img.style.cssText = 'width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 40px; background: #121720;';

    if (avatarKey === 'reed') img.textContent = '👮';
    else if (avatarKey === 'evelyn') img.textContent = '🕵️‍♀️';
    else if (avatarKey === 'rossi') img.textContent = '🍸';
    else if (avatarKey === 'sterling') img.textContent = '👔';
    else img.textContent = '👤';

    this.portraitBox.appendChild(img);
  }

  private startTypewriter(text: string): void {
    if (this.typewriterInterval) {
      clearInterval(this.typewriterInterval);
    }

    this.fullText = text;
    this.displayedLength = 0;
    this.isTyping = true;
    this.textBodyEl.textContent = '';

    this.typewriterInterval = window.setInterval(() => {
      this.displayedLength++;
      this.textBodyEl.textContent = this.fullText.substring(0, this.displayedLength);

      if (this.displayedLength % 3 === 0) {
        GameState.getInstance().audio.playTypewriterTap();
      }

      if (this.displayedLength >= this.fullText.length) {
        this.finishTypewriter();
      }
    }, 22);
  }

  private finishTypewriter(): void {
    if (this.typewriterInterval) {
      clearInterval(this.typewriterInterval);
      this.typewriterInterval = null;
    }
    this.textBodyEl.textContent = this.fullText;
    this.isTyping = false;
  }

  private renderChoices(state: ActiveDialogueState): void {
    this.choicesContainer.innerHTML = '';

    if (state.currentNode.isEndNode || state.availableChoices.length === 0) {
      const endBtn = document.createElement('button');
      endBtn.className = 'dialogue-choice-btn';
      endBtn.textContent = '▶ [End Conversation]';
      endBtn.addEventListener('click', () => {
        GameState.getInstance().dialogueManager.endDialogue();
      });
      this.choicesContainer.appendChild(endBtn);
      return;
    }

    for (const choice of state.availableChoices) {
      const btn = document.createElement('button');
      btn.className = 'dialogue-choice-btn';
      btn.textContent = `▶ ${choice.text}`;

      btn.addEventListener('click', () => {
        GameState.getInstance().audio.playUiClick();
        GameState.getInstance().dialogueManager.selectChoice(choice.id);
      });

      this.choicesContainer.appendChild(btn);
    }
  }

  private openEvidenceDrawer(): void {
    GameState.getInstance().audio.playPageTurn();
    const listEl = this.evidenceDrawer.querySelector('#drawer-evidence-list')!;
    listEl.innerHTML = '';

    const collected = GameState.getInstance().evidenceManager.getAllCollected();
    if (collected.length === 0) {
      listEl.innerHTML = '<div style="color: #9aa5b5; text-align: center; padding: 30px;">No evidence collected yet to present.</div>';
    } else {
      for (const ev of collected) {
        const card = document.createElement('div');
        card.className = 'evidence-card';
        card.innerHTML = `
          <div class="ev-category">${ev.category}</div>
          <div class="ev-name">${ev.name}</div>
          <div style="font-size: 10px; color: #b0bac9;">${ev.description}</div>
        `;

        card.addEventListener('click', () => {
          this.evidenceDrawer.classList.remove('active');
          this.presentSelectedEvidence(ev);
        });

        listEl.appendChild(card);
      }
    }

    this.evidenceDrawer.classList.add('active');
  }

  private presentSelectedEvidence(evidence: EvidenceItem): void {
    const result = GameState.getInstance().dialogueManager.presentEvidence(evidence.id);

    if (result.breakthrough) {
      // Flash dramatic breakthrough banner
      this.textBodyEl.innerHTML = `<span style="color: #ff4d4d; font-weight: bold;">⚡ CONTRADICTION SHATTERED!</span><br/>${result.reactionText}`;
    } else {
      this.startTypewriter(result.reactionText);
    }
  }

  public setOnDialogueEnd(cb: () => void): void {
    this.onDialogueEndCallback = cb;
  }
}
