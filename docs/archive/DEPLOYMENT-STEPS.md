# Rose Chemicals - VPS Deployment Steps

## 🎯 Quick Deployment Guide for Hostinger VPS

**VPS Details:**
- IP: 72.60.218.57
- Domain: rosechemical.in
- OS: Ubuntu 22.04 LTS
- SSH: `ssh root@72.60.218.57`

---

## 📦 Method 1: Automated Deployment (Recommended)

### Step 1: Transfer Files to VPS

From your Windows machine, use one of these methods:

**Option A: Using Git (Best)**
```bash
# SSH into VPS
ssh root@72.60.218.57

# Clone repository
cd /var/www
git clone https://github.com/A-Generative-Slice/Rose-Chemicals.git rose-chemicals
cd rose-chemicals

# Run deployment script
chmod +x deploy-to-vps.sh
./deploy-to-vps.sh
```

**Option B: Using SCP**
```powershell
# From Windows PowerShell (in project directory)
scp -r . root@72.60.218.57:/var/www/rose-chemicals
```

**Option C: Using FileZilla/WinSCP**
- Connect to: 72.60.218.57
- Upload entire project to: /var/www/rose-chemicals

### Step 2: Run Deployment Script

```bash
# SSH into VPS
ssh root@72.60.218.57

# Navigate to project
cd /var/www/rose-chemicals

# Make script executable and run
chmod +x deploy-to-vps.sh
./deploy-to-vps.sh
```

The script will automatically:
- ✅ Install Node.js, MongoDB, nginx, PM2
- ✅ Install all dependencies
- ✅ Create environment files
- ✅ Build the Next.js application
- ✅ Configure nginx reverse proxy
- ✅ Start applications with PM2

---

## 🔧 Method 2: Manual Deployment

If the automated script has issues, follow these manual steps:

### 1. Install Required Software

```bash
# Update system
sudo apt-get update && sudo apt-get upgrade -y

# Install Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install MongoDB
sudo apt-get install -y mongodb
sudo systemctl start mongodb
sudo systemctl enable mongodb

# Install nginx
sudo apt-get install -y nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# Install PM2
sudo npm install -g pm2
```

### 2. Setup Application

```bash
# Create app directory
sudo mkdir -p /var/www/rose-chemicals
sudo chown -R $USER:$USER /var/www/rose-chemicals

# Clone repository
cd /var/www
git clone https://github.com/A-Generative-Slice/Rose-Chemicals.git rose-chemicals
cd rose-chemicals

# Install dependencies
npm install
cd backend && npm install && cd ..
```

### 3. Configure Environment Variables

**Frontend (.env):**
```bash
cat > .env << EOF
NEXT_PUBLIC_API_URL=https://rosechemical.in/api
EOF
```

**Backend (backend/.env):**
```bash
cat > backend/.env << EOF
MONGO_URI=mongodb://localhost:27017/rose-chemicals
JWT_SECRET=$(openssl rand -base64 32)
JWT_EXPIRE=7d
NODE_ENV=production
PORT=5000
RAZORPAY_KEY_ID=your_key_here
RAZORPAY_KEY_SECRET=your_secret_here
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads
ADMIN_EMAIL=admin@rosechemicals.com
ADMIN_PASSWORD=Admin@123
EOF
```

### 4. Build Application

```bash
npm run build
```

### 5. Configure nginx

```bash
sudo nano /etc/nginx/sites-available/rose-chemicals
```

Paste this configuration:

```nginx
upstream backend {
    server 127.0.0.1:5000;
}

upstream frontend {
    server 127.0.0.1:3000;
}

server {
    listen 80;
    server_name rosechemical.in www.rosechemical.in;
    client_max_body_size 10M;

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

    location / {
        proxy_pass http://frontend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/rose-chemicals /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx
```

### 6. Start with PM2

```bash
cd /var/www/rose-chemicals
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup
```

---

## 🔒 SSL Setup (HTTPS)

```bash
# Install Certbot
sudo apt-get install -y certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d rosechemical.in -d www.rosechemical.in

# Auto-renewal is automatic, but you can test:
sudo certbot renew --dry-run
```

---

## 🎛️ Management Commands

### PM2 Commands
```bash
pm2 status              # Check status
pm2 logs                # View logs
pm2 logs rose-backend   # Backend logs only
pm2 logs rose-frontend  # Frontend logs only
pm2 restart all         # Restart all
pm2 stop all            # Stop all
pm2 delete all          # Delete all processes
pm2 monit               # Monitor resources
```

### nginx Commands
```bash
sudo systemctl status nginx    # Check status
sudo systemctl restart nginx   # Restart
sudo nginx -t                  # Test configuration
sudo systemctl reload nginx    # Reload config
```

### MongoDB Commands
```bash
sudo systemctl status mongodb  # Check status
sudo systemctl restart mongodb # Restart
mongosh                        # Connect to database
```

### Application Updates
```bash
cd /var/www/rose-chemicals
git pull origin main
npm install
cd backend && npm install && cd ..
npm run build
pm2 restart all
```

---

## 🐛 Troubleshooting

### Application not starting
```bash
# Check logs
pm2 logs

# Check if ports are free
sudo lsof -i :3000
sudo lsof -i :5000

# Restart services
pm2 restart all
```

### nginx errors
```bash
# Check nginx logs
sudo tail -f /var/log/nginx/error.log

# Test configuration
sudo nginx -t

# Restart nginx
sudo systemctl restart nginx
```

### Database connection issues
```bash
# Check MongoDB status
sudo systemctl status mongodb

# Check if MongoDB is listening
sudo netstat -plnt | grep 27017

# Restart MongoDB
sudo systemctl restart mongodb
```

### Port already in use
```bash
# Find process using port 3000
sudo lsof -i :3000
# Kill process
sudo kill -9 <PID>

# Or kill all node processes
pm2 delete all
```

---

## ✅ Post-Deployment Checklist

- [ ] Application accessible at http://rosechemical.in
- [ ] API responding at http://rosechemical.in/api
- [ ] SSL certificate installed (https://)
- [ ] Razorpay keys configured
- [ ] MongoDB running and accessible
- [ ] PM2 processes running
- [ ] nginx serving correctly
- [ ] Test product browsing
- [ ] Test cart functionality
- [ ] Test checkout process
- [ ] Admin panel accessible

---

## 📞 Support

If you encounter issues:
1. Check PM2 logs: `pm2 logs`
2. Check nginx logs: `sudo tail -f /var/log/nginx/error.log`
3. Check MongoDB: `sudo systemctl status mongodb`
4. Verify DNS: Your domain DNS A records should point to 72.60.218.57

---

## 🚀 Your Site URLs

- **Frontend:** https://rosechemical.in
- **API:** https://rosechemical.in/api
- **Admin:** https://rosechemical.in/admin
- **Health Check:** https://rosechemical.in/api/health

---

**Deployment Script Created:** deploy-to-vps.sh
**Last Updated:** November 2025
