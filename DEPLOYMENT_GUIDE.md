# Deployment & MongoDB Hosting Guide

## Overview

This guide covers:
1. **MongoDB Atlas Setup** - Cloud-hosted MongoDB with monitoring
2. **Server Deployment** - Node.js/Express backend deployment
3. **Client Deployment** - React frontend deployment
4. **Environment Configuration** - Connecting everything together

---

## Part 1: MongoDB Atlas Setup (Cloud Database + Monitoring)

### Step 1: Create MongoDB Atlas Account

1. Go to: https://www.mongodb.com/cloud/atlas
2. Sign up for a free account
3. Create a new project (name: "chat-app")

### Step 2: Create a Free Cluster

1. Click "Create" a new cluster
2. Select **M0 Free Tier** (FREE - perfect for testing)
3. Cloud Provider: AWS
4. Region: Choose closest to your users
5. Cluster Name: `chat-app-cluster`
6. Click "Create Cluster" (wait 2-3 minutes)

### Step 3: Setup Database Access

1. Go to **Security** → **Database Access**
2. Click **"Add New Database User"**
3. Username: `chatapp_admin`
4. Password: Generate secure password (save this!)
5. Database User Privileges: **"Built-in Role: Atlas Admin"**
6. Click **"Add User"**

### Step 4: Setup Network Access

1. Go to **Security** → **Network Access**
2. Click **"Add IP Address"**
3. Select **"Allow Access from Anywhere"** (0.0.0.0/0)
   - ⚠️ For production, restrict to specific IPs only
4. Click **"Confirm"**

### Step 5: Get Connection String

1. Go to **Clusters** → Click **"Connect"** button
2. Choose **"Connect your application"**
3. Select **Node.js** driver
4. Copy the connection string:
   ```
   mongodb+srv://chatapp_admin:<password>@chat-app-cluster.xxxxx.mongodb.net/rg-chat?retryWrites=true&w=majority
   ```
5. Replace `<password>` with your actual password

### Step 6: Enable Monitoring

1. Go to **Monitoring** tab (in left sidebar)
2. View real-time database metrics:
   - Query performance
   - Connection count
   - Storage usage
   - CPU/Memory

For detailed monitoring, upgrade to M2+ cluster (paid).

---

## Part 2: Server Deployment (Backend)

### Option A: Deploy to Render.com (Recommended - FREE + Easy)

#### Step 1: Prepare Server for Deployment

Update `server/server.js` CORS to accept your frontend domain:

```javascript
const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});
```

#### Step 2: Update Environment Variables

Update your `server/.env`:
```
PORT=5000
MONGODB_URI=mongodb+srv://chatapp_admin:<password>@chat-app-cluster.xxxxx.mongodb.net/rg-chat?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=production
CLIENT_URL=https://your-frontend-url.vercel.app
```

#### Step 3: Deploy to Render

1. Push your code to GitHub (if not already)
2. Go to: https://render.com
3. Sign up (connect GitHub)
4. Click **"New +"** → **"Web Service"**
5. Connect your GitHub repo
6. Configure:
   - **Name:** chat-app-server
   - **Environment:** Node
   - **Build Command:** `cd server && npm install`
   - **Start Command:** `cd server && npm start`
   - **Region:** Choose closest region
7. Add **Environment Variables:**
   - `PORT`: 5000
   - `MONGODB_URI`: [your Atlas connection string]
   - `JWT_SECRET`: [your secret]
   - `NODE_ENV`: production
   - `CLIENT_URL`: [your frontend URL]
8. Click **"Create Web Service"**
9. Wait for deployment (2-3 minutes)
10. Your server URL: `https://chat-app-server.onrender.com`

### Option B: Deploy to Railway.app (FREE + Easy)

1. Go to: https://railway.app
2. Sign up with GitHub
3. Create new project
4. Select **"Deploy from GitHub repo"**
5. Add environment variables (same as above)
6. Railway auto-detects and deploys!

### Option C: Deploy to Heroku (Requires Credit Card)

