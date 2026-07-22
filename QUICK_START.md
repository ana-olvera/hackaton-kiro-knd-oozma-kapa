# ⚡ Quick Start - Despliegue Inmediato

## 🎯 Objetivo

Desplegar tu juego "Ayuda a Michi Godín" en GitHub Pages en menos de 5 minutos.

## 🚀 Pasos Rápidos

### 1️⃣ Primera vez: Configurar GitHub (2 minutos)

1. **Habilitar GitHub Pages:**
   - Ve a: https://github.com/ana-olvera/hackaton-kiro-knd-oozma-kapa/settings/pages
   - En "Source", selecciona: **GitHub Actions**
   - ✅ Guarda

2. **Habilitar permisos:**
   - Ve a: https://github.com/ana-olvera/hackaton-kiro-knd-oozma-kapa/settings/actions
   - En "Workflow permissions", selecciona: **Read and write permissions**
   - ✅ Guarda

### 2️⃣ Desplegar (30 segundos)

**Opción A: Script automático (Recomendado)**

```bash
./scripts/quick-deploy.sh
```

El script:
- ✅ Verifica que estás en la rama correcta
- ✅ Hace commit de tus cambios
- ✅ Sube a GitHub
- ✅ Te muestra el link para ver el progreso

**Opción B: Manual**

```bash
git add .
git commit -m "chore: deploy to production"
git push origin main
```

### 3️⃣ Esperar (2-5 minutos)

- Ve a: https://github.com/ana-olvera/hackaton-kiro-knd-oozma-kapa/actions
- Espera a que el workflow termine ✅

### 4️⃣ ¡Jugar! 🎮

Tu juego está en:
```
https://ana-olvera.github.io/hackaton-kiro-knd-oozma-kapa/
```

## 🔧 Si algo falla

### El workflow tiene error ❌

```bash
# Prueba el build localmente
cd code/frontend
npm install
npm run build
```

Si hay errores TypeScript, corrígelos y vuelve a hacer push.

### Error 404 en la página 🔍

- Espera 1-2 minutos más (GitHub tiene cache)
- Verifica en Settings → Pages que está configurado con **GitHub Actions**
- Abre en ventana de incógnito

### Los assets no cargan 🖼️

- Limpia el cache del navegador
- Verifica que el workflow haya terminado correctamente
- Revisa los logs en Actions

## 📱 Probar la PWA

1. Abre el juego en tu navegador
2. Click en el icono de instalación (⬇️ o ➕)
3. La app se instalará como una app nativa
4. Funciona sin internet ✈️

## 🎯 URLs Importantes

| Recurso | URL |
|---------|-----|
| 🎮 Juego | https://ana-olvera.github.io/hackaton-kiro-knd-oozma-kapa/ |
| 🔄 Actions | https://github.com/ana-olvera/hackaton-kiro-knd-oozma-kapa/actions |
| ⚙️ Settings | https://github.com/ana-olvera/hackaton-kiro-knd-oozma-kapa/settings |
| 📄 Repo | https://github.com/ana-olvera/hackaton-kiro-knd-oozma-kapa |

## 📚 Más Información

- **Checklist completo:** [CHECKLIST_DEPLOY.md](./CHECKLIST_DEPLOY.md)
- **Guía detallada:** [DEPLOY.md](./DEPLOY.md)
- **Proyecto general:** [README.md](./README.md)

---

**¡Eso es todo!** 🎉

Cada vez que hagas cambios, solo ejecuta `./scripts/quick-deploy.sh` y listo.
