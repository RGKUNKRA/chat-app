# Quick Render.com Deployment Guide

## Prerequisites ✅
- GitHub account
- MongoDB Atlas account with connection string
- Your chat app code pushed to GitHub

---

## Step 1: Push Code to GitHub

If not already done:

```bash
git add .
git commit -m "Prepare for Render deployment"
git push origin main
```

---

## Step 2: Create MongoDB Atlas Cluster

1. Go to: https://www.mongodb.com/cloud/atlas
2. Sign up (free)
3. Create cluster:
   - Name: `chat-app-cluster`
   - Tier: **M0 (FREE)**
   - Region: Choose closest to you
4. Wait 2-3 minutes for cluster to be ready

---

## Step 3: Setup MongoDB Database User

1. Click **Security** → **Database Access**
2. Click **"Add New Database User"**
   - Username: `chatapp_admin`
   - Password: Generate strong password (save it!)
   - Role: `Atlas Admin`
   - Click **"Add User"**

---

## Step 4: Setup Network Access

1. Click **Security** → **Network Access**
2. Click **"Add IP Address"**
3. Select **"Allow Access from Anywhere"** (0.0.0.0/0)
4. Click **"Confirm"**

> ⚠️ **Note:** For production, restrict to your Render IP only

---

## Step 5: Get MongoDB Connection String

1. Click **Clusters** → **"Connect"** button
2. Choose **"Connect your application"**
3. Select **Node.js** driver
4. Copy the connection string:
   ```
   mongodb+srv://chatapp_admin:<password>@chat-app-cluster.xxxxx.mongodb.net/rg-chat?retryWrites=true&w=majority
   ```
5. **Replace `<password>` with your actual MongoDB password**

---

## Step 6: Deploy Server to Render

### 6a. Create Render Account

1. Go to: https://render.com
2. Sign up (use GitHub login for easier setup)
3. Click **"Dashboard"**

### 6b. Create New Web Service

1. Click **"New +"** (top right)
2. Select **"Web Service"**
3. Select **"Connect Git Repository"**
4. Find your repository and click **"Connect"**

### 6c. Configure Render Service

Fill in the form:

| Field | Value |
|-------|-------|
| **Name** | `chat-app-server` |
| **Environment** | `Node` |
| **Region** | Select closest region |
| **Branch** | `main` |
| **Build Command** | `npm install` |
| **Start Command** | `node server.js` |
| **Plan** | `Free` |

### 6d. Add Environment Variables

Click **"Advanced"** → **"Add Environment Variable"**

Add these variables:

| Key | Value |
|-----|-------|
| `PORT` | `5000` |
| `NODE_ENV` | `production` |
| `MONGODB_URI` | `mongodb+srv://chatapp_admin:<password>@...` (your full connection string) |
| `JWT_SECRET` | Generate strong random string (e.g., `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`) |
| `CLIENT_URL` | Leave blank for now (update after frontend deployment) |

### 6e. Deploy

1. Click **"Create Web Service"**
2. Wait for deployment (2-5 minutes)
3. You'll see: **"Your service is live at: https://chat-app-server-xxxx.onrender.com"**
4. **Save this URL!** You'll need it for the frontend.

---

## Step 7: Fix CORS Issues

Once the server is deployed:

1. Go back to Render dashboard
2. Select your service
3. Click **"Environment"**
4. Add/Update:
   ```
   CLIENT_URL=https://your-frontend-url-here.vercel.app
   ```
5. Render will auto-redeploy

---

## Step 8: Test Backend

Test your server is working:

```bash
curl https://chat-app-server-xxxx.onrender.com/
```

You should get a response (not a 404).

---

## Step 9: Deploy Frontend to Vercel

### 9a. Update Client API URL

Edit `client/src/services/api.js`:

```javascript
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export default axios.create({
  baseURL: API_URL,
});
```

### 9b. Push to GitHub

```bash
git add .
git commit -m "Update for production deployment"
git push origin main
```

### 9c. Deploy to Vercel

1. Go to: https://vercel.com
2. Sign up (use GitHub)
3. Click **"Add New..."** → **"Project"**
4. Select your repository
5. Configure:
   - **Root Directory:** `client`
   - **Framework:** `Create React App`
   - **Build Command:** `npm run build`
6. Add **Environment Variable:**
   ```
   REACT_APP_API_URL=https://chat-app-server-xxxx.onrender.com/api
   ```
7. Click **"Deploy"**
8. Wait 2-3 minutes
9. You'll get your frontend URL: `https://your-app-xxxxx.vercel.app`

---

## Step 10: Update Server CORS Again

1. Go back to Render
2. Update `CLIENT_URL`:
   ```
   CLIENT_URL=https://your-app-xxxxx.vercel.app
   ```
3. Save - Render auto-redeploys

---

## Final Testing ✅

1. Open: `https://your-app-xxxxx.vercel.app`
2. Register a new user
3. Check MongoDB Atlas:
   - Go to **Clusters** → **"Browse Collections"**
   - You should see your user in the database!
4. Login and test messaging
5. Go to MongoDB **Monitoring** to see live metrics

---

## Troubleshooting

### "Cannot GET /"
- Check if server is running
- Check logs in Render: **Logs** tab

### "Failed to connect to database"
- Verify MongoDB URI is correct
- Check network access (0.0.0.0/0 allowed?)
- Test connection string locally

### "CORS error" in browser
- Make sure `CLIENT_URL` is set in server environment
- Check `https://` prefix is used
- Redeploy server after changing `CLIENT_URL`

### Socket.io not connecting
- Same CORS issue as above
- Check browser dev console for exact error
- Make sure frontend API URL matches server URL

### Render free tier sleeping
- Free tier sleeps after 15 mins of inactivity
- First request takes ~30 seconds to wake up
- Upgrade to paid plan to avoid this ($7/month)

---

## Your Deployment URLs

Save these after deployment:

```
Frontend:  https://your-app-xxxxx.vercel.app
Server:    https://chat-app-server-xxxx.onrender.com
MongoDB:   MongoDB Atlas (monitoring: https://cloud.mongodb.com)
```

---

## Next: Monitoring in MongoDB Atlas

Once deployed and users are registering:

1. Go to: https://cloud.mongodb.com
2. Click your cluster
3. **Monitoring** tab shows:
   - Active connections
   - Read/write operations
   - Storage usage
   - CPU/Memory

For detailed metrics, upgrade to M2+ ($9/month).

---

## Security Reminders

- [ ] Change default MongoDB password
- [ ] Use strong JWT_SECRET (not "secret")
- [ ] Enable HTTPS everywhere (auto-enabled by Render/Vercel)
- [ ] Review which IPs can access MongoDB
- [ ] Enable 2FA on MongoDB Atlas account
- [ ] Regularly check access logs

---

**Done! Your chat app is now live! 🎉**
