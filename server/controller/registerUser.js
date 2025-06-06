const UserModel = require("../models/UserModel");
const Token = require("../models/token");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");

async function registerUser(req, res) {
  try {
    const { name, email, password, profile_pic } = req.body;

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User already exists", success: false });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new UserModel({
      name,
      email,
      profile_pic,
      password: hashedPassword,
    });

    const savedUser = await user.save();

    const secretKey = crypto.randomInt(100000, 999999).toString();
    const token = new Token({ userId: savedUser._id, token: secretKey });
    await token.save();

    await sendEmail(
      savedUser.email,
      "Verify Your Email",
      `Your verification code is: ${secretKey}`
    );

    return res.status(201).json({
      message: "Verification code sent to email.",
      success: true,
      userId: savedUser._id,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
}

module.exports = registerUser;
