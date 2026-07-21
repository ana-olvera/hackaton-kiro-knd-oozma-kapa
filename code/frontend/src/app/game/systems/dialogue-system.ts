import * as Phaser from 'phaser';

/**
 * Sistema de diálogos humorísticos.
 * Muestra diálogos entre personajes con estilo de chat/mensajería.
 */

export interface DialogueLine {
  speaker: string;
  speakerColor: string;
  text: string;
  icon: string;
}

export interface DialogueSequence {
  id: string;
  lines: DialogueLine[];
  trigger: string; // Evento que dispara este diálogo
}

// Diálogos humorísticos predefinidos
const DIALOGUES: DialogueSequence[] = [
  {
    id: 'karen-inicio',
    trigger: 'game-start',
    lines: [
      { speaker: 'Karen', speakerColor: '#FF6B6B', text: '¿Cómo va esa integración?', icon: '👩' },
      { speaker: 'Michi', speakerColor: '#FFAA66', text: 'Ya casi...', icon: '🐱' },
      { speaker: 'Karen', speakerColor: '#FF6B6B', text: 'Perfecto. Lo necesito para ayer.', icon: '👩' },
    ]
  },
  {
    id: 'becatin-help',
    trigger: 'becatin-appears',
    lines: [
      { speaker: 'Becatín', speakerColor: '#FFAA44', text: '¿Qué es un merge?', icon: '🐱💫' },
      { speaker: 'Michi', speakerColor: '#FFAA66', text: '...', icon: '🐱' },
      { speaker: 'Becatín', speakerColor: '#FFAA44', text: 'No te preocupes, ya lo googleo.', icon: '🐱💫' },
      { speaker: 'Michi', speakerColor: '#FFAA66', text: '¡ESPERA NO HAGAS PUSH A—', icon: '🐱' },
      { speaker: 'Becatín', speakerColor: '#FFAA44', text: 'Listo :)', icon: '🐱💫' },
    ]
  },
  {
    id: 'qa-bugs',
    trigger: 'qa-review',
    lines: [
      { speaker: 'Michi QA', speakerColor: '#44CCAA', text: 'Solo encontré un detalle...', icon: '🐱🔍' },
      { speaker: 'Michi', speakerColor: '#FFAA66', text: '¿Solo uno?', icon: '🐱' },
      { speaker: 'Michi QA', speakerColor: '#44CCAA', text: '*abre lista de 47 bugs*', icon: '🐱🔍' },
      { speaker: 'Michi', speakerColor: '#FFAA66', text: '😿', icon: '🐱' },
    ]
  },
  {
    id: 'news-chisme',
    trigger: 'news-gossip',
    lines: [
      { speaker: 'Michi News', speakerColor: '#CC66FF', text: 'Ven tantito...', icon: '🐱📰' },
      { speaker: 'Michi', speakerColor: '#FFAA66', text: 'Estoy ocupado.', icon: '🐱' },
      { speaker: 'Michi News', speakerColor: '#CC66FF', text: '¿Ya supiste lo del aumento?', icon: '🐱📰' },
      { speaker: 'Michi', speakerColor: '#FFAA66', text: '...te escucho.', icon: '🐱' },
    ]
  },
  {
    id: 'deploy-friday',
    trigger: 'boss-deploy',
    lines: [
      { speaker: 'Karen', speakerColor: '#FF6B6B', text: 'Necesito que hagas deploy.', icon: '👩' },
      { speaker: 'Michi', speakerColor: '#FFAA66', text: 'Claro, ¿cuándo?', icon: '🐱' },
      { speaker: 'Karen', speakerColor: '#FF6B6B', text: 'Hoy. Viernes. 5:30 PM.', icon: '👩' },
      { speaker: 'Michi', speakerColor: '#FFAA66', text: '...', icon: '🐱' },
      { speaker: 'Karen', speakerColor: '#FF6B6B', text: 'No debe tardar :)', icon: '👩' },
    ]
  },
  {
    id: 'prod-down',
    trigger: 'production-bug',
    lines: [
      { speaker: 'MichiOps', speakerColor: '#44AA44', text: 'En mi ambiente sí funciona.', icon: '🐱⚙️' },
      { speaker: 'Michi QA', speakerColor: '#44CCAA', text: 'Pues en producción no.', icon: '🐱🔍' },
      { speaker: 'SQLino', speakerColor: '#AA4400', text: 'Eso no toca la BD.', icon: '🐱💾' },
      { speaker: 'Michi', speakerColor: '#FFAA66', text: '(era la BD)', icon: '🐱' },
    ]
  },
  {
    id: 'standup-eternal',
    trigger: 'daily-standup',
    lines: [
      { speaker: 'Karen', speakerColor: '#FF6B6B', text: 'Solo 15 minutos de daily.', icon: '👩' },
      { speaker: 'Michi', speakerColor: '#FFAA66', text: '(45 minutos después...)', icon: '🐱' },
      { speaker: 'Karen', speakerColor: '#FF6B6B', text: '...y por eso necesitamos otro sprint.', icon: '👩' },
      { speaker: 'Michi', speakerColor: '#FFAA66', text: '😴', icon: '🐱' },
    ]
  },
];

