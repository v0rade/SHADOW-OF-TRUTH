import { GameState } from '../game/GameState';
import type { BoardCard, BoardConnection } from '../investigation/InvestigationBoard';

export class InvestigationBoardUI {
  private modal: HTMLElement;
  private canvasArea: HTMLElement;
  private svgLines: SVGSVGElement;
  private bottomBar: HTMLElement;
  private closeBtn: HTMLElement;

  private isOpen = false;
  private selectedCardId: string | null = null;
  private isDragging = false;
  private dragCardId: string | null = null;
  private dragOffsetX = 0;
  private dragOffsetY = 0;

  constructor(parent: HTMLElement) {
    this.modal = document.createElement('div');
    this.modal.className = 'noir-modal';
    this.modal.id = 'investigation-board-modal';

    this.modal.innerHTML = `
      <div class="modal-frame" style="width: 920px; height: 500px;">
        <div class="modal-header">
          <span class="modal-title">📌 INVESTIGATION BOARD — CASE HYPOTHESES & RED YARN</span>
          <button class="modal-close-btn" id="board-modal-close">✕</button>
        </div>
        <div class="corkboard-canvas-area" id="board-canvas-area">
          <svg id="board-svg" style="position: absolute; top:0; left:0; width:100%; height:100%; pointer-events:none; z-index: 2;"></svg>
          <div id="board-cards-layer" style="position: absolute; top:0; left:0; width:100%; height:100%; z-index: 3;"></div>
        </div>
        <div class="board-bottom-bar">
          <div id="board-hint-text" style="color: #c4a77d;">
            Tip: Drag cards to arrange. Click one clue card, then click another to connect them with red yarn.
          </div>
          <div style="display: flex; gap: 8px;">
            <button class="hud-btn" id="btn-board-auto">Re-align Cards</button>
            <button class="hud-btn" id="btn-board-close">Close Board [B / Esc]</button>
          </div>
        </div>
      </div>
    `;

    parent.appendChild(this.modal);

    this.canvasArea = this.modal.querySelector('#board-canvas-area')!;
    this.svgLines = this.modal.querySelector('#board-svg')!;
    this.bottomBar = this.modal.querySelector('.board-bottom-bar')!;
    this.closeBtn = this.modal.querySelector('#board-modal-close')!;

    this.bindEvents();
  }

