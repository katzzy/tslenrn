#!/bin/bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "${SCRIPT_DIR}"

echo "🚀 TypeScript Learning Platform - Setup Script"
echo "=============================================="
echo ""

if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi
echo "✅ Node.js version: $(node --version)"

if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed."
    exit 1
fi
echo "✅ npm version: $(npm --version)"

HAS_DOCKER=false
if command -v docker &> /dev/null; then
    echo "✅ Docker version: $(docker --version)"
    HAS_DOCKER=true
else
    echo "⚠️  Docker not found. Backend will use local execution fallback (less secure, no container isolation)."
fi

echo ""
echo "📦 Installing workspace dependencies..."
npm install --workspaces --include-workspace-root

if [ ! -f "backend/.env" ]; then
    echo "Creating backend/.env file..."
    cp "backend/.env.example" "backend/.env"
fi

if [ "${HAS_DOCKER}" = true ]; then
    echo ""
    echo "🐳 Building Docker executor image..."
    chmod +x backend/build-docker.sh
    (cd backend && ./build-docker.sh)
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "📚 Next steps:"
echo "1. Start backend:  cd backend && npm run dev"
echo "2. Start frontend: cd frontend && npm run dev"
echo "3. Open: http://localhost:5173"
