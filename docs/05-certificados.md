# Sistema de Certificados - Ayuda a Michi Godín

## Concepto

Al terminar niveles o el juego completo, el jugador obtiene certificados que puede agregar a LinkedIn. Los certificados validan el aprendizaje de Git de forma gamificada.

---

## Tipos de Certificado

### Certificado de Nivel

Otorgado al completar cada nivel individual.

```
🏆 CERTIFICADO
Git Nivel 1: Preparación de archivos
Aprobado ⭐⭐⭐⭐⭐
```

### Certificado Final

Otorgado al completar todos los niveles.

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

---

## Características del Certificado

- **Nombre del jugador:** Ingresado al iniciar el juego
- **Fecha de emisión:** Generada automáticamente
- **Número de certificado:** UUID único
- **Horas de capacitación:** Ej: 8 horas (basado en tiempo real de juego)
- **Competencias desbloqueadas:** Lista de conceptos aprendidos
- **QR de verificación:** Apunta a página de verificación pública
- **Enlace para compartir en LinkedIn**

---

## Generación

### Fase MVP (Sin backend)
- Generación de PDF en el cliente usando una librería como `jspdf` o `pdf-lib`
- Almacenamiento local del certificado
- Sin verificación QR (solo visual)

### Fase con Backend
- Generación en servidor
- Almacenamiento en BD con UUID
- Verificación pública via QR
- API para validar certificados

---

## Integración con LinkedIn

### Texto sugerido para compartir:

> 🎉 ¡Completé "Ayuda a Michi Godín: Sobrevive al Sprint"! Un entrenamiento gamificado donde practiqué Git, resolución de conflictos y trabajo colaborativo... ¡y sobreviví a Karen, a Michi Testings y a Becatín! 🐱💻

### Flujo:
1. Jugador completa nivel/juego
2. Se genera certificado PDF
3. Botón "Compartir en LinkedIn"
4. Se abre ventana con texto prellenado + enlace de verificación

---

## Verificación (Fase Backend)

### Endpoint de verificación:
```
GET /api/certificates/verify/:uuid
```

### Respuesta:
```json
{
  "valid": true,
  "playerName": "Nombre del Jugador",
  "completedAt": "2026-07-15T10:30:00Z",
  "level": "Completo",
  "skills": ["git-add", "git-commit", "git-push", "merge", "conflict-resolution"]
}
```

### Página de verificación pública:
- URL amigable: `https://michi-godin.app/verify/{uuid}`
- Muestra datos del certificado
- Diseño con branding del juego
