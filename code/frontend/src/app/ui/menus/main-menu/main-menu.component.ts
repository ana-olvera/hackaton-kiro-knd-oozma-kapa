import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main-menu',
  standalone: true,
  template: `
    <div class="main-menu">
      <h1 class="title">🐱 Ayuda a Michi Godín</h1>
      <h2 class="subtitle">Sobrevive al Sprint</h2>

      <div class="menu-buttons">
        <button class="menu-btn play-btn" (click)="startGame()">
          ▶ Jugar
        </button>
        <button class="menu-btn" disabled>
          ⚙ Configuración
        </button>
        <button class="menu-btn" disabled>
          🏆 Logros
        </button>
      </div>

      <p class="version">v0.0.1 - MVP</p>
    </div>
  `,
  styles: [`
    .main-menu {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100vh;
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
      color: white;
      font-family: 'Press Start 2P', monospace, sans-serif;
    }

    .title {
      font-size: 2rem;
      margin-bottom: 0.5rem;
      text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
    }

    .subtitle {
      font-size: 1rem;
      color: #aaa;
      margin-bottom: 3rem;
    }

    .menu-buttons {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .menu-btn {
      padding: 1rem 2rem;
      font-size: 1.1rem;
      border: 2px solid #444;
      background: #2d2d44;
      color: white;
      cursor: pointer;
      border-radius: 8px;
      transition: all 0.2s;
      min-width: 250px;
    }

    .menu-btn:hover:not(:disabled) {
      background: #3d3d55;
      border-color: #00ff88;
      transform: scale(1.05);
    }

    .menu-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .play-btn {
      border-color: #00ff88;
      color: #00ff88;
    }

    .version {
      position: absolute;
      bottom: 1rem;
      font-size: 0.7rem;
      color: #555;
    }
  `]
})
export class MainMenuComponent {
  constructor(private router: Router) {}

  startGame(): void {
    this.router.navigate(['/game']);
  }
}
