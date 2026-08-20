// models/Job.js
// Stores job and internship postings created by alumni.

const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: { type: String, required: true }, // e.g. "Software Engineer"
    company: { type: String, required: true },
    location: { type: String, required: true },
    type: {
      type: String,
      enum: ["Full-time", "Part-time", "Internship", "Contract"],
      default: "Full-time",
    },
    description: { type: String, required: true },
    skillsRequired: [{ type: String }],
    salary: { type: String, default: "Not disclosed" }, // e.g. "6-8 LPA"
    applyLink: { type: String, default: "" },

    // List of students/users who clicked "Apply"
    applicants: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        appliedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Job", jobSchema);
