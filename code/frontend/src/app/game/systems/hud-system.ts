import * as Phaser from 'phaser';

/**
 * HUD Scene - Escena superpuesta que muestra la UI sin verse afectada por el zoom.
 * Se ejecuta en paralelo sobre la OfficeScene.
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

export class HudScene extends Phaser.Scene {
  private bars: Map<string, StatBar> = new Map();
  private clockText!: Phaser.GameObjects.Text;
  private karenometerBg!: Phaser.GameObjects.Rectangle;
  private karenometerFill!: Phaser.GameObjects.Rectangle;
  private karenometerText!: Phaser.GameObjects.Text;
  private portraitImage!: Phaser.GameObjects.Image;
  private portraitBorder!: Phaser.GameObjects.Rectangle;
  private emotionLabel!: Phaser.GameObjects.Text;

  private readonly BAR_WIDTH = 55;
  private readonly BAR_HEIGHT = 7;
  private readonly PADDING = 8;

  constructor() {
    super({ key: 'HudScene', active: false });
  }

  create(): void {
    // Fondo semi-transparente del HUD (esquina superior izquierda)
    const hudBg = this.add.rectangle(
      this.PADDING - 2, this.PADDING - 2, 170, 165, 0x000000, 0.8
    ).setOrigin(0, 0);
    hudBg.setStrokeStyle(1, 0x333366);

    // Reloj
    this.clockText = this.add.text(this.PADDING + 2, this.PADDING + 2, '🕐 9:00 AM', {
      fontSize: '12px',
      color: '#00FF88',
      fontStyle: 'bold'
    });

    // Barras de estado
    const stats = [
      { key: 'energy', label: 'Energía', icon: '❤️', color: 0xFF4444, value: 80 },
      { key: 'coffee', label: 'Café', icon: '☕', color: 0x8B4513, value: 50 },
      { key: 'hunger', label: 'Hambre', icon: '🍗', color: 0xFFD700, value: 30 },
      { key: 'sleep', label: 'Sueño', icon: '😴', color: 0x6666FF, value: 20 },
      { key: 'focus', label: 'Concentr.', icon: '🧠', color: 0xFF88CC, value: 70 },
      { key: 'stress', label: 'Estrés', icon: '😿', color: 0xFF0000, value: 10 },
    ];

    let yOffset = this.PADDING + 20;
    for (const stat of stats) {
      this.createStatBar(stat.key, stat.label, stat.icon, stat.color, stat.value, yOffset);
      yOffset += 17;
    }

    // Karenómetro
    yOffset += 4;
    this.karenometerText = this.add.text(this.PADDING + 2, yOffset, '😡 Karen: 0%', {
      fontSize: '9px',
      color: '#FF6666'
    });

    yOffset += 13;
    this.karenometerBg = this.add.rectangle(
      this.PADDING + 2, yOffset, this.BAR_WIDTH + 35, 8, 0x333333
    ).setOrigin(0, 0);

    this.karenometerFill = this.add.rectangle(
      this.PADDING + 2, yOffset, 0, 8, 0xFF0000
    ).setOrigin(0, 0);

    // Retrato emocional (esquina superior derecha)
    const portraitX = 730;
    const portraitY = 50;
    const portraitSize = 70;

    const portraitBg = this.add.rectangle(portraitX, portraitY, portraitSize + 10, portraitSize + 10, 0x000000, 0.8);
    portraitBg.setStrokeStyle(1, 0x333366);

    this.portraitBorder = this.add.rectangle(portraitX, portraitY, portraitSize + 4, portraitSize + 4, 0x000000, 0);
    this.portraitBorder.setStrokeStyle(2, 0x00FF88);

    // Cargar retrato desde atlas
    if (this.textures.exists('michi-emotions')) {
      this.portraitImage = this.add.image(portraitX, portraitY, 'michi-emotions', 'happy');
      // Escalar proporcionalmente al tamaño del frame
      const frame = this.portraitImage.frame;
      const scale = Math.min(portraitSize / frame.width, portraitSize / frame.height);
      this.portraitImage.setScale(scale);
    } else {
      // Fallback: texto emoji
      this.add.text(portraitX, portraitY, '🐱', { fontSize: '32px' }).setOrigin(0.5);
    }

    this.emotionLabel = this.add.text(portraitX, portraitY + portraitSize / 2 + 12, 'Feliz', {
      fontSize: '9px',
      color: '#00FF88'
    }).setOrigin(0.5);

    // Controles (esquina inferior)
    this.add.text(400, 580, 'Flechas: mover | E: interactuar (💻 minijuego | ☕ café)', {
      fontSize: '10px',
      color: '#555555'
    }).setOrigin(0.5);
  }

  private createStatBar(
    key: string, label: string, icon: string,
    color: number, value: number, y: number
  ): void {
    const x = this.PADDING + 2;

    const labelText = this.add.text(x, y, `${icon} ${label}`, {
      fontSize: '8px',
      color: '#CCCCCC'
    });

    const bgBar = this.add.rectangle(
      x + 70, y + 2, this.BAR_WIDTH, this.BAR_HEIGHT, 0x333333
    ).setOrigin(0, 0);

    const fillWidth = (value / 100) * this.BAR_WIDTH;
    const fillBar = this.add.rectangle(
      x + 70, y + 2, fillWidth, this.BAR_HEIGHT, color
    ).setOrigin(0, 0);

    const valueText = this.add.text(x + 70 + this.BAR_WIDTH + 4, y, `${value}`, {
      fontSize: '8px',
      color: '#AAAAAA'
    });

    this.bars.set(key, {
      label, icon, color, value, maxValue: 100,
      bgBar, fillBar, text: valueText
    });
  }

  // === Métodos públicos para actualizar desde OfficeScene ===

  updateStat(key: string, value: number): void {
    const bar = this.bars.get(key);
    if (!bar) return;

    bar.value = Math.max(0, Math.min(100, value));
    const fillWidth = (bar.value / 100) * this.BAR_WIDTH;
    bar.fillBar.width = fillWidth;
    bar.text.setText(`${Math.round(bar.value)}`);

    if (key === 'stress' || key === 'hunger' || key === 'sleep') {
      if (bar.value > 75) bar.fillBar.setFillStyle(0xFF0000);
      else if (bar.value > 50) bar.fillBar.setFillStyle(0xFFAA00);
      else bar.fillBar.setFillStyle(bar.color);
    } else {
      if (bar.value < 25) bar.fillBar.setFillStyle(0xFF0000);
      else if (bar.value < 50) bar.fillBar.setFillStyle(0xFFAA00);
      else bar.fillBar.setFillStyle(bar.color);
    }
  }

  updateKarenometer(value: number): void {
    const clamped = Math.max(0, Math.min(100, value));
    const fillWidth = (clamped / 100) * (this.BAR_WIDTH + 35);
    this.karenometerFill.width = fillWidth;
    this.karenometerText.setText(`😡 Karen: ${Math.round(clamped)}%`);

    if (clamped > 80) this.karenometerFill.setFillStyle(0xFF0000);
    else if (clamped > 50) this.karenometerFill.setFillStyle(0xFF6600);
    else this.karenometerFill.setFillStyle(0xFF4444);
  }

  updateClock(timeString: string): void {
    this.clockText.setText(`🕐 ${timeString}`);
  }

  updatePortrait(emotion: string): void {
    if (this.portraitImage && this.textures.exists('michi-emotions')) {
      this.portraitImage.setTexture('michi-emotions', emotion);
      // Re-escalar proporcional al nuevo frame
      const frame = this.portraitImage.frame;
      const portraitSize = 70;
      const scale = Math.min(portraitSize / frame.width, portraitSize / frame.height);
      this.portraitImage.setScale(scale);
    }

    if (this.emotionLabel) {
      this.emotionLabel.setText(this.getEmotionLabel(emotion));
    }

    if (this.portraitBorder) {
      this.portraitBorder.setStrokeStyle(2, this.getEmotionColor(emotion));
    }

    // Bounce
    if (this.portraitImage) {
      this.tweens.add({
        targets: this.portraitImage,
        scaleX: this.portraitImage.scaleX * 1.15,
        scaleY: this.portraitImage.scaleY * 1.15,
        duration: 100,
        yoyo: true
      });
    }
  }

  private getEmotionLabel(emotion: string): string {
    const labels: Record<string, string> = {
      happy: 'Feliz', tired: 'Cansado', sleeping: 'Dormido',
      angry: 'Furioso', stressed: 'Estresado', surprised: 'Sorprendido',
      confused: 'Confundido', proud: 'Orgulloso', scared: 'Asustado',
      thinking: 'Pensando', crying: 'Llorando', desperate: 'Desesperado',
      eating: 'Comiendo'
    };
    return labels[emotion] || emotion;
  }

  private getEmotionColor(emotion: string): number {
    const colors: Record<string, number> = {
      happy: 0x00FF88, tired: 0xFFAA44, sleeping: 0x6688FF,
      angry: 0xFF0000, stressed: 0xFF4444, surprised: 0xFFFF00,
      confused: 0x44FFCC, proud: 0x88FF44, scared: 0x8844FF,
      thinking: 0xFFCC88, crying: 0x4488FF, desperate: 0xFF44AA,
      eating: 0xFFDD00
    };
    return colors[emotion] || 0xFFFFFF;
  }
}

/**
 * Wrapper para mantener compatibilidad con la API anterior.
 * La OfficeScene usa HudSystem, que internamente lanza/gestiona HudScene.
 */
export class HudSystem {
  private scene: Phaser.Scene;
  private hudScene: HudScene | null = null;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  create(): void {
    // Lanzar HudScene como escena paralela sobre la actual
    this.scene.scene.launch('HudScene');
    this.hudScene = this.scene.scene.get('HudScene') as HudScene;
  }

  updateStat(key: string, value: number): void {
    this.hudScene?.updateStat(key, value);
  }

  updateKarenometer(value: number): void {
    this.hudScene?.updateKarenometer(value);
  }

  updateClock(timeString: string): void {
    this.hudScene?.updateClock(timeString);
  }

  updatePortrait(emotion: string): void {
    this.hudScene?.updatePortrait(emotion);
  }

  destroy(): void {
    if (this.hudScene) {
      this.scene.scene.stop('HudScene');
    }
  }
}
