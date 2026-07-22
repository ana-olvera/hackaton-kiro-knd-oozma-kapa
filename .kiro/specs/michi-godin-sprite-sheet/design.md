# Documento de Diseño Técnico

## Resumen Técnico

Este documento describe el diseño técnico para implementar el generador de sprite sheet de Michi Godín. El sistema utilizará la API de Canvas de HTML5 para dibujar programáticamente todos los frames de animación del personaje y los registrará en el sistema de texturas de Phaser 3 para su uso en el juego.

## Arquitectura

### Diagrama de Componentes

```
┌─────────────────────────────────────────────────────────────────┐
│                         MichiSpriteGenerator                     │
├─────────────────────────────────────────────────────────────────┤
│  + generateAll(scene: Phaser.Scene): void                       │
│  + getAnimationConfig(): AnimationConfig[]                      │
├─────────────────────────────────────────────────────────────────┤
│  - PALETTE: MichiColorPalette                                   │
│  - ANIMATIONS: AnimationDefinition[]                            │
│  - FRAME_SIZE: 32                                               │
├─────────────────────────────────────────────────────────────────┤
│  - drawMichiBase(ctx, x, y, options): void                      │
│  - drawIdle(ctx, x, y, frame): void                             │
│  - drawWalk(ctx, x, y, frame, direction): void                  │
│  - drawRun(ctx, x, y, frame, direction): void                   │
│  - drawJump(ctx, x, y, frame): void                             │
│  - drawSleep(ctx, x, y, frame): void                            │
│  - drawWork(ctx, x, y, frame): void                             │
│  - drawCoffee(ctx, x, y, frame): void                           │
│  - drawExcited(ctx, x, y, frame): void                          │
│  - drawConfused(ctx, x, y, frame): void                         │
│  - drawSad(ctx, x, y, frame): void                              │
│  - drawStressed(ctx, x, y, frame): void                         │
│  - drawPhone(ctx, x, y, frame): void                            │
│  - drawCelebrate(ctx, x, y, frame): void                        │
│  - drawAccessories(ctx, x, y, type): void                       │
│  - drawEffects(ctx, x, y, effectType, frame): void              │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Phaser.Textures.TextureManager               │
│  - addCanvas('michi-sprites', canvas)                           │
│  - add(frameIndex, sourceIndex, x, y, width, height)            │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Phaser.Animations.AnimationManager           │
│  - create({ key, frames, frameRate, repeat })                   │
└─────────────────────────────────────────────────────────────────┘
```

### Estructura del Spritesheet

```
Fila 0:  [idle-0][idle-1][idle-2][idle-3]           → Frames 0-3
Fila 1:  [walk-r-0][walk-r-1][walk-r-2][walk-r-3]   → Frames 4-7
Fila 2:  [walk-l-0][walk-l-1][walk-l-2][walk-l-3]   → Frames 8-11
Fila 3:  [run-r-0][run-r-1][run-r-2][run-r-3]       → Frames 12-15
Fila 4:  [run-l-0][run-l-1][run-l-2][run-l-3]       → Frames 16-19
Fila 5:  [jump-0][jump-1][jump-2][jump-3]           → Frames 20-23
Fila 6:  [sleep-0][sleep-1][sleep-2][sleep-3]       → Frames 24-27
Fila 7:  [work-0][work-1][work-2][work-3]           → Frames 28-31
Fila 8:  [coffee-0][coffee-1][coffee-2][coffee-3]   → Frames 32-35
Fila 9:  [excited-0][excited-1][excited-2][excited-3] → Frames 36-39
Fila 10: [confused-0][confused-1][confused-2][confused-3] → Frames 40-43
Fila 11: [sad-0][sad-1][sad-2][sad-3]               → Frames 44-47
Fila 12: [stressed-0][stressed-1][stressed-2][stressed-3] → Frames 48-51
Fila 13: [phone-0][phone-1][phone-2][phone-3]       → Frames 52-55
Fila 14: [celebrate-0][celebrate-1][celebrate-2][celebrate-3] → Frames 56-59

Dimensiones totales: 128px ancho (4 frames × 32px) × 480px alto (15 filas × 32px)
```

## Interfaces y Tipos

