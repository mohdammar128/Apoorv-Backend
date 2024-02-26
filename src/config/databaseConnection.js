const mongoose = require("mongoose");

async function connectToDatabase() {
  try {
    const MONGO_DB_URL = process.env.MONGO_URL;
    await mongoose.connect(MONGO_DB_URL);

    console.log("Connected to the database");
  } catch (error) {
    console.error("Error connecting to the database:", error.message);
  }
}

module.exports = connectToDatabase;
