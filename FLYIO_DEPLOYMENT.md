# Fly.io Deployment Guide

Deploy your RG Chat to Fly.io - a modern cloud platform with global edge deployment!

## Why Fly.io?
✅ Generous free tier (up to 3 shared-cpu-1x 256MB VMs)  
✅ Deploy to 30+ regions worldwide  
✅ Auto-scaling and health checks  
✅ PostgreSQL and Redis included  
✅ Only pay for what you use after free tier  

## Prerequisites
- [Fly.io](https://fly.io) account (free)
- [flyctl CLI](https://fly.io/docs/getting-started/installing-flyctl/) installed
- MongoDB Atlas cluster (free)
- GitHub repo pushed

## Step 1: Install Fly CLI

### On Windows (PowerShell):
```powershell
iwr https://fly.io/install.ps1 -useb | iex
```

### On macOS/Linux:
```bash
curl -L https://fly.io/install.sh | sh
```

Verify installation:
```bash
flyctl version
```

## Step 2: Create MongoDB Cluster

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free M0 cluster
3. Create database user: `chatapp_admin`
4. Add network access: `0.0.0.0/0`
5. Get connection string:
   ```
   mongodb+srv://chatapp_admin:<password>@cluster.xxxxx.mongodb.net/chatapp
   ```

## Step 3: Login to Fly

```bash
flyctl auth login
```

This opens browser to authenticate. Sign up if needed.

## Step 4: Initialize Fly App

Navigate to your project directory:

```bash
cd "c:\Users\SAMUEL KOKU EWORDAFE\Downloads\ALL\chat app"
flyctl launch
```

Answer the prompts:
```
? App Name: chat-app (or your name)
? Select organization: Personal (usually)
? Would you like to set up a PostgreSQL database? No
? Would you like to set up a Upstash Redis database? No
```

This creates `fly.toml` file.

## Step 5: Update fly.toml

Open `fly.toml` and ensure it looks like this:

```toml
app = "chat-app"
primary_region = "sjc"  # Choose region closest to you

[build]
  builder = "heroku"

[env]
  PORT = "3000"
  NODE_ENV = "production"

[[services]]
  internal_port = 3000
  processes = ["app"]

  [[services.ports]]
    port = 80
    handlers = ["http"]

  [[services.ports]]
    port = 443
    handlers = ["tls", "http"]
```

## Step 6: Add Environment Variables

Create `.fly.secrets` file:

```bash
flyctl secrets set NODE_ENV=production
flyctl secrets set MONGODB_URI="mongodb+srv://chatapp_admin:<password>@cluster.xxxxx.mongodb.net/chatapp"
flyctl secrets set JWT_SECRET="your-super-secret-key-here"
flyctl secrets set CLIENT_URL="https://chat-app.fly.dev"
flyctl secrets set PORT=3000
```

Or set individually:
```bash
flyctl secrets set MONGODB_URI="your-connection-string"
```

## Step 7: Create Dockerfile (Optional but Recommended)

Create `Dockerfile` in project root:

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install root dependencies
RUN npm install

# Install server dependencies
COPY server/package*.json ./server/
RUN cd server && npm install && cd ..

# Install client dependencies
COPY client/package*.json ./client/
RUN cd client && npm install && cd ..

# Copy all code
COPY . .

# Build frontend
RUN npm run build

EXPOSE 3000

# Start server
CMD ["npm", "start"]
```

## Step 8: Deploy to Fly

Deploy your app:

```bash
flyctl deploy
```

Fly will:
1. Build your Docker image
2. Upload to registry
3. Deploy to your region
4. Assign public URL

This takes 2-5 minutes.

## Step 9: Get Your Public URL

Once deployed:

```bash
flyctl open
```

Or find it in dashboard. Format: `https://chat-app-xxxxx.fly.dev`

## Step 10: Update CLIENT_URL

Update the environment variable with your actual Fly URL:

```bash
flyctl secrets set CLIENT_URL="https://chat-app-xxxxx.fly.dev"
```

Fly will auto-redeploy.

## Step 11: Test Your App

1. Open your Fly URL in browser
2. Register a new account
3. Test login and messaging
4. Check console for errors

## Monitoring & Logs

### View Logs:
```bash
flyctl logs
```

### Monitor Performance:
```bash
flyctl status
```

### View Dashboard:
```bash
flyctl dashboard
```

## Scaling

### Increase Capacity:
```bash
flyctl scale vm shared-cpu-1x --count 2
```

### Deploy to Multiple Regions:
```bash
flyctl regions add iad  # Add Washington DC
flyctl regions add lhr  # Add London
```

## Updating Your App

After making code changes:

```bash
git add .
git commit -m "Update chat app"
git push origin main

# Redeploy to Fly
flyctl deploy --remote-only
```

## Troubleshooting

### Build Fails
```bash
flyctl logs
# Check output for specific error
```

### App Crashes on Startup
1. Check `MONGODB_URI` is correct
2. Verify MongoDB whitelist includes Fly IPs
3. Check all environment variables are set

### WebSocket Not Working
1. Ensure Socket.io configured for production
2. Check `CLIENT_URL` is correct
3. Review logs for CORS errors

### Out of Memory
Free tier has 256MB RAM - may need paid plan for production.

```bash
flyctl scale vm shared-cpu-2x  # 512MB RAM
```

## Costs

- **Free Tier**: 3 shared-cpu-1x 256MB VMs (~$0)
- **Paid Plans**: Only pay for usage above free tier
- **Typical Cost**: $5-20/month for small apps

## Custom Domain

Add your domain:

```bash
flyctl certs add chat.yourdomain.com
```

Follow DNS instructions.

## Useful Commands

```bash
# List all apps
flyctl apps list

# Delete app
flyctl apps destroy chat-app

# SSH into instance
flyctl ssh console

# View current config
flyctl config show

# Update only secrets
flyctl secrets set KEY=value

# View secrets
flyctl secrets list
```

## Undoing Deployments

If latest deployment has issues:

```bash
# View deployment history
flyctl releases

# Rollback to previous version
flyctl releases rollback
```

## Performance Tips

1. **Enable Redis** for session caching
2. **Use Fly Postgres** for scale
3. **Enable compression** middleware
4. **Monitor metrics** regularly
5. **Set health checks** for auto-recovery

## Comparison: Fly.io vs Railway vs Render

| Feature | Fly.io | Railway | Render |
|---------|--------|---------|--------|
| Free Tier | 3 VMs | $5 credit | Limited |
| Global | Yes (30+) | No | No |
| Regions | Many | Limited | Limited |
| Auto-scale | Yes | Yes | Yes |
| Docker Support | Native | Limited | Limited |
| Learning Curve | Medium | Easy | Easy |
| Performance | Excellent | Excellent | Good |

## Next Steps

1. Deploy using `flyctl deploy`
2. Monitor with `flyctl monitoring`
3. Scale if needed
4. Add custom domain
5. Share your app!

## Documentation

- [Fly.io Docs](https://fly.io/docs)
- [Fly.io CLI Reference](https://fly.io/docs/flyctl/launching/)
- [Fly Community](https://community.fly.io)

---

**Your app will be live at `https://YOUR-APP-NAME.fly.dev`!**
