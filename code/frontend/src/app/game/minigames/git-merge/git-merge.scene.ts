import * as Phaser from 'phaser';

/**
 * Minijuego Nivel 4: Merge
 * El jugador debe hacer merge de branches correctamente,
 * conectando las ramas que deben unirse.
 */

interface MergeTask {
  source: string;
  target: string;
  description: string;
  correct: boolean; // Si este merge es correcto o no
}

const MERGE_TASKS: MergeTask[] = [
  { source: 'feature/login', target: 'develop', description: 'Login terminado → develop', correct: true },
  { source: 'feature/login', target: 'main', description: 'Login directo a main', correct: false },
  { source: 'hotfix/critical', target: 'main', description: 'Hotfix urgente → main', correct: true },
  { source: 'develop', target: 'main', description: 'Release develop → main', correct: true },
  { source: 'feature/wip', target: 'main', description: 'Feature sin terminar → main', correct: false },
  { source: 'hotfix/typo', target: 'develop', description: 'Hotfix typo → develop', correct: true },
];

export class GitMergeScene extends Phaser.Scene {
  private currentIndex = 0;
  private score = 0;
  private tasks: MergeTask[] = [];
  private feedbackText!: Phaser.GameObjects.Text;
  private taskText!: Phaser.GameObjects.Text;
  private sourceText!: Phaser.GameObjects.Text;
  private targetText!: Phaser.GameObjects.Text;
  private mergeArrow!: Phaser.GameObjects.Graphics;
  private returnScene = 'OfficeScene';

  constructor() {
    super({ key: 'GitMergeScene' });
  }

  init(data: { returnScene?: string }): void {
    if (data?.returnScene) this.returnScene = data.returnScene;
  }

  create(): void {
    const { width, height } = this.cameras.main;
    this.currentIndex = 0;
    this.score = 0;
    this.tasks = this.shuffleArray([...MERGE_TASKS]).slice(0, 5);

    this.add.rectangle(width / 2, height / 2, width, height, 0x1a1a2e);

    this.add.text(width / 2, 30, '🤝 Git Merge: ¿Aprobar o rechazar?', {
      fontSize: '15px', color: '#00FF88', fontStyle: 'bold'
    }).setOrigin(0.5);

    this.add.text(width / 2, 55, 'Decide si este merge es correcto o no', {
      fontSize: '10px', color: '#AAAAAA'
    }).setOrigin(0.5);

    // Visualización de merge
    this.sourceText = this.add.text(150, 200, '', {
      fontSize: '14px', color: '#4488FF', fontFamily: 'monospace',
      backgroundColor: '#1a1a3e', padding: { x: 10, y: 6 }
    }).setOrigin(0.5);

    this.mergeArrow = this.add.graphics();

    this.targetText = this.add.text(650, 200, '', {
      fontSize: '14px', color: '#00FF88', fontFamily: 'monospace',
      backgroundColor: '#1a1a3e', padding: { x: 10, y: 6 }
    }).setOrigin(0.5);

    this.taskText = this.add.text(width / 2, 280, '', {
      fontSize: '12px', color: '#CCCCCC', align: 'center'
    }).setOrigin(0.5);

    // Botones Aprobar / Rechazar
    const approveBtn = this.add.text(width / 2 - 100, 370, '✓ Aprobar Merge', {
      fontSize: '14px', color: '#00FF88', backgroundColor: '#003300',
      padding: { x: 15, y: 10 }
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    const rejectBtn = this.add.text(width / 2 + 100, 370, '✗ Rechazar Merge', {
      fontSize: '14px', color: '#FF4444', backgroundColor: '#330000',
      padding: { x: 15, y: 10 }
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    approveBtn.on('pointerdown', () => this.answer(true));
    rejectBtn.on('pointerdown', () => this.answer(false));

    approveBtn.on('pointerover', () => approveBtn.setStyle({ backgroundColor: '#005500' }));
    approveBtn.on('pointerout', () => approveBtn.setStyle({ backgroundColor: '#003300' }));
    rejectBtn.on('pointerover', () => rejectBtn.setStyle({ backgroundColor: '#550000' }));
    rejectBtn.on('pointerout', () => rejectBtn.setStyle({ backgroundColor: '#330000' }));

    this.feedbackText = this.add.text(width / 2, 440, '', {
      fontSize: '12px', color: '#FFFFFF'
    }).setOrigin(0.5);

    this.add.text(width / 2, height - 30, '', { fontSize: '9px', color: '#666' }).setOrigin(0.5);

    this.loadTask();
    this.input.keyboard!.on('keydown-ESC', () => this.exit(false));
  }

  private loadTask(): void {
    if (this.currentIndex >= this.tasks.length) {
      this.handleComplete();
      return;
    }

    const task = this.tasks[this.currentIndex];
    this.sourceText.setText(task.source);
    this.targetText.setText(task.target);
    this.taskText.setText(`${task.description}\n\n[${this.currentIndex + 1}/${this.tasks.length}]`);

    // Dibujar flecha
    this.mergeArrow.clear();
    this.mergeArrow.lineStyle(3, 0xFFFF00);
    this.mergeArrow.lineBetween(250, 200, 550, 200);
    // Punta de flecha
    this.mergeArrow.lineBetween(530, 190, 550, 200);
    this.mergeArrow.lineBetween(530, 210, 550, 200);

    this.feedbackText.setText('');
  }

  private answer(approved: boolean): void {
    const task = this.tasks[this.currentIndex];
    const correct = (approved === task.correct);

    if (correct) {
      this.score++;
      this.feedbackText.setText(approved ? '✓ ¡Merge correcto!' : '✓ ¡Bien rechazado!').setColor('#00FF88');
    } else {
      this.feedbackText.setText(
        approved ? '✗ ¡Ese merge NO era correcto!' : '✗ Ese merge SÍ era válido.'
      ).setColor('#FF4444');
      this.cameras.main.shake(150, 0.003);
    }

    this.time.delayedCall(1500, () => {
      this.currentIndex++;
      this.loadTask();
    });
  }

  private handleComplete(): void {
    const perfect = this.score === this.tasks.length;
    this.feedbackText.setText(
      perfect ? '🎉 ¡Merge Master! Sin errores.' : `Resultado: ${this.score}/${this.tasks.length}`
    ).setColor(perfect ? '#00FF88' : '#FFAA44');

    this.time.delayedCall(2500, () => this.exit(this.score >= this.tasks.length - 1));
  }

  private exit(success: boolean): void {
    this.scene.start(this.returnScene, {
      fromMinigame: true, minigameResult: success, minigameType: 'git-merge'
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
