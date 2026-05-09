#!/bin/bash
set -e

echo "=== Checking PM2 status ==="
pm2 status || echo "PM2 not running"

echo "=== Checking running ports ==="
ss -tlnp | grep -E '(3001|5001|5000|3000)' || echo "No matching ports"

echo "=== Fixing nginx config ==="
cat > /etc/nginx/sites-available/rosechemicals << 'NGINXEOF'
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    server_name _;

    # Frontend (Next.js on port 3001)
    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Backend API (Node.js)
    location /api {
        proxy_pass http://localhost:5001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Serve uploaded files from backend
    location /uploads {
        proxy_pass http://localhost:5001/uploads;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
    }
}
NGINXEOF

ln -sf /etc/nginx/sites-available/rosechemicals /etc/nginx/sites-enabled/rosechemicals
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx

echo "=== Restarting PM2 ==="
cd /root/Rose-Chemicals
pm2 restart all
sleep 3
pm2 status

echo "=== Testing backend health ==="
curl -s http://localhost:5001/api/health || curl -s http://localhost:5000/api/health || echo "Backend health check failed"

echo "=== Testing frontend ==="
curl -s -o /dev/null -w "%{http_code}" http://localhost:3001 || echo "Frontend check failed"

echo "=== DEPLOY FIX COMPLETE ==="
