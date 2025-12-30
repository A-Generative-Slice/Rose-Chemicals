#!/bin/bash

echo "🌹 Starting Rose Chemicals E-commerce Platform..."

# Install dependencies for both frontend and backend
echo "📦 Installing dependencies..."
npm install
cd backend && npm install && cd ..

# Seed the database
echo "🌱 Seeding database with sample data..."
cd backend && node seed.js && cd ..

# Start both frontend and backend
echo "🚀 Starting servers..."
echo "Frontend will be available at: http://localhost:3001"
echo "Backend API will be available at: http://localhost:5000"
echo ""
echo "🔐 Admin login credentials:"
echo "Email: admin@example.com"
echo "Password: admin123"
echo ""

# Install concurrently if not exists
npm list concurrently || npm install concurrently

# Start both servers concurrently
npx concurrently \
  "npm run dev" \
  "cd backend && npm run dev" \
  --names "FRONTEND,BACKEND" \
  --prefix-colors "cyan,yellow"
