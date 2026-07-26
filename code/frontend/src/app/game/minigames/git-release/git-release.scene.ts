import * as Phaser from 'phaser';

/**
 * Minijuego Nivel 9: Git Release
 * Checklist interactivo para preparar un release a producción.
 * El jugador debe completar las tareas obligatorias en orden, bajo presión de Karen.
 */

interface ReleaseTask {
  id: string;
  label: string;
  command: string;
  required: boolean;
  bonus: boolean;
  completed: boolean;
  order: number; // Orden esperado (las obligatorias deben ir en secuencia)
}

interface KarenPressure {
  time: number; // Segundos en los que aparece
  message: string;
}

const RELEASE_TASKS: ReleaseTask[] = [
  { id: 'checkout', label: 'Ir a rama develop', command: 'git checkout develop', required: true, bonus: false, completed: false, order: 0 },
  { id: 'pull', label: 'Actualizar develop', command: 'git pull origin develop', required: true, bonus: false, completed: false, order: 1 },
  { id: 'tests', label: 'Verificar que tests pasen', command: 'npm run test', required: true, bonus: false, completed: false, order: 2 },
  { id: 'version', label: 'Actualizar versión', command: 'npm version 2.0.0', required: true, bonus: false, completed: false, order: 3 },
  { id: 'changelog', label: 'Actualizar CHANGELOG', command: 'edit CHANGELOG.md', required: false, bonus: true, completed: false, order: -1 },
  { id: 'tag', label: 'Crear tag de versión', command: 'git tag v2.0.0', required: true, bonus: false, completed: false, order: 4 },
  { id: 'push-tags', label: 'Subir tags', command: 'git push --tags', required: true, bonus: false, completed: false, order: 5 },
  { id: 'pr', label: 'Crear PR a main', command: 'gh pr create --base main', required: true, bonus: false, completed: false, order: 6 },
  { id: 'notify', label: 'Notificar al equipo', command: 'slack #releases "v2.0.0 lista"', required: false, bonus: true, completed: false, order: -1 },
  { id: 'docs', label: 'Actualizar docs del API', command: 'npm run docs:generate', required: false, bonus: true, completed: false, order: -1 },
];

const KAREN_MESSAGES: KarenPressure[] = [
  { time: 5, message: '"¿Ya está el release?"' },
  { time: 15, message: '"El cliente está esperando..."' },
  { time: 25, message: '"¿Por qué tarda tanto?"' },
  { time: 35, message: '"Te quedan pocos segundos."' },
  { time: 45, message: '"Si no sale hoy, hay junta el lunes."' },
];

export class GitReleaseScene extends Phaser.Scene {
  private tasks: ReleaseTask[] = [];
  private taskButtons: Phaser.GameObjects.Container[] = [];
  private feedbackText!: Phaser.GameObjects.Text;
  private karenText!: Phaser.GameObjects.Text;
  private timerText!: Phaser.GameObjects.Text;
  private scoreText!: Phaser.GameObjects.Text;
  private timeRemaining = 50;
  private timerEvent!: Phaser.Time.TimerEvent;
  private nextRequiredOrder = 0;
  private bonusCount = 0;
  private returnScene = 'OfficeScene';
  private isComplete = false;

  constructor() {
    super({ key: 'GitReleaseScene' });
  }

  init(data: { returnScene?: string }): void {
    if (data?.returnScene) this.returnScene = data.returnScene;
  }

  create(): void {
    const { width, height } = this.cameras.main;
    this.tasks = RELEASE_TASKS.map(t => ({ ...t, completed: false }));
    this.taskButtons = [];
    this.nextRequiredOrder = 0;
    this.bonusCount = 0;
    this.isComplete = false;
    this.timeRemaining = 50;

    this.add.rectangle(width / 2, height / 2, width, height, 0x1a1a2e);

    // Título
    this.add.text(width / 2, 20, '🚀 Release v2.0.0: Checklist de Deploy', {
      fontSize: '14px', color: '#FFAA44', fontStyle: 'bold'
    }).setOrigin(0.5);

    this.add.text(width / 2, 42, 'Completa las tareas obligatorias en orden. Las opcionales dan bonus.', {
      fontSize: '9px', color: '#AAAAAA'
    }).setOrigin(0.5);

    // Timer
    this.timerText = this.add.text(width - 60, 20, `⏱ ${this.timeRemaining}s`, {
      fontSize: '12px', color: '#FFFF00'
    }).setOrigin(0.5);

    // Karen
    this.karenText = this.add.text(width / 2, height - 75, '"Vamos Michi, es solo un deploy..."', {
      fontSize: '14px', color: '#FF6B6B', fontStyle: 'italic'
    }).setOrigin(0.5);

    // Score
    this.scoreText = this.add.text(60, 20, 'Progreso: 0%', {
      fontSize: '10px', color: '#888888'
    });

    // Tareas como checklist
    this.createTaskList(width, height);

    // Feedback
    this.feedbackText = this.add.text(width / 2, height - 45, '', {
      fontSize: '11px', color: '#FFFFFF'
    }).setOrigin(0.5);

    // Timer
    this.timerEvent = this.time.addEvent({
      delay: 1000,
      loop: true,
      callback: () => {
        if (this.isComplete) return;
        this.timeRemaining--;
        this.timerText.setText(`⏱ ${this.timeRemaining}s`);
        if (this.timeRemaining <= 10) this.timerText.setColor('#FF4444');
        if (this.timeRemaining <= 0) {
          this.timerEvent.destroy();
          this.handleTimeout();
        }

        // Karen messages
        const karenMsg = KAREN_MESSAGES.find(m => m.time === (50 - this.timeRemaining));
        if (karenMsg) {
          this.karenText.setText(karenMsg.message);
          this.cameras.main.shake(100, 0.002);
        }
      }
    });

    this.input.keyboard!.on('keydown-ESC', () => this.exit(false));
  }

