#!/bin/bash

# Script para probar el build de producción localmente
# antes de hacer push a GitHub

set -e

echo "🐱 Michi Godín - Build Local para GitHub Pages"
echo "================================================"
echo ""

# Colores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Ir al directorio del frontend
cd "$(dirname "$0")/../code/frontend"

echo -e "${YELLOW}📦 Instalando dependencias...${NC}"
npm install

echo ""
echo -e "${YELLOW}🏗️  Construyendo para producción...${NC}"
npm run build -- --base-href "/hackaton-kiro-knd-oozma-kapa/"

echo ""
echo -e "${GREEN}✅ Build completado!${NC}"
echo ""
echo "📂 Archivos generados en:"
echo "   $(pwd)/dist/michi-godin-pwa/browser"
echo ""
echo "📊 Tamaño del build:"
du -sh dist/michi-godin-pwa/browser
echo ""

# Verificar que los archivos principales existan
if [ -f "dist/michi-godin-pwa/browser/index.html" ]; then
    echo -e "${GREEN}✅ index.html encontrado${NC}"
else
    echo -e "${RED}❌ ERROR: index.html no encontrado${NC}"
    exit 1
fi

if [ -f "dist/michi-godin-pwa/browser/manifest.webmanifest" ]; then
    echo -e "${GREEN}✅ manifest.webmanifest encontrado${NC}"
else
    echo -e "${YELLOW}⚠️  manifest.webmanifest no encontrado${NC}"
fi

if [ -f "dist/michi-godin-pwa/browser/ngsw.json" ]; then
    echo -e "${GREEN}✅ Service Worker configurado${NC}"
else
    echo -e "${YELLOW}⚠️  Service Worker no encontrado${NC}"
fi

echo ""
echo -e "${GREEN}🚀 Listo para desplegar!${NC}"
echo ""
echo "Para desplegar a GitHub Pages:"
echo "  git add ."
echo "  git commit -m 'chore: deploy to production'"
echo "  git push origin main"
echo ""
echo "Luego ve a: https://github.com/ana-olvera/hackaton-kiro-knd-oozma-kapa/actions"
echo ""
