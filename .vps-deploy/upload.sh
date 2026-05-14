#!/bin/bash
# VPS Direct Upload Script - Copy & Paste Commands
# Run these from YOUR LOCAL MAC to upload files to VPS
# Author: Rose Chemicals Deployment
# Last Updated: Nov 3, 2025

echo "🚀 Rose Chemicals VPS Direct Upload Script"
echo "==========================================="
echo ""

# Configuration
VPS_IP="72.60.218.80"
VPS_USER="root"
LOCAL_REPO="/Users/smdhussain/Desktop/projects/Rose-Chemicals-main"
VPS_PROJECT="/root/Rose-Chemicals"

echo "📋 Configuration:"
echo "   VPS IP: $VPS_IP"
echo "   Local Repo: $LOCAL_REPO"
echo "   VPS Project: $VPS_PROJECT"
echo ""

# ============================================================
# UPLOAD FUNCTIONS
# ============================================================

upload_api_js() {
  echo "📤 Uploading src/services/api.js..."
  scp "$LOCAL_REPO/src/services/api.js" "$VPS_USER@$VPS_IP:$VPS_PROJECT/src/services/api.js"
  if [ $? -eq 0 ]; then
    echo "✅ api.js uploaded successfully"
  else
    echo "❌ Failed to upload api.js"
    return 1
  fi
}

upload_seed_js() {
  echo "📤 Uploading backend/seed.js..."
  scp "$LOCAL_REPO/backend/seed.js" "$VPS_USER@$VPS_IP:$VPS_PROJECT/backend/seed.js"
  if [ $? -eq 0 ]; then
    echo "✅ seed.js uploaded successfully"
  else
    echo "❌ Failed to upload seed.js"
    return 1
  fi
}

upload_all_files() {
  echo "📦 Uploading all critical files..."
  
  # Create array of files to upload
  declare -a files=(
    "src/services/api.js"
    "backend/seed.js"
    "app/auth/register/page.tsx"
    "src/contexts/AuthContext.js"
  )
  
  for file in "${files[@]}"; do
    source_file="$LOCAL_REPO/$file"
    dest_path="$VPS_PROJECT/$file"
    
    if [ -f "$source_file" ]; then
      echo "  📤 Uploading $file..."
      scp "$source_file" "$VPS_USER@$VPS_IP:$dest_path"
      if [ $? -eq 0 ]; then
        echo "     ✅ Uploaded"
      else
        echo "     ❌ Failed"
      fi
    else
      echo "  ⚠️  File not found: $source_file"
    fi
  done
}

rebuild_vps() {
  echo ""
  echo "🔨 Rebuilding on VPS..."
  ssh "$VPS_USER@$VPS_IP" << 'EOF'
cd /root/Rose-Chemicals
echo "📦 Running npm build..."
npm run build

echo ""
echo "♻️  Reloading pm2..."
pm2 reload ecosystem.config.js

echo ""
echo "📊 Checking status..."
pm2 status
EOF
}

test_endpoints() {
  echo ""
  echo "🧪 Testing endpoints..."
  echo ""
  
  echo "1️⃣  Testing /api/health"
  curl -s https://rosechemical.in/api/health | head -c 100
  echo ""
  echo ""
  
  echo "2️⃣  Testing /api/products"
  curl -s https://rosechemical.in/api/products | head -c 200
  echo ""
  echo ""
  
  echo "3️⃣  Testing /api/auth/register"
  curl -s -X POST https://rosechemical.in/api/auth/register \
    -H 'Content-Type: application/json' \
    -d '{"name":"TestUser","email":"testuser@test.com","password":"Test123","phone":"9999999999","address":{"street":"Test St","city":"Test City","state":"TS","pincode":"12345"}}' | head -c 200
  echo ""
}

# ============================================================
# MAIN MENU
# ============================================================

show_menu() {
  echo ""
  echo "📋 Choose an option:"
  echo "  1) Upload api.js only"
  echo "  2) Upload seed.js only"
  echo "  3) Upload all files"
  echo "  4) Rebuild on VPS (after upload)"
  echo "  5) Test endpoints"
  echo "  6) Full deployment (upload all + rebuild + test)"
  echo "  7) Exit"
  echo ""
}

# ============================================================
# QUICK COPY-PASTE COMMANDS
# ============================================================

show_copy_paste_commands() {
  echo ""
  echo "📋 Copy-Paste Commands:"
  echo "======================="
  echo ""
  echo "1️⃣  Upload api.js:"
  echo "scp /Users/smdhussain/Desktop/projects/Rose-Chemicals-main/src/services/api.js root@72.60.218.80:/root/Rose-Chemicals/src/services/api.js"
  echo ""
  echo "2️⃣  Upload seed.js:"
  echo "scp /Users/smdhussain/Desktop/projects/Rose-Chemicals-main/backend/seed.js root@72.60.218.80:/root/Rose-Chemicals/backend/seed.js"
  echo ""
  echo "3️⃣  Rebuild on VPS:"
  echo "ssh root@72.60.218.80 'cd /root/Rose-Chemicals && npm run build && pm2 reload ecosystem.config.js'"
  echo ""
  echo "4️⃣  Check status:"
  echo "ssh root@72.60.218.80 'pm2 status'"
  echo ""
  echo "5️⃣  View logs:"
  echo "ssh root@72.60.218.80 'pm2 logs rose-backend --lines 50'"
  echo ""
}

# ============================================================
# MAIN SCRIPT
# ============================================================

if [ $# -eq 0 ]; then
  # Interactive mode
  while true; do
    show_menu
    read -p "Enter your choice: " choice
    
    case $choice in
      1) upload_api_js ;;
      2) upload_seed_js ;;
      3) upload_all_files ;;
      4) rebuild_vps ;;
      5) test_endpoints ;;
      6) 
        upload_all_files
        rebuild_vps
        test_endpoints
        ;;
      7) 
        echo "👋 Goodbye!"
        exit 0
        ;;
      *)
        echo "❌ Invalid option. Please try again."
        ;;
    esac
  done
else
  # Command line mode
  case $1 in
    api)
      upload_api_js
      ;;
    seed)
      upload_seed_js
      ;;
    all)
      upload_all_files
      ;;
    rebuild)
      rebuild_vps
      ;;
    test)
      test_endpoints
      ;;
    deploy)
      upload_all_files
      rebuild_vps
      test_endpoints
      ;;
    commands)
      show_copy_paste_commands
      ;;
    *)
      echo "Usage: $0 [api|seed|all|rebuild|test|deploy|commands]"
      exit 1
      ;;
  esac
fi
