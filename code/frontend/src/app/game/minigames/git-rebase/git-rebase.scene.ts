import * as Phaser from 'phaser';

/**
 * Minijuego Nivel 8: Git Rebase
 * Puzzle de ordenamiento: reorganizar commits en una línea de tiempo limpia.
 * El jugador arrastra commits para ordenarlos correctamente.
 */

interface RebaseCommit {
  id: string;
  message: string;
  correctOrder: number;
}

interface RebaseRound {
  title: string;
  instruction: string;
  commits: RebaseCommit[];
  type: 'reorder' | 'decision';
  // Para type 'decision'
  question?: string;
  options?: string[];
  correctOption?: number;
}

const ROUNDS: RebaseRound[] = [
  {
    title: 'Reordenar commits',
    instruction: 'Ordena los commits de más antiguo (arriba) a más reciente (abajo).',
    type: 'reorder',
    commits: [
      { id: 'r1', message: 'feat: create user model', correctOrder: 0 },
      { id: 'r2', message: 'feat: add user service', correctOrder: 1 },
      { id: 'r3', message: 'feat: add user controller', correctOrder: 2 },
      { id: 'r4', message: 'test: user unit tests', correctOrder: 3 },
    ]
  },
  {
    title: 'Dependencias de commits',
    instruction: 'Ordena respetando dependencias. No puedes testear sin código.',
    type: 'reorder',
    commits: [
      { id: 's1', message: 'chore: install express', correctOrder: 0 },
      { id: 's2', message: 'feat: setup server', correctOrder: 1 },
      { id: 's3', message: 'feat: add routes', correctOrder: 2 },
      { id: 's4', message: 'feat: add middleware', correctOrder: 3 },
      { id: 's5', message: 'test: integration tests', correctOrder: 4 },
    ]
  },
  {
    title: '¿Rebase o Merge?',
    instruction: 'Tu feature branch tiene 3 commits y main avanzó 5 commits.',
    type: 'decision',
    commits: [],
    question: '¿Qué haces para integrar los cambios de main en tu rama?',
    options: [
      'git rebase main (historial limpio y lineal)',
      'git merge main (preserva historia completa)',
      'git reset --hard main (perder mis cambios)',
      'git push -f (forzar sin actualizar)',
    ],
    correctOption: 0
  },
  {
    title: 'Rebase interactivo',
    instruction: 'Tienes commits redundantes. Ordena y decide cuáles aplastar (squash).',
    type: 'reorder',
    commits: [
      { id: 't1', message: 'feat: login page', correctOrder: 0 },
      { id: 't2', message: 'fix: typo in login', correctOrder: 1 },
      { id: 't3', message: 'fix: another typo', correctOrder: 2 },
      { id: 't4', message: 'feat: forgot password', correctOrder: 3 },
    ]
  },
  {
    title: '¿Cuándo NO hacer rebase?',
    instruction: 'Escenario: Tu rama ya fue pusheada y otros la usan.',
    type: 'decision',
    commits: [],
    question: '¿Es seguro hacer rebase en una rama compartida?',
    options: [
      'No, reescribe historia y rompe para los demás',
      'Sí, siempre es seguro',
      'Solo si Karen lo aprueba',
      'Solo los viernes',
    ],
    correctOption: 0
  },
];

export class GitRebaseScene extends Phaser.Scene {
  private rounds: RebaseRound[] = [];
  private currentRoundIndex = 0;
  private score = 0;
  private commitSlots: Phaser.GameObjects.Container[] = [];
  private draggedItem: Phaser.GameObjects.Container | null = null;
  private feedbackText!: Phaser.GameObjects.Text;
  private instructionText!: Phaser.GameObjects.Text;
  private titleText!: Phaser.GameObjects.Text;
  private progressText!: Phaser.GameObjects.Text;
  private returnScene = 'OfficeScene';

  constructor() {
    super({ key: 'GitRebaseScene' });
  }

  init(data: { returnScene?: string }): void {
    if (data?.returnScene) this.returnScene = data.returnScene;
  }

