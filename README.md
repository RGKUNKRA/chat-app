# RG Chat - Real-Time Chat Application

A modern, full-stack real-time chat application built with React, Node.js, Express, MongoDB, and Socket.io.

## Features

✅ **User Authentication** - Secure registration and login with JWT  
✅ **Real-Time Messaging** - Instant message delivery using Socket.io  
✅ **User Profiles** - User profiles with online/offline status  
✅ **Typing Indicators** - See when a user is typing  
✅ **Message History** - Persistent message storage  
✅ **User Status** - Online/Offline/Away status tracking  

## Project Structure

```
rg-chat/
├── server/                 # Node.js/Express backend
│   ├── models/            # MongoDB schemas
│   ├── routes/            # API endpoints
│   ├── middleware/        # Authentication middleware
│   ├── config/            # Database configuration
│   ├── utils/             # Utility functions
│   ├── server.js          # Main server file
│   └── package.json       # Backend dependencies
│
└── client/                # React frontend
    ├── public/            # Static files
    ├── src/
    │   ├── pages/         # Page components (Login, Register, Chat)
    │   ├── components/    # Reusable components (MessageWindow)
    │   ├── services/      # API service calls
    │   ├── styles/        # CSS files
    │   ├── App.jsx        # Main app component
    │   └── index.js       # Entry point
    └── package.json       # Frontend dependencies
```

## Prerequisites

- Node.js (v14+)
- MongoDB (local or cloud)
- npm or yarn

## Installation

### Backend Setup

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file with your configuration:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/rg-chat
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
```

4. Make sure MongoDB is running, then start the server:
```bash
npm run dev
```

The server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The app will open at `http://localhost:3000`

## Running the Application

Make sure both the backend and frontend servers are running:

1. **Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

2. **Terminal 2 - Frontend:**
```bash
cd client
npm start
```

## Usage

1. **Register** - Create a new account with username, email, and password
2. **Login** - Log in with your email and password
3. **Select User** - Click on a user from the list to start chatting
4. **Send Message** - Type your message and click send or press Enter
5. **Real-Time Updates** - Messages appear instantly for both users

## API Endpoints

### Authentication Routes

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login with email and password

### Chat Routes (require authentication)

- `GET /api/chat/users` - Get list of all users
- `GET /api/chat/profile` - Get current user profile
- `GET /api/chat/messages/:userId` - Get message history with a user
- `PUT /api/chat/status` - Update user status

## Socket.io Events

### Client → Server
- `user_join` - User joins the app
- `send_message` - Send a message
- `typing` - User is typing
- `stop_typing` - User stopped typing
- `disconnect` - User disconnects

### Server → Client
- `receive_message` - Receive a message
- `message_sent` - Message sent confirmation
- `user_typing` - Another user is typing
- `user_stopped_typing` - User stopped typing

## Technologies Used

### Backend
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **Socket.io** - Real-time communication
- **JWT** - Authentication
- **bcryptjs** - Password hashing

### Frontend
- **React** - UI library
- **React Router** - Client-side routing
- **Socket.io Client** - WebSocket client
- **Axios** - HTTP client
- **CSS3** - Styling

## Future Enhancements

- Group chat functionality
- File and image sharing
- Voice/Video calling
- User search functionality
- Message deletion and editing
- Read receipts
- User notifications

## License

MIT License

## Support

For issues or questions, please open an issue in the repository.
