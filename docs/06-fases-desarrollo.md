# Fases de Desarrollo - Ayuda a Michi Godín

## Fase 1: MVP (2-3 semanas) ✅ COMPLETADA

### Objetivos
Tener un juego funcional con mecánicas básicas jugable en navegador.

### Tareas

- [x] Setup inicial Angular 17 + PWA
- [x] Integración de Phaser.js
- [x] Sprites pixel art 32×32 (generados programáticamente)
- [x] Todo en TypeScript
- [x] Sin backend (funciona standalone)
- [x] Guardado local con IndexedDB
- [x] Escena de oficina básica (tilemap 25x18, mobiliario, colisiones)
- [x] Personaje Michi jugable (animaciones 4 direcciones, physics body)
- [x] Karen enviando mensajes (sistema tipo Teams, karenómetro, frecuencia adaptiva)
- [x] Minijuego básico (git add/commit/push en orden correcto)
- [x] Barra de estados funcional (HUD con 6 stats + karenómetro + reloj)
- [x] Sistema de tiempo (9 AM - 6 PM, eventos por hora, game over/victoria)

### Implementación Técnica

| Sistema | Archivo | Descripción |
|---------|---------|-------------|
| Sprites | `game/assets/sprite-generator.ts` | Genera texturas programáticamente (Michi, Karen, tiles, items, UI) |
| Oficina | `game/scenes/office.scene.ts` | Escena principal con tilemap, colisiones, interacciones |
| Karen | `game/systems/karen-system.ts` | Mensajes periódicos, impacto en estrés, frecuencia adaptiva |
| Tiempo | `game/systems/time-system.ts` | Reloj 9AM-6PM, eventos por hora, fin del día |
| HUD | `game/systems/hud-system.ts` | Barras de estado, colores dinámicos, karenómetro |
| Minijuego | `game/minigames/git-basic/git-basic.scene.ts` | git add→commit→push en orden |
| Engine | `core/game-engine/game-engine.service.ts` | Configuración Phaser + registro de escenas |

### Mecánicas Implementadas

- **Movimiento:** Flechas del teclado, animaciones walk/idle en 4 direcciones
- **Interacción:** Tecla E para cafetera (+café, +energía) y computadoras (minijuego)
- **Degradación:** Stats se degradan cada 5 segundos automáticamente
- **Game Over:** Estrés llega a 100 o energía llega a 0
- **Victoria:** Sobrevivir hasta las 6 PM
- **Eventos temporales:** Daily meeting (10AM), hambre (1PM), sueño post-comida (3PM)

---

## Fase 2: Contenido (3-4 semanas)

### Objetivos
Expandir el contenido del juego con todos los personajes, niveles y mecánicas.

### Tareas

- [ ] Sistema de logros
- [ ] Tienda de skins para Michi
- [ ] Música y efectos de sonido
- [ ] Más personajes (Michi QA, Becatín, Michi News)
- [ ] Eventos aleatorios (VPN caída, Windows Update, reunión sorpresa)
- [ ] Diálogos humorísticos
- [ ] Sistema de progresión (desbloqueo de niveles)
- [ ] Todos los minijuegos de Git (staging, branches, merge, conflicts)
- [ ] Jefes finales

---

## Fase 3: Polish y Viralidad (2-3 semanas)

### Objetivos
Pulir la experiencia, agregar funcionalidades sociales y preparar para lanzamiento.

### Tareas

- [ ] Ranking en línea (requiere backend)
- [ ] Editor de niveles (opcional)
- [ ] Generador de certificados PDF
- [ ] Integración con LinkedIn
- [ ] Verificación de certificados con QR (requiere backend)
- [ ] Optimización para móviles
- [ ] PWA instalable
- [ ] Testing y balanceo
- [ ] Localización (ES/EN)

---

## Assets Necesarios

### Sprites (Pixel Art 32×32 o 48×48)

- [x] Michi Godín (generado programáticamente, 4 direcciones × 4 frames)
- [x] Karen (retrato 48×48 para diálogos)
- [x] Oficina (tiles: piso, pared, escritorio, compu, cafetera, silla)
- [x] Items (café, dona, concha, pizza)
- [x] UI elements (iconos para barras de estado)
- [ ] Michi Testings / Michi QA
- [ ] Becatín
- [ ] Michi News
- [ ] MichiOps
- [ ] SQLino

### Audio

- [ ] Música de fondo (office vibes)
- [ ] Efectos de sonido (Teams notification, keyboard, café)
- [ ] Voces de personajes (opcional)

### UI

- [x] HUD de estados
- [x] Karenómetro animado
- [ ] Diálogos estilo chat (parcial - Karen notifications implementadas)
- [x] Menús (MenuScene con instrucciones)
- [ ] Certificado template
