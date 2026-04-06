const express = require('express');
const User = require('../models/User');
const Message = require('../models/Message');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Get all users
router.get('/users', authMiddleware, async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.user._id } }).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
});

// Get user profile
router.get('/profile', authMiddleware, (req, res) => {
  res.json(req.user);
});

// Update user status
router.put('/status', authMiddleware, async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['online', 'offline', 'away'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    req.user.status = status;
    await req.user.save();

    res.json({ message: 'Status updated', user: req.user });
  } catch (error) {
    res.status(500).json({ message: 'Error updating status', error: error.message });
  }
});

// Get chat history
router.get('/messages/:userId', authMiddleware, async (req, res) => {
  try {
    const { userId } = req.params;
    
    const messages = await Message.find({
      $or: [
        { sender: req.user._id, receiver: userId },
        { sender: userId, receiver: req.user._id }
      ]
    }).sort({ timestamp: 1 }).populate('sender', 'username avatar').populate('receiver', 'username avatar');

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching messages', error: error.message });
  }
});

module.exports = router;
