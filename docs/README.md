# 📚 Documentación - Ayuda a Michi Godín

Documentación completa del proyecto "Ayuda a Michi Godín: Sobrevive al Sprint"

---

## 🎮 Diseño del Juego

Documentación sobre el diseño, mecánicas y planificación del juego.

| Documento | Descripción |
|-----------|-------------|
| [00-planeacion.md](./00-planeacion.md) | 📋 **Planeación completa del proyecto** - Documento maestro |
| [01-game-design.md](./01-game-design.md) | Diseño del juego, mecánicas y recursos |
| [02-personajes.md](./02-personajes.md) | Personajes, enemigos y jefes |
| [03-niveles-y-minijuegos.md](./03-niveles-y-minijuegos.md) | Sistema de progresión y detalle de niveles |
| [04-arquitectura.md](./04-arquitectura.md) | Arquitectura técnica y decisiones de diseño |
| [05-certificados.md](./05-certificados.md) | Sistema de certificados y verificación |
| [06-fases-desarrollo.md](./06-fases-desarrollo.md) | Roadmap y fases de desarrollo |

---

## 🚀 Despliegue

Guías completas para desplegar el juego en GitHub Pages.

### Inicio Rápido

| Documento | Descripción | Tiempo |
|-----------|-------------|--------|
| [LEEME_PRIMERO.md](./despliegue/LEEME_PRIMERO.md) | 👋 **Empieza aquí** - Introducción al despliegue | 2 min |
| [QUICK_START.md](./despliegue/QUICK_START.md) | ⚡ Despliegue rápido en 3 pasos | 5 min |
| [PRIMERA_VEZ.md](./despliegue/PRIMERA_VEZ.md) | 🎯 Guía paso a paso para primer despliegue | 10 min |

### Documentación Detallada

| Documento | Descripción |
|-----------|-------------|
| [DEPLOY.md](./despliegue/DEPLOY.md) | 📘 Guía completa de despliegue con solución de problemas |
| [CHECKLIST_DEPLOY.md](./despliegue/CHECKLIST_DEPLOY.md) | ✅ Checklist de verificación pre y post-despliegue |
| [DEPLOY_SUMMARY.md](./despliegue/DEPLOY_SUMMARY.md) | 📦 Resumen técnico: arquitectura y configuración |

---

## 📱 Optimizaciones Móviles

Documentación sobre las optimizaciones para dispositivos móviles.

| Documento | Descripción |
|-----------|-------------|
| [MEJORAS_MOVIL.md](./mobile/MEJORAS_MOVIL.md) | 📱 Guía completa de controles táctiles y optimizaciones |
| [FIX_PANTALLA_COMPLETA.md](./mobile/FIX_PANTALLA_COMPLETA.md) | 🔧 Solución del problema de letterboxing en móviles |

### Características Móviles

- ✅ Controles táctiles (D-pad + botón de interacción)
- ✅ Botones para minijuegos
- ✅ Pantalla completa sin espacios negros
- ✅ Responsive en todos los dispositivos
- ✅ Soporte para cambios de orientación
- ✅ Optimizado para iOS y Android
- ✅ PWA instalable

---

## 🛠️ Desarrollo

### Stack Tecnológico

**Frontend (PWA):**
- Angular 17
- TypeScript
- Phaser.js (motor de juego 2D)
- Service Workers (PWA)
- IndexedDB (guardado local)
- SCSS/CSS

**Backend (Fase 2):**
- Node.js
- Express
- TypeScript
- JWT (autenticación)
- QR Code generation

### Estructura del Proyecto

```
hackaton-kiro-knd-oozma-kapa/
├── docs/                      # 📚 Documentación (estás aquí)
│   ├── despliegue/           # Guías de despliegue
│   ├── mobile/               # Optimizaciones móviles
│   └── *.md                  # Diseño del juego
│
├── code/
│   ├── frontend/             # PWA Angular + Phaser
│   └── backend/              # API Node.js (Fase 2)
│
├── scripts/                   # Scripts de automatización
│   ├── quick-deploy.sh       # Despliegue rápido
│   └── deploy-local.sh       # Build local
│
├── .github/workflows/        # GitHub Actions
│   └── deploy.yml           # Workflow de despliegue
│
└── README.md                 # README principal
```

