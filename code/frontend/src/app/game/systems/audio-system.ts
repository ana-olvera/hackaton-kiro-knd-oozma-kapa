/**
 * Sistema de audio generado programáticamente con Web Audio API.
 * Genera efectos de sonido sin archivos externos.
 */

export class AudioSystem {
  private audioCtx: AudioContext | null = null;
  private isMuted = false;
  private volume = 0.5;

  constructor() {
    this.loadSettings();
  }

  private getContext(): AudioContext {
    if (!this.audioCtx) {
      this.audioCtx = new AudioContext();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  // === Efectos de sonido ===

  playTeamsNotification(): void {
    if (this.isMuted) return;
    const ctx = this.getContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = 'sine';
    gain.gain.value = this.volume * 0.3;

    // Teams "ding dong" - dos notas
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.frequency.setValueAtTime(1100, ctx.currentTime + 0.15);

    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.4);
  }

  playCoffee(): void {
    if (this.isMuted) return;
    const ctx = this.getContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = 'sine';
    gain.gain.value = this.volume * 0.2;
    osc.frequency.setValueAtTime(600, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(800, ctx.currentTime + 0.1);

    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.2);
  }

  playSuccess(): void {
    if (this.isMuted) return;
    const ctx = this.getContext();
    const notes = [523, 659, 784]; // C5, E5, G5

    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.type = 'square';
      osc.frequency.value = freq;
      gain.gain.value = this.volume * 0.15;
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.15 + 0.3);

      osc.start(ctx.currentTime + i * 0.15);
      osc.stop(ctx.currentTime + i * 0.15 + 0.3);
    });
  }

  playError(): void {
    if (this.isMuted) return;
    const ctx = this.getContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(200, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(100, ctx.currentTime + 0.3);
    gain.gain.value = this.volume * 0.2;
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.3);
  }

  playAchievement(): void {
    if (this.isMuted) return;
    const ctx = this.getContext();
    const notes = [523, 659, 784, 1047]; // C5, E5, G5, C6

    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.value = this.volume * 0.2;
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.12 + 0.4);

      osc.start(ctx.currentTime + i * 0.12);
      osc.stop(ctx.currentTime + i * 0.12 + 0.4);
    });
  }

  playKeyboard(): void {
    if (this.isMuted) return;
    const ctx = this.getContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = 'square';
    osc.frequency.value = 800 + Math.random() * 400;
    gain.gain.value = this.volume * 0.05;
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.05);
  }

  playWalk(): void {
    if (this.isMuted) return;
    const ctx = this.getContext();
    const bufferSize = ctx.sampleRate * 0.05;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.1;
    }

    const source = ctx.createBufferSource();
    const gain = ctx.createGain();
    source.buffer = buffer;
    source.connect(gain);
    gain.connect(ctx.destination);
    gain.gain.value = this.volume * 0.1;

    source.start(ctx.currentTime);
  }

  playGameOver(): void {
    if (this.isMuted) return;
    const ctx = this.getContext();
    const notes = [400, 350, 300, 200];

    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.type = 'triangle';
      osc.frequency.value = freq;
      gain.gain.value = this.volume * 0.25;
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.3 + 0.5);

      osc.start(ctx.currentTime + i * 0.3);
      osc.stop(ctx.currentTime + i * 0.3 + 0.5);
    });
  }

  // === Configuración ===

  setMuted(muted: boolean): void {
    this.isMuted = muted;
    this.saveSettings();
  }

  toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    this.saveSettings();
    return this.isMuted;
  }

  setVolume(vol: number): void {
    this.volume = Math.max(0, Math.min(1, vol));
    this.saveSettings();
  }

  getMuted(): boolean { return this.isMuted; }
  getVolume(): number { return this.volume; }

  private saveSettings(): void {
    try {
      localStorage.setItem('michi-audio', JSON.stringify({ muted: this.isMuted, volume: this.volume }));
    } catch { /* silent */ }
  }

  private loadSettings(): void {
    try {
      const saved = localStorage.getItem('michi-audio');
      if (saved) {
        const { muted, volume } = JSON.parse(saved);
        this.isMuted = muted;
        this.volume = volume;
      }
    } catch { /* silent */ }
  }
}
