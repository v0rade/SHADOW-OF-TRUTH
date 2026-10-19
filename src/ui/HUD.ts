import { GameState } from '../game/GameState';

export class HUD {
  private container: HTMLElement;
  private locationBadge: HTMLElement;
  private clueBadge: HTMLElement;
  private toastElement: HTMLElement;
  private toastTimeout: number | null = null;

  private onNotebookClick?: () => void;
  private onBoardClick?: () => void;
  private onAccuseClick?: () => void;
  private onSettingsClick?: () => void;

  constructor(parent: HTMLElement) {
    this.container = document.createElement('div');
    this.container.id = 'game-hud';

    this.container.innerHTML = `
      <div class="hud-location-badge">
        <span class="loc-icon">📍</span>
        <span id="hud-location-name">Detective Office</span>
      </div>
      <div class="hud-controls-right">
        <span id="hud-clue-count" style="font-size: 11px; color: #c4a77d; margin-right: 6px;">Clues: 0/16</span>
        <button class="hud-btn" id="btn-hud-notebook">📖 Notebook [Tab]</button>
        <button class="hud-btn" id="btn-hud-board">📌 Board [B]</button>
        <button class="hud-btn accent-accuse" id="btn-hud-accuse">⚖️ Accuse</button>
        <button class="hud-btn" id="btn-hud-settings">⚙️ Menu [Esc]</button>
      </div>
    `;

    parent.appendChild(this.container);

    this.locationBadge = this.container.querySelector('#hud-location-name')!;
    this.clueBadge = this.container.querySelector('#hud-clue-count')!;

    // Create Toast element
    this.toastElement = document.createElement('div');
    this.toastElement.id = 'game-toast';
    parent.appendChild(this.toastElement);

    this.bindEvents();
    this.update();
  }

  private bindEvents(): void {
    this.container.querySelector('#btn-hud-notebook')!.addEventListener('click', () => {
      GameState.getInstance().audio.playUiClick();
      this.onNotebookClick?.();
    });

    this.container.querySelector('#btn-hud-board')!.addEventListener('click', () => {
      GameState.getInstance().audio.playUiClick();
      this.onBoardClick?.();
    });

    this.container.querySelector('#btn-hud-accuse')!.addEventListener('click', () => {
      GameState.getInstance().audio.playUiClick();
      this.onAccuseClick?.();
    });

    this.container.querySelector('#btn-hud-settings')!.addEventListener('click', () => {
      GameState.getInstance().audio.playUiClick();
      this.onSettingsClick?.();
    });
  }

  public update(): void {
    const state = GameState.getInstance();
    const loc = state.getCurrentLocation();
    this.locationBadge.textContent = loc.name;

    const collectedCount = state.evidenceManager.getCount();
    const totalCount = state.evidenceManager.getTotalCatalogCount();
    this.clueBadge.textContent = `Clues: ${collectedCount}/${totalCount}`;
  }

  public showToast(message: string, durationMs: number = 3200): void {
    if (this.toastTimeout) {
      clearTimeout(this.toastTimeout);
    }

    this.toastElement.textContent = message;
    this.toastElement.classList.add('show');

    this.toastTimeout = window.setTimeout(() => {
      this.toastElement.classList.remove('show');
      this.toastTimeout = null;
    }, durationMs);
  }

  public setCallbacks(callbacks: {
    onNotebook: () => void;
    onBoard: () => void;
    onAccuse: () => void;
    onSettings: () => void;
  }): void {
    this.onNotebookClick = callbacks.onNotebook;
    this.onBoardClick = callbacks.onBoard;
    this.onAccuseClick = callbacks.onAccuse;
    this.onSettingsClick = callbacks.onSettings;
  }
}