  create(): void {
    const { width, height } = this.cameras.main;
    this.currentRoundIndex = 0;
    this.score = 0;
    this.commitSlots = [];
    this.rounds = this.shuffleArray([...ROUNDS]).slice(0, 4);

    this.add.rectangle(width / 2, height / 2, width, height, 0x1a1a2e);

    // Título
    this.titleText = this.add.text(width / 2, 20, '🔄 Git Rebase', {
      fontSize: '15px', color: '#AA88FF', fontStyle: 'bold'
    }).setOrigin(0.5);

    this.instructionText = this.add.text(width / 2, 50, '', {
      fontSize: '10px', color: '#AAAAAA', wordWrap: { width: 600 }, align: 'center'
    }).setOrigin(0.5);

    this.feedbackText = this.add.text(width / 2, height - 50, '', {
      fontSize: '11px', color: '#FFFFFF'
    }).setOrigin(0.5);

    this.progressText = this.add.text(width / 2, height - 25, '', {
      fontSize: '9px', color: '#888888'
    }).setOrigin(0.5);

    this.loadRound();
    this.input.keyboard!.on('keydown-ESC', () => this.exit(false));
  }

  private loadRound(): void {
    if (this.currentRoundIndex >= this.rounds.length) {
      this.handleComplete();
      return;
    }

    // Limpiar slots previos
    this.commitSlots.forEach(c => c.destroy());
    this.commitSlots = [];

    const round = this.rounds[this.currentRoundIndex];
    this.titleText.setText(`🔄 ${round.title}`);
    this.instructionText.setText(round.instruction);
    this.progressText.setText(`Ronda ${this.currentRoundIndex + 1}/${this.rounds.length} | Aciertos: ${this.score}`);
    this.feedbackText.setText('');

    if (round.type === 'reorder') {
      this.createReorderUI(round);
    } else {
      this.createDecisionUI(round);
    }
  }

