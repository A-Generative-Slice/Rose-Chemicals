# 🚀 Rose Chemicals — VPS Deployment Checklist

## ✅ Automatically Fixed Issues

- [x] **ProfileSettingsSection.tsx** — Fixed import paths for AuthContext and authAPI
- [x] **OrdersSection.tsx** — Fixed ordersAPI import path  
- [x] **WishlistSection.tsx** — Fixed wishlistAPI and cartAPI import paths
- [x] **ReviewsSection.tsx** — Fixed reviewsAPI import path
- [x] **AddressBookSection.tsx** — Fixed addressAPI import path
- [x] **app/dashboard/page.tsx** — Fixed AuthContext import (context → contexts)

---

## 📝 Manual Fixes Required

### 1. Update Backend Dev Script ⚠️ IMPORTANT

**File:** `backend/package.json` (Line 6)

**Change:**
```json
"dev": "node server.js"
```

**To:**
```json
"dev": "nodemon server.js"
```

**Why:** Enables hot-reload during development, saves time on VPS.

---

### 2. Create Environment Files

**Create `.env.local` in project root:**
```bash
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_key_here
NEXT_PUBLIC_IMAGE_DOMAIN=localhost
```

**Create `backend/.env` in backend folder:**
```bash
MONGO_URI=mongodb://localhost:27017/rose-chemicals
JWT_SECRET=your_32_character_secret_key_here
PORT=5000
NODE_ENV=production
```

See **VPS_ERRORS_FIXED.md** for full env template.

---

### 3. Test Locally First

```bash
# Install all dependencies
npm run install:all

# Run both services
npm run dev:all
```

Expected output:
- Frontend running on: `http://localhost:3001`
- Backend running on: `http://localhost:5000`

---

### 4. Deploy to Hostinger VPS

Follow these steps from **VPS_ERRORS_FIXED.md**:

1. **Connect to VPS:** `ssh root@your_vps_ip`
2. **Install dependencies:** Node.js, MongoDB, Nginx, PM2
3. **Clone repository:** `git clone ...`
4. **Install project deps:** `npm run install:all`
5. **Setup env files:** Both `.env.local` and `backend/.env`
6. **Build frontend:** `npm run build`
7. **Start services:** `pm2 start ecosystem.config.js`
8. **Configure Nginx:** Point your domain to localhost:3000 and localhost:5000
9. **Setup SSL:** `certbot` for Let's Encrypt

---

## 🧪 Testing Checklist

After deploying to VPS, verify:

- [ ] Frontend loads at `https://your-domain.com`
- [ ] Login/Register page is accessible
- [ ] Can browse products
- [ ] Cart functionality works
- [ ] Can place orders
- [ ] Backend API responds at `/api/products`
- [ ] Payment gateway (Razorpay) integration works
- [ ] Admin panel accessible at `/admin`
- [ ] Database connection working (check logs: `pm2 logs`)
- [ ] Images loading correctly
- [ ] SSL certificate valid (green lock in browser)

---

## 📞 Common Issues & Quick Fixes

| Issue | Solution |
|-------|----------|
| Module not found errors | Check import paths in fixed files ✅ |
| `Cannot find context` | Run `npm run install:all` to reinstall |
| Backend not responding | Check: `pm2 logs rose-backend` |
| Blank page on frontend | Check browser console: F12 → Console tab |
| 502 Bad Gateway | Nginx not configured properly, verify `/etc/nginx/sites-available/rose-chemicals` |
| Database connection error | Ensure MongoDB running: `systemctl start mongodb` |
| Port already in use | Change port in `.env` or kill process: `lsof -i :5000` |

---

## 📚 Files Modified

**All fixes applied to:**
1. `src/components/dashboard/ProfileSettingsSection.tsx`
2. `src/components/dashboard/OrdersSection.tsx`
3. `src/components/dashboard/WishlistSection.tsx`
4. `src/components/dashboard/ReviewsSection.tsx`
5. `src/components/dashboard/AddressBookSection.tsx`
6. `app/dashboard/page.tsx`

**Original errors:** Import path redundancy (`../../src/services` instead of `../../services`) and folder naming mismatch (`context` vs `contexts`).

---

## 📖 Documentation Files Created

- `VPS_ERRORS_FIXED.md` — Comprehensive error report and deployment guide
- `VPS_DEPLOYMENT_CHECKLIST.md` — This file (quick reference)

---

**Next Action:** Update `backend/package.json` dev script, create `.env` files, then follow VPS deployment steps in **VPS_ERRORS_FIXED.md**.

Good luck! 🚀
