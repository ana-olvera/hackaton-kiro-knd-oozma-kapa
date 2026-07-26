import * as Phaser from 'phaser';

/**
 * Minijuego Nivel 6: Git Workflow Completo
 * El jugador debe completar un flujo de trabajo Git de principio a fin,
 * seleccionando los comandos en el orden correcto.
 */

interface WorkflowStep {
  command: string;
  description: string;
}

interface WorkflowScenario {
  title: string;
  description: string;
  steps: WorkflowStep[];
  distractors: string[]; // Comandos incorrectos para confundir
}

const SCENARIOS: WorkflowScenario[] = [
  {
    title: 'Nueva Feature',
    description: 'Crea una feature, desarróllala y súbela a develop.',
    steps: [
      { command: 'git checkout develop', description: 'Ir a develop' },
      { command: 'git pull origin develop', description: 'Actualizar develop' },
      { command: 'git checkout -b feature/new', description: 'Crear rama feature' },
      { command: 'git add .', description: 'Agregar cambios' },
      { command: 'git commit -m "feat: new"', description: 'Commit con mensaje' },
      { command: 'git push origin feature/new', description: 'Subir la rama' },
    ],
    distractors: ['git merge main', 'git rebase main', 'git stash', 'git reset --hard']
  },
  {
    title: 'Hotfix Urgente',
    description: 'Un bug crítico en producción. Arregla y despliega.',
    steps: [
      { command: 'git checkout main', description: 'Ir a main' },
      { command: 'git pull origin main', description: 'Actualizar main' },
      { command: 'git checkout -b hotfix/critical', description: 'Crear rama hotfix' },
      { command: 'git add .', description: 'Agregar el fix' },
      { command: 'git commit -m "fix: critical"', description: 'Commit del fix' },
      { command: 'git checkout main', description: 'Volver a main' },
      { command: 'git merge hotfix/critical', description: 'Merge del hotfix' },
      { command: 'git push origin main', description: 'Desplegar' },
    ],
    distractors: ['git checkout develop', 'git rebase hotfix', 'git branch -D main', 'git stash pop']
  },
  {
    title: 'Code Review',
    description: 'Tu PR fue aprobada. Integra los cambios.',
    steps: [
      { command: 'git checkout develop', description: 'Ir a develop' },
      { command: 'git pull origin develop', description: 'Actualizar' },
      { command: 'git merge feature/login', description: 'Merge de la feature' },
      { command: 'git push origin develop', description: 'Subir develop' },
      { command: 'git branch -d feature/login', description: 'Limpiar rama local' },
    ],
    distractors: ['git rebase feature/login', 'git cherry-pick HEAD', 'git reset --soft HEAD~1', 'git push -f']
  },
];

export class GitWorkflowScene extends Phaser.Scene {
  private scenario!: WorkflowScenario;
  private currentStep = 0;
  private score = 0;
  private commandButtons: Phaser.GameObjects.Container[] = [];
  private feedbackText!: Phaser.GameObjects.Text;
  private progressText!: Phaser.GameObjects.Text;
  private stepIndicators: Phaser.GameObjects.Arc[] = [];
  private titleText!: Phaser.GameObjects.Text;
  private descText!: Phaser.GameObjects.Text;
  private timerText!: Phaser.GameObjects.Text;
  private timeRemaining = 60;
  private timerEvent!: Phaser.Time.TimerEvent;
  private returnScene = 'OfficeScene';
  private isComplete = false;

  constructor() {
    super({ key: 'GitWorkflowScene' });
  }

  init(data: { returnScene?: string }): void {
    if (data?.returnScene) this.returnScene = data.returnScene;
  }

  create(): void {
    const { width, height } = this.cameras.main;
    this.currentStep = 0;
    this.score = 0;
    this.isComplete = false;
    this.timeRemaining = 60;
    this.commandButtons = [];
    this.stepIndicators = [];

    // Seleccionar escenario aleatorio
    this.scenario = SCENARIOS[Math.floor(Math.random() * SCENARIOS.length)];

    this.add.rectangle(width / 2, height / 2, width, height, 0x1a1a2e);

    // Título
    this.titleText = this.add.text(width / 2, 25, `⚡ Workflow: ${this.scenario.title}`, {
      fontSize: '15px', color: '#00FF88', fontStyle: 'bold'
    }).setOrigin(0.5);

    this.descText = this.add.text(width / 2, 50, this.scenario.description, {
      fontSize: '10px', color: '#AAAAAA'
    }).setOrigin(0.5);

    // Timer
    this.timerText = this.add.text(width - 60, 25, `⏱ ${this.timeRemaining}s`, {
      fontSize: '12px', color: '#FFFF00'
    }).setOrigin(0.5);

    this.timerEvent = this.time.addEvent({
      delay: 1000,
      loop: true,
      callback: () => {
        this.timeRemaining--;
        this.timerText.setText(`⏱ ${this.timeRemaining}s`);
        if (this.timeRemaining <= 10) this.timerText.setColor('#FF4444');
        if (this.timeRemaining <= 0) {
          this.timerEvent.destroy();
          this.exit(false);
        }
      }
    });

    // Step indicators
    const totalSteps = this.scenario.steps.length;
    const indicatorStartX = width / 2 - (totalSteps * 20) / 2;
    for (let i = 0; i < totalSteps; i++) {
      const dot = this.add.circle(indicatorStartX + i * 20, 75, 6, 0x333333);
      dot.setStrokeStyle(1, 0x555555);
      this.stepIndicators.push(dot);
    }

    // Instrucción del paso actual
    this.progressText = this.add.text(width / 2, 100, '', {
      fontSize: '11px', color: '#FFFFFF'
    }).setOrigin(0.5);

    // Crear botones de comandos (mezclados)
    this.createCommandButtons(width, height);

    // Feedback
    this.feedbackText = this.add.text(width / 2, height - 40, '', {
      fontSize: '11px', color: '#FFFFFF'
    }).setOrigin(0.5);

    this.updateStepUI();
    this.input.keyboard!.on('keydown-ESC', () => this.exit(false));
  }