  private createReorderUI(round: RebaseRound): void {
    const { width, height } = this.cameras.main;
    const shuffled = this.shuffleArray([...round.commits]);
    const startY = 100;
    const gap = 55;

    // Timeline line
    const graphics = this.add.graphics();
    graphics.lineStyle(2, 0x444444);
    graphics.lineBetween(width / 2 - 5, startY - 10, width / 2 - 5, startY + shuffled.length * gap);
    this.commitSlots.push(this.add.container(0, 0).add(graphics));

    // Position numbers
    shuffled.forEach((_, i) => {
      const posText = this.add.text(width / 2 - 180, startY + i * gap, `${i + 1}.`, {
        fontSize: '12px', color: '#555555'
      }).setOrigin(0.5);
      const posContainer = this.add.container(0, 0).add(posText);
      this.commitSlots.push(posContainer);
    });

    // Commit items (draggable)
    shuffled.forEach((commit, i) => {
      const y = startY + i * gap;
      const container = this.createDraggableCommit(width / 2 + 40, y, commit, i);
      this.commitSlots.push(container);
    });

    // Confirm button
    const confirmBtn = this.add.text(width / 2, height - 90, '✓ Confirmar Orden', {
      fontSize: '13px', color: '#00FF88', backgroundColor: '#2d2d44',
      padding: { x: 15, y: 8 }
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    confirmBtn.on('pointerdown', () => this.checkReorderAnswer(round));
    const btnContainer = this.add.container(0, 0).add(confirmBtn);
    this.commitSlots.push(btnContainer);
  }

  private createDraggableCommit(x: number, y: number, commit: RebaseCommit, index: number): Phaser.GameObjects.Container {
    const container = this.add.container(x, y);

    const bg = this.add.rectangle(0, 0, 300, 40, 0x2d2d44);
    bg.setStrokeStyle(1, 0xAA88FF);
    bg.setInteractive({ useHandCursor: true, draggable: true });

    const text = this.add.text(0, 0, `● ${commit.message}`, {
      fontSize: '10px', color: '#CCCCFF', fontFamily: 'monospace'
    }).setOrigin(0.5);

    container.add([bg, text]);
    container.setData('commitId', commit.id);
    container.setData('correctOrder', commit.correctOrder);
    container.setData('currentIndex', index);
    container.setData('originalY', y);

    this.input.setDraggable(bg);

    bg.on('drag', (_pointer: Phaser.Input.Pointer, _dragX: number, dragY: number) => {
      container.y = dragY;
    });

    bg.on('dragend', () => {
      // Snap to nearest slot
      const startY = 100;
      const gap = 55;
      const slots = this.rounds[this.currentRoundIndex].commits.length;
      let nearestIndex = Math.round((container.y - startY) / gap);
      nearestIndex = Math.max(0, Math.min(slots - 1, nearestIndex));
      container.y = startY + nearestIndex * gap;
      container.setData('currentIndex', nearestIndex);
    });

    return container;
  }

  private checkReorderAnswer(round: RebaseRound): void {
    // Obtener el orden actual basado en posición Y
    const commitContainers = this.commitSlots.filter(c => c.getData('commitId'));
    const sorted = commitContainers.sort((a, b) => a.y - b.y);

    let correct = true;
    sorted.forEach((container, index) => {
      const expectedOrder = container.getData('correctOrder');
      if (expectedOrder !== index) {
        correct = false;
      }
    });

    if (correct) {
      this.score++;
      this.feedbackText.setText('✓ ¡Orden correcto! Rebase limpio.').setColor('#00FF88');
      this.cameras.main.flash(300, 100, 50, 200);
    } else {
      this.feedbackText.setText('✗ El orden no es correcto. Revisa las dependencias.').setColor('#FF4444');
      this.cameras.main.shake(150, 0.003);
    }

    this.time.delayedCall(2000, () => {
      this.currentRoundIndex++;
      this.loadRound();
    });
  }

  private createDecisionUI(round: RebaseRound): void {
    const { width } = this.cameras.main;

    // Pregunta
    const qText = this.add.text(width / 2, 120, round.question || '', {
      fontSize: '12px', color: '#FFFFFF', wordWrap: { width: 500 }, align: 'center'
    }).setOrigin(0.5);
    const qContainer = this.add.container(0, 0).add(qText);
    this.commitSlots.push(qContainer);

    // Opciones
    (round.options || []).forEach((opt, i) => {
      const y = 190 + i * 60;
      const btn = this.add.text(width / 2, y, opt, {
        fontSize: '10px', color: '#CCCCCC', backgroundColor: '#2d2d44',
        padding: { x: 15, y: 10 }, wordWrap: { width: 450 }, fixedWidth: 480
      }).setOrigin(0.5).setInteractive({ useHandCursor: true });

      btn.on('pointerover', () => btn.setStyle({ backgroundColor: '#3d3d55' }));
      btn.on('pointerout', () => btn.setStyle({ backgroundColor: '#2d2d44' }));
      btn.on('pointerdown', () => this.checkDecisionAnswer(i, round.correctOption || 0, btn));

      const btnContainer = this.add.container(0, 0).add(btn);
      this.commitSlots.push(btnContainer);
    });
  }

  private checkDecisionAnswer(selected: number, correct: number, btn: Phaser.GameObjects.Text): void {
    // Desactivar todas las opciones
    this.commitSlots.forEach(c => {
      c.each((child: Phaser.GameObjects.GameObject) => {
        if (child instanceof Phaser.GameObjects.Text && child.input) {
          child.disableInteractive();
        }
      });
    });

    if (selected === correct) {
      this.score++;
      btn.setStyle({ backgroundColor: '#004400', color: '#00FF88' });
      this.feedbackText.setText('✓ ¡Correcto!').setColor('#00FF88');
    } else {
      btn.setStyle({ backgroundColor: '#440000', color: '#FF4444' });
      this.feedbackText.setText('✗ Incorrecto.').setColor('#FF4444');
      this.cameras.main.shake(150, 0.003);
    }

    this.time.delayedCall(2000, () => {
      this.currentRoundIndex++;
      this.loadRound();
    });
  }

  private handleComplete(): void {
    const perfect = this.score === this.rounds.length;
    this.instructionText.setText(
      perfect
        ? '🎉 ¡Rebase master! Historia limpia.'
        : `Resultado: ${this.score}/${this.rounds.length}`
    );
    this.instructionText.setColor(perfect ? '#00FF88' : '#FFAA44');
    this.feedbackText.setText('');
    this.cameras.main.flash(400, 100, 50, 200);

    this.time.delayedCall(2500, () => this.exit(this.score >= this.rounds.length - 1));
  }

  private exit(success: boolean): void {
    this.scene.start(this.returnScene, {
      fromMinigame: true, minigameResult: success, minigameType: 'git-rebase'
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
