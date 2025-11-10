#!/bin/bash

#############################################
# Rose Chemicals - Quick VPS Deployment
# For Ubuntu 22.04 LTS on Hostinger VPS
# IP: 72.60.218.57
# Domain: rosechemical.in
#############################################

set -e

echo "╔════════════════════════════════════════╗"
echo "║  Rose Chemicals - VPS Deployment       ║"
echo "║  Hostinger VPS - Ubuntu 22.04 LTS      ║"
echo "╚════════════════════════════════════════╝"
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Configuration
DOMAIN="rosechemical.in"
SERVER_IP="72.60.218.57"
APP_DIR="/var/www/rose-chemicals"

echo -e "${YELLOW}Step 1: System Update${NC}"
sudo apt-get update
sudo apt-get upgrade -y

echo -e "${YELLOW}Step 2: Installing Node.js 18.x${NC}"
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi
echo "Node version: $(node -v)"
echo "NPM version: $(npm -v)"

echo -e "${YELLOW}Step 3: Installing MongoDB${NC}"
if ! command -v mongod &> /dev/null; then
    sudo apt-get install -y mongodb
    sudo systemctl start mongodb
    sudo systemctl enable mongodb
fi
echo "MongoDB status:"
sudo systemctl status mongodb --no-pager | head -n 3

echo -e "${YELLOW}Step 4: Installing nginx${NC}"
if ! command -v nginx &> /dev/null; then
    sudo apt-get install -y nginx
    sudo systemctl start nginx
    sudo systemctl enable nginx
fi

echo -e "${YELLOW}Step 5: Installing PM2 (Process Manager)${NC}"
if ! command -v pm2 &> /dev/null; then
    sudo npm install -g pm2
    pm2 startup
fi

echo -e "${YELLOW}Step 6: Setting up Application Directory${NC}"
sudo mkdir -p $APP_DIR
sudo chown -R $USER:$USER $APP_DIR

echo -e "${YELLOW}Step 7: Cloning/Updating Repository${NC}"
if [ -d "$APP_DIR/.git" ]; then
    cd $APP_DIR
    git pull origin main
else
    git clone https://github.com/A-Generative-Slice/Rose-Chemicals.git $APP_DIR
    cd $APP_DIR
fi

echo -e "${YELLOW}Step 8: Installing Dependencies${NC}"
npm install
cd backend && npm install && cd ..

echo -e "${YELLOW}Step 9: Setting up Environment Files${NC}"
# Frontend .env
cat > .env << EOF
NEXT_PUBLIC_API_URL=https://$DOMAIN/api
EOF

# Backend .env
cat > backend/.env << EOF
# Database Configuration
MONGO_URI=mongodb://localhost:27017/rose-chemicals

# JWT Configuration
JWT_SECRET=$(openssl rand -base64 32)
JWT_EXPIRE=7d

# Server Configuration
NODE_ENV=production
PORT=5000

# Razorpay Configuration (Update with your keys)
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# File Upload Configuration
MAX_FILE_SIZE=5242880
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/webp
UPLOAD_PATH=./uploads

# Admin Configuration
ADMIN_EMAIL=admin@rosechemicals.com
ADMIN_PASSWORD=Admin@123
EOF

echo -e "${YELLOW}Step 10: Building Next.js Application${NC}"
npm run build

echo -e "${YELLOW}Step 11: Configuring nginx${NC}"
sudo tee /etc/nginx/sites-available/rose-chemicals > /dev/null << EOF
# Rose Chemicals - nginx Configuration
upstream backend {
    server 127.0.0.1:5000;
}

upstream frontend {
    server 127.0.0.1:3000;
}

server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;

    client_max_body_size 10M;

    # Backend API
    location /api {
        proxy_pass http://backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }

    # Frontend Next.js
    location / {
        proxy_pass http://frontend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }

    # Static files
    location /_next/static {
        proxy_pass http://frontend/_next/static;
        proxy_cache_valid 200 60m;
        add_header Cache-Control "public, max-age=3600";
    }
}
EOF

# Enable site
sudo ln -sf /etc/nginx/sites-available/rose-chemicals /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx

echo -e "${YELLOW}Step 12: Starting Application with PM2${NC}"
pm2 delete all 2>/dev/null || true
pm2 start ecosystem.config.js --env production
pm2 save
pm2 list

echo -e "${GREEN}═════════════════════════════════════════${NC}"
echo -e "${GREEN}✓ Deployment Complete!${NC}"
echo -e "${GREEN}═════════════════════════════════════════${NC}"
echo ""
echo -e "${YELLOW}Your application is running at:${NC}"
echo "  Frontend: http://$DOMAIN"
echo "  Backend API: http://$DOMAIN/api"
echo ""
echo -e "${YELLOW}Next Steps:${NC}"
echo "1. Update Razorpay keys in backend/.env"
echo "2. Setup SSL: sudo certbot --nginx -d $DOMAIN -d www.$DOMAIN"
echo "3. Monitor logs: pm2 logs"
echo "4. Check status: pm2 status"
echo ""
echo -e "${YELLOW}Useful Commands:${NC}"
echo "  pm2 restart all    - Restart both services"
echo "  pm2 logs           - View logs"
echo "  pm2 monit          - Monitor resources"
echo "  pm2 stop all       - Stop all services"
echo ""
