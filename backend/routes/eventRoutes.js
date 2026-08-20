// routes/eventRoutes.js
const express = require("express");
const router = express.Router();
const {
  getAllEvents,
  getEventById,
  createEvent,
  rsvpToEvent,
  getMyRsvpStatus,
} = require("../controllers/eventController");
const { protect } = require("../middleware/authMiddleware");

router.get("/", getAllEvents); // public event listing
router.get("/:id", getEventById); // public event details
router.post("/", protect, createEvent);
router.post("/:id/rsvp", protect, rsvpToEvent);
router.get("/:id/my-rsvp", protect, getMyRsvpStatus);

module.exports = router;
