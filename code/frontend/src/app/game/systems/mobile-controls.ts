import * as Phaser from 'phaser';

/**
 * Controles táctiles para móviles.
 * Se renderizan en la HudScene (800x600 lógico, sin zoom).
 * D-pad inferior izquierda, botón E inferior derecha.
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
  private input: MobileInput = { left: false, right: false, up: false, down: false, interact: false };
  private enabled = true;
  private elements: Phaser.GameObjects.GameObject[] = [];

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  create(): void {
    if (!this.isTouchDevice()) {
      this.enabled = false;
      return;
    }

    this.enabled = true;

    // Canvas lógico: 800x600
    // D-pad: esquina inferior izquierda (dentro del área segura)
    const dpadX = 90;
    const dpadY = 530;
    const btnSize = 24;
    const spacing = 34;

    const dpadBg = this.scene.add.circle(dpadX, dpadY, 52, 0x000000, 0.5);
    this.elements.push(dpadBg);

    this.createDpadButton('up', dpadX, dpadY - spacing, btnSize, '▲');
    this.createDpadButton('down', dpadX, dpadY + spacing, btnSize, '▼');
    this.createDpadButton('left', dpadX - spacing, dpadY, btnSize, '◀');
    this.createDpadButton('right', dpadX + spacing, dpadY, btnSize, '▶');

    // Botón E: esquina inferior derecha
    const interactX = 710;
    const interactY = 530;

    const interactBg = this.scene.add.circle(interactX, interactY, 38, 0x000000, 0.5);
    this.elements.push(interactBg);

    const interactBtn = this.scene.add.circle(interactX, interactY, 30, 0x00AA55);
    interactBtn.setStrokeStyle(3, 0x00FF88);
    interactBtn.setInteractive();
    this.elements.push(interactBtn);

    const eLabel = this.scene.add.text(interactX, interactY, 'E', {
      fontSize: '16px', color: '#FFFFFF', fontStyle: 'bold'
    }).setOrigin(0.5);
    this.elements.push(eLabel);

    interactBtn.on('pointerdown', () => {
      this.input.interact = true;
      interactBtn.setFillStyle(0x00FF88);
    });
    interactBtn.on('pointerup', () => {
      this.input.interact = false;
      interactBtn.setFillStyle(0x00AA55);
    });
    interactBtn.on('pointerout', () => {
      this.input.interact = false;
      interactBtn.setFillStyle(0x00AA55);
    });

    // Escuchar cambios de orientación/resize para reposicionar
    this.scene.scale.on('resize', () => this.repositionControls());
  }

  private repositionControls(): void {
    // Con Scale.FIT el espacio lógico siempre es 800x600
    // No necesitamos recalcular, Phaser escala todo proporcionalmente
  }

  private createDpadButton(direction: string, x: number, y: number, size: number, label: string): void {
    const btn = this.scene.add.circle(x, y, size, 0x333366);
    btn.setStrokeStyle(2, 0x6666CC);
    btn.setInteractive();
    this.elements.push(btn);

    const text = this.scene.add.text(x, y, label, {
      fontSize: '12px', color: '#FFFFFF'
    }).setOrigin(0.5);
    this.elements.push(text);

    btn.on('pointerdown', () => {
      this.setDirection(direction, true);
      btn.setFillStyle(0x6666CC);
    });
    btn.on('pointerup', () => {
      this.setDirection(direction, false);
      btn.setFillStyle(0x333366);
    });
    btn.on('pointerout', () => {
      this.setDirection(direction, false);
      btn.setFillStyle(0x333366);
    });
  }

  private setDirection(direction: string, value: boolean): void {
    switch (direction) {
      case 'up': this.input.up = value; break;
      case 'down': this.input.down = value; break;
      case 'left': this.input.left = value; break;
      case 'right': this.input.right = value; break;
    }
  }

  getInput(): MobileInput {
    return this.input;
  }

  isEnabled(): boolean {
    return this.enabled;
  }

  private isTouchDevice(): boolean {
    return (
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      window.matchMedia('(pointer: coarse)').matches
    );
  }

  destroy(): void {
    this.elements.forEach(el => el.destroy());
    this.elements = [];
  }
}
