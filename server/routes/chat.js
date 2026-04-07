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

// Mark message as read
router.put('/messages/:messageId/read', authMiddleware, async (req, res) => {
  try {
    const message = await Message.findById(req.params.messageId);
    
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    if (message.receiver.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Cannot mark others\' messages as read' });
    }

    message.status = 'read';
    message.read = true;
    message.readBy.push({ user: req.user._id, readAt: new Date() });
    await message.save();

    res.json({ message: 'Message marked as read' });
  } catch (error) {
    res.status(500).json({ message: 'Error marking message as read', error: error.message });
  }
});

// Mark all messages from a user as read
router.put('/messages/user/:userId/read-all', authMiddleware, async (req, res) => {
  try {
    const { userId } = req.params;

    await Message.updateMany(
      {
        sender: userId,
        receiver: req.user._id,
        status: { $ne: 'read' }
      },
      {
        $set: { status: 'read', read: true },
        $push: { readBy: { user: req.user._id, readAt: new Date() } }
      }
    );

    res.json({ message: 'All messages marked as read' });
  } catch (error) {
    res.status(500).json({ message: 'Error marking messages as read', error: error.message });
  }
});

// Get unread messages count
router.get('/unread-count', authMiddleware, async (req, res) => {
  try {
    const unreadCount = await Message.countDocuments({
      receiver: req.user._id,
      status: { $ne: 'read' }
    });

    res.json({ unreadCount });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching unread count', error: error.message });
  }
});

// Get unread count by user
router.get('/unread-count/:userId', authMiddleware, async (req, res) => {
  try {
    const { userId } = req.params;
    
    const unreadCount = await Message.countDocuments({
      sender: userId,
      receiver: req.user._id,
      status: { $ne: 'read' }
    });

    res.json({ unreadCount });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching unread count', error: error.message });
  }
});

// Update last seen
router.put('/last-seen', authMiddleware, async (req, res) => {
  try {
    req.user.lastSeen = new Date();
    await req.user.save();

    res.json({ message: 'Last seen updated' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating last seen', error: error.message });
  }
});

module.exports = router;
