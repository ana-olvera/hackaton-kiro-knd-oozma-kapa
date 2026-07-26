import * as Phaser from 'phaser';

/**
 * Minijuego Nivel 7: Git Cherry Pick
 * El jugador selecciona commits específicos de un árbol visual de ramas.
 * Metáfora: "elegir cerezas de un árbol"
 */

interface CommitNode {
  id: string;
  message: string;
  branch: string;
  x: number;
  y: number;
  color: number;
}

interface CherryPickTask {
  instruction: string;
  targetCommitId: string;
  targetBranch: string;
}

interface CherryPickRound {
  commits: CommitNode[];
  task: CherryPickTask;
}

const BRANCH_COLORS: Record<string, number> = {
  'main': 0x00FF88,
  'develop': 0x4488FF,
  'feature/login': 0xFF8844,
  'feature/payments': 0xFF44FF,
  'hotfix/bug': 0xFF4444,
};

function generateRounds(): CherryPickRound[] {
  return [
    {
      commits: [
        { id: 'a1', message: 'init project', branch: 'main', x: 100, y: 200, color: BRANCH_COLORS['main'] },
        { id: 'a2', message: 'add config', branch: 'main', x: 200, y: 200, color: BRANCH_COLORS['main'] },
        { id: 'b1', message: 'login UI', branch: 'feature/login', x: 250, y: 130, color: BRANCH_COLORS['feature/login'] },
        { id: 'b2', message: 'fix auth bug', branch: 'feature/login', x: 370, y: 130, color: BRANCH_COLORS['feature/login'] },
        { id: 'a3', message: 'update deps', branch: 'main', x: 350, y: 200, color: BRANCH_COLORS['main'] },
        { id: 'c1', message: 'payment API', branch: 'feature/payments', x: 300, y: 270, color: BRANCH_COLORS['feature/payments'] },
      ],
      task: {
        instruction: 'Karen: "Necesito SOLO el fix del auth bug en main, sin lo demás."',
        targetCommitId: 'b2',
        targetBranch: 'feature/login'
      }
    },
    {
      commits: [
        { id: 'd1', message: 'base setup', branch: 'main', x: 100, y: 200, color: BRANCH_COLORS['main'] },
        { id: 'd2', message: 'add CI/CD', branch: 'main', x: 220, y: 200, color: BRANCH_COLORS['main'] },
        { id: 'e1', message: 'new button', branch: 'develop', x: 200, y: 130, color: BRANCH_COLORS['develop'] },
        { id: 'e2', message: 'fix typo', branch: 'develop', x: 320, y: 130, color: BRANCH_COLORS['develop'] },
        { id: 'e3', message: 'add tests', branch: 'develop', x: 440, y: 130, color: BRANCH_COLORS['develop'] },
        { id: 'f1', message: 'critical fix', branch: 'hotfix/bug', x: 350, y: 270, color: BRANCH_COLORS['hotfix/bug'] },
        { id: 'd3', message: 'docs update', branch: 'main', x: 380, y: 200, color: BRANCH_COLORS['main'] },
      ],
      task: {
        instruction: 'Karen: "Pasa SOLO los tests de develop a main. Nada más."',
        targetCommitId: 'e3',
        targetBranch: 'develop'
      }
    },
    {
      commits: [
        { id: 'g1', message: 'v1.0 release', branch: 'main', x: 100, y: 200, color: BRANCH_COLORS['main'] },
        { id: 'h1', message: 'payment form', branch: 'feature/payments', x: 200, y: 280, color: BRANCH_COLORS['feature/payments'] },
        { id: 'h2', message: 'validation fix', branch: 'feature/payments', x: 350, y: 280, color: BRANCH_COLORS['feature/payments'] },
        { id: 'i1', message: 'new header', branch: 'develop', x: 220, y: 130, color: BRANCH_COLORS['develop'] },
        { id: 'i2', message: 'refactor utils', branch: 'develop', x: 380, y: 130, color: BRANCH_COLORS['develop'] },
        { id: 'g2', message: 'security patch', branch: 'main', x: 300, y: 200, color: BRANCH_COLORS['main'] },
        { id: 'h3', message: 'stripe integration', branch: 'feature/payments', x: 500, y: 280, color: BRANCH_COLORS['feature/payments'] },
      ],
      task: {
        instruction: 'Karen: "Solo el validation fix de payments, lo necesito en main YA."',
        targetCommitId: 'h2',
        targetBranch: 'feature/payments'
      }
    },
    {
      commits: [
        { id: 'j1', message: 'initial', branch: 'main', x: 100, y: 200, color: BRANCH_COLORS['main'] },
        { id: 'k1', message: 'dark mode', branch: 'feature/login', x: 180, y: 130, color: BRANCH_COLORS['feature/login'] },
        { id: 'k2', message: 'responsive fix', branch: 'feature/login', x: 320, y: 130, color: BRANCH_COLORS['feature/login'] },
        { id: 'l1', message: 'hotfix crash', branch: 'hotfix/bug', x: 250, y: 270, color: BRANCH_COLORS['hotfix/bug'] },
        { id: 'j2', message: 'merge PR #42', branch: 'main', x: 280, y: 200, color: BRANCH_COLORS['main'] },
        { id: 'k3', message: 'a11y update', branch: 'feature/login', x: 460, y: 130, color: BRANCH_COLORS['feature/login'] },
        { id: 'j3', message: 'bump version', branch: 'main', x: 420, y: 200, color: BRANCH_COLORS['main'] },
      ],
      task: {
        instruction: 'Karen: "El responsive fix es urgente para el demo de mañana."',
        targetCommitId: 'k2',
        targetBranch: 'feature/login'
      }
    },
  ];
}

