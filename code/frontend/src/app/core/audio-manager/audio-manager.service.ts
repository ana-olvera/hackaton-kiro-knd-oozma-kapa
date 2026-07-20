import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AudioManagerService {
  private isMuted = false;
  private volume = 0.7;

  playSound(key: string): void {
    if (this.isMuted) return;
    // Se implementará con Phaser Sound Manager
    console.log(`Playing sound: ${key}`);
  }

  playMusic(key: string): void {
    if (this.isMuted) return;
    console.log(`Playing music: ${key}`);
  }

  stopMusic(): void {
    console.log('Music stopped');
  }

  setMuted(muted: boolean): void {
    this.isMuted = muted;
  }

  setVolume(vol: number): void {
    this.volume = Math.max(0, Math.min(1, vol));
  }

  getVolume(): number {
    return this.volume;
  }

  getMuted(): boolean {
    return this.isMuted;
  }
}