  private createTaskList(width: number, height: number): void {
    const startY = 68;
    const gap = 38;
    const colWidth = 380;

    this.tasks.forEach((task, i) => {
      const col = i < 5 ? 0 : 1;
      const row = i < 5 ? i : i - 5;
      const x = width / 2 - colWidth / 2 + col * colWidth;
      const y = startY + row * gap;

      const container = this.add.container(x, y);

      const requiredTag = task.required ? '⚠️' : '⭐';
      const bg = this.add.rectangle(0, 0, colWidth - 20, 32, 0x2d2d44);
      bg.setStrokeStyle(1, task.required ? 0x444488 : 0x886644);
      bg.setInteractive({ useHandCursor: true });

      const checkbox = this.add.text(-colWidth / 2 + 25, 0, '☐', {
        fontSize: '14px', color: '#666666'
      }).setOrigin(0.5);

      const label = this.add.text(-colWidth / 2 + 50, -6, `${requiredTag} ${task.label}`, {
        fontSize: '9px', color: task.required ? '#CCCCCC' : '#AAAA88'
      });

      const cmd = this.add.text(-colWidth / 2 + 50, 7, `$ ${task.command}`, {
        fontSize: '7px', color: '#666688', fontFamily: 'monospace'
      });

      container.add([bg, checkbox, label, cmd]);
      container.setData('taskId', task.id);
      container.setData('checkbox', checkbox);
      container.setData('bg', bg);
      container.setData('label', label);

      bg.on('pointerover', () => {
        if (!task.completed) bg.setStrokeStyle(2, 0x00FF88);
      });
      bg.on('pointerout', () => {
        if (!task.completed) bg.setStrokeStyle(1, task.required ? 0x444488 : 0x886644);
      });
      bg.on('pointerdown', () => this.selectTask(task, container));

      this.taskButtons.push(container);
    });
  }

  private selectTask(task: ReleaseTask, container: Phaser.GameObjects.Container): void {
    if (this.isComplete || task.completed) return;

    const checkbox = container.getData('checkbox') as Phaser.GameObjects.Text;
    const bg = container.getData('bg') as Phaser.GameObjects.Rectangle;
    const label = container.getData('label') as Phaser.GameObjects.Text;

    if (task.required) {
      // Las obligatorias deben hacerse en orden
      if (task.order === this.nextRequiredOrder) {
        task.completed = true;
        this.nextRequiredOrder++;
        checkbox.setText('☑');
        checkbox.setColor('#00FF88');
        bg.setFillStyle(0x003300);
        bg.setStrokeStyle(2, 0x00FF88);
        label.setColor('#00FF88');
        this.feedbackText.setText(`✓ ${task.label}`).setColor('#00FF88');
        this.updateProgress();
        this.checkCompletion();
      } else {
        this.feedbackText.setText(`✗ Primero completa los pasos anteriores.`).setColor('#FF4444');
        this.cameras.main.shake(100, 0.002);
      }
    } else {
      // Opcionales se pueden hacer en cualquier momento
      task.completed = true;
      this.bonusCount++;
      checkbox.setText('☑');
      checkbox.setColor('#FFAA44');
      bg.setFillStyle(0x332200);
      bg.setStrokeStyle(2, 0xFFAA44);
      label.setColor('#FFAA44');
      this.feedbackText.setText(`⭐ Bonus: ${task.label}`).setColor('#FFAA44');
      this.updateProgress();
    }
  }

  private updateProgress(): void {
    const requiredTotal = this.tasks.filter(t => t.required).length;
    const requiredDone = this.tasks.filter(t => t.required && t.completed).length;
    const percent = Math.round((requiredDone / requiredTotal) * 100);
    this.scoreText.setText(`Progreso: ${percent}% | Bonus: ${this.bonusCount}`);
  }

  private checkCompletion(): void {
    const allRequired = this.tasks.filter(t => t.required).every(t => t.completed);
    if (allRequired) {
      this.isComplete = true;
      this.timerEvent.destroy();
      this.feedbackText.setText('🎉 ¡Release completado! v2.0.0 en producción.').setColor('#00FF88');
      this.karenText.setText('"Bien. Ahora el siguiente sprint."');
      this.cameras.main.flash(400, 0, 200, 100);
      this.time.delayedCall(2500, () => this.exit(true));
    }
  }

  private handleTimeout(): void {
    this.isComplete = true;
    const requiredDone = this.tasks.filter(t => t.required && t.completed).length;
    const requiredTotal = this.tasks.filter(t => t.required).length;

    if (requiredDone >= requiredTotal - 1) {
      this.feedbackText.setText(`⚠️ Casi... faltó poco. ${requiredDone}/${requiredTotal}`).setColor('#FFAA44');
      this.time.delayedCall(2500, () => this.exit(false));
    } else {
      this.feedbackText.setText(`💀 Tiempo agotado. Release fallido. ${requiredDone}/${requiredTotal}`).setColor('#FF4444');
      this.karenText.setText('"Hay junta el lunes."');
      this.cameras.main.shake(300, 0.005);
      this.time.delayedCall(2500, () => this.exit(false));
    }
  }

  private exit(success: boolean): void {
    if (this.timerEvent) this.timerEvent.destroy();
    this.scene.start(this.returnScene, {
      fromMinigame: true, minigameResult: success, minigameType: 'git-release'
    });
  }
}
