# 🐱 Ayuda a Michi Godín: Sobrevive al Sprint
## Documento de Planeación del Proyecto PWA

---

## Resumen del Proyecto

**Ayuda a Michi Godín** es un videojuego PWA que simula de manera humorística la vida de un desarrollador en una jornada laboral típica. El jugador aprende Git y conceptos de desarrollo de software mientras intenta sobrevivir a interrupciones, reuniones, bugs y la infatigable Karen.

**Géneros:** Simulador de supervivencia office + Minijuegos + Humor godín

**Inspiración:** Overcooked + WarioWare + Papers Please + Vampire Survivors + Memes de programadores

---

## Historia

Es lunes. 9:00 AM. Karen aparece por Teams: *"Michi, ¿cómo va esa integración?"*

Michi responde: *"Ya casi."* (mentira piadosa)

En realidad tiene:
- 42 ramas abiertas
- 17 conflictos en Git
- El backend ya cambió
- El frontend también
- QA encontró 38 bugs
- Y todavía no desayuna

**Tu misión:** Ayudar a Michi a sobrevivir el día laboral. No se trata de terminar rápido, se trata de **sobrevivir hasta las 6 PM sin renunciar.**

---

## El Enemigo Principal

No son los bugs. Es el **tiempo**. Cada minuto aparece un nuevo problema.

---

## Barra de Estados

| Estado | Descripción |
|--------|-------------|
| ❤️ Energía | Nivel de energía general |
| ☕ Café | Nivel de cafeína |
| 🍗 Hambre | Necesidad de comida |
| 😴 Sueño | Nivel de cansancio |
| 🧠 Concentración | Capacidad de trabajo efectivo |
| 😿 Estrés | Nivel de estrés acumulado |
| 😡 Karenómetro | Frecuencia de mensajes de Karen |

**Mientras más alto esté el Karenómetro, más seguido llegan mensajes.**

---

## Personajes

### 🐱 Michi Godín (Protagonista)
El protagonista. Quiere trabajar, pero la oficina no lo deja.

**Frase favorita:** *"Ya casi termino..."*

---

### 👩 Karen (La Jefa de Proyecto)
Nunca está satisfecha. Siempre aparece por Teams. Tiene una habilidad especial: puede detectar cuando abriste YouTube.

**Frases:**
- "¿Cómo vamos?"
- "Es rápido."
- "Nada más cambia un botón."
- "¿Lo subes hoy?"

**Karenómetro:** Cada mensaje aumenta el estrés.

---

### 🐱 Michi Testings (Michi QA)
Un gato muy elegante. Siempre trae lentes. Siempre encuentra errores imposibles.

**Frases:**
- "Solo encontré un detalle..." *(abre lista de 47 bugs)*
- "Es un caso muy específico."
- "Solo pasa cuando haces doble clic mientras mantienes Shift y desconectas el WiFi."
- "No es bug... es comportamiento esperado."

**Poder especial:** Convierte cualquier tarea sencilla en cinco tickets nuevos.

---

### 🐱 Becatín (Michi Becario)
Tiene mucha energía. Muy buena intención. Cero experiencia.

**Frases:**
- "¿Qué es un merge?"
- "Ya hice push directamente a main."
- "Borré la base pero ya la estoy restaurando."
- "Pensé que era de pruebas."

**Mecánica:** Cada vez que aparece puede romper algo accidentalmente. Si lo ayudas, obtienes puntos de empatía.

---

### 🐱 Michi News (El Gato Chismoso)
Jamás trabaja. Siempre sabe todo.

**Frases:**
- "Dicen que RH anda buscando..."
- "¿Ya viste quién renunció?"
- "¿Ya supiste lo del aumento?"
- "Ven tantito."

**Mecánica:** Siempre dice "tantito" y nunca dura menos de 30 minutos. Escucharlo da +Felicidad pero -Tiempo.

---

### 🐱 MichiOps (DevOps)
**Frase:** *"En mi ambiente sí funciona."*

---

### 🐱 SQLino (DBA)
Siempre protege la base de datos.

**Frase:** *"Eso no toca la BD."* (Cinco minutos después... era la BD).

---

## Enemigos

| Enemigo | Comportamiento |
|---------|----------------|
| 🐞 Bugcito | Camina lento. Hace pequeños errores. |
| 💀 Bug de Producción | Aparece de repente. Hace perder tiempo. |
| 🔥 Merge Conflict | El verdadero jefe. Cuando aparece todo se pone rojo, suena una alarma, Git explota. |
| ☕ Café vacío | La energía comienza a bajar rápidamente. |
| 🍗 Hambre | Michi comienza a caminar más lento. |
| 😴 Sueño | Después de comer. Todo va lento. |