1. Install Heroku CLI: https://devcenter.heroku.com/articles/heroku-cli
2. Run:
```bash
heroku login
cd server
heroku create chat-app-server
heroku config:set MONGODB_URI="mongodb+srv://..." JWT_SECRET="..." CLIENT_URL="..."
git push heroku main
```

---

## Part 3: Client Deployment (Frontend)

### Option A: Deploy to Vercel (Recommended - FREE)

#### Step 1: Update API Base URL

Edit `client/src/services/api.js`:
```javascript
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export default axios.create({
  baseURL: API_URL,
});
```

#### Step 2: Deploy to Vercel

1. Go to: https://vercel.com
2. Sign up (connect GitHub)
3. Click **"Import Project"**
4. Select your GitHub repo
5. Configure:
   - **Root Directory:** `client`
   - **Framework Preset:** Create React App
   - **Build Command:** `npm run build`
6. Add **Environment Variables:**
   - `REACT_APP_API_URL`: `https://chat-app-server.onrender.com/api`
7. Click **"Deploy"**
8. Your frontend URL: `https://your-app.vercel.app`

### Option B: Deploy to Netlify (FREE)

1. Go to: https://netlify.com
2. Sign up (connect GitHub)
3. Click **"Add new site"** → **"Import an existing project"**
4. Connect repo
5. Configure:
   - **Base directory:** `client`
   - **Build command:** `npm run build`
   - **Publish directory:** `build`
6. Add environment variables
7. Deploy!

---

## Part 4: Final Configuration

### Update Backend CORS

After deploying frontend, update `server/server.js`:

```javascript
const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000'
}));
```

Redeploy server with updated code.

### Test Connection

1. Open your frontend URL in browser
2. Register a new account
3. Check MongoDB Atlas → **Collections** to verify user is created
4. Check **Monitoring** dashboard for live metrics

---

## Part 5: MongoDB Atlas Monitoring Dashboard

### Key Metrics to Monitor

1. **Cluster Overview:**
   - Connection count
   - Operations (reads/writes)
   - Data size
   - Storage

2. **Performance:**
   - Query performance insights
   - Slow query logs
   - Index usage

3. **Security:**
   - Active connections
   - Failed authentication attempts
   - Access patterns

### Enable More Detailed Monitoring

For advanced metrics:
1. Upgrade to M2+ cluster (minimum $9/month)
2. Or use MongoDB Compass (free, local monitoring):
   - Download: https://www.mongodb.com/products/compass
   - Connect with your Atlas connection string
   - View real-time database activity

---

## Troubleshooting

### "Connection refused" error
- Check if MongoDB URI is correct
- Verify IP whitelist includes server's IP
- Test connection string locally first

### Socket.io connection failing
- Ensure `CLIENT_URL` environment variable is set correctly
- Check CORS settings in backend
- Verify frontend is pointing to correct API URL

### MongoDB data not appearing
- Check database name in connection string matches app
- Verify user has correct permissions (Atlas Admin)
- Check network access allows your server's IP

### App slow after deployment
- Check MongoDB Atlas cluster metrics
- May need to scale up cluster (upgrade plan)
- For free tier, batch database queries

---

## Next Steps

1. ✅ Create MongoDB Atlas account & cluster
2. ✅ Update MONGODB_URI with Atlas connection string
3. ✅ Update CLIENT_URL for frontend
4. ✅ Deploy server to Render/Railway/Heroku
5. ✅ Deploy client to Vercel/Netlify
6. ✅ Test live app
7. ✅ Monitor in MongoDB Atlas dashboard

**Expected Timeline:** 30-45 minutes from start to fully deployed

---

## Security Notes

### Before Production:

1. **Rotate secrets:**
   - Generate new `JWT_SECRET`
   - Change MongoDB password

2. **Restrict network access:**
   - Don't use "0.0.0.0/0" long-term
   - Add only your server's IP in MongoDB Atlas

3. **Enable SSL/TLS:**
   - Most cloud hosts do this automatically
   - Verify HTTPS is used for all connections

4. **Monitor logs:**
   - Check server logs for errors
   - Review MongoDB Atlas audit logs

5. **Set up backups:**
   - MongoDB Atlas does automatic backups (free)
   - Check **Backup** section in Atlas
