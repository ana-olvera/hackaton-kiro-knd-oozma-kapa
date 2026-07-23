import * as Phaser from 'phaser';

/**
 * Loader y configuración del spritesheet de Becatín (Michi Becario)
 * 
 * ESPECIFICACIONES TÉCNICAS (según la imagen real michi_becario.png):
 * - Spritesheet de pixel art estilo consistente con Michi Godin y Karen  
 * - Grid: 4 columnas x 9 filas = 36 frames
 * - Dimensiones por frame: similar a otros personajes (~130x80 píxeles estimados)
 * - Personaje: Gato becario con lentes y camisa azul
 * - Estilo: Pixel art nítido, requiere filtro NEAREST
 * - Escala ajustada para mantener consistencia visual con Michi (~30-40px)
 */

// Estados emocionales de Becatín
export type BecatinState = 
  | 'idle'          // Parado normal (fila 1)
  | 'walk'          // Caminando (fila 2)
  | 'sleep'         // Durmiendo en escritorio (fila 3)
  | 'work'          // Trabajando en computadora (fila 4)
  | 'confused'      // Confundido con interrogaciones (fila 5)
  | 'coding'        // Programando concentrado (fila 6)
  | 'normal'        // Estado normal alternativo (fila 7)
  | 'crying'        // Llorando (cuando rompe algo) (fila 8)
  | 'celebrating'   // Celebrando éxito (fila 8 derecha)
  | 'breaking';     // Rompiendo cosas (fila 9)

// Configuración del spritesheet ajustada para coincidir con la calidad visual de Michi Godin
const BECATIN_SPRITE_CONFIG = {
  key: 'becatin-spritesheet',
  url: 'assets/sprites/michi_becario.png',
  frameConfig: {
    frameWidth: 126,   // Igual que Michi Godin para consistencia visual
    frameHeight: 128,  // Igual que Michi Godin para consistencia visual  
    startFrame: 0,
    endFrame: 35,      // 36 frames total (0-35)
    margin: 0,
    spacing: 0
  },
  // Escala ligeramente menor a Michi Godin (becario más pequeño pero visible)
  defaultScale: 0.12   // Michi usa 0.15, Becatín usa 0.12 (un poco más pequeño)
};

/**
 * Carga el spritesheet de Becatín en la escena
 * Aplica filtro NEAREST para pixel art nítido (consistente con Michi Godin y Karen)
 */
export function loadBecatinSpritesheet(scene: Phaser.Scene): void {
  console.log('[BecatinSpriteLoader] Cargando spritesheet de Becatín');
  
  // Verificar si ya está cargado
  if (scene.textures.exists(BECATIN_SPRITE_CONFIG.key)) {
    return;
  }
  
  scene.load.spritesheet(
    BECATIN_SPRITE_CONFIG.key,
    BECATIN_SPRITE_CONFIG.url,
    {
      frameWidth: BECATIN_SPRITE_CONFIG.frameConfig.frameWidth,
      frameHeight: BECATIN_SPRITE_CONFIG.frameConfig.frameHeight,
      margin: BECATIN_SPRITE_CONFIG.frameConfig.margin,
      spacing: BECATIN_SPRITE_CONFIG.frameConfig.spacing,
      startFrame: BECATIN_SPRITE_CONFIG.frameConfig.startFrame,
      endFrame: BECATIN_SPRITE_CONFIG.frameConfig.endFrame
    }
  );

  // Aplicar filtro NEAREST después de cargar para pixel art nítido
  scene.load.once('complete', () => {
    const texture = scene.textures.get(BECATIN_SPRITE_CONFIG.key);
    if (texture && texture.source && texture.source[0]) {
      texture.setFilter(Phaser.Textures.FilterMode.NEAREST);
    }
  });
}

/**
 * Crea todas las animaciones de Becatín
 */
export function createBecatinAnimations(scene: Phaser.Scene): void {
  console.log('[BecatinSpriteLoader] Creando animaciones de Becatín');

  const animations = [
    // Fila 1: Idle/parado (frames 0-3)
    {
      key: 'becatin-idle',
      frames: { start: 0, end: 3 },
      frameRate: 3,
      repeat: -1
    },
    
    // Fila 2: Caminando (frames 4-7) 
    {
      key: 'becatin-walk',
      frames: { start: 4, end: 7 },
      frameRate: 6,
      repeat: -1
    },
    
    // Fila 3: Durmiendo en escritorio (frames 8-10, solo 3 frames)
    {
      key: 'becatin-sleep',
      frames: { start: 8, end: 10 },
      frameRate: 2,
      repeat: -1
    },
    
    // Fila 4: Trabajando en computadora (frames 12-15)
    {
      key: 'becatin-work',
      frames: { start: 12, end: 15 },
      frameRate: 4,
      repeat: -1
    },
    
    // Fila 5: Confundido (frames 16-19)
    {
      key: 'becatin-confused',
      frames: { start: 16, end: 19 },
      frameRate: 3,
      repeat: -1
    },
    
    // Fila 6: Programando concentrado (frames 20-23)
    {
      key: 'becatin-coding',
      frames: { start: 20, end: 23 },
      frameRate: 5,
      repeat: -1
    },
    
    // Fila 7: Normal/idle alternativo (frames 24-27)
    {
      key: 'becatin-normal',
      frames: { start: 24, end: 27 },
      frameRate: 3,
      repeat: -1
    },
    
    // Fila 8: Llorando (frames 28-29) + Celebrando (frames 30-31)
    {
      key: 'becatin-crying',
      frames: { start: 28, end: 29 },
      frameRate: 4,
      repeat: -1
    },
    {
      key: 'becatin-celebrating',
      frames: { start: 30, end: 31 },
      frameRate: 6,
      repeat: 0  // Una sola vez
    },
    
    // Fila 9: Rompiendo cosas (frames 32-33)
    {
      key: 'becatin-breaking',
      frames: { start: 32, end: 33 },
      frameRate: 8,
      repeat: 0  // Una sola vez
    }
  ];

  // Crear cada animación
  animations.forEach(anim => {
    if (!scene.anims.exists(anim.key)) {
      scene.anims.create({
        key: anim.key,
        frames: scene.anims.generateFrameNumbers(BECATIN_SPRITE_CONFIG.key, anim.frames),
        frameRate: anim.frameRate,
        repeat: anim.repeat
      });
    }
  });

  console.log('[BecatinSpriteLoader] Animaciones de Becatín creadas exitosamente');
}