---

## Jefes

| Nivel | Jefe |
|-------|------|
| Nivel 1 | Merge Conflict |
| Nivel 2 | Sprint |
| Nivel 3 | Deploy |
| Nivel 4 | Producción |
| Nivel 5 | Karen + Cliente + QA al mismo tiempo |

**Karen Final Boss (6 PM):** Solo pregunta *"¿Ya quedó?"* Si respondes "No", pierdes.

---

## Recursos

| Recurso | Efecto | Contras |
|---------|--------|---------|
| ☕ Café | Da energía | Demasiado hace temblar a Michi |
| 🍩 Dona | Da felicidad | - |
| 🥐 Concha | Reduce hambre | - |
| 🍕 Pizza fría del viernes | Mucha energía | Da sueño |

---

## Eventos Aleatorios

| Evento | Efecto |
|--------|--------|
| Daily Meeting | Todos quedan congelados durante un minuto |
| Teams | Suena todo el tiempo |
| Outlook | Llegan 25 correos, solo uno era importante |
| VPN caída | No puedes hacer push |
| Internet lento | Git tarda siglos |
| Windows Update | - |
| Reunión que pudo ser correo | - |
| Café gratis | +Energía |
| Pastel de cumpleaños | +Felicidad |
| Viernes de pizza | +Energía |
| "Hay ambiente laboral" | - |

---

## Mecánicas de Decisión

El juego no es solo caminar por la oficina, cada interrupción es una decisión con consecuencias:

| Decisión | Consecuencia |
|----------|--------------|
| Karen te escribe | Responder rápido baja el Karenómetro pero pierdes concentración |
| ¿Ir por café o seguir programando? | Ignorar café = más errores en minijuegos |
| Michi News aparece con chisme | Ignorar = ganas tiempo pero baja felicidad. Escuchar = sube felicidad, pierdes 15 minutos |
| Invitan a pedir pizza | Aceptar = recuperas energía. No = hambre aumenta |
| "Reunión de 15 minutos" | En realidad dura 45 minutos |

---

## Sistema de Progresión (Aprendizaje de Git)

El jugador nunca verá comandos técnicos inicialmente. En su lugar:

| Concepto Git | Presentación en Juego |
|--------------|----------------------|
| `git add` | 📂 Preparar cambios / "Guardar en la mochila" |
| `git commit` | 📝 Documentar avance / "Escribir reporte" |
| `git push` | 🚀 Enviar integración / "Enviar al servidor" |
| `git merge` | 🤝 Reunir equipos |
| Conflict | 💥 "Dos compañeros modificaron el mismo documento" |

Poco a poco el juego mostrará los comandos reales. El jugador aprende sin memorizar.

---

## Niveles de Minijuegos

### Nivel 1: Git Básico
Karen dice: "Sube el cambio."
- Aparecen tres botones: `git add` → `git commit` → `git push`
- El jugador debe hacerlo en orden
- Error: Karen pregunta *"¿Seguro que hiciste commit?"*

### Nivel 2: Staging Area
- Arrastrar archivos al Staging Area
- Como un rompecabezas: README ↓ Staging Area ↓ Commit

### Nivel 3: Branches
- Visualmente unir ramas
- Como unir equipos de trabajo

### Nivel 4: Conflictos Sencillos
```
<<<<<<< HEAD
Hola
=======
Hola Mundo
>>>>>>> feature
```
- Opciones: ¿Qué quieres conservar?
  - ( ) Hola
  - ( ) Hola Mundo
  - ( ) Ambos

### Nivel 5: Conflictos Múltiples
- Editor de texto simple
- Debe editar solo unas pocas líneas

### Nivel 6: Integración Completa
- Todos los comandos como botones
- Workflow completo

### Nivel 7: Cherry Pick
### Nivel 8: Rebase
### Nivel 9: Release
### Nivel 10: Producción

---

## Progresión Completa

```
Nivel 1  → Guardar cambios (add)
Nivel 2  → Commit
Nivel 3  → Branches
Nivel 4  → Merge
Nivel 5  → Conflictos
Nivel 6  → Cherry Pick
Nivel 7  → Rebase
Nivel 8  → Release
Nivel 9  → Producción
Nivel 10 → Karen Final Boss
```

---

## Poderes Especiales

| Poder | Efecto | Contras |
|-------|--------|---------|
| Git Blame | Descubre quién hizo el bug. Reduce estrés. | - |
| Ctrl + Z | Deshace un error. | - |
| Stack Overflow | Resuelve automáticamente un bug. | Tiempo de recarga. |
| ChatGPT | Resuelve un conflicto. | Si abusas, Karen pregunta *"¿Sí entendiste el cambio?"* |

