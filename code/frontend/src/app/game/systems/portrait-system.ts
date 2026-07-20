/**
 * Sistema de retratos emocionales de Michi.
 * Calcula la emoción correcta basada en el estado actual del juego.
 * No renderiza directamente - devuelve la emoción para que el HUD la muestre.
 */

export type MichiEmotion =
  | 'happy' | 'tired' | 'sleeping' | 'angry'
  | 'stressed' | 'surprised' | 'confused' | 'proud'
  | 'scared' | 'thinking' | 'crying' | 'desperate' | 'eating';

interface GameStats {
  energy: number;
  coffee: number;
  hunger: number;
  sleep: number;
  focus: number;
  stress: number;
  karenometer: number;
}

export class PortraitSystem {
  private currentEmotion: MichiEmotion = 'happy';
  private tempEmotion: MichiEmotion | null = null;
  private tempTimeout: ReturnType<typeof setTimeout> | null = null;

  /**
   * Establece una emoción temporal que durará unos segundos.
   */
  setTemporaryEmotion(emotion: MichiEmotion, duration: number = 3000): void {
    this.tempEmotion = emotion;

    if (this.tempTimeout) {
      clearTimeout(this.tempTimeout);
    }

    this.tempTimeout = setTimeout(() => {
      this.tempEmotion = null;
      this.tempTimeout = null;
    }, duration);
  }

  /**
   * Calcula y retorna la emoción actual basada en stats.
   * La emoción temporal tiene prioridad.
   */
  getEmotion(stats: GameStats): MichiEmotion {
    if (this.tempEmotion) {
      return this.tempEmotion;
    }

    const emotion = this.calculateEmotion(stats);
    this.currentEmotion = emotion;
    return emotion;
  }

  getCurrentEmotion(): MichiEmotion {
    return this.tempEmotion || this.currentEmotion;
  }

  private calculateEmotion(stats: GameStats): MichiEmotion {
    // Prioridad 1: Estados críticos
    if (stats.stress > 85 && stats.energy < 25) return 'desperate';
    if (stats.energy < 15) return 'crying';
    if (stats.stress > 80) return 'angry';

    // Prioridad 2: Estados de alerta
    if (stats.karenometer > 70) return 'stressed';
    if (stats.sleep > 75) return 'sleeping';
    if (stats.stress > 60) return 'scared';

    // Prioridad 3: Estados medios
    if (stats.coffee < 20 && stats.energy < 50) return 'tired';
    if (stats.hunger > 70) return 'eating';
    if (stats.focus > 80 && stats.stress < 30) return 'thinking';

    // Prioridad 4: Estado bueno
    if (stats.energy > 70 && stats.stress < 25) return 'happy';
    if (stats.energy > 50 && stats.stress < 40) return 'proud';

    return 'tired';
  }

  destroy(): void {
    if (this.tempTimeout) {
      clearTimeout(this.tempTimeout);
    }
  }
}
