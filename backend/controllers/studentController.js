// controllers/studentController.js
// Handles student profile viewing and updating.

const StudentProfile = require("../models/StudentProfile");

// @route   GET /api/students/me/profile
// @desc    Get the logged-in student's own profile
const getMyStudentProfile = async (req, res) => {
  try {
    const profile = await StudentProfile.findOne({ user: req.user.id }).populate("user", "name email");
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: "Error fetching your profile", error: error.message });
  }
};

// @route   PUT /api/students/:id
// @desc    Update a student profile (only the owner should do this)
const updateStudentProfile = async (req, res) => {
  try {
    const profile = await StudentProfile.findById(req.params.id);
    if (!profile) {
      return res.status(404).json({ message: "Student profile not found" });
    }

    if (profile.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "You are not allowed to edit this profile" });
    }

    const updatableFields = [
      "profilePhoto", "fullName", "department", "rollNumber",
      "currentYear", "expectedGraduationYear", "skills", "bio", "location", "phone",
    ];

    updatableFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        profile[field] = req.body[field];
      }
    });

    const updated = await profile.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Error updating student profile", error: error.message });
  }
};

// @route   GET /api/students
// @desc    Get all students (useful for alumni to browse/mentor)
const getAllStudents = async (req, res) => {
  try {
    const students = await StudentProfile.find().populate("user", "name email").sort({ createdAt: -1 });
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: "Error fetching students", error: error.message });
  }
};

module.exports = { getMyStudentProfile, updateStudentProfile, getAllStudents };
