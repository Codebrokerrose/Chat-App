const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");


const UserModel = require("../models/UserModel");
const TokenModel = require("../models/token");
const sendEmail = require("../utils/sendEmail");

// Controllers
const checkEmail = require("../controller/checkEmail");
const checkPassword = require("../controller/checkPassword");
const userDetails = require("../controller/userDetails");
const logOut = require("../controller/logout");
const updateUserDetails = require("../controller/updateUserDetails");
const searchUser = require("../controller/searchUser");
const anonSessionRoutes = require("./anonSession");


// Password reset controllers

const forgotPassword = require("../controller/forgotPassword");
const resetPassword = require("../controller/resetPassword");
// --- Inline: Verify Reset Code ---
const verifyResetCode = async (req, res) => {
  const { email, code } = req.body;

  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const token = await TokenModel.findOne({ userId: user._id, token: code });
    if (!token) {
      return res.status(400).json({ message: "Invalid or expired code" });
    }

    // Optionally delete token if single-use
    // await token.deleteOne();

    return res.status(200).json({ message: "Code verified", userId: user._id });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};



// const changePassword = require("../controller/changePassword");


// --- Password Reset Routes ---
router.post("/forgot-password", forgotPassword); // Step 1: Send reset code
router.post("/verify-reset-code", verifyResetCode); // Step 2: Verify reset code
router.post("/reset-password", resetPassword); // Step 3: Reset password
// router.post("/change-password", changePassword); // Step 4: Change password when logged in

// --- Registration: Step 1 - Send verification code ---
router.post("/send-verification-code", async (req, res) => {
  try {
    const { email } = req.body;

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User already exists", success: false });
    }

    const secretKey = Math.floor(100000 + Math.random() * 900000).toString();
    const token = new TokenModel({ email, token: secretKey });
    await token.save();

    const message = `Your verification code is: ${secretKey}`;
    await sendEmail(email, "Verify Your Email", message);

    res
      .status(200)
      .json({ message: "Verification code sent to email", success: true });
  } catch (error) {
    console.error("Send code error:", error);
    res
      .status(500)
      .json({ message: "Failed to send verification code", success: false });
  }
});

// --- Registration: Step 2 - Register user after verifying code ---
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, profile_pic, verificationCode } = req.body;

    const tokenRecord = await TokenModel.findOne({
      email,
      token: verificationCode,
    });
    if (!tokenRecord) {
      return res
        .status(400)
        .json({ message: "Invalid or expired code", success: false });
    }

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User already exists", success: false });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new UserModel({
      name,
      email,
      password: hashedPassword,
      profile_pic,
      verified: true,
    });

    await newUser.save();
    await tokenRecord.deleteOne();

    res
      .status(201)
      .json({ message: "User registered successfully", success: true });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Registration failed", success: false });
  }
});

// --- Optional: Manual verification using userId and code ---
router.post("/verify-email", async (req, res) => {
  try {
    const { userId, verificationCode } = req.body;

    const user = await UserModel.findById(userId);
    if (!user) {
      return res
        .status(400)
        .json({ message: "User not found", success: false });
    }

    const tokenRecord = await TokenModel.findOne({
      userId,
      token: verificationCode,
    });
    if (!tokenRecord) {
      return res
        .status(400)
        .json({ message: "Invalid or expired code", success: false });
    }

    user.verified = true;
    await user.save();
    await tokenRecord.deleteOne();

    res
      .status(200)
      .json({ message: "Email verified successfully", success: true });
  } catch (error) {
    console.error("Email verify error:", error);
    res.status(500).json({ message: "Verification failed", success: false });
  }
});

// --- Auth/User routes ---
router.use(anonSessionRoutes); // Anonymous session routes
router.post("/email", checkEmail); // Check email exists
router.post("/password", checkPassword); // Check password match
router.get("/user-details", userDetails); // Get user info
router.get("/logout", logOut); // Logout
router.post("/update-user", updateUserDetails); // Update profile
router.post("/search-user", searchUser); // Search user

// --- Export router ---
module.exports = router;
