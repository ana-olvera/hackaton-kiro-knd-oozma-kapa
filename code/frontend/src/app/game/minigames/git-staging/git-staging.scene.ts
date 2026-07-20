import * as Phaser from 'phaser';

/**
 * Minijuego Nivel 2: Staging Area
 * El jugador arrastra archivos al staging area antes de commitear.
 * Algunos archivos NO deben subirse (node_modules, .env, logs).
 */

interface FileItem {
  name: string;
  shouldStage: boolean;
  icon: string;
}

const FILES: FileItem[] = [
  { name: 'index.ts', shouldStage: true, icon: '📄' },
  { name: 'app.component.ts', shouldStage: true, icon: '📄' },
  { name: 'styles.scss', shouldStage: true, icon: '🎨' },
  { name: 'README.md', shouldStage: true, icon: '📝' },
  { name: 'package.json', shouldStage: true, icon: '📦' },
  { name: 'node_modules/', shouldStage: false, icon: '🚫' },
  { name: '.env', shouldStage: false, icon: '🔒' },
  { name: 'debug.log', shouldStage: false, icon: '📋' },
  { name: '.DS_Store', shouldStage: false, icon: '🚫' },
  { name: 'dist/', shouldStage: false, icon: '🚫' },
];

export class GitStagingScene extends Phaser.Scene {
  private stagedFiles: string[] = [];
  private fileObjects: Phaser.GameObjects.Container[] = [];
  private stagingZone!: Phaser.GameObjects.Rectangle;
  private feedbackText!: Phaser.GameObjects.Text;
  private scoreText!: Phaser.GameObjects.Text;
  private score = 0;
  private mistakes = 0;
  private returnScene = 'OfficeScene';

  constructor() {
    super({ key: 'GitStagingScene' });
  }

  init(data: { returnScene?: string }): void {
    if (data?.returnScene) this.returnScene = data.returnScene;
  }

