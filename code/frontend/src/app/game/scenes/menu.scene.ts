import * as Phaser from 'phaser';
import { SpriteGenerator } from '../assets/sprite-generator';

/**
 * Escena del menú dentro de Phaser.
 * Muestra el splash art isométrico de Michi y las opciones del juego.
 */
export class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MenuScene' });
  }

  preload(): void {
    SpriteGenerator.generateAll(this);

    // Cargar splash art isométrico
    this.load.image('michi-splash', 'assets/sprites/MichigodinMain.jpeg');

    // Cargar atlas de emociones (para que esté en cache cuando inicie OfficeScene)
    this.load.atlas(
      'michi-emotions',
      'assets/sprites/gestos_michigodin.jpeg',
      'assets/sprites/gestos_michigodin.json'
    );
  }

  create(): void {
    const { width, height } = this.cameras.main;

    // Fondo oscuro
    this.add.rectangle(width / 2, height / 2, width, height, 0x1a1a2e);

    // Splash art isométrico de Michi en su escritorio
    const splash = this.add.image(width / 2 + 180, height / 2 - 20, 'michi-splash');
    // Escalar para que se vea bien sin dominar la pantalla
    const splashScale = Math.min(280 / splash.width, 280 / splash.height);
    splash.setScale(splashScale);
    splash.setAlpha(0.9);

    // Efecto parallax suave en el splash
    this.tweens.add({
      targets: splash,
      y: splash.y - 8,
      duration: 2500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    // Título del juego (lado izquierdo)
    this.add.text(width / 2 - 140, height / 4, '🐱 Ayuda a\nMichi Godín', {
      fontSize: '26px',
      color: '#ffffff',
      fontStyle: 'bold',
      lineSpacing: 8
    }).setOrigin(0.5);

    this.add.text(width / 2 - 140, height / 4 + 60, 'Sobrevive al Sprint', {
      fontSize: '14px',
      color: '#00FF88',
      fontStyle: 'italic'
    }).setOrigin(0.5);

    // Instrucciones
    this.add.text(width / 2 - 140, height / 2 + 30, [
      '⬆⬇⬅➡  Mover a Michi',
      '   E     Interactuar',
      '   💻    Minijuegos de Git',
      '   ☕    Café = Energía',
    ].join('\n'), {
      fontSize: '10px',
      color: '#777777',
      lineSpacing: 6
    }).setOrigin(0.5);

    // Botón de inicio
    const startButton = this.add.text(width / 2 - 140, height / 2 + 140, '▶ EMPEZAR LUNES', {
      fontSize: '18px',
      color: '#00ff88',
      backgroundColor: '#2d2d44',
      padding: { x: 20, y: 10 }
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    // Pulso en el botón de inicio
    this.tweens.add({
      targets: startButton,
      scaleX: 1.05,
      scaleY: 1.05,
      duration: 800,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

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

    // También con Enter o Space
    this.input.keyboard!.on('keydown-ENTER', () => {
      this.cameras.main.fadeOut(500, 0, 0, 0);
      this.time.delayedCall(500, () => {
        this.scene.start('OfficeScene');
      });
    });
    this.input.keyboard!.on('keydown-SPACE', () => {
      this.cameras.main.fadeOut(500, 0, 0, 0);
      this.time.delayedCall(500, () => {
        this.scene.start('OfficeScene');
      });
    });

    // Línea decorativa
    const graphics = this.add.graphics();
    graphics.lineStyle(1, 0x333355);
    graphics.lineBetween(width / 2 - 20, 40, width / 2 - 20, height - 40);

    // Versión
    this.add.text(width / 2, height - 15, 'v0.1.0 MVP | Equipo Oozma Kapa', {
      fontSize: '8px',
      color: '#333355'
    }).setOrigin(0.5);

    // Fade in al entrar
    this.cameras.main.fadeIn(800);
  }
}
