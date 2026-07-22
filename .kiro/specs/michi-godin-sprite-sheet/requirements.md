# Documento de Requerimientos

## Introducción

Este documento define los requerimientos para la funcionalidad "Sprite Sheet de Michi Godín" - un generador completo de sprites en pixel art de 8 bits para el personaje principal "Michi Godín" en el juego PWA "Ayuda a Michi Godín". Los sprites serán generados programáticamente usando la API de Canvas para mantener consistencia con la arquitectura del código existente y eliminar la necesidad de assets de imagen externos.

## Glosario

- **Sprite_Generator**: La clase TypeScript responsable de crear texturas de juego programáticamente usando la API de Canvas
- **Frame**: Una imagen individual de 32x32 píxeles que representa un momento en una secuencia de animación
- **Animación**: Una secuencia de 3-6 frames que crean la ilusión de movimiento cuando se reproducen en sucesión
- **Spritesheet**: Un canvas único que contiene todos los frames de todas las animaciones organizados en una cuadrícula
- **Michi_Godín**: El personaje principal jugable - un gato azul claro estilo kawaii con corbata azul oscuro y maletín marrón
- **Sistema_Texturas_Phaser**: El sistema de gestión de texturas en Phaser 3 que maneja la carga y organización de assets de sprites
- **Estilo_Pixel_Art**: Gráficos estilo 8-bit NES usando una paleta de colores pastel limitada con contornos de píxeles limpios

## Requerimientos

### Requerimiento 1: Diseño Base del Personaje

**Historia de Usuario:** Como desarrollador del juego, quiero un diseño base consistente para Michi Godín, para que el personaje mantenga su identidad visual en todas las animaciones.

#### Criterios de Aceptación

