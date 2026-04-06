# RG Chat - Getting Started Guide

## 🎉 Welcome!

Your real-time chat application has been created! Here's everything you need to know to get it running.

## 📋 Quick Overview

This is a full-stack chat application with:
- ✅ User authentication (register/login)
- ✅ Real-time messaging with Socket.io
- ✅ User profiles and status tracking
- ✅ Message history
- ✅ Typing indicators

## 🚀 Quick Start (Windows)

1. **Double-click `setup.bat`** to install all dependencies automatically

2. **Ensure MongoDB is running:**
   - See `MONGODB_SETUP.md` for installation instructions

3. **Open two terminals:**

   **Terminal 1 - Start Backend:**
   ```bash
   cd server
   npm run dev
   ```

   **Terminal 2 - Start Frontend:**
   ```bash
   cd client
   npm start
   ```

4. **App will open at:** `http://localhost:3000`

## 🚀 Quick Start (macOS/Linux)

1. **Run setup script:**
   ```bash
   chmod +x setup.sh && ./setup.sh
   ```

2. **Ensure MongoDB is running:**
   - See `MONGODB_SETUP.md` for installation instructions

3. **Open two terminals:**

   **Terminal 1 - Start Backend:**
   ```bash
   cd server
   npm run dev
   ```

   **Terminal 2 - Start Frontend:**
   ```bash
   cd client
   npm start
   ```

## 📁 Project Structure

```
rg-chat/
├── server/                    # Node.js/Express backend
│   ├── models/               # Database schemas (User, Message)
│   ├── routes/              # API routes (auth, chat)
│   ├── middleware/          # Auth middleware
│   ├── config/              # Database config
│   ├── utils/               # JWT utilities
│   ├── server.js            # Main server with Socket.io
│   ├── package.json         # Dependencies
│   └── .env                 # Configuration (EDIT THIS!)
│
└── client/                   # React frontend
    ├── public/              # Static files
    ├── src/
    │   ├── pages/          # Login, Register, Chat pages
    │   ├── components/     # MessageWindow component
    │   ├── services/       # API calls
    │   ├── styles/         # CSS styling
    │   ├── App.jsx         # Main app
    │   └── index.js        # Entry point
    └── package.json        # Dependencies
```

## ⚙️ Configuration

### Backend (.env)

Located in `server/.env`:

```env
PORT=5000                                    # Server port
MONGODB_URI=mongodb://localhost:27017/rg-chat  # MongoDB connection
JWT_SECRET=your_jwt_secret_key_here_change_this_in_production
NODE_ENV=development
```

**IMPORTANT:** Change `JWT_SECRET` in production!

### Environment Variables

- **PORT**: Server listening port (default: 5000)
- **MONGODB_URI**: MongoDB connection string
- **JWT_SECRET**: Secret key for JWT tokens

## 🔐 Authentication Flow

1. **Register** → New user account created
2. **Login** → JWT token issued
3. **Token stored** → In browser localStorage
4. **API requests** → Include token in Authorization header

## 💬 How It Works

### Real-Time Messaging

1. **Socket Connection** - User connects via Socket.io
2. **Send Message** - Message sent through socket
3. **Database Save** - Message stored in MongoDB
4. **Instant Delivery** - Recipient receives in real-time
5. **Message History** - Can fetch past messages

### User Status

- **Online** - User is actively using the app
- **Offline** - User is not connected
- **Away** - Customizable status

## 🧪 Testing the App

1. **Open browser:** `http://localhost:3000`

2. **Register first user:**
   - Username: user1
   - Email: user1@example.com
   - Password: password123

3. **Register second user (in incognito window):**
   - Username: user2
   - Email: user2@example.com
   - Password: password123

4. **Start chatting!** - Send messages between the two users

## 🐛 Troubleshooting

### "Cannot connect to MongoDB"
- ✓ Check MongoDB is running (`mongod`)
- ✓ Verify port 27017 is not blocked
- ✓ Check MONGODB_URI in .env

### "Connection refused on localhost:5000"
- ✓ Backend server not running
- ✓ Run `npm run dev` in server folder

### "React app won't load"
- ✓ Client server not running
- ✓ Run `npm start` in client folder
- ✓ Clear browser cache (Ctrl+Shift+Del)

### "Messages not appearing"
- ✓ Check browser console (F12)
- ✓ Verify Socket.io is connected
- ✓ Check that both users are registered

## 📚 Key Features Explained

### 1. User Authentication
- Passwords hashed with bcryptjs
- JWT tokens for session management
- Protected API routes

### 2. Real-Time Messaging
- Socket.io WebSocket connection
- Instant message delivery
- Typing indicators

### 3. User Management
- User profiles visible
- Online/offline status
- User search

### 4. Message History
- Messages persist in MongoDB
- Can view past conversations
- Timestamped messages

## 🔧 Development Commands

### Backend
```bash
npm install          # Install dependencies
npm run dev         # Start with nodemon (auto-reload)
node server.js      # Start normally
```

### Frontend
```bash
npm install         # Install dependencies
npm start          # Start dev server
npm run build      # Build for production
npm test           # Run tests
```

## 📦 Dependencies

### Backend
- express - Web framework
- mongoose - MongoDB ODM
- socket.io - Real-time communication
- bcryptjs - Password hashing
- jsonwebtoken (jwt) - Authentication

### Frontend
- react - UI library
- react-router-dom - Routing
- socket.io-client - WebSocket client
- axios - HTTP requests

## 🌐 Ports

- **Frontend:** http://localhost:3000
- **Backend:** http://localhost:5000
- **MongoDB:** localhost:27017 (default)

## 📖 Learn More

- React: https://react.dev
- Node.js: https://nodejs.org
- MongoDB: https://docs.mongodb.com
- Socket.io: https://socket.io/docs
- Express: https://expressjs.com

## 🎯 Next Steps

1. Start the servers (see Quick Start)
2. Register a test account
3. Create another account in incognito mode
4. Send test messages
5. Explore the code and customize!

## 💡 Tips for Customization

- **Colors:** Edit CSS files in `client/src/styles/`
- **Features:** Add new routes in `server/routes/`
- **Database:** Modify schemas in `server/models/`
- **UI Components:** Edit React components in `client/src/components/`

## 🚀 Production Deployment

1. Build frontend: `cd client && npm run build`
2. Update environment variables
3. Use MongoDB Atlas for cloud database
4. Deploy on Heroku, Vercel, AWS, etc.
5. Set secure JWT_SECRET
6. Enable HTTPS

## 📞 Support

For issues or questions:
1. Check the README.md for detailed documentation
2. Review error messages in console (F12)
3. Check MongoDB is running
4. Verify all services are started

## 🎉 Enjoy Your Chat App!

You now have a fully functional real-time chat application. Happy coding!
