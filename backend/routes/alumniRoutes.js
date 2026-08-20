// routes/alumniRoutes.js
const express = require("express");
const router = express.Router();
const {
  getAllAlumni,
  getAlumniById,
  updateAlumniProfile,
  getMyAlumniProfile,
} = require("../controllers/alumniController");
const { protect } = require("../middleware/authMiddleware");

// IMPORTANT: specific routes like "/me/profile" must be declared
// BEFORE the generic "/:id" route, otherwise Express will treat
// "me" as an :id value.
router.get("/me/profile", protect, getMyAlumniProfile);

router.get("/", getAllAlumni); // public directory listing with search/filter
router.get("/:id", getAlumniById); // public profile view
router.put("/:id", protect, updateAlumniProfile); // only owner can edit

module.exports = router;
