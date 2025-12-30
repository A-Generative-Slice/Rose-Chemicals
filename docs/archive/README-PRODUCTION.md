# 🌹 Rose Chemicals E-Commerce Platform

A full-stack e-commerce platform for Rose Chemicals built with Next.js (Frontend) and Node.js/Express (Backend).

## 📱 Features

- **Modern Frontend**: Next.js 14 with TypeScript and Tailwind CSS
- **Robust Backend**: Express.js with MongoDB
- **User Management**: Authentication, profiles, addresses
- **Product Catalog**: Categories, search, filters
- **Shopping Cart**: Real-time cart management
- **Orders**: Order creation and tracking
- **Payments**: Razorpay integration
- **Admin Panel**: Product, order, user management
- **Reviews & Ratings**: Product review system
- **Wishlist**: Save favorite products
- **VPS Ready**: Complete deployment guide included

## 🚀 Quick Start

### Development (Local Machine)

```bash
# Install dependencies
npm install
cd backend && npm install && cd ..

# Setup environment
cp .env.example .env
cp backend/.env.example backend/.env

# Start both servers
npm run dev:all
```

Access:
- Frontend: http://localhost:3001
- Backend: http://localhost:5000/api

### Production (VPS Deployment)

**See [VPS-DEPLOYMENT-GUIDE.md](./VPS-DEPLOYMENT-GUIDE.md) for complete instructions**

Quick summary:
```bash
# 1. Run setup script
sudo ./setup-vps.sh

# 2. Configure environment
cp .env.example .env
cp backend/.env.example backend/.env
# Edit .env and backend/.env with your values

# 3. Setup domain and SSL
sudo certbot certonly --nginx -d your-domain.com

# 4. Configure nginx
sudo cp nginx.conf.example /etc/nginx/sites-available/rosechemicals
# Edit to add your domain

# 5. Install and start with PM2
npm install -g pm2
pm2 start ecosystem.config.js --env production
```

## 📁 Project Structure

```
rose-chemicals/
├── app/                  # Next.js app directory (frontend pages)
├── components/           # React components
├── src/
│   ├── components/      # Additional components
│   ├── contexts/        # React contexts (Auth, Cart)
│   ├── services/        # API services
│   └── utils/           # Utilities
├── backend/             # Express.js backend
│   ├── controllers/     # Route controllers
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   ├── middleware/      # Express middleware
│   ├── config/          # Configuration files
│   └── server.js        # Entry point
├── public/              # Static assets
├── setup-vps.sh        # VPS setup script
├── ecosystem.config.js # PM2 configuration
└── VPS-DEPLOYMENT-GUIDE.md # Deployment instructions
```

## 🔧 Configuration

### Environment Variables

**Frontend (`.env`):**
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

**Backend (`backend/.env`):**
```
MONGO_URI=mongodb://localhost:27017/rose-chemicals
JWT_SECRET=your_secret_key
NODE_ENV=development
PORT=5000
RAZORPAY_KEY_ID=your_key
RAZORPAY_KEY_SECRET=your_secret
```

See `.env.example` and `backend/.env.example` for all options.

## 🗄️ Database

### Local MongoDB
```bash
# MongoDB is installed by setup-vps.sh
# Start MongoDB
sudo systemctl start mongodb

# Verify connection
mongosh
```

### MongoDB Atlas (Cloud - Recommended for Production)
1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Get connection string
4. Update `MONGO_URI` in `backend/.env`

## 🔐 Security

- JWT authentication for API endpoints
- Password hashing with bcryptjs
- CORS configuration
- SSL/TLS encryption
- Helmet.js security headers
- Input validation with express-validator

## 🛠️ Available Scripts

