# Deploy Backend to Render (3 minutes)

## What You Need
- Render account (free)
- MongoDB connection string from earlier: `mongodb+srv://chatapp_user:Sefko1974.@cluster0.ww37xid.mongodb.net/chatapp`

## Step 1: Go to Render
https://render.com

## Step 2: If you already have "chat-app-backend" service
1. Click on it
2. Click "Redeploy" button (top right)
3. Select "Clear build cache and redeploy"
4. Wait for build to finish
5. When it says "Live" in green, copy the URL at the top (e.g., `https://chat-app-backend-xxxx.onrender.com`)
6. **Important**: This is your backend URL - you'll need it for Vercel!

## Step 3: If you don't have a service yet
1. Click "New +"
2. Click "Web Service"
3. Connect your GitHub repo "RGKUNKRA/chat-app"
4. Fill in:
   - **Name**: `chat-app-backend`
   - **Root Directory**: `.` (root)
   - **Build Command**: Leave blank (will use render.yaml)
   - **Start Command**: Leave blank (will use render.yaml)
5. Click "Advanced" section
6. Add these Environment Variables:
   - `NODE_ENV` = `production`
   - `MONGODB_URI` = `mongodb+srv://chatapp_user:Sefko1974.@cluster0.ww37xid.mongodb.net/chatapp`
   - `JWT_SECRET` = (type something random, like `MySecureKey123!@#`)
   - `PORT` = `5000`
7. Click "Create Web Service"
8. Wait for build and deploy (5-10 minutes)
9. When it shows "Live" in green, copy your service URL

## What to do with the Backend URL
Once your backend is live and you have the URL:
1. Go to Vercel
2. Add environment variable `REACT_APP_API_URL` with this URL
3. Redeploy Vercel
4. Done!

## If deployment fails
Check these:
1. MongoDB URI is correct
2. All environment variables are set
3. Click the "Logs" button to see what went wrong
4. Come back and paste the error
