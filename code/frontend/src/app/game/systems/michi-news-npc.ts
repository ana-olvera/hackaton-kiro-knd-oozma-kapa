import * as Phaser from 'phaser';

/**
 * Sistema NPC de Michi News - Periodista Chismoso
 * 
 * Características:
 * - Cada 45s intenta acercarse a Michi para contarle chismes
 * - Da 15s para que Michi responda con tecla O
 * - Si no responde: se pone triste y regresa a su escritorio
 * - Si responde: +felicidad, -estrés, -tiempo (productividad)
 * - Puede recibir llamados de atención de Karen
 */

interface MichiNewsConfig {
  deskPosition: { x: number; y: number };
  approachInterval: number;     // 45 segundos entre intentos
  waitTime: number;            // 15 segundos esperando respuesta
  retryDelay: number;          // 30 segundos antes de reintentar
  walkSpeed: number;
  interactionDistance: number;
}

type MichiNewsState = 
  | 'at_desk'           // En su escritorio trabajando
  | 'walking_to_michi'  // Caminando hacia Michi con chisme
  | 'waiting_response'  // Esperando que Michi presione O
  | 'telling_gossip'    // Contando el chisme (animado)
  | 'sad_returning'     // Triste regresando al escritorio
  | 'happy_returning';  // Contento regresando después de contar chisme

export class MichiNewsNpc {
  private scene: Phaser.Scene;
  private sprite: Phaser.GameObjects.Sprite;
  private body: Phaser.Physics.Arcade.Body;
  
  private config: MichiNewsConfig;
  private currentState: MichiNewsState = 'at_desk';
  private michiSprite: Phaser.GameObjects.Sprite;
  
  // Control de tiempo
  private lastApproachTime: number = 0;
  private waitStartTime: number = 0;
  private stateStartTime: number = 0;
  
  // Movimiento
  private targetPosition: { x: number; y: number } | null = null;
  private currentDirection: Phaser.Math.Vector2 = new Phaser.Math.Vector2(0, 0);
  
  // Chisme actual
  private currentGossip: string = '';
  
  // Referencias externas
  private walls: Phaser.Physics.Arcade.StaticGroup;
  private onGossipCallback: ((effects: any, message: string) => void) | null = null;

  constructor(
    scene: Phaser.Scene,
    sprite: Phaser.GameObjects.Sprite,
    deskX: number,
    deskY: number,
    walls: Phaser.Physics.Arcade.StaticGroup,
    michiSprite: Phaser.GameObjects.Sprite
  ) {
    this.scene = scene;
    this.sprite = sprite;
    this.walls = walls;
    this.michiSprite = michiSprite;
    
    // Configuración de comportamiento
    this.config = {
      deskPosition: { x: deskX, y: deskY },
      approachInterval: 45000,  // 45 segundos
      waitTime: 15000,         // 15 segundos esperando
      retryDelay: 30000,       // 30 segundos si no responde
      walkSpeed: 50,           // Velocidad normal
      interactionDistance: 60  // Distancia para mostrar chisme
    };
    
    // Configurar física del sprite existente
    this.scene.physics.add.existing(this.sprite);
    this.body = this.sprite.body as Phaser.Physics.Arcade.Body;
    this.body.setSize(20, 25);
    this.body.setOffset(10, 15);
    this.body.setCollideWorldBounds(true);
    
    // Configurar colisiones
    this.scene.physics.add.collider(this.sprite, walls);
    this.scene.physics.add.collider(this.sprite, michiSprite);
    
    // Inicializar tiempos
    const currentTime = scene.time.now;
    this.lastApproachTime = currentTime;
    this.stateStartTime = currentTime;
    
    // Crear animaciones si no existen
    this.createMichiNewsAnimations();
    
    // Empezar en estado idle en el escritorio
    this.sprite.play('michi-news-idle', true);
    
    console.log('[MichiNewsNpc] Michi News NPC creado');
  }
  /**
   * Crea las animaciones de Michi News
   */
  private createMichiNewsAnimations(): void {
    const anims = this.scene.anims;
    
    // Solo crear si no existen
    if (!anims.exists('michi-news-idle')) {
      // Idle (fila 1: frames 0-3)
      anims.create({
        key: 'michi-news-idle',
        frames: anims.generateFrameNumbers('michi-news-spritesheet', { start: 0, end: 3 }),
        frameRate: 6,
        repeat: -1
      });
      
      // Walk (fila 2: frames 4-7)
      anims.create({
        key: 'michi-news-walk',
        frames: anims.generateFrameNumbers('michi-news-spritesheet', { start: 4, end: 7 }),
        frameRate: 8,
        repeat: -1
      });
      
      // Sad (fila 6: frames 20-23) - según especificación
      anims.create({
        key: 'michi-news-sad',
        frames: anims.generateFrameNumbers('michi-news-spritesheet', { start: 20, end: 23 }),
        frameRate: 4,
        repeat: -1
      });
      
      // Excited/Happy (fila 7: frames 24-27)
      anims.create({
        key: 'michi-news-excited',
        frames: anims.generateFrameNumbers('michi-news-spritesheet', { start: 24, end: 27 }),
        frameRate: 6,
        repeat: -1
      });
      
      console.log('[MichiNewsNpc] Animaciones de Michi News creadas');
    }
  }
  /**
   * Lista de chismes de oficina (inspirados en memes de godines)
   */
  private getRandomGossip(): string {
    const gossips = [
      "¿Ya supiste que en contabilidad están usando Excel 2003?",
      "Dicen que el de sistemas tiene 50 tabs abiertas en Chrome",
      "Vi que alguien calentó pescado en el microondas",
      "El jefe preguntó si sabemos usar PowerPoint... en 2024",
      "Dicen que van a cambiar el sistema... otra vez",
      "Alguien se llevó mi taza favorita de la cocina",
      "El aire acondicionado nunca está en la temperatura correcta",
      "La máquina de café se descompuso otra vez",
      "El elevador hace ruidos como de R2-D2",
      "¿Supiste que el wifi se llama 'OficinaSecreta123'?",
      "Vi que alguien tiene 99+ notificaciones sin leer",
      "La impresora dice que tiene papel pero no imprime",
      "¿Ya viste la nueva política de home office?",
      "Hay una gotera que solo aparece cuando llueve",
      "Nadie sabe la contraseña del router principal",
      "Van a hacer team building... con trust falls",
      "Alguien dejó su lunch una semana en el refrigerador",
      "El proyector solo funciona los martes",
      "¿Notaste que la planta de entrada es artificial?",
      "Dicen que el parking ya no será gratuito"
    ];
    
    return gossips[Math.floor(Math.random() * gossips.length)];
  }
  /**
   * Actualiza el comportamiento de Michi News cada frame
   */
  update(time: number, delta: number): void {
    switch (this.currentState) {
      case 'at_desk':
        this.updateAtDesk(time);
        break;
      case 'walking_to_michi':
        this.updateWalkingToMichi();
        break;
      case 'waiting_response':
        this.updateWaitingResponse(time);
        break;
      case 'telling_gossip':
        this.updateTellingGossip(time);
        break;
      case 'sad_returning':
      case 'happy_returning':
        this.updateReturningToDesk();
        break;
    }
  }