### Frontend
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run linter
```

### Backend
```bash
cd backend
npm run dev          # Start with nodemon (development)
npm run start        # Start production server
```

### Full Stack
```bash
npm run dev:all      # Start both frontend and backend
npm run install:all  # Install dependencies for both
```

## 🐛 Bug Fixes Applied

This repository has been optimized for VPS deployment with the following fixes:

- ✅ Fixed port inconsistencies (backend 5000, frontend 3001)
- ✅ Removed hardcoded localhost URLs
- ✅ Removed hardcoded admin tokens
- ✅ Fixed API URL configuration
- ✅ Cleaned unnecessary files (reduced size)
- ✅ Added production environment configurations
- ✅ Updated .gitignore for lean repository

## 📦 Dependencies

### Frontend
- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Razorpay SDK

### Backend
- Express.js
- MongoDB/Mongoose
- JWT for authentication
- Multer for file uploads
- Razorpay SDK
- AWS S3 support (optional)

## 🚀 Deployment

### VPS Requirements
- Ubuntu 22.04 LTS
- Node.js 18+
- MongoDB 5+
- nginx
- 2GB RAM minimum

### Deployment Steps
1. Follow [VPS-DEPLOYMENT-GUIDE.md](./VPS-DEPLOYMENT-GUIDE.md)
2. Configure domain DNS
3. Setup SSL certificate
4. Configure nginx
5. Start with PM2
6. Monitor logs

### Domain Configuration
- Point domain A record to VPS IP
- Setup SSL with Let's Encrypt (automatic with certbot)
- Configure nginx to proxy frontend and backend
- Enable auto-renewal of SSL certificate

## 📝 API Documentation

### Authentication
```
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me
```

### Products
```
GET    /api/products
GET    /api/products/:id
POST   /api/admin/products (admin only)
PATCH  /api/products/:id (admin only)
DELETE /api/products/:id (admin only)
```

### Cart
```
GET    /api/cart
POST   /api/cart/add
PATCH  /api/cart/update
DELETE /api/cart/remove/:productId
DELETE /api/cart/clear
```

### Orders
```
POST   /api/orders
GET    /api/orders/my-orders
GET    /api/orders/:id
PATCH  /api/orders/:id/cancel
```

### Admin
```
GET    /api/admin/analytics
GET    /api/admin/products
GET    /api/admin/orders
GET    /api/admin/users
```

## 🆘 Troubleshooting

### Backend won't start
- Check port 5000 is not in use: `sudo lsof -i :5000`
- Verify MongoDB is running: `sudo systemctl status mongodb`
- Check logs: `tail -f backend/server.log`

### API connection errors
- Verify API URL in `.env`: `NEXT_PUBLIC_API_URL`
- Check backend health: `curl http://localhost:5000/health`
- Verify CORS settings in backend
- Check firewall rules

### SSL certificate issues
- Check certificate: `sudo certbot certificates`
- Renew manually: `sudo certbot renew`
- Verify nginx config: `sudo nginx -t`

## 📚 Additional Resources

- [VPS Deployment Guide](./VPS-DEPLOYMENT-GUIDE.md)
- [Nginx Configuration](./nginx.conf.example)
- [Production Environment Setup](./.env.production.example)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Express Documentation](https://expressjs.com/)

## 📄 License

This project is licensed under the MIT License.

## 👤 Author

Rose Chemicals Team

## 📞 Support

For issues and support:
1. Check [Troubleshooting](#troubleshooting) section
2. Review logs in `/var/log/` on VPS
3. Check [VPS-DEPLOYMENT-GUIDE.md](./VPS-DEPLOYMENT-GUIDE.md)
4. Review API documentation

## ✅ Deployment Checklist

- [ ] Clone repository
- [ ] Run `setup-vps.sh`
- [ ] Configure `.env` files
- [ ] Setup MongoDB (local or Atlas)
- [ ] Configure domain DNS
- [ ] Setup SSL certificate
- [ ] Configure nginx
- [ ] Start with PM2
- [ ] Test all endpoints
- [ ] Setup monitoring
- [ ] Configure backups
- [ ] Document custom changes

---

**Version:** 1.0.0  
**Last Updated:** October 26, 2025  
**Status:** Production Ready for VPS Deployment
