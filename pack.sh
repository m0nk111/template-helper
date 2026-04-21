#!/bin/bash

cd "$(dirname "$0")"

VERSION=$(grep '"version"' extension/manifest.json | grep -oE '[0-9]+\.[0-9]+' | head -n 1)
if [ -z "$VERSION" ]; then
    VERSION="1.0"
fi

ZIP_FILE="mod-helper-v${VERSION}"
echo "📦 Packing Vraag & Antwoord Helper v${VERSION}..."

rm -f "${ZIP_FILE}.zip"

# Gebruik Python om direct de extension map in te pakken
python3 -c "import shutil; shutil.make_archive('${ZIP_FILE}', 'zip', 'extension')"

echo "✅ Klaar! Extensie ingepakt in: ${ZIP_FILE}.zip"
