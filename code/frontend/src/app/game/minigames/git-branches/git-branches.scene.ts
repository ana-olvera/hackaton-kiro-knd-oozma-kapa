import * as Phaser from 'phaser';

/**
 * Minijuego Nivel 3: Branches
 * El jugador debe crear ramas correctas y hacer checkout al branch adecuado
 * según la tarea que Karen asigne.
 */

interface BranchTask {
  description: string;
  correctBranch: string;
  options: string[];
}

const TASKS: BranchTask[] = [
  {
    description: 'Karen: "Agrega el botón de login."',
    correctBranch: 'feature/login-button',
    options: ['main', 'feature/login-button', 'hotfix/login', 'develop']
  },
  {
    description: 'Bug urgente en producción: el formulario no envía.',
    correctBranch: 'hotfix/form-submit',
    options: ['feature/form', 'hotfix/form-submit', 'main', 'bugfix/random']
  },
  {
    description: 'Refactorizar el módulo de pagos.',
    correctBranch: 'refactor/payments',
    options: ['main', 'feature/payments-v2', 'refactor/payments', 'develop']
  },
  {
    description: 'Actualizar la documentación del API.',
    correctBranch: 'docs/api-update',
    options: ['main', 'docs/api-update', 'feature/docs', 'hotfix/docs']
  },
  {
    description: 'Preparar release 2.0.',
    correctBranch: 'release/2.0',
    options: ['main', 'release/2.0', 'feature/2.0', 'develop']
  },
];

export class GitBranchesScene extends Phaser.Scene {
  private currentTaskIndex = 0;
  private score = 0;
  private taskText!: Phaser.GameObjects.Text;
  private feedbackText!: Phaser.GameObjects.Text;
  private branchButtons: Phaser.GameObjects.Container[] = [];
  private progressText!: Phaser.GameObjects.Text;
  private returnScene = 'OfficeScene';
  private tasks: BranchTask[] = [];

  constructor() {
    super({ key: 'GitBranchesScene' });
  }

  init(data: { returnScene?: string }): void {
    if (data?.returnScene) this.returnScene = data.returnScene;
  }

  create(): void {
    const { width, height } = this.cameras.main;
    this.currentTaskIndex = 0;
    this.score = 0;
    this.tasks = this.shuffleArray([...TASKS]).slice(0, 4);

    this.add.rectangle(width / 2, height / 2, width, height, 0x1a1a2e);

    // Título
    this.add.text(width / 2, 30, '🌿 Git Branches: Elige el branch correcto', {
      fontSize: '15px', color: '#00FF88', fontStyle: 'bold'
    }).setOrigin(0.5);

    // Visualización de árbol de branches
    this.drawBranchTree(width / 2, 80);

    // Tarea actual
    this.taskText = this.add.text(width / 2, 180, '', {
      fontSize: '12px', color: '#FFFFFF', wordWrap: { width: 500 }, align: 'center'
    }).setOrigin(0.5);

    // Pregunta
    this.add.text(width / 2, 220, '¿A qué branch debes hacer checkout?', {
      fontSize: '10px', color: '#AAAAAA'
    }).setOrigin(0.5);

    // Botones de opciones
    this.createOptionButtons(width, height);

    // Feedback
    this.feedbackText = this.add.text(width / 2, height - 70, '', {
      fontSize: '12px', color: '#FFFFFF'
    }).setOrigin(0.5);

    this.progressText = this.add.text(width / 2, height - 40, '', {
      fontSize: '9px', color: '#888888'
    }).setOrigin(0.5);

    // Cargar primera tarea
    this.loadTask();

    this.input.keyboard!.on('keydown-ESC', () => this.exit(false));
  }

