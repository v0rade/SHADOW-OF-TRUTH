import { GameState } from '../game/GameState';
import type { EvidenceItem } from '../case/EvidenceData';
import type { EvidencePanel } from './EvidencePanel';

export class NotebookUI {
  private modal: HTMLElement;
  private tabsSidebar: HTMLElement;
  private contentView: HTMLElement;
  private closeBtn: HTMLElement;
  private evidencePanel: EvidencePanel;
  private isOpen = false;

  constructor(parent: HTMLElement, evidencePanel: EvidencePanel) {
    this.evidencePanel = evidencePanel;

    this.modal = document.createElement('div');
    this.modal.className = 'noir-modal';
    this.modal.id = 'notebook-modal';

    this.modal.innerHTML = `
      <div class="modal-frame">
        <div class="modal-header">
          <span class="modal-title">DETECTIVE NOTEBOOK — CASE ARCHIVE</span>
          <button class="modal-close-btn" id="notebook-modal-close">✕</button>
        </div>
        <div class="notebook-body">
          <div class="notebook-tabs-sidebar">
            <button class="notebook-tab-btn active" data-tab="summary">📋 Case Summary</button>
            <button class="notebook-tab-btn" data-tab="evidence">🔍 Evidence (<span id="tab-ev-count">0</span>)</button>
            <button class="notebook-tab-btn" data-tab="suspects">👥 Suspects</button>
            <button class="notebook-tab-btn" data-tab="statements">💬 Statements</button>
            <button class="notebook-tab-btn" data-tab="timeline">⏱️ Timeline</button>
            <button class="notebook-tab-btn" data-tab="hypotheses">💡 Hypotheses</button>
          </div>
          <div class="notebook-content-view" id="notebook-tab-content">
            <!-- Dynamic Tab Content -->
          </div>
        </div>
      </div>
    `;

    parent.appendChild(this.modal);

    this.tabsSidebar = this.modal.querySelector('.notebook-tabs-sidebar')!;
    this.contentView = this.modal.querySelector('#notebook-tab-content')!;
    this.closeBtn = this.modal.querySelector('#notebook-modal-close')!;

    this.bindEvents();
  }

