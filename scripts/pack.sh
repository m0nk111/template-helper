#!/bin/bash

cd "$(dirname "$0")/.."

# Gebruik de Git commit hash (short) in plaats van versie
GIT_COMMIT=$(git rev-parse --short HEAD 2>/dev/null || echo "init")

# Map voor release artifacts
RELEASE_DIR="release"
mkdir -p "$RELEASE_DIR"

ZIP_NAME="template-helper-${GIT_COMMIT}"
ZIP_PATH="${RELEASE_DIR}/${ZIP_NAME}"

echo "📦 Packing Delta Vraag en Antwoord Template Helper (${GIT_COMMIT})..."

# Houd standalone-template.html altijd in sync met de extension bronbestanden.
./scripts/build-standalone.sh

# Gooi oude zips weg zodat we niet oneindig veel zips opsparen
rm -f ${RELEASE_DIR}/template-helper-*.zip

# Create a temporary build directory
mkdir -p build_extension
cp -R extension/* build_extension/

# Lees altijd de versie direct uit het manifest, zodat lokale aanpassingen bewaard blijven
VERSION=$(python3 -c "import json; print(json.load(open('extension/manifest.json', encoding='utf-8')).get('version', '1.0.0'))")

echo "🔧 Using version ${VERSION} from manifest.json..."

# Pack the build directory
python3 -c "import shutil; shutil.make_archive('${ZIP_PATH}', 'zip', 'build_extension')"

# Clean up
rm -rf build_extension

echo "✅ Klaar! Extensie ingepakt in: ${ZIP_PATH}.zip"