export class GitCherryPickScene extends Phaser.Scene {
  private rounds: CherryPickRound[] = [];
  private currentRound = 0;
  private score = 0;
  private commitNodes: Phaser.GameObjects.Container[] = [];
  private feedbackText!: Phaser.GameObjects.Text;
  private instructionText!: Phaser.GameObjects.Text;
  private progressText!: Phaser.GameObjects.Text;
  private branchLines!: Phaser.GameObjects.Graphics;
  private returnScene = 'OfficeScene';

  constructor() {
    super({ key: 'GitCherryPickScene' });
  }

  init(data: { returnScene?: string }): void {
    if (data?.returnScene) this.returnScene = data.returnScene;
  }

  create(): void {
    const { width, height } = this.cameras.main;
    this.currentRound = 0;
    this.score = 0;
    this.commitNodes = [];
    this.rounds = this.shuffleArray(generateRounds()).slice(0, 4);

    this.add.rectangle(width / 2, height / 2, width, height, 0x1a1a2e);

    // Título
    this.add.text(width / 2, 20, '🍒 Git Cherry-Pick: Elige el commit correcto', {
      fontSize: '14px', color: '#FF8844', fontStyle: 'bold'
    }).setOrigin(0.5);

    this.add.text(width / 2, 42, 'Haz click en el commit que Karen necesita', {
      fontSize: '9px', color: '#AAAAAA'
    }).setOrigin(0.5);

    // Instrucción de Karen
    this.instructionText = this.add.text(width / 2, 70, '', {
      fontSize: '11px', color: '#FFFFFF', wordWrap: { width: 600 }, align: 'center'
    }).setOrigin(0.5);

    // Branch lines
    this.branchLines = this.add.graphics();

    // Feedback
    this.feedbackText = this.add.text(width / 2, height - 60, '', {
      fontSize: '11px', color: '#FFFFFF'
    }).setOrigin(0.5);

    this.progressText = this.add.text(width / 2, height - 35, '', {
      fontSize: '9px', color: '#888888'
    }).setOrigin(0.5);

    // Leyenda de ramas
    this.drawLegend(width, height);

    this.loadRound();
    this.input.keyboard!.on('keydown-ESC', () => this.exit(false));
  }

  private drawLegend(width: number, height: number): void {
    const legendY = height - 15;
    let x = 50;
    Object.entries(BRANCH_COLORS).forEach(([name, color]) => {
      this.add.circle(x, legendY, 5, color);
      this.add.text(x + 10, legendY - 5, name, { fontSize: '7px', color: '#888888' });
      x += 120;
    });
  }

