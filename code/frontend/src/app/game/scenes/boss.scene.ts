import * as Phaser from 'phaser';

/**
 * Escena de Jefe Final.
 * Combina múltiples desafíos simultáneos: Karen pregunta, bugs aparecen,
 * el jugador debe resolver todo antes de que se acabe el tiempo.
 */

interface BossChallenge {
  type: 'git' | 'decision' | 'speed';
  question: string;
  options: string[];
  correctIndex: number;
  timeLimit: number; // ms
}

const BOSS_LEVELS: Record<number, { name: string; challenges: BossChallenge[] }> = {
  1: {
    name: 'Merge Conflict Boss',
    challenges: [
      { type: 'git', question: '¿Qué comando resuelve un conflicto?', options: ['git merge --abort', 'git add . && git commit', 'git reset --hard', 'git push -f'], correctIndex: 1, timeLimit: 8000 },
      { type: 'decision', question: 'Karen: "¿Ya quedó?"', options: ['Sí, ya casi', 'No, falta', 'Estoy en ello', 'Mañana'], correctIndex: 2, timeLimit: 5000 },
      { type: 'speed', question: 'Orden correcto para subir cambios:', options: ['add → commit → push', 'commit → push → add', 'push → add → commit', 'add → push → commit'], correctIndex: 0, timeLimit: 6000 },
      { type: 'git', question: '¿Cómo crear una rama nueva?', options: ['git branch new', 'git checkout -b new', 'git new branch', 'git create new'], correctIndex: 1, timeLimit: 7000 },
      { type: 'decision', question: 'QA encontró 15 bugs. ¿Qué haces?', options: ['Ignorar', 'Arreglar todos', 'Priorizar críticos', 'Cerrar como "won\'t fix"'], correctIndex: 2, timeLimit: 6000 },
    ]
  },
  2: {
    name: 'Sprint Boss',
    challenges: [
      { type: 'git', question: '¿Cómo ver el historial de commits?', options: ['git history', 'git log', 'git show', 'git commits'], correctIndex: 1, timeLimit: 6000 },
      { type: 'decision', question: 'Becatín hizo push a main. ¿Qué haces?', options: ['Revert', 'Reset --hard', 'Ignorar', 'Renunciar'], correctIndex: 0, timeLimit: 6000 },
      { type: 'speed', question: '¿Qué es git stash?', options: ['Guardar cambios temporalmente', 'Borrar cambios', 'Subir a remoto', 'Crear rama'], correctIndex: 0, timeLimit: 5000 },
      { type: 'git', question: '¿Cómo deshacer el último commit (sin perder cambios)?', options: ['git reset --soft HEAD~1', 'git revert HEAD', 'git undo', 'git delete last'], correctIndex: 0, timeLimit: 8000 },
      { type: 'decision', question: 'Deploy a producción un viernes 5PM:', options: ['Hacerlo', 'Nunca', 'Solo si es hotfix', 'Preguntar a Karen'], correctIndex: 1, timeLimit: 5000 },
      { type: 'speed', question: 'Karen + QA + Cliente piden cosas distintas:', options: ['Hacer las 3', 'Priorizar cliente', 'Comunicar y negociar', 'Huir'], correctIndex: 2, timeLimit: 6000 },
    ]
  },
  3: {
    name: 'Deploy Boss',
    challenges: [
      { type: 'git', question: '¿Qué es un tag en Git?', options: ['Una etiqueta de versión', 'Un branch especial', 'Un tipo de commit', 'Un alias'], correctIndex: 0, timeLimit: 6000 },
      { type: 'speed', question: 'El pipeline falló. Primer paso:', options: ['Leer los logs', 'Reintentar', 'Ignorar', 'Culpar a DevOps'], correctIndex: 0, timeLimit: 5000 },
      { type: 'decision', question: 'Producción está caída. ¿Rollback?', options: ['Sí, inmediato', 'No, arreglar en caliente', 'Esperar', 'Pedir permiso a Karen'], correctIndex: 0, timeLimit: 4000 },
      { type: 'git', question: '¿git rebase vs git merge?', options: ['Rebase: lineal. Merge: preserva historia', 'Son iguales', 'Rebase borra commits', 'Merge es más rápido'], correctIndex: 0, timeLimit: 8000 },
      { type: 'decision', question: 'Karen: "¿Seguro que no se va a romper?"', options: ['Seguro', 'Nunca se sabe', 'Tenemos tests', 'Define romper'], correctIndex: 2, timeLimit: 5000 },
      { type: 'speed', question: 'Último paso antes de deploy:', options: ['Rezar', 'Correr tests', 'Avisar al equipo', 'Los tres anteriores'], correctIndex: 3, timeLimit: 5000 },
      { type: 'git', question: '¿Qué hace git cherry-pick?', options: ['Aplica un commit específico', 'Elige la mejor rama', 'Borra commits malos', 'Crea un tag'], correctIndex: 0, timeLimit: 7000 },
    ]
  }
};

