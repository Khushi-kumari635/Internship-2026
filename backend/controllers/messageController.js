// controllers/messageController.js
// Handles sending and reading direct messages between users.

const Message = require("../models/Message");

// @route   POST /api/messages
// @desc    Send a message to another user
const sendMessage = async (req, res) => {
  try {
    const { receiverId, content } = req.body;

    if (!receiverId || !content) {
      return res.status(400).json({ message: "Please provide receiver and message content" });
    }

    const message = await Message.create({
      sender: req.user.id,
      receiver: receiverId,
      content,
    });

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: "Error sending message", error: error.message });
  }
};

// @route   GET /api/messages/:userId
// @desc    Get the full conversation between the logged-in user and another user
const getConversation = async (req, res) => {
  try {
    const otherUserId = req.params.userId;

    const messages = await Message.find({
      $or: [
        { sender: req.user.id, receiver: otherUserId },
        { sender: otherUserId, receiver: req.user.id },
      ],
    }).sort({ createdAt: 1 }); // oldest first, like a normal chat

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: "Error fetching conversation", error: error.message });
  }
};

// @route   GET /api/messages
// @desc    Get a list of recent conversations for the logged-in user (inbox)
const getInbox = async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [{ sender: req.user.id }, { receiver: req.user.id }],
    })
      .populate("sender", "name email")
      .populate("receiver", "name email")
      .sort({ createdAt: -1 });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: "Error fetching inbox", error: error.message });
  }
};

module.exports = { sendMessage, getConversation, getInbox };
