import * as Phaser from 'phaser';

/**
 * Minijuego Nivel 5: Resolución de Conflictos
 * El jugador ve un conflicto de merge y elige qué versión mantener.
 */

interface ConflictTask {
  filename: string;
  headContent: string;
  branchContent: string;
  branchName: string;
  correctChoice: 'head' | 'branch' | 'both';
  explanation: string;
}

const CONFLICTS: ConflictTask[] = [
  {
    filename: 'config.ts',
    headContent: 'const API_URL = "https://api.prod.com"',
    branchContent: 'const API_URL = "https://api.staging.com"',
    branchName: 'feature/staging',
    correctChoice: 'head',
    explanation: 'En producción se debe mantener la URL de prod.'
  },
  {
    filename: 'greeting.ts',
    headContent: 'return "Hola"',
    branchContent: 'return "Hola Mundo"',
    branchName: 'feature/greeting',
    correctChoice: 'branch',
    explanation: 'La feature agrega la mejora del saludo.'
  },
  {
    filename: 'utils.ts',
    headContent: 'export function sum(a, b) { return a + b; }',
    branchContent: 'export function sum(a: number, b: number): number { return a + b; }',
    branchName: 'refactor/types',
    correctChoice: 'branch',
    explanation: 'Los tipos de TypeScript son la mejora correcta.'
  },
  {
    filename: 'styles.css',
    headContent: '.btn { color: blue; padding: 8px; }',
    branchContent: '.btn { color: green; padding: 12px; border-radius: 4px; }',
    branchName: 'feature/redesign',
    correctChoice: 'both',
    explanation: 'Ambos tienen estilos válidos, se pueden combinar.'
  },
  {
    filename: 'routes.ts',
    headContent: "{ path: '/users', handler: getUsers }",
    branchContent: "{ path: '/users', handler: getUsers }\n{ path: '/posts', handler: getPosts }",
    branchName: 'feature/posts',
    correctChoice: 'branch',
    explanation: 'La branch agrega la nueva ruta sin romper la existente.'
  },
  {
    filename: 'package.json',
    headContent: '"version": "1.2.0"',
    branchContent: '"version": "1.3.0"',
    branchName: 'release/1.3',
    correctChoice: 'branch',
    explanation: 'La versión del release es la correcta.'
  },
];

export class GitConflictScene extends Phaser.Scene {
  private currentIndex = 0;
  private score = 0;
  private tasks: ConflictTask[] = [];
  private feedbackText!: Phaser.GameObjects.Text;
  private fileNameText!: Phaser.GameObjects.Text;
  private headBox!: Phaser.GameObjects.Container;
  private branchBox!: Phaser.GameObjects.Container;
  private returnScene = 'OfficeScene';

  constructor() {
    super({ key: 'GitConflictScene' });
  }

  init(data: { returnScene?: string }): void {
    if (data?.returnScene) this.returnScene = data.returnScene;
  }

  create(): void {
    const { width, height } = this.cameras.main;
    this.currentIndex = 0;
    this.score = 0;
    this.tasks = this.shuffleArray([...CONFLICTS]).slice(0, 4);

    this.add.rectangle(width / 2, height / 2, width, height, 0x1a1a2e);

    this.add.text(width / 2, 25, '💥 Merge Conflict: Resuelve el conflicto', {
      fontSize: '15px', color: '#FF4444', fontStyle: 'bold'
    }).setOrigin(0.5);

    this.fileNameText = this.add.text(width / 2, 55, '', {
      fontSize: '11px', color: '#AAAAAA'
    }).setOrigin(0.5);

    // Conflict markers
    this.add.text(width / 2, 80, '<<<<<<< HEAD', {
      fontSize: '9px', color: '#FF6666', fontFamily: 'monospace'
    }).setOrigin(0.5);

    // HEAD box (izquierda)
    this.headBox = this.createCodeBox(width / 2 - 190, 160, 'HEAD (actual)', '#4488FF');

    this.add.text(width / 2, 240, '=======', {
      fontSize: '9px', color: '#888888', fontFamily: 'monospace'
    }).setOrigin(0.5);

    // Branch box (derecha)
    this.branchBox = this.createCodeBox(width / 2 + 190, 160, '', '#FF8844');

    this.add.text(width / 2, 270, '>>>>>>> branch', {
      fontSize: '9px', color: '#FF6666', fontFamily: 'monospace'
    }).setOrigin(0.5);

    // Botones de elección
    const btnY = 340;
    this.createChoiceButton(width / 2 - 200, btnY, '← Mantener HEAD', 'head', '#4488FF');
    this.createChoiceButton(width / 2, btnY, '↔ Mantener Ambos', 'both', '#FFAA44');
    this.createChoiceButton(width / 2 + 200, btnY, 'Mantener Branch →', 'branch', '#FF8844');

    this.feedbackText = this.add.text(width / 2, 420, '', {
      fontSize: '11px', color: '#FFFFFF', wordWrap: { width: 500 }, align: 'center'
    }).setOrigin(0.5);

    this.add.text(width / 2, height - 25, 'Elige qué versión conservar', {
      fontSize: '9px', color: '#555555'
    }).setOrigin(0.5);

    this.loadTask();
    this.input.keyboard!.on('keydown-ESC', () => this.exit(false));
  }