---

## 🎯 Quick Links

### Para Usuarios

- **¿Primera vez?** → [LEEME_PRIMERO.md](./despliegue/LEEME_PRIMERO.md)
- **Quiero jugar** → https://ana-olvera.github.io/hackaton-kiro-knd-oozma-kapa/
- **Ver el código** → [../code/](../code/)

### Para Desarrolladores

- **Arquitectura técnica** → [04-arquitectura.md](./04-arquitectura.md)
- **Fases de desarrollo** → [06-fases-desarrollo.md](./06-fases-desarrollo.md)
- **Desplegar cambios** → `./scripts/quick-deploy.sh`
- **Build local** → `./scripts/deploy-local.sh`

### Para el Equipo

- **Diseño del juego** → [01-game-design.md](./01-game-design.md)
- **Personajes** → [02-personajes.md](./02-personajes.md)
- **Niveles** → [03-niveles-y-minijuegos.md](./03-niveles-y-minijuegos.md)
- **Roadmap** → [06-fases-desarrollo.md](./06-fases-desarrollo.md)

---

## 🌐 URLs Importantes

| Recurso | URL |
|---------|-----|
| 🎮 Juego en producción | https://ana-olvera.github.io/hackaton-kiro-knd-oozma-kapa/ |
| 🔄 GitHub Actions | https://github.com/ana-olvera/hackaton-kiro-knd-oozma-kapa/actions |
| ⚙️ Settings del repo | https://github.com/ana-olvera/hackaton-kiro-knd-oozma-kapa/settings |
| 📦 Repositorio | https://github.com/ana-olvera/hackaton-kiro-knd-oozma-kapa |

---

## 📊 Estado del Proyecto

### ✅ Fase 1 - MVP (Completado)

- [x] Setup Angular 17 + PWA
- [x] Integración Phaser.js
- [x] Escena de oficina
- [x] Personaje jugable (Michi)
- [x] Sistema de estados (energía, café, hambre, etc.)
- [x] Karen (mensajes aleatorios)
- [x] Minijuegos básicos de Git
- [x] HUD funcional
- [x] Sistema de tiempo (9 AM - 6 PM)
- [x] Controles móviles táctiles
- [x] PWA instalable
- [x] Despliegue automático en GitHub Pages
- [x] Pantalla completa en móviles

### 🚧 Fase 2 - Contenido (En Progreso)

- [ ] Más personajes (Michi QA, Becatín, Michi News)
- [ ] Eventos aleatorios
- [ ] Diálogos completos
- [ ] Todos los minijuegos de Git
- [ ] Sistema de logros
- [ ] Música y efectos de sonido
- [ ] Backend para certificados

### 📋 Fase 3 - Polish y Viralidad (Pendiente)

- [ ] Ranking en línea
- [ ] Generador de certificados PDF
- [ ] Integración con LinkedIn
- [ ] Verificación de certificados con QR
- [ ] Optimización rendimiento
- [ ] Testing completo
- [ ] Localización (ES/EN)

---

## 🤝 Contribuir

### Flujo de Trabajo

1. Crea una rama: `git checkout -b feature/mi-feature`
2. Haz tus cambios
3. Commit: `git commit -m "feat: descripción"`
4. Push: `git push origin feature/mi-feature`
5. Abre un Pull Request

### Convenciones

- **Commits:** Usa [Conventional Commits](https://www.conventionalcommits.org/)
- **Código:** TypeScript con ESLint
- **Estilos:** SCSS con BEM methodology
- **Documentación:** Markdown con formato consistente

---

## 👥 Equipo

**Oozma Kapa** - Hackatón Kiro KND

---

## 📄 Licencia

Este proyecto es privado y de uso exclusivo del equipo.

---

## 🆘 Soporte

Si tienes problemas:

1. Revisa la documentación correspondiente en esta carpeta
2. Consulta los logs en GitHub Actions
3. Contacta al equipo

---

**¡Gracias por usar la documentación de Michi Godín!** 🐱💻
