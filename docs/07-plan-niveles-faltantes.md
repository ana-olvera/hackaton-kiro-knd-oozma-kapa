# Plan de Implementación: Niveles 6–10

## Resumen del Análisis

El documento `03-niveles-y-minijuegos.md` define **10 niveles** de progresión. Actualmente solo están implementados los **niveles 1–5** (condensados en 5 días Lunes–Viernes). Los niveles 6–10 no existen en el código.

### Estado Actual vs Documento

| Nivel Doc | Concepto | Implementación | Estado |
|-----------|----------|----------------|--------|
| 1 | Git Básico (add/commit/push) | `git-basic.scene.ts` | ✅ Completo |
| 2 | Staging Area | `git-staging.scene.ts` | ✅ Completo |
| 3 | Branches | `git-branches.scene.ts` | ✅ Completo |
| 4 | Conflictos Sencillos | `git-merge.scene.ts` (como merge) | ✅ Adaptado |
| 5 | Conflictos Múltiples | `git-conflict.scene.ts` | ✅ Adaptado |
| 6 | Integración Completa | — | ❌ Faltante |
| 7 | Cherry Pick | — | ❌ Faltante |
| 8 | Rebase | — | ❌ Faltante |
| 9 | Release | — | ❌ Faltante |
| 10 | Karen Final Boss | `boss.scene.ts` (parcial) | ⚠️ Parcial |

---

## Plan de Implementación

### Fase 4: Niveles Avanzados

Se propone extender el sistema de progresión de 5 a 10 niveles (2 semanas laborales) y crear 4 nuevos minijuegos + el boss final dedicado.

---

### Tarea 1: Actualizar el Sistema de Progresión

**Archivo:** `code/frontend/src/app/game/systems/progression-system.ts`

**Cambios:**
- Extender el array `LEVELS` de 5 a 10 niveles
- Semana 2: Lunes–Viernes con niveles 6–10
- Cada nivel nuevo desbloquea el minijuego correspondiente

**Niveles nuevos propuestos:**

```typescript
{ id: 6, name: 'Lunes S2 - Integración', description: 'Workflow completo de inicio a fin.',
  minigames: [...todos_previos, 'git-workflow'],
  karenIntensity: 6, eventFrequency: 5, timeSpeed: 1.2 },

{ id: 7, name: 'Martes S2 - Cherry Pick', description: 'Elige commits con precisión quirúrgica.',
  minigames: [...todos_previos, 'git-cherry-pick'],
  karenIntensity: 7, eventFrequency: 6, timeSpeed: 1.3 },

{ id: 8, name: 'Miércoles S2 - Rebase', description: 'Reorganiza la historia. Sin romper nada.',
  minigames: [...todos_previos, 'git-rebase'],
  karenIntensity: 8, eventFrequency: 7, timeSpeed: 1.4 },

{ id: 9, name: 'Jueves S2 - Release', description: 'Prepara el release. Todo debe estar perfecto.',
  minigames: [...todos_previos, 'git-release'],
  karenIntensity: 9, eventFrequency: 8, timeSpeed: 1.5 },

{ id: 10, name: 'Viernes S2 - Karen Final Boss', description: 'Deploy a producción. Karen al máximo.',
  minigames: [...todos_previos],
  karenIntensity: 10, eventFrequency: 10, timeSpeed: 2.0 },
```

---

### Tarea 2: Minijuego — Git Workflow (Nivel 6)

**Archivo nuevo:** `code/frontend/src/app/game/minigames/git-workflow/git-workflow.scene.ts`

**Concepto:** Todos los comandos como botones. El jugador debe completar un workflow completo de inicio a fin en el orden correcto.

**Mecánica:**
- Se presenta un escenario completo (ej: "Crea una feature, desarróllala, y súbela a producción")
- El jugador tiene todos los comandos disponibles como botones: `git checkout -b`, `git add`, `git commit`, `git push`, `git checkout`, `git merge`, `git pull`
- Debe ejecutarlos en el orden correcto del workflow
- Timer de 60 segundos
- Karen comenta cada paso

**Flujo ejemplo:**
1. `git checkout -b feature/new`
2. (código...)
3. `git add .`
4. `git commit -m "feat: new feature"`
5. `git push origin feature/new`
6. `git checkout develop`
7. `git merge feature/new`
8. `git push`

---

### Tarea 3: Minijuego — Git Cherry Pick (Nivel 7)

**Archivo nuevo:** `code/frontend/src/app/game/minigames/git-cherry-pick/git-cherry-pick.scene.ts`

**Concepto:** Seleccionar commits específicos de un árbol visual. Metáfora de "elegir cerezas".

**Mecánica:**
- Se muestra un árbol de commits con varias ramas (visual tipo git log --graph)
- Karen pide: "Necesito solo el commit del fix del login de la rama X"
- El jugador clickea/tap en el commit correcto
- Se visualiza el cherry-pick aplicándose a la rama actual
- 4–5 rondas con dificultad creciente (más ramas, commits similares)

**Elementos visuales:**
- Árbol de commits con nodos circulares coloreados por rama
- Cada nodo muestra un mensaje de commit corto
- Al seleccionar, animación de "cereza" volando a la rama destino
- Errores: seleccionar commit incorrecto o de la rama equivocada

