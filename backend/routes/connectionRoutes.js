// routes/connectionRoutes.js
const express = require("express");
const router = express.Router();
const {
  sendConnectionRequest,
  getMyConnections,
  respondToConnection,
} = require("../controllers/connectionController");
const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, sendConnectionRequest);
router.get("/my", protect, getMyConnections);
router.put("/:id", protect, respondToConnection);

module.exports = router;
