import express from "express";
import User from "../models/user.js";
import bcrypt from "bcrypt";

const router = express.Router();

// ===== SIGNUP =====
router.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existing = await User.findOne({$or: [{ username},{ email }]});
    if (existing) return res.status(400).json({ msg: "Account already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword });
    await user.save();

    req.session.userId = user._id; // automatically log in after signup
    res.status(200).json({ msg: "Signup successful" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// ===== LOGIN =====
router.post("/login",  async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const user = await User.findOne({ username },{ email });
    if (!user) return res.status(400).json({ msg: "User doesn't exist" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid Credentials" });

    req.session.userId = user._id; // session cookie sent
    res.status(200).json({ msg: "Login successful" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// ===== LOGOUT =====
router.post("/logout", (req, res) => {
  req.session.destroy(err => {
    if (err) return res.status(500).json({ msg: "Logout failed" });
    res.clearCookie("connect.sid");
    res.json({ msg: "Logged out successfully" });
  });
});

// ===== CHECK SESSION =====
router.get("/me", (req, res) => {
  if (req.session.userId) return res.json({ loggedIn: true });
  res.json({ loggedIn: false });
});

export default router;
