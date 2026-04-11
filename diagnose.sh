#!/bin/bash

echo "=== 前端诊断 ==="
echo ""

echo "1. 检查前端进程："
ps aux | grep "[n]ode.*vite" || echo "  ❌ 前端未运行"

echo ""
echo "2. 检查端口："
curl -s http://localhost:5174 > /dev/null && echo "  ✅ 5174端口可访问" || echo "  ❌ 5174端口无法访问"

echo ""
echo "3. 检查TypeScript编译："
cd frontend && npx tsc --noEmit && echo "  ✅ 无编译错误" || echo "  ❌ 有编译错误"

echo ""
echo "4. 检查依赖："
cd /home/korbin/projects/tslenrn/frontend
for pkg in react react-dom @monaco-editor/react axios; do
  npm list $pkg 2>/dev/null | grep $pkg && echo "  ✅ $pkg" || echo "  ❌ $pkg 缺失"
done

echo ""
echo "5. 检查关键文件："
for file in src/App.tsx src/main.tsx index.html; do
  [ -f "$file" ] && echo "  ✅ $file" || echo "  ❌ $file 缺失"
done
