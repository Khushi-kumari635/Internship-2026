// models/InternshipRequest.js
// Lets a student directly REQUEST internship guidance/opportunities
// from a specific alumni (different from applying to a posted Job).

const mongoose = require("mongoose");

const internshipRequestSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    alumni: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: {
      type: String,
      required: true, // student explains what kind of internship they need
    },
    status: {
      type: String,
      enum: ["Pending", "Accepted", "Rejected"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("InternshipRequest", internshipRequestSchema);
