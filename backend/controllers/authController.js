// controllers/authController.js
// Contains the logic for user registration and login.

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const AlumniProfile = require("../models/AlumniProfile");
const StudentProfile = require("../models/StudentProfile");

// Helper function to create a JWT token for a given user
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
};

// @route   POST /api/auth/register
// @desc    Register a new student or alumni user
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, department, graduationYear, currentYear } = req.body;

    // Basic validation
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "Please fill all required fields" });
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "An account with this email already exists" });
    }

    // Hash the password before saving (never store plain text passwords!)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create the base User record
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    // Depending on the role, also create the extended profile document
    if (role === "alumni") {
      await AlumniProfile.create({
        user: newUser._id,
        fullName: name,
        department: department || "Computer Science",
        graduationYear: graduationYear || new Date().getFullYear(),
      });
    } else if (role === "student") {
      await StudentProfile.create({
        user: newUser._id,
        fullName: name,
        department: department || "Computer Science",
        currentYear: currentYear || 1,
      });
    }

    // Generate a token so the user is logged in immediately after registering
    const token = generateToken(newUser);

    res.status(201).json({
      message: "Registration successful",
      token,
      user: { id: newUser._id, name: newUser.name, email: newUser.email, role: newUser.role },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error while registering user", error: error.message });
  }
};

// @route   POST /api/auth/login
// @desc    Login an existing user
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please provide email and password" });
    }

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Compare entered password with the hashed password in the DB
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = generateToken(user);

    res.json({
      message: "Login successful",
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error while logging in", error: error.message });
  }
};

module.exports = { registerUser, loginUser };
