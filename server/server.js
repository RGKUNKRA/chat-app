require('dotenv').config();
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const connectDB = require('./config/db');
const Message = require('./models/Message');

// Routes
const authRoutes = require('./routes/auth');
const chatRoutes = require('./routes/chat');

// Initialize app
const app = express();
const server = http.createServer(app);

// Handle CORS - allow both development and production URLs
const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000';
console.log('Client URL allowed:', clientUrl);

const io = socketIo(server, {
  cors: {
    origin: clientUrl,
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Middleware
app.use(cors({
  origin: clientUrl,
  credentials: true
}));
app.use(express.json());

// Connect to database
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);

// Socket.io events
const activeUsers = {};

io.on('connection', (socket) => {
  console.log('New user connected:', socket.id);

  // User joins
  socket.on('user_join', (userId) => {
    activeUsers[userId] = socket.id;
    console.log('Active users:', Object.keys(activeUsers));
  });

  // Send message
  socket.on('send_message', async (data) => {
    try {
      const { senderId, receiverId, text } = data;

      // Save message to database
      const message = new Message({
        sender: senderId,
        receiver: receiverId,
        text
      });

      await message.save();

      // Send to receiver if online
      if (activeUsers[receiverId]) {
        io.to(activeUsers[receiverId]).emit('receive_message', {
          id: message._id,
          sender: senderId,
          receiver: receiverId,
          text,
          timestamp: message.timestamp
        });
      }

      // Send confirmation to sender
      socket.emit('message_sent', { id: message._id });
    } catch (error) {
      console.error('Error sending message:', error);
    }
  });

  // User typing
  socket.on('typing', (data) => {
    const { senderId, receiverId } = data;
    if (activeUsers[receiverId]) {
      io.to(activeUsers[receiverId]).emit('user_typing', { userId: senderId });
    }
  });

  // User stopped typing
  socket.on('stop_typing', (data) => {
    const { senderId, receiverId } = data;
    if (activeUsers[receiverId]) {
      io.to(activeUsers[receiverId]).emit('user_stopped_typing', { userId: senderId });
    }
  });

  // User disconnects
  socket.on('disconnect', () => {
    for (const [userId, socketId] of Object.entries(activeUsers)) {
      if (socketId === socket.id) {
        delete activeUsers[userId];
        console.log('User disconnected:', userId);
        break;
      }
    }
  });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
