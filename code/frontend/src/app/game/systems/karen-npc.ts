import * as Phaser from 'phaser';
import { KarenSprite, KarenState, getKarenStateFromLevel } from '../assets/karen-sprite-loader';

/**
 * Sistema NPC de Karen - Maneja el comportamiento de Karen como personaje que camina por la oficina
 * 
 * Características:
 * - IA de patrullaje autónomo evitando paredes
 * - Estados emocionales basados en el Karenómetro
 * - Colisiones físicas con Michi (Opción A)
 * - Animaciones contextuales al enviar mensajes
 */

interface PatrolPoint {
  x: number;
  y: number;
}

interface KarenNpcConfig {
  speed: number;                    // Velocidad de movimiento (píxeles/segundo)
  patrolRadius: number;            // Radio de patrullaje desde punto inicial
  directionChangeInterval: number; // Tiempo mínimo antes de cambiar dirección (ms)
  wallAvoidanceDistance: number;   // Distancia para detectar y evitar paredes
  michiAvoidanceDistance: number;  // Distancia para evitar a Michi
}

export class KarenNpc {
  private scene: Phaser.Scene;
  private karenSprite: KarenSprite;
  private body: Phaser.Physics.Arcade.Body;
  
  // Configuración
  private config: KarenNpcConfig = {
    speed: 60,                    // Más lenta que Michi (100)
    patrolRadius: 150,            // Área de patrullaje
    directionChangeInterval: 3000, // Cambiar dirección cada 3 segundos
    wallAvoidanceDistance: 45,    // Detectar paredes cercanas
    michiAvoidanceDistance: 50    // Evitar a Michi
  };

  // Configuración móvil (ajustada dinámicamente)
  private isMobile: boolean;

  // Estado de movimiento
  private currentDirection: Phaser.Math.Vector2;
  private targetPoint: PatrolPoint | null = null;
  private lastDirectionChange: number = 0;
  private isAvoidingObstacle: boolean = false;
  private homePosition: PatrolPoint;
  
  // Referencias externas
  private walls: Phaser.Physics.Arcade.StaticGroup;
  private michiSprite: Phaser.GameObjects.Sprite;
  
