// routes/studentRoutes.js
const express = require("express");
const router = express.Router();
const {
  getMyStudentProfile,
  updateStudentProfile,
  getAllStudents,
} = require("../controllers/studentController");
const { protect } = require("../middleware/authMiddleware");

router.get("/me/profile", protect, getMyStudentProfile);
router.get("/", protect, getAllStudents);
router.put("/:id", protect, updateStudentProfile);

module.exports = router;
