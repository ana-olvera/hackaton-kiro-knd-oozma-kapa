import * as Phaser from 'phaser';

export class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MenuScene' });
  }

  preload(): void {
    // Cargar assets del menú
  }

  create(): void {
    const { width, height } = this.cameras.main;

    // Título del juego
    this.add.text(width / 2, height / 3, 'Ayuda a Michi Godín', {
      fontSize: '32px',
      color: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    this.add.text(width / 2, height / 3 + 50, 'Sobrevive al Sprint', {
      fontSize: '18px',
      color: '#cccccc'
    }).setOrigin(0.5);

    // Botón de inicio
    const startButton = this.add.text(width / 2, height / 2 + 50, '▶ JUGAR', {
      fontSize: '24px',
      color: '#00ff88',
      backgroundColor: '#333333',
      padding: { x: 20, y: 10 }
    }).setOrigin(0.5).setInteractive();

    startButton.on('pointerover', () => {
      startButton.setStyle({ color: '#ffffff', backgroundColor: '#00aa55' });
    });

    startButton.on('pointerout', () => {
      startButton.setStyle({ color: '#00ff88', backgroundColor: '#333333' });
    });

    startButton.on('pointerdown', () => {
      this.scene.start('OfficeScene');
    });
  }
}
