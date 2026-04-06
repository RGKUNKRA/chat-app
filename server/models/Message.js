const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Sender is required']
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Receiver is required']
  },
  text: {
    type: String,
    required: [true, 'Message text is required'],
    minlength: [1, 'Message cannot be empty'],
    maxlength: [2000, 'Message cannot exceed 2000 characters'],
    trim: true
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true // Index for efficient sorting by timestamp
  },
  read: {
    type: Boolean,
    default: false,
    index: true // Index for querying unread messages
  }
}, { timestamps: true });

// Create compound indexes for efficient queries
// For fetching conversation between two users
messageSchema.index({ sender: 1, receiver: 1, timestamp: -1 });

// For finding unread messages for a user
messageSchema.index({ receiver: 1, read: 1 });

// For removing old messages (TTL index - auto-delete after 90 days)
messageSchema.index({ timestamp: 1 }, { expireAfterSeconds: 7776000 });

// Validate that sender and receiver are different
messageSchema.pre('save', function(next) {
  if (this.sender.equals(this.receiver)) {
    next(new Error('Sender and receiver cannot be the same user'));
  } else {
    next();
  }
});

module.exports = mongoose.model('Message', messageSchema);
