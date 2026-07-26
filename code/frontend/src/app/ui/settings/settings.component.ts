import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="settings-page">
      <div class="header">
        <button class="back-btn" (click)="goBack()">← Volver</button>
        <h1>⚙ Configuración</h1>
      </div>

      <div class="settings-container">
        <!-- Audio -->
        <div class="settings-section">
          <h2>🔊 Audio</h2>

          <div class="setting-row">
            <span>Sonido</span>
            <button class="toggle-btn" [class.active]="!isMuted" (click)="toggleMute()">
              {{ isMuted ? '🔇 Silenciado' : '🔊 Activado' }}
            </button>
          </div>

          <div class="setting-row">
            <span>Volumen</span>
            <div class="volume-control">
              <button class="vol-btn" (click)="changeVolume(-0.1)">−</button>
              <div class="volume-bar">
                <div class="volume-fill" [style.width.%]="volume * 100"></div>
              </div>
              <button class="vol-btn" (click)="changeVolume(0.1)">+</button>
              <span class="vol-label">{{ (volume * 100) | number:'1.0-0' }}%</span>
            </div>
          </div>
        </div>

        <!-- Datos -->
        <div class="settings-section">
          <h2>💾 Datos</h2>

          <div class="setting-row">
            <span>Progreso guardado</span>
            <span class="data-info">{{ hasProgress ? '✅ Sí' : '❌ No' }}</span>
          </div>

          <div class="setting-row danger">
            <span>Borrar todo el progreso</span>
            <button class="reset-btn" (click)="confirmReset()">
              {{ confirmingReset ? '⚠️ ¿Seguro? Clic de nuevo' : '🗑 Reiniciar' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .settings-page {
      min-height: 100vh;
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
      color: white;
      padding: 2rem;
      font-family: 'Press Start 2P', monospace, sans-serif;
    }

    .header {
      text-align: center;
      margin-bottom: 2rem;
    }

    .header h1 {
      font-size: 1.8rem;
      margin: 0.5rem 0;
    }

    .back-btn {
      position: absolute;
      top: 1.5rem;
      left: 1.5rem;
      background: #2d2d44;
      border: 2px solid #444;
      color: #AAAAAA;
      padding: 0.5rem 1rem;
      font-size: 0.8rem;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.2s;
    }

    .back-btn:hover {
      border-color: #00FF88;
      color: #00FF88;
    }

    .settings-container {
      max-width: 500px;
      margin: 0 auto;
    }

    .settings-section {
      margin-bottom: 2rem;
      padding: 1.5rem;
      background: rgba(45, 45, 68, 0.5);
      border-radius: 10px;
      border: 1px solid #333;
    }

    .settings-section h2 {
      font-size: 1rem;
      margin: 0 0 1rem 0;
      color: #00FF88;
    }

    .setting-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.8rem 0;
      border-bottom: 1px solid #222;
      font-size: 0.75rem;
    }

    .setting-row:last-child {
      border-bottom: none;
    }

    .toggle-btn {
      background: #333;
      border: 2px solid #555;
      color: #AAA;
      padding: 0.4rem 0.8rem;
      border-radius: 6px;
      cursor: pointer;
      font-size: 0.7rem;
      transition: all 0.2s;
    }

    .toggle-btn.active {
      background: #003322;
      border-color: #00FF88;
      color: #00FF88;
    }

    .volume-control {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .vol-btn {
      background: #333;
      border: 1px solid #555;
      color: white;
      width: 28px;
      height: 28px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 1rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .vol-btn:hover {
      background: #444;
    }

    .volume-bar {
      width: 80px;
      height: 8px;
      background: #333;
      border-radius: 4px;
      overflow: hidden;
    }

    .volume-fill {
      height: 100%;
      background: #00FF88;
      border-radius: 4px;
      transition: width 0.2s;
    }

    .vol-label {
      font-size: 0.6rem;
      color: #888;
      min-width: 35px;
    }

    .lang-buttons {
      display: flex;
      gap: 0.5rem;
    }

    .lang-btn {
      background: #333;
      border: 2px solid #444;
      color: #AAA;
      padding: 0.4rem 0.7rem;
      border-radius: 6px;
      cursor: pointer;
      font-size: 0.65rem;
      transition: all 0.2s;
    }

    .lang-btn.active {
      background: #003322;
      border-color: #00FF88;
      color: #00FF88;
    }

    .lang-btn:hover:not(.active) {
      border-color: #666;
    }

    .data-info {
      font-size: 0.7rem;
      color: #888;
    }

    .danger .reset-btn {
      background: #331111;
      border: 2px solid #FF4444;
      color: #FF4444;
      padding: 0.4rem 0.8rem;
      border-radius: 6px;
      cursor: pointer;
      font-size: 0.65rem;
      transition: all 0.2s;
    }

    .danger .reset-btn:hover {
      background: #441111;
    }
  `]
})
export class SettingsComponent implements OnInit {
  isMuted = false;
  volume = 0.7;
  language = 'es';
  hasProgress = false;
  confirmingReset = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loadSettings();
  }

  goBack(): void {
    this.router.navigate(['/']);
  }

  toggleMute(): void {
    this.isMuted = !this.isMuted;
    this.saveAudio();
  }

  changeVolume(delta: number): void {
    this.volume = Math.max(0, Math.min(1, this.volume + delta));
    this.saveAudio();
  }

  setLanguage(lang: string): void {
    this.language = lang;
    try {
      localStorage.setItem('michi-language', lang);
    } catch { /* silent */ }
  }

  confirmReset(): void {
    if (this.confirmingReset) {
      // Segunda confirmación: borrar todo
      this.resetAllData();
      this.confirmingReset = false;
    } else {
      this.confirmingReset = true;
      // Reset flag después de 3 segundos
      setTimeout(() => { this.confirmingReset = false; }, 3000);
    }
  }

  private resetAllData(): void {
    const keys = [
      'michi-achievements', 'michi-achievement-stats',
      'michi-progression', 'michi-audio', 'michi-language',
      'michi-skins', 'michi-rankings'
    ];
    keys.forEach(k => localStorage.removeItem(k));
    this.hasProgress = false;
    this.loadSettings();
  }

  private saveAudio(): void {
    try {
      localStorage.setItem('michi-audio', JSON.stringify({
        muted: this.isMuted,
        volume: this.volume
      }));
    } catch { /* silent */ }
  }

  private loadSettings(): void {
    try {
      // Audio
      const audio = localStorage.getItem('michi-audio');
      if (audio) {
        const parsed = JSON.parse(audio);
        this.isMuted = parsed.muted ?? false;
        this.volume = parsed.volume ?? 0.7;
      }

      // Idioma
      const lang = localStorage.getItem('michi-language');
      if (lang) this.language = lang;

      // Progreso
      this.hasProgress = !!(
        localStorage.getItem('michi-progression') ||
        localStorage.getItem('michi-achievements')
      );
    } catch { /* silent */ }
  }
}
