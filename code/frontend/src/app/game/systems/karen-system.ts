import * as Phaser from 'phaser';

/**
 * Sistema de Karen: envía mensajes periódicos por "Teams" que aumentan el estrés.
 * La frecuencia aumenta conforme sube el Karenómetro.
 */

export interface KarenMessage {
  text: string;
  stressImpact: number;
  karenImpact: number;
}

const KAREN_MESSAGES: KarenMessage[] = [
  { text: '¿Cómo vamos?', stressImpact: 5, karenImpact: 3 },
  { text: 'Es rápido.', stressImpact: 8, karenImpact: 5 },
  { text: 'Nada más cambia un botón.', stressImpact: 10, karenImpact: 5 },
  { text: '¿Lo subes hoy?', stressImpact: 12, karenImpact: 7 },
  { text: '¿Ya quedó?', stressImpact: 15, karenImpact: 8 },
  { text: 'El cliente preguntó...', stressImpact: 10, karenImpact: 6 },
  { text: 'Solo son 5 minutitos.', stressImpact: 8, karenImpact: 4 },
  { text: 'No debe tardar.', stressImpact: 7, karenImpact: 4 },
  { text: '¿Seguro que hiciste commit?', stressImpact: 12, karenImpact: 6 },
  { text: 'Reunión en 5 min.', stressImpact: 10, karenImpact: 5 },
  { text: '¿Puedes compartir pantalla?', stressImpact: 15, karenImpact: 8 },
  { text: 'Es urgente pero no tanto.', stressImpact: 9, karenImpact: 5 },
  { text: 'Ayer sí funcionaba...', stressImpact: 11, karenImpact: 6 },
  { text: '¿Quién movió producción?', stressImpact: 18, karenImpact: 10 },
];

export class KarenSystem {
  private scene: Phaser.Scene;
  private timer: Phaser.Time.TimerEvent | null = null;
  private messageContainer: Phaser.GameObjects.Container | null = null;
  private karenLevel = 0;
  private isShowingMessage = false;
  private onMessageCallback: ((msg: KarenMessage) => void) | null = null;

  // Intervalo base (ms): empieza cada 15s, baja hasta 5s con karenómetro alto
  private baseInterval = 15000;
  private minInterval = 5000;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  start(onMessage?: (msg: KarenMessage) => void): void {
    this.onMessageCallback = onMessage || null;
    this.scheduleNextMessage();
  }

  stop(): void {
    if (this.timer) {
      this.timer.destroy();
      this.timer = null;
    }
  }

  setKarenLevel(level: number): void {
    this.karenLevel = Math.max(0, Math.min(100, level));
  }

  private scheduleNextMessage(): void {
    const interval = this.calculateInterval();

    this.timer = this.scene.time.delayedCall(interval, () => {
      this.showMessage();
      this.scheduleNextMessage();
    });
  }

  private calculateInterval(): number {
    // A mayor karenómetro, menor intervalo entre mensajes
    const factor = 1 - (this.karenLevel / 100) * 0.7;
    return this.baseInterval * factor + this.minInterval * (1 - factor);
  }

  private showMessage(): void {
    if (this.isShowingMessage) return;
    this.isShowingMessage = true;

    const message = KAREN_MESSAGES[Math.floor(Math.random() * KAREN_MESSAGES.length)];

    // Notificar al sistema de estado
    if (this.onMessageCallback) {
      this.onMessageCallback(message);
    }

    // Mostrar visualmente el mensaje tipo Teams
    this.displayTeamsNotification(message);
  }

  private displayTeamsNotification(message: KarenMessage): void {
    const cam = this.scene.cameras.main;
    const x = cam.scrollX + cam.width - 10;
    const y = cam.scrollY + 60;

    // Contenedor del mensaje
    const container = this.scene.add.container(x + 200, y);
    container.setScrollFactor(0);
    container.setDepth(1000);

    // Fondo del mensaje
    const bg = this.scene.add.rectangle(0, 0, 180, 60, 0x4B0082, 0.95);
    bg.setStrokeStyle(2, 0x7B68EE);

    // Icono Teams
    const teamsIcon = this.scene.add.text(-75, -20, '💬', { fontSize: '14px' });

    // Nombre Karen
    const name = this.scene.add.text(-55, -22, 'Karen', {
      fontSize: '10px',
      color: '#FF6B6B',
      fontStyle: 'bold'
    });

    // Texto del mensaje
    const msgText = this.scene.add.text(-75, 0, message.text, {
      fontSize: '9px',
      color: '#FFFFFF',
      wordWrap: { width: 160 }
    });

    // Indicador de estrés
    const stressText = this.scene.add.text(-75, 18, `+${message.stressImpact} estrés`, {
      fontSize: '8px',
      color: '#FF4444'
    });

    container.add([bg, teamsIcon, name, msgText, stressText]);
    this.messageContainer = container;

    // Animación de entrada (slide desde la derecha)
    this.scene.tweens.add({
      targets: container,
      x: x - 100,
      duration: 400,
      ease: 'Back.easeOut'
    });

    // Desaparecer después de 4 segundos
    this.scene.time.delayedCall(4000, () => {
      this.scene.tweens.add({
        targets: container,
        x: x + 200,
        alpha: 0,
        duration: 300,
        ease: 'Power2',
        onComplete: () => {
          container.destroy();
          this.messageContainer = null;
          this.isShowingMessage = false;
        }
      });
    });

    // Sonido de notificación (visual por ahora)
    this.flashScreen();
  }

  private flashScreen(): void {
    this.scene.cameras.main.flash(100, 75, 0, 130, false);
  }
}
