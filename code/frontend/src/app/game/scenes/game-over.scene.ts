import * as Phaser from 'phaser';

/**
 * Escena de Game Over.
 * Se muestra cuando Michi pierde. Ofrece reintentar o volver al menú.
 */
export class GameOverScene extends Phaser.Scene {
  private reason = '';
  private score = 0;

  constructor() {
    super({ key: 'GameOverScene' });
  }

  init(data: { reason?: string; score?: number }): void {
    this.reason = data?.reason || 'desconocido';
    this.score = data?.score || 0;
  }

  create(): void {
    const { width, height } = this.cameras.main;

    // Fondo oscuro
    this.add.rectangle(width / 2, height / 2, width, height, 0x0a0a1a);

    // Mensaje de derrota
    this.add.text(width / 2, height / 3 - 20,
      `😿 Michi renunció...`,
      { fontSize: '28px', color: '#FF4444', fontStyle: 'bold', align: 'center' }
    ).setOrigin(0.5);

    this.add.text(width / 2, height / 3 + 30,
      `Razón: ${this.reason}`,
      { fontSize: '18px', color: '#FF8888', align: 'center' }
    ).setOrigin(0.5);

    this.add.text(width / 2, height / 3 + 60,
      `Puntaje: ${this.score}`,
      { fontSize: '16px', color: '#AAAAAA', align: 'center' }
    ).setOrigin(0.5);

    // Pregunta
    this.add.text(width / 2, height / 2 + 10,
      '¿Quieres intentarlo de nuevo?',
      { fontSize: '18px', color: '#FFFFFF', align: 'center' }
    ).setOrigin(0.5);

    // Botón: Reintentar
    const retryBtn = this.add.text(width / 2, height / 2 + 70, '🔄  Reintentar nivel', {
      fontSize: '20px', color: '#00FF88', backgroundColor: '#003322',
      padding: { x: 30, y: 14 }
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    retryBtn.on('pointerover', () => retryBtn.setStyle({ backgroundColor: '#005533' }));
    retryBtn.on('pointerout', () => retryBtn.setStyle({ backgroundColor: '#003322' }));
    retryBtn.on('pointerdown', () => {
      this.scene.start('OfficeScene');
    });

    // Botón: Menú
    const menuBtn = this.add.text(width / 2, height / 2 + 140, '🏠  Volver al inicio', {
      fontSize: '20px', color: '#AAAAAA', backgroundColor: '#222233',
      padding: { x: 30, y: 14 }
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    menuBtn.on('pointerover', () => menuBtn.setStyle({ backgroundColor: '#333344', color: '#FFFFFF' }));
    menuBtn.on('pointerout', () => menuBtn.setStyle({ backgroundColor: '#222233', color: '#AAAAAA' }));
    menuBtn.on('pointerdown', () => {
      this.scene.start('MenuScene');
    });

    // Animación de entrada
    this.cameras.main.fadeIn(500);
  }
}
