import './styles/main.css';
import { Game } from './game/Game';
import { GameState } from './game/GameState';
import { HUD } from './ui/HUD';
import { EvidencePanel } from './ui/EvidencePanel';
import { NotebookUI } from './ui/NotebookUI';
import { DialogueUI } from './ui/DialogueUI';
import { InvestigationBoardUI } from './ui/InvestigationBoardUI';
import { AccusationUI } from './ui/AccusationUI';
import { SettingsUI } from './ui/SettingsUI';
import { LocationScene } from './scenes/LocationScene';

function initApp(): void {
  const appContainer = document.getElementById('app')!;
  appContainer.innerHTML = '';

  // Canvas layer container for Phaser 3
  const canvasContainer = document.createElement('div');
  canvasContainer.id = 'phaser-canvas-container';
  appContainer.appendChild(canvasContainer);

  // Atmospheric film grain / vignette overlay
  const vignette = document.createElement('div');
  vignette.className = 'vignette-overlay';
  appContainer.appendChild(vignette);

  // Initialize UI layers
  const evidencePanel = new EvidencePanel(appContainer);
  const notebookUI = new NotebookUI(appContainer, evidencePanel);
  const dialogueUI = new DialogueUI(appContainer);
  const boardUI = new InvestigationBoardUI(appContainer);
  const accusationUI = new AccusationUI(appContainer);
  const settingsUI = new SettingsUI(appContainer);
  const hud = new HUD(appContainer);

  // Wire up HUD buttons
  hud.setCallbacks({
    onNotebook: () => notebookUI.toggle(),
    onBoard: () => boardUI.toggle(),
    onAccuse: () => accusationUI.show(),
    onSettings: () => settingsUI.toggle()
  });

  // Wire up LocationScene callbacks
  LocationScene.onInspectClue = (evidenceId) => {
    const evidence = GameState.getInstance().evidenceManager.getEvidence(evidenceId);
    if (evidence) {
      evidencePanel.show(evidence);
      hud.update();
      hud.showToast(`🔍 Evidence Collected: ${evidence.name}`);
    }
  };

  LocationScene.onOpenNotebook = () => notebookUI.toggle();
  LocationScene.onOpenBoard = () => boardUI.toggle();
  LocationScene.onUpdateHud = () => {
    hud.setVisible(true);
    hud.update();
  };

  dialogueUI.setOnDialogueEnd(() => {
    // Unlock player movement in scene
    const activeScene = game.sceneManager.getActiveScene() as LocationScene | undefined;
    if (activeScene && activeScene.setPlayerLocked) {
      activeScene.setPlayerLocked(false);
    }
  });

  // Start Phaser Game
  const game = new Game('phaser-canvas-container');

  // Global Esc key closes open modals
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (evidencePanel.isVisible()) {
        evidencePanel.hide();
      } else if (notebookUI.isVisible()) {
        notebookUI.hide();
      } else if (boardUI.isVisible()) {
        boardUI.hide();
      } else if (accusationUI.isVisible()) {
        accusationUI.hide();
      } else if (settingsUI.isVisible()) {
        settingsUI.hide();
      } else if (!dialogueUI.isVisible()) {
        settingsUI.show();
      }
    }
  });

  console.log('SHADOWS OF TRUTH - Engine & Investigation Systems Initialized.');
}

window.addEventListener('DOMContentLoaded', initApp);
