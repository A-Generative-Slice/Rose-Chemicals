---
description: How to deploy and update the application on a VPS
---

### Initial Deployment on VPS
1. **SSH into the server**:
   ```bash
   ssh root@your_vps_ip
   ```
2. **Setup the environment**:
   ```bash
   git clone https://github.com/A-Generative-Slice/Rose-Chemicals.git
   cd Rose-Chemicals
   chmod +x setup-vps.sh
   sudo ./setup-vps.sh
   ```
3. **Configure secrets**:
   ```bash
   nano backend/.env  # Update MONGO_URI, JWT_SECRET, etc.
   nano .env          # Update NEXT_PUBLIC_API_URL
   # Add WhatsApp credentials to backend/.env:
   # WHATSAPP_VERIFY_TOKEN=...
   # WHATSAPP_ACCESS_TOKEN=...
   # WHATSAPP_PHONE_NUMBER_ID=...
   ```
4. **Launch**:
   ```bash
   chmod +x start-production.sh
   ./start-production.sh
   ```

### Updating the Live App
1. **Pull latest changes**:
   ```bash
   git pull origin main
   ```
2. **Rebuild and restart**:
   ```bash
   npm run build
   pm2 restart all
   ```

### Monitoring
- **View logs**: `pm2 logs`
- **Dashboard**: `pm2 monit`
- **Process List**: `pm2 list`
