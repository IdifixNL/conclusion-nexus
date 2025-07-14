#!/bin/bash

echo "🧹 Clean deployment for conclusion-nexus..."

# Navigate to the project directory
cd ~/apps/conclusion-nexus

# Stop all containers
echo "🛑 Stopping all containers..."
docker-compose down 2>/dev/null || true
docker stop $(docker ps -q) 2>/dev/null || true
docker rm $(docker ps -aq) 2>/dev/null || true

# Force kill anything using port 3000
echo "🔌 Force killing processes on port 3000..."
sudo fuser -k 3000/tcp 2>/dev/null || true
sudo pkill -f "3000" 2>/dev/null || true

# Check what's using port 3000
echo "🔍 Checking what's using port 3000..."
sudo netstat -tlnp | grep ":3000" || echo "✅ Port 3000 is free"

# Wait a moment
sleep 3

# Deploy
echo "🐳 Deploying application..."
docker-compose up -d --build

echo "✅ Clean deployment complete!"
echo "🌐 Your app should be running on port 3000"
echo ""
echo "📋 Commands:"
echo "  - View logs: docker-compose logs -f"
echo "  - Stop: docker-compose down" 