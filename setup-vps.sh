#!/bin/bash

#############################################
# Rose Chemicals - VPS Setup Script
# Run this on your Ubuntu VPS after cloning
#############################################

set -e  # Exit on error

echo "╔════════════════════════════════════════╗"
echo "║  Rose Chemicals - VPS Setup            ║"
echo "║  Ubuntu 22.04 LTS / Node.js            ║"
echo "╚════════════════════════════════════════╝"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
   echo -e "${RED}This script must be run as root or with sudo${NC}"
   exit 1
fi

# Step 1: Update system
echo -e "${YELLOW}[1/6] Updating system packages...${NC}"
apt-get update
apt-get upgrade -y

# Step 2: Install Node.js and npm
echo -e "${YELLOW}[2/6] Installing Node.js and npm...${NC}"
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt-get install -y nodejs

# Step 3: Install MongoDB (if not using Atlas)
echo -e "${YELLOW}[3/6] Installing MongoDB...${NC}"
apt-get install -y mongodb
systemctl start mongodb
systemctl enable mongodb

# Step 4: Install Git and nginx
echo -e "${YELLOW}[4/6] Installing Git and nginx...${NC}"
apt-get install -y git nginx

# Step 5: Setup SSL with Let's Encrypt
echo -e "${YELLOW}[5/6] Installing Certbot for SSL...${NC}"
apt-get install -y certbot python3-certbot-nginx

# Step 6: Copy environment files
echo -e "${YELLOW}[6/6] Setting up environment files...${NC}"
cp .env.example .env
cp backend/.env.example backend/.env

# Install dependencies
echo -e "${GREEN}✓ Installing Node dependencies...${NC}"
npm install
cd backend && npm install && cd ..

echo -e "${GREEN}✓ System setup complete!${NC}"
echo ""
echo "═════════════════════════════════════════"
echo -e "${YELLOW}NEXT STEPS:${NC}"
echo "═════════════════════════════════════════"
echo ""
echo "1. Configure environment variables:"
echo "   - Edit .env (Frontend)"
echo "   - Edit backend/.env (Backend)"
echo "   - Update NEXT_PUBLIC_API_URL with your domain"
echo ""
echo "2. Setup MongoDB (if using local):"
echo "   - Verify MongoDB is running: sudo systemctl status mongodb"
echo "   - Initialize database: npm run seed (in backend folder)"
echo ""
echo "3. Setup SSL Certificate:"
echo "   sudo certbot certonly --nginx -d your-domain.com"
echo ""
echo "4. Configure nginx:"
echo "   - Review nginx.conf.example"
echo "   - Deploy to /etc/nginx/sites-available/"
echo ""
echo "5. Start the application:"
echo "   npm run dev:all"
echo ""
echo "═════════════════════════════════════════"
