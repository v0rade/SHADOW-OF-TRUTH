import type Phaser from 'phaser';

export class AssetGenerator {
  public static generateAllTextures(scene: Phaser.Scene): void {
    this.createPlayerSpritesheet(scene);
    this.createNpcSprites(scene);
    this.createPortraits(scene);
    this.createClueIcons(scene);
    this.createEnvironmentTextures(scene);
    this.createFxTextures(scene);
  }

  // Detective Alex Morgan (Walking & Idle Sprites)
  private static createPlayerSpritesheet(scene: Phaser.Scene): void {
    const width = 128; // 4 frames of 32x48
    const height = 48;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d')!;

    // Draw 4 frames (frame 0: idle, frame 1: walk step A, frame 2: pass, frame 3: walk step B)
    for (let f = 0; f < 4; f++) {
      const ox = f * 32;
      const legOffset = f === 1 ? -3 : f === 3 ? 3 : 0;
      const armOffset = f === 1 ? 2 : f === 3 ? -2 : 0;

      // Shoes
      ctx.fillStyle = '#111116';
      ctx.fillRect(ox + 10 + legOffset, 42, 5, 6);
      ctx.fillRect(ox + 17 - legOffset, 42, 5, 6);

      // Trousers (Dark charcoal)
      ctx.fillStyle = '#1e2229';
      ctx.fillRect(ox + 10 + legOffset, 32, 5, 10);
      ctx.fillRect(ox + 17 - legOffset, 32, 5, 10);

      // Trenchcoat (Noir khaki / muted slate brown)
      ctx.fillStyle = '#4a443b';
      ctx.fillRect(ox + 9, 18, 14, 18);
      // Coat flaps
      ctx.fillStyle = '#3a342c';
      ctx.fillRect(ox + 8, 28, 4, 10);
      ctx.fillRect(ox + 20, 28, 4, 10);

      // Tie & collar
      ctx.fillStyle = '#f0ede6';
      ctx.fillRect(ox + 14, 16, 4, 4);
      ctx.fillStyle = '#8a1c14'; // Crimson tie
      ctx.fillRect(ox + 15, 18, 2, 7);

      // Coat lapels & belt
      ctx.fillStyle = '#2d2822';
      ctx.fillRect(ox + 10, 27, 12, 2);

      // Arms / Hands
      ctx.fillStyle = '#4a443b';
      ctx.fillRect(ox + 7 + armOffset, 20, 3, 10);
      ctx.fillRect(ox + 22 - armOffset, 20, 3, 10);
      ctx.fillStyle = '#d9a87d'; // Hands
      ctx.fillRect(ox + 7 + armOffset, 30, 3, 3);
      ctx.fillRect(ox + 22 - armOffset, 30, 3, 3);

      // Head / Face
      ctx.fillStyle = '#d9a87d';
      ctx.fillRect(ox + 11, 8, 10, 9);
      // Eyes (focused shadow)
      ctx.fillStyle = '#1a1816';
      ctx.fillRect(ox + 17, 11, 2, 2);

      // Fedora Hat
      ctx.fillStyle = '#2b2722';
      ctx.fillRect(ox + 6, 8, 20, 3); // Brim
      ctx.fillRect(ox + 9, 3, 14, 6); // Crown
      // Hat ribbon
      ctx.fillStyle = '#151310';
      ctx.fillRect(ox + 9, 7, 14, 2);
    }

    if (scene.textures.exists('player')) {
      scene.textures.remove('player');
    }
    const texture = scene.textures.addCanvas('player', canvas);
    if (texture) {
      for (let i = 0; i < 4; i++) {
        texture.add(i, 0, i * 32, 0, 32, 48);
      }
    }
  }