export class BossScene extends Phaser.Scene {
  private bossLevel = 1;
  private currentChallengeIndex = 0;
  private score = 0;
  private challenges: BossChallenge[] = [];
  private questionText!: Phaser.GameObjects.Text;
  private feedbackText!: Phaser.GameObjects.Text;
  private timerBar!: Phaser.GameObjects.Rectangle;
  private timerBg!: Phaser.GameObjects.Rectangle;
  private timerEvent: Phaser.Time.TimerEvent | null = null;
  private buttons: Phaser.GameObjects.Text[] = [];
  private bossNameText!: Phaser.GameObjects.Text;
  private healthBar!: Phaser.GameObjects.Rectangle;
  private healthBg!: Phaser.GameObjects.Rectangle;
  private returnScene = 'OfficeScene';

  constructor() {
    super({ key: 'BossScene' });
  }

  init(data: { bossLevel?: number; returnScene?: string }): void {
    this.bossLevel = data?.bossLevel || 1;
    if (data?.returnScene) this.returnScene = data.returnScene;
  }

  create(): void {
    const { width, height } = this.cameras.main;
    this.currentChallengeIndex = 0;
    this.score = 0;

    const bossData = BOSS_LEVELS[this.bossLevel] || BOSS_LEVELS[1];
    this.challenges = [...bossData.challenges];

    this.add.rectangle(width / 2, height / 2, width, height, 0x0a0a1a);

    // Boss name
    this.bossNameText = this.add.text(width / 2, 25, `🔥 BOSS: ${bossData.name} 🔥`, {
      fontSize: '16px', color: '#FF4444', fontStyle: 'bold'
    }).setOrigin(0.5);

    // Boss health bar
    this.healthBg = this.add.rectangle(width / 2, 55, 400, 16, 0x333333).setOrigin(0.5);
    this.healthBar = this.add.rectangle(width / 2 - 200, 55, 400, 16, 0xFF0000).setOrigin(0, 0.5);
    this.add.text(width / 2, 55, 'HP', { fontSize: '9px', color: '#FFFFFF' }).setOrigin(0.5);

    // Timer bar
    this.timerBg = this.add.rectangle(width / 2, 85, 300, 8, 0x333333).setOrigin(0.5);
    this.timerBar = this.add.rectangle(width / 2 - 150, 85, 300, 8, 0xFFFF00).setOrigin(0, 0.5);

    // Question
    this.questionText = this.add.text(width / 2, 150, '', {
      fontSize: '14px', color: '#FFFFFF', wordWrap: { width: 600 }, align: 'center'
    }).setOrigin(0.5);

    // Buttons
    for (let i = 0; i < 4; i++) {
      const col = i % 2;
      const row = Math.floor(i / 2);
      const btnX = width / 2 - 160 + col * 320;
      const btnY = 240 + row * 70;

      const btn = this.add.text(btnX, btnY, '', {
        fontSize: '11px', color: '#CCCCCC', backgroundColor: '#2d2d44',
        padding: { x: 15, y: 10 }, wordWrap: { width: 260 }, fixedWidth: 280
      }).setOrigin(0.5).setInteractive({ useHandCursor: true });

      btn.on('pointerover', () => btn.setStyle({ backgroundColor: '#3d3d55' }));
      btn.on('pointerout', () => btn.setStyle({ backgroundColor: '#2d2d44' }));
      btn.on('pointerdown', () => this.answer(i));

      this.buttons.push(btn);
    }

    // Feedback
    this.feedbackText = this.add.text(width / 2, 430, '', {
      fontSize: '12px', color: '#FFFFFF'
    }).setOrigin(0.5);

    this.add.text(width / 2, height - 20, `Ronda ${this.currentChallengeIndex + 1}/${this.challenges.length}`, {
      fontSize: '9px', color: '#444444'
    }).setOrigin(0.5);

    // Start
    this.loadChallenge();
    this.input.keyboard!.on('keydown-ESC', () => this.exit(false));
  }

