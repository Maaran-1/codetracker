const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB Atlas Connected ✅");
  } catch (err) {
    console.error("Mongo Error:", err.message);
    process.exit(1);
  }
};
console.log("MONGO_URI:", process.env.MONGO_URI);
module.exports = connectDB;