  // NPC Sprites
  private static createNpcSprites(scene: Phaser.Scene): void {
    const npcs = [
      { key: 'npc_reed', coat: '#1a2639', cap: '#121a27', skin: '#d29f79', hair: '#40352c', extra: '#d4af37' }, // Police Officer
      { key: 'npc_evelyn', coat: '#722b3b', cap: '#3b1c24', skin: '#e5b89a', hair: '#1a1614', extra: '#ffffff' }, // Reporter
      { key: 'npc_rossi', coat: '#262422', cap: '#181615', skin: '#dca47e', hair: '#0e0d0c', extra: '#9b111e' }, // Bar Owner
      { key: 'npc_sterling', coat: '#2b2f3a', cap: '#1f2229', skin: '#dfb090', hair: '#b0b5be', extra: '#e5c158' } // Politician
    ];

    for (const npc of npcs) {
      const canvas = document.createElement('canvas');
      canvas.width = 32;
      canvas.height = 48;
      const ctx = canvas.getContext('2d')!;

      // Shoes
      ctx.fillStyle = '#111';
      ctx.fillRect(10, 42, 5, 6);
      ctx.fillRect(17, 42, 5, 6);

      // Legs
      ctx.fillStyle = '#191b20';
      ctx.fillRect(10, 32, 5, 10);
      ctx.fillRect(17, 32, 5, 10);

      // Torso / Suit
      ctx.fillStyle = npc.coat;
      ctx.fillRect(9, 17, 14, 16);

      // Accent / Tie / Badge
      ctx.fillStyle = npc.extra;
      ctx.fillRect(14, 19, 4, 3);

      // Arms
      ctx.fillStyle = npc.coat;
      ctx.fillRect(6, 18, 3, 11);
      ctx.fillRect(23, 18, 3, 11);
      ctx.fillStyle = npc.skin;
      ctx.fillRect(6, 29, 3, 3);
      ctx.fillRect(23, 29, 3, 3);

      // Head
      ctx.fillStyle = npc.skin;
      ctx.fillRect(11, 8, 10, 9);
      ctx.fillStyle = '#111';
      ctx.fillRect(17, 11, 2, 2); // Eye

      // Hair / Hat
      ctx.fillStyle = npc.hair;
      ctx.fillRect(10, 6, 12, 4);
      ctx.fillStyle = npc.cap;
      ctx.fillRect(8, 4, 16, 4);

      if (scene.textures.exists(npc.key)) scene.textures.remove(npc.key);
      scene.textures.addCanvas(npc.key, canvas);
    }
  }

