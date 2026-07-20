import * as Phaser from 'phaser';

/**
 * Sistema de logros.
 * Rastrea las acciones del jugador y desbloquea logros con notificaciones visuales.
 */

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
}

const ALL_ACHIEVEMENTS: Achievement[] = [
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

export class AchievementsSystem {
  private scene: Phaser.Scene | null = null;
  private achievements: Achievement[] = [];
  private stats = {
    coffeesTotal: 0,
    coffeesToday: 0,
    pushes: 0,
    merges: 0,
    daysCompleted: 0,
    minigamesCompleted: 0,
    minigamesPerfect: 0,
    lowStressTime: 0,
  };

  constructor() {
    this.achievements = ALL_ACHIEVEMENTS.map(a => ({ ...a }));
    this.loadFromStorage();
  }

  setScene(scene: Phaser.Scene): void {
    this.scene = scene;
  }

  // === Tracking Events ===

  trackCoffee(): void {
    this.stats.coffeesTotal++;
    this.stats.coffeesToday++;
    if (this.stats.coffeesTotal >= 100) this.unlock('hundred-coffees');
    if (this.stats.coffeesToday >= 10) this.unlock('coffee-addict');
  }

  trackPush(): void {
    this.stats.pushes++;
    if (this.stats.pushes === 1) this.unlock('first-push');
  }

  trackMerge(): void {
    this.stats.merges++;
    if (this.stats.merges === 1) this.unlock('first-merge');
  }

  trackDayComplete(karenometerMax: number, energyMin: number): void {
    this.stats.daysCompleted++;
    if (this.stats.daysCompleted === 1) this.unlock('survive-monday');
    if (energyMin > 0) this.unlock('no-cry');
    if (karenometerMax > 80) this.unlock('karen-survivor');
  }

  trackMinigameComplete(perfect: boolean, type: string): void {
    this.stats.minigamesCompleted++;
    if (perfect) {
      this.stats.minigamesPerfect++;
      this.unlock('no-break-prod');
      if (type === 'qa') this.unlock('qa-first-try');
    }
  }

  trackLowStress(deltaMs: number): void {
    this.stats.lowStressTime += deltaMs;
    if (this.stats.lowStressTime >= 180000) this.unlock('zen-master');
  }

  resetLowStress(): void {
    this.stats.lowStressTime = 0;
  }

  trackAllMinigames(completed: string[]): void {
    const required = ['git-basic', 'git-staging', 'git-branches', 'git-merge', 'git-conflict'];
    if (required.every(r => completed.includes(r))) {
      this.unlock('git-master');
    }
  }

  trackSpeedRun(realSeconds: number): void {
    if (realSeconds < 300) this.unlock('speed-run');
  }

  trackFridayDeploy(): void {
    this.unlock('friday-deploy');
  }

  trackAllSkins(total: number, unlocked: number): void {
    if (unlocked >= total) this.unlock('all-skins');
  }

  resetDaily(): void {
    this.stats.coffeesToday = 0;
    this.stats.lowStressTime = 0;
  }

  // === Core ===

  private unlock(id: string): void {
    const achievement = this.achievements.find(a => a.id === id);
    if (!achievement || achievement.unlocked) return;

    achievement.unlocked = true;
    achievement.unlockedAt = new Date().toISOString();
    this.saveToStorage();
    this.showNotification(achievement);
  }

  private showNotification(achievement: Achievement): void {
    if (!this.scene) return;

    const x = 400;
    const y = 50;

    const container = this.scene.add.container(x, y - 50);
    container.setDepth(2000);

    const bg = this.scene.add.rectangle(0, 0, 260, 50, 0x222244, 0.95);
    bg.setStrokeStyle(2, 0xFFD700);

    const icon = this.scene.add.text(-110, 0, achievement.icon, { fontSize: '20px' }).setOrigin(0.5);
    const title = this.scene.add.text(-80, -10, '🏆 Logro desbloqueado!', {
      fontSize: '9px', color: '#FFD700'
    });
    const name = this.scene.add.text(-80, 5, achievement.name, {
      fontSize: '11px', color: '#FFFFFF', fontStyle: 'bold'
    });

    container.add([bg, icon, title, name]);

    // Animación entrada
    this.scene.tweens.add({
      targets: container,
      y: y,
      duration: 500,
      ease: 'Back.easeOut'
    });

    // Salida después de 3s
    this.scene.time.delayedCall(3000, () => {
      this.scene!.tweens.add({
        targets: container,
        y: y - 60,
        alpha: 0,
        duration: 400,
        onComplete: () => container.destroy()
      });
    });
  }

  getAchievements(): Achievement[] {
    return this.achievements;
  }

  getUnlockedCount(): number {
    return this.achievements.filter(a => a.unlocked).length;
  }

  private saveToStorage(): void {
    try {
      localStorage.setItem('michi-achievements', JSON.stringify(this.achievements));
      localStorage.setItem('michi-achievement-stats', JSON.stringify(this.stats));
    } catch { /* silent */ }
  }

  private loadFromStorage(): void {
    try {
      const saved = localStorage.getItem('michi-achievements');
      if (saved) {
        const parsed = JSON.parse(saved) as Achievement[];
        parsed.forEach(saved => {
          const existing = this.achievements.find(a => a.id === saved.id);
          if (existing) {
            existing.unlocked = saved.unlocked;
            existing.unlockedAt = saved.unlockedAt;
          }
        });
      }
      const stats = localStorage.getItem('michi-achievement-stats');
      if (stats) {
        this.stats = { ...this.stats, ...JSON.parse(stats) };
      }
    } catch { /* silent */ }
  }
}
