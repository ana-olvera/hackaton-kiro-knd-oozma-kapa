# 🐱 Ayuda a Michi Godín: Sobrevive al Sprint

Un videojuego PWA que simula de manera humorística la vida de un desarrollador en una jornada laboral típica. Aprende Git mientras sobrevives a reuniones, bugs, y la infatigable Karen.

> 🚀 **¿Primera vez desplegando?** Lee: [docs/despliegue/LEEME_PRIMERO.md](./docs/despliegue/LEEME_PRIMERO.md)

## Estructura del Proyecto

```
hackaton-kiro-knd-oozma-kapa/
├── docs/                  # Documentación del proyecto
│   ├── 01-game-design.md
│   ├── 02-personajes.md
│   ├── 03-niveles-y-minijuegos.md
│   ├── 04-arquitectura.md
│   ├── 05-certificados.md
│   └── 06-fases-desarrollo.md
│
├── code/
│   ├── frontend/          # PWA - Angular 17 + Phaser.js
│   └── backend/           # API - Node.js + Express + TypeScript
│
└── README.md
```

## Requisitos Previos

- **Node.js** >= 18.x
- **npm** >= 9.x
- **Angular CLI** >= 17.x (`npm install -g @angular/cli`)

## 🚀 Despliegue en GitHub Pages

Este proyecto está configurado para desplegarse automáticamente en GitHub Pages.

**URL en producción:** https://ana-olvera.github.io/hackaton-kiro-knd-oozma-kapa/

### 📖 Documentación de Despliegue

| Documento | Descripción |
|-----------|-------------|
| [🚀 Quick Start](./docs/despliegue/QUICK_START.md) | Despliega en 5 minutos |
| [✅ Checklist](./docs/despliegue/CHECKLIST_DEPLOY.md) | Verificación paso a paso |
| [📘 Guía Completa](./docs/despliegue/DEPLOY.md) | Documentación detallada |
| [📦 Resumen](./docs/despliegue/DEPLOY_SUMMARY.md) | Arquitectura y configuración |

### ⚡ Despliegue Rápido

```bash
# Opción 1: Script automático (recomendado)
./scripts/quick-deploy.sh

# Opción 2: Manual
git add .
git commit -m "chore: deploy"
git push origin main
```

## Arranque Rápido

### Frontend (PWA)

```bash
cd code/frontend
npm install
ng serve
```

La aplicación estará disponible en `http://localhost:4200`.

### Backend (API) - Fase 2

> ⚠️ **Nota:** El backend no está desplegado en Fase 1. La PWA funciona completamente offline.

```bash
cd code/backend
cp .env.example .env
# Edita .env con tus valores locales
npm install
npm run dev
```

La API estará disponible en `http://localhost:3000`.

## Variables de Entorno

El backend requiere un archivo `.env` para funcionar. Usa `.env.example` como referencia:

```bash
cp code/backend/.env.example code/backend/.env
```

**Nunca subas el archivo `.env` al repositorio.** Contiene credenciales sensibles.

## Stack Tecnológico

| Componente | Tecnología |
|------------|-----------|
| Frontend | Angular 17, TypeScript, Phaser.js |
| PWA | Service Workers, IndexedDB |
| Backend | Node.js, Express, TypeScript |
| Autenticación | JWT |
| Certificados | QR Code, PDF generation |

## Scripts Disponibles

### Frontend

| Comando | Descripción |
|---------|------------|
| `npm start` | Inicia servidor de desarrollo |
| `npm run build` | Build de producción |
| `npm run test` | Ejecuta tests |

### Backend

| Comando | Descripción |
|---------|------------|
| `npm run dev` | Inicia servidor en modo desarrollo |
| `npm run build` | Compila TypeScript |
| `npm start` | Inicia servidor compilado |

## Documentación

La carpeta `docs/` contiene toda la documentación del proyecto:

### 📖 Índice de Documentación

**👉 [Ver documentación completa en docs/](./docs/README.md)**

#### Despliegue
- [🚀 Quick Start](./docs/despliegue/QUICK_START.md) - Despliega en 5 minutos
- [🎯 Primera Vez](./docs/despliegue/PRIMERA_VEZ.md) - Guía paso a paso
- [📘 Guía Completa](./docs/despliegue/DEPLOY.md) - Documentación detallada

#### Diseño del Juego
- [Game Design](./docs/01-game-design.md) - Diseño del juego, mecánicas y recursos
- [Personajes](./docs/02-personajes.md) - Personajes, enemigos y jefes
- [Niveles y Minijuegos](./docs/03-niveles-y-minijuegos.md) - Sistema de progresión
- [Arquitectura](./docs/04-arquitectura.md) - Arquitectura técnica
- [Certificados](./docs/05-certificados.md) - Sistema de certificados
- [Fases de Desarrollo](./docs/06-fases-desarrollo.md) - Roadmap del proyecto

#### Optimizaciones Móviles
- [📱 Mejoras Móvil](./docs/mobile/MEJORAS_MOVIL.md) - Controles táctiles y optimizaciones
- [🔧 Pantalla Completa](./docs/mobile/FIX_PANTALLA_COMPLETA.md) - Fix de letterboxing

## Contribuir

1. Crea una rama desde `main`: `git checkout -b feature/mi-feature`
2. Realiza tus cambios y haz commit: `git commit -m "feat: descripción"`
3. Push a tu rama: `git push origin feature/mi-feature`
4. Abre un Pull Request

## Equipo

**Oozma Kapa** - Hackatón Kiro KND

## Licencia

Este proyecto es privado y de uso exclusivo del equipo.
