const express = require("express");
const router = express.Router();
const User = require("../models/User");


// 📝 REGISTER
router.post("/register", async (req, res) => {
  const { username, password } = req.body;

  console.log("➡️ REGISTER:", username, password);

  try {
    const user = new User({ username, password });
    await user.save();

    res.json({ message: "Registered" });
  } catch (err) {
    res.status(500).json({ error: "Register failed" });
  }
});


// 🔐 LOGIN
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user || user.password !== password) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    res.json({ message: "Login success", user });

  } catch (err) {
    res.status(500).json({ error: "Login failed" });
  }
});

module.exports = router;