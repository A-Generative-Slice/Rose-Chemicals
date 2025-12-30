# VPS Direct Deployment (No GitHub)

**Strategy:** Upload only fixed files directly to VPS via SCP, rebuild, and test.

---

## 📝 Files to Upload (Fixed Locally)

1. `src/services/api.js` — **Fixed API URL configuration**
2. `backend/seed.js` — **Fixed product image format**

---

## 🚀 Upload Commands (Run from Local Mac Terminal)

```bash
# SSH into VPS first
ssh root@72.60.218.57

# Then from YOUR LOCAL MAC (new terminal):
# Replace the files on VPS

# 1. Upload fixed api.js
scp /Users/smdhussain/Desktop/projects/Rose-Chemicals-main/src/services/api.js root@72.60.218.57:/root/Rose-Chemicals/src/services/api.js

# 2. Upload fixed seed.js
scp /Users/smdhussain/Desktop/projects/Rose-Chemicals-main/backend/seed.js root@72.60.218.57:/root/Rose-Chemicals/backend/seed.js
```

---

## 🔄 Rebuild on VPS (After Upload)

**On VPS Terminal:**

```bash
# Navigate to project
cd /root/Rose-Chemicals

# Rebuild frontend with new API config
npm run build

# Reload pm2 to pick up changes
pm2 reload ecosystem.config.js

# Check logs
pm2 logs rose-frontend --lines 50
```

---

## ✅ Test on Production Domain

```bash
# Homepage
curl -s https://rosechemical.in | head -n 50

# Register endpoint
curl -s -X POST https://rosechemical.in/api/auth/register \
  -H 'Content-Type: application/json' \
  -d '{"name":"Test","email":"test@test.com","password":"Test123"}'

# Health check
curl -s https://rosechemical.in/api/health
```

---

## ⚠️ Why NOT Git?

- ✅ VPS stays controlled (only specific files uploaded)
- ✅ No environment variable conflicts
- ✅ No git pull surprises
- ✅ Faster deployment
- ✅ Production secrets stay on VPS (never in GitHub)

---

## 📊 Current Status

| Component | Status | Note |
|-----------|--------|------|
| **VPS** | ✅ Running | Domain live |
| **Backend API** | ✅ Working | Products endpoint: 63 items seeded |
| **Frontend** | ⏳ Rebuilding | New API URL config pending |
| **Register Page** | ⏳ Fixed | API URL now correct |
| **Homepage Products** | ⏳ Fixed | Seed.js now correct format |

---

## 🔐 Important: Secrets Management

**On VPS ONLY (NOT in GitHub):**
- `MONGO_URI` in `/root/Rose-Chemicals/ecosystem.config.js` ✅
- `JWT_SECRET` in `/root/Rose-Chemicals/ecosystem.config.js` ✅

**Never commit to GitHub:**
- `.env.production.local`
- `ecosystem.config.js` (with secrets)
- Any file with credentials

---

## ❓ Questions?

If upload fails, check:
1. VPS is accessible: `ssh root@72.60.218.57`
2. Path is correct: `ls /root/Rose-Chemicals/src/services/`
3. File permissions: `chmod 644 /root/Rose-Chemicals/src/services/api.js`
