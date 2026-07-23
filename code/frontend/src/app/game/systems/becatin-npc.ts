import * as Phaser from 'phaser';
import { BecatinSprite, BecatinState, getBecatinStateFromResult } from '../assets/becatin-sprite-loader';

/**
 * Sistema NPC de Becatín - Maneja el comportamiento del becario en la oficina
 * 
 * Características:
 * - Pasa más tiempo sentado en su escritorio que caminando
 * - Realiza acciones aleatorias que pueden tener consecuencias buenas o malas
 * - Interacciones automáticas cuando Michi se acerca
 * - Estados emocionales basados en el resultado de sus acciones
 */

interface BecatinAction {
  id: string;
  name: string;
  description: string;
  probability: number;      // Probabilidad de que ocurra (0-1)
  successRate: number;      // Probabilidad de éxito (0-1)
  workingAnimation: boolean; // Si requiere animación de trabajo
  effects: {
    success: { stress?: number; energy?: number; focus?: number; happiness?: number };
    failure: { stress?: number; energy?: number; focus?: number; happiness?: number };
  };
  messages: {
    success: string[];
    failure: string[];
  };
}

interface BecatinBehaviorConfig {
  deskPosition: { x: number; y: number };        // Posición del escritorio
  deskTime: { min: number; max: number };        // Tiempo en escritorio (ms)
  walkTime: { min: number; max: number };        // Tiempo caminando (ms)
  actionInterval: { min: number; max: number };  // Intervalo entre acciones (ms)
  interactionDistance: number;                   // Distancia para interacción con Michi
  walkSpeed: number;                            // Velocidad de caminar
  walkRadius: number;                           // Radio de patrullaje desde escritorio
}

type BecatinBehaviorState = 'at_desk' | 'walking' | 'returning_to_desk' | 'performing_action';

export class BecatinNpc {
  private scene: Phaser.Scene;
  private becatinSprite: BecatinSprite;
  private body: Phaser.Physics.Arcade.Body;
  
  // Configuración de comportamiento
  private config: BecatinBehaviorConfig;
  
  // Estado del comportamiento
  private behaviorState: BecatinBehaviorState = 'at_desk';
  private currentStateStartTime: number = 0;
  private nextStateChangeTime: number = 0;
  private lastActionTime: number = 0;
  private nextActionTime: number = 0;
  
  // Movimiento
  private currentDirection: Phaser.Math.Vector2 = new Phaser.Math.Vector2(0, 0);
  private targetPosition: { x: number; y: number } | null = null;
  
  // Referencias externas
  private walls: Phaser.Physics.Arcade.StaticGroup;
  private michiSprite: Phaser.GameObjects.Sprite;
  
  // Sistema de acciones aleatorias
  private actions: BecatinAction[] = [
    {
      id: 'helpful_commit',
      name: 'Commit Útil',
      description: 'Becatín intenta hacer un commit útil',
      probability: 0.3,
      successRate: 0.7,
      workingAnimation: true,
      effects: {
        success: { focus: 5, happiness: 3 },
        failure: { stress: 8, focus: -3 }
      },
      messages: {
        success: [
          'Becatín: "¡Arreglé ese bug del login!"',
          'Becatín: "Agregué validación al formulario"',
          'Becatín: "Optimicé esa función lenta"'
        ],
        failure: [
          'Becatín: "Ups... creo que rompí algo"',
          'Becatín: "¿Por qué no compila?"',
          'Becatín: "Era la rama correcta, ¿verdad?"'
        ]
      }
    },
    {
      id: 'database_query',
      name: 'Consulta de Base de Datos',
      description: 'Becatín intenta hacer una consulta a la BD',
      probability: 0.2,
      successRate: 0.4,
      workingAnimation: true,
      effects: {
        success: { energy: 5 },
        failure: { stress: 15, energy: -5 }
      },
      messages: {
        success: [
          'Becatín: "¡Los datos están listos!"',
          'Becatín: "Query optimizada y funcionando"'
        ],
        failure: [
          'Becatín: "¿Alguien sabe por qué está lenta la BD?"',
          'Becatín: "Creo que hay un deadlock..."',
          'Becatín: "¿Es normal que tarde 10 minutos?"'
        ]
      }
    },
    {
      id: 'deploy_attempt',
      name: 'Intento de Deploy',
      description: 'Becatín intenta hacer deploy',
      probability: 0.15,
      successRate: 0.3,
      workingAnimation: true,
      effects: {
        success: { happiness: 8, energy: 3 },
        failure: { stress: 20, focus: -8 }
      },
      messages: {
        success: [
          'Becatín: "¡Deploy exitoso!"',
          'Becatín: "Todo funcionando en producción"'
        ],
        failure: [
          'Becatín: "Ehh... ¿alguien puede revisar producción?"',
          'Becatín: "Creo que tiré el servidor..."',
          'Becatín: "¿Es normal que esté todo en rojo?"'
        ]
      }
    },
    {
      id: 'helpful_research',
      name: 'Investigación Útil',
      description: 'Becatín investiga algo para el proyecto',
      probability: 0.4,
      successRate: 0.8,
      workingAnimation: false,
      effects: {
        success: { focus: 8, happiness: 5 },
        failure: { stress: 3 }
      },
      messages: {
        success: [
          'Becatín: "Encontré una librería perfecta para esto"',
          'Becatín: "Hay una forma más fácil de hacerlo"',
          'Becatín: "Esta documentación explica todo"'
        ],
        failure: [
          'Becatín: "Todo está obsoleto en Stack Overflow"',
          'Becatín: "¿Alguien entiende esta documentación?"'
        ]
      }
    },
    {
      id: 'accidental_mistake',
      name: 'Error Accidental',
      description: 'Becatín comete un error sin darse cuenta',
      probability: 0.25,
      successRate: 0.1, // Muy baja probabilidad de "éxito"
      workingAnimation: false,
      effects: {
        success: { }, // No hace nada malo por accidente
        failure: { stress: 12, focus: -5, energy: -3 }
      },
      messages: {
        success: [
          'Becatín: "¡Por suerte revisé antes de hacer push!"'
        ],
        failure: [
          'Becatín: "¿Por qué ya no funciona el login?"',
          'Becatín: "Creo que borré algo importante..."',
          'Becatín: "¿Los tests siempre fallaban así?"',
          'Becatín: "Oops... era la rama de producción"'
        ]
      }
    }
  ];
  
