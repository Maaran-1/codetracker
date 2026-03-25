const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is missing ❌");
    }

    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB Atlas Connected ✅");
  } catch (err) {
    console.error("Mongo Error:", err.message);
    // ❌ DO NOT crash app
  }
};

module.exports = connectDB;