  private loadRound(): void {
    if (this.currentRound >= this.rounds.length) {
      this.handleComplete();
      return;
    }

    // Limpiar nodos previos
    this.commitNodes.forEach(c => c.destroy());
    this.commitNodes = [];
    this.branchLines.clear();

    const round = this.rounds[this.currentRound];
    this.instructionText.setText(round.task.instruction);
    this.progressText.setText(`Ronda ${this.currentRound + 1}/${this.rounds.length} | Aciertos: ${this.score}`);
    this.feedbackText.setText('');

    // Offset para centrar
    const offsetX = (this.cameras.main.width - 600) / 2;
    const offsetY = 60;

    // Dibujar líneas de ramas
    this.drawBranchLines(round.commits, offsetX, offsetY);

    // Dibujar nodos de commit
    round.commits.forEach(commit => {
      const node = this.createCommitNode(commit.x + offsetX, commit.y + offsetY, commit);
      this.commitNodes.push(node);
    });
  }

  private drawBranchLines(commits: CommitNode[], offsetX: number, offsetY: number): void {
    // Agrupar por rama
    const byBranch: Record<string, CommitNode[]> = {};
    commits.forEach(c => {
      if (!byBranch[c.branch]) byBranch[c.branch] = [];
      byBranch[c.branch].push(c);
    });

    Object.entries(byBranch).forEach(([, branchCommits]) => {
      if (branchCommits.length < 2) return;
      const sorted = branchCommits.sort((a, b) => a.x - b.x);
      this.branchLines.lineStyle(2, sorted[0].color, 0.4);
      for (let i = 0; i < sorted.length - 1; i++) {
        this.branchLines.lineBetween(
          sorted[i].x + offsetX, sorted[i].y + offsetY,
          sorted[i + 1].x + offsetX, sorted[i + 1].y + offsetY
        );
      }
    });
  }

  private createCommitNode(x: number, y: number, commit: CommitNode): Phaser.GameObjects.Container {
    const container = this.add.container(x, y);

    const circle = this.add.circle(0, 0, 18, commit.color, 0.8);
    circle.setStrokeStyle(2, 0xFFFFFF);
    circle.setInteractive({ useHandCursor: true });

    const text = this.add.text(0, 28, commit.message, {
      fontSize: '7px', color: '#CCCCCC', align: 'center'
    }).setOrigin(0.5);

    const icon = this.add.text(0, -2, '●', {
      fontSize: '12px', color: '#FFFFFF'
    }).setOrigin(0.5);

    container.add([circle, text, icon]);
    container.setData('commitId', commit.id);

    circle.on('pointerover', () => {
      circle.setScale(1.3);
      circle.setStrokeStyle(3, 0xFFFF00);
    });
    circle.on('pointerout', () => {
      circle.setScale(1);
      circle.setStrokeStyle(2, 0xFFFFFF);
    });
    circle.on('pointerdown', () => this.selectCommit(commit.id));

    return container;
  }

  private selectCommit(commitId: string): void {
    const round = this.rounds[this.currentRound];

    if (commitId === round.task.targetCommitId) {
      this.score++;
      this.feedbackText.setText('🍒 ¡Cherry-pick correcto! Commit aplicado.').setColor('#00FF88');
      this.cameras.main.flash(300, 0, 150, 50);

      // Animar el commit seleccionado
      const node = this.commitNodes.find(c => c.getData('commitId') === commitId);
      if (node) {
        this.tweens.add({
          targets: node,
          scale: 1.5,
          alpha: 0,
          duration: 500,
          ease: 'Power2'
        });
      }
    } else {
      this.feedbackText.setText('✗ Ese no es el commit correcto. Lee la instrucción.').setColor('#FF4444');
      this.cameras.main.shake(150, 0.003);
    }

    // Desactivar interacciones
    this.commitNodes.forEach(c => {
      const circle = c.getAt(0) as Phaser.GameObjects.Arc;
      circle.removeInteractive();
    });

    this.time.delayedCall(2000, () => {
      this.currentRound++;
      this.loadRound();
    });
  }

  private handleComplete(): void {
    const perfect = this.score === this.rounds.length;
    this.instructionText.setText(
      perfect
        ? '🎉 ¡Cherry-pick master! Todos los commits correctos.'
        : `Resultado: ${this.score}/${this.rounds.length}`
    );
    this.instructionText.setColor(perfect ? '#00FF88' : '#FFAA44');
    this.feedbackText.setText('Karen: "Hmm... aceptable."');
    this.cameras.main.flash(400, 0, 200, 100);

    this.time.delayedCall(2500, () => this.exit(this.score >= this.rounds.length - 1));
  }

  private exit(success: boolean): void {
    this.scene.start(this.returnScene, {
      fromMinigame: true, minigameResult: success, minigameType: 'git-cherry-pick'
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
