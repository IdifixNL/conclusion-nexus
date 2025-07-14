#!/bin/bash

echo "🔧 Fixing stuck Docker container..."

# Navigate to the project directory
cd ~/apps/conclusion-nexus

# Stop all containers
echo "🛑 Stopping all containers..."
docker-compose down 2>/dev/null || true
docker stop $(docker ps -q) 2>/dev/null || true

# Force remove the stuck container
echo "🗑️ Force removing stuck container..."
docker rm -f conclusion-nexus-app 2>/dev/null || true
docker rm -f $(docker ps -aq) 2>/dev/null || true

# Clean up networks
echo "🧹 Cleaning up networks..."
docker network prune -f

# Kill any processes on port 3000
echo "🔌 Killing processes on port 3000..."
sudo fuser -k 3000/tcp 2>/dev/null || true

# Wait a moment
sleep 3

# Check if port is free
echo "🔍 Checking if port 3000 is free..."
sudo ss -tlnp | grep ":3000" || echo "✅ Port 3000 is free"

# Deploy fresh
echo "🐳 Deploying fresh container..."
docker-compose up -d --build

echo "✅ Fixed stuck container!"
echo "🌐 Your app should be running on port 3000"
echo ""
echo "📋 Commands:"
echo "  - View logs: docker-compose logs -f"
echo "  - Stop: docker-compose down" 