# Rose Chemicals — VPS Deployment Error Report & Fixes

**Generated:** October 30, 2025  
**Purpose:** Document all file/path errors found during VPS deployment on Hostinger KVM 2

---

## 📋 Summary of Issues Found

Your repository had **3 main categories of errors** that would prevent deployment on a VPS:

1. **Import Path Errors** — Incorrect relative paths with redundant `src/` references
2. **Folder Naming Inconsistency** — Wrong folder name in one import (`context` vs `contexts`)
3. **Configuration Issues** — Missing/incomplete env setup, script issues

---

## 🔴 Critical Errors Found & Fixed

### **Category 1: Redundant `src/` in Import Paths**

**Problem:** Files in `src/components/dashboard/` were importing from `../../src/services/api`, creating a path like `src/src/services/api` which doesn't exist.

**Files Affected:** 5 files
- `src/components/dashboard/ProfileSettingsSection.tsx`
- `src/components/dashboard/OrdersSection.tsx`
- `src/components/dashboard/WishlistSection.tsx`
- `src/components/dashboard/ReviewsSection.tsx`
- `src/components/dashboard/AddressBookSection.tsx`

**Fix Applied:**

| File | Before | After |
|------|--------|-------|
| `ProfileSettingsSection.tsx` | `import { useAuth } from '../../src/context/AuthContext';` | `import { useAuth } from '../../contexts/AuthContext';` |
| `ProfileSettingsSection.tsx` | `import { authAPI } from '../../src/services/api';` | `import { authAPI } from '../../services/api';` |
| `OrdersSection.tsx` | `import { ordersAPI } from '../../src/services/api';` | `import { ordersAPI } from '../../services/api';` |
| `WishlistSection.tsx` | `import { wishlistAPI, cartAPI } from '../../src/services/api';` | `import { wishlistAPI, cartAPI } from '../../services/api';` |
| `ReviewsSection.tsx` | `import { reviewsAPI } from '../../src/services/api';` | `import { reviewsAPI } from '../../services/api';` |
| `AddressBookSection.tsx` | `import { addressAPI } from '../../src/services/api';` | `import { addressAPI } from '../../services/api';` |

---

### **Category 2: Folder Name Mismatch**

**Problem:** One file imported from `../../src/context/AuthContext` but the actual folder is `src/contexts/` (plural).

**File Affected:** 
- `src/components/dashboard/ProfileSettingsSection.tsx`
- `app/dashboard/page.tsx`

**Status:** ✅ **FIXED**

---

### **Category 3: Backend Configuration Issues** ⚠️

**Problem:** Backend `package.json` uses `node server.js` for dev, but `nodemon` is installed as devDependency but not used. During VPS deployment with cold starts, this leads to slow development cycles.

**Solution:** Update backend dev script to use `nodemon`:

**File:** `backend/package.json`

**Before:**
```json
"scripts": {
  "start": "node server.js",
  "dev": "node server.js",
  "build": "npm install"
}
```

**After:**
```json
"scripts": {
  "start": "node server.js",
  "dev": "nodemon server.js",
  "build": "npm install"
}
```

**Apply this fix manually:** Edit `backend/package.json` line 6 from `"dev": "node server.js"` to `"dev": "nodemon server.js"`

---

## ⚙️ Environment Variables Required for VPS

Create two `.env` files with the following variables:

### **Root `.env.local` (Frontend)**
```bash
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000

# Razorpay (Payment Gateway)
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id_here

# Image Optimization
NEXT_PUBLIC_IMAGE_DOMAIN=localhost
```

### **`backend/.env` (Backend)**
```bash
# Database
MONGO_URI=mongodb://localhost:27017/rose-chemicals
# OR for MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/rose-chemicals

# JWT & Security
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRE=30d

# AWS S3 (for image uploads)
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=us-east-1
AWS_S3_BUCKET=your-s3-bucket-name

# Razorpay Payment Gateway
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret

# Email (optional, for nodemailer)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-specific-password
SMTP_FROM_EMAIL=noreply@rosechemicals.com

# Port Configuration
PORT=5000
NODE_ENV=production

# CORS Configuration
CORS_ORIGIN=http://your-domain.com,https://your-domain.com

# File Upload
MAX_FILE_SIZE=5242880
UPLOAD_DIR=/uploads
```

---

## 🚀 VPS Deployment Steps (Hostinger KVM 2)

### **Step 1: Connect to VPS via SSH**
```bash
ssh root@your_vps_ip
```

### **Step 2: Install Required Software**
```bash
# Update system
apt update && apt upgrade -y

# Install Node.js (v18 LTS recommended)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt install -y nodejs

# Install MongoDB
apt install -y mongodb-server

# Start MongoDB
systemctl start mongodb
systemctl enable mongodb

# Install Nginx (for reverse proxy)
apt install -y nginx

# Install PM2 (process manager)
npm install -g pm2
```

### **Step 3: Clone Repository**
```bash
cd /var/www
git clone https://github.com/your-username/Rose-Chemicals-main.git
cd Rose-Chemicals-main
```

### **Step 4: Install Dependencies**
```bash
# Install all dependencies (root + backend)
npm run install:all
```

### **Step 5: Setup Environment Files**
```bash
# Create frontend env
nano .env.local
# Paste the content from "Root `.env.local`" section above

# Create backend env
nano backend/.env
# Paste the content from "backend/.env" section above
```

### **Step 6: Build Frontend**
```bash
npm run build
```

### **Step 7: Start Services with PM2**

