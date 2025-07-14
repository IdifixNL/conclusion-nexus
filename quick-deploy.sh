#!/bin/bash

echo "🚀 Quick deployment for conclusion-nexus..."

# Navigate to the project directory
cd ~/apps/conclusion-nexus

# Stop any existing containers
echo "🛑 Stopping existing containers..."
docker-compose down 2>/dev/null || true

# Clean up any hanging containers
echo "🧹 Cleaning up..."
docker stop $(docker ps -q) 2>/dev/null || true
docker rm $(docker ps -aq) 2>/dev/null || true

# Deploy the application
echo "🐳 Starting deployment..."
docker-compose up -d --build

echo "✅ Quick deployment complete!"
echo "🌐 Your app should be running on port 3000"
echo ""
echo "📋 Commands:"
echo "  - View logs: docker-compose logs -f"
echo "  - Stop: docker-compose down" 