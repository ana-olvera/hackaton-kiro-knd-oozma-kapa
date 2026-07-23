import * as Phaser from 'phaser';

/**
 * Configuración del spritesheet de Karen
 * 
 * ESPECIFICACIONES TÉCNICAS (según la imagen real michi_karen.png):
 * - Dimensiones totales: 534 x 1080 píxeles
 * - Grid: 4 columnas x 8 filas (32 celdas)
 * - Tamaño de cada celda: 133.5 x 135 píxeles (534/4 = 133.5, 1080/8 = 135)
 * - Origen: Esquina superior izquierda (0,0)
 * - Filter Mode: Point (No Filter) / Nearest Neighbor
 * - Compression: None (RGBA 32-bit)
 */

// Configuración ajustada a las dimensiones reales de la imagen (534x1080)
const KAREN_SPRITE_CONFIG = {
  frameWidth: 133.5,   // Ancho de cada celda (534 / 4 columnas = 133.5)
  frameHeight: 135,    // Alto de cada celda (1080 / 8 filas = 135)
  columns: 4,          // Columnas en el spritesheet
  rows: 8,             // Filas en el spritesheet
  spacing: 0,          // Sin espacio entre frames
  margin: 0            // Sin margen inicial
};

/**
 * Definición de animaciones de Karen
 */
export interface KarenAnimation {
  key: string;
  startFrame: number;
  endFrame: number;
  frameRate: number;
  repeat: number; // -1 para loop infinito
}

/**
 * Todas las animaciones disponibles para Karen
 * 
 * MAPA DE ANIMACIONES (basado en la estructura observada):
 * - Row 1 (0-3):   Idle/Neutral - 4 frames [4-6 FPS]
 * - Row 2 (4-7):   Walking/Caminar - 4 frames [6-8 FPS]
 * - Row 3 (8-10):  Sleeping/Descanso - 3 frames [3 FPS] (celda 11 vacía)
 * - Row 4 (12-13): Working/Trabajando - 2 frames [5 FPS]
 * - Row 4 (14-15): Coffee/Café - 2 frames [4 FPS]
 * - Row 5 (16-19): Stressed/Enojada - 4 frames [7 FPS]
 * - Row 6 (20-21): Bored/Aburrida - 2 frames [3 FPS]
 * - Row 6 (22-23): Sad/Triste - 2 frames [4 FPS]
 * - Row 7 (24-25): Surprised/Sorprendida - 2 frames [5 FPS]
 * - Row 7 (26-27): Phone/Teléfono - 2 frames [4 FPS]
 * - Row 8 (28-29): Thinking/Pensando - 2 frames [3 FPS] (celdas 30-31 vacías)
 */
export const KAREN_ANIMATIONS: KarenAnimation[] = [
  // Row 1: Idle (4 frames) - Loop
  { key: 'karen-idle', startFrame: 0, endFrame: 3, frameRate: 5, repeat: -1 },
  
  // Row 2: Walk (4 frames) - Loop
  { key: 'karen-walk', startFrame: 4, endFrame: 7, frameRate: 7, repeat: -1 },
  
  // Row 3: Sleep (3 frames) - Loop
  { key: 'karen-sleep', startFrame: 8, endFrame: 10, frameRate: 3, repeat: -1 },
  
  // Row 4: Work (2 frames) + Coffee (2 frames) - Loop
  { key: 'karen-work', startFrame: 12, endFrame: 13, frameRate: 5, repeat: -1 },
  { key: 'karen-coffee', startFrame: 14, endFrame: 15, frameRate: 4, repeat: -1 },
  
  // Row 5: Stressed (4 frames) - Loop
  { key: 'karen-stressed', startFrame: 16, endFrame: 19, frameRate: 7, repeat: -1 },
  
  // Row 6: Bored (2 frames) + Sad (2 frames) - Loop
  { key: 'karen-bored', startFrame: 20, endFrame: 21, frameRate: 3, repeat: -1 },
  { key: 'karen-sad', startFrame: 22, endFrame: 23, frameRate: 4, repeat: -1 },
  
  // Row 7: Surprised (2 frames) + Phone (2 frames) - Play Once/Loop
  { key: 'karen-surprised', startFrame: 24, endFrame: 25, frameRate: 5, repeat: 0 },
  { key: 'karen-phone', startFrame: 26, endFrame: 27, frameRate: 4, repeat: -1 },
  
  // Row 8: Thinking (2 frames) - Loop
  { key: 'karen-thinking', startFrame: 28, endFrame: 29, frameRate: 3, repeat: -1 }
];

/**
 * Carga el spritesheet de Karen en una escena de Phaser
 * Aplica filtro NEAREST para evitar pixel bleeding en pixel art
 */