  private bindEvents(): void {
    this.closeBtn.addEventListener('click', () => this.hide());
    this.modal.querySelector('#btn-board-close')!.addEventListener('click', () => this.hide());
    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) this.hide();
    });

    this.modal.querySelector('#btn-board-auto')!.addEventListener('click', () => {
      const state = GameState.getInstance();
      state.investigationBoard.syncWithCollectedEvidence(state.evidenceManager);
      this.render();
    });

    // Dragging listeners on canvasArea
    this.canvasArea.addEventListener('pointermove', (e) => {
      if (!this.isDragging || !this.dragCardId) return;
      const rect = this.canvasArea.getBoundingClientRect();
      const x = Math.max(10, Math.min(rect.width - 160, e.clientX - rect.left - this.dragOffsetX));
      const y = Math.max(10, Math.min(rect.height - 90, e.clientY - rect.top - this.dragOffsetY));

      GameState.getInstance().investigationBoard.moveCard(this.dragCardId, x, y);

      const cardEl = this.canvasArea.querySelector(`[data-card-id="${this.dragCardId}"]`) as HTMLElement;
      if (cardEl) {
        cardEl.style.left = `${x}px`;
        cardEl.style.top = `${y}px`;
      }

      this.renderLines();
    });

    const stopDrag = () => {
      this.isDragging = false;
      this.dragCardId = null;
    };
    window.addEventListener('pointerup', stopDrag);
    window.addEventListener('pointercancel', stopDrag);
  }

  public show(): void {
    GameState.getInstance().audio.playPageTurn();
    this.modal.classList.add('active');
    this.isOpen = true;

    // Sync board cards with any newly found clues
    const state = GameState.getInstance();
    state.investigationBoard.syncWithCollectedEvidence(state.evidenceManager);

    this.render();
  }

  public hide(): void {
    this.modal.classList.remove('active');
    this.isOpen = false;
    this.selectedCardId = null;
  }

  public toggle(): void {
    if (this.isOpen) this.hide();
    else this.show();
  }

  public isVisible(): boolean {
    return this.isOpen;
  }

  private render(): void {
    const cardsLayer = this.modal.querySelector('#board-cards-layer')!;
    cardsLayer.innerHTML = '';

    const board = GameState.getInstance().investigationBoard;
    const cards = board.getCards();

    for (const card of cards) {
      const cardEl = document.createElement('div');
      cardEl.className = `board-clue-card ${this.selectedCardId === card.id ? 'selected' : ''}`;
      cardEl.dataset.cardId = card.id;
      cardEl.style.left = `${card.x}px`;
      cardEl.style.top = `${card.y}px`;

      cardEl.innerHTML = `
        <div class="pin"></div>
        <div style="font-size: 8px; text-transform: uppercase; color: #8a7356; letter-spacing: 0.5px;">EVIDENCE</div>
        <div style="font-weight: bold; font-size: 11px; color: #1a1a1a; margin: 2px 0;">${card.title}</div>
        <div style="font-size: 8px; color: #555; text-align: right;">ID: ${card.refId.substring(0, 10)}</div>
      `;

      // Pointer down for drag vs click
      cardEl.addEventListener('pointerdown', (e) => {
        e.stopPropagation();
        this.isDragging = true;
        this.dragCardId = card.id;
        const rect = cardEl.getBoundingClientRect();
        this.dragOffsetX = e.clientX - rect.left;
        this.dragOffsetY = e.clientY - rect.top;
      });

      cardEl.addEventListener('click', (e) => {
        e.stopPropagation();
        this.handleCardClick(card);
      });

      cardsLayer.appendChild(cardEl);
    }

    this.renderLines();
  }

  private handleCardClick(card: BoardCard): void {
    GameState.getInstance().audio.playUiClick();
    const hintEl = this.modal.querySelector('#board-hint-text')!;

    if (!this.selectedCardId) {
      // First card selected
      this.selectedCardId = card.id;
      hintEl.textContent = `Selected: "${card.title}". Now click a second card to connect with yarn.`;
      this.render();
      return;
    }

    if (this.selectedCardId === card.id) {
      // Deselect
      this.selectedCardId = null;
      hintEl.textContent = 'Deselected. Click a card to start a connection.';
      this.render();
      return;
    }

    // Connect cards
    const firstCardId = this.selectedCardId;
    this.selectedCardId = null;

    const state = GameState.getInstance();
    const result = state.investigationBoard.connectCards(
      firstCardId,
      card.id,
      state.deductionEngine
    );

    if (result.success) {
      hintEl.innerHTML = `<span style="color: #48bb78; font-weight: bold;">${result.message}</span>`;
    } else {
      hintEl.innerHTML = `<span style="color: #e5c158;">${result.message}</span>`;
    }

    this.render();
  }

  private renderLines(): void {
    this.svgLines.innerHTML = '';
    const board = GameState.getInstance().investigationBoard;
    const connections = board.getConnections();

    for (const conn of connections) {
      const cardA = board.getCard(conn.cardAId);
      const cardB = board.getCard(conn.cardBId);
      if (!cardA || !cardB) continue;

      const x1 = cardA.x + 70;
      const y1 = cardA.y + 35;
      const x2 = cardB.x + 70;
      const y2 = cardB.y + 35;

      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', String(x1));
      line.setAttribute('y1', String(y1));
      line.setAttribute('x2', String(x2));
      line.setAttribute('y2', String(y2));

      // Style line depending on deduction status
      if (conn.status === 'confirmed') {
        line.setAttribute('stroke', '#48bb78'); // Green confirmed
        line.setAttribute('stroke-width', '3');
      } else {
        line.setAttribute('stroke', '#c82333'); // Red yarn
        line.setAttribute('stroke-width', '2');
        line.setAttribute('stroke-dasharray', '4,2');
      }

      this.svgLines.appendChild(line);
    }
  }
}
