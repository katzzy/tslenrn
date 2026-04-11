#!/bin/bash

echo "🚀 TypeScript Learning Platform - Setup Script"
echo "=============================================="
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

echo "✅ Node.js version: $(node --version)"

# Check npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed."
    exit 1
fi

echo "✅ npm version: $(npm --version)"

# Check Docker (optional)
if command -v docker &> /dev/null; then
    echo "✅ Docker version: $(docker --version)"
    HAS_DOCKER=true
else
    echo "⚠️  Docker not found. Code execution will use basic Node.js (less secure)."
    HAS_DOCKER=false
fi

echo ""
echo "📦 Installing dependencies..."
echo ""

# Root dependencies
echo "Installing root dependencies..."
npm install

# Frontend dependencies
echo "Installing frontend dependencies..."
cd frontend
npm install
cd ..

# Backend dependencies
echo "Installing backend dependencies..."
cd backend
npm install

# Copy env file if not exists
if [ ! -f .env ]; then
    echo "Creating .env file..."
    cp .env.example .env
fi

cd ..

# Build Docker image if Docker is available
if [ "$HAS_DOCKER" = true ]; then
    echo ""
    echo "🐳 Building Docker executor image..."
    cd backend
    chmod +x build-docker.sh
    ./build-docker.sh
    cd ..
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "📚 Next steps:"
echo ""
echo "1. Start the backend server:"
echo "   cd backend && npm run dev"
echo ""
echo "2. In a new terminal, start the frontend:"
echo "   cd frontend && npm run dev"
echo ""
echo "3. Open your browser to: http://localhost:5173"
echo ""
echo "Happy coding! 🎉"
