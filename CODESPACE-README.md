# Rose Chemicals - Combined Frontend & Backend Testing

This branch combines both frontend and backend for easy testing in Codespaces.

## Quick Start for Codespaces

### 1. Install Dependencies
```bash
npm run install:all
```

### 2. Update API URL for Codespaces (Important!)
Edit `.env.local` and replace the URL with your actual Codespace URL:
```
NEXT_PUBLIC_API_URL=https://your-codespace-name-5000.app.github.dev/api
```

### 3. Start Both Servers
```bash
npm run dev:all
```

This will start:
- Backend on port 5000
- Frontend on port 3001

### 4. Access Your Application
- Frontend: Check the "Ports" tab for port 3001
- Backend API: Check the "Ports" tab for port 5000

## Manual Setup (Alternative)

### Start Backend Only
```bash
npm run backend
```

### Start Frontend Only  
```bash
npm run frontend
```

## Important Notes for Codespaces

1. **Always update the API URL** in `.env.local` with your Codespace URL
2. **Use the Ports tab** to access your running applications
3. The backend uses **in-memory MongoDB** so data won't persist between restarts
4. Frontend runs on port **3001** to avoid conflicts

## Troubleshooting

- If you get "npm not found", restart your Codespace
- If backend crashes, check that the API URL in `.env.local` is correct
- If frontend can't connect to backend, verify both are running and URLs match

## Project Structure
```
/
├── app/          # Next.js frontend pages
├── components/   # React components  
├── backend/      # Express.js backend
├── public/       # Static assets
└── .env.local    # Frontend environment variables
```
