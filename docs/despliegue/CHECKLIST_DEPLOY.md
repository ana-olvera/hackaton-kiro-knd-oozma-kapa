# ✅ Checklist de Despliegue - GitHub Pages

Usa este checklist para asegurarte de que todo está listo antes de desplegar.

## 📋 Pre-Despliegue

### 1. Configuración de GitHub (Solo primera vez)

- [ ] Ir a Settings → Pages en GitHub
- [ ] Seleccionar Source: **GitHub Actions**
- [ ] Ir a Settings → Actions → General
- [ ] Habilitar **Read and write permissions**

### 2. Verificación Local

- [ ] Las dependencias están instaladas
  ```bash
  cd code/frontend
  npm install
  ```

- [ ] El proyecto compila sin errores
  ```bash
  npm run build -- --base-href "/hackaton-kiro-knd-oozma-kapa/"
  ```

- [ ] El servidor de desarrollo funciona
  ```bash
  npm start
  ```

### 3. Control de Calidad

- [ ] No hay errores en la consola del navegador
- [ ] El juego carga correctamente
- [ ] Los sprites/assets se ven correctamente
- [ ] El Service Worker está registrado
- [ ] La PWA es instalable
- [ ] El guardado local (IndexedDB) funciona

### 4. Git

- [ ] Todos los cambios están commiteados
  ```bash
  git status
  ```

- [ ] Estás en la rama `main`
  ```bash
  git branch
  ```

- [ ] Tu rama está actualizada
  ```bash
  git pull origin main
  ```

## 🚀 Despliegue

### Opción 1: Push a Main (Automático)

```bash
# Asegúrate de estar en la raíz del proyecto
cd /Users/ana_mac/Documents/mywebsites/personal/hackaton-kiro-knd-oozma-kapa

# Agregar cambios
git add .

# Commit
git commit -m "chore: deploy Fase 1 to GitHub Pages"

# Push
git push origin main
```

### Opción 2: Workflow Manual

1. Ir a: https://github.com/ana-olvera/hackaton-kiro-knd-oozma-kapa/actions
2. Seleccionar "Deploy to GitHub Pages"
3. Click en "Run workflow"
4. Seleccionar branch `main`
5. Click en "Run workflow"

## 🔍 Post-Despliegue

### 1. Verificar el Build

- [ ] Ir a Actions tab: https://github.com/ana-olvera/hackaton-kiro-knd-oozma-kapa/actions
- [ ] El workflow "Deploy to GitHub Pages" está en progreso ⏳
- [ ] Esperar a que termine (2-5 minutos)
- [ ] Verificar que termina con ✅ (verde)

### 2. Probar la Aplicación

- [ ] Abrir: https://ana-olvera.github.io/hackaton-kiro-knd-oozma-kapa/
- [ ] Esperar 1-2 minutos si acabas de desplegar (cache de GitHub)
- [ ] La página carga sin error 404
- [ ] El juego funciona correctamente
- [ ] Los assets cargan (no hay errores 404 en la consola)
- [ ] Probar en modo incógnito

### 3. Probar PWA

- [ ] Click en el icono de instalación del navegador
- [ ] La app se instala correctamente
- [ ] La app funciona sin conexión (desconectar WiFi)
- [ ] El icono de la app aparece en el escritorio/menú

### 4. Probar en Móvil

- [ ] Abrir en teléfono: https://ana-olvera.github.io/hackaton-kiro-knd-oozma-kapa/
- [ ] La app es responsive
- [ ] Se puede instalar en pantalla de inicio
- [ ] Funciona offline

## 🐛 Troubleshooting

### ❌ El workflow falla

**Problema:** Error en el step "Build Angular PWA"

**Solución:**
```bash
# Probar build localmente
cd code/frontend
npm install
npm run build -- --base-href "/hackaton-kiro-knd-oozma-kapa/"

# Si hay errores, corrígelos y vuelve a hacer push
```

**Problema:** Error "Permission denied"

**Solución:**
- Ve a Settings → Actions → General
- Habilita "Read and write permissions"

### ❌ Error 404 al abrir la página

**Problema:** GitHub Pages no está configurado

**Solución:**
- Ve a Settings → Pages
- Selecciona Source: **GitHub Actions**
- Espera 2-5 minutos

**Problema:** Cache de GitHub

**Solución:**
- Espera 1-2 minutos
- Limpia cache del navegador (Ctrl+Shift+Delete)
- Prueba en modo incógnito

### ❌ Los assets no cargan (404 en CSS/JS)

**Problema:** El `base-href` está mal configurado

**Solución:**
- Verifica en `.github/workflows/deploy.yml`
- Debe ser: `--base-href "/hackaton-kiro-knd-oozma-kapa/"`
- Debe coincidir exactamente con el nombre del repo

### ❌ Service Worker no funciona

**Problema:** HTTPS requerido

**Solución:**
- GitHub Pages usa HTTPS automáticamente ✅
- Limpia cache del navegador
- Desregistra service workers antiguos en DevTools

## 📊 Verificación Final

- [ ] ✅ URL funciona: https://ana-olvera.github.io/hackaton-kiro-knd-oozma-kapa/
- [ ] ✅ Workflow exitoso en Actions
- [ ] ✅ Juego carga y funciona
- [ ] ✅ Assets cargan correctamente
- [ ] ✅ PWA es instalable
- [ ] ✅ Funciona offline
- [ ] ✅ Funciona en móvil

## 🎉 ¡Listo!

Tu juego está desplegado y accesible públicamente.

Comparte el link:
```
https://ana-olvera.github.io/hackaton-kiro-knd-oozma-kapa/
```

---

**Siguiente paso:** Fase 2 - Deploy del backend en Vercel/Render
