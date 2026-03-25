const express = require("express");
const router = express.Router();
const User = require("../models/User");


// ➕ SEND REQUEST
router.post("/send-request", async (req, res) => {
  console.log("🔥 SEND REQUEST HIT");

  const { from, to } = req.body;

  console.log("FROM:", from);
  console.log("TO:", to);

  try {
    // ✅ FIX: use username
    const receiver = await User.findOne({ username: to });

    if (!receiver) {
      console.log("❌ USER NOT FOUND");
      return res.status(404).json({ error: "User not found" });
    }

    if (!receiver.requests.includes(from)) {
      receiver.requests.push(from);
    }

    await receiver.save();

    console.log("✅ REQUEST SAVED:", receiver.requests);

    res.json({ message: "Request sent" });

  } catch (err) {
    console.error("❌ ERROR:", err);
    res.status(500).json({ error: "Failed to send request" });
  }
});


// 📥 GET REQUESTS
router.get("/requests/:username", async (req, res) => {
  try {
    console.log("📥 FETCH REQUESTS FOR:", req.params.username);

    const user = await User.findOne({
      username: req.params.username
    });

    console.log("FOUND USER:", user);

    if (!user) return res.json([]);

    res.json(user.requests || []);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching requests" });
  }
});


// ✅ ACCEPT REQUEST
router.post("/accept-request", async (req, res) => {
  const { from, to } = req.body;

  try {
    console.log("✅ ACCEPT HIT:", from, to);

    const user = await User.findOne({ username: to });
    const sender = await User.findOne({ username: from });

    if (!user || !sender) {
      return res.status(404).json({ error: "User not found" });
    }

    // remove request
    user.requests = user.requests.filter(r => r !== from);

    // add friends
    if (!user.friends.includes(from)) user.friends.push(from);
    if (!sender.friends.includes(to)) sender.friends.push(to);

    await user.save();
    await sender.save();

    res.json({ message: "Request accepted" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to accept request" });
  }
});


// 👥 GET FRIENDS LIST
router.get("/list/:username", async (req, res) => {
  try {
    const user = await User.findOne({
      username: req.params.username
    });

    if (!user) return res.json([]);

    res.json(user.friends || []);

  } catch (err) {
    res.status(500).json({ error: "Failed to fetch friends" });
  }
});


const axios = require("axios");

router.get("/leaderboard/:username", async (req, res) => {
  try {
    const user = await User.findOne({
      username: req.params.username
    });

    if (!user) return res.json([]);

    const friends = user.friends || [];

    let leaderboard = [];

    for (let friend of friends) {
      try {
        const f = await User.findOne({ username: friend });

        const statsRes = await axios.get(
          `http://localhost:5000/api/stats?lc=${f.lcUsername}&cc=${f.ccUsername}&cf=${f.cfUsername}`
        );

        leaderboard.push({
          username: friend,
          total: statsRes.data.combined.totalSolved
        });

      } catch (err) {
        console.log("Failed for", friend);
      }
    }

    // 🔥 sort descending
    leaderboard.sort((a, b) => b.total - a.total);

    res.json(leaderboard);

  } catch (err) {
    res.status(500).json({ error: "Leaderboard failed" });
  }
});
module.exports = router;