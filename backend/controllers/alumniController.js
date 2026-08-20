// controllers/alumniController.js
// Handles the Alumni Directory and Alumni Profile features.

const AlumniProfile = require("../models/AlumniProfile");

// @route   GET /api/alumni
// @desc    Get all alumni, with optional search & filters
//          Query params: search, batch, location, industry
const getAllAlumni = async (req, res) => {
  try {
    const { search, batch, location, industry } = req.query;

    // Build a dynamic MongoDB filter object based on query params
    const filter = {};

    if (search) {
      // Case-insensitive search on the full name
      filter.fullName = { $regex: search, $options: "i" };
    }
    if (batch) {
      filter.graduationYear = Number(batch);
    }
    if (location) {
      filter.location = { $regex: location, $options: "i" };
    }
    if (industry) {
      filter.industry = { $regex: industry, $options: "i" };
    }

    const alumniList = await AlumniProfile.find(filter)
      .populate("user", "name email") // bring in basic user info too
      .sort({ createdAt: -1 });

    res.json(alumniList);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching alumni directory", error: error.message });
  }
};

// @route   GET /api/alumni/:id
// @desc    Get a single alumni profile by its profile ID
const getAlumniById = async (req, res) => {
  try {
    const alumni = await AlumniProfile.findById(req.params.id).populate("user", "name email");
    if (!alumni) {
      return res.status(404).json({ message: "Alumni profile not found" });
    }
    res.json(alumni);
  } catch (error) {
    res.status(500).json({ message: "Error fetching alumni profile", error: error.message });
  }
};

// @route   PUT /api/alumni/:id
// @desc    Update an alumni profile (only the owner should do this)
const updateAlumniProfile = async (req, res) => {
  try {
    const alumni = await AlumniProfile.findById(req.params.id);
    if (!alumni) {
      return res.status(404).json({ message: "Alumni profile not found" });
    }

    // Ensure the logged-in user owns this profile
    if (alumni.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "You are not allowed to edit this profile" });
    }

    // Update only the fields provided in the request body
    const updatableFields = [
      "profilePhoto", "fullName", "department", "degree", "graduationYear",
      "currentCompany", "jobTitle", "industry", "careerHistory",
      "skills", "bio", "location", "phone",
    ];

    updatableFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        alumni[field] = req.body[field];
      }
    });

    const updated = await alumni.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Error updating alumni profile", error: error.message });
  }
};

// @route   GET /api/alumni/me/profile
// @desc    Get the logged-in alumni's own profile
const getMyAlumniProfile = async (req, res) => {
  try {
    const profile = await AlumniProfile.findOne({ user: req.user.id }).populate("user", "name email");
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: "Error fetching your profile", error: error.message });
  }
};

module.exports = { getAllAlumni, getAlumniById, updateAlumniProfile, getMyAlumniProfile };
