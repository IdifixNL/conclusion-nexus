#!/bin/bash

echo "💥 FORCE CLEANUP - Stopping everything..."

# Force stop all containers with sudo
echo "🛑 Force stopping all containers..."
sudo docker stop $(sudo docker ps -q) 2>/dev/null || true
sudo docker rm $(sudo docker ps -aq) 2>/dev/null || true

# Force remove all containers
echo "🗑️ Force removing all containers..."
sudo docker rm -f $(sudo docker ps -aq) 2>/dev/null || true

# Remove all networks
echo "🧹 Cleaning up networks..."
sudo docker network prune -f

# Kill ALL processes using ports 3000 and 3001
echo "🔌 Force killing processes on ports 3000 and 3001..."
sudo pkill -f "3000" 2>/dev/null || true
sudo pkill -f "3001" 2>/dev/null || true
sudo fuser -k 3000/tcp 2>/dev/null || true
sudo fuser -k 3001/tcp 2>/dev/null || true

# Also kill any nginx processes that might be interfering
echo "🌐 Stopping nginx..."
sudo systemctl stop nginx 2>/dev/null || true

# Wait for ports to be released
echo "⏳ Waiting for ports to be released..."
sleep 5

# Check if ports are free
echo "🔍 Checking port status..."
sudo netstat -tlnp | grep ":3000\|:3001" || echo "✅ Ports 3000 and 3001 are free"

echo "✅ Force cleanup complete!"
echo "All containers stopped and ports should be free." 