  private createCodeBox(x: number, y: number, label: string, color: string): Phaser.GameObjects.Container {
    const container = this.add.container(x, y);
    const bg = this.add.rectangle(0, 0, 320, 100, 0x0d0d22);
    bg.setStrokeStyle(2, Phaser.Display.Color.HexStringToColor(color).color);

    const labelText = this.add.text(0, -55, label, {
      fontSize: '9px', color: color
    }).setOrigin(0.5);

    const codeText = this.add.text(0, 0, '', {
      fontSize: '9px', color: '#CCCCCC', fontFamily: 'monospace',
      wordWrap: { width: 290 }, align: 'left'
    }).setOrigin(0.5);

    container.add([bg, labelText, codeText]);
    container.setData('label', labelText);
    container.setData('code', codeText);
    return container;
  }

  private createChoiceButton(x: number, y: number, text: string, choice: string, color: string): void {
    const btn = this.add.text(x, y, text, {
      fontSize: '11px', color: color, backgroundColor: '#2d2d44',
      padding: { x: 12, y: 8 }
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    btn.on('pointerover', () => btn.setStyle({ backgroundColor: '#3d3d55' }));
    btn.on('pointerout', () => btn.setStyle({ backgroundColor: '#2d2d44' }));
    btn.on('pointerdown', () => this.answer(choice as 'head' | 'branch' | 'both'));
  }

  private loadTask(): void {
    if (this.currentIndex >= this.tasks.length) {
      this.handleComplete();
      return;
    }

    const task = this.tasks[this.currentIndex];
    this.fileNameText.setText(`📄 ${task.filename} [${this.currentIndex + 1}/${this.tasks.length}]`);

    const headCode = this.headBox.getData('code') as Phaser.GameObjects.Text;
    headCode.setText(task.headContent);

    const branchLabel = this.branchBox.getData('label') as Phaser.GameObjects.Text;
    branchLabel.setText(task.branchName);
    const branchCode = this.branchBox.getData('code') as Phaser.GameObjects.Text;
    branchCode.setText(task.branchContent);

    this.feedbackText.setText('');
  }

  private answer(choice: 'head' | 'branch' | 'both'): void {
    const task = this.tasks[this.currentIndex];

    if (choice === task.correctChoice) {
      this.score++;
      this.feedbackText.setText(`✓ ¡Correcto! ${task.explanation}`).setColor('#00FF88');
    } else {
      this.feedbackText.setText(`✗ Incorrecto. ${task.explanation}`).setColor('#FF4444');
      this.cameras.main.shake(150, 0.003);
    }

    this.time.delayedCall(2000, () => {
      this.currentIndex++;
      this.loadTask();
    });
  }

  private handleComplete(): void {
    const perfect = this.score === this.tasks.length;
    this.feedbackText.setText(
      perfect ? '🎉 ¡Conflictos resueltos sin errores!' : `Resultado: ${this.score}/${this.tasks.length}`
    ).setColor(perfect ? '#00FF88' : '#FFAA44');

    this.cameras.main.flash(400, 0, 150, 100);
    this.time.delayedCall(2500, () => this.exit(this.score >= this.tasks.length - 1));
  }

  private exit(success: boolean): void {
    this.scene.start(this.returnScene, {
      fromMinigame: true, minigameResult: success, minigameType: 'git-conflict'
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