---

## Skins Desbloqueables

- Michi Godín (default)
- Michi Programador
- Michi Home Office
- Michi DevOps
- Michi DBA
- Michi Java
- Michi Angular
- Michi Full Stack
- Michi Linux

---

## Logros

| Logro | Descripción |
|-------|-------------|
| 🏆 Primer Push | Primer push exitoso |
| 🏆 Sin romper producción | Completar un nivel sin errores |
| 🏆 Cien cafés | Beber 100 cafés |
| 🏆 Sobreviviste al lunes | Completar el día 1 |
| 🏆 Sin llorar | Completar sin perder toda la energía |
| 🏆 Primer Merge | Primer merge exitoso |
| 🏆 QA aprobó a la primera | (Legendario) |
| 🏆 Producción un viernes | (Imposible) |

---

## Frases Memorables

- "Compila en mi máquina."
- "Nada más es cambiar un color."
- "Es urgente pero no tanto."
- "¿Lo puedes subir rápido?"
- "No debe tardar."
- "Solo son cinco minutitos."
- "Ayer sí funcionaba."
- "No sé qué pasó."
- "¿Quién movió producción?"

---

## Final Secreto

Si sobrevives cinco días...

Karen dice: *"Excelente trabajo."*

Michi sonríe.

Entonces aparece un mensaje gigante:

**Lunes 9:00 AM - Sprint nuevo**
**"Se agregaron 47 requerimientos nuevos."**

**¡Felicidades, has desbloqueado el modo "Sprint Infinito"!** 😹

---

## Arquitectura Técnica

### Stack Tecnológico

```
Frontend PWA
├── Angular 17
├── TypeScript
├── HTML5 Canvas
├── Phaser.js (Motor de juego 2D)
├── SCSS/CSS
└── Service Workers (PWA)
```

### Estructura del Proyecto

```
michi-godin-pwa/
├── src/
│   ├── app/
│   │   ├── core/                    # Servicios核心
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
└── README.md
```

### Diagrama de Arquitectura

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
```

### Integración Angular + Phaser

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

---

## Fases de Desarrollo

### Fase 1: MVP (2-3 semanas)

- [ ] Setup inicial Angular 17 + PWA
- [ ] Integración de Phaser.js
- [ ] Sprites pixel art 32×32 o 48×48
- [ ] Todo en TypeScript
- [ ] Sin backend
- [ ] Guardado local con IndexedDB
- [ ] Escena de oficina básica
- [ ] Personaje Michi jugable
- [ ] Karen enviando mensajes
- [ ] Minijuego básico (git add/commit/push)
- [ ] Barra de estados funcional
- [ ] Sistema de tiempo (9 AM - 6 PM)

### Fase 2: Contenido (3-4 semanas)

- [ ] Sistema de logros
- [ ] Tienda de skins para Michi
- [ ] Música y efectos de sonido
- [ ] Más personajes (Michi QA, Becatín, Michi News)
- [ ] Eventos aleatorios
- [ ] Diálogos humorísticos
- [ ] Sistema de progresión
- [ ] Todos los minijuegos de Git
- [ ] Jefes finales

### Fase 3: Polish y Viralidad (2-3 semanas)

- [ ] Ranking en línea (opcional)
- [ ] Editor de niveles (opcional)
- [ ] Generador de certificados PDF
- [ ] Integración con LinkedIn
- [ ] Verificación de certificados con QR
- [ ] Optimización para móviles
- [ ] PWA instalable
- [ ] Testing y balanceo
- [ ] Localización (ES/EN)

---

## Sistema de Certificados

### Concepto

Al terminar niveles o el juego completo, el jugador obtiene certificados "de verdad" que puede agregar a LinkedIn.

### Certificado de Nivel

```
🏆 CERTIFICADO
Git Nivel 1: Preparación de archivos
Aprobado ⭐⭐⭐⭐⭐
```

### Certificado Final

```
╔══════════════════════════════════════╗
║         🐱 MICHI ACADEMY 🐱          ║
║                                      ║
║           CERTIFICA QUE              ║
║                                      ║
║         [Nombre del Jugador]         ║
║                                      ║
║   ha sobrevivido exitosamente al     ║
║          SPRINT GODÍN                ║
║                                      ║
║   demostrando conocimientos en:      ║
║   ✔ Git                              ║
║   ✔ Merge                            ║
║   ✔ Pull Request                     ║
║   ✔ Resolución de conflictos         ║
║   ✔ Trabajo bajo presión             ║
║   ✔ Supervivencia a Karen            ║
║   ✔ Manejo del Becario               ║
║   ✔ Comunicación con QA              ║
║                                      ║
║   Fecha: [Fecha]                     ║
║   ID: [UUID]                         ║
║                                      ║
║   [QR de verificación]               ║
║                                      ║
║          ~~ Karen ~~                 ║
╚══════════════════════════════════════╝
```

### Características del Certificado

- Nombre del jugador
- Fecha de emisión
- Número de certificado (UUID)
- Horas de capacitación (ej: 8 horas)
- Competencias desbloqueadas
- QR que apunta a página de verificación
- Enlace para compartir en LinkedIn

### Texto para LinkedIn

> 🎉 ¡Completé "Ayuda a Michi Godín: Sobrevive al Sprint"! Un entrenamiento gamificado donde practiqué Git, resolución de conflictos y trabajo colaborativo... ¡y sobreviví a Karen, a Michi Testings y a Becatín! 🐱💻

---

## Assets Necesarios

### Sprites (Pixel Art 32×32 o 48×48)

- [ ] Michi Godín (múltiples animaciones)
- [ ] Karen (retrato para diálogos)
- [ ] Michi Testings / Michi QA
- [ ] Becatín
- [ ] Michi News
- [ ] MichiOps
- [ ] SQLino
- [ ] Oficina (tiles)
- [ ] Items (café, dona, concha, pizza)
- [ ] UI elements

### Audio

- [ ] Música de fondo (office vibes)
- [ ] Efectos de sonido (Teams, notificaciones)
- [ ] Voces de personajes (opcional)

### UI

- [ ] HUD de estados
- [ ] Karenómetro animado
- [ ] Diálogos estilo chat
- [ ] Menús
- [ ] Certificado template

---

## Prompt para Kiro (El Agente de Desarrollo)

```
Eres Kiro, un experimentado diseñador de videojuegos indie, programador senior Full Stack, artista pixel art y diseñador UX.

