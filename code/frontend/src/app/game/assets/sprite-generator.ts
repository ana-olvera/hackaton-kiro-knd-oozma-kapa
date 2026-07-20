import * as Phaser from 'phaser';

/**
 * Genera sprites programáticamente usando la API de texturas de Phaser.
 * Usa addCanvas() + add() para crear spritesheets desde canvas elements.
 */
export class SpriteGenerator {

  static generateAll(scene: Phaser.Scene): void {
    SpriteGenerator.generateMichi(scene);
    SpriteGenerator.generateKaren(scene);
    SpriteGenerator.generateOfficeTiles(scene);
    SpriteGenerator.generateItems(scene);
    SpriteGenerator.generateUI(scene);
  }

  /**
   * Genera spritesheet de Michi con frames para 4 direcciones (idle + walk)
   * Layout: 4 columnas (frames walk) x 4 filas (down, left, right, up)
   */
  static generateMichi(scene: Phaser.Scene): void {
    if (scene.textures.exists('michi')) return;

    const size = 32;
    const frames = 4;
    const directions = 4;
    const canvas = document.createElement('canvas');
    canvas.width = size * frames;
    canvas.height = size * directions;
    const ctx = canvas.getContext('2d')!;

    for (let dir = 0; dir < directions; dir++) {
      for (let frame = 0; frame < frames; frame++) {
        const x = frame * size;
        const y = dir * size;
        SpriteGenerator.drawMichiFrame(ctx, x, y, size, dir, frame);
      }
    }

    const texture = scene.textures.addCanvas('michi', canvas);
    // Agregar frames individuales para spritesheet
    for (let dir = 0; dir < directions; dir++) {
      for (let frame = 0; frame < frames; frame++) {
        const frameIndex = dir * frames + frame;
        texture!.add(frameIndex, 0, frame * size, dir * size, size, size);
      }
    }
  }

  private static drawMichiFrame(
    ctx: CanvasRenderingContext2D, x: number, y: number,
    size: number, direction: number, frame: number
  ): void {
    const cx = x + size / 2;
    const cy = y + size / 2;

    // Cuerpo (naranja gato)
    ctx.fillStyle = '#FF8844';
    ctx.beginPath();
    ctx.ellipse(cx, cy + 4, 10, 12, 0, 0, Math.PI * 2);
    ctx.fill();

    // Cabeza
    ctx.fillStyle = '#FFAA66';
    ctx.beginPath();
    ctx.arc(cx, cy - 6, 8, 0, Math.PI * 2);
    ctx.fill();

    // Orejas
    ctx.fillStyle = '#FF8844';
    ctx.beginPath();
    ctx.moveTo(cx - 7, cy - 12);
    ctx.lineTo(cx - 3, cy - 6);
    ctx.lineTo(cx - 10, cy - 6);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(cx + 7, cy - 12);
    ctx.lineTo(cx + 3, cy - 6);
    ctx.lineTo(cx + 10, cy - 6);
    ctx.fill();

    // Ojos según dirección
    ctx.fillStyle = '#333333';
    if (direction === 0) { // down
      ctx.fillRect(cx - 4, cy - 7, 3, 3);
      ctx.fillRect(cx + 1, cy - 7, 3, 3);
    } else if (direction === 1) { // left
      ctx.fillRect(cx - 5, cy - 7, 3, 3);
      ctx.fillRect(cx - 1, cy - 7, 3, 3);
    } else if (direction === 2) { // right
      ctx.fillRect(cx + 2, cy - 7, 3, 3);
      ctx.fillRect(cx - 2, cy - 7, 3, 3);
    }
    // up: sin ojos visibles

    // Animación de patas (walk)
    const legOffset = (frame % 2 === 0) ? 2 : -2;
    ctx.fillStyle = '#CC6633';
    ctx.fillRect(cx - 5, cy + 12, 4, 4 + legOffset);
    ctx.fillRect(cx + 1, cy + 12, 4, 4 - legOffset);
  }

  /**
   * Genera sprite de Karen (retrato para diálogos)
   */
  static generateKaren(scene: Phaser.Scene): void {
    if (scene.textures.exists('karen')) return;

    const size = 48;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;

    // Pelo
    ctx.fillStyle = '#4A2800';
    ctx.beginPath();
    ctx.arc(size / 2, size / 2 - 4, 18, 0, Math.PI * 2);
    ctx.fill();

    // Cara
    ctx.fillStyle = '#FFD5B0';
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, 14, 0, Math.PI * 2);
    ctx.fill();

