// models/RSVP.js
// Tracks which users have RSVP'd for which events.

const mongoose = require("mongoose");

const rsvpSchema = new mongoose.Schema(
  {
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["Going", "Interested", "Not Going"],
      default: "Going",
    },
  },
  { timestamps: true }
);

// A user should only be able to RSVP once per event
// (this creates a unique combination of event + user in the database)
rsvpSchema.index({ event: 1, user: 1 }, { unique: true });

module.exports = mongoose.model("RSVP", rsvpSchema);
