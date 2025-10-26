# 🚀 Quick Deployment Checklist

## Pre-Deployment (Local Machine)

- [ ] Code is committed to git
- [ ] All tests pass locally
- [ ] Environment variables documented

## VPS Deployment (Step by Step)

### 1. Initial Setup
```bash
# SSH into VPS
ssh root@your-vps-ip

# Clone repository
cd /home
git clone https://github.com/your-username/Rose-Chemicals-main.git rose-chemicals
cd rose-chemicals

# Run automated setup
chmod +x setup-vps.sh
sudo ./setup-vps.sh

# When complete, exit and SSH back in
exit
ssh root@your-vps-ip
cd /home/rose-chemicals
```

### 2. Configure Application
```bash
# Frontend configuration
nano .env
# Change: NEXT_PUBLIC_API_URL=https://your-domain.com/api

# Backend configuration
cd backend
nano .env
# Update these required fields:
# - MONGO_URI (if not local MongoDB)
# - JWT_SECRET (change to strong secret)
# - RAZORPAY_KEY_ID
# - RAZORPAY_KEY_SECRET
# - ADMIN_PASSWORD
cd ..
```

### 3. Setup Domain & DNS
- [ ] Go to domain registrar (Hostinger)
- [ ] Find DNS settings
- [ ] Add A record: `@` pointing to `72.60.218.57`
- [ ] Wait 15-30 minutes for DNS to propagate
- [ ] Verify: `nslookup your-domain.com`

### 4. Setup SSL Certificate
```bash
sudo certbot certonly --nginx -d your-domain.com -d www.your-domain.com
# Follow prompts, agree to terms
# Certificate saved to: /etc/letsencrypt/live/your-domain.com/
```

### 5. Configure Nginx
```bash
# Copy config
sudo cp nginx.conf.example /etc/nginx/sites-available/rosechemicals

# Edit and replace "your-domain.com" with actual domain
sudo nano /etc/nginx/sites-available/rosechemicals

# Check these lines have correct domain:
# - server_name your-domain.com www.your-domain.com;
# - ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
# - ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

# Enable site
sudo ln -s /etc/nginx/sites-available/rosechemicals /etc/nginx/sites-enabled/rosechemicals

# Remove default
sudo rm /etc/nginx/sites-enabled/default

# Test
sudo nginx -t

# Reload
sudo systemctl reload nginx
```

### 6. Start Application
```bash
# Make script executable
chmod +x start-production.sh

# Start with PM2
./start-production.sh

# Or manually
npm install -g pm2
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup
```

### 7. Verify Everything Works
```bash
# Check processes
pm2 status

# View logs
pm2 logs

# Test API locally
curl http://localhost:5000/health

# Test frontend
curl http://localhost:3001

# Test via domain
curl https://your-domain.com/api/products
```

## Post-Deployment

- [ ] Test all major features (browse products, add to cart, checkout)
- [ ] Verify SSL certificate (should show 🔒 in browser)
- [ ] Test admin login
- [ ] Setup monitoring
- [ ] Setup backup for MongoDB
- [ ] Setup SSL auto-renewal (should be automatic)
- [ ] Document any custom changes
- [ ] Setup email alerts for errors

## Monitoring & Maintenance

### Daily Checks
```bash
pm2 status          # Check all processes running
pm2 logs           # Check for errors
curl https://your-domain.com/api/products  # Test API
```

### Weekly Checks
```bash
df -h              # Check disk space
free -h            # Check memory
pm2 logs --lines 100 --nostream | tail -20  # Check recent logs
```

### Monthly Tasks
```bash
npm update         # Update dependencies
cd backend && npm update && cd ..
pm2 restart all    # Restart processes
sudo certbot renew # Check certificate renewal
mongodbdump        # Backup database (if local MongoDB)
```

## Emergency Commands

```bash
# Stop all processes
pm2 stop all

# Restart all processes
pm2 restart all

# View error logs
pm2 logs --err

# Tail specific app logs
pm2 logs rose-backend
pm2 logs rose-frontend

# Reload nginx
sudo systemctl reload nginx

# Check nginx errors
sudo nginx -t
sudo tail -f /var/log/nginx/error.log

# Restart backend service
pm2 restart rose-backend

# Restart frontend service
pm2 restart rose-frontend

# Check port usage
sudo lsof -i :5000
sudo lsof -i :3001
sudo lsof -i :80
sudo lsof -i :443
```

## Troubleshooting

### "Connection refused on port 5000"
```bash
# Check if backend is running
pm2 status

# Check if port is in use
sudo lsof -i :5000

# Restart backend
pm2 restart rose-backend

# Check logs
pm2 logs rose-backend
```

### "Cannot reach API"
```bash
# Test locally
curl http://localhost:5000/api/products

# Check nginx config
sudo nginx -t

# Check if nginx is running
sudo systemctl status nginx

# Reload nginx
sudo systemctl reload nginx
```

### "SSL certificate error"
```bash
# Check certificate
sudo certbot certificates

# Verify paths in nginx config match certificate location

# Renew manually
sudo certbot renew --force-renewal

# Reload nginx
sudo systemctl reload nginx
```

### "MongoDB connection error"
```bash
# Check if MongoDB is running
sudo systemctl status mongodb

# Start MongoDB
sudo systemctl start mongodb

# Check connection string in backend/.env
cat backend/.env | grep MONGO_URI

# Test connection
mongosh
```

## Files Reference

| File | Purpose |
|------|---------|
| `setup-vps.sh` | Automated VPS setup |
| `start-production.sh` | Start application with PM2 |
| `ecosystem.config.js` | PM2 configuration |
| `nginx.conf.example` | Nginx configuration |
| `.env.example` | Frontend env template |
| `backend/.env.example` | Backend env template |
| `VPS-DEPLOYMENT-GUIDE.md` | Detailed deployment guide |
| `README-PRODUCTION.md` | Production instructions |
| `CLEANUP-SUMMARY.md` | What was cleaned and fixed |

## Support

For detailed help, see:
- **Deployment Issues:** `VPS-DEPLOYMENT-GUIDE.md` → Troubleshooting section
- **Configuration:** `README-PRODUCTION.md` → Configuration section
- **Setup Details:** `CLEANUP-SUMMARY.md` → For what was done

---

**🎯 Goal:** From cloned repo to live website in ~30 minutes!

**Time Estimate:**
- VPS Setup: 5 minutes
- App Setup: 3 minutes
- Domain DNS: 30 minutes (waiting)
- SSL Setup: 2 minutes
- Nginx Config: 3 minutes
- Start App: 1 minute
- Test: 5 minutes

**Total: ~30-45 minutes** ✅

---

**Last Updated:** October 26, 2025  
**Version:** 1.0.0