  /**
   * Comportamiento en el escritorio - cada 45s intenta acercarse
   */
  private updateAtDesk(time: number): void {
    // Detener movimiento
    this.body.setVelocity(0, 0);
    
    // Verificar si es momento de intentar acercarse
    if (time - this.lastApproachTime >= this.config.approachInterval) {
      this.startApproachingMichi(time);
    }
  }

  /**
   * Inicia el acercamiento a Michi con un chisme
   */
  private startApproachingMichi(time: number): void {
    this.currentState = 'walking_to_michi';
    this.stateStartTime = time;
    this.currentGossip = this.getRandomGossip();
    
    // Posición cerca de Michi
    const michiPos = { x: this.michiSprite.x, y: this.michiSprite.y };
    this.targetPosition = {
      x: michiPos.x + (Math.random() - 0.5) * 40, // Posición aleatoria cerca
      y: michiPos.y + (Math.random() - 0.5) * 40
    };
    
    this.sprite.play('michi-news-walk', true);
    console.log('[MichiNewsNpc] Michi News se acerca con chisme:', this.currentGossip);
  }

  /**
   * Actualiza cuando está esperando respuesta
   */
  private updateWaitingResponse(time: number): void {
    // Mantener posición y animación excited
    this.body.setVelocity(0, 0);
    
    // Verificar timeout (se maneja en showGossipBubble)
    // La lógica de timeout está en el delayedCall
  }

  /**
   * Actualiza cuando está contando el chisme
   */
  private updateTellingGossip(time: number): void {
    this.body.setVelocity(0, 0);
    // La animación y regreso se manejan en onGossipAccepted
  }

  /**
   * Actualiza el movimiento hacia Michi
   */
  private updateWalkingToMichi(): void {
    if (!this.targetPosition) return;
    
    const currentPos = { x: this.sprite.x, y: this.sprite.y };
    const distance = Phaser.Math.Distance.Between(
      currentPos.x, currentPos.y,
      this.targetPosition.x, this.targetPosition.y
    );
    
    if (distance < 20) {
      this.showGossipBubble(); // Llegó cerca de Michi - mostrar chisme
    } else {
      this.moveTowardsTarget(); // Continuar caminando
    }
  }

