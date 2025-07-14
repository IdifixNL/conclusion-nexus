#!/bin/bash

echo "🧹 Cleaning up Docker containers and ports..."

# Stop all running containers
echo "🛑 Stopping all containers..."
docker stop $(docker ps -q) 2>/dev/null || true

# Remove all containers
echo "🗑️ Removing all containers..."
docker rm $(docker ps -aq) 2>/dev/null || true

# Remove all networks
echo "🧹 Cleaning up networks..."
docker network prune -f

# Kill processes using ports 3000 and 3001
echo "🔌 Killing processes on ports 3000 and 3001..."
sudo fuser -k 3000/tcp 2>/dev/null || true
sudo fuser -k 3001/tcp 2>/dev/null || true

echo "✅ Cleanup complete!"
echo "Ports 3000 and 3001 should now be free." 