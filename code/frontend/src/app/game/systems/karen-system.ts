import * as Phaser from 'phaser';

/**
 * Sistema de Karen: envía mensajes periódicos por "Teams" que aumentan el estrés.
 * La frecuencia aumenta conforme sube el Karenómetro.
 * Las notificaciones se renderizan via callback (HudScene se encarga del visual).
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
  private karenLevel = 0;
  private onMessageCallback: ((msg: KarenMessage) => void) | null = null;

  private baseInterval = 15000;
  private minInterval = 5000;
  
  // Seguimiento para coordinación con NPC
  private lastMessageTime = 0;
  private messagesCount = 0;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  start(onMessage?: (msg: KarenMessage) => void): void {
    this.onMessageCallback = onMessage || null;
    this.lastMessageTime = Date.now();
    this.messagesCount = 0;
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

  /**
   * Obtiene el nivel actual del Karenómetro
   */
  getKarenLevel(): number {
    return this.karenLevel;
  }

  /**
   * Obtiene el tiempo desde el último mensaje (en ms)
   */
  getTimeSinceLastMessage(): number {
    return Date.now() - this.lastMessageTime;
  }

  /**
   * Obtiene el número total de mensajes enviados
   */
  getMessagesCount(): number {
    return this.messagesCount;
  }

  /**
   * Indica si está programado el siguiente mensaje
   */
  isActive(): boolean {
    return this.timer !== null;
  }

  private scheduleNextMessage(): void {
    const interval = this.calculateInterval();
    this.timer = this.scene.time.delayedCall(interval, () => {
      this.sendMessage();
      this.scheduleNextMessage();
    });
  }

  private calculateInterval(): number {
    const factor = 1 - (this.karenLevel / 100) * 0.7;
    return this.baseInterval * factor + this.minInterval * (1 - factor);
  }

  private sendMessage(): void {
    const message = KAREN_MESSAGES[Math.floor(Math.random() * KAREN_MESSAGES.length)];
    
    // Actualizar seguimiento
    this.lastMessageTime = Date.now();
    this.messagesCount++;
    
    if (this.onMessageCallback) {
      this.onMessageCallback(message);
    }
  }
}
