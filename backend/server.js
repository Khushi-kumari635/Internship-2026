// server.js
// This is the main entry point of our backend application.
// It sets up the Express server, connects to MongoDB, and wires up all routes.

const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

// 👇 यह लाइन जोड़ो
console.log("MONGO_URI =", process.env.MONGO_URI);

const connectDB = require("./config/db");

// Import all route files
const authRoutes = require("./routes/authRoutes");
const alumniRoutes = require("./routes/alumniRoutes");
const studentRoutes = require("./routes/studentRoutes");
const jobRoutes = require("./routes/jobRoutes");
const internshipRoutes = require("./routes/internshipRoutes");
const eventRoutes = require("./routes/eventRoutes");
const connectionRoutes = require("./routes/connectionRoutes");
const messageRoutes = require("./routes/messageRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

// Connect to MongoDB
connectDB();

const app = express();

// ---- Middleware ----
app.use(cors());
app.use(express.json());

// ---- Serve the frontend static files ----
app.use(express.static(path.join(__dirname, "..", "frontend")));

// ---- API Routes ----
app.use("/api/auth", authRoutes);
app.use("/api/alumni", alumniRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/internships", internshipRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/connections", connectionRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/dashboard", dashboardRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Alumni Network API is running fine 🎓" });
});

// 404
app.use("/api", (req, res) => {
  res.status(404).json({ message: "API route not found" });
});

// Frontend
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "frontend", "index.html"));
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});