  // Callback para efectos en el juego
  private onActionCallback: ((effects: any, message: string) => void) | null = null;

  constructor(
    scene: Phaser.Scene,
    deskX: number,
    deskY: number,
    walls: Phaser.Physics.Arcade.StaticGroup,
    michiSprite: Phaser.GameObjects.Sprite
  ) {
    this.scene = scene;
    this.walls = walls;
    this.michiSprite = michiSprite;
    
    // Configuración de comportamiento
    this.config = {
      deskPosition: { x: deskX, y: deskY },
      deskTime: { min: 15000, max: 45000 },     // 15-45 segundos en escritorio
      walkTime: { min: 8000, max: 20000 },      // 8-20 segundos caminando
      actionInterval: { min: 20000, max: 60000 }, // Acción cada 20-60 segundos
      interactionDistance: 80,                   // Distancia para interacción
      walkSpeed: 40,                            // Más lento que Michi
      walkRadius: 120                           // Radio de patrullaje
    };
    
    // Crear sprite de Becatín enfrente de su escritorio (parado, no sentado)
    const frontOfDeskX = deskX;
    const frontOfDeskY = deskY + 40; // 40px más abajo para estar enfrente
    this.becatinSprite = new BecatinSprite(scene, frontOfDeskX, frontOfDeskY);
    
    // Configurar física
    scene.physics.add.existing(this.becatinSprite.getSprite());
    this.body = this.becatinSprite.getSprite().body as Phaser.Physics.Arcade.Body;
    
    // Configurar colisión (cuerpo más pequeño)
    this.body.setSize(20, 25);
    this.body.setOffset(10, 15);
    this.body.setCollideWorldBounds(true);
    
    // Configurar colisiones con paredes y Michi
    scene.physics.add.collider(this.becatinSprite.getSprite(), walls);
    scene.physics.add.collider(this.becatinSprite.getSprite(), michiSprite);
    
    // Inicializar tiempos
    const currentTime = scene.time.now;
    this.currentStateStartTime = currentTime;
    this.lastActionTime = currentTime;
    this.scheduleNextStateChange(currentTime);
    this.scheduleNextAction(currentTime);
    
    // Empezar trabajando en el escritorio
    this.becatinSprite.playAnimation('work');
    
    console.log('[BecatinNpc] Becatín creado enfrente del escritorio:', { deskX: frontOfDeskX, deskY: frontOfDeskY });
  }

  /**
   * Establece el callback para cuando Becatín realiza acciones
   */
  setActionCallback(callback: (effects: any, message: string) => void): void {
    this.onActionCallback = callback;
  }

