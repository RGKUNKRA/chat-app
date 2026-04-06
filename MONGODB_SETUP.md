# MongoDB Setup Guide

## Installation

### Windows

1. **Download MongoDB Community Edition:**
   - Visit: https://www.mongodb.com/try/download/community
   - Download the MSI installer for Windows

2. **Install MongoDB:**
   - Run the installer
   - Follow the installation wizard
   - Recommended: Install MongoDB as a Windows Service

3. **Verify Installation:**
   ```bash
   mongod --version
   ```

4. **Start MongoDB:**
   - If installed as service: MongoDB will start automatically
   - Or manually start with: `mongod`

### macOS

1. **Using Homebrew (Recommended):**
   ```bash
   brew tap mongodb/brew
   brew install mongodb-community
   ```

2. **Start MongoDB:**
   ```bash
   brew services start mongodb-community
   ```

3. **Verify:**
   ```bash
   mongo --version
   ```

### Linux (Ubuntu/Debian)

1. **Install MongoDB:**
   ```bash
   curl -fsSL https://www.mongodb.org/static/pgp/server-5.0.asc | sudo apt-key add -
   echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/5.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-5.0.list
   sudo apt-get update
   sudo apt-get install -y mongodb-org
   ```

2. **Start MongoDB:**
   ```bash
   sudo systemctl start mongod
   ```

3. **Enable at startup:**
   ```bash
   sudo systemctl enable mongod
   ```

## Quick Test

1. **Start MongoDB** (if not running)

2. **Open another terminal and test:**
   ```bash
   mongo
   ```

3. **You should see the MongoDB shell:**
   ```
   >
   ```

4. **Type to exit:**
   ```
   exit
   ```

## Troubleshooting

### MongoDB won't connect
- Make sure MongoDB is running
- Check if port 27017 is available
- Check firewall settings

### Connection string errors
- Verify MONGODB_URI in `.env` matches your setup
- Default for local: `mongodb://localhost:27017/chat-app`

### Database doesn't persist
- Make sure MongoDB data directory has write permissions
- On Windows, check MongoDB service logs

## Using MongoDB Atlas (Cloud)

1. **Create free account:** https://www.mongodb.com/cloud/atlas
2. **Create a free cluster**
3. **Get connection string**
4. **Update .env file:**
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/chat-app
   ```

## Useful MongoDB Commands

```bash
# Start MongoDB service
mongod

# Open MongoDB shell
mongo

# In MongoDB shell:
show dbs           # List all databases
use rg-chat        # Switch to rg-chat database
db.users.find()    # View all users
db.messages.find() # View all messages
db.dropDatabase()  # Drop current database
```
