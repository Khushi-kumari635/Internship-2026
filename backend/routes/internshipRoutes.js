// routes/internshipRoutes.js
const express = require("express");
const router = express.Router();
const {
  createInternshipRequest,
  getReceivedRequests,
  getSentRequests,
  updateRequestStatus,
} = require("../controllers/internshipController");
const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, createInternshipRequest);
router.get("/received", protect, getReceivedRequests);
router.get("/sent", protect, getSentRequests);
router.put("/:id/status", protect, updateRequestStatus);

module.exports = router;