```typescript
// Paleta de colores para Michi Godín
interface MichiColorPalette {
  body: {
    main: string;      // #87CEEB - Azul claro
    highlight: string; // #ADD8E6 - Azul más claro
    shadow: string;    // #5F9EA0 - Azul grisáceo
  };
  accessories: {
    tie: string;              // #1E3A5F - Azul oscuro
    briefcase: string;        // #8B4513 - Marrón
    briefcaseHighlight: string; // #A0522D - Marrón claro
  };
  features: {
    eyes: string;     // #2F4F4F - Gris oscuro
    nose: string;     // #FFB6C1 - Rosa claro
    innerEar: string; // #FFB6C1 - Rosa claro
    outline: string;  // #2F4F4F - Contorno oscuro
  };
  effects: {
    sparkle: string;  // #FFD700 - Dorado
    tear: string;     // #87CEFA - Azul claro
    sweat: string;    // #87CEEB - Azul cielo
    zzz: string;      // #9370DB - Púrpura medio
    confetti: string[]; // Colores variados para confeti
  };
}

// Definición de una animación
interface AnimationDefinition {
  key: string;           // Nombre de la animación (ej: 'michi-idle')
  row: number;           // Fila en el spritesheet
  frameCount: number;    // Número de frames (siempre 4)
  frameRate: number;     // FPS de la animación
  repeat: number;        // -1 para loop infinito, 0 para una vez
}

// Opciones para dibujar el personaje base
interface MichiDrawOptions {
  facingLeft?: boolean;  // Si mira a la izquierda
  armPosition?: 'down' | 'up' | 'holding' | 'typing';
  legOffset?: number;    // Offset para animación de piernas
  eyeState?: 'open' | 'closed' | 'half' | 'worried';
  mouthState?: 'neutral' | 'happy' | 'sad' | 'open';
  bodyOffset?: { x: number; y: number }; // Para animaciones de salto/movimiento
  showBriefcase?: boolean;
  showTie?: boolean;
}

// Configuración de animación para Phaser
interface AnimationConfig {
  key: string;
  frames: { key: string; frame: number }[];
  frameRate: number;
  repeat: number;
}
```

## Diseño del Personaje (Pixel Art 32x32)

### Estilo Visual de Referencia

Basado en las imágenes de referencia proporcionadas, Michi Godín debe seguir un estilo **kawaii/chibi** con las siguientes características:

- **Cabeza grande**: Ocupa aproximadamente 60% del sprite (proporción chibi)
- **Ojos grandes y expresivos**: Estilo anime/kawaii con brillos
- **Orejas puntiagudas**: Triangulares, prominentes hacia arriba
- **Cuerpo pequeño**: Proporción 1:1.5 (cuerpo:cabeza)
- **Expresiones exageradas**: Para comunicar emociones claramente
- **Contornos definidos**: Línea oscura alrededor del personaje

### Anatomía de Michi Godín (Vista Frontal - Estilo Kawaii)

```
          ▲▲          ▲▲              ← Orejas puntiagudas
         █░░█        █░░█             
        █░░░░█      █░░░░█            
       █░░░░░░██████░░░░░░█           ← Cabeza grande y redonda
      █░░░░░░░░░░░░░░░░░░░░█          
      █░░░●●░░░░░░░░░●●░░░░█          ← Ojos grandes (kawaii)
      █░░░●●░░░░░░░░░●●░░░░█             con brillos blancos
      █░░░░░░░░▼░░░░░░░░░░░█          ← Nariz pequeña rosa
      █░░░░░░░╰──╯░░░░░░░░░█          ← Boca sonriente
       █░░░░░░░░░░░░░░░░░░█           
        █░░░░░░░░░░░░░░░░█            
         ██░░░░░░░░░░░░██             
           █░▓▓▓▓▓▓░█                 ← Corbata azul oscuro
           █░▓▓▓▓▓▓░█                 
          █░░░░░░░░░░█                ← Cuerpo pequeño
         █░░░░░░░░░░░░█               
        █░░░░░░░░░░░░░░█    ■■        ← Brazos cortos
        █░░░░░░░░░░░░░░█   ■██■       ← Maletín marrón
         █░░░░░░░░░░░░█    ■██■       
          █░░░░░░░░░░█     ■■         
           █░░█  █░░█                 ← Piernas cortas
           █░░█  █░░█                 

Leyenda:
█ = Contorno oscuro (#2F4F4F)
░ = Cuerpo azul claro (#87CEEB)
▓ = Corbata azul oscuro (#1E3A5F)
● = Ojos negros con brillo
▼ = Nariz rosa (#FFB6C1)
■ = Maletín marrón (#8B4513)
```

### Expresiones Faciales (Referencia)