  // Estado emocional
  private karenLevel: number = 0;
  private isPerformingAction: boolean = false; // Para animaciones temporales

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    walls: Phaser.Physics.Arcade.StaticGroup,
    michiSprite: Phaser.GameObjects.Sprite
  ) {
    this.scene = scene;
    this.walls = walls;
    this.michiSprite = michiSprite;
    
    // Detectar móvil y ajustar configuración
    this.isMobile = this.detectMobile();
    if (this.isMobile) {
      // En móvil, Karen se mueve un poco más lento para mejor jugabilidad
      this.config.speed = 50;
      this.config.michiAvoidanceDistance = 60; // Mayor distancia de evitación en móvil
    }
    
    // Posición inicial como "hogar" para el patrullaje
    this.homePosition = { x, y };
    
    // Crear sprite de Karen
    this.karenSprite = new KarenSprite(scene, x, y);
    
    // Configurar física
    scene.physics.add.existing(this.karenSprite.getSprite());
    this.body = this.karenSprite.getSprite().body as Phaser.Physics.Arcade.Body;
    
    // Configurar colisión física (cuerpo ajustado al sprite)
    this.body.setSize(25, 30);  // Cuerpo de colisión más pequeño que el sprite visual
    this.body.setOffset(5, 5);   // Centrar el cuerpo en el sprite
    this.body.setCollideWorldBounds(true);
    
    // Configurar colisiones
    scene.physics.add.collider(this.karenSprite.getSprite(), walls);
    scene.physics.add.collider(this.karenSprite.getSprite(), michiSprite);
    
    // Dirección inicial aleatoria
    this.currentDirection = new Phaser.Math.Vector2(
      Phaser.Math.Between(-1, 1),
      Phaser.Math.Between(-1, 1)
    ).normalize();
    
    console.log('[KarenNpc] Karen creada en posición:', { x, y });
  }

  /**
   * Actualiza la lógica del NPC cada frame
   */
  update(time: number, delta: number): void {
    if (this.isPerformingAction) {
      // Durante acciones especiales (envío de mensajes), no moverse
      this.body.setVelocity(0, 0);
      return;
    }

    // Actualizar IA de movimiento
    this.updateMovementAI(time, delta);
    
    // Actualizar animaciones basadas en movimiento
    this.updateAnimations();
  }

  /**
   * IA de movimiento: patrullaje con evitación de obstáculos
   */
  private updateMovementAI(time: number, delta: number): void {
    const currentPos = this.karenSprite.getPosition();
    
    // Verificar si necesita cambiar dirección por tiempo
    const shouldChangeDirection = time - this.lastDirectionChange > this.config.directionChangeInterval;
    
    // Verificar si está muy lejos del área de patrullaje
    const distanceFromHome = Phaser.Math.Distance.Between(
      currentPos.x, currentPos.y,
      this.homePosition.x, this.homePosition.y
    );
    const tooFarFromHome = distanceFromHome > this.config.patrolRadius;
    
    // Detectar obstáculos adelante
    const obstacleAhead = this.detectObstacleAhead(currentPos);
    
    // Cambiar dirección si es necesario
    if (shouldChangeDirection || tooFarFromHome || obstacleAhead) {
      this.changeDirection(tooFarFromHome);
      this.lastDirectionChange = time;
    }
    
    // Aplicar movimiento
    this.applyMovement();
  }

  /**
   * Detecta obstáculos (paredes o Michi) en la dirección actual
   */
  private detectObstacleAhead(currentPos: { x: number; y: number }): boolean {
    const checkDistance = this.config.wallAvoidanceDistance;
    const futureX = currentPos.x + (this.currentDirection.x * checkDistance);
    const futureY = currentPos.y + (this.currentDirection.y * checkDistance);
    
    // Verificar límites del mundo
    const worldBounds = this.scene.physics.world.bounds;
    if (futureX < worldBounds.x + 20 || futureX > worldBounds.right - 20 ||
        futureY < worldBounds.y + 20 || futureY > worldBounds.bottom - 20) {
      return true;
    }
    
    // Verificar proximidad a Michi
    const distanceToMichi = Phaser.Math.Distance.Between(
      futureX, futureY,
      this.michiSprite.x, this.michiSprite.y
    );
    
    if (distanceToMichi < this.config.michiAvoidanceDistance) {
      return true;
    }
    
    // Verificar paredes usando raycast simple
    // (En un juego más complejo usarías un verdadero raycast)
    const tileSize = 32;
    const gridX = Math.floor(futureX / tileSize);
    const gridY = Math.floor(futureY / tileSize);
    
    // Verificar múltiples puntos alrededor de la posición futura
    const checkPoints = [
      { x: futureX, y: futureY },
      { x: futureX - 15, y: futureY },
      { x: futureX + 15, y: futureY },
      { x: futureX, y: futureY - 15 },
      { x: futureX, y: futureY + 15 }
    ];
    
    for (const point of checkPoints) {
      // Verificar colisión con paredes (esto es aproximado, idealmente usarías tilemap.getTileAtWorldXY)
      const objects = this.scene.children.list.filter(child => 
        child instanceof Phaser.GameObjects.Sprite && 
        this.walls.contains(child) &&
        Phaser.Geom.Rectangle.Contains(child.getBounds(), point.x, point.y)
      );
      
      if (objects.length > 0) {
        return true;
      }
    }
    
    return false;
  }

  /**
   * Cambia la dirección de movimiento
   */
  private changeDirection(returnHome: boolean = false): void {
    if (returnHome) {
      // Dirigirse hacia el hogar
      const currentPos = this.karenSprite.getPosition();
      const directionToHome = new Phaser.Math.Vector2(
        this.homePosition.x - currentPos.x,
        this.homePosition.y - currentPos.y
      ).normalize();
      
      // Agregar algo de aleatoriedad para evitar movimiento mecánico
      directionToHome.x += (Math.random() - 0.5) * 0.4;
      directionToHome.y += (Math.random() - 0.5) * 0.4;
      directionToHome.normalize();
      
      this.currentDirection = directionToHome;
    } else {
      // Dirección aleatoria
      const angle = Math.random() * Math.PI * 2;
      this.currentDirection = new Phaser.Math.Vector2(
        Math.cos(angle),
        Math.sin(angle)
      );
    }
  }

  /**
   * Aplica el movimiento basado en la dirección actual
   */
  private applyMovement(): void {
    const velocity = this.currentDirection.clone().scale(this.config.speed);
    this.body.setVelocity(velocity.x, velocity.y);
    
    // Voltear sprite según dirección
    if (this.currentDirection.x < 0) {
      this.karenSprite.setFlipX(true);
    } else if (this.currentDirection.x > 0) {
      this.karenSprite.setFlipX(false);
    }
  }

  /**
   * Actualiza las animaciones según el movimiento y estado emocional
   */
  private updateAnimations(): void {
    const isMoving = Math.abs(this.body.velocity.x) > 10 || Math.abs(this.body.velocity.y) > 10;
    
    if (isMoving) {
      this.karenSprite.playAnimation('walk');
    } else {
      // Estado base según Karenómetro
      const baseState = getKarenStateFromLevel(this.karenLevel);
      this.karenSprite.playAnimation(baseState);
    }
  }

  /**
   * Actualiza el nivel de Karen y el estado emocional correspondiente
   */
  updateKarenLevel(karenLevel: number): void {
    this.karenLevel = karenLevel;
    this.karenSprite.updateFromKarenLevel(karenLevel);
    
    // Ajustar velocidad según el nivel de estrés (con consideración móvil)
    const baseSpeed = this.isMobile ? 50 : 60; // Velocidades base diferentes para móvil
    
    if (karenLevel >= 80) {
      this.config.speed = baseSpeed + 20;  // Más rápida cuando está muy estresada
    } else if (karenLevel >= 60) {
      this.config.speed = baseSpeed + 10;  // Velocidad media-alta
    } else {
      this.config.speed = baseSpeed;       // Velocidad normal
    }
  }

  /**
   * Ejecuta una acción específica (enviar mensaje, etc.)
   * Durante esta acción, Karen se detiene y reproduce una animación
   */
  performAction(actionType: KarenState, duration: number = 2000): void {
    this.isPerformingAction = true;
    
    // Detener movimiento
    this.body.setVelocity(0, 0);
    
    // Reproducir animación de acción
    this.karenSprite.playTemporaryAnimation(actionType, duration);
    
    // Reanudar movimiento después de la acción
    this.scene.time.delayedCall(duration, () => {
      this.isPerformingAction = false;
    });
    
    console.log(`[KarenNpc] Ejecutando acción: ${actionType} por ${duration}ms`);
  }

  /**
   * Obtiene la posición actual de Karen
   */
  getPosition(): { x: number; y: number } {
    return this.karenSprite.getPosition();
  }

  /**
   * Obtiene el sprite de Karen (para colisiones externas)
   */
  getSprite(): Phaser.GameObjects.Sprite {
    return this.karenSprite.getSprite();
  }

  /**
   * Obtiene el estado emocional actual
   */
  getCurrentState(): KarenState {
    return this.karenSprite.getState();
  }

  /**
   * Verifica si Karen está cerca de Michi (para mostrar globos de mensaje)
   * En móvil usa una distancia ligeramente mayor para compensar precisión táctil
   */
  isNearMichi(maxDistance: number = 100): boolean {
    const karenPos = this.getPosition();
    const michiPos = { x: this.michiSprite.x, y: this.michiSprite.y };
    
    // Detectar si es móvil para ajustar distancia
    const adjustedDistance = this.isMobile ? maxDistance * 1.2 : maxDistance;
    
    const distance = Phaser.Math.Distance.Between(
      karenPos.x, karenPos.y,
      michiPos.x, michiPos.y
    );
    
    return distance <= adjustedDistance;
  }

  /**
   * Detecta si el dispositivo es móvil (similar a KarenMessageBubble)
   */
  private detectMobile(): boolean {
    return (
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      window.matchMedia('(pointer: coarse)').matches ||
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    );
  }

  /**
   * Pausa el movimiento del NPC
   */
  pause(): void {
    this.body.setVelocity(0, 0);
    this.isPerformingAction = true;
  }

  /**
   * Reanuda el movimiento del NPC
   */
  resume(): void {
    this.isPerformingAction = false;
  }

  /**
   * Destruye el NPC y limpia recursos
   */
  destroy(): void {
    this.karenSprite.destroy();
    console.log('[KarenNpc] Karen destruida');
  }
}