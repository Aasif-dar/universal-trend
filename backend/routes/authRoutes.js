// routes/auth.js
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "../models/User.js";
import OTP from "../models/Otp.js";
import { sendOTPEmail } from "../utils/sendEmail.js";

const router = express.Router();

/* ─────────────────────────────────────────
   Helper: generate 6-digit OTP
───────────────────────────────────────── */
const generateOTP = () =>
  crypto.randomInt(100000, 999999).toString();

/* ─────────────────────────────────────────
   STEP 1 of REGISTER — send OTP
   POST /api/auth/send-otp
   Body: { name, email, password }
───────────────────────────────────────── */
router.post("/send-otp", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ message: "All fields are required" });

    // Check if already registered
    const exists = await User.findOne({ email });
    if (exists)
      return res.status(409).json({ message: "Email already registered" });

    // Delete any old OTPs for this email
    await OTP.deleteMany({ email, type: "verify" });

    // Create & send OTP
    const otp = generateOTP();
    await OTP.create({
      email,
      otp,
      type: "verify",
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 min
    });

    await sendOTPEmail(email, otp, "verify");

    // Temporarily store form data in a short-lived OTP doc is enough;
    // client sends name+email+password again on /verify-otp
    res.json({ message: "OTP sent to your email" });

  } catch (error) {
    console.error("SEND-OTP ERROR:", error);
    res.status(500).json({ message: "Failed to send OTP" });
  }
});

/* ─────────────────────────────────────────
   STEP 2 of REGISTER — verify OTP & create account
   POST /api/auth/verify-otp
   Body: { name, email, password, otp }
───────────────────────────────────────── */
router.post("/verify-otp", async (req, res) => {
  try {
    const { name, email, password, otp } = req.body;

    if (!name || !email || !password || !otp)
      return res.status(400).json({ message: "All fields are required" });

    // Find OTP record
    const record = await OTP.findOne({ email, type: "verify", used: false });

    if (!record)
      return res.status(400).json({ message: "OTP not found or already used" });

    if (new Date() > record.expiresAt)
      return res.status(400).json({ message: "OTP expired. Please request a new one." });

    if (record.otp !== otp.trim())
      return res.status(400).json({ message: "Incorrect OTP" });

    // Mark OTP used
    record.used = true;
    await record.save();

    // Check again (race condition guard)
    const alreadyExists = await User.findOne({ email });
    if (alreadyExists)
      return res.status(409).json({ message: "Email already registered" });

    // Assign role
    const count = await User.countDocuments();
    const role = count === 0 ? "admin" : "user";

    // Hash & create
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword, role });

    // Token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      token,
      user: { _id: user._id, name: user.name, email: user.email, role: user.role },
    });

  } catch (error) {
    console.error("VERIFY-OTP ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/* ─────────────────────────────────────────
   LOGIN (unchanged — no OTP needed for login)
   POST /api/auth/login
───────────────────────────────────────── */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Email and password required" });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: { _id: user._id, name: user.name, email: user.email, role: user.role },
    });

  } catch (error) {
    console.error("LOGIN ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/* ─────────────────────────────────────────
   FORGOT PASSWORD STEP 1 — send OTP
   POST /api/auth/forgot-password
   Body: { email }
───────────────────────────────────────── */
router.post("/forgot-password", async (req, res) => {

  try {

    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const otp = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    user.resetOTP = otp;

    await user.save();

    await sendOTPEmail(email, otp);

    return res.json({
      message: "OTP sent successfully",
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Server error",
    });
  }
});

/* ─────────────────────────────────────────
   FORGOT PASSWORD STEP 2 — verify OTP + set new password
   POST /api/auth/reset-password
   Body: { email, otp, newPassword }
───────────────────────────────────────── */
router.post("/reset-password", async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword)
      return res.status(400).json({ message: "All fields are required" });

    if (newPassword.length < 6)
      return res.status(400).json({ message: "Password must be at least 6 characters" });

    const record = await OTP.findOne({ email, type: "reset", used: false });

    if (!record)
      return res.status(400).json({ message: "OTP not found or already used" });

    if (new Date() > record.expiresAt)
      return res.status(400).json({ message: "OTP expired. Please request a new one." });

    if (record.otp !== otp.trim())
      return res.status(400).json({ message: "Incorrect OTP" });

    // Mark used
    record.used = true;
    await record.save();

    // Update password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.findOneAndUpdate({ email }, { password: hashedPassword });

    res.json({ message: "Password reset successfully. You can now login." });

  } catch (error) {
    console.error("RESET-PASSWORD ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/* ─────────────────────────────────────────
   RESEND OTP (for both verify & reset)
   POST /api/auth/resend-otp
   Body: { email, type } — type: "verify" | "reset"
───────────────────────────────────────── */
router.post("/resend-otp", async (req, res) => {
  try {
    const { email, type } = req.body;

    if (!email || !type)
      return res.status(400).json({ message: "Email and type required" });

    await OTP.deleteMany({ email, type });

    const otp = generateOTP();
    await OTP.create({
      email,
      otp,
      type,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    });

    await sendOTPEmail(email, otp, type);
    res.json({ message: "New OTP sent" });

  } catch (error) {
    console.error("RESEND-OTP ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;