#!/bin/bash

echo "🚀 Setting up Rose Chemicals Development Environment..."

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
npm install

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install

# Start backend server in background
echo "🔧 Starting backend server..."
npm run dev &

# Wait a moment for backend to start
sleep 5

# Seed the database
echo "🌱 Seeding database with sample data..."
node seed.js

# Go back to root and start frontend
cd ..
echo "🎨 Starting frontend server..."
npm run dev

echo "✅ Setup complete!"
echo "🌐 Frontend: http://localhost:3001"
echo "🔌 Backend: http://localhost:5000"
echo "👤 Admin: admin@rosechemicals.com / Admin@123"
