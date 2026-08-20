// controllers/dashboardController.js
// Provides aggregated data for the Student/Alumni Dashboard page:
// statistics cards, recent jobs, upcoming events, etc.

const User = require("../models/User");
const AlumniProfile = require("../models/AlumniProfile");
const StudentProfile = require("../models/StudentProfile");
const Job = require("../models/Job");
const Event = require("../models/Event");
const Connection = require("../models/Connection");

// @route   GET /api/dashboard
// @desc    Get all data needed to render the dashboard for the logged-in user
const getDashboardData = async (req, res) => {
  try {
    const userId = req.user.id;

    // ---- Statistics Cards ----
    const totalAlumni = await AlumniProfile.countDocuments();
    const totalStudents = await StudentProfile.countDocuments();
    const totalJobs = await Job.countDocuments();
    const totalEvents = await Event.countDocuments();

    const myConnectionsCount = await Connection.countDocuments({
      $or: [{ requester: userId }, { recipient: userId }],
      status: "Accepted",
    });

    // ---- Recent / Upcoming Data ----
    const latestJobs = await Job.find().sort({ createdAt: -1 }).limit(4).populate("postedBy", "name");
    const upcomingEvents = await Event.find({ date: { $gte: new Date() } })
      .sort({ date: 1 })
      .limit(4);

    // ---- Simple hardcoded announcements (for demo purposes) ----
    const announcements = [
      {
        title: "Alumni Meet 2026 Registrations Open",
        date: new Date(),
        message: "Register now for the annual alumni gathering happening in Bengaluru.",
      },
      {
        title: "New Mentorship Program Launched",
        date: new Date(),
        message: "Alumni can now sign up to mentor final-year students for placements.",
      },
      {
        title: "Platform Update",
        date: new Date(),
        message: "You can now message alumni and students directly from their profile page.",
      },
    ];

    // Get the current user's basic info for the welcome section
    const currentUser = await User.findById(userId).select("name email role");

    res.json({
      user: currentUser,
      stats: {
        totalAlumni,
        totalStudents,
        totalJobs,
        totalEvents,
        myConnections: myConnectionsCount,
      },
      latestJobs,
      upcomingEvents,
      announcements,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching dashboard data", error: error.message });
  }
};

module.exports = { getDashboardData };
