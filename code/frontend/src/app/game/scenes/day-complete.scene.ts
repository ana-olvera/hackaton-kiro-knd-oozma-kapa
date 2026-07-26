import * as Phaser from 'phaser';

/**
 * Escena de nivel completado.
 * Muestra resumen del día y permite avanzar al siguiente o volver al menú.
 */
export class DayCompleteScene extends Phaser.Scene {
  private score = 0;
  private levelName = '';
  private nextLevelId = 2;

  constructor() {
    super({ key: 'DayCompleteScene' });
  }

  init(data: { score?: number; levelName?: string; nextLevelId?: number }): void {
    this.score = data?.score || 0;
    this.levelName = data?.levelName || 'Día completado';
    this.nextLevelId = data?.nextLevelId || 2;
  }

  create(): void {
    const { width, height } = this.cameras.main;

    // Fondo
    this.add.rectangle(width / 2, height / 2, width, height, 0x0a1a0a);

    // Título de victoria
    this.add.text(width / 2, height / 4 - 20,
      '🎉 ¡Sobreviviste!',
      { fontSize: '28px', color: '#00FF88', fontStyle: 'bold', align: 'center' }
    ).setOrigin(0.5);

    this.add.text(width / 2, height / 4 + 25,
      this.levelName,
      { fontSize: '18px', color: '#AAFFAA', align: 'center' }
    ).setOrigin(0.5);

    this.add.text(width / 2, height / 4 + 55,
      `⭐ Puntaje: ${this.score}`,
      { fontSize: '16px', color: '#FFFFFF', align: 'center' }
    ).setOrigin(0.5);

    // Mensaje motivacional
    const messages = [
      '¡Karen no pudo contigo hoy!',
      'Michi sobrevivió otro día más.',
      '¡Excelente trabajo, dev!',
      'El código no se rompió... hoy.',
      '¡Producción sigue viva!',
    ];
    const msg = messages[Math.floor(Math.random() * messages.length)];
    this.add.text(width / 2, height / 2 - 20, msg, {
      fontSize: '14px', color: '#888888', fontStyle: 'italic', align: 'center'
    }).setOrigin(0.5);

    // Botón: Siguiente día
    const hasNextLevel = this.nextLevelId <= 10;
    if (hasNextLevel) {
      const nextBtn = this.add.text(width / 2, height / 2 + 50, '▶  Siguiente día', {
        fontSize: '20px', color: '#00FF88', backgroundColor: '#003322',
        padding: { x: 30, y: 14 }
      }).setOrigin(0.5).setInteractive({ useHandCursor: true });

      nextBtn.on('pointerover', () => nextBtn.setStyle({ backgroundColor: '#005533' }));
      nextBtn.on('pointerout', () => nextBtn.setStyle({ backgroundColor: '#003322' }));
      nextBtn.on('pointerdown', () => {
        this.scene.start('OfficeScene');
      });

      // Pulso en el botón
      this.tweens.add({
        targets: nextBtn,
        scaleX: 1.05, scaleY: 1.05,
        duration: 800, yoyo: true, repeat: -1,
        ease: 'Sine.easeInOut'
      });
    } else {
      // Juego completado
      this.add.text(width / 2, height / 2 + 50,
        '🏆 ¡Completaste todas las semanas!\n¡Eres un verdadero Michi Godín!',
        { fontSize: '16px', color: '#FFD700', align: 'center' }
      ).setOrigin(0.5);
    }

    // Botón: Volver al menú
    const menuBtn = this.add.text(width / 2, height / 2 + 130, '🏠  Volver al menú', {
      fontSize: '18px', color: '#AAAAAA', backgroundColor: '#222233',
      padding: { x: 24, y: 12 }
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    menuBtn.on('pointerover', () => menuBtn.setStyle({ backgroundColor: '#333344', color: '#FFFFFF' }));
    menuBtn.on('pointerout', () => menuBtn.setStyle({ backgroundColor: '#222233', color: '#AAAAAA' }));
    menuBtn.on('pointerdown', () => {
      this.scene.start('MenuScene');
    });

    // Fade in
    this.cameras.main.fadeIn(500);
  }
}
