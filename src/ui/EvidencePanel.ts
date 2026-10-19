import type { EvidenceItem } from '../case/EvidenceData';
import { GameState } from '../game/GameState';

export class EvidencePanel {
  private modal: HTMLElement;
  private titleEl: HTMLElement;
  private categoryEl: HTMLElement;
  private locationEl: HTMLElement;
  private descEl: HTMLElement;
  private detailsEl: HTMLElement;
  private relevanceEl: HTMLElement;
  private tagsEl: HTMLElement;
  private closeBtn: HTMLElement;

  private isOpen = false;

  constructor(parent: HTMLElement) {
    this.modal = document.createElement('div');
    this.modal.className = 'noir-modal';
    this.modal.id = 'evidence-inspection-modal';

    this.modal.innerHTML = `
      <div class="modal-frame" style="width: 680px; height: 420px;">
        <div class="modal-header">
          <span class="modal-title" id="ev-modal-title">EVIDENCE INSPECTION</span>
          <button class="modal-close-btn" id="ev-modal-close">✕</button>
        </div>
        <div class="modal-content" style="padding: 20px 24px; overflow-y: auto; font-size: 12px; line-height: 1.6;">
          <div style="display: flex; justify-content: space-between; align-items: baseline; border-bottom: 1px solid #3a4556; padding-bottom: 8px; margin-bottom: 14px;">
            <div id="ev-name" style="font-size: 16px; font-weight: bold; color: #d4af37; font-family: Georgia, serif;"></div>
            <div id="ev-category" style="font-size: 11px; text-transform: uppercase; color: #4a9eb5; letter-spacing: 1px;"></div>
          </div>
          <div style="margin-bottom: 12px;">
            <span style="color: #c4a77d; font-weight: bold;">Location: </span>
            <span id="ev-location" style="color: #e0e0e0;"></span>
          </div>
          <div style="background: rgba(0,0,0,0.3); border-left: 3px solid #c4a77d; padding: 10px 14px; margin-bottom: 14px;">
            <p id="ev-desc" style="color: #f0e8dc; margin-bottom: 8px; font-style: italic;"></p>
            <p id="ev-details" style="color: #b0bac9;"></p>
          </div>
          <div style="margin-bottom: 14px;">
            <div style="color: #d4af37; font-weight: bold; margin-bottom: 4px;">Forensic Relevance:</div>
            <div id="ev-relevance" style="color: #dcdcdc;"></div>
          </div>
          <div id="ev-tags" style="display: flex; gap: 6px; flex-wrap: wrap;"></div>
        </div>
      </div>
    `;

    parent.appendChild(this.modal);

    this.titleEl = this.modal.querySelector('#ev-name')!;
    this.categoryEl = this.modal.querySelector('#ev-category')!;
    this.locationEl = this.modal.querySelector('#ev-location')!;
    this.descEl = this.modal.querySelector('#ev-desc')!;
    this.detailsEl = this.modal.querySelector('#ev-details')!;
    this.relevanceEl = this.modal.querySelector('#ev-relevance')!;
    this.tagsEl = this.modal.querySelector('#ev-tags')!;
    this.closeBtn = this.modal.querySelector('#ev-modal-close')!;

    this.closeBtn.addEventListener('click', () => this.hide());
    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) this.hide();
    });
  }

  public show(evidence: EvidenceItem): void {
    GameState.getInstance().audio.playPageTurn();

    this.titleEl.textContent = evidence.name;
    this.categoryEl.textContent = evidence.category;
    this.locationEl.textContent = evidence.discoveryLocation;
    this.descEl.textContent = `"${evidence.description}"`;
    this.detailsEl.textContent = evidence.details;
    this.relevanceEl.textContent = evidence.investigationRelevance;

    this.tagsEl.innerHTML = '';
    for (const tag of (evidence.tags || [])) {
      const tagBadge = document.createElement('span');
      tagBadge.style.cssText = 'background: rgba(196, 167, 125, 0.15); border: 1px solid #8a7356; padding: 2px 8px; border-radius: 2px; font-size: 10px; color: #d4af37;';
      tagBadge.textContent = `#${tag}`;
      this.tagsEl.appendChild(tagBadge);
    }

    this.modal.classList.add('active');
    this.isOpen = true;
  }

  public hide(): void {
    this.modal.classList.remove('active');
    this.isOpen = false;
  }

  public isVisible(): boolean {
    return this.isOpen;
  }
}