  /**
   * Actualiza la lógica del NPC cada frame
   */
  update(time: number, delta: number): void {
    // Verificar cambios de estado de comportamiento
    if (time >= this.nextStateChangeTime) {
      this.changeState(time);
    }
    
    // Verificar acciones aleatorias
    if (time >= this.nextActionTime) {
      this.performRandomAction(time);
    }
    
    // Actualizar comportamiento según estado actual
    this.updateCurrentBehavior(time, delta);
    
    // Verificar interacción con Michi
    this.checkMichiInteraction();
  }

  /**
   * Cambia el estado de comportamiento de Becatín
   */
  private changeState(time: number): void {
    switch (this.behaviorState) {
      case 'at_desk':
        // Cambiar a caminar ocasionalmente
        if (Math.random() < 0.3) {
          this.startWalking(time);
        } else {
          // Quedarse más tiempo en el escritorio
          this.scheduleNextStateChange(time);
        }
        break;
        
      case 'walking':
        // Volver al escritorio
        this.returnToDesk(time);
        break;
        
      case 'returning_to_desk':
        // Ya llegó al escritorio
        this.arriveAtDesk(time);
        break;
        
      case 'performing_action':
        // Terminar acción y volver a estado normal
        this.finishAction(time);
        break;
    }
  }

  /**
   * Empieza a caminar desde el escritorio
   */
  private startWalking(time: number): void {
    this.behaviorState = 'walking';
    this.currentStateStartTime = time;
    
    // Elegir posición aleatoria cerca del escritorio
    const angle = Math.random() * Math.PI * 2;
    const distance = 50 + Math.random() * this.config.walkRadius;
    
    this.targetPosition = {
      x: this.config.deskPosition.x + Math.cos(angle) * distance,
      y: this.config.deskPosition.y + Math.sin(angle) * distance
    };
    
    // Programar cuándo regresar
    const walkDuration = Phaser.Math.Between(this.config.walkTime.min, this.config.walkTime.max);
    this.nextStateChangeTime = time + walkDuration;
    
    console.log('[BecatinNpc] Becatín empezó a caminar');
  }

  /**
   * Empieza a regresar al escritorio (enfrente, no encima)
   */
  private returnToDesk(time: number): void {
    this.behaviorState = 'returning_to_desk';
    this.currentStateStartTime = time;
    
    // Objetivo: posición enfrente del escritorio
    const frontOfDeskX = this.config.deskPosition.x;
    const frontOfDeskY = this.config.deskPosition.y + 40; // 40px más abajo (enfrente)
    this.targetPosition = { x: frontOfDeskX, y: frontOfDeskY };
    
    // Llegar al escritorio en máximo 10 segundos
    this.nextStateChangeTime = time + 10000;
    
    console.log('[BecatinNpc] Becatín regresando enfrente del escritorio');
  }

  /**
   * Llega al escritorio y se posiciona enfrente (parado, no sentado)
   */
  private arriveAtDesk(time: number): void {
    this.behaviorState = 'at_desk';
    this.currentStateStartTime = time;
    this.targetPosition = null;
    
    // Programar próxima salida del escritorio
    const deskDuration = Phaser.Math.Between(this.config.deskTime.min, this.config.deskTime.max);
    this.nextStateChangeTime = time + deskDuration;
    
    // Posicionarse enfrente del escritorio (no encima)
    // Ajustar posición para estar parado enfrente
    const frontOfDeskX = this.config.deskPosition.x;
    const frontOfDeskY = this.config.deskPosition.y + 40; // 40px más abajo (enfrente)
    this.becatinSprite.setPosition(frontOfDeskX, frontOfDeskY);
    
    // Animación de trabajo (parado, no sentado)
    const workAnimations = ['work', 'coding'];
    const randomAnim = workAnimations[Math.floor(Math.random() * workAnimations.length)];
    this.becatinSprite.playAnimation(randomAnim as BecatinState);
    
    console.log('[BecatinNpc] Becatín llegó enfrente del escritorio (parado)');
  }

  /**
   * Termina de realizar una acción
   */
  private finishAction(time: number): void {
    // Volver al estado anterior
    if (this.isNearDesk()) {
      this.arriveAtDesk(time);
    } else {
      this.behaviorState = 'walking';
      this.currentStateStartTime = time;
      this.scheduleNextStateChange(time);
    }
    
    console.log('[BecatinNpc] Becatín terminó acción');
  }

  /**
   * Actualiza el comportamiento según el estado actual
   */
  private updateCurrentBehavior(time: number, delta: number): void {
    switch (this.behaviorState) {
      case 'at_desk':
        this.updateDeskBehavior();
        break;
        
      case 'walking':
      case 'returning_to_desk':
        this.updateWalkingBehavior();
        break;
        
      case 'performing_action':
        // No hacer nada, esperar que termine la acción
        break;
    }
  }