  /**
   * Muestra el globo de chisme y espera respuesta
   */
  private showGossipBubble(): void {
    this.currentState = 'waiting_response';
    this.waitStartTime = this.scene.time.now;
    this.body.setVelocity(0, 0);
    this.sprite.play('michi-news-excited', true);
    
    console.log('[MichiNewsNpc] Mostrando chisme:', this.currentGossip);
    
    // Mostrar globo interactivo con botón Aceptar
    if ((this.scene as any).interactiveBubble) {
      const bubble = (this.scene as any).interactiveBubble as any;
      bubble.show(this.sprite, {
        message: this.currentGossip,
        character: {
          name: 'Michi News',
          color: '#FF6B6B', // Rosa/rojo para Michi News
          accentColor: '#FFD93D' // Amarillo para los botones
        },
        buttons: {
          accept: {
            text: 'Aceptar',
            callback: () => this.onGossipAccepted()
          }
        },
        autoHide: false,
        effects: {
          happiness: 5,
          stress: -3,
          energy: -2
        }
      });
    }
    
    // Auto-rechazar después del tiempo de espera
    this.scene.time.delayedCall(this.config.waitTime, () => {
      if (this.currentState === 'waiting_response') {
        this.onGossipRejected();
      }
    });
  }

  /**
   * Mueve hacia el objetivo actual
   */
  private moveTowardsTarget(): void {
    if (!this.targetPosition) return;
    
    const currentPos = { x: this.sprite.x, y: this.sprite.y };
    this.currentDirection.x = this.targetPosition.x - currentPos.x;
    this.currentDirection.y = this.targetPosition.y - currentPos.y;
    this.currentDirection.normalize();
    
    this.body.setVelocity(
      this.currentDirection.x * this.config.walkSpeed,
      this.currentDirection.y * this.config.walkSpeed
    );
    
    this.sprite.setFlipX(this.currentDirection.x < 0);
  }

  /**
   * Actualiza el regreso al escritorio
   */
  private updateReturningToDesk(): void {
    if (!this.targetPosition) return;
    
    const currentPos = { x: this.sprite.x, y: this.sprite.y };
    const distance = Phaser.Math.Distance.Between(
      currentPos.x, currentPos.y,
      this.targetPosition.x, this.targetPosition.y
    );
    
    if (distance < 20) {
      this.arriveAtDesk();
    } else {
      this.moveTowardsTarget();
    }
  }

  /**
   * Llega al escritorio
   */
  private arriveAtDesk(): void {
    this.currentState = 'at_desk';
    this.body.setVelocity(0, 0);
    this.sprite.setPosition(this.config.deskPosition.x, this.config.deskPosition.y);
    this.sprite.play('michi-news-idle', true);
    this.targetPosition = null;
  }

  /**
   * Cuando Michi acepta escuchar el chisme
   */
  onGossipAccepted(): void {
    this.currentState = 'telling_gossip';
    this.stateStartTime = this.scene.time.now;
    this.sprite.play('michi-news-excited', true);
    
    // Aplicar efectos
    const effects = { happiness: 5, stress: -3, energy: -2 };
    if (this.onGossipCallback) {
      this.onGossipCallback(effects, `Michi News: "${this.currentGossip}"`);
    }
    
    // Después de 3 segundos, regresar feliz
    this.scene.time.delayedCall(3000, () => {
      this.startReturningToDesk('happy_returning');
    });
    
    console.log('[MichiNewsNpc] Chisme aceptado - Michi News está feliz');
  }

  /**
   * Cuando Michi rechaza o no responde
   */
  private onGossipRejected(): void {
    this.currentState = 'sad_returning';
    this.sprite.play('michi-news-sad', true);
    this.startReturningToDesk('sad_returning');
    
    console.log('[MichiNewsNpc] Chisme rechazado - Michi News está triste');
  }

  /**
   * Inicia el regreso al escritorio
   */
  private startReturningToDesk(state: 'sad_returning' | 'happy_returning'): void {
    this.currentState = state;
    this.targetPosition = { ...this.config.deskPosition };
    this.sprite.play('michi-news-walk', true);
    
    // Programar próximo intento
    const delay = state === 'sad_returning' ? this.config.retryDelay : this.config.approachInterval;
    this.lastApproachTime = this.scene.time.now + delay;
  }

  // Métodos públicos para integración
  setGossipCallback(callback: (effects: any, message: string) => void): void {
    this.onGossipCallback = callback;
  }

  getCurrentState(): MichiNewsState {
    return this.currentState;
  }

  canBeCalledByKaren(): boolean {
    return this.currentState === 'walking_to_michi' || this.currentState === 'waiting_response';
  }

  onKarenScolds(): void {
    console.log('[MichiNewsNpc] Karen regañó a Michi News');
    this.startReturningToDesk('sad_returning');
  }
}