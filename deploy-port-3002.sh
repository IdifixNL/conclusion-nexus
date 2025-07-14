#!/bin/bash

echo "🚀 Deploying Conclusion Nexus on port 3002..."

# Navigate to the project directory
cd ~/apps/conclusion-nexus

# Stop any existing containers
echo "🛑 Stopping existing containers..."
docker-compose down 2>/dev/null || true

# Clean up any hanging containers
echo "🧹 Cleaning up..."
docker stop $(docker ps -q) 2>/dev/null || true
docker rm $(docker ps -aq) 2>/dev/null || true

# Kill any processes on port 3002
echo "🔌 Killing processes on port 3002..."
sudo fuser -k 3002/tcp 2>/dev/null || true

# Deploy the application
echo "🐳 Starting deployment on port 3002..."
docker-compose up -d --build

echo "✅ Deployment complete!"
echo "🌐 Your app is running on port 3002"
echo "🌐 Access via: https://conclusion-nexus.baburek.eu"
echo ""
echo "📋 Commands:"
echo "  - View logs: docker-compose logs -f"
echo "  - Stop: docker-compose down" 