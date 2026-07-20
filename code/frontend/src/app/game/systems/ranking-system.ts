/**
 * Sistema de ranking online.
 * Se conecta al backend para enviar y consultar scores.
 * Funciona offline con scores locales y sincroniza cuando hay conexión.
 */

export interface RankingEntry {
  playerName: string;
  score: number;
  level: number;
  timestamp: string;
  rank?: number;
}

export class RankingSystem {
  private apiUrl: string;
  private localScores: RankingEntry[] = [];

  constructor(apiUrl: string = '/api/rankings') {
    this.apiUrl = apiUrl;
    this.loadLocal();
  }

  /**
   * Envía un score al servidor. Si falla, lo guarda localmente.
   */
  async submitScore(playerName: string, score: number, level: number): Promise<boolean> {
    const entry: RankingEntry = {
      playerName,
      score,
      level,
      timestamp: new Date().toISOString()
    };

    // Guardar localmente siempre
    this.localScores.push(entry);
    this.localScores.sort((a, b) => b.score - a.score);
    if (this.localScores.length > 100) this.localScores = this.localScores.slice(0, 100);
    this.saveLocal();

    // Intentar enviar al servidor
    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entry)
      });
      return response.ok;
    } catch {
      // Sin conexión, se queda en local
      return false;
    }
  }

  /**
   * Obtiene el ranking global del servidor.
   * Si falla, retorna el ranking local.
   */
  async getRankings(limit: number = 50): Promise<RankingEntry[]> {
    try {
      const response = await fetch(`${this.apiUrl}?limit=${limit}`);
      if (response.ok) {
        const data = await response.json();
        return data.map((entry: RankingEntry, i: number) => ({ ...entry, rank: i + 1 }));
      }
    } catch {
      // Sin conexión
    }

    // Fallback: ranking local
    return this.localScores.slice(0, limit).map((entry, i) => ({ ...entry, rank: i + 1 }));
  }

  /**
   * Obtiene la posición del jugador en el ranking.
   */
  async getPlayerRank(playerName: string): Promise<number | null> {
    const rankings = await this.getRankings(100);
    const index = rankings.findIndex(r => r.playerName === playerName);
    return index >= 0 ? index + 1 : null;
  }

  /**
   * Retorna el mejor score local del jugador.
   */
  getBestLocalScore(): number {
    return this.localScores.length > 0 ? this.localScores[0].score : 0;
  }

  /**
   * Sincroniza scores locales pendientes con el servidor.
   */
  async syncPending(): Promise<number> {
    let synced = 0;
    for (const entry of this.localScores) {
      try {
        const response = await fetch(this.apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(entry)
        });
        if (response.ok) synced++;
      } catch {
        break; // Si falla uno, no seguir
      }
    }
    return synced;
  }

  private saveLocal(): void {
    try {
      localStorage.setItem('michi-rankings', JSON.stringify(this.localScores));
    } catch { /* silent */ }
  }

  private loadLocal(): void {
    try {
      const saved = localStorage.getItem('michi-rankings');
      if (saved) this.localScores = JSON.parse(saved);
    } catch { /* silent */ }
  }
}
