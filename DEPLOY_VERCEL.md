# Deploy to Vercel (2 minutes)

## Step 1: Go to Vercel
https://vercel.com

## Step 2: If you see your "chat-app-five-iota" project
1. Click on it
2. Click "Settings"
3. Go to "Environment Variables"
4. Add this variable:
   - **Name**: `REACT_APP_API_URL`
   - **Value**: (we'll get this from Render - leave empty for now)
5. Click "Add"
6. Click the "Deployments" tab
7. Click "Redeploy" on the latest deployment
8. Wait for it to finish (should say "Ready")

## Step 3: If you DON'T see your project
1. Click "Add New..."
2. Click "Project"
3. Find "RGKUNKRA/chat-app" in the list
4. Click "Import"
5. It should auto-fill the settings
6. Click "Environment Variables"
7. Add:
   - **Name**: `REACT_APP_API_URL`
   - **Value**: `https://your-render-backend-url.onrender.com` (we'll get this)
8. Click "Deploy"
9. Wait for green "Ready" status

## Step 4: Update Environment Variable (after Render deploys)
Once your backend is running on Render:
1. Go back to Vercel project "Settings"
2. Go to "Environment Variables"
3. Edit `REACT_APP_API_URL`
4. Set it to your Render backend URL (e.g., `https://chat-app-backend-xxxx.onrender.com`)
5. Click "Save"
6. Go to "Deployments" and click "Redeploy latest"

That's it! Your app will be live.
