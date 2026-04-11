#!/bin/bash

echo "🐳 Building Docker executor image..."

cd "$(dirname "$0")"

docker build -t tslenrn-executor:latest .

if [ $? -eq 0 ]; then
  echo "✅ Docker image built successfully!"
  echo "🧪 Testing Docker image..."
  docker run --rm tslenrn-executor:latest node --version
  echo "✅ Docker image is working!"
else
  echo "❌ Docker image build failed!"
  exit 1
fi
