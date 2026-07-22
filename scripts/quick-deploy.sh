#!/bin/bash

# Script para despliegue rápido a GitHub Pages
# Hace commit y push automático

set -e

# Colores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo ""
echo -e "${BLUE}🐱 Michi Godín - Deploy Rápido a GitHub Pages${NC}"
echo "=================================================="
echo ""

# Verificar que estamos en la raíz del proyecto
if [ ! -f "README.md" ] || [ ! -d "code/frontend" ]; then
    echo -e "${RED}❌ Error: Ejecuta este script desde la raíz del proyecto${NC}"
    exit 1
fi

# Verificar rama actual
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "main" ]; then
    echo -e "${YELLOW}⚠️  Advertencia: No estás en la rama 'main'${NC}"
    echo "   Rama actual: $CURRENT_BRANCH"
    read -p "¿Continuar de todos modos? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Cancelado."
        exit 1
    fi
fi

# Verificar cambios
if ! git diff-index --quiet HEAD --; then
    echo -e "${YELLOW}📝 Cambios detectados${NC}"
    echo ""
    git status --short
    echo ""
    
    # Solicitar mensaje de commit
    read -p "Mensaje de commit (o Enter para 'chore: deploy'): " COMMIT_MSG
    if [ -z "$COMMIT_MSG" ]; then
        COMMIT_MSG="chore: deploy to GitHub Pages"
    fi
    
    echo ""
    echo -e "${YELLOW}📦 Agregando cambios...${NC}"
    git add .
    
    echo -e "${YELLOW}💾 Haciendo commit...${NC}"
    git commit -m "$COMMIT_MSG"
else
    echo -e "${GREEN}✅ No hay cambios locales${NC}"
fi

# Push
echo ""
echo -e "${YELLOW}🚀 Subiendo a GitHub...${NC}"
git push origin "$CURRENT_BRANCH"

echo ""
echo -e "${GREEN}✅ Push completado!${NC}"
echo ""
echo "📊 El workflow de GitHub Actions se activará automáticamente"
echo ""
echo "Puedes ver el progreso en:"
echo -e "${BLUE}https://github.com/ana-olvera/hackaton-kiro-knd-oozma-kapa/actions${NC}"
echo ""
echo "Una vez que el workflow termine (2-5 minutos), tu juego estará en:"
echo -e "${BLUE}https://ana-olvera.github.io/hackaton-kiro-knd-oozma-kapa/${NC}"
echo ""