export class DialogueSystem {
  private scene: Phaser.Scene;
  private container: Phaser.GameObjects.Container | null = null;
  private currentSequence: DialogueSequence | null = null;
  private currentLineIndex = 0;
  private isActive = false;
  private onCompleteCallback: (() => void) | null = null;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  /**
   * Inicia un diálogo por trigger o ID
   */
  play(triggerId: string, onComplete?: () => void): boolean {
    if (this.isActive) return false;

    const sequence = DIALOGUES.find(d => d.trigger === triggerId || d.id === triggerId);
    if (!sequence) return false;

    this.currentSequence = sequence;
    this.currentLineIndex = 0;
    this.isActive = true;
    this.onCompleteCallback = onComplete || null;

    this.showCurrentLine();
    return true;
  }

  /**
   * Inicia un diálogo aleatorio
   */
  playRandom(onComplete?: () => void): boolean {
    if (this.isActive) return false;

    const sequence = DIALOGUES[Math.floor(Math.random() * DIALOGUES.length)];
    this.currentSequence = sequence;
    this.currentLineIndex = 0;
    this.isActive = true;
    this.onCompleteCallback = onComplete || null;

    this.showCurrentLine();
    return true;
  }

  private showCurrentLine(): void {
    if (!this.currentSequence) return;
    const line = this.currentSequence.lines[this.currentLineIndex];

    // Destruir container anterior
    if (this.container) {
      this.container.destroy();
    }

    // Posición ajustada para zoom 2x (viewport = 400x300)
    const x = 200;
    const y = 280;

    this.container = this.scene.add.container(x, y);
    this.container.setScrollFactor(0);
    this.container.setDepth(1900);

    // Fondo estilo chat
    const bg = this.scene.add.rectangle(0, 0, 180, 30, 0x111133, 0.95);
    bg.setStrokeStyle(1, 0x333366);

    // Icono
    const icon = this.scene.add.text(-82, -5, line.icon, { fontSize: '10px' });

    // Nombre del hablante
    const speaker = this.scene.add.text(-65, -10, line.speaker, {
      fontSize: '6px',
      color: line.speakerColor,
      fontStyle: 'bold'
    });

    // Texto
    const text = this.scene.add.text(-65, 1, line.text, {
      fontSize: '6px',
      color: '#FFFFFF',
      wordWrap: { width: 140 }
    });

    // Indicador de progreso
    const progress = this.scene.add.text(75, 8,
      `${this.currentLineIndex + 1}/${this.currentSequence.lines.length}`,
      { fontSize: '5px', color: '#666666' }
    );

    this.container.add([bg, icon, speaker, text, progress]);

    // Entrada
    this.container.setAlpha(0);
    this.scene.tweens.add({
      targets: this.container,
      alpha: 1,
      duration: 200
    });

    // Avanzar automáticamente después de 2.5 segundos
    this.scene.time.delayedCall(2500, () => {
      this.advance();
    });
  }

  private advance(): void {
    if (!this.currentSequence) return;

    this.currentLineIndex++;

    if (this.currentLineIndex >= this.currentSequence.lines.length) {
      // Fin del diálogo
      this.end();
    } else {
      this.showCurrentLine();
    }
  }

  private end(): void {
    if (this.container) {
      this.scene.tweens.add({
        targets: this.container,
        alpha: 0,
        duration: 200,
        onComplete: () => {
          this.container?.destroy();
          this.container = null;
        }
      });
    }

    this.isActive = false;
    this.currentSequence = null;
    this.currentLineIndex = 0;

    if (this.onCompleteCallback) {
      this.onCompleteCallback();
    }
  }

  isPlaying(): boolean {
    return this.isActive;
  }

  skip(): void {
    if (this.isActive) {
      this.end();
    }
  }
}
