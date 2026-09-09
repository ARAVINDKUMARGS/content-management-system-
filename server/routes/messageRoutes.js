const express = require("express");
const Message = require("../models/Message");
const User = require("../models/User");

const router = express.Router();

// Get conversation between two users
router.get("/:userId", async (req, res) => {
  try {
    const currentUserId = req.query.currentUserId;
    const selectedUserId = req.params.userId;

    if (!currentUserId) {
      return res.status(400).json({
        success: false,
        message: "currentUserId is required",
      });
    }

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
      message: "Failed to fetch messages",
      error: error.message,
    });
  }
});

// Send a new message
router.post("/", async (req, res) => {
  try {
    const { sender, receiver, text } = req.body;

    if (!sender || !receiver || !text?.trim()) {
      return res.status(400).json({
        success: false,
        message: "sender, receiver and text are required",
      });
    }

    const message = await Message.create({
      sender,
      receiver,
      text: text.trim(),
    });

    // Update receiver/sender preview
    await User.findByIdAndUpdate(sender, {
      lastMessage: text.trim(),
      lastMessageTime: new Date(),
    });

    await User.findByIdAndUpdate(receiver, {
      lastMessage: text.trim(),
      lastMessageTime: new Date(),
    });

    res.status(201).json({
      success: true,
      message,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to send message",
      error: error.message,
    });
  }
});

module.exports = router;