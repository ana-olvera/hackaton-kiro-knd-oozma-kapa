import * as Phaser from 'phaser';

/**
 * Configuración del spritesheet de Michi Godín
 * 
 * ESPECIFICACIONES TÉCNICAS (según la imagen real michi_godin.png):
 * - Dimensiones totales: 506 x 1024 píxeles
 * - Grid: 4 columnas x 8 filas (32 celdas)
 * - Tamaño de cada celda: 126 x 128 píxeles (506/4 ≈ 126, 1024/8 = 128)
 * - Origen: Esquina superior izquierda (0,0)
 * - Filter Mode: Point (No Filter) / Nearest Neighbor
 * - Compression: None (RGBA 32-bit)
 */

// Configuración ajustada a las dimensiones reales de la imagen (506x1024)
const SPRITE_CONFIG = {
  frameWidth: 126,   // Ancho de cada celda (506 / 4 columnas ≈ 126)
  frameHeight: 128,  // Alto de cada celda (1024 / 8 filas = 128)
  columns: 4,        // Columnas en el spritesheet
  rows: 8,           // Filas en el spritesheet
  spacing: 0,        // Sin espacio entre frames
  margin: 0          // Sin margen inicial
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
 * 
 * MAPA DE ANIMACIONES (spritesheet actualizado v2.0):
 * - Fila 1 (0-3):   Idle/Reposo - De pie con rosquilla rosa, parpadeando [6 FPS]
 * - Fila 2 (4-7):   Walk/Caminar - De perfil con maletín marrón [8 FPS]
 * - Fila 3 (8-10):  Sleep/Dormir - De lado con 'ZZZ' [4 FPS] (celda 11 vacía)
 * - Fila 4 (12-13): Work/Trabajo - Escribiendo enojado en laptop [6 FPS]
 * - Fila 4 (14-15): Coffee/Café - Tomando café [4 FPS]
 * - Fila 5 (16-19): Fury/Furia - Cara roja, humo en orejas, golpeando maletín [8 FPS]
 * - Fila 6 (20-21): Confused/Confundido - Con signos '?' [4 FPS]
 * - Fila 6 (22-23): Crying/Llorando - Lágrimas grandes [6 FPS]
 * - Fila 7 (24-25): Surprised/Sorpresa - Con signo '!' [6 FPS]
 * - Fila 7 (26-27): Greeting/Saludando - Saludo alegre con la mano [6 FPS]
 * - Fila 8 (28-29): Looking Back/Mirando atrás [4 FPS]
 * - Fila 8 (30):    Desk Scene/Escritorio - Escena isométrica decorativa [1 FPS] (celda 31 vacía)
 */
export const MICHI_ANIMATIONS: MichiAnimation[] = [
  // Fila 1: Idle - De pie con rosquilla rosa (4 frames) - Loop
  { key: 'michi-idle', startFrame: 0, endFrame: 3, frameRate: 6, repeat: -1 },
  
  // Fila 2: Walk - Caminando con maletín (4 frames) - Loop
  { key: 'michi-walk', startFrame: 4, endFrame: 7, frameRate: 8, repeat: -1 },
  
  // Fila 3: Sleep - Durmiendo con ZZZ (3 frames) - Loop
  { key: 'michi-sleep', startFrame: 8, endFrame: 10, frameRate: 4, repeat: -1 },
  
  // Fila 4: Work (2 frames) + Coffee (2 frames) - Loop
  { key: 'michi-work', startFrame: 12, endFrame: 13, frameRate: 6, repeat: -1 },
  { key: 'michi-coffee', startFrame: 14, endFrame: 15, frameRate: 4, repeat: -1 },
  
  // Fila 5: Fury - Furia extrema con cara roja y humo (4 frames) - Loop
  { key: 'michi-fury', startFrame: 16, endFrame: 19, frameRate: 8, repeat: -1 },
  // Alias de compatibilidad: 'stressed' apunta a los mismos frames de furia
  { key: 'michi-stressed', startFrame: 16, endFrame: 19, frameRate: 8, repeat: -1 },
  
  // Fila 6: Confused (2 frames) + Crying (2 frames)
  { key: 'michi-confused', startFrame: 20, endFrame: 21, frameRate: 4, repeat: 0 },
  { key: 'michi-crying', startFrame: 22, endFrame: 23, frameRate: 6, repeat: -1 },
  // Alias de compatibilidad: 'sad' apunta a crying
  { key: 'michi-sad', startFrame: 22, endFrame: 23, frameRate: 6, repeat: -1 },
  
  // Fila 7: Surprised (2 frames) + Greeting (2 frames)
  { key: 'michi-surprised', startFrame: 24, endFrame: 25, frameRate: 6, repeat: 0 },
  { key: 'michi-greeting', startFrame: 26, endFrame: 27, frameRate: 6, repeat: 0 },
  // Aliases de compatibilidad
  { key: 'michi-excited', startFrame: 24, endFrame: 25, frameRate: 6, repeat: 0 },
  { key: 'michi-celebrate', startFrame: 26, endFrame: 27, frameRate: 6, repeat: 0 },
  
  // Fila 8: Looking Back (2 frames) + Desk Scene (1 frame estático)
  { key: 'michi-looking-back', startFrame: 28, endFrame: 29, frameRate: 4, repeat: -1 },
  { key: 'michi-desk-scene', startFrame: 30, endFrame: 30, frameRate: 1, repeat: 0 },
  // Alias de compatibilidad: 'phone' apunta a looking-back
  { key: 'michi-phone', startFrame: 28, endFrame: 29, frameRate: 4, repeat: -1 }
];

/**
 * Carga el spritesheet de Michi en una escena de Phaser
 * Aplica filtro NEAREST para evitar pixel bleeding en pixel art
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
    endFrame: SPRITE_CONFIG.columns * SPRITE_CONFIG.rows - 1,
    spacing: SPRITE_CONFIG.spacing,
    margin: SPRITE_CONFIG.margin
  });

  // Aplicar filtro NEAREST después de cargar para pixel art nítido
  scene.load.once('complete', () => {
    const texture = scene.textures.get('michi-spritesheet');
    if (texture && texture.source && texture.source[0]) {
      texture.setFilter(Phaser.Textures.FilterMode.NEAREST);
    }
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
 * Tipo de estado de Michi para mapear a animaciones.
 * Incluye estados nuevos del spritesheet v2.0 y aliases de compatibilidad.
 */
export type MichiState = 
  | 'idle' 
  | 'walk' 
  | 'sleep' 
  | 'work' 
  | 'coffee'
  | 'fury'
  | 'stressed'
  | 'confused'
  | 'crying'
  | 'sad'
  | 'surprised'
  | 'greeting'
  | 'excited'
  | 'celebrate'
  | 'looking-back'
  | 'desk-scene'
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
    // El sprite de 256x256 se escala para el juego
    // 256 * 0.15 ≈ 38px (buen tamaño para tiles de 32px)
    this.sprite.setScale(0.15);
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
