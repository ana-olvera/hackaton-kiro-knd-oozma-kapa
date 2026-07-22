# 🚀 Guía de Despliegue a GitHub Pages

## Estado Actual: Fase 1 - Frontend PWA

Este proyecto está configurado para desplegarse automáticamente en GitHub Pages cuando se hace push a la rama `main`.

## 🌐 URL de Producción

Una vez desplegado, el juego estará disponible en:
```
https://ana-olvera.github.io/hackaton-kiro-knd-oozma-kapa/
```

## ⚙️ Configuración Inicial (Solo una vez)

### Paso 1: Habilitar GitHub Pages en el Repositorio

1. Ve a tu repositorio en GitHub: `https://github.com/ana-olvera/hackaton-kiro-knd-oozma-kapa`
2. Click en **Settings** (Configuración)
3. En el menú lateral, click en **Pages**
4. En **Source**, selecciona: **GitHub Actions**
5. Guarda los cambios

![GitHub Pages Settings](https://docs.github.com/assets/cb-24850/images/help/pages/publishing-source-drop-down.png)

### Paso 2: Verificar Permisos de Workflows

1. En **Settings** → **Actions** → **General**
2. En **Workflow permissions**, asegúrate de que esté seleccionado:
   - ✅ **Read and write permissions**
3. Guarda los cambios

## 🚀 Despliegue Automático

El despliegue se activa automáticamente cuando:

1. Haces push a la rama `main`:
   ```bash
   git add .
   git commit -m "feat: nueva característica"
   git push origin main
   ```

2. O manualmente desde GitHub:
   - Ve a la pestaña **Actions**
   - Selecciona el workflow **Deploy to GitHub Pages**
   - Click en **Run workflow**

## 📦 Construcción Local (Opcional)

Si quieres probar la build de producción localmente antes de desplegar:

```bash
cd code/frontend

# Instalar dependencias
npm install

# Build de producción con la ruta correcta
npm run build -- --base-href "/hackaton-kiro-knd-oozma-kapa/"

# Los archivos estarán en: dist/michi-godin-pwa/browser/
```

## 🔍 Verificar el Despliegue

### Ver el progreso del workflow:

1. Ve a la pestaña **Actions** en GitHub
2. Verás el workflow **Deploy to GitHub Pages** ejecutándose
3. Espera a que termine (tarda ~2-5 minutos)
4. Status: ✅ verde = éxito, ❌ rojo = error

### Probar la aplicación:

1. Abre: `https://ana-olvera.github.io/hackaton-kiro-knd-oozma-kapa/`
2. Deberías ver el juego funcionando
3. La PWA es instalable desde el navegador

## 🐛 Solución de Problemas

### El workflow falla en el build:

```bash
# Prueba el build localmente
cd code/frontend
npm install
npm run build
```

Si hay errores TypeScript o de compilación, corrígelos antes de hacer push.

### Error 404 al acceder a la página:

- Verifica que GitHub Pages esté configurado con **GitHub Actions** como source
- Espera 1-2 minutos después del despliegue (puede haber cache)
- Verifica la URL: debe incluir el nombre del repo

### Los assets no cargan (imágenes, estilos):

- El `--base-href` debe coincidir exactamente con el nombre del repositorio
- Actualmente configurado: `/hackaton-kiro-knd-oozma-kapa/`

### Service Worker no funciona:

- GitHub Pages usa HTTPS automáticamente, así que debería funcionar
- Limpia el cache del navegador (Ctrl+Shift+Delete)
- Abre en ventana de incógnito para probar

## 📱 Características Disponibles en Fase 1

✅ **Funcionando:**
- Juego completo con Phaser.js
- PWA instalable
- Guardado local con IndexedDB
- Service Workers (modo offline)
- Todos los minijuegos de Git
- Sistema de progresión
- Certificados locales (se generan en el navegador)

❌ **No disponible (requiere backend):**
- Rankings en línea
- Certificados verificables con QR online
- Autenticación de usuarios
- Sincronización entre dispositivos

## 🔄 Workflow Explicado

El archivo `.github/workflows/deploy.yml` hace lo siguiente:

1. **Trigger**: Se ejecuta en cada push a `main`
2. **Setup**: Instala Node.js 18
3. **Install**: Instala dependencias del frontend con `npm ci`
4. **Build**: Compila Angular con el base-href correcto
5. **.nojekyll**: Agrega archivo para que GitHub no procese con Jekyll
6. **Upload**: Sube los archivos compilados
7. **Deploy**: Despliega a GitHub Pages

## 📊 Monitoreo

- **Logs del build**: Actions → Deploy to GitHub Pages → View logs
- **Tiempo de build**: ~2-5 minutos
- **Tamaño del bundle**: Verificar en los logs (máx. 1MB configurado)

## 🎯 Próximos Pasos (Fase 2)

Cuando necesites el backend:

1. Deploy del backend en Vercel/Render
2. Configurar variables de entorno para la API
3. Actualizar el frontend para conectarse a la API
4. Activar rankings y certificados verificables

## 📝 Comandos Útiles

```bash
# Ver el estado del repositorio
git status

# Hacer commit y push
git add .
git commit -m "tu mensaje"
git push origin main

# Ver logs de Git
git log --oneline

# Crear una nueva rama
git checkout -b feature/nueva-caracteristica
```

## 🆘 Soporte

Si algo no funciona:

1. Revisa los logs en la pestaña Actions
2. Verifica que las rutas en `angular.json` sean correctas
3. Asegúrate de que el `base-href` coincida con el nombre del repo
4. Limpia el cache del navegador

---

**¡Listo para desplegar!** 🚀

Solo haz push a main y GitHub Actions se encargará del resto.
