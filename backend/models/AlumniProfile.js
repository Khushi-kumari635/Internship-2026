// models/AlumniProfile.js
// Stores extended profile information for users whose role is "alumni".
// Linked to the User model via the "user" field (userId reference).

const mongoose = require("mongoose");

// A small sub-schema to store one entry of career/job history
const careerHistorySchema = new mongoose.Schema(
  {
    company: { type: String, required: true },
    jobTitle: { type: String, required: true },
    duration: { type: String }, // e.g. "2019 - 2022"
    description: { type: String },
  },
  { _id: false }
);

const alumniProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // reference to the User collection
      required: true,
      unique: true,
    },
    profilePhoto: {
      type: String,
      // We store an initials-based avatar URL or uploaded image URL as text
      default: "",
    },
    fullName: { type: String, required: true },

    // Academic Background
    department: { type: String, required: true }, // e.g. Computer Science
    degree: { type: String, default: "B.Tech" },
    graduationYear: { type: Number, required: true },

    // Career History
    currentCompany: { type: String, default: "" },
    jobTitle: { type: String, default: "" },
    industry: { type: String, default: "" }, // e.g. IT, Finance, Core Engineering
    careerHistory: [careerHistorySchema],

    // Skills & Bio
    skills: [{ type: String }],
    bio: { type: String, default: "" },

    // Contact & Location
    location: { type: String, default: "" }, // e.g. "Bengaluru, Karnataka"
    phone: { type: String, default: "" },

    // How many students/alumni this person is connected with (denormalized count)
    connectionsCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("AlumniProfile", alumniProfileSchema);
