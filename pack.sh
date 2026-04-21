#!/bin/bash

cd "$(dirname "$0")"

# Gebruik de Git commit hash (short) in plaats van versie
GIT_COMMIT=$(git rev-parse --short HEAD 2>/dev/null || echo "init")

# Map voor de deployments
DEPLOY_DIR="ext-deploy"
mkdir -p "$DEPLOY_DIR"

ZIP_NAME="mod-helper-${GIT_COMMIT}"
ZIP_PATH="${DEPLOY_DIR}/${ZIP_NAME}"

echo "📦 Packing Delta Vraag en Antwoord Template Helper (${GIT_COMMIT})..."

# Gooi oude zips weg zodat we niet oneindig veel zips opsparen
rm -f ${DEPLOY_DIR}/mod-helper-*.zip

# Create a temporary build directory
mkdir -p build_extension
cp -R extension/* build_extension/
# Copy the template files into the extension so they are packaged inside it
cp template.html script.js build_extension/

# Bepaal de versie via git tags (bijv v1.0.2 -> 1.0.2). Als er geen tag is, gebruik "1.0.0".
if [ -n "$GITHUB_REF_NAME" ] && [[ "$GITHUB_REF_NAME" == v* ]]; then
    GIT_TAG="$GITHUB_REF_NAME"
else
    GIT_TAG=$(git describe --tags --abbrev=0 2>/dev/null || echo "v1.0.0")
fi
VERSION="${GIT_TAG#v}"

echo "🔧 Injecting version ${VERSION} into manifest.json..."
sed -i -E 's/"version": ".*"/"version": "'"${VERSION}"'"/' build_extension/manifest.json

# Pack the build directory
python3 -c "import shutil; shutil.make_archive('${ZIP_PATH}', 'zip', 'build_extension')"

# Clean up
rm -rf build_extension

echo "✅ Klaar! Extensie ingepakt in: ${ZIP_PATH}.zip"
