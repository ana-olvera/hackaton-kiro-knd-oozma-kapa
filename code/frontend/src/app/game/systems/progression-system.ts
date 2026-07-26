/**
 * Sistema de progresión.
 * Gestiona niveles desbloqueados, días completados y dificultad progresiva.
 */

export interface LevelConfig {
  id: number;
  name: string;
  description: string;
  unlocked: boolean;
  completed: boolean;
  stars: number; // 0-3
  minigames: string[]; // Minijuegos disponibles en este nivel
  karenIntensity: number; // 1-10
  eventFrequency: number; // 1-10
  timeSpeed: number; // Multiplicador de velocidad del tiempo
}

const LEVELS: LevelConfig[] = [
  // === Semana 1 ===
  {
    id: 1, name: 'Lunes - El Comienzo', description: 'Tu primer día. Sobrevive.',
    unlocked: true, completed: false, stars: 0,
    minigames: ['git-basic'],
    karenIntensity: 3, eventFrequency: 2, timeSpeed: 1
  },
  {
    id: 2, name: 'Martes - Staging Area', description: 'Karen quiere más features.',
    unlocked: false, completed: false, stars: 0,
    minigames: ['git-basic', 'git-staging'],
    karenIntensity: 4, eventFrequency: 3, timeSpeed: 1.1
  },
  {
    id: 3, name: 'Miércoles - Branches', description: 'Múltiples ramas, múltiples problemas.',
    unlocked: false, completed: false, stars: 0,
    minigames: ['git-basic', 'git-staging', 'git-branches'],
    karenIntensity: 5, eventFrequency: 4, timeSpeed: 1.2
  },
  {
    id: 4, name: 'Jueves - Merge Day', description: 'Hoy toca integrar. Reza.',
    unlocked: false, completed: false, stars: 0,
    minigames: ['git-basic', 'git-staging', 'git-branches', 'git-merge'],
    karenIntensity: 7, eventFrequency: 5, timeSpeed: 1.3
  },
  {
    id: 5, name: 'Viernes - Conflictos', description: 'Todo explota. Resuelve conflictos.',
    unlocked: false, completed: false, stars: 0,
    minigames: ['git-basic', 'git-staging', 'git-branches', 'git-merge', 'git-conflict'],
    karenIntensity: 8, eventFrequency: 6, timeSpeed: 1.4
  },
  // === Semana 2 ===
  {
    id: 6, name: 'Lunes S2 - Integración', description: 'Workflow completo de inicio a fin.',
    unlocked: false, completed: false, stars: 0,
    minigames: ['git-basic', 'git-staging', 'git-branches', 'git-merge', 'git-conflict', 'git-workflow'],
    karenIntensity: 6, eventFrequency: 5, timeSpeed: 1.2
  },
  {
    id: 7, name: 'Martes S2 - Cherry Pick', description: 'Elige commits con precisión quirúrgica.',
    unlocked: false, completed: false, stars: 0,
    minigames: ['git-basic', 'git-staging', 'git-branches', 'git-merge', 'git-conflict', 'git-workflow', 'git-cherry-pick'],
    karenIntensity: 7, eventFrequency: 6, timeSpeed: 1.3
  },
  {
    id: 8, name: 'Miércoles S2 - Rebase', description: 'Reorganiza la historia. Sin romper nada.',
    unlocked: false, completed: false, stars: 0,
    minigames: ['git-basic', 'git-staging', 'git-branches', 'git-merge', 'git-conflict', 'git-workflow', 'git-cherry-pick', 'git-rebase'],
    karenIntensity: 8, eventFrequency: 7, timeSpeed: 1.4
  },
  {
    id: 9, name: 'Jueves S2 - Release', description: 'Prepara el release. Todo debe estar perfecto.',
    unlocked: false, completed: false, stars: 0,
    minigames: ['git-basic', 'git-staging', 'git-branches', 'git-merge', 'git-conflict', 'git-workflow', 'git-cherry-pick', 'git-rebase', 'git-release'],
    karenIntensity: 9, eventFrequency: 8, timeSpeed: 1.5
  },
  {
    id: 10, name: 'Viernes S2 - Karen Final Boss', description: 'Deploy a producción. Karen al máximo.',
    unlocked: false, completed: false, stars: 0,
    minigames: ['git-basic', 'git-staging', 'git-branches', 'git-merge', 'git-conflict', 'git-workflow', 'git-cherry-pick', 'git-rebase', 'git-release'],
    karenIntensity: 10, eventFrequency: 10, timeSpeed: 2.0
  },
];

export class ProgressionSystem {
  private levels: LevelConfig[] = [];
  private currentLevel = 1;
  private totalScore = 0;

  constructor() {
    this.levels = LEVELS.map(l => ({ ...l }));
    this.loadFromStorage();
  }

  getCurrentLevel(): LevelConfig {
    return this.levels.find(l => l.id === this.currentLevel) || this.levels[0];
  }

  getLevels(): LevelConfig[] {
    return this.levels;
  }

  setCurrentLevel(levelId: number): boolean {
    const level = this.levels.find(l => l.id === levelId);
    if (!level || !level.unlocked) return false;
    this.currentLevel = levelId;
    return true;
  }

  completeLevel(score: number, energyRemaining: number): { stars: number; unlockedNext: boolean } {
    const level = this.getCurrentLevel();
    level.completed = true;

    // Calcular estrellas
    let stars = 1; // Completar = 1 estrella
    if (energyRemaining > 30) stars = 2;
    if (energyRemaining > 60 && score > 500) stars = 3;

    level.stars = Math.max(level.stars, stars);
    this.totalScore += score;

    // Desbloquear siguiente nivel
    let unlockedNext = false;
    const nextLevel = this.levels.find(l => l.id === level.id + 1);
    if (nextLevel && !nextLevel.unlocked) {
      nextLevel.unlocked = true;
      unlockedNext = true;
    }

    // Avanzar al siguiente nivel automáticamente
    if (nextLevel) {
      this.currentLevel = nextLevel.id;
    }

    this.saveToStorage();
    return { stars, unlockedNext };
  }

  getAvailableMinigames(): string[] {
    return this.getCurrentLevel().minigames;
  }

  getDifficulty(): { karenIntensity: number; eventFrequency: number; timeSpeed: number } {
    const level = this.getCurrentLevel();
    return {
      karenIntensity: level.karenIntensity,
      eventFrequency: level.eventFrequency,
      timeSpeed: level.timeSpeed
    };
  }

  getTotalScore(): number {
    return this.totalScore;
  }

  getCompletedCount(): number {
    return this.levels.filter(l => l.completed).length;
  }

  private saveToStorage(): void {
    try {
      localStorage.setItem('michi-progression', JSON.stringify({
        levels: this.levels,
        currentLevel: this.currentLevel,
        totalScore: this.totalScore
      }));
    } catch { /* silent */ }
  }

  private loadFromStorage(): void {
    try {
      const saved = localStorage.getItem('michi-progression');
      if (saved) {
        const data = JSON.parse(saved);
        if (data.levels) {
          data.levels.forEach((saved: LevelConfig) => {
            const existing = this.levels.find(l => l.id === saved.id);
            if (existing) {
              existing.unlocked = saved.unlocked;
              existing.completed = saved.completed;
              existing.stars = saved.stars;
            }
          });
        }
        if (data.currentLevel) this.currentLevel = data.currentLevel;
        if (data.totalScore) this.totalScore = data.totalScore;
      }
    } catch { /* silent */ }
  }
}
