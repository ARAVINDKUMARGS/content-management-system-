const express = require('express');
const Message = require('../models/Message');
const User = require('../models/User');
const { authenticateUser } = require('../middleware/auth');

const router = express.Router();

router.use(authenticateUser);

// Get conversation between authenticated user and target user
router.get('/:userId', async (req, res) => {
  try {
    const currentUserId = req.user._id || req.user.id;
    const selectedUserId = req.params.userId;

    const messages = await Message.find({
      $or: [
        {
          sender: currentUserId,
          receiver: selectedUserId,
        },
        {
          sender: selectedUserId,
          receiver: currentUserId,
        },
      ],
    }).sort({ createdAt: 1 });

    res.json({
      success: true,
      messages,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch messages',
      error: error.message,
    });
  }
});

// Send a new message
router.post('/', async (req, res) => {
  try {
    const sender = req.user._id || req.user.id;
    const { receiver, text } = req.body;

    if (!receiver || !text?.trim()) {
      return res.status(400).json({
        success: false,
        message: 'receiver and text are required',
      });
    }

    const message = await Message.create({
      sender,
      receiver,
      text: text.trim(),
    });

    const io = req.app.get('io');
    if (io) {
      io.to(receiver.toString()).emit('receive_message', message);
    }

    res.status(201).json({
      success: true,
      message,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to send message',
      error: error.message,
    });
  }
});

module.exports = router;
