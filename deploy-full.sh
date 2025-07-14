#!/bin/bash

# Full Deployment Script - Backend, Frontend, and PostgreSQL
DOMAIN="conclusion-nexus.baburek.eu"
EMAIL="nico_baburek@hotmail.com"

echo "🚀 Starting full deployment for $DOMAIN..."

# Check if we're on the server
if [ ! -d "/etc/nginx" ]; then
    echo "❌ This script must be run on the server"
    exit 1
fi

# Force cleanup first
echo "🧹 Force cleaning up..."
sudo docker stop $(sudo docker ps -q) 2>/dev/null || true
sudo docker rm -f $(sudo docker ps -aq) 2>/dev/null || true
sudo docker network prune -f
sudo fuser -k 3002/tcp 2>/dev/null || true
sudo fuser -k 3003/tcp 2>/dev/null || true

# Fix nginx conflicts
echo "🔧 Fixing nginx conflicts..."
sudo rm -f /etc/nginx/sites-enabled/planka
sudo rm -f /etc/nginx/sites-enabled/default

sleep 3

# Update system packages
echo "📦 Updating system packages..."
sudo apt update
sudo apt install -y nginx certbot python3-certbot-nginx docker.io docker-compose

# Start Docker service
sudo systemctl start docker
sudo systemctl enable docker

# Add user to docker group
sudo usermod -aG docker $USER

# Create Nginx configuration for full setup
echo "🔧 Setting up Nginx configuration..."
sudo tee /etc/nginx/sites-available/$DOMAIN << EOF
server {
    listen 80;
    server_name $DOMAIN;
    
    location / {
        proxy_pass http://localhost:3002;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
    
    location /api {
        proxy_pass http://localhost:3003;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF

# Enable the site
sudo ln -sf /etc/nginx/sites-available/$DOMAIN /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Test and reload Nginx
sudo nginx -t && sudo systemctl reload nginx

# Get SSL certificate
echo "🔐 Obtaining SSL certificate..."
sudo certbot --nginx -d $DOMAIN --non-interactive --agree-tos --email $EMAIL

# Set up automatic renewal
sudo crontab -l 2>/dev/null | { cat; echo "0 12 * * * /usr/bin/certbot renew --quiet"; } | sudo crontab -

# Update Nginx configuration for HTTPS
sudo tee /etc/nginx/sites-available/$DOMAIN << EOF
server {
    listen 80;
    server_name $DOMAIN;
    return 301 https://\$server_name\$request_uri;
}

server {
    listen 443 ssl http2;
    server_name $DOMAIN;
    
    ssl_certificate /etc/letsencrypt/live/$DOMAIN/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/$DOMAIN/privkey.pem;
    
    # SSL configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    
    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options DENY always;
    add_header X-Content-Type-Options nosniff always;
    add_header X-XSS-Protection "1; mode=block" always;
    
    location / {
        proxy_pass http://localhost:3002;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
    
    location /api {
        proxy_pass http://localhost:3003;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF

# Reload Nginx
sudo systemctl reload nginx

# Deploy application
echo "🐳 Deploying full application with backend, frontend, and PostgreSQL..."
cd ~/apps/conclusion-nexus

# Stop existing containers
docker-compose down 2>/dev/null || true

# Build and start containers
docker-compose up -d --build

echo "✅ Full deployment complete!"
echo "🌐 Your application is now available at: https://$DOMAIN"
echo ""
echo "📋 Useful commands:"
echo "  - View logs: docker-compose logs -f"
echo "  - Backend logs: docker-compose logs backend"
echo "  - Frontend logs: docker-compose logs frontend"
echo "  - PostgreSQL logs: docker-compose logs postgres"
echo "  - Restart: docker-compose restart"
echo "  - Stop: docker-compose down" 