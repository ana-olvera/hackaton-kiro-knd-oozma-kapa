import * as Phaser from 'phaser';
import { SpriteGenerator } from '../assets/sprite-generator';
import { KarenSystem, KarenMessage } from '../systems/karen-system';
import { TimeSystem } from '../systems/time-system';
import { HudSystem } from '../systems/hud-system';

/**
 * Escena principal de la oficina.
 * Integra todos los sistemas: movimiento, Karen, tiempo, HUD y transición a minijuegos.
 */
export class OfficeScene extends Phaser.Scene {
  private michi!: Phaser.GameObjects.Sprite;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private officeObjects: Phaser.GameObjects.Sprite[] = [];
  private interactionZones: { zone: Phaser.GameObjects.Zone; type: string }[] = [];
  private interactKey!: Phaser.Input.Keyboard.Key;

  // Sistemas
  private karenSystem!: KarenSystem;
  private timeSystem!: TimeSystem;
  private hudSystem!: HudSystem;

  // Estado del juego
  private gameState = {
    energy: 80,
    coffee: 50,
    hunger: 30,
    sleep: 20,
    focus: 70,
    stress: 10,
    karenometer: 0,
    score: 0
  };

  // Degradación pasiva de stats
  private degradeTimer!: Phaser.Time.TimerEvent;

