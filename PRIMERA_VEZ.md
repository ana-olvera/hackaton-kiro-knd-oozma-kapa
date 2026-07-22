# 🎯 Primera Vez - Configuración Inicial

Esta guía es para la **primera vez** que despliegues el proyecto. Solo necesitas hacerlo **una vez**.

## 📍 Paso 1: Configurar GitHub Pages (2 minutos)

### 1.1 Habilitar GitHub Pages

1. Abre tu navegador
2. Ve a: **https://github.com/ana-olvera/hackaton-kiro-knd-oozma-kapa/settings/pages**
3. En la sección **"Build and deployment"**:
   - **Source:** Selecciona `GitHub Actions` (no "Deploy from a branch")
4. **No necesitas hacer clic en Save** (se guarda automáticamente)

```
┌─────────────────────────────────────┐
│ GitHub Pages                        │
├─────────────────────────────────────┤
│                                     │
│ Build and deployment                │
│                                     │
│ Source                              │
│ ┌─────────────────────────────┐   │
│ │ GitHub Actions          [▼] │   │  ← Selecciona esto
│ └─────────────────────────────┘   │
│                                     │
└─────────────────────────────────────┘
```

### 1.2 Configurar Permisos

1. Ve a: **https://github.com/ana-olvera/hackaton-kiro-knd-oozma-kapa/settings/actions**
2. Baja hasta **"Workflow permissions"**
3. Selecciona: **`Read and write permissions`** (el segundo radio button)
4. **✅ Click en "Save"**

```
┌─────────────────────────────────────┐
│ Workflow permissions                │
├─────────────────────────────────────┤
│                                     │
│ ○ Read repository contents and     │
│   packages permissions              │
│                                     │
│ ● Read and write permissions       │  ← Selecciona esto
│                                     │
│ [✓] Allow GitHub Actions to        │
│     create and approve pull         │
│     requests                        │
│                                     │
│           [Save]                    │
│                                     │
└─────────────────────────────────────┘
```

✅ **¡Listo!** Esta configuración solo se hace una vez.

---

## 📍 Paso 2: Hacer el Primer Despliegue (1 minuto)

### Opción A: Con el Script Automático (Recomendado)

Abre tu terminal en la carpeta del proyecto y ejecuta:

```bash
./scripts/quick-deploy.sh
```

El script te preguntará:
1. Mensaje de commit (puedes presionar Enter para usar el mensaje por defecto)
2. Hará todo automáticamente

### Opción B: Manual

```bash
# Agregar todos los archivos nuevos
git add .

# Hacer commit
git commit -m "feat: configurar despliegue en GitHub Pages"

# Subir a GitHub
git push origin main
```

---

## 📍 Paso 3: Ver el Despliegue en Acción (3-5 minutos)

### 3.1 Ir a Actions

1. Ve a: **https://github.com/ana-olvera/hackaton-kiro-knd-oozma-kapa/actions**
2. Verás un workflow en progreso:

```
┌────────────────────────────────────────┐
│ All workflows                          │
├────────────────────────────────────────┤
│                                        │
│ ● Deploy to GitHub Pages              │  ← Amarillo = En progreso
│   feat: configurar despliegue...      │
│   #1 • main • Running • 1m ago        │
│                                        │
└────────────────────────────────────────┘
```

3. **Espera** entre 2-5 minutos
4. Cuando termine, verás:

```
┌────────────────────────────────────────┐
│ All workflows                          │
├────────────────────────────────────────┤
│                                        │
│ ✓ Deploy to GitHub Pages              │  ← Verde = Éxito
│   feat: configurar despliegue...      │
│   #1 • main • Success • 3m ago        │
│                                        │
└────────────────────────────────────────┘
```

### 3.2 Ver tu Juego en Línea

Una vez que el workflow esté en **✓ Success**:

1. Abre tu navegador
2. Ve a: **https://ana-olvera.github.io/hackaton-kiro-knd-oozma-kapa/**
3. **¡Tu juego está en línea!** 🎉

---

## 🎮 Paso 4: Probar la PWA

### En Desktop:

1. Abre el juego en Chrome/Edge
2. Mira la barra de direcciones → verás un icono de instalación (⬇️ o 💻)
3. Click en el icono
4. Click en "Instalar"
5. La app se abrirá como una aplicación nativa

### En Móvil:

1. Abre el juego en Safari (iOS) o Chrome (Android)
2. **iOS:** Click en el botón "Compartir" → "Agregar a la pantalla de inicio"
3. **Android:** Click en el menú (⋮) → "Agregar a la pantalla de inicio"
4. El icono aparecerá en tu pantalla de inicio
5. Abre la app
6. **Funciona sin internet** ✈️

---

## ✅ Verificación Final

Después de completar todos los pasos, verifica:

- [ ] ✅ GitHub Pages está configurado (Source: GitHub Actions)
- [ ] ✅ Permisos están habilitados (Read and write)
- [ ] ✅ El workflow terminó exitosamente (verde)
- [ ] ✅ El juego abre en https://ana-olvera.github.io/hackaton-kiro-knd-oozma-kapa/
- [ ] ✅ No hay errores en la consola del navegador
- [ ] ✅ La PWA es instalable
- [ ] ✅ Funciona sin internet

---

## 🎉 ¡Listo!

Tu juego está desplegado y funcionando.

### Próximas veces:

Ya no necesitas hacer la configuración de GitHub. Solo:

```bash
./scripts/quick-deploy.sh
```

O manualmente:

```bash
git add .
git commit -m "tu mensaje"
git push origin main
```

---

## 🐛 ¿Algo salió mal?

### El workflow falla con error ❌

**Causa más común:** Errores de compilación TypeScript

**Solución:**
```bash
cd code/frontend
npm install
npm run build
```

Si hay errores, corrígelos y vuelve a hacer push.

### Error 404 al abrir la página

**Causa:** GitHub Pages aún no está configurado correctamente

**Solución:**
1. Ve a Settings → Pages
2. Verifica que Source sea "GitHub Actions"
3. Espera 1-2 minutos más (hay cache)
4. Limpia el cache del navegador
5. Prueba en modo incógnito

### No puedo instalar la PWA

**Causa:** Service Worker no está registrado

**Solución:**
1. Abre DevTools (F12)
2. Ve a Application → Service Workers
3. Si no hay ninguno, verifica que el workflow haya terminado
4. Limpia cache (Ctrl+Shift+Delete)
5. Recarga la página

---

## 📞 Links Importantes

| Recurso | URL |
|---------|-----|
| 🎮 Tu juego | https://ana-olvera.github.io/hackaton-kiro-knd-oozma-kapa/ |
| 🔄 Actions | https://github.com/ana-olvera/hackaton-kiro-knd-oozma-kapa/actions |
| ⚙️ Settings | https://github.com/ana-olvera/hackaton-kiro-knd-oozma-kapa/settings/pages |
| 📦 Repo | https://github.com/ana-olvera/hackaton-kiro-knd-oozma-kapa |

---

## 📚 Siguiente Lectura

- [QUICK_START.md](./QUICK_START.md) - Para despliegues futuros
- [CHECKLIST_DEPLOY.md](./CHECKLIST_DEPLOY.md) - Checklist completo
- [DEPLOY.md](./DEPLOY.md) - Documentación técnica detallada

---

**¡Felicidades!** 🎊 Ya tienes tu juego desplegado en GitHub Pages.
