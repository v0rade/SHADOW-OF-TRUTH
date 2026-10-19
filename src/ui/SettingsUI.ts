import { GameState } from '../game/GameState';
import { SaveManager } from '../persistence/SaveManager';

export class SettingsUI {
  private modal: HTMLElement;
  private closeBtn: HTMLElement;
  private musicSlider: HTMLInputElement;
  private sfxSlider: HTMLInputElement;
  private saveBtn: HTMLElement;
  private loadBtn: HTMLElement;
  private resetBtn: HTMLElement;
  private saveStatusEl: HTMLElement;

  private isOpen = false;

  constructor(parent: HTMLElement) {
    this.modal = document.createElement('div');
    this.modal.className = 'noir-modal';
    this.modal.id = 'settings-modal';

    this.modal.innerHTML = `
      <div class="modal-frame" style="width: 640px; height: 440px;">
        <div class="modal-header">
          <span class="modal-title">⚙️ CASE SETTINGS & CONTROLS</span>
          <button class="modal-close-btn" id="settings-modal-close">✕</button>
        </div>
        <div style="flex: 1; padding: 20px 24px; overflow-y: auto; font-size: 12px; line-height: 1.6;">
          <div style="margin-bottom: 16px;">
            <div style="font-weight: bold; color: #d4af37; margin-bottom: 8px;">Audio Controls</div>
            <div style="display: flex; flex-direction: column; gap: 8px;">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span>Noir Music & Rain Ambience:</span>
                <input type="range" id="slider-music" min="0" max="1" step="0.05" value="0.5" style="width: 180px; accent-color: #d4af37;" />
              </div>
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span>Sound Effects & Typewriter:</span>
                <input type="range" id="slider-sfx" min="0" max="1" step="0.05" value="0.7" style="width: 180px; accent-color: #d4af37;" />
              </div>
            </div>
          </div>

          <div style="margin-bottom: 16px; border-top: 1px solid #3a4556; padding-top: 12px;">
            <div style="font-weight: bold; color: #d4af37; margin-bottom: 8px;">Detective Controls Guide</div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px; font-size: 11px; color: #b0bac9;">
              <div>[A] / [D] or [←] / [→]: Move Left / Right</div>
              <div>[W] or [↑]: Enter Doors / Travel</div>
              <div>[E]: Inspect Objects / Talk to Suspects</div>
              <div>[Space]: Fast-forward Dialogue</div>
              <div>[Tab]: Open Detective Notebook</div>
              <div>[B]: Open Investigation Board</div>
              <div>[Esc]: Close Panel / Menu</div>
              <div>Mouse Click: Inspect Clues & Connect Pins</div>
            </div>
          </div>

          <div style="border-top: 1px solid #3a4556; padding-top: 12px;">
            <div style="font-weight: bold; color: #d4af37; margin-bottom: 8px;">Case File Persistence (localStorage)</div>
            <div style="display: flex; gap: 10px; margin-bottom: 8px;">
              <button class="hud-btn" id="btn-save-game">💾 Save Game</button>
              <button class="hud-btn" id="btn-load-game">📂 Load Save</button>
              <button class="hud-btn" id="btn-reset-save" style="border-color: #a62a2a; color: #ff9999;">⚠️ Reset Save</button>
            </div>
            <div id="save-status-msg" style="font-size: 11px; color: #48bb78; min-height: 18px;"></div>
          </div>
        </div>
      </div>
    `;

    parent.appendChild(this.modal);

    this.closeBtn = this.modal.querySelector('#settings-modal-close')!;
    this.musicSlider = this.modal.querySelector('#slider-music')!;
    this.sfxSlider = this.modal.querySelector('#slider-sfx')!;
    this.saveBtn = this.modal.querySelector('#btn-save-game')!;
    this.loadBtn = this.modal.querySelector('#btn-load-game')!;
    this.resetBtn = this.modal.querySelector('#btn-reset-save')!;
    this.saveStatusEl = this.modal.querySelector('#save-status-msg')!;

    this.bindEvents();
  }

  private bindEvents(): void {
    this.closeBtn.addEventListener('click', () => this.hide());
    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) this.hide();
    });

    this.musicSlider.addEventListener('input', () => {
      const vol = parseFloat(this.musicSlider.value);
      GameState.getInstance().audio.setMusicVolume(vol);
    });

    this.sfxSlider.addEventListener('input', () => {
      const vol = parseFloat(this.sfxSlider.value);
      GameState.getInstance().audio.setSfxVolume(vol);
    });

    this.saveBtn.addEventListener('click', () => {
      GameState.getInstance().audio.playUiClick();
      const success = GameState.getInstance().saveCurrentGame();
      if (success) {
        this.saveStatusEl.textContent = '✓ Game successfully saved to local storage.';
        this.saveStatusEl.style.color = '#48bb78';
      } else {
        this.saveStatusEl.textContent = '✗ Failed to save game.';
        this.saveStatusEl.style.color = '#ff6666';
      }
    });

    this.loadBtn.addEventListener('click', () => {
      GameState.getInstance().audio.playUiClick();
      if (SaveManager.hasSave()) {
        const success = GameState.getInstance().loadSavedGame();
        if (success) {
          this.saveStatusEl.textContent = '✓ Game loaded. Refreshing scene...';
          this.saveStatusEl.style.color = '#48bb78';
          setTimeout(() => {
            window.location.reload();
          }, 600);
        }
      } else {
        this.saveStatusEl.textContent = 'No previous save file found.';
        this.saveStatusEl.style.color = '#e5c158';
      }
    });

    this.resetBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to erase all case progress and restart?')) {
        SaveManager.resetSave();
        window.location.reload();
      }
    });
  }

  public show(): void {
    GameState.getInstance().audio.playUiClick();
    this.musicSlider.value = String(GameState.getInstance().audio.getMusicVolume());
    this.sfxSlider.value = String(GameState.getInstance().audio.getSfxVolume());
    this.saveStatusEl.textContent = '';
    this.modal.classList.add('active');
    this.isOpen = true;
  }

  public hide(): void {
    this.modal.classList.remove('active');
    this.isOpen = false;
  }

  public toggle(): void {
    if (this.isOpen) this.hide();
    else this.show();
  }

  public isVisible(): boolean {
    return this.isOpen;
  }
}
