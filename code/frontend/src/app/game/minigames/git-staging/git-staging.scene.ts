import * as Phaser from 'phaser';

/**
 * Minijuego Nivel 2: Staging Area
 * El jugador hace click en los archivos para agregarlos/quitarlos del staging area.
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
    this.fileObjects = [];
    this.score = 0;
    this.mistakes = 0;

    this.add.rectangle(width / 2, height / 2, width, height, 0x1a1a2e);

    // Título
    this.add.text(width / 2, 25, '📂 Git Staging: Selecciona qué archivos subir', {
      fontSize: '18px', color: '#00FF88', fontStyle: 'bold'
    }).setOrigin(0.5);

    this.add.text(width / 2, 52, '⚠️ Haz clic para agregar/quitar. NO subas archivos sensibles.', {
      fontSize: '13px', color: '#FFAA44'
    }).setOrigin(0.5);

    // Archivos en grid de 2 columnas
    const shuffled = this.shuffleArray([...FILES]);
    const colWidth = 300;
    const startY = 90;
    const rowHeight = 48;

    shuffled.forEach((file, i) => {
      const col = i % 2;
      const row = Math.floor(i / 2);
      const x = width / 2 - colWidth / 2 + col * colWidth;
      const y = startY + row * rowHeight;
      const container = this.createFileItem(x, y, file);
      this.fileObjects.push(container);
    });

    // Feedback
    this.feedbackText = this.add.text(width / 2, height - 80, '', {
      fontSize: '15px', color: '#FFFFFF'
    }).setOrigin(0.5);

    this.scoreText = this.add.text(width / 2, height - 55, 'Correctos: 0 | Errores: 0', {
      fontSize: '13px', color: '#888888'
    }).setOrigin(0.5);

    // Botón commit
    const commitBtn = this.add.text(width / 2, height - 25, '✓ git commit', {
      fontSize: '18px', color: '#00FF88', backgroundColor: '#2d2d44',
      padding: { x: 20, y: 10 }
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    commitBtn.on('pointerover', () => commitBtn.setStyle({ backgroundColor: '#3d3d55' }));
    commitBtn.on('pointerout', () => commitBtn.setStyle({ backgroundColor: '#2d2d44' }));
    commitBtn.on('pointerdown', () => this.handleCommit());

    // ESC para salir
    this.input.keyboard!.on('keydown-ESC', () => this.exit(false));
  }

  private createFileItem(x: number, y: number, file: FileItem): Phaser.GameObjects.Container {
    const container = this.add.container(x, y);

    const bg = this.add.rectangle(0, 0, 270, 40, 0x2d2d44);
    bg.setStrokeStyle(2, 0x444466);
    bg.setInteractive({ useHandCursor: true });

    const text = this.add.text(-120, -8, `${file.icon} ${file.name}`, {
      fontSize: '14px', color: '#CCCCCC'
    });

    container.add([bg, text]);
    container.setData('file', file);
    container.setData('staged', false);

    // Click para toggle stage/unstage
    bg.on('pointerover', () => {
      if (!container.getData('staged')) {
        bg.setStrokeStyle(2, 0x00FF88);
      }
    });
    bg.on('pointerout', () => {
      if (!container.getData('staged')) {
        bg.setStrokeStyle(2, 0x444466);
      }
    });
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
      bg.setStrokeStyle(2, 0x00FF88);
      this.score++;
      this.feedbackText.setText(`✓ ${file.name} añadido al staging`).setColor('#00FF88');
    } else {
      bg.setFillStyle(0x330000);
      bg.setStrokeStyle(2, 0xFF4444);
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
    bg.setStrokeStyle(2, 0x444466);

    if (file.shouldStage) this.score--;
    else this.mistakes--;

    this.scoreText.setText(`Correctos: ${this.score} | Errores: ${this.mistakes}`);
    this.feedbackText.setText(`↩ ${file.name} removido`).setColor('#AAAAAA');
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
      this.feedbackText.setText('❌ No hay archivos en staging. Haz clic en los archivos.').setColor('#FF4444');
    } else {
      this.feedbackText.setText('⚠️ Revisa: faltan archivos correctos o hay archivos que no van.').setColor('#FFAA44');
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
