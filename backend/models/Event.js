// models/Event.js
// Stores events such as reunions, webinars, and meetups.

const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    eventType: {
      type: String,
      enum: ["Reunion", "Webinar", "Meetup", "Workshop", "Networking"],
      default: "Meetup",
    },
    date: { type: Date, required: true },
    time: { type: String, default: "10:00 AM" },
    location: { type: String, required: true }, // "Online" or physical address
    organizer: { type: String, default: "Alumni Association" },
    image: { type: String, default: "" }, // emoji or image URL used on the card
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Event", eventSchema);
