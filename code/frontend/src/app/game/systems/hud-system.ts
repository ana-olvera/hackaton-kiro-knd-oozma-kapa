import * as Phaser from 'phaser';

/**
 * HUD (Heads-Up Display) del juego.
 * Muestra las barras de estado, reloj y karenómetro.
 * Se renderiza como overlay fijo (scrollFactor 0).
 */

interface StatBar {
  label: string;
  icon: string;
  color: number;
  value: number;
  maxValue: number;
  bgBar: Phaser.GameObjects.Rectangle;
  fillBar: Phaser.GameObjects.Rectangle;
  text: Phaser.GameObjects.Text;
}

export class HudSystem {
  private scene: Phaser.Scene;
  private container!: Phaser.GameObjects.Container;
  private bars: Map<string, StatBar> = new Map();
  private clockText!: Phaser.GameObjects.Text;
  private karenometerBg!: Phaser.GameObjects.Rectangle;
  private karenometerFill!: Phaser.GameObjects.Rectangle;
  private karenometerText!: Phaser.GameObjects.Text;

  private readonly BAR_WIDTH = 60;
  private readonly BAR_HEIGHT = 8;
  private readonly PADDING = 8;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  create(): void {
    this.container = this.scene.add.container(0, 0);
    this.container.setScrollFactor(0);
    this.container.setDepth(900);

    // Fondo semi-transparente del HUD
    const hudBg = this.scene.add.rectangle(0, 0, 200, 180, 0x000000, 0.7);
    hudBg.setOrigin(0, 0);
    this.container.add(hudBg);

    // Reloj
    this.clockText = this.scene.add.text(this.PADDING, this.PADDING, '9:00 AM', {
      fontSize: '12px',
      color: '#00FF88',
      fontStyle: 'bold'
    });
    this.container.add(this.clockText);

    // Barras de estado
    const stats = [
      { key: 'energy', label: 'Energía', icon: '❤️', color: 0xFF4444, value: 80 },
      { key: 'coffee', label: 'Café', icon: '☕', color: 0x8B4513, value: 50 },
      { key: 'hunger', label: 'Hambre', icon: '🍗', color: 0xFFD700, value: 30 },
      { key: 'sleep', label: 'Sueño', icon: '😴', color: 0x6666FF, value: 20 },
      { key: 'focus', label: 'Concentración', icon: '🧠', color: 0xFF88CC, value: 70 },
      { key: 'stress', label: 'Estrés', icon: '😿', color: 0xFF0000, value: 10 },
    ];

    let yOffset = 28;
    for (const stat of stats) {
      this.createStatBar(stat.key, stat.label, stat.icon, stat.color, stat.value, yOffset);
      yOffset += 20;
    }

    // Karenómetro (barra especial más grande)
    yOffset += 5;
    this.karenometerText = this.scene.add.text(this.PADDING, yOffset, '😡 Karen: 0%', {
      fontSize: '9px',
      color: '#FF6666'
    });
    this.container.add(this.karenometerText);

    yOffset += 14;
    this.karenometerBg = this.scene.add.rectangle(
      this.PADDING, yOffset, this.BAR_WIDTH + 40, 10, 0x333333
    );
    this.karenometerBg.setOrigin(0, 0);
    this.container.add(this.karenometerBg);

    this.karenometerFill = this.scene.add.rectangle(
      this.PADDING, yOffset, 0, 10, 0xFF0000
    );
    this.karenometerFill.setOrigin(0, 0);
    this.container.add(this.karenometerFill);
  }

  private createStatBar(
    key: string, label: string, icon: string,
    color: number, value: number, y: number
  ): void {
    const x = this.PADDING;

    // Icono + label
    const text = this.scene.add.text(x, y, `${icon} ${label}`, {
      fontSize: '8px',
      color: '#CCCCCC'
    });
    this.container.add(text);

    // Barra de fondo
    const bgBar = this.scene.add.rectangle(
      x + 80, y + 2, this.BAR_WIDTH, this.BAR_HEIGHT, 0x333333
    );
    bgBar.setOrigin(0, 0);
    this.container.add(bgBar);

    // Barra de relleno
    const fillWidth = (value / 100) * this.BAR_WIDTH;
    const fillBar = this.scene.add.rectangle(
      x + 80, y + 2, fillWidth, this.BAR_HEIGHT, color
    );
    fillBar.setOrigin(0, 0);
    this.container.add(fillBar);

    // Valor numérico
    const valueText = this.scene.add.text(x + 80 + this.BAR_WIDTH + 4, y, `${value}`, {
      fontSize: '8px',
      color: '#AAAAAA'
    });
    this.container.add(valueText);

    this.bars.set(key, {
      label, icon, color, value, maxValue: 100,
      bgBar, fillBar, text: valueText
    });
  }

  updateStat(key: string, value: number): void {
    const bar = this.bars.get(key);
    if (!bar) return;

    bar.value = Math.max(0, Math.min(100, value));
    const fillWidth = (bar.value / 100) * this.BAR_WIDTH;
    bar.fillBar.width = fillWidth;
    bar.text.setText(`${Math.round(bar.value)}`);

    // Cambiar color si está bajo/alto
    if (key === 'stress' || key === 'hunger' || key === 'sleep') {
      // Estos son malos cuando están altos
      if (bar.value > 75) {
        bar.fillBar.setFillStyle(0xFF0000);
      } else if (bar.value > 50) {
        bar.fillBar.setFillStyle(0xFFAA00);
      } else {
        bar.fillBar.setFillStyle(bar.color);
      }
    } else {
      // Estos son malos cuando están bajos
      if (bar.value < 25) {
        bar.fillBar.setFillStyle(0xFF0000);
      } else if (bar.value < 50) {
        bar.fillBar.setFillStyle(0xFFAA00);
      } else {
        bar.fillBar.setFillStyle(bar.color);
      }
    }
  }

  updateKarenometer(value: number): void {
    const clamped = Math.max(0, Math.min(100, value));
    const fillWidth = (clamped / 100) * (this.BAR_WIDTH + 40);
    this.karenometerFill.width = fillWidth;
    this.karenometerText.setText(`😡 Karen: ${Math.round(clamped)}%`);

    // Parpadeo si está muy alto
    if (clamped > 80) {
      this.karenometerFill.setFillStyle(0xFF0000);
    } else if (clamped > 50) {
      this.karenometerFill.setFillStyle(0xFF6600);
    } else {
      this.karenometerFill.setFillStyle(0xFF4444);
    }
  }

  updateClock(timeString: string): void {
    this.clockText.setText(`🕐 ${timeString}`);
  }

  destroy(): void {
    this.container.destroy();
  }
}
