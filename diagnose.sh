#!/bin/bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
FRONTEND_DIR="${SCRIPT_DIR}/frontend"
FRONTEND_PORT="${FRONTEND_PORT:-5173}"

echo "=== 前端诊断 ==="
echo ""

echo "1. 检查前端进程："
ps aux | grep "[v]ite" || echo "  ❌ 前端未运行"

echo ""
echo "2. 检查端口："
if curl -s "http://localhost:${FRONTEND_PORT}" > /dev/null; then
  echo "  ✅ ${FRONTEND_PORT} 端口可访问"
else
  echo "  ❌ ${FRONTEND_PORT} 端口无法访问"
fi

echo ""
echo "3. 检查 TypeScript 编译："
if (cd "${FRONTEND_DIR}" && npx tsc --noEmit); then
  echo "  ✅ 无编译错误"
else
  echo "  ❌ 有编译错误"
fi

echo ""
echo "4. 检查依赖："
cd "${FRONTEND_DIR}"
for pkg in react react-dom @monaco-editor/react axios; do
  if npm list "$pkg" >/dev/null 2>&1; then
    echo "  ✅ ${pkg}"
  else
    echo "  ❌ ${pkg} 缺失"
  fi
done

echo ""
echo "5. 检查关键文件："
for file in src/App.tsx src/main.tsx index.html; do
  [ -f "$file" ] && echo "  ✅ $file" || echo "  ❌ $file 缺失"
done
