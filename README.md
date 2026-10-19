# SHADOWS OF TRUTH — Complete 2D Detective Mystery Game

A complete, atmospheric, playable 2D noir crime investigation game built for web browsers using **Phaser 3**, **TypeScript**, and **Vite**.

---

## 🎮 Game Overview

- **Title**: SHADOWS OF TRUTH
- **Protagonist**: Detective Alex Morgan
- **Setting**: New Noir City (October 1948)
- **Case 01**: *The Fall of Arthur Vance*
  - Prominent investigative reporter Arthur Vance is found dead inside a deadbolted 4th-floor study.
  - While police commanders pressure the precinct to write it off as a simple robbery or suicide, evidence reveals poisoned scotch, a staged locked-room mechanism, forged notes, secret bribes, and a high-level conspiracy involving city council.

---

## 🕹️ Controls (Desktop Browser)

| Key / Input | Action |
| :--- | :--- |
| **A / D** or **← / →** | Walk Left / Right across 2D scenes |
| **W** or **↑** | Enter Doors / Travel between Locations |
| **E** | Inspect Clues / Interrogate Suspects / Witnesses |
| **Tab** | Open / Close Detective Notebook |
| **B** | Open / Close Investigation Murder Board |
| **Space** | Advance typewriter dialogue |
| **Esc** | Pause / Settings Menu / Close open panels |
| **Mouse Click / Drag** | Move cards on Murder Board, connect red yarn, examine clues |

---

## 🏢 Explorable 2D Locations

1. **Morgan's Detective Agency**: Starting office, case files, pinboard, Venetian blinds with rainy streets outside.
2. **Arthur Vance's Apartment (Crime Scene)**: Room 404, police chalk outline, bloodstain, locked-room deadbolt, radiator, hidden wall safe, balcony overlooking the city.
3. **The Metro Herald Newsroom**: Rumbling printing presses, typewriter archives, Vance's locked investigative filing cabinet.
4. **The Velvet Lounge (Speakeasy)**: Neon bar, mahogany counter, jukebox, cash register audit tape, back alley waste bins.
5. **Riverview Underground Parking Garage**: Stamped parking log booth, concrete pillars, getaway vehicle tire traces.
6. **Marcus Sterling's Executive Suite**: Art-deco penthouse, humidor of rare Bolivar cigars, luxury gold fountain pen.

---

## 🔍 Investigation Systems

- **Evidence Collection System**: 16 interconnected clues spanning Physical Evidence, Documents, Digital Audio, Photographs, and Trace Forensics with duplicate prevention.
- **Detective Notebook (6 Tabs)**:
  - *Case Summary & Objectives*: Tracks active leads with live progress.
  - *Evidence Catalog*: Filterable grid of collected clues with forensic analysis.
  - *Suspect Biographies*: Alibis, relationships, and hidden motives.
  - *Witness Statements*: Verbatim transcripts recorded during interrogations.
  - *Timeline*: Sequenced chronology with contradiction markers.
  - *Hypotheses*: Confirmed deductions generated from the Murder Board.
- **Interrogation & Contradiction System**:
  - Expressive character portraits for Alex Morgan, Officer Reed, Evelyn Cross, Vince Rossi, and Marcus Sterling.
  - Branching dialogue trees with conditional choices.
  - Present Evidence drawer: Confront witnesses with physical proof.
  - Dramatic **Contradiction Breakthroughs** that shatter false alibis.
- **Interactive Investigation Board**:
  - Draggable cards on a corkboard canvas.
  - Red yarn connections evaluated in real-time by the `DeductionEngine`.
  - Solves key case mysteries (staged locked room, pre-assault poisoning, broken alibi).
- **Procedural Noir Audio Synthesizer**:
  - Web Audio API procedural jazz electric piano chords (Dm9, Gm9, Bbmaj7, A7#9).
  - Ambient rain and distant thunder generator (filtered pink noise).
  - Custom sound effects: footsteps, typewriter taps, inspection chimes, contradiction stingers, paper rustles, doors.
  - Independent volume sliders for Music and SFX.
- **Save & Load Persistence**:
  - `localStorage` save system tracking position, inventory, unlocked locations, board connections, and dialogue flags.
  - Validation safeguard prevents save corruption.

---

## 🧪 Testing & Verification

The game includes a comprehensive unit test suite running on **Vitest**:

```bash
npm run test
```

Test coverage includes:
- Evidence collection and duplicate prevention.
- Dialogue branching and prerequisite flags.
- Evidence-based contradiction breakthroughs.
- Deduction rule evaluation and non-blocking hint generation.
- Chronological timeline tracking and contradiction invalidation.
- Case objective completion state.
- Grand jury indictment scoring and multi-tier endings (Ranks S, A, B, C, F).
- Save/load serialization and corrupted save rejection.
- Location unlocking logic.

---

## 🚀 Running Locally

```bash
# 1. Install dependencies
npm install

# 2. Start local Vite development server
npm run dev

# 3. Run test suite
npm run test

# 4. Create production static build
npm run build

# 5. Preview production build
npm run preview
```
