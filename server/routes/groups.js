const express = require('express');
const Group = require('../models/Group');
const Message = require('../models/Message');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Create group
router.post('/create', authMiddleware, async (req, res) => {
  try {
    const { name, description, memberIds } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Group name is required' });
    }

    const members = [req.user._id, ...(memberIds || [])];
    const group = new Group({
      name,
      description: description || '',
      creator: req.user._id,
      members
    });

    await group.save();
    await group.populate('members', 'username avatar status');

    res.status(201).json({
      message: 'Group created successfully',
      group
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating group', error: error.message });
  }
});

// Get user's groups
router.get('/my-groups', authMiddleware, async (req, res) => {
  try {
    const groups = await Group.find({ members: req.user._id })
      .populate('creator', 'username')
      .populate('members', 'username avatar status')
      .sort({ updatedAt: -1 });

    res.json(groups);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching groups', error: error.message });
  }
});

// Get group details
router.get('/:groupId', authMiddleware, async (req, res) => {
  try {
    const group = await Group.findById(req.params.groupId)
      .populate('creator', 'username')
      .populate('members', 'username avatar status');

    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    if (!group.members.some(m => m._id.toString() === req.user._id.toString())) {
      return res.status(403).json({ message: 'Not a member of this group' });
    }

    res.json(group);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching group', error: error.message });
  }
});

// Add member to group
router.post('/:groupId/add-member', authMiddleware, async (req, res) => {
  try {
    const { userId } = req.body;
    const group = await Group.findById(req.params.groupId);

    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    if (group.creator.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only group creator can add members' });
    }

    if (group.members.includes(userId)) {
      return res.status(400).json({ message: 'User already in group' });
    }

    group.members.push(userId);
    await group.save();
    await group.populate('members', 'username avatar status');

    res.json({ message: 'Member added', group });
  } catch (error) {
    res.status(500).json({ message: 'Error adding member', error: error.message });
  }
});

// Remove member from group
router.post('/:groupId/remove-member', authMiddleware, async (req, res) => {
  try {
    const { userId } = req.body;
    const group = await Group.findById(req.params.groupId);

    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    if (group.creator.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only group creator can remove members' });
    }

    group.members = group.members.filter(m => m.toString() !== userId);
    await group.save();
    await group.populate('members', 'username avatar status');

    res.json({ message: 'Member removed', group });
  } catch (error) {
    res.status(500).json({ message: 'Error removing member', error: error.message });
  }
});

// Get group messages
router.get('/:groupId/messages', authMiddleware, async (req, res) => {
  try {
    const messages = await Message.find({ group: req.params.groupId })
      .sort({ timestamp: 1 })
      .populate('sender', 'username avatar')
      .limit(50);

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching messages', error: error.message });
  }
});

module.exports = router;
