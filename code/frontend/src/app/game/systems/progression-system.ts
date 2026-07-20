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
    id: 5, name: 'Viernes - Deploy', description: 'Karen quiere deploy HOY.',
    unlocked: false, completed: false, stars: 0,
    minigames: ['git-basic', 'git-staging', 'git-branches', 'git-merge', 'git-conflict'],
    karenIntensity: 10, eventFrequency: 8, timeSpeed: 1.5
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
