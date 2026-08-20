// controllers/eventController.js
// Handles Event listing, details, and RSVP functionality.

const Event = require("../models/Event");
const RSVP = require("../models/RSVP");

// @route   GET /api/events
// @desc    Get all events (upcoming events first)
const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 });

    // For each event, also count how many people RSVP'd "Going"
    const eventsWithCounts = await Promise.all(
      events.map(async (event) => {
        const goingCount = await RSVP.countDocuments({ event: event._id, status: "Going" });
        return { ...event.toObject(), goingCount };
      })
    );

    res.json(eventsWithCounts);
  } catch (error) {
    res.status(500).json({ message: "Error fetching events", error: error.message });
  }
};

// @route   GET /api/events/:id
// @desc    Get a single event's details
const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    const goingCount = await RSVP.countDocuments({ event: event._id, status: "Going" });
    res.json({ ...event.toObject(), goingCount });
  } catch (error) {
    res.status(500).json({ message: "Error fetching event details", error: error.message });
  }
};

// @route   POST /api/events
// @desc    Create a new event (any logged-in user, e.g. alumni association)
const createEvent = async (req, res) => {
  try {
    const { title, description, eventType, date, time, location, organizer, image } = req.body;

    if (!title || !description || !date || !location) {
      return res.status(400).json({ message: "Please fill all required event fields" });
    }

    const event = await Event.create({
      title, description, eventType, date, time, location, organizer, image,
      createdBy: req.user.id,
    });

    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ message: "Error creating event", error: error.message });
  }
};

// @route   POST /api/events/:id/rsvp
// @desc    RSVP to an event ("Going", "Interested", "Not Going")
const rsvpToEvent = async (req, res) => {
  try {
    const { status } = req.body; // Going / Interested / Not Going
    const eventId = req.params.id;

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    // "Upsert": update the RSVP if it exists, otherwise create a new one.
    // This lets a user change their mind (e.g. Going -> Not Going).
    const rsvp = await RSVP.findOneAndUpdate(
      { event: eventId, user: req.user.id },
      { status: status || "Going" },
      { new: true, upsert: true }
    );

    res.json({ message: "RSVP recorded successfully", rsvp });
  } catch (error) {
    res.status(500).json({ message: "Error saving RSVP", error: error.message });
  }
};

// @route   GET /api/events/:id/my-rsvp
// @desc    Check the logged-in user's RSVP status for an event
const getMyRsvpStatus = async (req, res) => {
  try {
    const rsvp = await RSVP.findOne({ event: req.params.id, user: req.user.id });
    res.json({ status: rsvp ? rsvp.status : null });
  } catch (error) {
    res.status(500).json({ message: "Error fetching RSVP status", error: error.message });
  }
};

module.exports = { getAllEvents, getEventById, createEvent, rsvpToEvent, getMyRsvpStatus };
