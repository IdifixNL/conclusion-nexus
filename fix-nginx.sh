#!/bin/bash

echo "🔧 Fixing Nginx SSL zone conflict..."

# Remove conflicting sites
echo "🗑️ Removing conflicting sites..."
sudo rm -f /etc/nginx/sites-enabled/planka
sudo rm -f /etc/nginx/sites-enabled/default

# Check what sites are enabled
echo "📋 Current enabled sites:"
ls -la /etc/nginx/sites-enabled/

# Test nginx configuration
echo "🧪 Testing nginx configuration..."
sudo nginx -t

# If test passes, reload nginx
if [ $? -eq 0 ]; then
    echo "✅ Nginx configuration is valid"
    sudo systemctl reload nginx
else
    echo "❌ Nginx configuration has errors"
    echo "Please check the configuration manually"
fi 