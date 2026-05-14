# Rose Chemicals - VPS Deployment Guide

Complete setup guide for deploying Rose Chemicals e-commerce platform on a VPS with domain configuration.

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [VPS Setup](#vps-setup)
3. [Application Setup](#application-setup)
4. [Database Configuration](#database-configuration)
5. [Domain & SSL Setup](#domain--ssl-setup)
6. [Running the Application](#running-the-application)
7. [Troubleshooting](#troubleshooting)
8. [Bug Fixes Applied](#bug-fixes-applied)

---

## Prerequisites

- Ubuntu 22.04 LTS VPS with at least 2GB RAM, 1 vCPU
- Domain name pointing to your VPS IP
- SSH access to your VPS
- Root or sudo access

### VPS Specs (from your Hostinger account)
- OS: Ubuntu 22.04 LTS
- CPU: 2 cores
- RAM: 8 GB
- Storage: 100 GB
- IP: 72.61.244.121 (update with your actual IP)

---

## VPS Setup

### Step 1: Initial System Setup

SSH into your VPS:
```bash
ssh root@your-vps-ip
```

Run the automated setup script:
```bash
cd /home/rose-chemicals
chmod +x setup-vps.sh
sudo ./setup-vps.sh
```

This script will:
- Update system packages
- Install Node.js 18 and npm
- Install MongoDB
- Install nginx and Certbot
- Install Git
- Setup environment files

### Step 2: Manual Configuration (if script encounters issues)

```bash
# Update system
sudo apt-get update && sudo apt-get upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install MongoDB
sudo apt-get install -y mongodb
sudo systemctl start mongodb
sudo systemctl enable mongodb

# Install nginx
sudo apt-get install -y nginx

# Install Certbot (SSL)
sudo apt-get install -y certbot python3-certbot-nginx
```

---

## Application Setup

### Step 1: Clone and Install Dependencies

```bash
# Clone the repository
cd /home
git clone https://github.com/your-username/Rose-Chemicals-main.git rose-chemicals
cd rose-chemicals

# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

### Step 2: Configure Environment Variables

**Frontend Configuration:**
```bash
# Copy example to actual env file
cp .env.example .env

# Edit with your domain
nano .env
```

Update `.env`:
```
NEXT_PUBLIC_API_URL=https://your-domain.com/api
```

**Backend Configuration:**
```bash
cd backend
cp .env.example .env

# Edit backend config
nano .env
```

Update `backend/.env`:
```
MONGO_URI=mongodb://localhost:27017/rose-chemicals
JWT_SECRET=change_to_a_strong_secret
NODE_ENV=development
PORT=5000
RAZORPAY_KEY_ID=your_key
RAZORPAY_KEY_SECRET=your_secret
ADMIN_EMAIL=admin@rosechemicals.com
ADMIN_PASSWORD=Admin@123
ENABLE_CSV_JOBS=false
```

---

## Database Configuration

### Option 1: Local MongoDB

```bash
# Verify MongoDB is running
sudo systemctl status mongodb

# Connect to MongoDB shell
mongosh

# In MongoDB shell, create database and admin user:
> use rose-chemicals
> db.createCollection('users')
> db.users.insertOne({
  name: 'Admin',
  email: 'admin@rosechemicals.com',
  password: 'hashed_password',
  role: 'admin'
})
```

### Option 2: MongoDB Atlas (Recommended for Production)

1. Create free account at https://www.mongodb.com/cloud/atlas
2. Create a cluster
3. Get connection string: `mongodb+srv://username:password@cluster.mongodb.net/rose-chemicals`
4. Update `backend/.env`:
   ```
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/rose-chemicals
   ```

### Initialize Sample Data

```bash
cd backend
npm run seed  # If seed script is available
# Or manually add products via admin panel after deployment
```

---

## Domain & SSL Setup

### Step 1: Point Domain to VPS IP

In your domain registrar (Hostinger, GoDaddy, etc.):
1. Go to DNS settings
2. Add A record pointing to your VPS IP: `72.61.244.121`
3. Wait 15-30 minutes for DNS to propagate

Check DNS:
```bash
nslookup your-domain.com
```

### Step 2: Setup SSL Certificate

```bash
# Obtain free SSL certificate from Let's Encrypt
sudo certbot certonly --nginx -d your-domain.com -d www.your-domain.com

# Follow prompts and enter email address
```

Certificate will be saved to:
- `/etc/letsencrypt/live/your-domain.com/fullchain.pem`
- `/etc/letsencrypt/live/your-domain.com/privkey.pem`

### Step 3: Configure nginx

```bash
# Copy nginx config
sudo cp nginx.conf.example /etc/nginx/sites-available/rosechemicals

# Edit and update domain name
sudo nano /etc/nginx/sites-available/rosechemicals
# Replace "your-domain.com" with actual domain

# Enable the site
sudo ln -s /etc/nginx/sites-available/rosechemicals /etc/nginx/sites-enabled/rosechemicals

# Remove default site
sudo rm /etc/nginx/sites-enabled/default

# Test configuration
sudo nginx -t

# Reload nginx
sudo systemctl reload nginx
```

### Step 4: Auto-renewal of SSL Certificate

```bash
# Add to crontab
sudo crontab -e

# Add this line:
0 3 * * * certbot renew --nginx --quiet
```

---

## Running the Application

### Option 1: Manual Start (Development)

```bash
cd /home/rose-chemicals

# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
cd /home/rose-chemicals
npm run dev
```

Access:
- Frontend: http://your-domain.com (through nginx proxy)
- Backend API: http://your-domain.com/api

### Option 2: Using Process Manager (Production - Recommended)

Install PM2:
```bash
sudo npm install -g pm2
```

Create PM2 ecosystem config:
```bash
# Create ecosystem.config.js
nano ecosystem.config.js
```

Add:
```javascript
module.exports = {
  apps: [
    {
      name: 'rose-backend',
      script: 'backend/server.js',
      instances: 2,
      env: {
        NODE_ENV: 'production'
      }
    },
    {
      name: 'rose-frontend',
      script: 'npm',
      args: 'run start',
      instances: 1,
      env: {
        NODE_ENV: 'production',
        PORT: 3001
      }
    }
  ]
};
```

Start:
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

Monitor:
```bash
pm2 logs
pm2 status
```

### Option 3: Using Docker (Advanced)

See `Dockerfile` and `docker-compose.yml` in repository (if added).

---

## Troubleshooting

### Backend won't start - Port 5000 already in use

```bash
# Find process using port 5000
sudo lsof -i :5000

# Kill the process
sudo kill -9 <PID>

# Or use different port in .env
PORT=5001
```

### Frontend shows "Cannot reach API"

1. Check backend is running:
   ```bash
   curl http://localhost:5000/health
   ```

2. Check nginx config:
   ```bash
   sudo nginx -t
   sudo systemctl reload nginx
   ```

3. Verify NEXT_PUBLIC_API_URL in .env matches your domain

4. Check firewall:
   ```bash
   sudo ufw allow 80
   sudo ufw allow 443
   sudo ufw allow 5000
   sudo ufw enable
   ```

### MongoDB connection error

```bash
# Verify MongoDB is running
sudo systemctl status mongodb
sudo systemctl start mongodb

# Check logs
tail -f /var/log/mongodb/mongodb.log

# Or if using MongoDB Atlas, verify connection string in .env
```

### SSL certificate error

```bash
# Check certificate
sudo certbot certificates

# Renew manually
sudo certbot renew --force-renewal

# Update nginx config with correct paths
sudo nginx -t
sudo systemctl reload nginx
```

---

## Bug Fixes Applied

This repository has been cleaned and fixed for VPS deployment:

### 🐛 Bugs Fixed

1. **Port Mismatch**
   - ✅ Backend now consistently uses port 5000
   - ✅ Frontend port fixed to 3001
   - ✅ API_URL updated to use correct port

2. **Hardcoded Localhost URLs**
   - ✅ Removed hardcoded localhost:5001 from API service
   - ✅ API_URL now configurable via environment variables
   - ✅ Production-ready NEXT_PUBLIC_API_URL

3. **Hardcoded Admin Tokens**
   - ✅ Removed hardcoded 'admin-token-12345' fallback
   - ✅ Only uses actual JWT tokens from auth

4. **Missing Environment Configuration**
   - ✅ Created .env.example for frontend
   - ✅ Updated backend/.env.example
   - ✅ Created .env.production.example files

5. **Unnecessary Files Removed**
   - ✅ Deleted test-api.js
   - ✅ Removed preview.html, status.html
   - ✅ Deleted start-dev.bat (Windows-only)
   - ✅ Removed all *.log files

6. **Repository Bloat**
   - ✅ Updated .gitignore to exclude node_modules
   - ✅ Removed .devcontainer (not needed for VPS)
   - ✅ Removed .github workflows (use deploy scripts instead)

### 📋 Files Added/Modified

**New Files:**
- `setup-vps.sh` - Automated VPS setup
- `nginx.conf.example` - Domain and SSL configuration
- `.env.production.example` - Production environment template
- `DEPLOYMENT-GUIDE.md` - This file

**Modified Files:**
- `src/services/api.js` - Fixed API URL and removed hardcoded tokens
- `.env.example` - Updated with current configuration
- `backend/.env.example` - Added CSV_JOBS config
- `.gitignore` - Added production files

---

## Security Checklist

- [ ] Change JWT_SECRET to a strong random string
- [ ] Change ADMIN_PASSWORD in production
- [ ] Enable SSL certificate (Let's Encrypt)
- [ ] Configure firewall rules
- [ ] Use MongoDB Atlas for production (not local)
- [ ] Configure Razorpay keys for production
- [ ] Setup email configuration (SMTP)
- [ ] Backup MongoDB regularly
- [ ] Monitor logs and errors
- [ ] Keep Node.js and dependencies updated

---

## Support & Maintenance

### Logs and Monitoring

```bash
# Backend logs
tail -f backend/server.log

# Frontend logs
journalctl -u rose-frontend -f

# nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# MongoDB logs
sudo tail -f /var/log/mongodb/mongodb.log
```

### Updates

```bash
# Update dependencies
cd /home/rose-chemicals
npm update
cd backend
npm update
```

### Backups

```bash
# Backup MongoDB
mongodump --out /backup/rose-chemicals-$(date +%Y%m%d)

# Or with MongoDB Atlas, enable automatic backups
```

---

## Performance Optimization

1. **Enable Gzip compression** (already in nginx config)
2. **Use CDN for static assets** (add to images)
3. **Enable nginx caching** (production nginx config)
4. **Use MongoDB indexes** (add to models)
5. **Implement rate limiting** (use express-ratelimit)

---

## Next Steps

1. ✅ Clone repository
2. ✅ Run setup-vps.sh
3. ✅ Configure environment variables
4. ✅ Setup domain and SSL
5. ✅ Configure MongoDB
6. ✅ Start application with PM2
7. ✅ Monitor logs
8. ✅ Test with your domain
9. ✅ Setup automated backups
10. ✅ Monitor performance

---

## 🌐 Local-Online Testing (Before VPS Deployment)

To test your website's deployment flow "locally but online" on your Ubuntu 22 machine:

### Using localtunnel (Quickest)

1. **Install localtunnel**:
   ```bash
   npm install -g localtunnel
   ```

2. **Run Backend**:
   ```bash
   cd backend
   npm start
   ```

3. **Expose Backend** (in new terminal):
   ```bash
   lt --port 5000 --subdomain rose-backend-test
   ```

4. **Update Frontend .env**:
   Update `NEXT_PUBLIC_API_URL` to the URL provided by localtunnel.

5. **Run Frontend**:
   ```bash
   npm run build
   npm start
   ```

6. **Expose Frontend**:
   ```bash
   lt --port 3001 --subdomain rose-frontend-test
   ```

Now you can share the frontend URL with anyone to test the "live" deployment experience.

---

**Last Updated:** December 23, 2025  
**Version:** 1.1  
**Status:** Cleanup & Production Ready