  // Expressive 96x96 Pixel Art Portraits
  private static createPortraits(scene: Phaser.Scene): void {
    const portraitConfigs = [
      { key: 'portrait_alex', name: 'Alex Morgan', bg: '#1c222e', coat: '#4a443b', hair: '#2a221b', skin: '#d9a87d' },
      { key: 'portrait_reed', name: 'Sergeant Reed', bg: '#1e2430', coat: '#1a2639', hair: '#504438', skin: '#cf9e78' },
      { key: 'portrait_evelyn', name: 'Evelyn Cross', bg: '#2b1c24', coat: '#722b3b', hair: '#1a1614', skin: '#e5b89a' },
      { key: 'portrait_rossi', name: 'Vince Rossi', bg: '#291e1e', coat: '#262422', hair: '#0a0a0c', skin: '#dca47e' },
      { key: 'portrait_sterling', name: 'Marcus Sterling', bg: '#1f242c', coat: '#252936', hair: '#b8bdc7', skin: '#dfb090' }
    ];

    for (const p of portraitConfigs) {
      const canvas = document.createElement('canvas');
      canvas.width = 96;
      canvas.height = 96;
      const ctx = canvas.getContext('2d')!;

      // Background with subtle noir vignette
      const grad = ctx.createRadialGradient(48, 48, 10, 48, 48, 50);
      grad.addColorStop(0, p.bg);
      grad.addColorStop(1, '#0a0c10');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 96, 96);

      // Coat & Shoulders
      ctx.fillStyle = p.coat;
      ctx.beginPath();
      ctx.ellipse(48, 86, 38, 22, 0, 0, Math.PI * 2);
      ctx.fill();

      // Shirt collar
      ctx.fillStyle = '#f0ede6';
      ctx.beginPath();
      ctx.moveTo(38, 70);
      ctx.lineTo(48, 84);
      ctx.lineTo(58, 70);
      ctx.fill();

      // Neck
      ctx.fillStyle = p.skin;
      ctx.fillRect(42, 54, 12, 18);

      // Chin / Jawline
      ctx.fillStyle = p.skin;
      ctx.beginPath();
      ctx.ellipse(48, 44, 20, 24, 0, 0, Math.PI * 2);
      ctx.fill();

      // Features: Eyes, Nose, Mouth
      ctx.fillStyle = '#141416';
      ctx.fillRect(38, 40, 6, 3); // Left eye
      ctx.fillRect(52, 40, 6, 3); // Right eye

      // Eyebrows
      ctx.fillStyle = p.hair;
      ctx.fillRect(36, 36, 8, 2);
      ctx.fillRect(52, 36, 8, 2);

      // Nose shadow
      ctx.fillStyle = '#b8845e';
      ctx.fillRect(47, 43, 3, 8);
      ctx.fillRect(45, 50, 6, 2);

      // Lips
      ctx.fillStyle = '#8f5745';
      ctx.fillRect(43, 56, 10, 2);

      // Hair / Hat
      if (p.key === 'portrait_alex') {
        // Detective Fedora
        ctx.fillStyle = '#2b2722';
        ctx.fillRect(16, 26, 64, 6); // Brim
        ctx.fillRect(26, 10, 44, 18); // Crown
        ctx.fillStyle = '#141210';
        ctx.fillRect(26, 22, 44, 4); // Band
      } else if (p.key === 'portrait_reed') {
        // Police cap + mustache
        ctx.fillStyle = '#121a27';
        ctx.fillRect(20, 16, 56, 12);
        ctx.fillRect(16, 26, 64, 4);
        ctx.fillStyle = '#d4af37'; // Gold badge
        ctx.fillRect(45, 18, 6, 6);
        // Reed's thick grey mustache
        ctx.fillStyle = '#555';
        ctx.fillRect(40, 52, 16, 4);
      } else if (p.key === 'portrait_evelyn') {
        // Stylish reporter bob & tilt hat
        ctx.fillStyle = p.hair;
        ctx.fillRect(24, 22, 14, 34);
        ctx.fillRect(58, 22, 14, 34);
        ctx.fillStyle = '#3b1c24';
        ctx.fillRect(22, 14, 52, 10);
      } else if (p.key === 'portrait_rossi') {
        // Sleek pomade & pencil mustache
        ctx.fillStyle = p.hair;
        ctx.fillRect(26, 18, 44, 10);
        ctx.fillStyle = '#111';
        ctx.fillRect(43, 53, 10, 2); // Pencil mustache
      } else if (p.key === 'portrait_sterling') {
        // Silver swept back hair & smoking cigar
        ctx.fillStyle = p.hair;
        ctx.fillRect(26, 16, 44, 12);
        // Cigar in mouth
        ctx.fillStyle = '#5c3a21';
        ctx.fillRect(54, 56, 16, 3);
        ctx.fillStyle = '#ff4500'; // Glowing tip
        ctx.fillRect(70, 56, 3, 3);
      }

      // Border frame
      ctx.strokeStyle = '#c4a77d';
      ctx.lineWidth = 3;
      ctx.strokeRect(1, 1, 94, 94);

      if (scene.textures.exists(p.key)) scene.textures.remove(p.key);
      scene.textures.addCanvas(p.key, canvas);
    }
  }

  // Clue Icons (32x32)
  private static createClueIcons(scene: Phaser.Scene): void {
    const iconKeys = [
      'glass', 'trophy', 'key', 'document', 'watch', 'letter',
      'folder', 'cigar', 'badge', 'receipt', 'ticket', 'money',
      'tape', 'pen', 'phial', 'calendar'
    ];

    for (const key of iconKeys) {
      const canvas = document.createElement('canvas');
      canvas.width = 32;
      canvas.height = 32;
      const ctx = canvas.getContext('2d')!;

      // Background badge
      ctx.fillStyle = '#1c1f26';
      ctx.fillRect(0, 0, 32, 32);
      ctx.strokeStyle = '#8a7356';
      ctx.strokeRect(1, 1, 30, 30);

      ctx.fillStyle = '#e5c158'; // Gold accent

      if (key === 'glass') {
        ctx.fillRect(10, 8, 12, 16);
        ctx.fillStyle = '#c87d2a'; // Scotch
        ctx.fillRect(12, 14, 8, 8);
      } else if (key === 'trophy') {
        ctx.fillRect(14, 8, 4, 12);
        ctx.fillRect(8, 6, 16, 4);
        ctx.fillRect(10, 20, 12, 4);
      } else if (key === 'key') {
        ctx.beginPath();
        ctx.arc(12, 16, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillRect(14, 14, 12, 4);
        ctx.fillRect(22, 18, 4, 4);
      } else if (key === 'watch') {
        ctx.beginPath();
        ctx.arc(16, 16, 10, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillRect(15, 10, 2, 6);
        ctx.fillRect(15, 15, 5, 2);
      } else if (key === 'cigar') {
        ctx.fillStyle = '#6b4423';
        ctx.fillRect(6, 14, 20, 5);
        ctx.fillStyle = '#e85d04';
        ctx.fillRect(23, 14, 3, 5);
      } else if (key === 'tape') {
        ctx.fillStyle = '#3a3a42';
        ctx.fillRect(6, 10, 20, 12);
        ctx.fillStyle = '#eee';
        ctx.beginPath();
        ctx.arc(11, 16, 3, 0, Math.PI * 2);
        ctx.arc(21, 16, 3, 0, Math.PI * 2);
        ctx.fill();
      } else if (key === 'pen') {
        ctx.fillStyle = '#d4af37';
        ctx.fillRect(8, 22, 16, 3);
        ctx.fillStyle = '#2b75a0'; // Peacock blue
        ctx.fillRect(6, 23, 3, 3);
      } else if (key === 'phial') {
        ctx.fillStyle = '#7a4b18';
        ctx.fillRect(12, 10, 8, 16);
        ctx.fillStyle = '#a0dc52'; // Toxic green drop
        ctx.fillRect(14, 16, 4, 6);
      } else {
        // Document / letter / folder / default
        ctx.fillStyle = '#d9d0c1';
        ctx.fillRect(8, 6, 16, 20);
        ctx.fillStyle = '#333';
        ctx.fillRect(11, 10, 10, 2);
        ctx.fillRect(11, 14, 10, 2);
        ctx.fillRect(11, 18, 7, 2);
      }

      const textureKey = `icon_${key}`;
      if (scene.textures.exists(textureKey)) scene.textures.remove(textureKey);
      scene.textures.addCanvas(textureKey, canvas);
    }
  }

  // 2D Explorable Room Backgrounds (960 x 540)
  private static createEnvironmentTextures(scene: Phaser.Scene): void {
    const locations = [
      { key: 'bg_loc_office', type: 'office' },
      { key: 'bg_loc_crime_scene', type: 'crime_scene' },
      { key: 'bg_loc_newspaper_office', type: 'newspaper' },
      { key: 'bg_loc_velvet_lounge', type: 'lounge' },
      { key: 'bg_loc_parking_garage', type: 'garage' },
      { key: 'bg_loc_sterling_office', type: 'sterling' }
    ];

    for (const loc of locations) {
      const canvas = document.createElement('canvas');
      canvas.width = 960;
      canvas.height = 540;
      const ctx = canvas.getContext('2d')!;

      // Ceiling / Upper wall
      const wallGrad = ctx.createLinearGradient(0, 0, 0, 440);
      wallGrad.addColorStop(0, '#0c0f14');
      wallGrad.addColorStop(1, '#1b2029');
      ctx.fillStyle = wallGrad;
      ctx.fillRect(0, 0, 960, 440);

      // Floorboards / Concrete (y: 440 to 540)
      ctx.fillStyle = loc.type === 'garage' ? '#1f2226' : '#2b231c';
      ctx.fillRect(0, 440, 960, 100);

      // Floor perspective planks / lines
      ctx.strokeStyle = loc.type === 'garage' ? '#17191d' : '#1e1813';
      ctx.lineWidth = 2;
      for (let y = 440; y < 540; y += 18) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(960, y);
        ctx.stroke();
      }

      // Room Specific Architecture & Scenery
      if (loc.type === 'office') {
        // Venetian blinds on window
        ctx.fillStyle = '#080d14';
        ctx.fillRect(360, 60, 240, 260);
        ctx.strokeStyle = '#273447';
        ctx.lineWidth = 3;
        ctx.strokeRect(360, 60, 240, 260);
        // Blind slats with rain streaks outside
        ctx.strokeStyle = 'rgba(100, 130, 160, 0.4)';
        for (let y = 70; y < 310; y += 10) {
          ctx.beginPath();
          ctx.moveTo(365, y);
          ctx.lineTo(595, y);
          ctx.stroke();
        }
        // Desk
        ctx.fillStyle = '#3a2b1f';
        ctx.fillRect(240, 390, 170, 70);
        // Desk lamp warm glow
        ctx.fillStyle = '#1c7a42'; // Green banker lamp
        ctx.fillRect(310, 370, 25, 12);
        const lampGlow = ctx.createRadialGradient(322, 380, 5, 322, 410, 140);
        lampGlow.addColorStop(0, 'rgba(255, 230, 140, 0.4)');
        lampGlow.addColorStop(1, 'rgba(255, 230, 140, 0)');
        ctx.fillStyle = lampGlow;
        ctx.fillRect(180, 300, 300, 200);

        // Filing cabinet & cork pinboard
        ctx.fillStyle = '#3b4348';
        ctx.fillRect(620, 220, 70, 220);
        // Corkboard
        ctx.fillStyle = '#6e5138';
        ctx.fillRect(470, 140, 120, 100);
        ctx.strokeStyle = '#382517';
        ctx.strokeRect(470, 140, 120, 100);

      } else if (loc.type === 'crime_scene') {
        // Balcony French doors overlooking rainy city
        ctx.fillStyle = '#0a1018';
        ctx.fillRect(720, 80, 160, 340);
        ctx.strokeStyle = '#2d3b4e';
        ctx.lineWidth = 4;
        ctx.strokeRect(720, 80, 160, 340);
        // Distant city skyscrapers through rain
        ctx.fillStyle = '#0f1722';
        ctx.fillRect(735, 180, 30, 180);
        ctx.fillRect(780, 140, 40, 220);
        ctx.fillRect(835, 200, 35, 160);

        // Open wall safe behind crooked nautical painting
        ctx.fillStyle = '#222830';
        ctx.fillRect(200, 140, 90, 80);
        ctx.fillStyle = '#111418';
        ctx.fillRect(210, 150, 70, 60);

        // Desk with typewriter
        ctx.fillStyle = '#403023';
        ctx.fillRect(320, 390, 190, 70);

        // Victim chalk outline on floor
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        // Head
        ctx.arc(580, 470, 12, 0, Math.PI * 2);
        // Torso & limbs
        ctx.moveTo(580, 482);
        ctx.lineTo(580, 515);
        ctx.lineTo(565, 535);
        ctx.moveTo(580, 515);
        ctx.lineTo(595, 535);
        ctx.moveTo(580, 490);
        ctx.lineTo(555, 498);
        ctx.moveTo(580, 490);
        ctx.lineTo(605, 498);
        ctx.stroke();

        // Blood stain
        ctx.fillStyle = 'rgba(90, 15, 15, 0.8)';
        ctx.beginPath();
        ctx.ellipse(575, 470, 20, 10, 0.2, 0, Math.PI * 2);
        ctx.fill();

        // Radiator
        ctx.fillStyle = '#555';
        ctx.fillRect(650, 380, 50, 70);

        // Yellow police barrier tape
        ctx.fillStyle = '#d4af37';
        ctx.fillRect(80, 200, 12, 240);
        ctx.strokeStyle = '#111';
        ctx.lineWidth = 1;
        ctx.strokeText('POLICE LINE - DO NOT CROSS', 90, 220);

      } else if (loc.type === 'newspaper') {
        // High industrial brick wall & massive printing press
        ctx.fillStyle = '#2c1e18';
        for (let bx = 0; bx < 960; bx += 40) {
          for (let by = 0; by < 440; by += 20) {
            ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
            ctx.strokeRect(bx, by, 40, 20);
          }
        }
        // Heavy printing machinery
        ctx.fillStyle = '#1c2229';
        ctx.fillRect(520, 200, 280, 240);
        ctx.fillStyle = '#2d3744';
        ctx.fillRect(540, 220, 240, 50); // Paper roller
        // Reporters desks
        ctx.fillStyle = '#3a2b1f';
        ctx.fillRect(180, 390, 180, 70);
        // Filing cabinets
        ctx.fillStyle = '#3f474d';
        ctx.fillRect(80, 240, 80, 200);

      } else if (loc.type === 'lounge') {
        // Moody crimson wallpaper with diamond pattern
        ctx.fillStyle = '#2b1016';
        ctx.fillRect(0, 0, 960, 440);
        // Glowing red neon sign "VELVET"
        ctx.fillStyle = '#ff2a55';
        ctx.font = 'bold 36px "Courier New", monospace';
        ctx.fillText('THE VELVET LOUNGE', 300, 70);

        // Back bar shelves with bottles
        ctx.fillStyle = '#1d1214';
        ctx.fillRect(200, 120, 560, 240);
        for (let row = 0; row < 3; row++) {
          const sy = 160 + row * 60;
          ctx.fillStyle = '#42281e';
          ctx.fillRect(210, sy, 540, 8);
          // Bottles
          for (let b = 220; b < 730; b += 22) {
            ctx.fillStyle = (b % 3 === 0) ? '#a06020' : (b % 3 === 1) ? '#286a3b' : '#9b111e';
            ctx.fillRect(b, sy - 24, 12, 24);
          }
        }

        // Long mahogany bar counter
        ctx.fillStyle = '#4a2518';
        ctx.fillRect(180, 380, 600, 80);
        // Brass footrail
        ctx.fillStyle = '#d4af37';
        ctx.fillRect(180, 445, 600, 5);

      } else if (loc.type === 'garage') {
        // Underground parking concrete pillars
        ctx.fillStyle = '#1a1d22';
        ctx.fillRect(0, 0, 960, 440);
        // Concrete pillars with yellow/black hazard stripes
        const pillars = [160, 440, 720];
        for (const px of pillars) {
          ctx.fillStyle = '#32373f';
          ctx.fillRect(px, 40, 60, 400);
          for (let hy = 260; hy < 340; hy += 16) {
            ctx.fillStyle = '#e5c158';
            ctx.fillRect(px, hy, 60, 8);
            ctx.fillStyle = '#111';
            ctx.fillRect(px, hy + 8, 60, 8);
          }
        }
        // Attendant booth
        ctx.fillStyle = '#252930';
        ctx.fillRect(320, 320, 100, 130);
        ctx.fillStyle = '#4a6b82';
        ctx.fillRect(330, 335, 80, 45); // Glass window

      } else if (loc.type === 'sterling') {
        // Penthouse luxury suite overlooking harbor
        ctx.fillStyle = '#14171f';
        ctx.fillRect(0, 0, 960, 440);
        // Floor to ceiling art deco panoramic glass
        ctx.fillStyle = '#090e17';
        ctx.fillRect(120, 40, 720, 320);
        // Rainy city skyline outside
        ctx.fillStyle = '#182436';
        ctx.fillRect(160, 140, 60, 220);
        ctx.fillRect(240, 80, 80, 280);
        ctx.fillRect(360, 120, 90, 240);
        ctx.fillRect(520, 90, 70, 270);
        ctx.fillRect(630, 150, 80, 210);

        // Art deco window mullions
        ctx.strokeStyle = '#c4a77d';
        ctx.lineWidth = 3;
        ctx.strokeRect(120, 40, 720, 320);
        ctx.beginPath();
        ctx.moveTo(360, 40); ctx.lineTo(360, 360);
        ctx.moveTo(600, 40); ctx.lineTo(600, 360);
        ctx.stroke();

        // Massive walnut & chrome desk
        ctx.fillStyle = '#2e251e';
        ctx.fillRect(240, 380, 220, 80);
        // Humidor
        ctx.fillStyle = '#5c381e';
        ctx.fillRect(380, 365, 35, 18);
      }

      // Baseboard trim
      ctx.fillStyle = '#161311';
      ctx.fillRect(0, 436, 960, 6);

      if (scene.textures.exists(loc.key)) scene.textures.remove(loc.key);
      scene.textures.addCanvas(loc.key, canvas);
    }
  }

  // Visual Effects Textures (Raindrop, Light Cone, Interact Marker)
  private static createFxTextures(scene: Phaser.Scene): void {
    // Raindrop particle
    const rainCanvas = document.createElement('canvas');
    rainCanvas.width = 2;
    rainCanvas.height = 12;
    const rCtx = rainCanvas.getContext('2d')!;
    rCtx.fillStyle = 'rgba(180, 210, 255, 0.7)';
    rCtx.fillRect(0, 0, 2, 12);
    if (scene.textures.exists('particle_rain')) scene.textures.remove('particle_rain');
    scene.textures.addCanvas('particle_rain', rainCanvas);

    // Interaction prompt icon (Blinking magnifying glass & speech bubble)
    const promptCanvas = document.createElement('canvas');
    promptCanvas.width = 24;
    promptCanvas.height = 24;
    const pCtx = promptCanvas.getContext('2d')!;
    pCtx.fillStyle = '#e5c158';
    pCtx.beginPath();
    pCtx.arc(10, 10, 6, 0, Math.PI * 2);
    pCtx.fill();
    pCtx.fillStyle = '#111';
    pCtx.beginPath();
    pCtx.arc(10, 10, 4, 0, Math.PI * 2);
    pCtx.fill();
    pCtx.fillStyle = '#e5c158';
    pCtx.fillRect(13, 13, 6, 3);
    if (scene.textures.exists('marker_inspect')) scene.textures.remove('marker_inspect');
    scene.textures.addCanvas('marker_inspect', promptCanvas);
  }
}