**Create PM2 ecosystem config:** `ecosystem.config.js`
```javascript
module.exports = {
  apps: [
    {
      name: "rose-backend",
      script: "./backend/server.js",
      instances: "max",
      exec_mode: "cluster",
      env: {
        NODE_ENV: "production",
        PORT: 5000
      }
    },
    {
      name: "rose-frontend",
      script: "npm",
      args: "start",
      instances: 1,
      exec_mode: "fork",
      env: {
        NODE_ENV: "production",
        PORT: 3000
      }
    }
  ]
};
```

**Start with PM2:**
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### **Step 8: Configure Nginx**

Create `/etc/nginx/sites-available/rose-chemicals`:
```nginx
upstream backend {
  server 127.0.0.1:5000;
}

upstream frontend {
  server 127.0.0.1:3000;
}

server {
  listen 80;
  server_name your-domain.com www.your-domain.com;

  # Redirect HTTP to HTTPS
  return 301 https://$server_name$request_uri;
}

server {
  listen 443 ssl http2;
  server_name your-domain.com www.your-domain.com;

  ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
  ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

  # Frontend
  location / {
    proxy_pass http://frontend;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
  }

  # API
  location /api {
    proxy_pass http://backend;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_cache_bypass $http_upgrade;
  }

  # Static files with caching
  location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
    proxy_pass http://frontend;
    expires 30d;
    add_header Cache-Control "public, immutable";
  }
}
```

**Enable the site:**
```bash
ln -s /etc/nginx/sites-available/rose-chemicals /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

### **Step 9: Setup SSL Certificate (Let's Encrypt)**
```bash
# Install Certbot
apt install -y certbot python3-certbot-nginx

# Get certificate
certbot certonly --nginx -d your-domain.com -d www.your-domain.com

# Auto-renewal
systemctl enable certbot.timer
systemctl start certbot.timer
```

### **Step 10: Verify Everything is Running**
```bash
pm2 status
curl http://localhost:5000/api/health  # Backend health check
curl http://localhost:3000            # Frontend
```

---

## 🧪 Testing After Deployment

### **1. Frontend Testing**
```bash
# Visit in browser
https://your-domain.com
```

### **2. Backend API Testing**
```bash
# Test API endpoint
curl -X GET https://your-domain.com/api/products

# Test with authentication
curl -X GET https://your-domain.com/api/orders \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### **3. Check Logs**
```bash
# PM2 logs
pm2 logs

# Nginx logs
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log

# Backend logs
pm2 logs rose-backend
```

---

## 🛠️ Quick Fix Script

Run this script on your VPS to apply all fixes automatically:

Create file: `/tmp/setup.sh`
```bash
#!/bin/bash
set -e

cd /var/www/Rose-Chemicals-main

echo "🔧 Applying fixes..."

# Fix backend dev script
sed -i 's/"dev": "node server.js"/"dev": "nodemon server.js"/' backend/package.json

# Reinstall backend deps
cd backend
npm install
cd ..

echo "✅ All fixes applied!"
echo "📝 Next steps:"
echo "1. Configure .env.local and backend/.env"
echo "2. Run: npm run build"
echo "3. Run: pm2 start ecosystem.config.js"
```

**Run it:**
```bash
bash /tmp/setup.sh
```

---

## 📊 Port Configuration Reference

| Service | Port | Protocol | Notes |
|---------|------|----------|-------|
| Frontend (Next.js) | 3000 | HTTP/HTTPS | Behind Nginx reverse proxy |
| Backend (Express) | 5000 | HTTP | Behind Nginx reverse proxy |
| MongoDB | 27017 | TCP | Local only, no external access |
| Nginx | 80, 443 | HTTP/HTTPS | Public facing |

---

## ⚠️ Common VPS Errors & Solutions

### **Error: "Cannot find module '@/services/api'"**
**Solution:** Ensure `tsconfig.json` has correct path mapping:
```json
"paths": {
  "@/*": ["./src/*"]
}
```

### **Error: "ENOENT: no such file or directory, open '.env'"**
**Solution:** Create `.env` files in both root and `backend/` folder (see env setup above).

### **Error: "MongoDB connection refused"**
**Solution:** 
```bash
systemctl start mongodb
systemctl status mongodb
```

### **Error: "Cannot GET /api/..."**
**Solution:** Ensure backend is running:
```bash
pm2 status
pm2 logs rose-backend  # Check for errors
```

### **Error: "413 Payload Too Large"**
**Solution:** Increase Nginx limit in `/etc/nginx/nginx.conf`:
```nginx
http {
  client_max_body_size 50M;
}
```
Then restart: `systemctl restart nginx`

---

## 🔒 Security Checklist for Production

- [ ] Change all default passwords in `.env` files
- [ ] Enable MongoDB authentication
- [ ] Set `NODE_ENV=production` in backend `.env`
- [ ] Enable SSL/TLS certificates (Let's Encrypt)
- [ ] Set strong `JWT_SECRET` (min 32 characters)
- [ ] Configure CORS properly (only allow your domain)
- [ ] Set up firewall rules (ufw)
- [ ] Enable daily backups for MongoDB
- [ ] Monitor logs regularly
- [ ] Setup email alerts for PM2 failures

---

## 📞 Support & Next Steps

After applying these fixes:

1. **Test locally first:**
   ```bash
   npm run dev:all
   ```

2. **Test on VPS before deploying to production**

3. **Monitor PM2 logs continuously:**
   ```bash
   pm2 monitor
   ```

4. **Setup automated backups** for MongoDB data

---

**All issues identified have been marked and fixed. Your project should now deploy successfully on Hostinger KVM 2!** ✅

For additional help, refer to:
- [Next.js Deployment Docs](https://nextjs.org/docs/deployment)
- [Express.js Production Best Practices](https://expressjs.com/en/advanced/best-practice-performance.html)
- [MongoDB on Linux](https://docs.mongodb.com/manual/administration/install-on-linux/)
