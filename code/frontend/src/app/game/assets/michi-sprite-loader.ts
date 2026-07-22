import * as Phaser from 'phaser';

/**
 * Configuración del spritesheet de Michi Godín generado con DALL-E
 * 
 * El spritesheet tiene 5 columnas x 7 filas
 * Cada celda es de 128x128 píxeles
 * Tamaño total: 640x896 píxeles
 */

// Dimensiones del spritesheet según la imagen real de DALL-E
// Imagen: 1024 x 1536 píxeles, 5 columnas x 7 filas
const SPRITE_CONFIG = {
  frameWidth: 204,   // 1024 / 5 = 204.8, redondeamos a 204
  frameHeight: 219,  // 1536 / 7 = 219.4, redondeamos a 219
  columns: 5,        // Columnas en el spritesheet
  rows: 7            // Filas en el spritesheet
};

/**
 * Definición de animaciones de Michi Godín
 */
export interface MichiAnimation {
  key: string;
  startFrame: number;
  endFrame: number;
  frameRate: number;
  repeat: number; // -1 para loop infinito
}

/**
 * Todas las animaciones disponibles para Michi
 * Basadas en el layout del spritesheet:
 * 
 * Fila 0 (frames 0-4):   Idle - parado con maletín
 * Fila 1 (frames 5-9):   Walk - caminando
 * Fila 2 (frames 10-14): Sleep - durmiendo con ZZZ (último frame vacío)
 * Fila 3 (frames 15-19): Work (15-16) + Coffee (17-19)
 * Fila 4 (frames 20-24): Stressed (20-23) + Celebrate (24)
 * Fila 5 (frames 25-29): Confused (25-27) + Sad (28-29)
 * Fila 6 (frames 30-34): Excited (30-32) + Phone (33-34)
 */
export const MICHI_ANIMATIONS: MichiAnimation[] = [
  // Fila 0: Idle/Parado con maletín (5 frames)
  { key: 'michi-idle', startFrame: 0, endFrame: 4, frameRate: 4, repeat: -1 },
  
  // Fila 1: Caminando (5 frames)
  { key: 'michi-walk', startFrame: 5, endFrame: 9, frameRate: 8, repeat: -1 },
  
  // Fila 2: Durmiendo con ZZZ (4 frames)
  { key: 'michi-sleep', startFrame: 10, endFrame: 13, frameRate: 2, repeat: -1 },
  
  // Fila 3: Trabajando en laptop (2 frames) + Tomando café (3 frames)
  { key: 'michi-work', startFrame: 15, endFrame: 16, frameRate: 4, repeat: -1 },
  { key: 'michi-coffee', startFrame: 17, endFrame: 19, frameRate: 3, repeat: -1 },
  
  // Fila 4: Estresado (4 frames) + Celebrando (1 frame)
  { key: 'michi-stressed', startFrame: 20, endFrame: 23, frameRate: 6, repeat: -1 },
  { key: 'michi-celebrate', startFrame: 24, endFrame: 24, frameRate: 1, repeat: 0 },
  
  // Fila 5: Confundido (3 frames) + Triste (2 frames)
  { key: 'michi-confused', startFrame: 25, endFrame: 27, frameRate: 4, repeat: 0 },
  { key: 'michi-sad', startFrame: 28, endFrame: 29, frameRate: 3, repeat: -1 },
  
  // Fila 6: Emocionado (3 frames) + Usando teléfono (2 frames)
  { key: 'michi-excited', startFrame: 30, endFrame: 32, frameRate: 6, repeat: 0 },
  { key: 'michi-phone', startFrame: 33, endFrame: 34, frameRate: 3, repeat: -1 }
];

/**
 * Carga el spritesheet de Michi en una escena de Phaser
 */
export function loadMichiSpritesheet(scene: Phaser.Scene): void {
  // Verificar si ya está cargado
  if (scene.textures.exists('michi-spritesheet')) {
    return;
  }

  scene.load.spritesheet('michi-spritesheet', 'assets/sprites/michi_godin.png', {
    frameWidth: SPRITE_CONFIG.frameWidth,
    frameHeight: SPRITE_CONFIG.frameHeight,
    startFrame: 0,
    endFrame: SPRITE_CONFIG.columns * SPRITE_CONFIG.rows - 1
  });
}

/**
 * Crea todas las animaciones de Michi en el AnimationManager de Phaser
 */
export function createMichiAnimations(scene: Phaser.Scene): void {
  const anims = scene.anims;

  for (const anim of MICHI_ANIMATIONS) {
    // Verificar si la animación ya existe
    if (anims.exists(anim.key)) {
      continue;
    }

    anims.create({
      key: anim.key,
      frames: anims.generateFrameNumbers('michi-spritesheet', {
        start: anim.startFrame,
        end: anim.endFrame
      }),
      frameRate: anim.frameRate,
      repeat: anim.repeat
    });
  }
}

/**
 * Tipo de estado de Michi para mapear a animaciones
 */
export type MichiState = 
  | 'idle' 
  | 'walk' 
  | 'sleep' 
  | 'work' 
  | 'coffee'
  | 'stressed'
  | 'celebrate'
  | 'confused'
  | 'sad'
  | 'excited'
  | 'phone';

/**
 * Obtiene la clave de animación para un estado dado
 */
export function getMichiAnimationKey(state: MichiState): string {
  return `michi-${state}`;
}

/**
 * Clase helper para crear y manejar el sprite de Michi
 */
export class MichiSprite {
  private sprite: Phaser.GameObjects.Sprite;
  private currentState: MichiState = 'idle';

  constructor(scene: Phaser.Scene, x: number, y: number) {
    this.sprite = scene.add.sprite(x, y, 'michi-spritesheet');
    // El sprite de 128x128 es grande, lo escalamos para el juego
    this.sprite.setScale(0.25); // 128 * 0.25 = 32px (tamaño de tile)
    this.playAnimation('idle');
  }

  /**
   * Reproduce una animación de Michi
   */
  playAnimation(state: MichiState): void {
    if (this.currentState === state) return;
    
    this.currentState = state;
    const animKey = getMichiAnimationKey(state);
    
    if (this.sprite.scene.anims.exists(animKey)) {
      this.sprite.play(animKey);
    }
  }

  /**
   * Obtiene el sprite de Phaser
   */
  getSprite(): Phaser.GameObjects.Sprite {
    return this.sprite;
  }

  /**
   * Obtiene el estado actual
   */
  getState(): MichiState {
    return this.currentState;
  }

  /**
   * Voltea el sprite horizontalmente
   */
  setFlipX(flip: boolean): void {
    this.sprite.setFlipX(flip);
  }

  /**
   * Establece la posición del sprite
   */
  setPosition(x: number, y: number): void {
    this.sprite.setPosition(x, y);
  }

  /**
   * Establece la escala del sprite
   */
  setScale(scale: number): void {
    this.sprite.setScale(scale);
  }

  /**
   * Destruye el sprite
   */
  destroy(): void {
    this.sprite.destroy();
  }
}
