#!/bin/bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "${SCRIPT_DIR}"

echo "🔍 TypeScript Learning Platform - Verification"
echo "============================================="
echo ""

echo "📁 Required files:"
for file in \
  "README.md" \
  "package.json" \
  "frontend/package.json" \
  "backend/package.json" \
  "shared/package.json" \
  "backend/src/index.ts" \
  "frontend/src/App.tsx" \
  "shared/types.ts"
do
  if [ -f "${file}" ]; then
    echo "  ✅ ${file}"
  else
    echo "  ❌ ${file}"
  fi
done
echo ""

echo "🧪 Running project checks:"
echo "  1) Build (shared + frontend + backend)"
npm run build
echo "  ✅ Build passed"
echo ""
echo "  2) Frontend lint"
(cd frontend && npm run lint)
echo "  ✅ Frontend lint passed"
echo ""
echo "  3) Frontend tests"
(cd frontend && npm test)
echo "  ✅ Frontend tests passed"
echo ""
echo "  4) Backend tests"
(cd backend && npm test)
echo "  ✅ Backend tests passed"
echo ""

echo "🌐 Runtime health:"
if curl -s --max-time 2 http://localhost:3000/api/health > /dev/null; then
  echo "  ✅ Backend health reachable (GET /api/health)"
else
  echo "  ℹ️  Backend not running (start backend to check health endpoint)"
fi

echo ""
echo "✅ Verification Complete!"
