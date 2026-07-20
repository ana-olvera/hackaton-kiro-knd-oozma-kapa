import * as Phaser from 'phaser';

/**
 * Sistema de controles táctiles para móviles.
 * Agrega un D-pad virtual y botón de interacción en pantalla.
 */

export interface MobileInput {
  left: boolean;
  right: boolean;
  up: boolean;
  down: boolean;
  interact: boolean;
}

export class MobileControls {
  private scene: Phaser.Scene;
  private container!: Phaser.GameObjects.Container;
  private input: MobileInput = { left: false, right: false, up: false, down: false, interact: false };
  private enabled = false;
  private dpadButtons: Map<string, Phaser.GameObjects.Arc> = new Map();
  private interactBtn!: Phaser.GameObjects.Arc;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  /**
   * Crea los controles táctiles solo si el dispositivo es táctil.
   */
  create(): void {
    if (!this.isTouchDevice()) return;

    this.enabled = true;
    this.container = this.scene.add.container(0, 0);
    this.container.setScrollFactor(0);
    this.container.setDepth(5000);
    this.container.setAlpha(0.6);

    const { height } = this.scene.cameras.main;

    // D-pad (esquina inferior izquierda)
    const dpadX = 90;
    const dpadY = height - 100;
    const btnSize = 28;
    const spacing = 38;

    // Fondo del D-pad
    const dpadBg = this.scene.add.circle(dpadX, dpadY, 60, 0x000000, 0.3);
    this.container.add(dpadBg);

    // Up
    this.createDpadButton('up', dpadX, dpadY - spacing, btnSize);
    // Down
    this.createDpadButton('down', dpadX, dpadY + spacing, btnSize);
    // Left
    this.createDpadButton('left', dpadX - spacing, dpadY, btnSize);
    // Right
    this.createDpadButton('right', dpadX + spacing, dpadY, btnSize);

    // Botón de interacción (esquina inferior derecha)
    const interactX = 710;
    const interactY = height - 100;

    const interactBg = this.scene.add.circle(interactX, interactY, 40, 0x000000, 0.3);
    this.container.add(interactBg);

    this.interactBtn = this.scene.add.circle(interactX, interactY, 32, 0x00AA55);
    this.interactBtn.setStrokeStyle(3, 0x00FF88);
    this.interactBtn.setInteractive();
    this.container.add(this.interactBtn);

    const eText = this.scene.add.text(interactX, interactY, 'E', {
      fontSize: '18px', color: '#FFFFFF', fontStyle: 'bold'
    }).setOrigin(0.5);
    this.container.add(eText);

    this.interactBtn.on('pointerdown', () => {
      this.input.interact = true;
      this.interactBtn.setFillStyle(0x00FF88);
    });
    this.interactBtn.on('pointerup', () => {
      this.input.interact = false;
      this.interactBtn.setFillStyle(0x00AA55);
    });
    this.interactBtn.on('pointerout', () => {
      this.input.interact = false;
      this.interactBtn.setFillStyle(0x00AA55);
    });

    // Labels
    const arrows = { up: '▲', down: '▼', left: '◀', right: '▶' };
    this.dpadButtons.forEach((btn, dir) => {
      const label = this.scene.add.text(btn.x, btn.y, arrows[dir as keyof typeof arrows], {
        fontSize: '14px', color: '#FFFFFF'
      }).setOrigin(0.5);
      this.container.add(label);
    });
  }

  private createDpadButton(direction: string, x: number, y: number, size: number): void {
    const btn = this.scene.add.circle(x, y, size, 0x333366);
    btn.setStrokeStyle(2, 0x5555AA);
    btn.setInteractive();
    this.container.add(btn);
    this.dpadButtons.set(direction, btn);

    btn.on('pointerdown', () => {
      (this.input as unknown as Record<string, boolean>)[direction] = true;
      btn.setFillStyle(0x5555AA);
    });
    btn.on('pointerup', () => {
      (this.input as unknown as Record<string, boolean>)[direction] = false;
      btn.setFillStyle(0x333366);
    });
    btn.on('pointerout', () => {
      (this.input as unknown as Record<string, boolean>)[direction] = false;
      btn.setFillStyle(0x333366);
    });
  }

  getInput(): MobileInput {
    return this.input;
  }

  isEnabled(): boolean {
    return this.enabled;
  }

  private isTouchDevice(): boolean {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  }

  setVisible(visible: boolean): void {
    if (this.container) {
      this.container.setVisible(visible);
    }
  }

  destroy(): void {
    if (this.container) {
      this.container.destroy();
    }
  }
}
