#!/bin/bash
set -euo pipefail

cd "$(dirname "$0")/.."

echo "🔧 Bouwen van standalone-template.html..."

python3 - <<'PY'
import json
from pathlib import Path

template_path = Path("extension/template.html")
script_path = Path("extension/script.js")
manifest_path = Path("extension/manifest.json")

Path("release").mkdir(exist_ok=True)
output_path = Path("release/standalone-template.html")
marker = '<script src="script.js"></script>'

template = template_path.read_text(encoding="utf-8")
script = script_path.read_text(encoding="utf-8")
manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
version = manifest.get("version", "0.0.0-dev")

if marker not in template:
	raise SystemExit("ERROR: marker <script src=\"script.js\"></script> niet gevonden in extension/template.html")

standalone = template.replace(marker, f"<script>\n{script}\n</script>")
standalone = standalone.replace('content="0.0.0-dev"', f'content="{version}"')
output_path.write_text(standalone, encoding="utf-8")
PY

echo "✅ standalone-template.html is succesvol gegenereerd!"
