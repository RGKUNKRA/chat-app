require('dotenv').config();
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const Message = require('./models/Message');

// Routes
const authRoutes = require('./routes/auth');
const chatRoutes = require('./routes/chat');
const groupRoutes = require('./routes/groups');
const searchRoutes = require('./routes/search');

// Initialize app
const app = express();
const server = http.createServer(app);

// Handle CORS - allow both development and production URLs
const clientUrl = process.env.CLIENT_URL || 'http://localhost:3001';
const isDevelopment = process.env.NODE_ENV !== 'production';

// Build CORS origin list
const corsOrigins = isDevelopment 
  ? [clientUrl, 'http://localhost:3000', 'http://localhost:3001', 'http://127.0.0.1:3000', 'http://127.0.0.1:3001']
  : [clientUrl]; // Production: only allow CLIENT_URL

console.log('Client URL allowed:', clientUrl);
console.log('CORS Origins:', corsOrigins);

const io = socketIo(server, {
  cors: {
    origin: corsOrigins,
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Middleware
app.use(cors({
  origin: corsOrigins,
  credentials: true
}));
app.use(express.json());

// Connect to database
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/search', searchRoutes);

// Serve React app
const buildPath = path.join(__dirname, '../client/build');
app.use(express.static(buildPath));

// SPA fallback - serve index.html for all non-API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'));
});

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
        text,
        status: 'sent'
      });

      await message.save();

      // Send to receiver if online
      if (activeUsers[receiverId]) {
        io.to(activeUsers[receiverId]).emit('receive_message', {
          id: message._id,
          sender: senderId,
          receiver: receiverId,
          text,
          status: 'delivered',
          timestamp: message.timestamp
        });

        // Update message status to delivered
        message.status = 'delivered';
        await message.save();
      }

      // Send confirmation to sender
      socket.emit('message_sent', { id: message._id, status: 'sent' });
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

  // Send group message
  socket.on('send_group_message', async (data) => {
    try {
      const { senderId, groupId, text } = data;
      const Message = require('./models/Message');

      // Save message to database
      const message = new Message({
        sender: senderId,
        group: groupId,
        text
      });

      await message.save();
      await message.populate('sender', 'username avatar');

      // Broadcast to all users in the group
      io.emit('receive_group_message', {
        id: message._id,
        sender: message.sender,
        group: groupId,
        text,
        timestamp: message.timestamp
      });

      // Send confirmation to sender
      socket.emit('group_message_sent', { id: message._id });
    } catch (error) {
      console.error('Error sending group message:', error);
    }
  });

  // Join group room
  socket.on('join_group', (groupId) => {
    socket.join(`group_${groupId}`);
    console.log(`User ${socket.id} joined group ${groupId}`);
  });

  // Leave group room
  socket.on('leave_group', (groupId) => {
    socket.leave(`group_${groupId}`);
    console.log(`User ${socket.id} left group ${groupId}`);
  });

  // Mark message as read
  socket.on('mark_message_read', async (data) => {
    try {
      const { messageId, senderId } = data;
      const message = await Message.findByIdAndUpdate(
        messageId,
        { status: 'read', read: true },
        { new: true }
      );

      // Send read receipt to sender
      if (activeUsers[senderId]) {
        io.to(activeUsers[senderId]).emit('message_read', {
          messageId,
          status: 'read'
        });
      }
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  });

  // User disconnects
  socket.on('disconnect', () => {
    for (const [userId, socketId] of Object.entries(activeUsers)) {
      if (socketId === socket.id) {
        delete activeUsers[userId];
        console.log('User disconnected:', userId);
        
        // Update user lastSeen
        const User = require('./models/User');
        User.findByIdAndUpdate(userId, { lastSeen: new Date(), status: 'offline' })
          .catch(err => console.error('Error updating lastSeen:', err));
        
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
