# Tareas de Implementación

## Tarea 1: Definir Paleta de Colores y Tipos

### Descripción
Crear las interfaces TypeScript y constantes para la paleta de colores de Michi Godín y las definiciones de animación.

### Requisitos Relacionados
- Requerimiento 1: Diseño Base del Personaje
- Requerimiento 6: Consistencia de Paleta de Colores

### Criterios de Aceptación
- [x] Crear interfaz `MichiAnimation` con propiedades de animación
- [x] Crear tipo `MichiState` para estados del personaje
- [x] Crear constante `MICHI_ANIMATIONS` con las 11 animaciones definidas
- [x] Exportar todos los tipos para uso en otros módulos

**Estado: COMPLETADA** - Se usó imagen generada por DALL-E en lugar de generación programática.

---

## Tarea 2: Configurar Carga de Spritesheet

### Descripción
Crear la función para cargar el spritesheet de Michi Godín generado con DALL-E en Phaser.

### Requisitos Relacionados
- Requerimiento 5: Generación e Integración del Spritesheet

### Criterios de Aceptación
- [x] Implementar `loadMichiSpritesheet(scene)` que cargue el PNG
- [x] Configurar dimensiones correctas (128x128 por frame, 5x7 grid)
- [x] Verificar que la textura no exista antes de cargar
- [x] Crear archivo JSON con definición de frames

**Estado: COMPLETADA**

---

## Tarea 3: Crear Animaciones en Phaser

### Descripción
Implementar función que crea todas las animaciones de Michi en el AnimationManager de Phaser.

### Requisitos Relacionados
- Requerimiento 7: Metadatos de Temporización de Animación

### Criterios de Aceptación
- [x] Implementar `createMichiAnimations(scene)` 
- [x] Configurar idle con 4 fps y loop infinito
- [x] Configurar caminar con 8 fps y loop infinito
- [x] Configurar animaciones de actividad con fps apropiados
- [x] Configurar animaciones de emoción con 6 fps
- [x] Usar nombres consistentes: 'michi-idle', 'michi-walk', etc.

**Estado: COMPLETADA**

---

## Tarea 4: Crear Clase Helper MichiSprite

### Descripción
Crear clase helper para facilitar la creación y manejo del sprite de Michi.

### Requisitos Relacionados
- Requerimiento 5: Generación e Integración del Spritesheet

### Criterios de Aceptación
- [x] Implementar clase `MichiSprite` con métodos para animaciones
- [x] Método `playAnimation(state)` para cambiar animación
- [x] Método `setFlipX()` para voltear horizontalmente
- [x] Escalar sprite a tamaño apropiado para el juego (0.25x)

**Estado: COMPLETADA**

---

## Tarea 5: Integrar con MenuScene

### Descripción
Actualizar MenuScene para cargar el nuevo spritesheet de Michi.

### Requisitos Relacionados
- Requerimiento 5: Generación e Integración del Spritesheet

### Criterios de Aceptación
- [x] Importar funciones de michi-sprite-loader
- [x] Llamar loadMichiSpritesheet en preload()
- [x] Llamar createMichiAnimations en create()

**Estado: COMPLETADA**

---

## Tarea 6: Integrar con OfficeScene

### Descripción
Actualizar OfficeScene para usar el nuevo spritesheet de Michi.

### Requisitos Relacionados
- Requerimiento 5: Generación e Integración del Spritesheet

### Criterios de Aceptación
- [x] Importar funciones de michi-sprite-loader
- [x] Llamar loadMichiSpritesheet en preload()
- [ ] Actualizar createMichiAnimations para usar nuevo spritesheet
- [ ] Probar que el sprite se muestra correctamente

**Estado: EN PROGRESO**

---

## Tarea 7: Pruebas y Ajustes Finales

### Descripción
Verificar que todos los sprites se ven correctos y hacer ajustes si es necesario.

### Requisitos Relacionados
- Todos los requerimientos

### Criterios de Aceptación
- [ ] Verificar que el personaje se ve kawaii y atractivo
- [ ] Verificar que los colores son consistentes
- [ ] Verificar que las transiciones entre frames son suaves
- [ ] Verificar rendimiento
- [ ] Compilar el proyecto sin errores

**Estado: PENDIENTE**