  /**
   * Actualiza comportamiento en el escritorio (parado enfrente, no sentado)
   */
  private updateDeskBehavior(): void {
    // Detener movimiento
    this.body.setVelocity(0, 0);
    
    // Asegurar que está en la posición enfrente del escritorio
    const frontOfDeskX = this.config.deskPosition.x;
    const frontOfDeskY = this.config.deskPosition.y + 40; // 40px más abajo (enfrente)
    
    const currentPos = this.becatinSprite.getPosition();
    const deskDistance = Phaser.Math.Distance.Between(
      currentPos.x, currentPos.y,
      frontOfDeskX, frontOfDeskY
    );
    
    if (deskDistance > 10) {
      this.becatinSprite.setPosition(frontOfDeskX, frontOfDeskY);
    }
  }

  /**
   * Actualiza comportamiento caminando
   */
  private updateWalkingBehavior(): void {
    if (!this.targetPosition) return;
    
    const currentPos = this.becatinSprite.getPosition();
    const distanceToTarget = Phaser.Math.Distance.Between(
      currentPos.x, currentPos.y,
      this.targetPosition.x, this.targetPosition.y
    );
    
    if (distanceToTarget < 20) {
      // Llegó al destino
      if (this.behaviorState === 'returning_to_desk') {
        this.body.setVelocity(0, 0);
        return;
      } else {
        // Elegir nuevo destino aleatorio
        this.chooseRandomWalkTarget();
      }
    } else {
      // Moverse hacia el objetivo
      this.moveTowardsTarget();
      this.becatinSprite.playAnimation('walk');
    }
  }

  /**
   * Elige un destino aleatorio para caminar
   */
  private chooseRandomWalkTarget(): void {
    const angle = Math.random() * Math.PI * 2;
    const distance = 30 + Math.random() * this.config.walkRadius;
    
    this.targetPosition = {
      x: this.config.deskPosition.x + Math.cos(angle) * distance,
      y: this.config.deskPosition.y + Math.sin(angle) * distance
    };
  }

  /**
   * Mueve a Becatín hacia el objetivo
   */
  private moveTowardsTarget(): void {
    if (!this.targetPosition) return;
    
    const currentPos = this.becatinSprite.getPosition();
    
    // Calcular dirección
    this.currentDirection.x = this.targetPosition.x - currentPos.x;
    this.currentDirection.y = this.targetPosition.y - currentPos.y;
    this.currentDirection.normalize();
    
    // Aplicar velocidad
    this.body.setVelocity(
      this.currentDirection.x * this.config.walkSpeed,
      this.currentDirection.y * this.config.walkSpeed
    );
    
    // Voltear sprite según dirección
    if (this.currentDirection.x < -0.1) {
      this.becatinSprite.setFlipX(true);
    } else if (this.currentDirection.x > 0.1) {
      this.becatinSprite.setFlipX(false);
    }
  }

  /**
   * Verifica si está cerca del escritorio (considera posición enfrente)
   */
  private isNearDesk(): boolean {
    const currentPos = this.becatinSprite.getPosition();
    const frontOfDeskX = this.config.deskPosition.x;
    const frontOfDeskY = this.config.deskPosition.y + 40; // 40px más abajo (enfrente)
    
    const distance = Phaser.Math.Distance.Between(
      currentPos.x, currentPos.y,
      frontOfDeskX, frontOfDeskY
    );
    return distance < 30;
  }

  /**
   * Realiza una acción aleatoria
   */
  private performRandomAction(time: number): void {
    // Elegir acción basada en probabilidades
    const availableActions = this.actions.filter(action => Math.random() < action.probability);
    
    if (availableActions.length === 0) {
      this.scheduleNextAction(time);
      return;
    }
    
    const chosenAction = availableActions[Math.floor(Math.random() * availableActions.length)];
    const wasSuccessful = Math.random() < chosenAction.successRate;
    
    // Cambiar a estado de acción si requiere animación de trabajo
    if (chosenAction.workingAnimation) {
      this.behaviorState = 'performing_action';
      this.currentStateStartTime = time;
      this.nextStateChangeTime = time + 3000; // 3 segundos de acción
      
      if (wasSuccessful) {
        this.becatinSprite.playAnimation('coding');
      } else {
        this.becatinSprite.playAnimation('confused');
      }
    }
    
    // Aplicar efectos
    const effects = wasSuccessful ? chosenAction.effects.success : chosenAction.effects.failure;
    const messages = wasSuccessful ? chosenAction.messages.success : chosenAction.messages.failure;
    const message = messages[Math.floor(Math.random() * messages.length)];
    
    // Mostrar resultado visual
    this.showActionResult(wasSuccessful, chosenAction.workingAnimation);
    
    // Notificar a la escena
    if (this.onActionCallback) {
      this.onActionCallback(effects, message);
    }
    
    // Programar próxima acción
    this.scheduleNextAction(time);
    
    console.log(`[BecatinNpc] Acción realizada: ${chosenAction.name} - ${wasSuccessful ? 'Éxito' : 'Fallo'}`);
  }

