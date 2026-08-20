// models/StudentProfile.js
// Stores extended profile information for users whose role is "student".

const mongoose = require("mongoose");

const studentProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    profilePhoto: { type: String, default: "" },
    fullName: { type: String, required: true },

    // Academic Background
    department: { type: String, required: true },
    rollNumber: { type: String, default: "" },
    currentYear: { type: Number, default: 1 }, // 1st, 2nd, 3rd, 4th year
    expectedGraduationYear: { type: Number },

    // Extra info
    skills: [{ type: String }],
    bio: { type: String, default: "" },
    location: { type: String, default: "" },
    phone: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("StudentProfile", studentProfileSchema);
