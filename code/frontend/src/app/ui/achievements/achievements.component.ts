import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
}

@Component({
  selector: 'app-achievements',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="achievements-page">
      <div class="header">
        <button class="back-btn" (click)="goBack()">← Volver</button>
        <h1>🏆 Logros</h1>
        <p class="counter">{{ unlockedCount }} / {{ achievements.length }} desbloqueados</p>
      </div>

      <div class="achievements-grid">
        <div
          *ngFor="let a of achievements"
          class="achievement-card"
          [class.unlocked]="a.unlocked"
          [class.locked]="!a.unlocked"
        >
          <div class="icon">{{ a.unlocked ? a.icon : '🔒' }}</div>
          <div class="info">
            <h3>{{ a.unlocked ? a.name : '???' }}</h3>
            <p>{{ a.unlocked ? a.description : 'Sigue jugando para desbloquear' }}</p>
            <small *ngIf="a.unlocked && a.unlockedAt">
              {{ formatDate(a.unlockedAt) }}
            </small>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .achievements-page {
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

    .counter {
      color: #00FF88;
      font-size: 0.9rem;
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

    .achievements-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 1rem;
      max-width: 900px;
      margin: 0 auto;
    }

    .achievement-card {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      border-radius: 10px;
      border: 2px solid #333;
      transition: all 0.2s;
    }

    .achievement-card.unlocked {
      background: rgba(0, 255, 136, 0.08);
      border-color: #00FF88;
    }

    .achievement-card.locked {
      background: rgba(50, 50, 80, 0.4);
      border-color: #333;
      opacity: 0.6;
    }

    .icon {
      font-size: 2rem;
      min-width: 50px;
      text-align: center;
    }

    .info h3 {
      font-size: 0.85rem;
      margin: 0 0 0.3rem 0;
      color: #FFFFFF;
    }

    .info p {
      font-size: 0.65rem;
      margin: 0;
      color: #AAAAAA;
    }

    .info small {
      font-size: 0.55rem;
      color: #666;
    }

    .locked .info h3 {
      color: #666;
    }
  `]
})
export class AchievementsComponent implements OnInit {
  achievements: Achievement[] = [];
  unlockedCount = 0;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loadAchievements();
  }

  goBack(): void {
    this.router.navigate(['/']);
  }

  formatDate(dateStr: string): string {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString();
    } catch {
      return '';
    }
  }

  private loadAchievements(): void {
    try {
      const saved = localStorage.getItem('michi-achievements');
      if (saved) {
        this.achievements = JSON.parse(saved);
      } else {
        // Defaults si no hay datos guardados
        this.achievements = [
          { id: 'first-push', name: 'Primer Push', description: 'Completa tu primer push exitoso', icon: '🚀', unlocked: false },
          { id: 'no-break-prod', name: 'Sin romper producción', description: 'Completa un nivel sin errores', icon: '🏆', unlocked: false },
          { id: 'hundred-coffees', name: 'Cien cafés', description: 'Bebe 100 cafés', icon: '☕', unlocked: false },
          { id: 'survive-monday', name: 'Sobreviviste al lunes', description: 'Completa el día 1', icon: '📅', unlocked: false },
          { id: 'no-cry', name: 'Sin llorar', description: 'Completa sin perder toda la energía', icon: '💪', unlocked: false },
          { id: 'first-merge', name: 'Primer Merge', description: 'Completa tu primer merge exitoso', icon: '🤝', unlocked: false },
          { id: 'qa-first-try', name: 'QA aprobó a la primera', description: 'Legendario: sin bugs', icon: '✨', unlocked: false },
          { id: 'friday-deploy', name: 'Producción un viernes', description: 'Imposible: deploy un viernes', icon: '🔥', unlocked: false },
          { id: 'karen-survivor', name: 'Sobreviviste a Karen', description: 'Karenómetro > 80% y no morir', icon: '👩', unlocked: false },
          { id: 'speed-run', name: 'Speed Run', description: 'Completa un día en menos de 5 min reales', icon: '⚡', unlocked: false },
          { id: 'coffee-addict', name: 'Adicto al café', description: '10 cafés en un solo día', icon: '🫠', unlocked: false },
          { id: 'zen-master', name: 'Maestro Zen', description: 'Mantén estrés < 20 por 3 minutos', icon: '🧘', unlocked: false },
          { id: 'git-master', name: 'Git Master', description: 'Completa todos los minijuegos de Git', icon: '🎓', unlocked: false },
          { id: 'all-skins', name: 'Fashionista', description: 'Desbloquea todas las skins', icon: '👔', unlocked: false },
        ];
      }
      this.unlockedCount = this.achievements.filter(a => a.unlocked).length;
    } catch {
      this.achievements = [];
    }
  }
}
