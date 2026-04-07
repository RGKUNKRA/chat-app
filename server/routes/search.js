const express = require('express');
const User = require('../models/User');
const Group = require('../models/Group');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Search users
router.get('/users/:query', authMiddleware, async (req, res) => {
  try {
    const { query } = req.params;

    if (!query || query.length < 2) {
      return res.status(400).json({ message: 'Query must be at least 2 characters' });
    }

    const users = await User.find({
      $and: [
        { _id: { $ne: req.user._id } },
        {
          $or: [
            { username: { $regex: query, $options: 'i' } },
            { email: { $regex: query, $options: 'i' } }
          ]
        }
      ]
    }).select('-password').limit(10);

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Search error', error: error.message });
  }
});

// Search groups
router.get('/groups/:query', authMiddleware, async (req, res) => {
  try {
    const { query } = req.params;

    if (!query || query.length < 2) {
      return res.status(400).json({ message: 'Query must be at least 2 characters' });
    }

    const groups = await Group.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } }
      ]
    }).populate('creator', 'username').populate('members', 'username').limit(10);

    res.json(groups);
  } catch (error) {
    res.status(500).json({ message: 'Search error', error: error.message });
  }
});

module.exports = router;