export function loadKarenSpritesheet(scene: Phaser.Scene): void {
  // Verificar si ya está cargado
  if (scene.textures.exists('karen-spritesheet')) {
    return;
  }

  scene.load.spritesheet('karen-spritesheet', 'assets/sprites/michi_karen.png', {
    frameWidth: KAREN_SPRITE_CONFIG.frameWidth,
    frameHeight: KAREN_SPRITE_CONFIG.frameHeight,
    startFrame: 0,
    endFrame: KAREN_SPRITE_CONFIG.columns * KAREN_SPRITE_CONFIG.rows - 1,
    spacing: KAREN_SPRITE_CONFIG.spacing,
    margin: KAREN_SPRITE_CONFIG.margin
  });

  // Aplicar filtro NEAREST después de cargar para pixel art nítido
  scene.load.once('complete', () => {
    const texture = scene.textures.get('karen-spritesheet');
    if (texture && texture.source && texture.source[0]) {
      texture.setFilter(Phaser.Textures.FilterMode.NEAREST);
    }
  });
}

/**
 * Crea todas las animaciones de Karen en el AnimationManager de Phaser
 */
export function createKarenAnimations(scene: Phaser.Scene): void {
  const anims = scene.anims;

  for (const anim of KAREN_ANIMATIONS) {
    // Verificar si la animación ya existe
    if (anims.exists(anim.key)) {
      continue;
    }

    anims.create({
      key: anim.key,
      frames: anims.generateFrameNumbers('karen-spritesheet', {
        start: anim.startFrame,
        end: anim.endFrame
      }),
      frameRate: anim.frameRate,
      repeat: anim.repeat
    });
  }
}

/**
 * Tipo de estado de Karen para mapear a animaciones
 */
export type KarenState = 
  | 'idle' 
  | 'walk' 
  | 'sleep' 
  | 'work' 
  | 'coffee'
  | 'stressed'
  | 'bored'
  | 'sad'
  | 'surprised'
  | 'phone'
  | 'thinking';

/**
 * Mapeo de nivel de Karenómetro a estado emocional
 */
export function getKarenStateFromLevel(karenLevel: number): KarenState {
  if (karenLevel >= 80) return 'stressed';      // Muy enojada
  if (karenLevel >= 60) return 'bored';         // Impaciente
  if (karenLevel >= 40) return 'thinking';      // Preocupada
  if (karenLevel >= 20) return 'work';          // Trabajando
  return 'idle';                                // Neutral
}

/**
 * Obtiene la clave de animación para un estado dado
 */
export function getKarenAnimationKey(state: KarenState): string {
  return `karen-${state}`;
}

/**
 * Clase helper para crear y manejar el sprite de Karen
 */
export class KarenSprite {
  private sprite: Phaser.GameObjects.Sprite;
  private currentState: KarenState = 'idle';
  private karenLevel: number = 0;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    this.sprite = scene.add.sprite(x, y, 'karen-spritesheet');
    // El sprite de 534x1080 (133.5x135 por frame) se escala para el juego
    // 135 * 0.25 ≈ 34px (similar al tamaño de Michi para mantener proporción)
    this.sprite.setScale(0.25);
    this.playAnimation('idle');
  }

  /**
   * Reproduce una animación de Karen
   */
  playAnimation(state: KarenState): void {
    if (this.currentState === state) return;
    
    this.currentState = state;
    const animKey = getKarenAnimationKey(state);
    
    if (this.sprite.scene.anims.exists(animKey)) {
      this.sprite.play(animKey);
    }
  }

  /**
   * Actualiza el estado basado en el nivel del Karenómetro
   */
  updateFromKarenLevel(karenLevel: number): void {
    this.karenLevel = karenLevel;
    const newState = getKarenStateFromLevel(karenLevel);
    this.playAnimation(newState);
  }

  /**
   * Reproduce animación temporal (ej: 'phone' cuando manda mensaje)
   */
  playTemporaryAnimation(state: KarenState, duration: number = 2000): void {
    const previousState = this.currentState;
    this.playAnimation(state);
    
    // Volver al estado anterior después del tiempo
    this.sprite.scene.time.delayedCall(duration, () => {
      const currentLevel = this.karenLevel;
      const baseState = getKarenStateFromLevel(currentLevel);
      this.playAnimation(baseState);
    });
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
  getState(): KarenState {
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
   * Obtiene la posición actual
   */
  getPosition(): { x: number; y: number } {
    return { x: this.sprite.x, y: this.sprite.y };
  }

  /**
   * Destruye el sprite
   */
  destroy(): void {
    this.sprite.destroy();
  }
}