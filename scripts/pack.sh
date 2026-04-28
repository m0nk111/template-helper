#!/bin/bash

cd "$(dirname "$0")/.."

# Lees altijd de versie direct uit het manifest
VERSION=$(python3 -c "import json; print(json.load(open('extension/manifest.json', encoding='utf-8')).get('version', '1.0.0'))")

# Map voor release artifacts
RELEASE_DIR="release"
mkdir -p "$RELEASE_DIR"

ZIP_NAME="template-helper-v${VERSION}"
ZIP_PATH="${RELEASE_DIR}/${ZIP_NAME}"

echo "📦 Packing Delta Vraag en Antwoord Template Helper (v${VERSION})..."

# Gooi oude zips en standalone bestanden weg
rm -f ${RELEASE_DIR}/template-helper-*.zip
rm -f ${RELEASE_DIR}/standalone-template-*.html
rm -f ${RELEASE_DIR}/standalone-template.html

# Houd standalone-template-v[version].html altijd in sync
./scripts/build-standalone.sh

# Create a temporary build directory
mkdir -p build_extension
cp -R extension/* build_extension/

echo "🔧 Using version v${VERSION} from manifest.json..."

# Pack the build directory
python3 -c "import shutil; shutil.make_archive('${ZIP_PATH}', 'zip', 'build_extension')"

# Clean up
rm -rf build_extension

echo "✅ Klaar! Extensie ingepakt in: ${ZIP_PATH}.zip"
