import * as Phaser from 'phaser';

/**
 * Sistema de Eventos Aleatorios de Becatín
 * 
 * Maneja los efectos que las acciones de Becatín tienen en las estadísticas del juego.
 * Funciona en paralelo con otros sistemas y aplica efectos inmediatos con notificaciones.
 */

export interface BecatinEventEffect {
  stress?: number;
  energy?: number;
  focus?: number;
  happiness?: number;
  karenometer?: number;
}

export interface BecatinEvent {
  id: string;
  title: string;
  message: string;
  effects: BecatinEventEffect;
  isPositive: boolean;
  priority: 'low' | 'medium' | 'high';  // Para determinar si interrumpe otros eventos
}

interface BecatinEventCategory {
  id: string;
  name: string;
  description: string;
  events: BecatinEvent[];
}

export class BecatinEventsSystem {
  private scene: Phaser.Scene;
  private eventCategories: BecatinEventCategory[] = [];
  private onEventCallback: ((event: BecatinEvent) => void) | null = null;
  private lastEventTime: number = 0;
  private eventHistory: string[] = []; // Para evitar repetir eventos muy seguido

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.initializeEventCategories();
    this.lastEventTime = scene.time.now;
  }

  /**
   * Inicializa todas las categorías de eventos de Becatín
   */
  private initializeEventCategories(): void {
    this.eventCategories = [
      {
        id: 'helpful_success',
        name: 'Éxitos Útiles',
        description: 'Cuando Becatín logra ayudar efectivamente',
        events: [
          {
            id: 'bug_fix',
            title: 'Bug Arreglado',
            message: 'Becatín encontró y arregló un bug que llevaba días molestando',
            effects: { focus: 8, happiness: 5, stress: -3 },
            isPositive: true,
            priority: 'medium'
          },
          {
            id: 'optimization',
            title: 'Optimización',
            message: 'Becatín optimizó una consulta que ahora es 50% más rápida',
            effects: { energy: 5, focus: 6, happiness: 4 },
            isPositive: true,
            priority: 'medium'
          },
          {
            id: 'documentation',
            title: 'Documentación',
            message: 'Becatín documentó el código confuso que nadie entendía',
            effects: { focus: 10, happiness: 6, stress: -2 },
            isPositive: true,
            priority: 'low'
          },
          {
            id: 'good_research',
            title: 'Investigación Exitosa',
            message: 'Becatín encontró la librería perfecta que nos ahorrará días de trabajo',
            effects: { happiness: 8, focus: 12, energy: 3 },
            isPositive: true,
            priority: 'high'
          }
        ]
      },
      {
        id: 'minor_mistakes',
        name: 'Errores Menores',
        description: 'Pequeños errores que son fáciles de corregir',
        events: [
          {
            id: 'wrong_branch',
            title: 'Rama Incorrecta',
            message: 'Becatín hizo commit en la rama equivocada... otra vez',
            effects: { stress: 5, focus: -2, energy: -1 },
            isPositive: false,
            priority: 'low'
          },
          {
            id: 'syntax_error',
            title: 'Error de Sintaxis',
            message: 'Becatín olvidó un punto y coma y tardó 30 minutos en encontrarlo',
            effects: { stress: 3, focus: -1 },
            isPositive: false,
            priority: 'low'
          },
          {
            id: 'missing_import',
            title: 'Import Faltante',
            message: 'Becatín: "¿Por qué dice que la función no existe?" (Falta el import)',
            effects: { stress: 4, focus: -2 },
            isPositive: false,
            priority: 'low'
          },
          {
            id: 'npm_issue',
            title: 'Problemas con NPM',
            message: 'Becatín borró node_modules sin hacer backup del package-lock.json',
            effects: { stress: 8, focus: -4, energy: -2 },
            isPositive: false,
            priority: 'medium'
          }
        ]
      },
      {
        id: 'major_incidents',
        name: 'Incidentes Mayores',
        description: 'Errores serios que requieren intervención inmediata',
        events: [
          {
            id: 'production_bug',
            title: '¡Bug en Producción!',
            message: 'Becatín: "¿Es normal que los usuarios no puedan hacer login?"',
            effects: { stress: 20, focus: -8, energy: -5, karenometer: 15 },
            isPositive: false,
            priority: 'high'
          },
          {
            id: 'database_drop',
            title: 'Base de Datos Afectada',
            message: 'Becatín ejecutó DROP TABLE en la BD equivocada... ¡era producción!',
            effects: { stress: 25, focus: -12, energy: -8, karenometer: 20 },
            isPositive: false,
            priority: 'high'
          },
          {
            id: 'force_push',
            title: 'Force Push Destructivo',
            message: 'Becatín: "¿Por qué desaparecieron todos los commits de la semana?"',
            effects: { stress: 18, focus: -10, energy: -6, karenometer: 12 },
            isPositive: false,
            priority: 'high'
          },
          {
            id: 'server_crash',
            title: 'Servidor Caído',
            message: 'Becatín reinició el servidor de producción "para que vaya más rápido"',
            effects: { stress: 22, focus: -9, energy: -7, karenometer: 18 },
            isPositive: false,
            priority: 'high'
          }
        ]
      },
      {
        id: 'learning_moments',
        name: 'Momentos de Aprendizaje',
        description: 'Cuando Becatín aprende algo nuevo (con consecuencias mixtas)',
        events: [
          {
            id: 'git_experiment',
            title: 'Experimento con Git',
            message: 'Becatín: "Descubrí git reset --hard... ¿qué hace exactamente?"',
            effects: { stress: 12, focus: -6, happiness: 2 },
            isPositive: false,
            priority: 'medium'
          },
          {
            id: 'new_framework',
            title: 'Framework Nuevo',
            message: 'Becatín quiere reescribir todo el proyecto en el framework que encontró',
            effects: { stress: 8, focus: -3, happiness: 6, energy: -2 },
            isPositive: false,
            priority: 'medium'
          },
          {
            id: 'stack_overflow',
            title: 'Stack Overflow Discovery',
            message: 'Becatín copió código de Stack Overflow sin leer lo que hace',
            effects: { stress: 6, focus: -4, happiness: 3 },
            isPositive: false,
            priority: 'low'
          },
          {
            id: 'chatgpt_question',
            title: 'Consulta a ChatGPT',
            message: 'Becatín le preguntó a ChatGPT cómo hackear la NASA (para el proyecto)',
            effects: { stress: 4, happiness: 4, focus: -1 },
            isPositive: false,
            priority: 'low'
          }
        ]
      },
      {
        id: 'team_interactions',
        name: 'Interacciones del Equipo',
        description: 'Cuando Becatín interactúa con otros miembros del equipo',
        events: [
          {
            id: 'helpful_question',
            title: 'Pregunta Útil',
            message: 'Becatín hizo una pregunta que ayudó a encontrar un bug crítico',
            effects: { happiness: 7, focus: 5, stress: -2 },
            isPositive: true,
            priority: 'medium'
          },
          {
            id: 'endless_questions',
            title: 'Preguntas Infinitas',
            message: 'Becatín lleva 2 horas preguntando "¿y esto por qué?" a todo',
            effects: { stress: 10, focus: -6, energy: -3 },
            isPositive: false,
            priority: 'medium'
          },
          {
            id: 'code_review',
            title: 'Code Review Entusiasta',
            message: 'Becatín comentó 47 cosas en el PR... 44 eran espacios en blanco',
            effects: { stress: 6, focus: -2, happiness: 2 },
            isPositive: false,
            priority: 'low'
          },
          {
            id: 'coffee_break',
            title: 'Break de Café',
            message: 'Becatín trajo café para todo el equipo después de romper algo',
            effects: { happiness: 8, energy: 4, stress: -3 },
            isPositive: true,
            priority: 'low'
          }
        ]
      }
    ];

    console.log('[BecatinEventsSystem] Categorías de eventos inicializadas:', this.eventCategories.length);
  }

  /**
   * Establece el callback para cuando ocurre un evento
   */
  setEventCallback(callback: (event: BecatinEvent) => void): void {
    this.onEventCallback = callback;
  }

  /**
   * Procesa una acción de Becatín y determina si genera un evento
   */
  processAction(actionId: string, wasSuccessful: boolean, effects: BecatinEventEffect): void {
    // Mapear acciones del NPC a categorías de eventos
    const categoryMap: Record<string, string> = {
      'helpful_commit': wasSuccessful ? 'helpful_success' : 'minor_mistakes',
      'database_query': wasSuccessful ? 'helpful_success' : 'major_incidents',
      'deploy_attempt': wasSuccessful ? 'helpful_success' : 'major_incidents',
      'helpful_research': wasSuccessful ? 'learning_moments' : 'minor_mistakes',
      'accidental_mistake': 'minor_mistakes'
    };

    const categoryId = categoryMap[actionId];
    if (!categoryId) return;

    // Encontrar categoría y seleccionar evento
    const category = this.eventCategories.find(cat => cat.id === categoryId);
    if (!category || category.events.length === 0) return;

    // Filtrar eventos que no hayan ocurrido recientemente
    const availableEvents = category.events.filter(event => 
      !this.eventHistory.includes(event.id) || this.eventHistory.length > 10
    );

    if (availableEvents.length === 0) return;

    // Seleccionar evento aleatorio
    const selectedEvent = availableEvents[Math.floor(Math.random() * availableEvents.length)];

    // Agregar al historial
    this.eventHistory.push(selectedEvent.id);
    if (this.eventHistory.length > 15) {
      this.eventHistory.shift(); // Mantener solo los últimos 15
    }

    // Disparar evento
    this.triggerEvent(selectedEvent);
  }

  /**
   * Genera un evento aleatorio basado en el comportamiento general de Becatín
   */
  generateRandomEvent(): void {
    const currentTime = this.scene.time.now;
    
    // No generar eventos muy seguidos
    if (currentTime - this.lastEventTime < 30000) return; // 30 segundos mínimo

    // Probabilidades por categoría
    const categoryProbabilities = {
      'helpful_success': 0.25,
      'minor_mistakes': 0.35,
      'major_incidents': 0.1,
      'learning_moments': 0.2,
      'team_interactions': 0.15
    };

    // Seleccionar categoría basada en probabilidades
    const randomValue = Math.random();
    let cumulativeProbability = 0;
    let selectedCategoryId: string | null = null;

    for (const [categoryId, probability] of Object.entries(categoryProbabilities)) {
      cumulativeProbability += probability;
      if (randomValue <= cumulativeProbability) {
        selectedCategoryId = categoryId;
        break;
      }
    }

    if (!selectedCategoryId) return;

    // Encontrar la categoría y seleccionar evento
    const category = this.eventCategories.find(cat => cat.id === selectedCategoryId);
    if (!category || category.events.length === 0) return;

    const selectedEvent = category.events[Math.floor(Math.random() * category.events.length)];
    
    this.triggerEvent(selectedEvent);
  }

  /**
   * Dispara un evento específico
   */
  private triggerEvent(event: BecatinEvent): void {
    this.lastEventTime = this.scene.time.now;

    console.log(`[BecatinEventsSystem] Evento disparado: ${event.title}`, event);

    // Notificar a la escena
    if (this.onEventCallback) {
      this.onEventCallback(event);
    }
  }

  /**
   * Obtiene estadísticas de eventos para debugging
   */
  getEventStats(): { totalEvents: number; categoriesCount: number; recentEvents: string[] } {
    const totalEvents = this.eventCategories.reduce((sum, cat) => sum + cat.events.length, 0);
    return {
      totalEvents,
      categoriesCount: this.eventCategories.length,
      recentEvents: [...this.eventHistory].reverse().slice(0, 5)
    };
  }

  /**
   * Obtiene un evento por ID (útil para testing)
   */
  getEventById(eventId: string): BecatinEvent | null {
    for (const category of this.eventCategories) {
      const event = category.events.find(e => e.id === eventId);
      if (event) return event;
    }
    return null;
  }

  /**
   * Limpia el historial de eventos (útil para testing)
   */
  clearHistory(): void {
    this.eventHistory = [];
    this.lastEventTime = 0;
  }

  /**
   * Fuerza un evento específico (útil para testing)
   */
  forceEvent(eventId: string): boolean {
    const event = this.getEventById(eventId);
    if (!event) return false;
    
    this.triggerEvent(event);
    return true;
  }
}