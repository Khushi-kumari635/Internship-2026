// controllers/internshipController.js
// Handles direct internship requests from students to alumni.

const InternshipRequest = require("../models/InternshipRequest");

// @route   POST /api/internships
// @desc    Student sends an internship request to a specific alumni
const createInternshipRequest = async (req, res) => {
  try {
    if (req.user.role !== "student") {
      return res.status(403).json({ message: "Only students can send internship requests" });
    }

    const { alumniUserId, message } = req.body;
    if (!alumniUserId || !message) {
      return res.status(400).json({ message: "Please provide alumni and a message" });
    }

    const request = await InternshipRequest.create({
      student: req.user.id,
      alumni: alumniUserId,
      message,
    });

    res.status(201).json(request);
  } catch (error) {
    res.status(500).json({ message: "Error creating internship request", error: error.message });
  }
};

// @route   GET /api/internships/received
// @desc    Alumni views internship requests sent to them
const getReceivedRequests = async (req, res) => {
  try {
    const requests = await InternshipRequest.find({ alumni: req.user.id })
      .populate("student", "name email")
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: "Error fetching requests", error: error.message });
  }
};

// @route   GET /api/internships/sent
// @desc    Student views internship requests they have sent
const getSentRequests = async (req, res) => {
  try {
    const requests = await InternshipRequest.find({ student: req.user.id })
      .populate("alumni", "name email")
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: "Error fetching requests", error: error.message });
  }
};

// @route   PUT /api/internships/:id/status
// @desc    Alumni accepts/rejects an internship request
const updateRequestStatus = async (req, res) => {
  try {
    const { status } = req.body; // "Accepted" or "Rejected"
    const request = await InternshipRequest.findById(req.params.id);

    if (!request) return res.status(404).json({ message: "Request not found" });
    if (request.alumni.toString() !== req.user.id) {
      return res.status(403).json({ message: "You cannot update this request" });
    }

    request.status = status;
    await request.save();
    res.json(request);
  } catch (error) {
    res.status(500).json({ message: "Error updating request status", error: error.message });
  }
};

module.exports = {
  createInternshipRequest,
  getReceivedRequests,
  getSentRequests,
  updateRequestStatus,
};
