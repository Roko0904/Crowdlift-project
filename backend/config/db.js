/* global require, module, process */
const mongoose = require("mongoose");
 
const connectDB = async () => {
  try {
    const conn = await mongoose.connect("mongodb+srv://roshankumar_db_user:crowdlift123@crowdlift0.gpprbjr.mongodb.net/crowdlift");
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1); 
  }
};

module.exports = connectDB;