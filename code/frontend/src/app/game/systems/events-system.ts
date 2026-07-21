import * as Phaser from 'phaser';

/**
 * Sistema de eventos aleatorios de la oficina.
 * Genera interrupciones humorísticas que afectan el gameplay.
 */

export interface OfficeEvent {
  id: string;
  name: string;
  icon: string;
  description: string;
  duration: number; // Duración del efecto en ms
  effects: EventEffect[];
  positive: boolean;
}

export interface EventEffect {
  stat: string;
  value: number;
}

const NEGATIVE_EVENTS: OfficeEvent[] = [
  {
    id: 'vpn-down', name: 'VPN caída', icon: '🔌',
    description: 'La VPN se cayó. No puedes hacer push.',
    duration: 15000,
    effects: [{ stat: 'stress', value: 10 }, { stat: 'focus', value: -15 }],
    positive: false
  },
  {
    id: 'windows-update', name: 'Windows Update', icon: '🔄',
    description: 'Windows decidió actualizarse. Ahora.',
    duration: 20000,
    effects: [{ stat: 'stress', value: 15 }, { stat: 'focus', value: -20 }],
    positive: false
  },
  {
    id: 'daily-meeting', name: 'Daily Meeting', icon: '📋',
    description: 'Todos quedan congelados 1 minuto.',
    duration: 10000,
    effects: [{ stat: 'focus', value: -10 }],
    positive: false
  },
  {
    id: 'email-flood', name: '25 correos nuevos', icon: '📧',
    description: 'Solo uno era importante.',
    duration: 5000,
    effects: [{ stat: 'stress', value: 8 }, { stat: 'focus', value: -5 }],
    positive: false
  },
  {
    id: 'internet-slow', name: 'Internet lento', icon: '🐌',
    description: 'Git tarda siglos.',
    duration: 12000,
    effects: [{ stat: 'stress', value: 7 }],
    positive: false
  },
  {
    id: 'reunion-correo', name: 'Reunión que pudo ser correo', icon: '🗣️',
    description: '"Solo 15 minutos." (Duró 45.)',
    duration: 15000,
    effects: [{ stat: 'stress', value: 10 }, { stat: 'energy', value: -10 }],
    positive: false
  },
  {
    id: 'prod-bug', name: 'Bug en producción', icon: '💀',
    description: '¡Algo se rompió en prod!',
    duration: 8000,
    effects: [{ stat: 'stress', value: 20 }, { stat: 'focus', value: -15 }],
    positive: false
  },
  {
    id: 'teams-call', name: 'Llamada sorpresa', icon: '📞',
    description: 'Karen te llamó sin previo aviso.',
    duration: 10000,
    effects: [{ stat: 'stress', value: 12 }, { stat: 'karenometer', value: 8 }],
    positive: false
  },
];

const POSITIVE_EVENTS: OfficeEvent[] = [
  {
    id: 'free-coffee', name: 'Café gratis', icon: '☕',
    description: 'Alguien trajo café de la buena.',
    duration: 3000,
    effects: [{ stat: 'coffee', value: 30 }, { stat: 'energy', value: 15 }],
    positive: true
  },
  {
    id: 'birthday-cake', name: 'Pastel de cumpleaños', icon: '🎂',
    description: '¡Hay pastel en la cocina!',
    duration: 3000,
    effects: [{ stat: 'energy', value: 10 }, { stat: 'stress', value: -10 }],
    positive: true
  },
  {
    id: 'pizza-friday', name: 'Viernes de pizza', icon: '🍕',
    description: '¡Llegó la pizza!',
    duration: 3000,
    effects: [{ stat: 'hunger', value: -40 }, { stat: 'energy', value: 20 }],
    positive: true
  },
  {
    id: 'early-friday', name: '"Hay ambiente laboral"', icon: '🎉',
    description: 'Viernes casual. Todos relajados.',
    duration: 5000,
    effects: [{ stat: 'stress', value: -15 }],
    positive: true
  },
  {
    id: 'pr-approved', name: 'PR aprobado a la primera', icon: '✅',
    description: '¡Sin comentarios! Imposible.',
    duration: 3000,
    effects: [{ stat: 'stress', value: -10 }, { stat: 'focus', value: 15 }],
    positive: true
  },
];