  private createCommandButtons(width: number, height: number): void {
    // Mezclar pasos correctos con distractores
    const allCommands = [
      ...this.scenario.steps.map(s => s.command),
      ...this.scenario.distractors
    ];
    const shuffled = this.shuffleArray(allCommands);

    const cols = 2;
    const rows = Math.ceil(shuffled.length / cols);
    const btnWidth = 320;
    const btnHeight = 36;
    const startY = 130;
    const gapY = 42;
    const gapX = 340;

    shuffled.forEach((cmd, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const x = width / 2 - gapX / 2 + col * gapX;
      const y = startY + row * gapY;

      const container = this.add.container(x, y);

      const bg = this.add.rectangle(0, 0, btnWidth, btnHeight, 0x2d2d44);
      bg.setStrokeStyle(1, 0x444488);
      bg.setInteractive({ useHandCursor: true });

      const text = this.add.text(0, 0, `$ ${cmd}`, {
        fontSize: '9px', color: '#00CCFF', fontFamily: 'monospace'
      }).setOrigin(0.5);

      container.add([bg, text]);
      container.setData('command', cmd);
      container.setData('bg', bg);

      bg.on('pointerover', () => {
        if (!this.isComplete) bg.setStrokeStyle(2, 0x00FF88);
      });
      bg.on('pointerout', () => {
        if (!this.isComplete) bg.setStrokeStyle(1, 0x444488);
      });
      bg.on('pointerdown', () => this.selectCommand(cmd, container));

      this.commandButtons.push(container);
    });
  }

  private selectCommand(command: string, container: Phaser.GameObjects.Container): void {
    if (this.isComplete) return;

    const expectedCommand = this.scenario.steps[this.currentStep].command;
    const bg = container.getData('bg') as Phaser.GameObjects.Rectangle;

    if (command === expectedCommand) {
      // Correcto
      bg.setFillStyle(0x004400);
      bg.setStrokeStyle(2, 0x00FF88);
      bg.removeInteractive();
      this.stepIndicators[this.currentStep].setFillStyle(0x00FF88);
      this.score++;
      this.currentStep++;

      this.feedbackText.setText(`✓ ${command}`).setColor('#00FF88');

      if (this.currentStep >= this.scenario.steps.length) {
        this.handleComplete();
      } else {
        this.updateStepUI();
      }
    } else {
      // Error
      bg.setFillStyle(0x440000);
      this.time.delayedCall(300, () => bg.setFillStyle(0x2d2d44));
      this.feedbackText.setText(`✗ Ese no es el paso correcto`).setColor('#FF4444');
      this.cameras.main.shake(150, 0.003);
    }
  }

  private updateStepUI(): void {
    if (this.currentStep < this.scenario.steps.length) {
      const step = this.scenario.steps[this.currentStep];
      this.progressText.setText(`Paso ${this.currentStep + 1}/${this.scenario.steps.length}: ${step.description}`);
    }
  }

  private handleComplete(): void {
    this.isComplete = true;
    this.timerEvent.destroy();

    this.feedbackText.setText('🎉 ¡Workflow completado! Git master.').setColor('#00FF88');
    this.progressText.setText(`✓ Todos los pasos completados en ${60 - this.timeRemaining}s`);
    this.cameras.main.flash(400, 0, 200, 100);

    this.time.delayedCall(2500, () => this.exit(true));
  }

  private exit(success: boolean): void {
    if (this.timerEvent) this.timerEvent.destroy();
    this.scene.start(this.returnScene, {
      fromMinigame: true, minigameResult: success, minigameType: 'git-workflow'
    });
  }

  private shuffleArray<T>(arr: T[]): T[] {
    const result = [...arr];
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }
}
