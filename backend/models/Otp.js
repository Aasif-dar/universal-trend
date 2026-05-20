// models/OTP.js
import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  email:     { type: String, required: true },
  otp:       { type: String, required: true },
  type:      { type: String, enum: ["verify", "reset"], required: true },
  expiresAt: { type: Date,   required: true },
  used:      { type: Boolean, default: false },
});

// Auto-delete expired docs
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model("OTP", otpSchema);