    // Ojos
    ctx.fillStyle = '#000000';
    ctx.fillRect(size / 2 - 6, size / 2 - 4, 4, 4);
    ctx.fillRect(size / 2 + 2, size / 2 - 4, 4, 4);

    // Cejas fruncidas
    ctx.strokeStyle = '#4A2800';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(size / 2 - 8, size / 2 - 8);
    ctx.lineTo(size / 2 - 2, size / 2 - 6);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(size / 2 + 8, size / 2 - 8);
    ctx.lineTo(size / 2 + 2, size / 2 - 6);
    ctx.stroke();

    // Boca
    ctx.strokeStyle = '#CC4444';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(size / 2 - 5, size / 2 + 8);
    ctx.lineTo(size / 2 + 5, size / 2 + 8);
    ctx.stroke();

    scene.textures.addCanvas('karen', canvas);
  }

  /**
   * Genera tiles de oficina: piso, pared, escritorio, computadora, café, silla
   */
  static generateOfficeTiles(scene: Phaser.Scene): void {
    if (scene.textures.exists('office-tiles')) return;

    const size = 32;
    const tiles = 6;
    const canvas = document.createElement('canvas');
    canvas.width = size * tiles;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;

    // Tile 0: Piso
    ctx.fillStyle = '#3D3D5C';
    ctx.fillRect(0, 0, size, size);
    ctx.strokeStyle = '#33334D';
    ctx.strokeRect(0, 0, size, size);
    ctx.fillStyle = '#35355A';
    ctx.fillRect(1, 1, 15, 15);
    ctx.fillRect(17, 17, 14, 14);

    // Tile 1: Pared
    ctx.fillStyle = '#2A2A4A';
    ctx.fillRect(size, 0, size, size);
    ctx.fillStyle = '#222244';
    ctx.fillRect(size + 2, 2, size - 4, size - 4);
    ctx.strokeStyle = '#1A1A3A';
    ctx.lineWidth = 1;
    ctx.strokeRect(size, 0, size, size);

    // Tile 2: Escritorio
    ctx.fillStyle = '#8B6914';
    ctx.fillRect(size * 2, 8, size, 20);
    ctx.fillStyle = '#A07D1A';
    ctx.fillRect(size * 2 + 2, 10, size - 4, 16);
    ctx.fillStyle = '#6B5010';
    ctx.fillRect(size * 2 + 2, 26, 4, 6);
    ctx.fillRect(size * 2 + size - 6, 26, 4, 6);

    // Tile 3: Computadora
    ctx.fillStyle = '#333333';
    ctx.fillRect(size * 3 + 8, 2, 16, 14);
    ctx.fillStyle = '#4488FF';
    ctx.fillRect(size * 3 + 10, 4, 12, 10);
    ctx.fillStyle = '#444444';
    ctx.fillRect(size * 3 + 12, 16, 8, 4);
    ctx.fillRect(size * 3 + 10, 20, 12, 2);

    // Tile 4: Máquina de café
    ctx.fillStyle = '#666666';
    ctx.fillRect(size * 4 + 6, 4, 20, 24);
    ctx.fillStyle = '#884400';
    ctx.fillRect(size * 4 + 10, 8, 12, 8);
    ctx.fillStyle = '#00FF00';
    ctx.fillRect(size * 4 + 14, 20, 4, 4);

    // Tile 5: Silla
    ctx.fillStyle = '#222222';
    ctx.fillRect(size * 5 + 8, 6, 16, 4);
    ctx.fillStyle = '#333333';
    ctx.fillRect(size * 5 + 10, 10, 12, 16);
    ctx.fillStyle = '#111111';
    ctx.fillRect(size * 5 + 8, 28, 4, 3);
    ctx.fillRect(size * 5 + 20, 28, 4, 3);

    const texture = scene.textures.addCanvas('office-tiles', canvas);
    for (let i = 0; i < tiles; i++) {
      texture!.add(i, 0, i * size, 0, size, size);
    }
  }

  /**
   * Genera items: café, dona, concha, pizza
   */
  static generateItems(scene: Phaser.Scene): void {
    if (scene.textures.exists('items')) return;

    const size = 16;
    const items = 4;
    const canvas = document.createElement('canvas');
    canvas.width = size * items;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;

    // Item 0: Café
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(4, 4, 8, 10);
    ctx.fillStyle = '#6B3300';
    ctx.fillRect(5, 5, 6, 8);
    ctx.strokeStyle = '#AAAAAA';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(7, 3);
    ctx.quadraticCurveTo(8, 1, 9, 3);
    ctx.stroke();

    // Item 1: Dona
    const dx = size;
    ctx.fillStyle = '#FF69B4';
    ctx.beginPath();
    ctx.arc(dx + 8, 8, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#3D3D5C';
    ctx.beginPath();
    ctx.arc(dx + 8, 8, 2, 0, Math.PI * 2);
    ctx.fill();

    // Item 2: Concha
    const conchaX = size * 2;
    ctx.fillStyle = '#F5DEB3';
    ctx.beginPath();
    ctx.arc(conchaX + 8, 10, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#DEB887';
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      const angle = (i / 5) * Math.PI;
      ctx.moveTo(conchaX + 8, 6);
      ctx.lineTo(conchaX + 8 + Math.cos(angle) * 5, 10 + Math.sin(angle) * 5);
    }
    ctx.stroke();

    // Item 3: Pizza
    const px = size * 3;
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.moveTo(px + 8, 2);
    ctx.lineTo(px + 2, 14);
    ctx.lineTo(px + 14, 14);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#CC0000';
    ctx.beginPath();
    ctx.arc(px + 7, 9, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(px + 10, 11, 1.5, 0, Math.PI * 2);
    ctx.fill();

    const texture = scene.textures.addCanvas('items', canvas);
    for (let i = 0; i < items; i++) {
      texture!.add(i, 0, i * size, 0, size, size);
    }
  }

  /**
   * Genera elementos de UI: iconos para las barras de estado
   */
  static generateUI(scene: Phaser.Scene): void {
    if (scene.textures.exists('ui-icons')) return;

    const size = 16;
    const icons = 7;
    const canvas = document.createElement('canvas');
    canvas.width = size * icons;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;

    // Icon 0: Corazón (energía)
    ctx.fillStyle = '#FF4444';
    ctx.beginPath();
    ctx.moveTo(8, 10);
    ctx.bezierCurveTo(8, 6, 3, 6, 3, 9);
    ctx.bezierCurveTo(3, 12, 8, 14, 8, 14);
    ctx.bezierCurveTo(8, 14, 13, 12, 13, 9);
    ctx.bezierCurveTo(13, 6, 8, 6, 8, 10);
    ctx.fill();

    // Icon 1: Café
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(size + 4, 4, 8, 10);
    ctx.fillStyle = '#6B3300';
    ctx.fillRect(size + 5, 5, 6, 8);

    // Icon 2: Pollo (hambre)
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.arc(size * 2 + 8, 8, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#CC8800';
    ctx.fillRect(size * 2 + 10, 10, 4, 4);

    // Icon 3: ZZZ (sueño)
    ctx.fillStyle = '#8888FF';
    ctx.font = '10px monospace';
    ctx.fillText('Zz', size * 3 + 3, 12);

    // Icon 4: Cerebro (concentración)
    ctx.fillStyle = '#FF88CC';
    ctx.beginPath();
    ctx.arc(size * 4 + 8, 8, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#CC6699';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(size * 4 + 8, 3);
    ctx.lineTo(size * 4 + 8, 13);
    ctx.stroke();

    // Icon 5: Rayo (estrés)
    ctx.fillStyle = '#FFFF00';
    ctx.beginPath();
    ctx.moveTo(size * 5 + 9, 2);
    ctx.lineTo(size * 5 + 5, 9);
    ctx.lineTo(size * 5 + 8, 9);
    ctx.lineTo(size * 5 + 7, 14);
    ctx.lineTo(size * 5 + 11, 7);
    ctx.lineTo(size * 5 + 8, 7);
    ctx.closePath();
    ctx.fill();

    // Icon 6: Karen (karenómetro)
    ctx.fillStyle = '#FF0000';
    ctx.font = 'bold 10px monospace';
    ctx.fillText('K!', size * 6 + 3, 12);

    const texture = scene.textures.addCanvas('ui-icons', canvas);
    for (let i = 0; i < icons; i++) {
      texture!.add(i, 0, i * size, 0, size, size);
    }
  }
}
