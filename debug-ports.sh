#!/bin/bash

echo "🔍 DEBUGGING PORT 3000..."

echo ""
echo "📋 1. Checking what processes are using port 3000:"
sudo netstat -tlnp | grep ":3000" || echo "No processes found on port 3000"

echo ""
echo "📋 2. Checking all listening ports:"
sudo netstat -tlnp | grep LISTEN

echo ""
echo "📋 3. Checking Docker containers:"
docker ps -a

echo ""
echo "📋 4. Checking Docker networks:"
docker network ls

echo ""
echo "📋 5. Checking processes with '3000' in name:"
ps aux | grep 3000

echo ""
echo "📋 6. Checking lsof for port 3000:"
sudo lsof -i :3000 2>/dev/null || echo "lsof not available or no processes found"

echo ""
echo "📋 7. Checking systemd services:"
sudo systemctl list-units --type=service | grep -i nginx

echo ""
echo "🔧 COMMANDS TO TRY:"
echo "  - Kill all processes on port 3000: sudo fuser -k 3000/tcp"
echo "  - Stop all containers: docker stop \$(docker ps -q)"
echo "  - Remove all containers: docker rm \$(docker ps -aq)"
echo "  - Restart Docker: sudo systemctl restart docker" 