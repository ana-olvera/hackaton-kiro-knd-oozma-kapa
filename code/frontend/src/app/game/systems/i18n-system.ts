/**
 * Sistema de localización ES/EN.
 * Maneja traducciones de toda la UI del juego.
 */

export type Locale = 'es' | 'en';

const TRANSLATIONS: Record<Locale, Record<string, string>> = {
  es: {
    // Menú
    'menu.title': 'Ayuda a Michi Godín',
    'menu.subtitle': 'Sobrevive al Sprint',
    'menu.play': '▶ EMPEZAR LUNES',
    'menu.settings': '⚙ Configuración',
    'menu.achievements': '🏆 Logros',
    'menu.skins': '👔 Skins',
    'menu.rankings': '🏅 Rankings',
    'menu.controls.move': 'Flechas: Mover a Michi',
    'menu.controls.interact': 'E: Interactuar',
    'menu.controls.computer': 'Computadoras: Minijuegos de Git',
    'menu.controls.coffee': 'Cafetera: +Café +Energía',

    // HUD
    'hud.energy': 'Energía',
    'hud.coffee': 'Café',
    'hud.hunger': 'Hambre',
    'hud.sleep': 'Sueño',
    'hud.focus': 'Concentr.',
    'hud.stress': 'Estrés',
    'hud.karen': 'Karen',
    'hud.controls': 'Flechas: mover | E: interactuar',

    // Emociones
    'emotion.happy': 'Feliz',
    'emotion.tired': 'Cansado',
    'emotion.sleeping': 'Dormido',
    'emotion.angry': 'Furioso',
    'emotion.stressed': 'Estresado',
    'emotion.surprised': 'Sorprendido',
    'emotion.confused': 'Confundido',
    'emotion.proud': 'Orgulloso',
    'emotion.scared': 'Asustado',
    'emotion.thinking': 'Pensando',
    'emotion.crying': 'Llorando',
    'emotion.desperate': 'Desesperado',
    'emotion.eating': 'Comiendo',

    // Juego
    'game.day_end': '¡Sobreviviste al Lunes!',
    'game.game_over': 'Michi renunció...',
    'game.reason': 'Razón',
    'game.score': 'Puntaje',
    'game.coffee_collected': '+Café',
    'game.interact_hint': 'Flechas: mover | E: interactuar (💻 minijuego | ☕ café)',

    // Minijuegos
    'minigame.git_basic.title': 'Git Challenge: Sube el cambio',
    'minigame.git_basic.instruction': 'Ejecuta los comandos en el orden correcto',
    'minigame.staging.title': 'Git Staging: Selecciona qué archivos subir',
    'minigame.staging.warning': 'NO subas archivos sensibles o innecesarios',
    'minigame.branches.title': 'Git Branches: Elige el branch correcto',
    'minigame.merge.title': 'Git Merge: ¿Aprobar o rechazar?',
    'minigame.conflict.title': 'Merge Conflict: Resuelve el conflicto',

    // Eventos
    'event.vpn_down': 'La VPN se cayó. No puedes hacer push.',
    'event.windows_update': 'Windows decidió actualizarse. Ahora.',
    'event.free_coffee': 'Alguien trajo café de la buena.',
    'event.birthday': '¡Hay pastel en la cocina!',
    'event.pizza': '¡Llegó la pizza!',

    // Certificado
    'cert.title': 'MICHI ACADEMY',
    'cert.certifies': 'CERTIFICA QUE',
    'cert.survived': 'ha sobrevivido exitosamente al',
    'cert.sprint': 'SPRINT GODÍN',
    'cert.skills': 'demostrando conocimientos en:',
    'cert.date': 'Fecha',
    'cert.download': 'Descargar Certificado',
    'cert.share': 'Compartir en LinkedIn',

    // General
    'general.back': 'Volver',
    'general.confirm': 'Confirmar',
    'general.cancel': 'Cancelar',
    'general.yes': 'Sí',
    'general.no': 'No',
  },

  en: {
    // Menu
    'menu.title': 'Help Michi Godín',
    'menu.subtitle': 'Survive the Sprint',
    'menu.play': '▶ START MONDAY',
    'menu.settings': '⚙ Settings',
    'menu.achievements': '🏆 Achievements',
    'menu.skins': '👔 Skins',
    'menu.rankings': '🏅 Rankings',
    'menu.controls.move': 'Arrows: Move Michi',
    'menu.controls.interact': 'E: Interact',
    'menu.controls.computer': 'Computers: Git Minigames',
    'menu.controls.coffee': 'Coffee Machine: +Coffee +Energy',

    // HUD
    'hud.energy': 'Energy',
    'hud.coffee': 'Coffee',
    'hud.hunger': 'Hunger',
    'hud.sleep': 'Sleep',
    'hud.focus': 'Focus',
    'hud.stress': 'Stress',
    'hud.karen': 'Karen',
    'hud.controls': 'Arrows: move | E: interact',

    // Emotions
    'emotion.happy': 'Happy',
    'emotion.tired': 'Tired',
    'emotion.sleeping': 'Sleeping',
    'emotion.angry': 'Angry',
    'emotion.stressed': 'Stressed',
    'emotion.surprised': 'Surprised',
    'emotion.confused': 'Confused',
    'emotion.proud': 'Proud',
    'emotion.scared': 'Scared',
    'emotion.thinking': 'Thinking',
    'emotion.crying': 'Crying',
    'emotion.desperate': 'Desperate',
    'emotion.eating': 'Eating',

    // Game
    'game.day_end': 'You survived Monday!',
    'game.game_over': 'Michi quit...',
    'game.reason': 'Reason',
    'game.score': 'Score',
    'game.coffee_collected': '+Coffee',
    'game.interact_hint': 'Arrows: move | E: interact (💻 minigame | ☕ coffee)',

    // Minigames
    'minigame.git_basic.title': 'Git Challenge: Push the change',
    'minigame.git_basic.instruction': 'Execute commands in the correct order',
    'minigame.staging.title': 'Git Staging: Select files to stage',
    'minigame.staging.warning': "DON'T stage sensitive or unnecessary files",
    'minigame.branches.title': 'Git Branches: Choose the right branch',
    'minigame.merge.title': 'Git Merge: Approve or reject?',
    'minigame.conflict.title': 'Merge Conflict: Resolve the conflict',

    // Events
    'event.vpn_down': "VPN is down. You can't push.",
    'event.windows_update': 'Windows decided to update. Now.',
    'event.free_coffee': 'Someone brought good coffee.',
    'event.birthday': "There's cake in the kitchen!",
    'event.pizza': 'Pizza arrived!',

    // Certificate
    'cert.title': 'MICHI ACADEMY',
    'cert.certifies': 'CERTIFIES THAT',
    'cert.survived': 'has successfully survived the',
    'cert.sprint': 'GODÍN SPRINT',
    'cert.skills': 'demonstrating skills in:',
    'cert.date': 'Date',
    'cert.download': 'Download Certificate',
    'cert.share': 'Share on LinkedIn',

    // General
    'general.back': 'Back',
    'general.confirm': 'Confirm',
    'general.cancel': 'Cancel',
    'general.yes': 'Yes',
    'general.no': 'No',
  }
};

