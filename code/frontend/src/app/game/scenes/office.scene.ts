import * as Phaser from 'phaser';
import { SpriteGenerator } from '../assets/sprite-generator';
import { loadMichiSpritesheet, createMichiAnimations, MichiSprite, MichiState } from '../assets/michi-sprite-loader';
import { KarenSystem, KarenMessage } from '../systems/karen-system';
import { TimeSystem } from '../systems/time-system';
import { HudSystem } from '../systems/hud-system';
import { PortraitSystem } from '../systems/portrait-system';
import { NpcSystem, NpcEffect } from '../systems/npc-system';
import { EventsSystem, OfficeEvent } from '../systems/events-system';
import { DialogueSystem } from '../systems/dialogue-system';
import { AchievementsSystem } from '../systems/achievements-system';
import { AudioSystem } from '../systems/audio-system';
import { ProgressionSystem } from '../systems/progression-system';
import { ChoiceDialogSystem, ChoiceOption } from '../systems/choice-dialog-system';

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
  private choiceDialogSystem!: ChoiceDialogSystem; // Sistema para Michi News interactivo

  // Estado del juego
  private gameState = {
    energy: 80,
    coffee: 50,
    hunger: 30,
    sleep: 20,
    focus: 70,
    stress: 10,
    karenometer: 0,
    happiness: 50, // Felicidad del personaje
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
    
    // Cargar nuevo spritesheet de Michi con animaciones (generado con DALL-E)
    loadMichiSpritesheet(this);
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

    // Michi - Usando el nuevo spritesheet de DALL-E
    // Imagen: 1024x2048, frames de 256x256 px
    this.michi = this.add.sprite(7 * tileSize, 7 * tileSize, 'michi-spritesheet', 0);
    this.michi.setScale(0.15); // 256 * 0.15 ≈ 38px, buen tamaño para el juego
    this.physics.add.existing(this.michi);
    const michiBody = this.michi.body as Phaser.Physics.Arcade.Body;
    michiBody.setSize(180, 200);
    michiBody.setOffset(38, 28);
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
    this.choiceDialogSystem = new ChoiceDialogSystem(this);
    
    // Iniciar NPC system con soporte para NPCs con elección (Michi News)
    this.npcSystem.start(
      (effect: NpcEffect, npcId: string) => {
        this.handleNpcEffect(effect, npcId);
      },
      () => {
        // Callback para Michi News: mostrar diálogo con elección
        this.showMichiNewsDialog();
      }
    );

    this.eventsSystem = new EventsSystem(this);
    this.eventsSystem.start((event: OfficeEvent) => {
      this.handleOfficeEvent(event);
    });

    this.dialogueSystem = new DialogueSystem(this);

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
    // Usar las animaciones del nuevo spritesheet de DALL-E
    // El spritesheet tiene 4 columnas x 8 filas, cada frame de 256x256
    
    // Fila 0: Idle (frames 0-3)
    if (!this.anims.exists('michi-idle')) {
      this.anims.create({
        key: 'michi-idle',
        frames: this.anims.generateFrameNumbers('michi-spritesheet', { start: 0, end: 3 }),
        frameRate: 4,
        repeat: -1
      });
    }

    // Fila 1: Walk (frames 4-7)
    if (!this.anims.exists('michi-walk')) {
      this.anims.create({
        key: 'michi-walk',
        frames: this.anims.generateFrameNumbers('michi-spritesheet', { start: 4, end: 7 }),
        frameRate: 8,
        repeat: -1
      });
    }

    // Fila 2: Sleep (frames 8-10)
    if (!this.anims.exists('michi-sleep')) {
      this.anims.create({
        key: 'michi-sleep',
        frames: this.anims.generateFrameNumbers('michi-spritesheet', { start: 8, end: 10 }),
        frameRate: 2,
        repeat: -1
      });
    }

    // Fila 3: Work (frames 12-13) + Coffee (frames 14-15)
    if (!this.anims.exists('michi-work')) {
      this.anims.create({
        key: 'michi-work',
        frames: this.anims.generateFrameNumbers('michi-spritesheet', { start: 12, end: 13 }),
        frameRate: 4,
        repeat: -1
      });
    }
    if (!this.anims.exists('michi-coffee')) {
      this.anims.create({
        key: 'michi-coffee',
        frames: this.anims.generateFrameNumbers('michi-spritesheet', { start: 14, end: 15 }),
        frameRate: 3,
        repeat: -1
      });
    }

    // Fila 4: Stressed (frames 16-19)
    if (!this.anims.exists('michi-stressed')) {
      this.anims.create({
        key: 'michi-stressed',
        frames: this.anims.generateFrameNumbers('michi-spritesheet', { start: 16, end: 19 }),
        frameRate: 6,
        repeat: -1
      });
    }

    // Fila 5: Confused (frames 20-21) + Sad (frames 22-23)
    if (!this.anims.exists('michi-confused')) {
      this.anims.create({
        key: 'michi-confused',
        frames: this.anims.generateFrameNumbers('michi-spritesheet', { start: 20, end: 21 }),
        frameRate: 4,
        repeat: 0
      });
    }
    if (!this.anims.exists('michi-sad')) {
      this.anims.create({
        key: 'michi-sad',
        frames: this.anims.generateFrameNumbers('michi-spritesheet', { start: 22, end: 23 }),
        frameRate: 3,
        repeat: -1
      });
    }

    // Fila 6: Excited (frames 24-25) + Celebrate (frames 26-27)
    if (!this.anims.exists('michi-excited')) {
      this.anims.create({
        key: 'michi-excited',
        frames: this.anims.generateFrameNumbers('michi-spritesheet', { start: 24, end: 25 }),
        frameRate: 6,
        repeat: 0
      });
    }
    if (!this.anims.exists('michi-celebrate')) {
      this.anims.create({
        key: 'michi-celebrate',
        frames: this.anims.generateFrameNumbers('michi-spritesheet', { start: 26, end: 27 }),
        frameRate: 4,
        repeat: 0
      });
    }

    // Fila 7: Phone (frames 28-29)
    if (!this.anims.exists('michi-phone')) {
      this.anims.create({
        key: 'michi-phone',
        frames: this.anims.generateFrameNumbers('michi-spritesheet', { start: 28, end: 29 }),
        frameRate: 3,
        repeat: -1
      });
    }
  }

  update(): void {
    // Pausar el juego si hay un diálogo de elección activo
    if (this.choiceDialogSystem && this.choiceDialogSystem.isDialogActive()) {
      return;
    }

    const speed = 100;
    const body = this.michi.body as Phaser.Physics.Arcade.Body;
    body.setVelocity(0);

    let moving = false;

    // Input: teclado o controles móviles (HTML overlay via window)
    const mobile = (window as unknown as Record<string, unknown>)['__michiMobileInput'] as { left: boolean; right: boolean; up: boolean; down: boolean; interact: boolean } | undefined;
    const left = this.cursors.left.isDown || (mobile?.left ?? false);
    const right = this.cursors.right.isDown || (mobile?.right ?? false);
    const up = this.cursors.up.isDown || (mobile?.up ?? false);
    const down = this.cursors.down.isDown || (mobile?.down ?? false);
    const interact = Phaser.Input.Keyboard.JustDown(this.interactKey) || (mobile?.interact ?? false);

    if (left) { body.setVelocityX(-speed); moving = true; this.michi.setFlipX(true); }
    else if (right) { body.setVelocityX(speed); moving = true; this.michi.setFlipX(false); }
    if (up) { body.setVelocityY(-speed); moving = true; }
    else if (down) { body.setVelocityY(speed); moving = true; }

    if (moving) {
      this.michi.anims.play('michi-walk', true);
    } else {
      this.michi.anims.play('michi-idle', true);
    }

    if (interact) {
      this.checkInteraction();
      // Reset interact para que no se dispare múltiples veces
      if (mobile) mobile.interact = false;
    }

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

    // Mostrar notificación en HUD (sin zoom)
    this.hudSystem.showNotification({
      title: 'Karen',
      text: msg.text,
      color: '#FF6B6B',
      icon: '💬',
      subtext: `+${msg.stressImpact} estrés`,
      position: 'bottom-center',
      duration: 4000
    });

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

  /**
   * Muestra el diálogo interactivo de Michi News con opciones de elección.
   */
  private showMichiNewsDialog(): void {
    // Pausar sistemas mientras se muestra el diálogo
    this.timeSystem.pause();
    this.karenSystem.stop();
    this.eventsSystem.stop();

    // Mostrar diálogo con elección
    this.choiceDialogSystem.show((effects, choiceText) => {
      this.handleMichiNewsChoice(effects, choiceText);
    });
  }

  /**
   * Maneja la elección del jugador en el diálogo de Michi News.
   */
  private handleMichiNewsChoice(effects: ChoiceOption['effects'], choiceText: string): void {
    // Aplicar efectos de la elección
    if (effects.time !== undefined) {
      this.gameState.score += effects.time;
    }
    if (effects.happiness !== undefined) {
      // Felicidad aumenta directamente y también reduce estrés
      this.gameState.happiness = Math.min(100, this.gameState.happiness + effects.happiness);
      this.gameState.stress = Math.max(0, this.gameState.stress - Math.floor(effects.happiness / 2));
    }
    if (effects.stress !== undefined) {
      this.gameState.stress = Math.min(100, this.gameState.stress + effects.stress);
    }

    this.updateHud();

    // Mostrar notificación del resultado
    const effectParts: string[] = [];
    if (effects.time !== undefined) {
      effectParts.push(effects.time > 0 ? `+${effects.time}min` : `${effects.time}min`);
    }
    if (effects.happiness !== undefined) {
      effectParts.push(`+${effects.happiness}😻`);
    }
    if (effects.stress !== undefined) {
      effectParts.push(`+${effects.stress}😰`);
    }

    this.hudSystem.showNotification({
      title: 'Michi News',
      text: choiceText === 'Ignorar' ? '¡Mejor sigo trabajando!' : '¡Qué chisme!',
      color: '#CC66FF',
      icon: '🐱📰',
      subtext: effectParts.join(' '),
      position: 'bottom-center',
      duration: 3000
    });

    // Reanudar sistemas
    this.timeSystem.resume();
    this.karenSystem.start((msg: KarenMessage) => this.handleKarenMessage(msg));
    this.eventsSystem.start((event: OfficeEvent) => this.handleOfficeEvent(event));

    // Liberar cooldown del NPC system
    this.npcSystem.releaseCooldown();

    // Verificar game over por estrés
    if (this.gameState.stress >= 100) {
      this.handleGameOver('estrés');
    }
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

    // Notificación en HUD
    this.hudSystem.showNotification({
      title: event.name,
      text: event.description,
      color: event.positive ? '#00FF88' : '#FF4444',
      icon: event.icon,
      position: 'bottom-center',
      duration: 4000
    });

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
