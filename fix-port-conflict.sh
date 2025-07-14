#!/bin/bash

echo "🔧 Fixing port conflict between Planka and Conclusion Nexus..."

# Navigate to conclusion-nexus
cd ~/apps/conclusion-nexus

# Stop conclusion-nexus containers
echo "🛑 Stopping conclusion-nexus containers..."
docker-compose down 2>/dev/null || true

# Remove any stuck containers
echo "🧹 Cleaning up containers..."
docker rm -f conclusion-nexus-backend 2>/dev/null || true
docker rm -f conclusion-nexus-frontend 2>/dev/null || true
docker rm -f conclusion-nexus-postgres 2>/dev/null || true

# Kill processes on ports 3001, 3002, 3003
echo "🔌 Killing processes on ports 3001, 3002, 3003..."
sudo fuser -k 3001/tcp 2>/dev/null || true
sudo fuser -k 3002/tcp 2>/dev/null || true
sudo fuser -k 3003/tcp 2>/dev/null || true

# Wait a moment
sleep 3

# Deploy conclusion-nexus with new port configuration
echo "🐳 Deploying conclusion-nexus with port 3003 for backend..."
docker-compose up -d --build

# Wait for conclusion-nexus to start
sleep 10

# Now start Planka
echo "🔄 Starting Planka..."
cd ~/apps/planka
docker-compose up -d

# Go back to conclusion-nexus
cd ~/apps/conclusion-nexus

echo "✅ Port conflict fixed!"
echo "🌐 Conclusion Nexus: https://conclusion-nexus.baburek.eu"
echo "🌐 Planka: http://your-planka-domain:3001"
echo ""
echo "📋 Port assignments:"
echo "  - Conclusion Nexus Frontend: Port 3002"
echo "  - Conclusion Nexus Backend: Port 3003"
echo "  - Planka: Port 3001"
echo "  - No conflicts! ✅" 