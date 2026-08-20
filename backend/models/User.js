// models/User.js
// This is the base "User" model used for authentication (login/register).
// Both students and alumni are stored here, and the "role" field
// tells us which type of user they are.

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true, // no two users can have the same email
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
      // Note: password is stored as a bcrypt hash, never as plain text
    },
    role: {
      type: String,
      enum: ["student", "alumni"], // only these two roles are allowed
      required: true,
    },
  },
  {
    timestamps: true, // automatically adds createdAt and updatedAt fields
  }
);

module.exports = mongoose.model("User", userSchema);
