# MongoDB Configuration & Setup Guide

## Current Configuration

Your app is already configured to use MongoDB. Here's what's set up:

### Environment Variables (`.env`)
```
MONGODB_URI=mongodb://localhost:27017/rg-chat
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000
JWT_SECRET=8c2104834b5d1d5e98d65a13f0a128be33b79b96adb57e53b6e22127fb144a58
```

## Setup Options

### Option 1: Local MongoDB (Recommended for Development)

#### Installation

**Windows:**
1. Download: https://www.mongodb.com/try/download/community
2. Run the MSI installer
3. Check "Install MongoDB as a Service" for auto-start
4. Verify: Open PowerShell and run `mongod --version`

**macOS:**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Linux:**
```bash
curl -fsSL https://www.mongodb.org/static/pgp/server-5.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/5.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-5.0.list
sudo apt-get update && sudo apt-get install -y mongodb-org
sudo systemctl start mongod
```

#### Verification
```bash
# Check if MongoDB is running
mongosh  # or 'mongo' for older versions

# You should see the MongoDB shell prompt (>)
```

#### Quick Test
```bash
# In MongoDB shell
use chat-app
db.users.insertOne({ username: "testuser", email: "test@example.com" })
db.users.find()
```

---

### Option 2: MongoDB Atlas (Cloud - Recommended for Production)

#### Setup Steps

1. **Create Account**
   - Go to: https://www.mongodb.com/cloud/atlas
   - Sign up (free tier available)

2. **Create a Cluster**
   - Click "Create" → Select free M0 tier
   - Wait 5-10 minutes for deployment

3. **Create Database User**
   - Go to Database Access → Add New Database User
   - Username: `chatapp_admin`
   - Password: Use auto-generated (strong password)
   - Click "Create"

4. **Add IP Whitelist**
   - Go to Network Access
   - Click "Add IP Address"
   - For development: Add `0.0.0.0/0` (allows all IPs)
   - For production: Add your server's IP only

5. **Get Connection String**
   - Click "Connect" on your cluster
   - Select "Connect your application"
   - Copy the MongoDB URI
   - Replace `<username>` and `<password>` with your credentials

6. **Update `.env`**
   ```
   MONGODB_URI=mongodb+srv://chatapp_admin:your_password@cluster.mongodb.net/rg-chat?retryWrites=true&w=majority
   ```

#### Example Connection String
```
mongodb+srv://chatapp_admin:SecurePassword123@chat-app-cluster.abc123.mongodb.net/rg-chat?retryWrites=true&w=majority
```

---

## Database Schema Overview

### Users Collection
```javascript
{
  _id: ObjectId,
  username: String (3-30 chars, unique),
  email: String (valid email, unique),
  password: String (hashed with bcrypt),
  avatar: String (URL, optional),
  status: String ('online' | 'offline' | 'away'),
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- `username`: For quick user lookups
- `email`: For login authentication

### Messages Collection
```javascript
{
  _id: ObjectId,
  sender: ObjectId (ref: User),
  receiver: ObjectId (ref: User),
  text: String (1-2000 chars),
  timestamp: Date (auto-sorted, TTL index),
  read: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- `sender + receiver + timestamp`: For fetching conversations
- `receiver + read`: For finding unread messages
- `timestamp` (TTL): Auto-deletes messages after 90 days

---

## Verification & Testing

### Run the Verification Script
```bash
cd server
node scripts/verify-mongodb.js
```

This script will:
- ✅ Test your MongoDB connection
- ✅ Display host and database info
- ✅ List existing collections
- ✅ Verify your models are loaded
- ✅ Show database indexes
- ✅ Test model validation

### Start the Server
```bash
cd server
npm install
npm start
```

Expected output:
```
📍 Listening on port 5000
✅ MongoDB connected successfully
Client URL allowed: http://localhost:3000
```

---

## Connection Pool Configuration

Your app uses optimized connection settings:
- **maxPoolSize**: 10 connections
- **minPoolSize**: 5 connections
- **serverSelectionTimeout**: 5 seconds
- **connectTimeout**: 10 seconds
- **retryWrites**: Enabled for reliability

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| `ECONNREFUSED` | MongoDB not running. Start it: `mongod` (Windows) or `brew services start mongodb-community` (Mac) |
| `authentication failed` | Check username/password in MONGODB_URI |
| `ENOTFOUND` | For Atlas: Whitelist your IP in Network Access |
| `Connection timeout` | Increase `serverSelectionTimeoutMS` in [config/db.js](server/config/db.js) |
| Port 27017 already in use | Change port in MONGODB_URI or kill the process using it |

---

## Security Best Practices

✅ **Do:**
- Use strong, random JWT_SECRET (already set in .env)
- Password is hashed with bcrypt (min 10 rounds)
- Whitelist IPs in MongoDB Atlas (production)
- Use connection pool settings (already configured)
- Enable encryption in transit for Atlas (default)

⚠️ **Don't:**
- Commit `.env` to git (already in .gitignore)
- Use `0.0.0.0/0` IP whitelist in production
- Log MongoDB passwords
- Use weak JWT_SECRET in production

---

## Performance Tips

1. **Query Optimization**
   - Indexes are already created on frequently queried fields
   - Use `timestamp: -1` for newest-first sorting

2. **Message Cleanup**
   - TTL index auto-deletes messages after 90 days (adjustable)
   - To disable: Remove TTL index from `models/Message.js`

3. **Monitoring**
   - Use Atlas dashboard to monitor queries
   - Check slow query logs for optimization

---

## Next Steps

1. ✅ Run the verification script to test connection
2. ✅ Start your server
3. ✅ Test API endpoints
4. ✅ Monitor data in MongoDB Atlas dashboard (if using cloud)

