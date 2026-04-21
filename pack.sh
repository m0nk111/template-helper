#!/bin/bash

cd "$(dirname "$0")"

VERSION=$(grep '"version"' extension/manifest.json | grep -oE '[0-9]+\.[0-9]+' | head -n 1)
if [ -z "$VERSION" ]; then
    VERSION="1.0"
fi

ZIP_FILE="mod-helper-v${VERSION}"
echo "📦 Packing Vraag & Antwoord Helper v${VERSION}..."

rm -f "${ZIP_FILE}.zip"

# Create a temporary build directory
mkdir -p build_extension
cp -R extension/* build_extension/
# Copy the template files into the extension so they are packaged inside it
cp template.html script.js build_extension/

# Pack the build directory
python3 -c "import shutil; shutil.make_archive('${ZIP_FILE}', 'zip', 'build_extension')"

# Clean up
rm -rf build_extension

echo "✅ Klaar! Extensie ingepakt in: ${ZIP_FILE}.zip"
