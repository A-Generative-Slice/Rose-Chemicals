#!/bin/bash

#╔══════════════════════════════════════════════════════════════════════════════╗
#║                                                                              ║
#║        Rose Chemicals — VPS Deployment Fix Script                           ║
#║                                                                              ║
#║  This script automatically applies remaining manual fixes for VPS           ║
#║  deployment after the code fixes have been applied.                         ║
#║                                                                              ║
#╚══════════════════════════════════════════════════════════════════════════════╝

set -e

echo "🚀 Rose Chemicals VPS Deployment Setup"
echo "========================================"
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if we're in the project root
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Error: package.json not found!${NC}"
    echo "Please run this script from the project root directory."
    exit 1
fi

echo -e "${GREEN}✅ Project root detected${NC}"
echo ""

# Step 1: Update backend dev script
echo "Step 1: Updating backend dev script..."
if [ -f "backend/package.json" ]; then
    if grep -q '"dev": "node server.js"' backend/package.json; then
        sed -i 's/"dev": "node server.js"/"dev": "nodemon server.js"/' backend/package.json
        echo -e "${GREEN}✅ Backend dev script updated${NC}"
    else
        echo -e "${YELLOW}⚠️  Backend dev script already updated${NC}"
    fi
else
    echo -e "${RED}❌ backend/package.json not found${NC}"
    exit 1
fi

echo ""

# Step 2: Create .env.local if it doesn't exist
echo "Step 2: Setting up frontend environment..."
if [ ! -f ".env.local" ]; then
    cat > .env.local << 'EOF'
# Frontend Environment Variables
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id_here
NEXT_PUBLIC_IMAGE_DOMAIN=localhost
EOF
    echo -e "${GREEN}✅ Created .env.local${NC}"
    echo "   ⚠️  Update NEXT_PUBLIC_RAZORPAY_KEY_ID with your actual key"
else
    echo -e "${YELLOW}⚠️  .env.local already exists${NC}"
fi

echo ""

# Step 3: Create backend/.env if it doesn't exist
echo "Step 3: Setting up backend environment..."
if [ ! -f "backend/.env" ]; then
    cat > backend/.env << 'EOF'
# Backend Environment Variables
MONGO_URI=mongodb://localhost:27017/rose-chemicals
JWT_SECRET=change_this_to_a_random_32_character_string_for_production
JWT_EXPIRE=7d
REFRESH_TOKEN_SECRET=change_this_to_another_random_string
REFRESH_TOKEN_EXPIRE=30d
PORT=5000
NODE_ENV=production
CORS_ORIGIN=http://localhost:3000,http://localhost:3001

# AWS S3 Configuration (optional)
AWS_ACCESS_KEY_ID=your_aws_key_here
AWS_SECRET_ACCESS_KEY=your_aws_secret_here
AWS_REGION=us-east-1
AWS_S3_BUCKET=your-bucket-name

# Razorpay Payment
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret

# Email Configuration (optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_FROM_EMAIL=noreply@rosechemicals.com
EOF
    echo -e "${GREEN}✅ Created backend/.env${NC}"
    echo "   ⚠️  Update all values (MONGO_URI, JWT_SECRET, AWS keys, etc.)"
else
    echo -e "${YELLOW}⚠️  backend/.env already exists${NC}"
fi

echo ""

# Step 4: Install dependencies
echo "Step 4: Installing dependencies..."
echo "This may take a few minutes..."
npm run install:all > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Dependencies installed${NC}"
else
    echo -e "${RED}❌ Failed to install dependencies${NC}"
    echo "Run manually: npm run install:all"
fi

echo ""

# Step 5: Check if build passes
echo "Step 5: Checking build..."
npm run build > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Build successful${NC}"
else
    echo -e "${RED}❌ Build failed - check errors above${NC}"
    exit 1
fi

echo ""
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║                                                                ║"
echo -e "║  ${GREEN}✅ ALL FIXES APPLIED SUCCESSFULLY!${NC}                        ║"
echo "║                                                                ║"
echo "╚════════════════════════════════════════════════════════════════╝"

echo ""
echo "📝 IMPORTANT: Next steps:"
echo ""
echo "1. ⚠️  UPDATE ENVIRONMENT VALUES:"
echo "   • Edit .env.local and add your Razorpay key"
echo "   • Edit backend/.env and add:"
echo "     - MONGO_URI (if not using localhost)"
echo "     - JWT_SECRET (change to random 32+ char string)"
echo "     - AWS credentials (if using S3)"
echo "     - Razorpay credentials"
echo ""
echo "2. 🧪 TEST LOCALLY:"
echo "   npm run dev:all"
echo "   • Frontend should run on http://localhost:3001"
echo "   • Backend should run on http://localhost:5000"
echo ""
echo "3. 🚀 DEPLOY TO VPS:"
echo "   • Follow guide in VPS_ERRORS_FIXED.md"
echo "   • Connect to VPS: ssh root@your_vps_ip"
echo "   • Install Node.js, MongoDB, Nginx, PM2"
echo "   • Clone repository, run this script again"
echo "   • Configure Nginx and SSL"
echo ""
echo "4. 📖 REFERENCE DOCUMENTS:"
echo "   • DEPLOYMENT_REPORT.md - Overview"
echo "   • VPS_ERRORS_FIXED.md - Full deployment guide"
echo "   • VPS_DEPLOYMENT_CHECKLIST.md - Quick reference"
echo "   • ERRORS_FOUND_AND_FIXED.md - Detailed analysis"
echo ""
echo "Good luck! Your project is ready for VPS deployment! 🚀"
echo ""
