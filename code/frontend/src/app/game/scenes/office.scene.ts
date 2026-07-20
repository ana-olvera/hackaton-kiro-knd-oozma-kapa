import * as Phaser from 'phaser';
import { SpriteGenerator } from '../assets/sprite-generator';
import { KarenSystem, KarenMessage } from '../systems/karen-system';
import { TimeSystem } from '../systems/time-system';
import { HudSystem } from '../systems/hud-system';
import { PortraitSystem } from '../systems/portrait-system';
import { NpcSystem, NpcEffect } from '../systems/npc-system';
import { EventsSystem, OfficeEvent } from '../systems/events-system';
import { DialogueSystem } from '../systems/dialogue-system';
import { AchievementsSystem } from '../systems/achievements-system';
import { AudioSystem } from '../systems/audio-system';
import { MobileControls } from '../systems/mobile-controls';
import { ProgressionSystem } from '../systems/progression-system';

/**
 * Escena principal de la oficina.
 * Integra TODOS los sistemas: movimiento, Karen, tiempo, HUD, NPCs, eventos,
 * diálogos, logros, audio, controles móviles y progresión.
 */
export class OfficeScene extends Phaser.Scene {
  private michi!: Phaser.GameObjects.Sprite;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private officeObjects: Phaser.GameObjects.Sprite[] = [];
  private interactionZones: { zone: Phaser.GameObjects.Zone; type: string }[] = [];
  private interactKey!: Phaser.Input.Keyboard.Key;

  // Sistemas Fase 1
  private karenSystem!: KarenSystem;
  private timeSystem!: TimeSystem;
  private hudSystem!: HudSystem;
  private portraitSystem!: PortraitSystem;

  // Sistemas Fase 2
  private npcSystem!: NpcSystem;
  private eventsSystem!: EventsSystem;
  private dialogueSystem!: DialogueSystem;
  private achievementsSystem!: AchievementsSystem;
  private audioSystem!: AudioSystem;
  private progressionSystem!: ProgressionSystem;

  // Sistemas Fase 3
  private mobileControls!: MobileControls;

  // Estado del juego
  private gameState = {
    energy: 80,
    coffee: 50,
    hunger: 30,
    sleep: 20,
    focus: 70,
    stress: 10,
    karenometer: 0,
    score: 0,
    coffeesToday: 0,
    minigamesCompleted: [] as string[],
    startTime: 0
  };

  // Tracking para logros
  private karenometerMax = 0;
  private energyMin = 100;

  private degradeTimer!: Phaser.Time.TimerEvent;

  // Minijuegos disponibles según nivel
  private availableMinigames: string[] = ['GitBasicScene'];

