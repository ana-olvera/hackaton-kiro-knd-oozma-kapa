import * as Phaser from 'phaser';

/**
 * Sistema de botones táctiles para minijuegos.
 * Crea botones grandes y visibles para interacciones en móviles.
 */

export interface MobileButton {
  text: string;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  color?: number;
  textColor?: string;
  fontSize?: string;
  callback: () => void;
}

export class MobileButtons {
  private scene: Phaser.Scene;
  private container!: Phaser.GameObjects.Container;
  private buttons: Phaser.GameObjects.Container[] = [];
  private enabled = false;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  /**
   * Crea un conjunto de botones táctiles.
   */
  create(buttonsConfig: MobileButton[]): void {
    if (!this.isTouchDevice() && buttonsConfig.length === 0) return;

    this.enabled = true;
    this.container = this.scene.add.container(0, 0);
    this.container.setScrollFactor(0);
    this.container.setDepth(5000);

    const { width, height } = this.scene.cameras.main;
    const isMobile = width < 600;

    buttonsConfig.forEach((config, index) => {
      const btnWidth = config.width || (isMobile ? 140 : 120);
      const btnHeight = config.height || (isMobile ? 60 : 50);
      const btnColor = config.color || 0x5555AA;
      const textColor = config.textColor || '#FFFFFF';
      const fontSize = config.fontSize || (isMobile ? '18px' : '16px');

      // Posición por defecto: centrados en la parte inferior
      let x = config.x;
      let y = config.y;

      if (x === undefined || y === undefined) {
        const totalButtons = buttonsConfig.length;
        const spacing = isMobile ? 20 : 15;
        const totalWidth = totalButtons * btnWidth + (totalButtons - 1) * spacing;
        const startX = (width - totalWidth) / 2 + btnWidth / 2;

        x = startX + index * (btnWidth + spacing);
        y = height - (isMobile ? 80 : 60);
      }

      const btnContainer = this.createButton(
        x,
        y,
        btnWidth,
        btnHeight,
        config.text,
        btnColor,
        textColor,
        fontSize,
        config.callback
      );

      this.buttons.push(btnContainer);
      this.container.add(btnContainer);
    });
  }

  /**
   * Crea un botón individual con efecto táctil.
   */
  private createButton(
    x: number,
    y: number,
    width: number,
    height: number,
    text: string,
    color: number,
    textColor: string,
    fontSize: string,
    callback: () => void
  ): Phaser.GameObjects.Container {
    const btnContainer = this.scene.add.container(x, y);

    // Fondo del botón
    const bg = this.scene.add.rectangle(0, 0, width, height, color, 1);
    bg.setStrokeStyle(3, 0xFFFFFF, 0.5);
    bg.setInteractive({ useHandCursor: true });
    btnContainer.add(bg);

    // Texto
    const btnText = this.scene.add.text(0, 0, text, {
      fontSize,
      color: textColor,
      fontStyle: 'bold',
      align: 'center'
    }).setOrigin(0.5);
    btnContainer.add(btnText);

    // Efectos táctiles
    bg.on('pointerdown', () => {
      bg.setFillStyle(0xFFFFFF);
      btnText.setColor('#000000');
      this.scene.tweens.add({
        targets: btnContainer,
        scaleX: 0.95,
        scaleY: 0.95,
        duration: 100
      });
    });

    bg.on('pointerup', () => {
      bg.setFillStyle(color);
      btnText.setColor(textColor);
      this.scene.tweens.add({
        targets: btnContainer,
        scaleX: 1,
        scaleY: 1,
        duration: 100,
        onComplete: () => callback()
      });
    });

    bg.on('pointerout', () => {
      bg.setFillStyle(color);
      btnText.setColor(textColor);
      this.scene.tweens.add({
        targets: btnContainer,
        scaleX: 1,
        scaleY: 1,
        duration: 100
      });
    });

    return btnContainer;
  }

  /**
   * Crea botones en formato vertical (útil para menús)
   */
  createVertical(buttonsConfig: Omit<MobileButton, 'x' | 'y'>[]): void {
    const { width, height } = this.scene.cameras.main;
    const isMobile = width < 600;
    const btnHeight = isMobile ? 60 : 50;
    const spacing = isMobile ? 20 : 15;
    const totalHeight = buttonsConfig.length * btnHeight + (buttonsConfig.length - 1) * spacing;
    const startY = (height - totalHeight) / 2 + btnHeight / 2;

    const configsWithPosition: MobileButton[] = buttonsConfig.map((config, index) => ({
      ...config,
      x: width / 2,
      y: startY + index * (btnHeight + spacing)
    }));

    this.create(configsWithPosition);
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
    this.buttons = [];
  }
}