/**
 * Obtiene el estado de Becatín basado en su acción actual
 */
export function getBecatinStateFromAction(action: string): BecatinState {
  const actionMap: Record<string, BecatinState> = {
    'idle': 'idle',
    'walking': 'walk',
    'working': 'work',
    'sleeping': 'sleep',
    'confused': 'confused', 
    'coding': 'coding',
    'celebrating': 'celebrating',
    'crying': 'crying',
    'breaking': 'breaking',
    'normal': 'normal'
  };
  
  return actionMap[action] || 'idle';
}

/**
 * Determina el estado emocional de Becatín basado en el resultado de sus acciones
 */
export function getBecatinStateFromResult(wasSuccessful: boolean, isWorking: boolean): BecatinState {
  if (isWorking) {
    return Math.random() < 0.7 ? 'work' : 'coding';
  }
  
  if (wasSuccessful) {
    return Math.random() < 0.8 ? 'celebrating' : 'idle';
  } else {
    return Math.random() < 0.6 ? 'crying' : 'confused';
  }
}

/**
 * Clase helper para manejar el sprite de Becatín
 */
export class BecatinSprite {
  private sprite: Phaser.GameObjects.Sprite;
  private currentState: BecatinState = 'idle';
  private isTemporaryAnimation = false;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    this.sprite = scene.add.sprite(x, y, BECATIN_SPRITE_CONFIG.key, 0);
    this.sprite.setScale(BECATIN_SPRITE_CONFIG.defaultScale); // Escala consistente con Michi Godin (nítida)
    this.sprite.setDepth(100);
    
    // Reproducir animación inicial
    this.playAnimation('idle');
    
    console.log('[BecatinSprite] Sprite de Becatín creado en posición:', { x, y });
  }

  /**
   * Reproduce una animación específica
   */
  playAnimation(state: BecatinState, temporary: boolean = false): void {
    const animationKey = `becatin-${state}`;
    
    if (this.sprite.anims.exists(animationKey)) {
      this.currentState = state;
      this.isTemporaryAnimation = temporary;
      this.sprite.anims.play(animationKey, true);
    } else {
      console.warn(`[BecatinSprite] Animación no encontrada: ${animationKey}`);
    }
  }

  /**
   * Reproduce una animación temporal y luego vuelve al estado base
   */
  playTemporaryAnimation(state: BecatinState, duration: number, baseState: BecatinState = 'idle'): void {
    this.playAnimation(state, true);
    
    // Volver al estado base después de la duración
    this.sprite.scene.time.delayedCall(duration, () => {
      if (this.isTemporaryAnimation) {
        this.playAnimation(baseState, false);
      }
    });
  }

  /**
   * Actualiza el estado basado en la acción actual
   */
  updateFromAction(action: string): void {
    if (!this.isTemporaryAnimation) {
      const newState = getBecatinStateFromAction(action);
      if (newState !== this.currentState) {
        this.playAnimation(newState);
      }
    }
  }

  /**
   * Actualiza el estado basado en el resultado de una acción
   */
  updateFromResult(wasSuccessful: boolean, isWorking: boolean = false): void {
    const newState = getBecatinStateFromResult(wasSuccessful, isWorking);
    this.playAnimation(newState, newState === 'celebrating' || newState === 'crying');
    
    // Si es una animación temporal, volver a idle después de un tiempo
    if (newState === 'celebrating' || newState === 'crying') {
      this.sprite.scene.time.delayedCall(2000, () => {
        this.playAnimation('idle');
      });
    }
  }

  /**
   * Obtiene el sprite de Phaser para manipulaciones externas
   */
  getSprite(): Phaser.GameObjects.Sprite {
    return this.sprite;
  }

  /**
   * Obtiene la posición actual del sprite
   */
  getPosition(): { x: number; y: number } {
    return { x: this.sprite.x, y: this.sprite.y };
  }

  /**
   * Establece la posición del sprite
   */
  setPosition(x: number, y: number): void {
    this.sprite.setPosition(x, y);
  }

  /**
   * Establece si el sprite está volteado horizontalmente
   */
  setFlipX(flipped: boolean): void {
    this.sprite.setFlipX(flipped);
  }

  /**
   * Obtiene el estado actual
   */
  getState(): BecatinState {
    return this.currentState;
  }

  /**
   * Destruye el sprite
   */
  destroy(): void {
    if (this.sprite) {
      this.sprite.destroy();
    }
  }
}