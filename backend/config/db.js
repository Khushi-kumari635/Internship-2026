// config/db.js
// This file handles connecting our backend server to the MongoDB database.

const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // mongoose.connect() returns a promise, so we use async/await
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Error connecting to MongoDB: ${error.message}`);
    // If DB connection fails, stop the server (no point running without DB)
    process.exit(1);
  }
};

module.exports = connectDB;
