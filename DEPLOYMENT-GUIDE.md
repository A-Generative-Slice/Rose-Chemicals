# Rose Chemicals - Deployment Guide

## Frontend Deployment (Vercel)

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Deploy to Vercel:**
   - Go to vercel.com
   - Import from GitHub
   - Select Rose-Chemicals repo
   - Add environment variables:
     ```
     NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app/api
     NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key
     ```

## Backend Deployment (Railway)

1. **Create railway.json:**
   ```json
   {
     "$schema": "https://railway.app/railway.schema.json",
     "build": {
       "builder": "NIXPACKS"
     },
     "deploy": {
       "startCommand": "npm run start",
       "healthcheckPath": "/api/health"
     }
   }
   ```

2. **Update package.json scripts:**
   ```json
   {
     "scripts": {
       "start": "node server.js",
       "build": "npm install"
     }
   }
   ```

3. **Environment Variables (Railway):**
   ```
   NODE_ENV=production
   MONGODB_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_jwt_secret_key
   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_secret
   ```

## Database Setup (MongoDB Atlas)

1. Create account at mongodb.com/atlas
2. Create free cluster
3. Add database user
4. Whitelist IP: 0.0.0.0/0 (all IPs)
5. Get connection string
6. Replace in backend environment

## Domain Setup

1. Purchase domain from:
   - Namecheap (~₹800/year)
   - GoDaddy (~₹1000/year)
   - Google Domains (~₹1200/year)

2. Configure DNS in Vercel:
   - Add domain in Vercel dashboard
   - Update nameservers at registrar
   - SSL automatic

## Cost Optimization Tips

- Start with free tiers
- Monitor usage
- Scale up as needed
- Use CDN for images (Cloudinary free tier)

## Security Checklist

- ✅ Environment variables secured
- ✅ CORS configured properly
- ✅ Rate limiting enabled
- ✅ Input validation
- ✅ HTTPS enforced
- ✅ JWT expiration set
