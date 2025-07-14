#!/bin/bash

echo "🚀 Quick deployment for conclusion-nexus..."

# Navigate to the project directory
cd ~/apps/conclusion-nexus

# Stop any existing containers
echo "🛑 Stopping existing containers..."
docker-compose down 2>/dev/null || true
docker-compose -f docker-compose.prod.yml down 2>/dev/null || true
docker-compose -f docker-compose.simple.yml down 2>/dev/null || true

# Clean up any hanging containers
echo "🧹 Cleaning up..."
docker stop $(docker ps -q) 2>/dev/null || true
docker rm $(docker ps -aq) 2>/dev/null || true

# Use the simple deployment (single container)
echo "🐳 Starting simple deployment..."
docker-compose -f docker-compose.simple.yml up -d --build

echo "✅ Quick deployment complete!"
echo "🌐 Your app should be running on port 3000"
echo ""
echo "📋 Commands:"
echo "  - View logs: docker-compose -f docker-compose.simple.yml logs -f"
echo "  - Stop: docker-compose -f docker-compose.simple.yml down" 