  private officeMap: number[][] = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 2, 3, 0, 5, 0, 0, 2, 3, 0, 5, 0, 0, 2, 3, 0, 5, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 2, 3, 0, 5, 0, 0, 2, 3, 0, 5, 0, 0, 2, 3, 0, 5, 0, 0, 0, 4, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 2, 3, 0, 5, 0, 0, 2, 3, 0, 5, 0, 0, 2, 3, 0, 5, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
  ];

  private walls!: Phaser.Physics.Arcade.StaticGroup;

  constructor() {
    super({ key: 'OfficeScene' });
  }

  init(data?: { fromMinigame?: boolean; minigameResult?: boolean; minigameType?: string }): void {
    if (data?.fromMinigame) {
      if (data.minigameResult) {
        this.gameState.score += 100;
        this.gameState.stress = Math.max(0, this.gameState.stress - 10);
        this.gameState.focus = Math.min(100, this.gameState.focus + 15);
        if (data.minigameType) {
          this.gameState.minigamesCompleted.push(data.minigameType);
        }
      } else {
        this.gameState.stress = Math.min(100, this.gameState.stress + 5);
      }
    }
  }

  preload(): void {
    SpriteGenerator.generateAll(this);
    this.load.atlas(
      'michi-emotions',
      'assets/sprites/gestos_michigodin.jpeg',
      'assets/sprites/gestos_michigodin.json'
    );
  }

  create(): void {
    const tileSize = 32;
    this.gameState.startTime = Date.now();

    // Física
    this.walls = this.physics.add.staticGroup();

    // Renderizar tilemap
    for (let row = 0; row < this.officeMap.length; row++) {
      for (let col = 0; col < this.officeMap[row].length; col++) {
        const tileIndex = this.officeMap[row][col];
        const x = col * tileSize + tileSize / 2;
        const y = row * tileSize + tileSize / 2;

        this.add.sprite(x, y, 'office-tiles', 0);

        if (tileIndex === 1) {
          const wall = this.add.sprite(x, y, 'office-tiles', 1);
          this.walls.add(wall);
        } else if (tileIndex >= 2) {
          const obj = this.add.sprite(x, y, 'office-tiles', tileIndex);
          this.officeObjects.push(obj);
          if (tileIndex === 2 || tileIndex === 4) this.walls.add(obj);
          if (tileIndex === 4) {
            const zone = this.add.zone(x, y, tileSize + 16, tileSize + 16);
            this.interactionZones.push({ zone, type: 'coffee' });
          }
          if (tileIndex === 3) {
            const zone = this.add.zone(x, y, tileSize + 16, tileSize + 16);
            this.interactionZones.push({ zone, type: 'computer' });
          }
        }
      }
    }

    // Michi
    this.michi = this.add.sprite(7 * tileSize, 7 * tileSize, 'michi', 0);
    this.physics.add.existing(this.michi);
    const michiBody = this.michi.body as Phaser.Physics.Arcade.Body;
    michiBody.setSize(20, 20);
    michiBody.setOffset(6, 12);
    michiBody.setCollideWorldBounds(true);
    this.physics.add.collider(this.michi, this.walls);
    this.createMichiAnimations();

    // Controles teclado
    this.cursors = this.input.keyboard!.createCursorKeys();
    this.interactKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.E);

    // Mundo y cámara
    const worldWidth = this.officeMap[0].length * tileSize;
    const worldHeight = this.officeMap.length * tileSize;
    this.physics.world.setBounds(0, 0, worldWidth, worldHeight);
    this.cameras.main.setBounds(0, 0, worldWidth, worldHeight);
    this.cameras.main.startFollow(this.michi, true, 0.1, 0.1);
    this.cameras.main.setZoom(2);

    // === SISTEMAS FASE 1 ===
    this.hudSystem = new HudSystem(this);
    this.hudSystem.create();

    this.portraitSystem = new PortraitSystem();

    this.timeSystem = new TimeSystem(this);
    this.timeSystem.start({
      speed: 1,
      onTick: (_min, timeStr) => this.hudSystem.updateClock(timeStr),
      onHourChange: (hour) => this.handleHourChange(hour),
      onDayEnd: () => this.handleDayEnd()
    });

    this.karenSystem = new KarenSystem(this);
    this.karenSystem.start((msg: KarenMessage) => this.handleKarenMessage(msg));

    // === SISTEMAS FASE 2 ===
    this.audioSystem = new AudioSystem();

    this.achievementsSystem = new AchievementsSystem();
    this.achievementsSystem.setScene(this);

    this.progressionSystem = new ProgressionSystem();
    const difficulty = this.progressionSystem.getDifficulty();
    this.availableMinigames = this.mapMinigameScenes(this.progressionSystem.getAvailableMinigames());

    this.npcSystem = new NpcSystem(this);
    this.npcSystem.start((effect: NpcEffect, npcId: string) => {
      this.handleNpcEffect(effect, npcId);
    });

    this.eventsSystem = new EventsSystem(this);
    this.eventsSystem.start((event: OfficeEvent) => {
      this.handleOfficeEvent(event);
    });

    this.dialogueSystem = new DialogueSystem(this);

    // === SISTEMAS FASE 3 ===
    this.mobileControls = new MobileControls(this);
    this.mobileControls.create();

    // Degradación pasiva
    this.degradeTimer = this.time.addEvent({
      delay: 5000,
      callback: this.degradeStats,
      callbackScope: this,
      loop: true
    });

    // Diálogo de inicio
    this.time.delayedCall(2000, () => {
      this.dialogueSystem.play('game-start');
    });
  }

  private createMichiAnimations(): void {
    const directions = ['down', 'left', 'right', 'up'];
    directions.forEach((dir, i) => {
      const start = i * 4;
      this.anims.create({
        key: `michi-idle-${dir}`,
        frames: [{ key: 'michi', frame: start }],
        frameRate: 1
      });
      this.anims.create({
        key: `michi-walk-${dir}`,
        frames: this.anims.generateFrameNumbers('michi', { start, end: start + 3 }),
        frameRate: 8,
        repeat: -1
      });
    });
  }

  update(): void {
    const speed = 100;
    const body = this.michi.body as Phaser.Physics.Arcade.Body;
    body.setVelocity(0);

    let moving = false;
    let direction = 'down';

    // Input: teclado o controles móviles
    const mobile = this.mobileControls.isEnabled() ? this.mobileControls.getInput() : null;
    const left = this.cursors.left.isDown || (mobile?.left ?? false);
    const right = this.cursors.right.isDown || (mobile?.right ?? false);
    const up = this.cursors.up.isDown || (mobile?.up ?? false);
    const down = this.cursors.down.isDown || (mobile?.down ?? false);
    const interact = Phaser.Input.Keyboard.JustDown(this.interactKey) || (mobile?.interact ?? false);

    if (left) { body.setVelocityX(-speed); direction = 'left'; moving = true; }
    else if (right) { body.setVelocityX(speed); direction = 'right'; moving = true; }
    if (up) { body.setVelocityY(-speed); direction = 'up'; moving = true; }
    else if (down) { body.setVelocityY(speed); direction = 'down'; moving = true; }

    if (moving) {
      this.michi.anims.play(`michi-walk-${direction}`, true);
    } else {
      const currentAnim = this.michi.anims.currentAnim;
      const dir = currentAnim ? currentAnim.key.split('-')[2] || 'down' : 'down';
      this.michi.anims.play(`michi-idle-${dir}`, true);
    }

    if (interact) this.checkInteraction();

    // Tracking estrés bajo para logro zen
    if (this.gameState.stress < 20) {
      this.achievementsSystem.trackLowStress(this.game.loop.delta);
    } else {
      this.achievementsSystem.resetLowStress();
    }

    // Tracking energía mínima
    this.energyMin = Math.min(this.energyMin, this.gameState.energy);
    this.karenometerMax = Math.max(this.karenometerMax, this.gameState.karenometer);
  }

  private checkInteraction(): void {
    for (const { zone, type } of this.interactionZones) {
      const dist = Phaser.Math.Distance.Between(this.michi.x, this.michi.y, zone.x, zone.y);
      if (dist < 48) {
        if (type === 'coffee') this.collectCoffee(zone.x, zone.y);
        else if (type === 'computer') this.startMinigame();
        break;
      }
    }
  }

  private collectCoffee(x: number, y: number): void {
    this.gameState.coffee = Math.min(100, this.gameState.coffee + 20);
    this.gameState.energy = Math.min(100, this.gameState.energy + 10);
    this.gameState.sleep = Math.max(0, this.gameState.sleep - 15);
    this.gameState.coffeesToday++;
    this.updateHud();
    this.showFloatingText(x, y - 20, '+☕ Café');
    this.portraitSystem.setTemporaryEmotion('eating', 2000);
    this.audioSystem.playCoffee();
    this.achievementsSystem.trackCoffee();
  }

  private startMinigame(): void {
    this.timeSystem.pause();
    this.karenSystem.stop();
    this.npcSystem.stop();
    this.eventsSystem.stop();
    this.hudSystem.destroy();

    // Elegir minijuego aleatorio de los disponibles
    const scene = this.availableMinigames[Math.floor(Math.random() * this.availableMinigames.length)];
    this.scene.start(scene, { returnScene: 'OfficeScene' });
  }

  private handleKarenMessage(msg: KarenMessage): void {
    this.gameState.stress = Math.min(100, this.gameState.stress + msg.stressImpact);
    this.gameState.karenometer = Math.min(100, this.gameState.karenometer + msg.karenImpact);
    this.gameState.focus = Math.max(0, this.gameState.focus - 5);
    this.karenSystem.setKarenLevel(this.gameState.karenometer);
    this.updateHud();
    this.portraitSystem.setTemporaryEmotion('surprised', 2000);
    this.audioSystem.playTeamsNotification();
    if (this.gameState.stress >= 100) this.handleGameOver('estrés');
  }

  private handleNpcEffect(effect: NpcEffect, _npcId: string): void {
    switch (effect.type) {
      case 'stress':
        this.gameState.stress = Math.max(0, Math.min(100, this.gameState.stress + effect.value));
        break;
      case 'focus':
        this.gameState.focus = Math.max(0, Math.min(100, this.gameState.focus + effect.value));
        break;
      case 'energy':
        this.gameState.energy = Math.max(0, Math.min(100, this.gameState.energy + effect.value));
        break;
      case 'time':
        // Perder/ganar tiempo no afecta stats directamente, solo el score
        this.gameState.score += effect.value;
        break;
      case 'happiness':
        this.gameState.stress = Math.max(0, this.gameState.stress - Math.abs(effect.value));
        break;
      case 'tickets':
        this.gameState.stress = Math.min(100, this.gameState.stress + effect.value * 2);
        break;
    }
    this.updateHud();
  }

  private handleOfficeEvent(event: OfficeEvent): void {
    for (const effect of event.effects) {
      switch (effect.stat) {
        case 'energy': this.gameState.energy = Math.max(0, Math.min(100, this.gameState.energy + effect.value)); break;
        case 'coffee': this.gameState.coffee = Math.max(0, Math.min(100, this.gameState.coffee + effect.value)); break;
        case 'hunger': this.gameState.hunger = Math.max(0, Math.min(100, this.gameState.hunger + effect.value)); break;
        case 'sleep': this.gameState.sleep = Math.max(0, Math.min(100, this.gameState.sleep + effect.value)); break;
        case 'focus': this.gameState.focus = Math.max(0, Math.min(100, this.gameState.focus + effect.value)); break;
        case 'stress': this.gameState.stress = Math.max(0, Math.min(100, this.gameState.stress + effect.value)); break;
        case 'karenometer': this.gameState.karenometer = Math.max(0, Math.min(100, this.gameState.karenometer + effect.value)); break;
      }
    }
    if (event.positive) {
      this.audioSystem.playSuccess();
      this.portraitSystem.setTemporaryEmotion('happy', 3000);
    } else {
      this.audioSystem.playError();
      this.portraitSystem.setTemporaryEmotion('scared', 3000);
    }
    this.updateHud();
  }

  private handleHourChange(hour: number): void {
    if (hour === 10) {
      this.dialogueSystem.play('daily-standup');
      this.showFloatingText(this.michi.x, this.michi.y - 30, '📋 Daily Meeting...');
    } else if (hour === 13) {
      this.gameState.hunger = Math.min(100, this.gameState.hunger + 20);
      this.showFloatingText(this.michi.x, this.michi.y - 30, '🍗 Tienes hambre...');
    } else if (hour === 15) {
      this.gameState.sleep = Math.min(100, this.gameState.sleep + 25);
      this.showFloatingText(this.michi.x, this.michi.y - 30, '😴 Sueño post-comida...');
    } else if (hour === 17) {
      // Última hora: aumenta presión
      this.showFloatingText(this.michi.x, this.michi.y - 30, '⚡ ¡Última hora!');
      this.gameState.karenometer = Math.min(100, this.gameState.karenometer + 15);
    }
    this.updateHud();
  }

  private handleDayEnd(): void {
    this.karenSystem.stop();
    this.npcSystem.stop();
    this.eventsSystem.stop();
    this.degradeTimer.destroy();
    this.hudSystem.destroy();

    // Tracking logros
    const realSeconds = (Date.now() - this.gameState.startTime) / 1000;
    this.achievementsSystem.trackDayComplete(this.karenometerMax, this.energyMin);
    this.achievementsSystem.trackSpeedRun(realSeconds);
    this.achievementsSystem.trackAllMinigames(this.gameState.minigamesCompleted);

    // Progresión
    this.progressionSystem.completeLevel(this.gameState.score, this.gameState.energy);

    // Audio
    this.audioSystem.playSuccess();

    // UI Victoria
    const { width, height } = this.cameras.main;
    this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.8)
      .setScrollFactor(0).setDepth(2000);
    this.add.text(width / 2, height / 2,
      `🎉 ¡Sobreviviste!\nPuntaje: ${this.gameState.score}\n⭐ Nivel completado`,
      { fontSize: '14px', color: '#00FF88', align: 'center' }
    ).setOrigin(0.5).setScrollFactor(0).setDepth(2001);

    this.time.delayedCall(4000, () => this.scene.start('MenuScene'));
  }

  private handleGameOver(reason: string): void {
    this.karenSystem.stop();
    this.npcSystem.stop();
    this.eventsSystem.stop();
    this.timeSystem.stop();
    this.degradeTimer.destroy();
    this.hudSystem.destroy();

    this.audioSystem.playGameOver();

    const { width, height } = this.cameras.main;
    this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.8)
      .setScrollFactor(0).setDepth(2000);
    this.add.text(width / 2, height / 2,
      `😿 Michi renunció...\nRazón: ${reason}\nPuntaje: ${this.gameState.score}`,
      { fontSize: '14px', color: '#FF4444', align: 'center' }
    ).setOrigin(0.5).setScrollFactor(0).setDepth(2001);

    this.time.delayedCall(4000, () => this.scene.start('MenuScene'));
  }

  private degradeStats(): void {
    this.gameState.energy = Math.max(0, this.gameState.energy - 2);
    this.gameState.coffee = Math.max(0, this.gameState.coffee - 3);
    this.gameState.hunger = Math.min(100, this.gameState.hunger + 2);
    this.gameState.focus = Math.max(0, this.gameState.focus - 1);
    this.gameState.sleep = Math.min(100, this.gameState.sleep + 1);

    if (this.gameState.energy <= 0) this.handleGameOver('sin energía');
    if (this.gameState.hunger >= 80) this.gameState.energy = Math.max(0, this.gameState.energy - 2);

    this.updateHud();
  }

  private updateHud(): void {
    this.hudSystem.updateStat('energy', this.gameState.energy);
    this.hudSystem.updateStat('coffee', this.gameState.coffee);
    this.hudSystem.updateStat('hunger', this.gameState.hunger);
    this.hudSystem.updateStat('sleep', this.gameState.sleep);
    this.hudSystem.updateStat('focus', this.gameState.focus);
    this.hudSystem.updateStat('stress', this.gameState.stress);
    this.hudSystem.updateKarenometer(this.gameState.karenometer);

    const emotion = this.portraitSystem.getEmotion(this.gameState);
    this.hudSystem.updatePortrait(emotion);
  }

  private showFloatingText(x: number, y: number, text: string): void {
    const ft = this.add.text(x, y, text, { fontSize: '10px', color: '#00FF88' })
      .setOrigin(0.5).setDepth(500);
    this.tweens.add({ targets: ft, y: y - 30, alpha: 0, duration: 1500, onComplete: () => ft.destroy() });
  }

  private mapMinigameScenes(minigameIds: string[]): string[] {
    const map: Record<string, string> = {
      'git-basic': 'GitBasicScene',
      'git-staging': 'GitStagingScene',
      'git-branches': 'GitBranchesScene',
      'git-merge': 'GitMergeScene',
      'git-conflict': 'GitConflictScene',
    };
    return minigameIds.map(id => map[id]).filter(Boolean);
  }
}
