import * as Phaser from 'phaser';

/**
 * Minijuego Nivel 1: Git Básico
 * Karen dice "Sube el cambio" y el jugador debe ejecutar git add → git commit → git push en orden.
 * Si se equivoca, Karen responde con un mensaje sarcástico.
 */

interface GitCommand {
  label: string;
  command: string;
  description: string;
}

const COMMANDS: GitCommand[] = [
  { label: 'git add .', command: 'add', description: 'Preparar cambios' },
  { label: 'git commit -m "fix"', command: 'commit', description: 'Documentar avance' },
  { label: 'git push', command: 'push', description: 'Enviar al servidor' },
];

const KAREN_RESPONSES_ERROR = [
  '¿Seguro que hiciste commit?',
  'Eso no va así...',
  '¿No te enseñaron Git?',
  'Michi... por favor.',
  'Otra vez no...',
];

const KAREN_RESPONSES_SUCCESS = [
  '¡Por fin!',
  'Tardaste mucho.',
  'Bueno, ya era hora.',
  '¿Ves que no era difícil?',
];

export class GitBasicScene extends Phaser.Scene {
  private buttons: Phaser.GameObjects.Container[] = [];
  private expectedOrder: string[] = ['add', 'commit', 'push'];
  private currentStep = 0;
  private feedbackText!: Phaser.GameObjects.Text;
  private karenText!: Phaser.GameObjects.Text;
  private karenPortrait!: Phaser.GameObjects.Image;
  private progressDots: Phaser.GameObjects.Arc[] = [];
  private isComplete = false;
  private returnScene = 'OfficeScene';

  constructor() {
    super({ key: 'GitBasicScene' });
  }

  init(data: { returnScene?: string }): void {
    if (data?.returnScene) {
      this.returnScene = data.returnScene;
    }
  }