  create(): void {
    const { width, height } = this.cameras.main;
    this.stagedFiles = [];
    this.score = 0;
    this.mistakes = 0;

    this.add.rectangle(width / 2, height / 2, width, height, 0x1a1a2e);

    // Título
    this.add.text(width / 2, 30, '📂 Git Staging: Selecciona qué archivos subir', {
      fontSize: '15px', color: '#00FF88', fontStyle: 'bold'
    }).setOrigin(0.5);

    this.add.text(width / 2, 55, '⚠️ NO subas archivos sensibles o innecesarios', {
      fontSize: '10px', color: '#FFAA44'
    }).setOrigin(0.5);

    // Zona de staging (derecha)
    this.stagingZone = this.add.rectangle(width - 150, height / 2, 200, 350, 0x003300, 0.5);
    this.stagingZone.setStrokeStyle(2, 0x00FF88);
    this.add.text(width - 150, 85, '📦 Staging Area', {
      fontSize: '11px', color: '#00FF88'
    }).setOrigin(0.5);

    // Archivos (izquierda) - shuffle
    const shuffled = this.shuffleArray([...FILES]);
    const startX = 150;
    const startY = 100;

    shuffled.forEach((file, i) => {
      const y = startY + i * 42;
      const container = this.createFileItem(startX, y, file);
      this.fileObjects.push(container);
    });

    // Feedback
    this.feedbackText = this.add.text(width / 2, height - 60, '', {
      fontSize: '11px', color: '#FFFFFF'
    }).setOrigin(0.5);

    this.scoreText = this.add.text(width / 2, height - 35, 'Correctos: 0 | Errores: 0', {
      fontSize: '9px', color: '#888888'
    }).setOrigin(0.5);

    // Botón commit
    const commitBtn = this.add.text(width - 150, height - 50, '✓ git commit', {
      fontSize: '14px', color: '#00FF88', backgroundColor: '#2d2d44',
      padding: { x: 15, y: 8 }
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    commitBtn.on('pointerdown', () => this.handleCommit());

    // ESC para salir
    this.input.keyboard!.on('keydown-ESC', () => this.exit(false));
  }

  private createFileItem(x: number, y: number, file: FileItem): Phaser.GameObjects.Container {
    const container = this.add.container(x, y);

    const bg = this.add.rectangle(0, 0, 220, 35, 0x2d2d44);
    bg.setStrokeStyle(1, 0x444466);
    bg.setInteractive({ useHandCursor: true, draggable: true });

    const text = this.add.text(-95, -6, `${file.icon} ${file.name}`, {
      fontSize: '10px', color: '#CCCCCC'
    });

    container.add([bg, text]);
    container.setData('file', file);
    container.setData('staged', false);

    // Drag
    this.input.setDraggable(bg);

    bg.on('drag', (_pointer: Phaser.Input.Pointer, dragX: number, dragY: number) => {
      container.x = dragX;
      container.y = dragY;
    });

    bg.on('dragend', () => {
      // Verificar si cayó en staging zone
      const bounds = this.stagingZone.getBounds();
      if (bounds.contains(container.x, container.y)) {
        this.stageFile(container, file);
      } else {
        this.unstageFile(container, file);
      }
    });

    // Click también funciona
    bg.on('pointerdown', () => {
      const staged = container.getData('staged');
      if (!staged) {
        this.stageFile(container, file);
      } else {
        this.unstageFile(container, file);
      }
    });

    return container;
  }

  private stageFile(container: Phaser.GameObjects.Container, file: FileItem): void {
    if (container.getData('staged')) return;

    container.setData('staged', true);
    this.stagedFiles.push(file.name);

    const bg = container.getAt(0) as Phaser.GameObjects.Rectangle;

    if (file.shouldStage) {
      bg.setFillStyle(0x003300);
      bg.setStrokeStyle(1, 0x00FF88);
      this.score++;
      this.feedbackText.setText(`✓ ${file.name} añadido`).setColor('#00FF88');
    } else {
      bg.setFillStyle(0x330000);
      bg.setStrokeStyle(1, 0xFF4444);
      this.mistakes++;
      this.feedbackText.setText(`⚠️ ¡${file.name} no debería subirse!`).setColor('#FF4444');
      this.cameras.main.shake(150, 0.003);
    }

    this.scoreText.setText(`Correctos: ${this.score} | Errores: ${this.mistakes}`);
  }

  private unstageFile(container: Phaser.GameObjects.Container, file: FileItem): void {
    if (!container.getData('staged')) return;

    container.setData('staged', false);
    this.stagedFiles = this.stagedFiles.filter(f => f !== file.name);

    const bg = container.getAt(0) as Phaser.GameObjects.Rectangle;
    bg.setFillStyle(0x2d2d44);
    bg.setStrokeStyle(1, 0x444466);

    if (file.shouldStage) this.score--;
    else this.mistakes--;

    this.scoreText.setText(`Correctos: ${this.score} | Errores: ${this.mistakes}`);
  }

  private handleCommit(): void {
    const correctFiles = FILES.filter(f => f.shouldStage);
    const allCorrectStaged = correctFiles.every(f => this.stagedFiles.includes(f.name));
    const noWrongStaged = !FILES.filter(f => !f.shouldStage).some(f => this.stagedFiles.includes(f.name));

    if (allCorrectStaged && noWrongStaged) {
      this.feedbackText.setText('🎉 ¡Commit perfecto! Solo archivos correctos.').setColor('#00FF88');
      this.cameras.main.flash(400, 0, 200, 100);
      this.time.delayedCall(2000, () => this.exit(true));
    } else if (this.stagedFiles.length === 0) {
      this.feedbackText.setText('❌ No hay archivos en staging.').setColor('#FF4444');
    } else {
      this.feedbackText.setText('⚠️ Revisa: faltan archivos o hay archivos que no van.').setColor('#FFAA44');
    }
  }

  private exit(success: boolean): void {
    this.scene.start(this.returnScene, {
      fromMinigame: true, minigameResult: success, minigameType: 'git-staging'
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
