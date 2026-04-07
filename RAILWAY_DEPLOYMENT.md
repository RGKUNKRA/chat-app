# Railway Deployment Guide

Your chat app is now configured for Railway deployment! Follow these steps to make it public.

## Prerequisites
- [Railway.app](https://railway.app) account (free tier available)
- Your GitHub account (already connected to the repo)

## Step 1: Connect GitHub to Railway

1. Go to [railway.app](https://railway.app)
2. Click **"Create New Project"**
3. Select **"Deploy from GitHub repo"**
4. Search for and select **RGKUNKRA/chat-app**
5. Click **"Deploy"**

Railway will automatically detect your project structure and start building!

## Step 2: Configure Environment Variables

After Railway starts building, you need to set up environment variables:

1. In Railway, go to your **Project Settings** → **Variables**
2. Add these variables:

```
MONGODB_URI=mongodb+srv://username:password@cluster-name.mongodb.net/dbname
JWT_SECRET=generate_a_strong_random_string_here
CLIENT_URL=https://your-railway-domain.com
NODE_ENV=production
```

### Getting Your MongoDB Connection String:
- If using MongoDB Atlas (recommended):
  1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
  2. Create a free cluster
  3. Get your connection string from Connect → Connect your application
  4. Add it as `MONGODB_URI`

### Generate JWT_SECRET:
Run this in your terminal to generate a secure secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Step 3: Get Your Public URL

1. In Railway, click **"Domains"** or look for the deployment URL
2. Railway will assign you a domain like: `chat-app-production-xxxx.railway.app`
3. This is your **public URL** where anyone can access your app!

## Step 4: Update Environment Variables with Your Domain

1. Go back to **Variables** in Railway
2. Update `CLIENT_URL` to your Railway domain:
   ```
   CLIENT_URL=https://chat-app-production-xxxx.railway.app
   ```
3. Railway will automatically redeploy with the updated variables

## Step 5: Test Your Deployment

1. Open your Railway URL in a browser
2. Register a new account
3. Login and test the chat features
4. Check the console for any errors

## Troubleshooting

### Build Fails
- Check that `node_modules/.bin` has the required scripts
- Ensure `client/package.json` has all dependencies
- Check Railway build logs for specific errors

### Can't Connect to MongoDB
- Verify `MONGODB_URI` is correct
- Add your Railway IP to MongoDB Atlas IP Whitelist (use 0.0.0.0/0 for development)
- Check that mongoose is properly connecting

### Frontend Not Loading
- Clear browser cache (Ctrl+Shift+Del)
- Check that `npm run build` completes successfully
- Verify server is serving static files from `client/build`

### WebSocket Connection Issues
- Ensure Socket.io is configured for the deployed domain
- Check CORS settings match your production URL
- Verify WebSocket is enabled in Railway (usually enabled by default)

## Custom Domain (Optional)

To use your own domain instead of Railway's:

1. Go to **Domains** in Railway
2. Click **"Add Custom Domain"**
3. Add your custom domain (e.g., chat.yourdomain.com)
4. Update your DNS records as instructed by Railway
5. Update `CLIENT_URL` environment variable to your custom domain

## Monitoring & Logs

1. In Railway dashboard, click your project
2. Go to **Logs** to see real-time application logs
3. Check for errors in MongoDB connection, Socket.io, or API calls

## Next Steps

- **Scale**: Railway allows you to increase resources if needed
- **Auto-deploy**: Enable automatic deployments when you push to GitHub
- **Database backups**: Configure MongoDB Atlas backups
- **SSL/HTTPS**: Railway provides free SSL certificates

## Support

If you need help:
- Check [Railway Documentation](https://docs.railway.app)
- Review your deployment logs
- Check MongoDB Atlas connection settings

---

**Your app will go live after pushing these configuration changes to GitHub!**