  // Layout de la oficina (0=piso, 1=pared, 2=escritorio, 3=compu, 4=cafetera, 5=silla)
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
    if (data?.fromMinigame && data.minigameResult) {
      this.gameState.score += 100;
      this.gameState.stress = Math.max(0, this.gameState.stress - 10);
      this.gameState.focus = Math.min(100, this.gameState.focus + 15);
    }
  }

  preload(): void {
    SpriteGenerator.generateAll(this);
  }

  create(): void {
    const tileSize = 32;

    // Crear grupos de física
    this.walls = this.physics.add.staticGroup();

    // Renderizar tilemap
    for (let row = 0; row < this.officeMap.length; row++) {
      for (let col = 0; col < this.officeMap[row].length; col++) {
        const tileIndex = this.officeMap[row][col];
        const x = col * tileSize + tileSize / 2;
        const y = row * tileSize + tileSize / 2;

        // Siempre poner piso debajo
        this.add.sprite(x, y, 'office-tiles', 0);

        if (tileIndex === 1) {
          const wall = this.add.sprite(x, y, 'office-tiles', 1);
          this.walls.add(wall);
        } else if (tileIndex >= 2) {
          const obj = this.add.sprite(x, y, 'office-tiles', tileIndex);
          this.officeObjects.push(obj);

          if (tileIndex === 2 || tileIndex === 4) {
            this.walls.add(obj);
          }

          // Zonas interactuables
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

    // Crear a Michi
    this.michi = this.add.sprite(7 * tileSize, 7 * tileSize, 'michi', 0);
    this.physics.add.existing(this.michi);
    const michiBody = this.michi.body as Phaser.Physics.Arcade.Body;
    michiBody.setSize(20, 20);
    michiBody.setOffset(6, 12);
    michiBody.setCollideWorldBounds(true);

    this.physics.add.collider(this.michi, this.walls);
    this.createMichiAnimations();

    // Controles
    this.cursors = this.input.keyboard!.createCursorKeys();
    this.interactKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.E);

    // Configurar mundo y cámara
    const worldWidth = this.officeMap[0].length * tileSize;
    const worldHeight = this.officeMap.length * tileSize;
    this.physics.world.setBounds(0, 0, worldWidth, worldHeight);
    this.cameras.main.setBounds(0, 0, worldWidth, worldHeight);
    this.cameras.main.startFollow(this.michi, true, 0.1, 0.1);
    this.cameras.main.setZoom(2);

    // === INICIAR SISTEMAS ===

    // HUD
    this.hudSystem = new HudSystem(this);
    this.hudSystem.create();

    // Sistema de tiempo
    this.timeSystem = new TimeSystem(this);
    this.timeSystem.start({
      speed: 1, // 1 seg real = 1 min juego
      onTick: (_minutes, timeString) => {
        this.hudSystem.updateClock(timeString);
      },
      onHourChange: (hour) => {
        this.handleHourChange(hour);
      },
      onDayEnd: () => {
        this.handleDayEnd();
      }
    });

    // Sistema de Karen
    this.karenSystem = new KarenSystem(this);
    this.karenSystem.start((msg: KarenMessage) => {
      this.handleKarenMessage(msg);
    });

    // Degradación pasiva de stats
    this.degradeTimer = this.time.addEvent({
      delay: 5000, // Cada 5 segundos
      callback: this.degradeStats,
      callbackScope: this,
      loop: true
    });

    // Texto de ayuda
    this.add.text(
      worldWidth / 2, worldHeight - 20,
      'Flechas: mover | E: interactuar (compu=minijuego, cafetera=café)',
      { fontSize: '8px', color: '#666666' }
    ).setOrigin(0.5);
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

    if (this.cursors.left.isDown) {
      body.setVelocityX(-speed);
      direction = 'left';
      moving = true;
    } else if (this.cursors.right.isDown) {
      body.setVelocityX(speed);
      direction = 'right';
      moving = true;
    }

    if (this.cursors.up.isDown) {
      body.setVelocityY(-speed);
      direction = 'up';
      moving = true;
    } else if (this.cursors.down.isDown) {
      body.setVelocityY(speed);
      direction = 'down';
      moving = true;
    }

    if (moving) {
      this.michi.anims.play(`michi-walk-${direction}`, true);
    } else {
      const currentAnim = this.michi.anims.currentAnim;
      if (currentAnim) {
        const dir = currentAnim.key.split('-')[2] || 'down';
        this.michi.anims.play(`michi-idle-${dir}`, true);
      } else {
        this.michi.anims.play('michi-idle-down', true);
      }
    }

    if (Phaser.Input.Keyboard.JustDown(this.interactKey)) {
      this.checkInteraction();
    }
  }

  private checkInteraction(): void {
    const michiX = this.michi.x;
    const michiY = this.michi.y;

    for (const { zone, type } of this.interactionZones) {
      const dist = Phaser.Math.Distance.Between(michiX, michiY, zone.x, zone.y);
      if (dist < 48) {
        if (type === 'coffee') {
          this.collectCoffee(zone.x, zone.y);
        } else if (type === 'computer') {
          this.startMinigame();
        }
        break;
      }
    }
  }

  private collectCoffee(x: number, y: number): void {
    this.gameState.coffee = Math.min(100, this.gameState.coffee + 20);
    this.gameState.energy = Math.min(100, this.gameState.energy + 10);
    this.gameState.sleep = Math.max(0, this.gameState.sleep - 15);
    this.updateHud();
    this.showFloatingText(x, y - 20, '+☕ Café');
  }

  private startMinigame(): void {
    // Pausar sistemas
    this.timeSystem.pause();
    this.karenSystem.stop();

    // Ir al minijuego
    this.scene.start('GitBasicScene', { returnScene: 'OfficeScene' });
  }

  private handleKarenMessage(msg: KarenMessage): void {
    this.gameState.stress = Math.min(100, this.gameState.stress + msg.stressImpact);
    this.gameState.karenometer = Math.min(100, this.gameState.karenometer + msg.karenImpact);
    this.gameState.focus = Math.max(0, this.gameState.focus - 5);

    this.karenSystem.setKarenLevel(this.gameState.karenometer);
    this.updateHud();

    // Si el estrés llega a 100, game over
    if (this.gameState.stress >= 100) {
      this.handleGameOver('estrés');
    }
  }

  private handleHourChange(hour: number): void {
    // Eventos por hora
    if (hour === 10) {
      this.showFloatingText(this.michi.x, this.michi.y - 30, '📋 Daily Meeting en 5 min...');
    } else if (hour === 13) {
      this.gameState.hunger = Math.min(100, this.gameState.hunger + 20);
      this.showFloatingText(this.michi.x, this.michi.y - 30, '🍗 Tienes hambre...');
    } else if (hour === 15) {
      this.gameState.sleep = Math.min(100, this.gameState.sleep + 25);
      this.showFloatingText(this.michi.x, this.michi.y - 30, '😴 Sueño post-comida...');
    }
    this.updateHud();
  }

  private handleDayEnd(): void {
    // ¡Sobreviviste!
    this.karenSystem.stop();
    this.degradeTimer.destroy();

    const { width, height } = this.cameras.main;
    const overlay = this.add.rectangle(
      this.cameras.main.scrollX + width / 2,
      this.cameras.main.scrollY + height / 2,
      width, height, 0x000000, 0.8
    );
    overlay.setScrollFactor(0);
    overlay.setDepth(2000);

    const text = this.add.text(
      this.cameras.main.scrollX + width / 2,
      this.cameras.main.scrollY + height / 2,
      '🎉 ¡Sobreviviste al Lunes!\nPuntaje: ' + this.gameState.score,
      { fontSize: '16px', color: '#00FF88', align: 'center' }
    ).setOrigin(0.5).setScrollFactor(0).setDepth(2001);

    this.time.delayedCall(4000, () => {
      this.scene.start('MenuScene');
    });
  }

  private handleGameOver(reason: string): void {
    this.karenSystem.stop();
    this.timeSystem.stop();
    this.degradeTimer.destroy();

    const { width, height } = this.cameras.main;
    const overlay = this.add.rectangle(
      this.cameras.main.scrollX + width / 2,
      this.cameras.main.scrollY + height / 2,
      width, height, 0x000000, 0.8
    );
    overlay.setScrollFactor(0);
    overlay.setDepth(2000);

    this.add.text(
      this.cameras.main.scrollX + width / 2,
      this.cameras.main.scrollY + height / 2,
      `😿 Michi renunció...\nRazón: ${reason}\nPuntaje: ${this.gameState.score}`,
      { fontSize: '14px', color: '#FF4444', align: 'center' }
    ).setOrigin(0.5).setScrollFactor(0).setDepth(2001);

    this.time.delayedCall(4000, () => {
      this.scene.start('MenuScene');
    });
  }

  private degradeStats(): void {
    // Degradación pasiva con el tiempo
    this.gameState.energy = Math.max(0, this.gameState.energy - 2);
    this.gameState.coffee = Math.max(0, this.gameState.coffee - 3);
    this.gameState.hunger = Math.min(100, this.gameState.hunger + 2);
    this.gameState.focus = Math.max(0, this.gameState.focus - 1);

    // El sueño sube lento
    this.gameState.sleep = Math.min(100, this.gameState.sleep + 1);

    // Si la energía llega a 0, game over
    if (this.gameState.energy <= 0) {
      this.handleGameOver('sin energía');
    }

    // Si el hambre llega a 100, pierde energía más rápido
    if (this.gameState.hunger >= 80) {
      this.gameState.energy = Math.max(0, this.gameState.energy - 2);
    }

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
  }

  private showFloatingText(x: number, y: number, text: string): void {
    const floatingText = this.add.text(x, y, text, {
      fontSize: '10px',
      color: '#00FF88'
    }).setOrigin(0.5).setDepth(500);

    this.tweens.add({
      targets: floatingText,
      y: y - 30,
      alpha: 0,
      duration: 1500,
      onComplete: () => floatingText.destroy()
    });
  }
}