export class EventsSystem {
  private scene: Phaser.Scene;
  private timer: Phaser.Time.TimerEvent | null = null;
  private activeEvent: OfficeEvent | null = null;
  private eventContainer: Phaser.GameObjects.Container | null = null;
  private onEventCallback: ((event: OfficeEvent) => void) | null = null;
  private eventHistory: string[] = [];

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  start(onEvent: (event: OfficeEvent) => void): void {
    this.onEventCallback = onEvent;
    this.scheduleNext();
  }

  stop(): void {
    if (this.timer) {
      this.timer.destroy();
      this.timer = null;
    }
  }

  private scheduleNext(): void {
    // Evento cada 25-50 segundos
    const delay = 25000 + Math.random() * 25000;
    this.timer = this.scene.time.delayedCall(delay, () => {
      if (!this.activeEvent) {
        this.triggerRandomEvent();
      }
      this.scheduleNext();
    });
  }

  private triggerRandomEvent(): void {
    // 70% negativo, 30% positivo
    const isPositive = Math.random() < 0.3;
    const pool = isPositive ? POSITIVE_EVENTS : NEGATIVE_EVENTS;

    // Evitar repetir el último evento
    let event: OfficeEvent;
    do {
      event = pool[Math.floor(Math.random() * pool.length)];
    } while (this.eventHistory.length > 0 && this.eventHistory[this.eventHistory.length - 1] === event.id);

    this.eventHistory.push(event.id);
    if (this.eventHistory.length > 5) this.eventHistory.shift();

    this.activeEvent = event;
    this.showEventNotification(event);

    // Notificar para aplicar efectos
    if (this.onEventCallback) {
      this.onEventCallback(event);
    }

    // Limpiar después de la duración
    this.scene.time.delayedCall(event.duration, () => {
      this.activeEvent = null;
    });
  }

  private showEventNotification(event: OfficeEvent): void {
    // Bottom-center del viewport con zoom 2x
    const x = 200;
    const y = 280;

    this.eventContainer = this.scene.add.container(x, y + 20);
    this.eventContainer.setScrollFactor(0);
    this.eventContainer.setDepth(1800);

    const bgColor = event.positive ? 0x003300 : 0x330000;
    const borderColor = event.positive ? 0x00FF88 : 0xFF4444;

    const bg = this.scene.add.rectangle(0, 0, 150, 30, bgColor, 0.95);
    bg.setStrokeStyle(1, borderColor);

    const icon = this.scene.add.text(-65, -8, event.icon, { fontSize: '10px' });
    const title = this.scene.add.text(-48, -9, event.name, {
      fontSize: '7px',
      color: event.positive ? '#00FF88' : '#FF6666',
      fontStyle: 'bold'
    });
    const desc = this.scene.add.text(-65, 4, event.description, {
      fontSize: '6px',
      color: '#AAAAAA',
      wordWrap: { width: 130 }
    });

    this.eventContainer.add([bg, icon, title, desc]);

    // Entrada desde abajo
    this.scene.tweens.add({
      targets: this.eventContainer,
      y: y,
      duration: 400,
      ease: 'Back.easeOut'
    });

    // Salida
    this.scene.time.delayedCall(4000, () => {
      if (this.eventContainer) {
        this.scene.tweens.add({
          targets: this.eventContainer,
          alpha: 0,
          y: y + 20,
          duration: 300,
          onComplete: () => {
            this.eventContainer?.destroy();
            this.eventContainer = null;
          }
        });
      }
    });
  }

  isEventActive(): boolean {
    return this.activeEvent !== null;
  }

  getActiveEvent(): OfficeEvent | null {
    return this.activeEvent;
  }
}
