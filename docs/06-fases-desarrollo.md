# Fases de Desarrollo - Ayuda a Michi Godín

## Fase 1: MVP ✅ COMPLETADA

### Tareas
- [x] Setup Angular 17 + PWA + Phaser.js
- [x] Sprites programáticos, TypeScript, sin backend, IndexedDB
- [x] Escena de oficina (tilemap 25x18, colisiones)
- [x] Michi jugable (4 direcciones, physics, animaciones)
- [x] Karen enviando mensajes (karenómetro, frecuencia adaptiva)
- [x] Minijuego git add/commit/push
- [x] HUD (6 stats + karenómetro + reloj)
- [x] Sistema de tiempo (9AM-6PM, eventos por hora)

---

## Fase 2: Contenido ✅ COMPLETADA

### Tareas
- [x] Sistema de logros (14 logros, tracking, persistencia)
- [x] Tienda de skins (9 skins, puntos, compra/equipar)
- [x] Audio (Web Audio API, 8 efectos programáticos)
- [x] NPCs: Michi QA, Becatín, Michi News (7 diálogos c/u)
- [x] Eventos aleatorios (8 negativos + 5 positivos)
- [x] Diálogos humorísticos (7 secuencias multi-personaje)
- [x] Progresión (5 niveles Lun-Vie, estrellas, desbloqueo)
- [x] Minijuegos Git: staging, branches, merge, conflicts
- [x] Jefes finales (3 bosses con timer y HP)

---

## Fase 3: Polish y Viralidad ✅ COMPLETADA

### Tareas
- [x] Generador de certificados (Canvas API, PNG descargable)
- [x] Compartir en LinkedIn (Web Share API + fallback)
- [x] Verificación QR (backend endpoint + generación qrcode)
- [x] Ranking online (backend + frontend con offline fallback)
- [x] Controles móviles (D-pad virtual + botón interacción)
- [x] PWA instalable (manifest, service worker, offline, prompt)
- [x] Localización ES/EN (80+ claves, detección automática)
- [x] Integración completa de todos los sistemas en OfficeScene

### Implementación Técnica Fase 3

| Sistema | Archivo | Descripción |
|---------|---------|-------------|
| Certificados | `certificate/certificate-generator.ts` | Canvas API, diseño completo, UUID, descarga PNG |
| LinkedIn | `certificate/share-linkedin.ts` | Texto optimizado, Web Share API, clipboard |
| QR Backend | `backend/modules/certificates/` | Endpoint verify + QR con qrcode lib |
| Rankings | `systems/ranking-system.ts` | Submit/get, offline con localStorage, sync |
| Mobile | `systems/mobile-controls.ts` | D-pad + botón E, auto-detección táctil |
| PWA | `systems/pwa-manager.ts` | Install prompt, update check, offline detection |
| i18n | `systems/i18n-system.ts` | ES/EN, 80+ claves, detección navegador |
| Integración | `scenes/office.scene.ts` | Todos los sistemas conectados y funcionando |

---

## Fase 4: Niveles Avanzados ✅ COMPLETADA

### Tareas
- [x] Sistema de progresión ampliado a 10 niveles (2 semanas laborales)
- [x] Minijuego Git Workflow (nivel 6): flujo completo con todos los comandos
- [x] Minijuego Git Cherry Pick (nivel 7): selección visual de commits
- [x] Minijuego Git Rebase (nivel 8): puzzle de reordenamiento + decisiones
- [x] Minijuego Git Release (nivel 9): checklist interactivo bajo presión
- [x] Karen Final Boss (nivel 10): 10 preguntas, timer agresivo, todos los conceptos
- [x] Integración de escenas nuevas en GameEngine
- [x] Mapeo de minijuegos en OfficeScene
- [x] Boss fights automáticos al completar niveles 5 y 10 (viernes)

### Implementación Técnica Fase 4

| Sistema | Archivo | Descripción |
|---------|---------|-------------|
| Workflow | `minigames/git-workflow/git-workflow.scene.ts` | 3 escenarios, timer 60s, todos los comandos |
| Cherry Pick | `minigames/git-cherry-pick/git-cherry-pick.scene.ts` | Árbol visual de commits, 4 rondas |
| Rebase | `minigames/git-rebase/git-rebase.scene.ts` | Drag & drop + decisiones, 4 rondas |
| Release | `minigames/git-release/git-release.scene.ts` | Checklist obligatorio/bonus, Karen presiona |
| Boss Nivel 4 | `scenes/boss.scene.ts` | 10 preguntas, 3.5-4.5s timer, conceptos avanzados |
| Progresión | `systems/progression-system.ts` | 10 niveles, dificultad 2x en nivel 10 |

---

## Resumen del Proyecto Completo

### Frontend (Angular 17 + Phaser.js)
```
src/app/
├── core/                    # GameEngine service
├── game/
│   ├── assets/              # Sprite generator
│   ├── scenes/              # Menu, Office, Boss
│   ├── systems/             # 14 sistemas
│   │   ├── achievements-system.ts
│   │   ├── audio-system.ts
│   │   ├── dialogue-system.ts
│   │   ├── events-system.ts
│   │   ├── hud-system.ts
│   │   ├── i18n-system.ts
│   │   ├── karen-system.ts
│   │   ├── mobile-controls.ts
│   │   ├── npc-system.ts
│   │   ├── portrait-system.ts
│   │   ├── progression-system.ts
│   │   ├── pwa-manager.ts
│   │   ├── ranking-system.ts
│   │   ├── skins-system.ts
│   │   └── time-system.ts
│   ├── minigames/           # 5 minijuegos
│   │   ├── git-basic/
│   │   ├── git-staging/
│   │   ├── git-branches/
│   │   ├── git-merge/
│   │   └── git-conflict/
│   └── entities/
├── certificate/             # Generador + LinkedIn share
├── ui/                      # Menú principal Angular
└── shared/
```

### Backend (Node.js + Express + TypeScript)
```
src/
├── modules/
│   ├── certificates/        # Generar, verificar, QR
│   ├── rankings/            # Top scores, submit
│   └── auth/                # JWT middleware
├── config/
└── main.ts
```

### Escenas del Juego (13 total)
| Escena | Propósito |
|--------|-----------|
| MenuScene | Menú principal con splash art |
| OfficeScene | Gameplay principal |
| HudScene | UI overlay sin zoom |
| GitBasicScene | Minijuego: add/commit/push |
| GitStagingScene | Minijuego: staging area |
| GitBranchesScene | Minijuego: elegir branch |
| GitMergeScene | Minijuego: aprobar/rechazar merge |
| GitConflictScene | Minijuego: resolver conflictos |
| GitWorkflowScene | Minijuego: workflow completo |
| GitCherryPickScene | Minijuego: cherry-pick visual |
| GitRebaseScene | Minijuego: rebase y reordenar commits |
| GitReleaseScene | Minijuego: checklist de release |
| BossScene | Jefes finales (4 niveles) |

### Estadísticas
- **14 sistemas** de juego integrados
- **9 minijuegos** de Git
- **4 jefes finales**
- **14 logros** rastreables
- **9 skins** desbloqueables
- **13 eventos** aleatorios
- **7 secuencias** de diálogo
- **10 niveles** de progresión (2 semanas)
- **3 personajes** NPC
- **2 idiomas** (ES/EN)
- **8 efectos** de sonido
- **PWA instalable** con offline