export class I18nSystem {
  private currentLocale: Locale = 'es';

  constructor() {
    this.loadLocale();
  }

  /**
   * Obtiene la traducción de una clave.
   */
  t(key: string, params?: Record<string, string>): string {
    let text = TRANSLATIONS[this.currentLocale][key] || TRANSLATIONS['es'][key] || key;

    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        text = text.replace(`{${k}}`, v);
      });
    }

    return text;
  }

  /**
   * Cambia el idioma.
   */
  setLocale(locale: Locale): void {
    this.currentLocale = locale;
    this.saveLocale();
  }

  getLocale(): Locale {
    return this.currentLocale;
  }

  toggleLocale(): Locale {
    this.currentLocale = this.currentLocale === 'es' ? 'en' : 'es';
    this.saveLocale();
    return this.currentLocale;
  }

  getAvailableLocales(): Locale[] {
    return ['es', 'en'];
  }

  private saveLocale(): void {
    try {
      localStorage.setItem('michi-locale', this.currentLocale);
    } catch { /* silent */ }
  }

  private loadLocale(): void {
    try {
      const saved = localStorage.getItem('michi-locale') as Locale | null;
      if (saved && (saved === 'es' || saved === 'en')) {
        this.currentLocale = saved;
      } else {
        // Detectar idioma del navegador
        const browserLang = navigator.language.slice(0, 2);
        this.currentLocale = browserLang === 'en' ? 'en' : 'es';
      }
    } catch {
      this.currentLocale = 'es';
    }
  }
}
