// controllers/connectionController.js
// Handles connection (networking) requests between students and alumni.

const Connection = require("../models/Connection");

// @route   POST /api/connections
// @desc    Send a connection request to another user
const sendConnectionRequest = async (req, res) => {
  try {
    const { recipientId } = req.body;

    if (recipientId === req.user.id) {
      return res.status(400).json({ message: "You cannot connect with yourself" });
    }

    // Prevent duplicate connection requests
    const existing = await Connection.findOne({
      requester: req.user.id,
      recipient: recipientId,
    });
    if (existing) {
      return res.status(400).json({ message: "Connection request already sent" });
    }

    const connection = await Connection.create({
      requester: req.user.id,
      recipient: recipientId,
    });

    res.status(201).json(connection);
  } catch (error) {
    res.status(500).json({ message: "Error sending connection request", error: error.message });
  }
};

// @route   GET /api/connections/my
// @desc    Get all connections for the logged-in user (sent + received)
const getMyConnections = async (req, res) => {
  try {
    const connections = await Connection.find({
      $or: [{ requester: req.user.id }, { recipient: req.user.id }],
    })
      .populate("requester", "name email role")
      .populate("recipient", "name email role");

    res.json(connections);
  } catch (error) {
    res.status(500).json({ message: "Error fetching connections", error: error.message });
  }
};

// @route   PUT /api/connections/:id
// @desc    Accept or reject a connection request
const respondToConnection = async (req, res) => {
  try {
    const { status } = req.body; // "Accepted" or "Rejected"
    const connection = await Connection.findById(req.params.id);

    if (!connection) return res.status(404).json({ message: "Connection request not found" });
    if (connection.recipient.toString() !== req.user.id) {
      return res.status(403).json({ message: "You cannot respond to this request" });
    }

    connection.status = status;
    await connection.save();
    res.json(connection);
  } catch (error) {
    res.status(500).json({ message: "Error updating connection", error: error.message });
  }
};

module.exports = { sendConnectionRequest, getMyConnections, respondToConnection };
