# Niveles y Minijuegos - Ayuda a Michi Godín

## Sistema de Progresión (Aprendizaje de Git)

El jugador nunca verá comandos técnicos inicialmente. En su lugar se presentan metáforas:

| Concepto Git | Presentación en Juego |
|--------------|----------------------|
| `git add` | 📂 Preparar cambios / "Guardar en la mochila" |
| `git commit` | 📝 Documentar avance / "Escribir reporte" |
| `git push` | 🚀 Enviar integración / "Enviar al servidor" |
| `git merge` | 🤝 Reunir equipos |
| Conflict | 💥 "Dos compañeros modificaron el mismo documento" |

Poco a poco el juego mostrará los comandos reales. El jugador aprende sin memorizar.

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

## Detalle de Minijuegos

### Nivel 1: Git Básico

Karen dice: "Sube el cambio."
- Aparecen tres botones: `git add` → `git commit` → `git push`
- El jugador debe hacerlo en orden
- Error: Karen pregunta *"¿Seguro que hiciste commit?"*

**Concepto enseñado:** Flujo básico add → commit → push

---

### Nivel 2: Staging Area

- Arrastrar archivos al Staging Area
- Como un rompecabezas: README ↓ Staging Area ↓ Commit
- El jugador selecciona qué archivos incluir

**Concepto enseñado:** Staging area, selección de archivos

---

### Nivel 3: Branches

- Visualmente unir ramas
- Como unir equipos de trabajo
- Crear ramas nuevas para features

**Concepto enseñado:** Ramas, flujos de trabajo paralelos

---

### Nivel 4: Conflictos Sencillos

```
<<<<<<< HEAD
Hola
=======
Hola Mundo
>>>>>>> feature
```

Opciones:
- ( ) Hola
- ( ) Hola Mundo
- ( ) Ambos

**Concepto enseñado:** Resolución básica de conflictos

---

### Nivel 5: Conflictos Múltiples

- Editor de texto simple
- Debe editar solo unas pocas líneas
- Múltiples archivos con conflictos

**Concepto enseñado:** Conflictos en múltiples archivos

---

### Nivel 6: Integración Completa

- Todos los comandos como botones
- Workflow completo de principio a fin

**Concepto enseñado:** Flujo completo de Git

---

### Nivel 7: Cherry Pick

- Seleccionar commits específicos de otras ramas
- Visualización tipo "elegir cerezas de un árbol"

**Concepto enseñado:** git cherry-pick

---

### Nivel 8: Rebase

- Reorganizar commits en una línea de tiempo
- Puzzle de ordenamiento

**Concepto enseñado:** git rebase

---

### Nivel 9: Release

- Preparar una versión para producción
- Checklist de validaciones

**Concepto enseñado:** Tags, releases, versionado

---

### Nivel 10: Producción (Karen Final Boss)

- Deploy a producción bajo presión
- Karen pregunta constantemente
- Todos los personajes aparecen al mismo tiempo

**Concepto enseñado:** Deploy workflow completo

---

## Principios de Diseño de Niveles

1. Cada nivel dura entre 3 y 5 minutos
2. Cada mecánica nueva introduce únicamente un concepto nuevo
3. No hay textos largos ni tutoriales aburridos
4. Todo se aprende jugando
5. Debe ser divertido incluso si el jugador no sabe programar
6. La dificultad aumenta conforme avanza el día laboral
