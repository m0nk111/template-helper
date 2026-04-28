#!/bin/bash
set -euo pipefail

cd "$(dirname "$0")/.."

echo "🔧 Bouwen van standalone-template-v[version].html..."

python3 - <<'PY'
import json
from pathlib import Path

template_path = Path("extension/template.html")
script_path = Path("extension/script.js")
manifest_path = Path("extension/manifest.json")

manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
version = manifest.get("version", "0.0.0-dev")

Path("release").mkdir(exist_ok=True)
output_path = Path(f"release/standalone-template-v{version}.html")
marker = '<script src="script.js"></script>'

template = template_path.read_text(encoding="utf-8")
script = script_path.read_text(encoding="utf-8")

if marker not in template:
        raise SystemExit("ERROR: marker <script src=\"script.js\"></script> niet gevonden in extension/template.html")

standalone = template.replace(marker, f"<script>\n{script}\n</script>")
standalone = standalone.replace('content="0.0.0-dev"', f'content="{version}"')
output_path.write_text(standalone, encoding="utf-8")
print(f"Standalone file written to: {output_path}")
PY

echo "✅ standalone-template is succesvol gegenereerd!"
