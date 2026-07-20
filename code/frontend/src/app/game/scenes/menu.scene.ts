import * as Phaser from 'phaser';
import { SpriteGenerator } from '../assets/sprite-generator';

/**
 * Escena del menú dentro de Phaser.
 * Se usa como puente cuando se inicia el juego desde el componente Angular.
 */
export class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MenuScene' });
  }

  preload(): void {
    SpriteGenerator.generateAll(this);
  }

  create(): void {
    const { width, height } = this.cameras.main;

    // Fondo
    this.add.rectangle(width / 2, height / 2, width, height, 0x1a1a2e);

    // Título del juego
    this.add.text(width / 2, height / 3, '🐱 Ayuda a Michi Godín', {
      fontSize: '28px',
      color: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    this.add.text(width / 2, height / 3 + 40, 'Sobrevive al Sprint', {
      fontSize: '16px',
      color: '#cccccc'
    }).setOrigin(0.5);

    // Instrucciones
    this.add.text(width / 2, height / 2 + 20, [
      'Flechas: Mover a Michi',
      'E: Interactuar',
      'Computadoras: Minijuegos de Git',
      'Cafetera: +Café +Energía',
    ].join('\n'), {
      fontSize: '11px',
      color: '#888888',
      align: 'center'
    }).setOrigin(0.5);

    // Botón de inicio
    const startButton = this.add.text(width / 2, height / 2 + 120, '▶ EMPEZAR LUNES', {
      fontSize: '20px',
      color: '#00ff88',
      backgroundColor: '#2d2d44',
      padding: { x: 20, y: 10 }
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    startButton.on('pointerover', () => {
      startButton.setStyle({ color: '#ffffff', backgroundColor: '#00aa55' });
    });

    startButton.on('pointerout', () => {
      startButton.setStyle({ color: '#00ff88', backgroundColor: '#2d2d44' });
    });

    startButton.on('pointerdown', () => {
      this.cameras.main.fadeOut(500, 0, 0, 0);
      this.time.delayedCall(500, () => {
        this.scene.start('OfficeScene');
      });
    });

    // También con Enter
    this.input.keyboard!.on('keydown-ENTER', () => {
      this.scene.start('OfficeScene');
    });

    // Versión
    this.add.text(width / 2, height - 20, 'v0.1.0 MVP - Fase 1', {
      fontSize: '9px',
      color: '#444444'
    }).setOrigin(0.5);
  }
}