Tu misión es ayudarme a desarrollar un videojuego tipo PWA llamado:

"AYUDA A MICHI GODÍN"

El juego debe ser extremadamente divertido, con mucho humor relacionado con la vida de oficina, programación, Git, memes godines y memes de gatos.

El juego debe sentirse como una mezcla entre:
- WarioWare
- Overcooked
- Papers Please
- Vampire Survivors (por el caos)
- Untitled Goose Game (por el humor)
- Los memes de "programador promedio"

Nunca debe sentirse como un curso de Git.

El aprendizaje debe ocurrir de manera natural mientras el jugador se divierte.

El jugador aprenderá Git sin darse cuenta.

La dificultad aumenta conforme avanza el día laboral.

El tono siempre debe ser humorístico.

Todas las mecánicas deben ser rápidas, sencillas y adictivas.

Cada nivel debe durar entre 3 y 5 minutos.

Cada mecánica nueva debe introducir únicamente un concepto nuevo.

No quiero textos largos.

No quiero tutoriales aburridos.

Todo debe aprenderse jugando.

Siempre que propongas una nueva mecánica debes pensar:
"¿Esto es divertido incluso si el jugador no sabe programar?"

El juego será desarrollado como PWA usando Angular 17 + TypeScript + Phaser.

Todo el código debe ser modular.

Todo debe estar preparado para crecer fácilmente.

Cada personaje debe tener personalidad.

Cada diálogo debe ser corto, gracioso y convertirse fácilmente en meme.
```

---

## Métricas de Éxito

- Tiempo de juego promedio > 15 minutos
- Tasa de retención día 7 > 30%
- Certificados generados y compartidos en LinkedIn
- Engagement en redes sociales
- Feedback positivo sobre la experiencia de aprendizaje

---

## Potencial de Monetización (Futuro)

- Skins premium
- Expansión de niveles
- Certificados verificados (con backend)
- Modo multijugador cooperativo
- Integración con GitHub/GitLab real

---

## Conclusión

**Ayuda a Michi Godín** no es solo un juego educativo de Git. Es una **experiencia cultural** que celebra el humor y los retos de la vida de un desarrollador. El aprendizaje ocurre de manera orgánica mientras el jugador intenta sobrevivir al caos de una oficina típica.

La combinación de:
- Humor relatable
- Mecánicas adictivas
- Aprendizaje invisible
- Certificaciones reales

...lo convierte en un proyecto con alto potencial de viralidad y adopción.

---

*Documento generado para la planeación del proyecto PWA - Michi Godín*  
*Versión 1.0 - Julio 2026*