  create(): void {
    const { width, height } = this.cameras.main;
    this.currentStep = 0;
    this.isComplete = false;

    // Fondo
    this.add.rectangle(width / 2, height / 2, width, height, 0x1a1a2e);

    // Título
    this.add.text(width / 2, 40, '💻 Git Challenge: Sube el cambio', {
      fontSize: '18px',
      color: '#00FF88',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    // Instrucción
    this.add.text(width / 2, 70, 'Ejecuta los comandos en el orden correcto', {
      fontSize: '11px',
      color: '#AAAAAA'
    }).setOrigin(0.5);

    // Karen portrait y texto
    this.karenPortrait = this.add.image(80, height - 80, 'karen');
    this.karenPortrait.setScale(1.5);

    this.karenText = this.add.text(120, height - 100, '"Sube el cambio, Michi."', {
      fontSize: '11px',
      color: '#FF6B6B',
      fontStyle: 'italic',
      wordWrap: { width: 300 }
    });

    // Botones de comandos (en orden aleatorio para el jugador)
    const shuffled = this.shuffleCommands([...COMMANDS]);
    const buttonStartY = 140;

    shuffled.forEach((cmd, index) => {
      const btn = this.createCommandButton(
        width / 2, buttonStartY + index * 80,
        cmd
      );
      this.buttons.push(btn);
    });

    // Indicadores de progreso
    for (let i = 0; i < 3; i++) {
      const dot = this.add.circle(width / 2 - 30 + i * 30, height - 30, 8, 0x333333);
      dot.setStrokeStyle(2, 0x555555);
      this.progressDots.push(dot);
    }

    // Texto de feedback
    this.feedbackText = this.add.text(width / 2, height - 55, '', {
      fontSize: '12px',
      color: '#FFFFFF'
    }).setOrigin(0.5);

    // Tecla ESC para salir
    this.input.keyboard!.on('keydown-ESC', () => {
      this.exitMinigame(false);
    });
  }

  private createCommandButton(x: number, y: number, cmd: GitCommand): Phaser.GameObjects.Container {
    const container = this.add.container(x, y);

    const bg = this.add.rectangle(0, 0, 280, 60, 0x2d2d44);
    bg.setStrokeStyle(2, 0x4444FF);
    bg.setInteractive({ useHandCursor: true });

    const cmdText = this.add.text(0, -10, cmd.label, {
      fontSize: '14px',
      color: '#00CCFF',
      fontFamily: 'monospace'
    }).setOrigin(0.5);

    const descText = this.add.text(0, 12, cmd.description, {
      fontSize: '9px',
      color: '#888888'
    }).setOrigin(0.5);

    container.add([bg, cmdText, descText]);
    container.setData('command', cmd.command);

    // Hover effects
    bg.on('pointerover', () => {
      bg.setFillStyle(0x3d3d55);
      bg.setStrokeStyle(2, 0x00FF88);
    });

    bg.on('pointerout', () => {
      bg.setFillStyle(0x2d2d44);
      bg.setStrokeStyle(2, 0x4444FF);
    });

    bg.on('pointerdown', () => {
      this.handleCommandClick(cmd.command, container);
    });

    return container;
  }

  private handleCommandClick(command: string, container: Phaser.GameObjects.Container): void {
    if (this.isComplete) return;

    if (command === this.expectedOrder[this.currentStep]) {
      // ¡Correcto!
      this.handleCorrect(container);
    } else {
      // Error
      this.handleError(container);
    }
  }

  private handleCorrect(container: Phaser.GameObjects.Container): void {
    // Marcar como completado visualmente
    const bg = container.getAt(0) as Phaser.GameObjects.Rectangle;
    bg.setFillStyle(0x004400);
    bg.setStrokeStyle(2, 0x00FF00);
    bg.removeInteractive();

    // Actualizar dot de progreso
    this.progressDots[this.currentStep].setFillStyle(0x00FF88);

    // Feedback
    const labels = ['✓ git add', '✓ git commit', '✓ git push'];
    this.feedbackText.setText(labels[this.currentStep]);
    this.feedbackText.setColor('#00FF88');

    this.currentStep++;

    // ¿Completó todos?
    if (this.currentStep >= this.expectedOrder.length) {
      this.handleComplete();
    }
  }

  private handleError(container: Phaser.GameObjects.Container): void {
    // Flash rojo
    const bg = container.getAt(0) as Phaser.GameObjects.Rectangle;
    bg.setFillStyle(0x440000);

    this.time.delayedCall(300, () => {
      bg.setFillStyle(0x2d2d44);
    });

    // Karen responde
    const response = KAREN_RESPONSES_ERROR[Math.floor(Math.random() * KAREN_RESPONSES_ERROR.length)];
    this.karenText.setText(`"${response}"`);

    // Feedback
    this.feedbackText.setText('✗ Orden incorrecto');
    this.feedbackText.setColor('#FF4444');

    // Shake camera
    this.cameras.main.shake(200, 0.005);
  }

  private handleComplete(): void {
    this.isComplete = true;

    // Karen responde (a regañadientes)
    const response = KAREN_RESPONSES_SUCCESS[Math.floor(Math.random() * KAREN_RESPONSES_SUCCESS.length)];
    this.karenText.setText(`"${response}"`);

    // Mensaje de éxito
    this.feedbackText.setText('🎉 ¡Push exitoso! Cambios en el servidor.');
    this.feedbackText.setColor('#00FF88');

    // Animación de éxito
    this.cameras.main.flash(500, 0, 255, 100);

    // Volver a la oficina después de 2.5 segundos
    this.time.delayedCall(2500, () => {
      this.exitMinigame(true);
    });
  }

  private exitMinigame(success: boolean): void {
    this.scene.start(this.returnScene, { 
      fromMinigame: true, 
      minigameResult: success,
      minigameType: 'git-basic'
    });
  }

  private shuffleCommands(arr: GitCommand[]): GitCommand[] {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }
}
