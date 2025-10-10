import express from "express";
import bcrypt from "bcrypt";
import User from "../models/user.js";

const router = express.Router();

// ===== SIGNUP =====
router.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existing = await User.findOne({ $or: [{ username }, { email }] });
    if (existing) return res.status(400).json({ msg: "Account already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword });
    await user.save();

    req.session.userId = user._id; // auto-login
    res.status(200).json({ msg: "Signup successful", username: user.username });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// ===== LOGIN =====
router.post("/login", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const user = await User.findOne({ $or: [{ username }, { email }] });
    if (!user) return res.status(400).json({ msg: "User doesn't exist" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    req.session.userId = user._id;
    res.status(200).json({ msg: "Login successful", username: user.username });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// ===== CHECK SESSION =====
router.get("/me", async (req, res) => {
  if (req.session.userId) {
    try {
      const user = await User.findById(req.session.userId).select('username email');
      if (user) {
        return res.json({ loggedIn: true, userId: req.session.userId, username: user.username });
      }
    } catch (err) {
      console.error("Error fetching user:", err);
    }
  }
  res.json({ loggedIn: false });
});

// ===== LOGOUT =====
router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).json({ msg: "Logout failed" });
    res.clearCookie("connect.sid");
    res.json({ msg: "Logged out successfully" });
  });
});

export default router;
