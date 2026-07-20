# Game Design Document - Ayuda a Michi Godín: Sobrevive al Sprint

## Resumen

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

**Misión del jugador:** Ayudar a Michi a sobrevivir el día laboral. No se trata de terminar rápido, se trata de **sobrevivir hasta las 6 PM sin renunciar.**

---

## Enemigo Principal

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

## Mecánicas de Decisión

Cada interrupción es una decisión con consecuencias:

| Decisión | Consecuencia |
|----------|--------------|
| Karen te escribe | Responder rápido baja el Karenómetro pero pierdes concentración |
| ¿Ir por café o seguir programando? | Ignorar café = más errores en minijuegos |
| Michi News aparece con chisme | Ignorar = ganas tiempo pero baja felicidad. Escuchar = sube felicidad, pierdes 15 min |
| Invitan a pedir pizza | Aceptar = recuperas energía. No = hambre aumenta |
| "Reunión de 15 minutos" | En realidad dura 45 minutos |

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
| Windows Update | Interrupción forzada |
| Reunión que pudo ser correo | Pérdida de tiempo |
| Café gratis | +Energía |
| Pastel de cumpleaños | +Felicidad |
| Viernes de pizza | +Energía |

---

## Poderes Especiales

| Poder | Efecto | Contras |
|-------|--------|---------|
| Git Blame | Descubre quién hizo el bug. Reduce estrés. | - |
| Ctrl + Z | Deshace un error. | - |
| Stack Overflow | Resuelve automáticamente un bug. | Tiempo de recarga. |
| ChatGPT | Resuelve un conflicto. | Si abusas, Karen pregunta "¿Sí entendiste el cambio?" |

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

## Final Secreto

Si sobrevives cinco días, Karen dice: *"Excelente trabajo."*

Entonces aparece: **Lunes 9:00 AM - Sprint nuevo. "Se agregaron 47 requerimientos nuevos."**

**¡Felicidades, has desbloqueado el modo "Sprint Infinito"!** 😹

---

## Métricas de Éxito

- Tiempo de juego promedio > 15 minutos
- Tasa de retención día 7 > 30%
- Certificados generados y compartidos en LinkedIn
- Engagement en redes sociales
- Feedback positivo sobre la experiencia de aprendizaje