  /**
   * Muestra el resultado de la acción visualmente
   */
  private showActionResult(wasSuccessful: boolean, wasWorking: boolean): void {
    // Delay para mostrar resultado después de la acción
    this.scene.time.delayedCall(wasWorking ? 2000 : 500, () => {
      const resultState = getBecatinStateFromResult(wasSuccessful, wasWorking);
      this.becatinSprite.playTemporaryAnimation(resultState, 2500, 'idle');
    });
  }

  /**
   * Verifica interacción automática con Michi
   */
  private checkMichiInteraction(): void {
    const becatinPos = this.becatinSprite.getPosition();
    const michiPos = { x: this.michiSprite.x, y: this.michiSprite.y };
    
    const distance = Phaser.Math.Distance.Between(
      becatinPos.x, becatinPos.y,
      michiPos.x, michiPos.y
    );
    
    if (distance <= this.config.interactionDistance) {
      this.triggerInteraction();
    }
  }

  /**
   * Dispara interacción automática cuando Michi se acerca
   */
  private triggerInteraction(): void {
    // Por ahora solo cambiar animación para mostrar que detectó a Michi
    // La interacción real se manejará en la escena
    if (this.behaviorState === 'at_desk') {
      // Mirar hacia Michi brevemente
      const becatinPos = this.becatinSprite.getPosition();
      const michiPos = { x: this.michiSprite.x, y: this.michiSprite.y };
      
      if (michiPos.x < becatinPos.x) {
        this.becatinSprite.setFlipX(true);
      } else {
        this.becatinSprite.setFlipX(false);
      }
      
      // Animación de saludo
      this.becatinSprite.playTemporaryAnimation('normal', 1000, 'work');
    }
  }

  /**
   * Programa el próximo cambio de estado
   */
  private scheduleNextStateChange(time: number): void {
    const duration = this.behaviorState === 'at_desk' 
      ? Phaser.Math.Between(this.config.deskTime.min, this.config.deskTime.max)
      : Phaser.Math.Between(this.config.walkTime.min, this.config.walkTime.max);
    
    this.nextStateChangeTime = time + duration;
  }

  /**
   * Programa la próxima acción aleatoria
   */
  private scheduleNextAction(time: number): void {
    const interval = Phaser.Math.Between(this.config.actionInterval.min, this.config.actionInterval.max);
    this.nextActionTime = time + interval;
    this.lastActionTime = time;
  }

  /**
   * Verifica si Michi está cerca de Becatín
   */
  isNearMichi(maxDistance: number = this.config.interactionDistance): boolean {
    const becatinPos = this.becatinSprite.getPosition();
    const michiPos = { x: this.michiSprite.x, y: this.michiSprite.y };
    
    const distance = Phaser.Math.Distance.Between(
      becatinPos.x, becatinPos.y,
      michiPos.x, michiPos.y
    );
    
    return distance <= maxDistance;
  }

  /**
   * Obtiene la posición actual de Becatín
   */
  getPosition(): { x: number; y: number } {
    return this.becatinSprite.getPosition();
  }

  /**
   * Obtiene el sprite de Becatín
   */
  getSprite(): Phaser.GameObjects.Sprite {
    return this.becatinSprite.getSprite();
  }

  /**
   * Obtiene el estado de comportamiento actual
   */
  getBehaviorState(): BecatinBehaviorState {
    return this.behaviorState;
  }

  /**
   * Obtiene la posición del escritorio
   */
  getDeskPosition(): { x: number; y: number } {
    return { ...this.config.deskPosition };
  }

  /**
   * Pausa el comportamiento de Becatín
   */
  pause(): void {
    this.body.setVelocity(0, 0);
  }

  /**
   * Reanuda el comportamiento de Becatín
   */
  resume(): void {
    // El comportamiento se reanudará automáticamente en el próximo update
  }

  /**
   * Destruye el NPC y limpia recursos
   */
  destroy(): void {
    this.becatinSprite.destroy();
    console.log('[BecatinNpc] Becatín destruido');
  }
}