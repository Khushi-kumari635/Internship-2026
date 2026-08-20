// routes/jobRoutes.js
const express = require("express");
const router = express.Router();
const {
  getAllJobs,
  getJobById,
  createJob,
  applyToJob,
  deleteJob,
} = require("../controllers/jobController");
const { protect } = require("../middleware/authMiddleware");

router.get("/", getAllJobs); // public job board listing
router.get("/:id", getJobById); // public job details
router.post("/", protect, createJob); // alumni post a job
router.post("/:id/apply", protect, applyToJob); // students apply
router.delete("/:id", protect, deleteJob);

module.exports = router;