  private bindEvents(): void {
    this.closeBtn.addEventListener('click', () => this.hide());
    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) this.hide();
    });

    const tabButtons = this.tabsSidebar.querySelectorAll('.notebook-tab-btn');
    tabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        GameState.getInstance().audio.playUiClick();
        tabButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const tab = (btn as HTMLElement).dataset.tab as 'summary' | 'evidence' | 'suspects' | 'statements' | 'timeline' | 'hypotheses';
        GameState.getInstance().notebookManager.setActiveTab(tab);
        this.renderTab(tab);
      });
    });
  }

  public show(): void {
    GameState.getInstance().audio.playPageTurn();
    this.modal.classList.add('active');
    this.isOpen = true;

    // Update evidence badge count
    const countEl = this.modal.querySelector('#tab-ev-count');
    if (countEl) {
      countEl.textContent = String(GameState.getInstance().evidenceManager.getCount());
    }

    const currentTab = GameState.getInstance().notebookManager.getActiveTab();
    this.renderTab(currentTab);
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

  private renderTab(tab: 'summary' | 'evidence' | 'suspects' | 'statements' | 'timeline' | 'hypotheses'): void {
    const state = GameState.getInstance();
    this.contentView.innerHTML = '';

    if (tab === 'summary') {
      const summary = state.notebookManager.getCaseSummary();
      this.contentView.innerHTML = `
        <div class="summary-header">
          <div class="summary-title">${summary.title}</div>
          <div class="summary-meta">${summary.subtitle} | Date: ${summary.date} | Victim: <strong>${summary.victim}</strong></div>
        </div>
        <div style="margin-bottom: 16px; background: rgba(0,0,0,0.3); padding: 12px; border-left: 3px solid #c4a77d;">
          <div style="font-weight: bold; color: #d4af37; margin-bottom: 6px;">Case Synopsis:</div>
          <p style="color: #e0e0e0; font-size: 11px;">${summary.synopsis}</p>
        </div>
        <div style="margin-bottom: 16px;">
          <div style="font-weight: bold; color: #d4af37; margin-bottom: 8px;">Initial Briefing Notes:</div>
          <ul style="padding-left: 20px; color: #b0bac9; font-size: 11px;">
            ${summary.briefing.map(b => `<li style="margin-bottom: 4px;">${b}</li>`).join('')}
          </ul>
        </div>
        <div>
          <div style="font-weight: bold; color: #d4af37; margin-bottom: 8px;">Investigation Objectives:</div>
          ${summary.objectives.map(obj => `
            <div class="objective-item ${obj.completed ? 'completed' : ''}">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2px;">
                <span style="font-weight: bold; color: ${obj.completed ? '#48bb78' : '#e0e0e0'};">${obj.title}</span>
                <span class="obj-status" style="font-size: 10px; font-weight: bold;">${obj.completed ? '✓ SOLVED' : '○ IN PROGRESS'}</span>
              </div>
              <div style="font-size: 11px; color: #9aa5b5;">${obj.description}</div>
            </div>
          `).join('')}
        </div>
      `;
    } else if (tab === 'evidence') {
      const collected = state.evidenceManager.getAllCollected();
      if (collected.length === 0) {
        this.contentView.innerHTML = `
          <div style="text-align: center; padding: 40px; color: #8a7356;">
            No physical clues collected yet. Explore the room and press [E] near highlighted objects.
          </div>
        `;
        return;
      }

      const grid = document.createElement('div');
      grid.className = 'evidence-grid';

      for (const ev of collected) {
        const card = document.createElement('div');
        card.className = 'evidence-card';
        card.innerHTML = `
          <div class="ev-category">${ev.category}</div>
          <div class="ev-name">${ev.name}</div>
          <div style="font-size: 10px; color: #9aa5b5; overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;">
            ${ev.description}
          </div>
          <div style="font-size: 9px; color: #c4a77d; margin-top: auto;">📍 ${ev.discoveryLocation.split('-')[0]}</div>
        `;
        card.addEventListener('click', () => {
          this.evidencePanel.show(ev);
        });
        grid.appendChild(card);
      }
      this.contentView.appendChild(grid);

    } else if (tab === 'suspects') {
      const suspects = state.notebookManager.getSuspects();
      const list = document.createElement('div');
      list.className = 'suspects-list';

      for (const s of suspects) {
        const card = document.createElement('div');
        card.className = 'suspect-profile-card';
        card.innerHTML = `
          <div class="suspect-avatar-box">
            <div style="font-size: 28px;">👤</div>
          </div>
          <div class="suspect-info">
            <div class="suspect-name">${s.name}</div>
            <div class="suspect-title">${s.title}</div>
            <div style="margin-bottom: 6px; font-size: 11px; color: #ccc;">${s.bio}</div>
            <div style="background: rgba(0,0,0,0.3); padding: 6px 10px; border-radius: 2px; font-size: 10px; border-left: 2px solid #c4a77d;">
              <span style="color: #d4af37; font-weight: bold;">Claimed Alibi: </span>
              <span style="color: #bbb;">${s.knownAlibi}</span>
            </div>
          </div>
        `;
        list.appendChild(card);
      }
      this.contentView.appendChild(list);

    } else if (tab === 'statements') {
      const statements = state.notebookManager.getStatements();
      if (statements.length === 0) {
        this.contentView.innerHTML = `
          <div style="text-align: center; padding: 40px; color: #8a7356;">
            No witness statements recorded yet. Interrogate suspects to record their testimony.
          </div>
        `;
        return;
      }

      this.contentView.innerHTML = statements.map(s => `
        <div style="background: rgba(24, 30, 40, 0.7); border-left: 3px solid #c4a77d; padding: 8px 12px; margin-bottom: 10px; border-radius: 2px;">
          <div style="display: flex; justify-content: space-between; font-size: 10px; color: #d4af37; margin-bottom: 4px;">
            <span style="font-weight: bold;">${s.suspectName}</span>
            <span>${s.timestamp}</span>
          </div>
          <p style="font-size: 11px; color: #f0e8dc; font-style: italic;">"${s.statement}"</p>
        </div>
      `).join('');

    } else if (tab === 'timeline') {
      const events = state.notebookManager.getTimelineEvents();
      const track = document.createElement('div');
      track.className = 'timeline-track';

      for (const ev of events) {
        const item = document.createElement('div');
        item.className = `timeline-event-item ${!ev.verified ? 'contradicted' : ''}`;
        item.innerHTML = `
          <div class="tl-time">${ev.timeString}</div>
          <div class="tl-title">${ev.title} ${!ev.verified ? '⚠️ [CONTRADICTED]' : '✓ [VERIFIED]'}</div>
          <div class="tl-desc">${ev.description}</div>
          <div style="font-size: 9px; color: #c4a77d; margin-top: 2px;">Source: ${ev.source}</div>
        `;
        track.appendChild(item);
      }
      this.contentView.appendChild(track);

    } else if (tab === 'hypotheses') {
      const deductions = state.notebookManager.getHypotheses();
      if (deductions.length === 0) {
        this.contentView.innerHTML = `
          <div style="text-align: center; padding: 40px; color: #8a7356;">
            No confirmed hypotheses yet.<br/>
            Open the <strong>Investigation Board [B]</strong> and connect related clues with yarn to formulate deductions.
          </div>
        `;
        return;
      }

      this.contentView.innerHTML = deductions.map(d => `
        <div style="background: rgba(20, 26, 36, 0.9); border: 1px solid #48bb78; border-left: 4px solid #48bb78; padding: 12px; margin-bottom: 12px; border-radius: 3px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
            <span style="font-weight: bold; color: #48bb78; font-size: 13px;">💡 ${d.title}</span>
            <span style="font-size: 9px; color: #aaa; text-transform: uppercase;">Confirmed Deduction</span>
          </div>
          <div style="font-size: 11px; font-weight: bold; color: #fff; margin-bottom: 6px;">"${d.resultingFact}"</div>
          <div style="font-size: 10px; color: #b0bac9;">${d.explanation}</div>
        </div>
      `).join('');
    }
  }
}
