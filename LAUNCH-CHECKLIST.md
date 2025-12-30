# 🚀 Rose Chemicals - Launch Checklist

Follow these steps to ensure a professional and secure commercial launch on your VPS.

## 1. Server Environment
- [ ] **Node.js**: Version 18+ installed (`node -v`).
- [ ] **MongoDB**: Running locally or Atlas URI verified.
- [ ] **Nginx**: Installed and running (`sudo systemctl status nginx`).
- [ ] **PM2**: Installed globally (`sudo npm install -g pm2`).

## 2. Security & Secrets
- [ ] **Environment Variables**: `backend/.env` updated with:
    - [ ] Production `MONGO_URI`.
    - [ ] Secure `JWT_SECRET` (generate a unique 32-char string).
    - [ ] Real `RAZORPAY_KEY_ID` and `SECRET`.
    - [ ] Real SMTP credentials for email notifications.
- [ ] **Firewall**: Ports 80, 443, and 22 (SSH) open; 5001/3001 closed to public.
- [ ] **SSL**: Certificate obtained via Let's Encrypt (`certbot`).

## 3. Deployment Steps
1. **Build**: `npm run build` (Wait for success).
2. **Start**: `./start-production.sh`.
3. **Nginx**: 
   - `sudo cp nginx.conf.example /etc/nginx/sites-available/rosechemicals`
   - Edit to replace `your-domain.com` with your actual domain.
   - `sudo ln -s /etc/nginx/sites-available/rosechemicals /etc/nginx/sites-enabled/`
   - `sudo nginx -t && sudo systemctl reload nginx`

## 4. Final Verification
- [ ] **SSL**: Site reachable via `https://`.
- [ ] **Orders**: Test a small transaction with Razorpay.
- [ ] **Admin**: Login and verify dashboard analytics load.
- [ ] **Images**: Verify product images display correctly (S3/Local).

> [!TIP]
> Use `pm2 monit` to watch your apps in real-time.
