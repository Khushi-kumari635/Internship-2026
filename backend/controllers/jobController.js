// controllers/jobController.js
// Handles the Job Board: posting jobs, listing jobs, and applying to jobs.

const Job = require("../models/Job");

// @route   GET /api/jobs
// @desc    Get all job posts, with optional filters (type, location, search)
const getAllJobs = async (req, res) => {
  try {
    const { search, type, location } = req.query;
    const filter = {};

    if (search) {
      // Search across job title or company name
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { company: { $regex: search, $options: "i" } },
      ];
    }
    if (type) filter.type = type;
    if (location) filter.location = { $regex: location, $options: "i" };

    const jobs = await Job.find(filter)
      .populate("postedBy", "name email")
      .sort({ createdAt: -1 });

    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: "Error fetching job posts", error: error.message });
  }
};

// @route   GET /api/jobs/:id
// @desc    Get a single job's full details
const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate("postedBy", "name email");
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json(job);
  } catch (error) {
    res.status(500).json({ message: "Error fetching job details", error: error.message });
  }
};

// @route   POST /api/jobs
// @desc    Create a new job/internship post (alumni only)
const createJob = async (req, res) => {
  try {
    // Only alumni are allowed to post jobs
    if (req.user.role !== "alumni") {
      return res.status(403).json({ message: "Only alumni can post jobs" });
    }

    const { title, company, location, type, description, skillsRequired, salary, applyLink } = req.body;

    if (!title || !company || !location || !description) {
      return res.status(400).json({ message: "Please fill all required job fields" });
    }

    const job = await Job.create({
      postedBy: req.user.id,
      title,
      company,
      location,
      type,
      description,
      skillsRequired,
      salary,
      applyLink,
    });

    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ message: "Error creating job post", error: error.message });
  }
};

// @route   POST /api/jobs/:id/apply
// @desc    Apply to a job (adds the logged-in user to the applicants list)
const applyToJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });

    // Check if the user already applied
    const alreadyApplied = job.applicants.some(
      (applicant) => applicant.user.toString() === req.user.id
    );
    if (alreadyApplied) {
      return res.status(400).json({ message: "You have already applied to this job" });
    }

    job.applicants.push({ user: req.user.id });
    await job.save();

    res.json({ message: "Applied successfully!", totalApplicants: job.applicants.length });
  } catch (error) {
    res.status(500).json({ message: "Error applying to job", error: error.message });
  }
};

// @route   DELETE /api/jobs/:id
// @desc    Delete a job post (only the alumni who posted it can delete)
const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });

    if (job.postedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "You cannot delete this job post" });
    }

    await job.deleteOne();
    res.json({ message: "Job post deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting job post", error: error.message });
  }
};

module.exports = { getAllJobs, getJobById, createJob, applyToJob, deleteJob };
