import * as Phaser from 'phaser';

/**
 * Sistema de tiempo del juego.
 * El día va de 9:00 AM a 6:00 PM (540 minutos de juego).
 * El tiempo real se comprime: 1 segundo real = 1 minuto de juego (configurable).
 */
export class TimeSystem {
  private scene: Phaser.Scene;
  private currentMinutes = 0; // 0 = 9:00 AM, 540 = 6:00 PM
  private totalMinutes = 540;  // 9 horas de jornada
  private realSecondsPerGameMinute = 1; // 1 seg real = 1 min juego (9 min reales = día completo)
  private timer: Phaser.Time.TimerEvent | null = null;
  private isPaused = false;

  private onTickCallback: ((minutes: number, timeString: string) => void) | null = null;
  private onDayEndCallback: (() => void) | null = null;
  private onHourChangeCallback: ((hour: number) => void) | null = null;

  private lastHour = 9;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  start(options?: {
    onTick?: (minutes: number, timeString: string) => void;
    onDayEnd?: () => void;
    onHourChange?: (hour: number) => void;
    speed?: number;
  }): void {
    if (options?.onTick) this.onTickCallback = options.onTick;
    if (options?.onDayEnd) this.onDayEndCallback = options.onDayEnd;
    if (options?.onHourChange) this.onHourChangeCallback = options.onHourChange;
    if (options?.speed) this.realSecondsPerGameMinute = options.speed;

    this.timer = this.scene.time.addEvent({
      delay: this.realSecondsPerGameMinute * 1000,
      callback: this.tick,
      callbackScope: this,
      loop: true
    });
  }

  stop(): void {
    if (this.timer) {
      this.timer.destroy();
      this.timer = null;
    }
  }

  pause(): void {
    this.isPaused = true;
    if (this.timer) this.timer.paused = true;
  }

  resume(): void {
    this.isPaused = false;
    if (this.timer) this.timer.paused = false;
  }

  getCurrentMinutes(): number {
    return this.currentMinutes;
  }

  getTimeString(): string {
    const totalMinutesFromMidnight = this.currentMinutes + 9 * 60; // Offset 9AM
    const hours = Math.floor(totalMinutesFromMidnight / 60);
    const mins = totalMinutesFromMidnight % 60;
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHour = hours > 12 ? hours - 12 : hours;
    return `${displayHour}:${mins.toString().padStart(2, '0')} ${period}`;
  }

  getProgress(): number {
    return this.currentMinutes / this.totalMinutes;
  }

  getHour(): number {
    return Math.floor((this.currentMinutes + 9 * 60) / 60);
  }

  private tick(): void {
    if (this.isPaused) return;

    this.currentMinutes++;

    // Notificar tick
    if (this.onTickCallback) {
      this.onTickCallback(this.currentMinutes, this.getTimeString());
    }

    // Verificar cambio de hora
    const currentHour = this.getHour();
    if (currentHour !== this.lastHour) {
      this.lastHour = currentHour;
      if (this.onHourChangeCallback) {
        this.onHourChangeCallback(currentHour);
      }
    }

    // Verificar fin del día
    if (this.currentMinutes >= this.totalMinutes) {
      this.stop();
      if (this.onDayEndCallback) {
        this.onDayEndCallback();
      }
    }
  }
}
