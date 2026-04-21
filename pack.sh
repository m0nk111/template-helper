#!/bin/bash

cd "$(dirname "$0")"

# Gebruik de Git commit hash (short) in plaats van versie
GIT_COMMIT=$(git rev-parse --short HEAD 2>/dev/null || echo "init")

# Map voor de deployments
DEPLOY_DIR="ext-deploy"
mkdir -p "$DEPLOY_DIR"

ZIP_NAME="mod-helper-${GIT_COMMIT}"
ZIP_PATH="${DEPLOY_DIR}/${ZIP_NAME}"

echo "📦 Packing Vraag & Antwoord Helper (${GIT_COMMIT})..."

# Gooi oude zips weg zodat we niet oneindig veel zips opsparen
rm -f ${DEPLOY_DIR}/mod-helper-*.zip

# Create a temporary build directory
mkdir -p build_extension
cp -R extension/* build_extension/
# Copy the template files into the extension so they are packaged inside it
cp template.html script.js build_extension/

# Pack the build directory
python3 -c "import shutil; shutil.make_archive('${ZIP_PATH}', 'zip', 'build_extension')"

# Clean up
rm -rf build_extension

echo "✅ Klaar! Extensie ingepakt in: ${ZIP_PATH}.zip"
