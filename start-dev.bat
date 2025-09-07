@echo off
echo 🌹 Starting Rose Chemicals E-commerce Platform...

echo 📦 Installing dependencies...
call npm install
cd backend
call npm install
cd ..

echo 🌱 Seeding database with sample data...
cd backend
call node seed.js
cd ..

echo 🚀 Starting servers...
echo Frontend will be available at: http://localhost:3001
echo Backend API will be available at: http://localhost:5000
echo.
echo 🔐 Admin login credentials:
echo Email: admin@example.com
echo Password: admin123
echo.

REM Install concurrently if not exists
call npm list concurrently >nul 2>&1 || call npm install concurrently

REM Start both servers concurrently
call npx concurrently "npm run dev" "cd backend && npm run dev" --names "FRONTEND,BACKEND" --prefix-colors "cyan,yellow"

pause
