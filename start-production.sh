#!/bin/bash

#############################################
# Rose Chemicals - Production Start Script
#############################################

set -e

echo "╔════════════════════════════════════════╗"
echo "║  Rose Chemicals - Starting Application ║"
echo "╚════════════════════════════════════════╝"
echo ""

# Check if PM2 is installed
if ! command -v pm2 &> /dev/null; then
    echo "PM2 not found. Installing globally..."
    sudo npm install -g pm2
fi

# Install dependencies if not already done
if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install
fi

if [ ! -d "backend/node_modules" ]; then
    echo "Installing backend dependencies..."
    cd backend && npm install && cd ..
fi

# Check environment files
if [ ! -f ".env" ]; then
    echo "⚠️  .env file not found!"
    echo "Creating from template..."
    cp .env.example .env
    echo "⚠️  Please update .env with your configuration"
fi

if [ ! -f "backend/.env" ]; then
    echo "⚠️  backend/.env file not found!"
    echo "Creating from template..."
    cp backend/.env.example backend/.env
    echo "⚠️  Please update backend/.env with your configuration"
fi

# Create logs directory
mkdir -p logs

# Start with PM2
echo "Starting application with PM2..."
pm2 start ecosystem.config.js --env production

# Save PM2 configuration
pm2 save

# Show status
echo ""
echo "╔════════════════════════════════════════╗"
echo "║  Application Started Successfully!     ║"
echo "╚════════════════════════════════════════╝"
echo ""
echo "Check status:"
echo "  pm2 status"
echo ""
echo "View logs:"
echo "  pm2 logs"
echo ""
echo "Stop application:"
echo "  pm2 stop all"
echo ""
echo "Monitor:"
echo "  pm2 monit"
echo ""

# Show running processes
pm2 status