  private loadChallenge(): void {
    if (this.currentChallengeIndex >= this.challenges.length) {
      this.handleVictory();
      return;
    }

    const challenge = this.challenges[this.currentChallengeIndex];
    this.questionText.setText(challenge.question);

    challenge.options.forEach((opt, i) => {
      if (this.buttons[i]) {
        this.buttons[i].setText(opt);
        this.buttons[i].setInteractive();
        this.buttons[i].setStyle({ backgroundColor: '#2d2d44', color: '#CCCCCC' });
      }
    });

    this.feedbackText.setText('');

    // Timer
    this.timerBar.width = 300;
    if (this.timerEvent) this.timerEvent.destroy();

    const startTime = this.time.now;
    this.timerEvent = this.time.addEvent({
      delay: 50,
      loop: true,
      callback: () => {
        const elapsed = this.time.now - startTime;
        const progress = 1 - (elapsed / challenge.timeLimit);
        this.timerBar.width = Math.max(0, 300 * progress);

        if (progress <= 0.3) this.timerBar.setFillStyle(0xFF0000);
        else if (progress <= 0.6) this.timerBar.setFillStyle(0xFFAA00);
        else this.timerBar.setFillStyle(0xFFFF00);

        if (elapsed >= challenge.timeLimit) {
          this.timerEvent?.destroy();
          this.handleTimeout();
        }
      }
    });
  }

  private answer(index: number): void {
    if (this.timerEvent) this.timerEvent.destroy();

    const challenge = this.challenges[this.currentChallengeIndex];
    const correct = index === challenge.correctIndex;

    // Desactivar botones
    this.buttons.forEach(b => b.disableInteractive());

    if (correct) {
      this.score++;
      this.buttons[index].setStyle({ backgroundColor: '#004400', color: '#00FF88' });
      this.feedbackText.setText('✓ ¡Correcto!').setColor('#00FF88');
      // Reducir HP del boss
      const hpPercent = 1 - (this.score / this.challenges.length);
      this.healthBar.width = 400 * hpPercent;
    } else {
      this.buttons[index].setStyle({ backgroundColor: '#440000', color: '#FF4444' });
      this.buttons[challenge.correctIndex].setStyle({ backgroundColor: '#004400', color: '#00FF88' });
      this.feedbackText.setText('✗ Incorrecto').setColor('#FF4444');
      this.cameras.main.shake(200, 0.005);
    }

    this.time.delayedCall(1500, () => {
      this.currentChallengeIndex++;
      this.loadChallenge();
    });
  }

  private handleTimeout(): void {
    this.feedbackText.setText('⏰ ¡Tiempo agotado!').setColor('#FF4444');
    this.cameras.main.shake(200, 0.005);
    this.buttons.forEach(b => b.disableInteractive());

    const challenge = this.challenges[this.currentChallengeIndex];
    this.buttons[challenge.correctIndex].setStyle({ backgroundColor: '#004400', color: '#00FF88' });

    this.time.delayedCall(1500, () => {
      this.currentChallengeIndex++;
      this.loadChallenge();
    });
  }

  private handleVictory(): void {
    const passed = this.score >= Math.ceil(this.challenges.length * 0.6);

    this.questionText.setText(
      passed
        ? `🎉 ¡BOSS DERROTADO!\n${this.bossNameText.text}\nScore: ${this.score}/${this.challenges.length}`
        : `💀 DERROTA\nScore: ${this.score}/${this.challenges.length}\n¡Inténtalo de nuevo!`
    );

    this.feedbackText.setText(passed ? 'Karen: "Bueno... aceptable."' : 'Karen: "¿Eso es todo?"');
    this.feedbackText.setColor(passed ? '#00FF88' : '#FF4444');

    this.healthBar.width = passed ? 0 : 400 * (1 - this.score / this.challenges.length);
    this.buttons.forEach(b => b.setVisible(false));

    if (passed) {
      this.cameras.main.flash(500, 0, 200, 100);
    }

    this.time.delayedCall(3000, () => this.exit(passed));
  }

  private exit(success: boolean): void {
    this.scene.start(this.returnScene, {
      fromMinigame: true, minigameResult: success, minigameType: `boss-${this.bossLevel}`
    });
  }
}