---

### Tarea 4: Minijuego — Git Rebase (Nivel 8)

**Archivo nuevo:** `code/frontend/src/app/game/minigames/git-rebase/git-rebase.scene.ts`

**Concepto:** Puzzle de ordenamiento. Reorganizar commits en una línea de tiempo limpia.

**Mecánica:**
- Se muestra una rama con commits desordenados o una rama divergida de main
- El jugador debe arrastrar los commits para reordenarlos cronológicamente
- Variante 2: elegir si hacer rebase o merge según el escenario
- Timer de 45 segundos
- Penalización si el orden rompe dependencias (ej: poner "add tests" antes de "create module")

**Rondas:**
1. Reordenar 3 commits simples
2. Reordenar 5 commits con dependencias
3. Decidir rebase vs merge en un escenario
4. Rebase interactivo: elegir squash, pick, o drop

---

### Tarea 5: Minijuego — Git Release (Nivel 9)

**Archivo nuevo:** `code/frontend/src/app/game/minigames/git-release/git-release.scene.ts`

**Concepto:** Checklist de validaciones antes de un release. Preparar versión para producción.

**Mecánica:**
- Se presenta un checklist de tareas pre-release
- El jugador debe completarlas en orden (algunas son opcionales, otras obligatorias)
- Tareas incluyen: actualizar versión, crear tag, verificar tests, actualizar changelog, merge a main
- Si olvida una tarea obligatoria → el release falla
- Karen presiona con preguntas constantes

**Checklist ejemplo:**
- [ ] `git checkout develop` (obligatorio)
- [ ] Verificar que tests pasen (obligatorio)
- [ ] Actualizar `version` en package.json (obligatorio)
- [ ] Actualizar CHANGELOG.md (opcional, +bonus)
- [ ] `git tag v2.0.0` (obligatorio)
- [ ] `git push --tags` (obligatorio)
- [ ] Crear PR a main (obligatorio)
- [ ] Notificar al equipo (opcional, +bonus)

---

### Tarea 6: Karen Final Boss (Nivel 10)

**Archivo a modificar:** `code/frontend/src/app/game/scenes/boss.scene.ts`

**Concepto:** Ampliar BossScene con un nivel 4 dedicado a "Karen Final Boss" que combine todos los conceptos aprendidos con máxima presión.

**Diferencias con los boss actuales:**
- Timer más agresivo (3–4 segundos por pregunta)
- Karen aparece visualmente con diálogos constantes entre preguntas
- Preguntas de TODOS los niveles (cherry-pick, rebase, release, conflictos)
- Eventos aleatorios durante el boss: "VPN se cayó", "Becatín rompió main"
- Al ganar: se desbloquea el certificado final y el "Modo Sprint Infinito"
- 10 preguntas en vez de 5–7

**Challenges nivel 4:**
```typescript
{ type: 'git', question: '¿Cómo aplicar un commit específico de otra rama?', 
  options: ['git cherry-pick <hash>', 'git merge <hash>', 'git apply <hash>', 'git copy <hash>'], 
  correctIndex: 0, timeLimit: 4000 },
// ... más preguntas de niveles avanzados
```

---

### Tarea 7: Registrar escenas nuevas en GameEngine

**Archivo:** `code/frontend/src/app/core/game-engine/game-engine.service.ts`

**Cambios:**
- Importar las 4 nuevas escenas
- Agregarlas al array `scene` en la config de Phaser

---

### Tarea 8: Actualizar OfficeScene para lanzar minijuegos nuevos

**Archivo:** `code/frontend/src/app/game/scenes/office.scene.ts`

**Cambios:**
- El array `availableMinigames` ya se basa en `progressionSystem.getAvailableMinigames()`
- Solo hay que mapear los nombres de minijuegos a los keys de las escenas:
  - `'git-workflow'` → `'GitWorkflowScene'`
  - `'git-cherry-pick'` → `'GitCherryPickScene'`
  - `'git-rebase'` → `'GitRebaseScene'`
  - `'git-release'` → `'GitReleaseScene'`

---

## Orden de Implementación Recomendado

1. **Actualizar progression-system.ts** — Base para todo (30 min)
2. **Git Workflow Scene** — Nivel 6, más sencillo (1.5h)
3. **Git Cherry Pick Scene** — Nivel 7, visual interesante (2h)
4. **Git Rebase Scene** — Nivel 8, puzzle de drag & drop (2h)
5. **Git Release Scene** — Nivel 9, checklist interactivo (1.5h)
6. **Karen Final Boss** — Nivel 10, ampliar boss existente (1h)
7. **Registrar escenas en GameEngine** — Integración (15 min)
8. **Testing e integración con OfficeScene** — (1h)

**Tiempo estimado total:** ~10 horas de desarrollo

---

## Notas Adicionales

- Los minijuegos nuevos deben seguir el patrón de los existentes: constructor con key, `init()` con returnScene, `create()` con UI, `exit()` con resultado
- Todos deben soportar ESC para salir y funcionar con controles touch (click/tap)
- El estilo visual debe mantener la paleta cyberpunk: fondo `0x1a1a2e`, verde `#00FF88`, rojo `#FF4444`
- Cada minijuego debe durar 3–5 minutos máximo (según principios de diseño)