  private drawBranchTree(x: number, y: number): void {
    const graphics = this.add.graphics();
    graphics.lineStyle(2, 0x00FF88);

    // main branch (línea horizontal)
    graphics.lineBetween(x - 200, y, x + 200, y);
    this.add.text(x + 210, y - 8, 'main', { fontSize: '9px', color: '#00FF88' });

    // feature branch
    graphics.lineStyle(2, 0x4488FF);
    graphics.lineBetween(x - 100, y, x - 50, y - 30);
    graphics.lineBetween(x - 50, y - 30, x + 50, y - 30);
    this.add.text(x + 55, y - 38, 'feature/*', { fontSize: '8px', color: '#4488FF' });

    // hotfix branch
    graphics.lineStyle(2, 0xFF4444);
    graphics.lineBetween(x + 50, y, x + 100, y + 30);
    this.add.text(x + 105, y + 22, 'hotfix/*', { fontSize: '8px', color: '#FF4444' });

    // dots en main
    [x - 200, x - 100, x, x + 50, x + 200].forEach(px => {
      this.add.circle(px, y, 4, 0x00FF88);
    });
  }

  private createOptionButtons(width: number, height: number): void {
    const startY = 260;
    for (let i = 0; i < 4; i++) {
      const y = startY + i * 55;
      const container = this.add.container(width / 2, y);

      const bg = this.add.rectangle(0, 0, 300, 40, 0x2d2d44);
      bg.setStrokeStyle(1, 0x444488);
      bg.setInteractive({ useHandCursor: true });

      const text = this.add.text(0, 0, '', {
        fontSize: '12px', color: '#CCCCFF', fontFamily: 'monospace'
      }).setOrigin(0.5);

      container.add([bg, text]);
      this.branchButtons.push(container);

      bg.on('pointerover', () => bg.setStrokeStyle(2, 0x00FF88));
      bg.on('pointerout', () => bg.setStrokeStyle(1, 0x444488));
      bg.on('pointerdown', () => this.selectBranch(i));
    }
  }

  private loadTask(): void {
    if (this.currentTaskIndex >= this.tasks.length) {
      this.handleComplete();
      return;
    }

    const task = this.tasks[this.currentTaskIndex];
    this.taskText.setText(task.description);
    this.progressText.setText(`Tarea ${this.currentTaskIndex + 1}/${this.tasks.length} | Aciertos: ${this.score}`);

    const shuffledOptions = this.shuffleArray([...task.options]);
    this.branchButtons.forEach((container, i) => {
      const text = container.getAt(1) as Phaser.GameObjects.Text;
      const bg = container.getAt(0) as Phaser.GameObjects.Rectangle;
      text.setText(`git checkout ${shuffledOptions[i]}`);
      container.setData('branch', shuffledOptions[i]);
      bg.setFillStyle(0x2d2d44);
      bg.setInteractive();
    });

    this.feedbackText.setText('');
  }

  private selectBranch(index: number): void {
    const task = this.tasks[this.currentTaskIndex];
    const selected = this.branchButtons[index].getData('branch');
    const bg = this.branchButtons[index].getAt(0) as Phaser.GameObjects.Rectangle;

    if (selected === task.correctBranch) {
      bg.setFillStyle(0x004400);
      this.score++;
      this.feedbackText.setText(`✓ Correcto: ${selected}`).setColor('#00FF88');
    } else {
      bg.setFillStyle(0x440000);
      this.feedbackText.setText(`✗ Era: ${task.correctBranch}`).setColor('#FF4444');
      this.cameras.main.shake(150, 0.003);
    }

    // Desactivar botones
    this.branchButtons.forEach(c => {
      (c.getAt(0) as Phaser.GameObjects.Rectangle).disableInteractive();
    });

    // Siguiente tarea
    this.time.delayedCall(1500, () => {
      this.currentTaskIndex++;
      this.loadTask();
    });
  }

  private handleComplete(): void {
    const perfect = this.score === this.tasks.length;
    this.feedbackText.setText(
      perfect ? '🎉 ¡Perfecto! Branch master.' : `Resultado: ${this.score}/${this.tasks.length}`
    ).setColor(perfect ? '#00FF88' : '#FFAA44');

    this.time.delayedCall(2500, () => this.exit(this.score >= this.tasks.length - 1));
  }

  private exit(success: boolean): void {
    this.scene.start(this.returnScene, {
      fromMinigame: true, minigameResult: success, minigameType: 'git-branches'
    });
  }

  private shuffleArray<T>(arr: T[]): T[] {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }
}