1. EL Sprite_Generator DEBERÁ renderizar a Michi_Godín como un gato azul claro (#87CEEB cuerpo, #ADD8E6 brillos) en estilo kawaii
2. EL Sprite_Generator DEBERÁ renderizar una corbata azul oscuro (#1E3A5F) en el área del pecho del personaje
3. EL Sprite_Generator DEBERÁ renderizar un maletín marrón (#8B4513 principal, #A0522D brillos) sostenido por o cerca del personaje
4. EL Sprite_Generator DEBERÁ usar un canvas de 32x32 píxeles para cada frame con fondo transparente
5. EL Sprite_Generator DEBERÁ mantener proporciones consistentes del personaje en todos los frames de animación
6. EL Sprite_Generator DEBERÁ usar contornos limpios de 1 píxel (#2F4F4F) alrededor de los elementos principales del personaje

### Requerimiento 2: Animaciones de Movimiento

**Historia de Usuario:** Como jugador, quiero que Michi tenga animaciones de movimiento fluidas, para que el juego se sienta responsivo y pulido.

#### Criterios de Aceptación

1. CUANDO genere la animación idle, EL Sprite_Generator DEBERÁ crear 4 frames mostrando un sutil movimiento de respiración
2. CUANDO genere la animación caminar-derecha, EL Sprite_Generator DEBERÁ crear 4 frames con movimiento de piernas y balanceo de brazos
3. CUANDO genere la animación caminar-izquierda, EL Sprite_Generator DEBERÁ crear 4 frames reflejados horizontalmente de caminar-derecha
4. CUANDO genere la animación correr-derecha, EL Sprite_Generator DEBERÁ crear 4 frames con ciclo de piernas más rápido y postura inclinada
5. CUANDO genere la animación correr-izquierda, EL Sprite_Generator DEBERÁ crear 4 frames reflejados horizontalmente de correr-derecha
6. CUANDO genere la animación saltar, EL Sprite_Generator DEBERÁ crear 4 frames mostrando poses de despegue, punto más alto y aterrizaje

### Requerimiento 3: Animaciones de Actividades

**Historia de Usuario:** Como jugador, quiero que Michi muestre diferentes actividades de trabajo, para que el juego represente con precisión la vida de oficina.

#### Criterios de Aceptación

1. CUANDO genere la animación dormir, EL Sprite_Generator DEBERÁ crear 4 frames con ojos cerrados y texto "ZZZ" animado
2. CUANDO genere la animación trabajar-laptop, EL Sprite_Generator DEBERÁ crear 4 frames mostrando movimiento de teclear con un sprite de laptop
3. CUANDO genere la animación tomar-café, EL Sprite_Generator DEBERÁ crear 4 frames mostrando al personaje levantando y bebiendo de una taza de café

### Requerimiento 4: Animaciones de Emociones

**Historia de Usuario:** Como jugador, quiero que Michi exprese emociones visualmente, para poder entender el estado del personaje durante el juego.

#### Criterios de Aceptación

1. CUANDO genere la animación emocionado, EL Sprite_Generator DEBERÁ crear 4 frames con brazos levantados, efectos de destellos y expresión feliz
2. CUANDO genere la animación confundido, EL Sprite_Generator DEBERÁ crear 4 frames con cabeza inclinada y símbolos de interrogación animados
3. CUANDO genere la animación triste, EL Sprite_Generator DEBERÁ crear 4 frames con orejas caídas, postura agachada y efecto de lágrima
4. CUANDO genere la animación estresado, EL Sprite_Generator DEBERÁ crear 4 frames con gotas de sudor, expresión preocupada y ligero temblor
5. CUANDO genere la animación usando-teléfono, EL Sprite_Generator DEBERÁ crear 4 frames mostrando al personaje mirando un teléfono en mano
6. CUANDO genere la animación celebrando, EL Sprite_Generator DEBERÁ crear 4 frames con pose de victoria, movimiento de salto y efectos de confeti

### Requerimiento 5: Generación e Integración del Spritesheet

**Historia de Usuario:** Como desarrollador del juego, quiero todos los sprites organizados en un único spritesheet, para que Phaser pueda cargarlos y usarlos eficientemente.

#### Criterios de Aceptación

1. EL Sprite_Generator DEBERÁ organizar todos los frames de animación en una textura de canvas única con diseño de cuadrícula consistente
2. EL Sprite_Generator DEBERÁ registrar cada frame de animación con el sistema de texturas de Phaser usando índices numéricos secuenciales
3. EL Sprite_Generator DEBERÁ proporcionar índices de frame que permitan a Phaser crear animaciones nombradas (idle, caminar-derecha, caminar-izquierda, correr-derecha, correr-izquierda, saltar, dormir, trabajar, cafe, emocionado, confundido, triste, estresado, telefono, celebrar)
4. CUANDO el spritesheet ya exista en memoria, EL Sprite_Generator DEBERÁ omitir la regeneración para evitar texturas duplicadas
5. EL Sprite_Generator DEBERÁ exponer un método estático que pueda ser llamado desde cualquier escena de Phaser para generar todos los sprites de Michi

### Requerimiento 6: Consistencia de Paleta de Colores

**Historia de Usuario:** Como artista del juego, quiero una paleta de colores definida, para que todos los sprites mantengan armonía visual.

#### Criterios de Aceptación

1. EL Sprite_Generator DEBERÁ usar los siguientes colores primarios para Michi: cuerpo (#87CEEB), cuerpo-brillo (#ADD8E6), cuerpo-sombra (#5F9EA0)
2. EL Sprite_Generator DEBERÁ usar los siguientes colores de accesorios: corbata (#1E3A5F), maletín (#8B4513), maletín-brillo (#A0522D)
3. EL Sprite_Generator DEBERÁ usar los siguientes colores de acento: ojos (#2F4F4F), nariz (#FFB6C1), interior-oreja (#FFB6C1)
4. EL Sprite_Generator DEBERÁ usar los siguientes colores de efectos: destello (#FFD700), lágrima (#87CEFA), sudor (#87CEEB), zzz (#9370DB)
5. SI se usa un color fuera de la paleta definida, ENTONCES EL Sprite_Generator DEBERÁ usar el color más cercano de la paleta

### Requerimiento 7: Metadatos de Temporización de Animación

**Historia de Usuario:** Como desarrollador del juego, quiero información de temporización de animación, para poder configurar las animaciones de Phaser correctamente.

#### Criterios de Aceptación

1. EL Sprite_Generator DEBERÁ definir metadatos de tasa de frames: idle (4 fps), caminar (8 fps), correr (12 fps), otras animaciones (6 fps)
2. EL Sprite_Generator DEBERÁ definir metadatos de comportamiento de bucle: animaciones de movimiento se repiten, animaciones de emociones se reproducen una vez
3. EL Sprite_Generator DEBERÁ exponer datos de configuración de animación que puedan usarse para crear animaciones de Phaser
