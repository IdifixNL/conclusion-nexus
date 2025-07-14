#!/bin/bash

echo "🚀 Deploying Conclusion Nexus with Planka consideration..."

# Navigate to conclusion-nexus
cd ~/apps/conclusion-nexus

# Stop Planka temporarily to free up resources
echo "⏸️ Temporarily stopping Planka..."
cd ~/apps/planka
docker-compose down 2>/dev/null || true
cd ~/apps/conclusion-nexus

# Clean up conclusion-nexus
echo "🧹 Cleaning up conclusion-nexus..."
docker-compose down 2>/dev/null || true
docker rm -f conclusion-nexus-app 2>/dev/null || true
docker rm -f $(docker ps -aq) 2>/dev/null || true

# Kill any processes on ports 3000 and 3001
echo "🔌 Killing processes on ports 3000 and 3001..."
sudo fuser -k 3000/tcp 2>/dev/null || true
sudo fuser -k 3001/tcp 2>/dev/null || true

# Clean up networks
echo "🧹 Cleaning up networks..."
docker network prune -f

# Wait a moment
sleep 3

# Deploy conclusion-nexus
echo "🐳 Deploying conclusion-nexus..."
docker-compose up -d --build

# Wait for conclusion-nexus to start
sleep 10

# Restart Planka
echo "🔄 Restarting Planka..."
cd ~/apps/planka
docker-compose up -d

# Go back to conclusion-nexus
cd ~/apps/conclusion-nexus

echo "✅ Deployment complete!"
echo "🌐 Conclusion Nexus: https://conclusion-nexus.baburek.eu"
echo "🌐 Planka: http://your-planka-domain:3001"
echo ""
echo "📋 Commands:"
echo "  - Conclusion Nexus logs: docker-compose logs -f"
echo "  - Planka logs: cd ~/apps/planka && docker-compose logs -f" 