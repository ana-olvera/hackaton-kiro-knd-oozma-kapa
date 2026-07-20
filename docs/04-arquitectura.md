# Arquitectura Técnica - Ayuda a Michi Godín

## Stack Tecnológico

### Frontend (PWA)

```
Frontend PWA
├── Angular 17
├── TypeScript
├── HTML5 Canvas
├── Phaser.js (Motor de juego 2D)
├── SCSS/CSS
└── Service Workers (PWA)
```

### Backend (Servicios opcionales)

```
Backend
├── Node.js + Express/NestJS
├── TypeScript
├── Base de datos (PostgreSQL o MongoDB)
├── Autenticación (JWT)
└── API REST
```

---

## Diagrama de Arquitectura General

```
                    PWA (Angular 17)

              ┌────────────────────┐
              │      UI Juego      │
              │ HUD - Oficina      │
              │ Karenómetro        │
              └─────────┬──────────┘
                        │
            ┌───────────┴────────────┐
            │                        │
    Game Engine                Git Challenge Engine
            │                        │
            └───────────┬────────────┘
                        │
                State Manager
                        │
          LocalStorage / IndexedDB
                        │
              Backend API (opcional)
              ├── Rankings
              ├── Certificados
              └── Verificación QR
```

---

## Integración Angular + Phaser

```
Angular
├── HUD (Stats, Karenómetro)
├── Menús (Inicio, Pausa, Settings)
├── Inventario
├── Configuración
├── Certificados
└── Phaser (Canvas embebido)
        ├── Personajes
        ├── Física
        ├── Animaciones
        ├── Colisiones
        └── Niveles
```

Angular maneja la UI general (menús, HUD, configuración) mientras que Phaser se encarga del motor de juego (sprites, física, animaciones, colisiones).

---

## Estructura del Proyecto Frontend

```
code/frontend/
├── src/
│   ├── app/
│   │   ├── core/                    # Servicios centrales
│   │   │   ├── game-engine/         # Motor del juego
│   │   │   ├── state-manager/       # Estado global
│   │   │   ├── audio-manager/       # Sonidos y música
│   │   │   └── storage/             # LocalStorage/IndexedDB
│   │   │
│   │   ├── game/                    # Lógica del juego
│   │   │   ├── scenes/              # Escenas de Phaser
│   │   │   │   ├── office.scene.ts
│   │   │   │   ├── minigame.scene.ts
│   │   │   │   └── menu.scene.ts
│   │   │   ├── entities/            # Personajes y objetos
│   │   │   │   ├── michi.ts
│   │   │   │   ├── karen.ts
│   │   │   │   ├── michi-qa.ts
│   │   │   │   └── becatin.ts
│   │   │   ├── systems/             # Sistemas del juego
│   │   │   │   ├── status-bars.ts
│   │   │   │   ├── event-spawner.ts
│   │   │   │   └── dialogue.ts
│   │   │   └── minigames/           # Minijuegos
│   │   │       ├── git-add/
│   │   │       ├── git-commit/
│   │   │       ├── merge/
│   │   │       └── conflict/
│   │   │
│   │   ├── ui/                      # Interfaz de Angular
│   │   │   ├── hud/
│   │   │   ├── menus/
│   │   │   ├── inventory/
│   │   │   └── settings/
│   │   │
│   │   ├── certificate/             # Generador de certificados
│   │   │   ├── template/
│   │   │   └── pdf-generator/
│   │   │
│   │   └── shared/                  # Componentes compartidos
│   │
│   ├── assets/
│   │   ├── sprites/                 # Sprites pixel art
│   │   ├── audio/                   # Sonidos y música
│   │   ├── fonts/
│   │   └── data/                    # JSONs de configuración
│   │
│   └── styles/
│
├── angular.json
├── package.json
├── tsconfig.json
└── README.md
```

---

## Estructura del Proyecto Backend

```
code/backend/
├── src/
│   ├── modules/
│   │   ├── auth/                    # Autenticación
│   │   ├── certificates/            # Generación y verificación
│   │   ├── rankings/                # Tabla de posiciones
│   │   └── users/                   # Gestión de usuarios
│   │
│   ├── common/                      # Utilidades compartidas
│   │   ├── guards/
│   │   ├── interceptors/
│   │   └── decorators/
│   │
│   ├── config/                      # Configuración
│   └── main.ts
│
├── package.json
├── tsconfig.json
├── .env.example
└── README.md
```

---

## Decisiones Técnicas

### ¿Por qué Angular 17?
- Framework robusto para aplicaciones SPA/PWA
- Soporte nativo de Service Workers
- TypeScript integrado
- Ecosistema maduro

### ¿Por qué Phaser.js?
- Motor de juego 2D maduro y ligero
- Soporte de canvas y WebGL
- Fácil integración con Angular
- Gran comunidad y documentación
- Manejo de sprites, animaciones, física y colisiones

### ¿Por qué PWA?
- Instalable en dispositivos móviles
- Funciona offline (Service Workers)
- No requiere store (distribución directa)
- Experiencia nativa en el navegador

### ¿Por qué Node.js/NestJS para backend?
- Mismo lenguaje (TypeScript) en todo el stack
- NestJS ofrece arquitectura modular
- Fácil de escalar
- Solo se usa para funcionalidades opcionales (rankings, certificados verificables)

---

## Almacenamiento

### Fase MVP (Sin backend)
- **LocalStorage:** Configuraciones rápidas
- **IndexedDB:** Progreso del juego, estado guardado, logros

### Fase con Backend
- **PostgreSQL/MongoDB:** Rankings, certificados, usuarios
- **Redis (opcional):** Cache de sesiones
