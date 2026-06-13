#!/usr/bin/env bash
# تشغيل المنصة محلياً — مطلوب لعمل React + Babel
set -euo pipefail
cd "$(dirname "$0")"
PORT="${1:-8080}"
echo "تدفّق الخير — http://localhost:$PORT/portal.html"
echo "المنصة: http://localhost:$PORT/final3d.html"
echo "اضغط Ctrl+C للإيقاف"
exec python3 -m http.server "$PORT"