```
  FELIZ          TRISTE         CONFUNDIDO      ESTRESADO       EMOCIONADO
  
  ●‿●            ●︿●            ●_●  ?          ●△●  💧         ●◡●  ✨
   ω               ︵              ω    ?          ω   💧          ω   ✨
```

### Proporciones del Personaje (Estilo Chibi)

| Elemento | Posición Y | Altura | Ancho | Notas |
|----------|------------|--------|-------|-------|
| Orejas | 0-6 | 6px | 5px c/u | Puntiagudas, hacia arriba |
| Cabeza | 2-18 | 16px | 20px | Grande, redonda (60% del sprite) |
| Ojos | 8-12 | 4px | 5px c/u | Grandes, con brillo blanco |
| Nariz | 13 | 2px | 2px | Pequeña, triangular, rosa |
| Boca | 14-15 | 2px | 4-6px | Expresiva, cambia según emoción |
| Cuerpo | 17-26 | 9px | 12px | Pequeño en proporción |
| Corbata | 17-21 | 5px | 4px | Centrada en pecho |
| Brazos | 19-24 | 5px | 3px c/u | Cortos, redondeados |
| Piernas | 26-31 | 5px | 4px c/u | Cortas, separadas |
| Maletín | 20-28 | 8px | 6px | A un lado del cuerpo |

## Algoritmos de Animación

### Idle (Respiración)

```typescript
// Frame 0: Posición base
// Frame 1: Cuerpo sube 1px, orejas se mueven ligeramente
// Frame 2: Posición base
// Frame 3: Cuerpo baja 1px, parpadeo
```

### Caminar

```typescript
// Frame 0: Pierna izquierda adelante, brazo derecho adelante
// Frame 1: Transición, ambas piernas centradas
// Frame 2: Pierna derecha adelante, brazo izquierdo adelante
// Frame 3: Transición, ambas piernas centradas
// Nota: El maletín se balancea con el movimiento
```

### Correr

```typescript
// Similar a caminar pero:
// - Mayor inclinación del cuerpo hacia adelante
// - Mayor amplitud de movimiento de piernas
// - Orejas hacia atrás
// - Maletín más horizontal
```

### Saltar

```typescript
// Frame 0: Preparación (agachado)
// Frame 1: Despegue (cuerpo estirado, pies juntos)
// Frame 2: Punto más alto (brazos arriba)
// Frame 3: Aterrizaje (agachado)
```

## Flujo de Generación

```
1. Verificar si textura 'michi-sprites' existe
   ├── Sí → Retornar (evitar duplicados)
   └── No → Continuar

2. Crear canvas (128 × 480 px)

3. Para cada animación (fila 0-14):
   │
   ├── Calcular posición Y = fila × 32
   │
   └── Para cada frame (0-3):
       │
       ├── Calcular posición X = frame × 32
       │
       ├── Llamar función de dibujo específica
       │   (drawIdle, drawWalk, etc.)
       │
       └── La función dibuja:
           ├── Base del personaje
           ├── Accesorios (corbata, maletín)
           ├── Expresión facial
           └── Efectos especiales (si aplica)

4. Registrar canvas en Phaser
   textures.addCanvas('michi-sprites', canvas)

5. Registrar frames individuales
   Para i = 0 hasta 59:
     texture.add(i, 0, (i%4)*32, floor(i/4)*32, 32, 32)

6. Crear configuraciones de animación
   Retornar array de AnimationConfig
```

## Integración con el Sistema Existente

### Modificaciones a sprite-generator.ts

El archivo `sprite-generator.ts` existente será extendido con:

1. **Nueva clase `MichiSpriteGenerator`**: Contendrá toda la lógica específica de Michi
2. **Actualización de `generateMichi()`**: Reemplazará la implementación actual
3. **Nuevo método `createMichiAnimations()`**: Para registrar animaciones en Phaser

### Modificaciones a michi.ts

El archivo `michi.ts` será actualizado para:

1. **Nuevos estados de animación**: Agregar todos los estados de emoción
2. **Método `playAnimation()`**: Para facilitar cambio de animaciones
3. **Integración con el sistema de estado**: Conectar estados del juego con animaciones

## Consideraciones de Rendimiento

1. **Generación única**: El spritesheet se genera solo una vez al inicio
2. **Verificación de existencia**: Se evita regenerar texturas existentes
3. **Canvas offscreen**: El canvas se crea fuera del DOM para mejor rendimiento
4. **Índices numéricos**: Uso de índices en lugar de strings para frames
