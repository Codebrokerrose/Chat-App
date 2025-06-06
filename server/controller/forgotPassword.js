const UserModel = require("../models/UserModel");
const Token = require("../models/token");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }

    // Delete any existing token for that user
    let existingToken = await Token.findOne({ userId: user._id });
    if (existingToken) await existingToken.deleteOne();

    // Generate 6-digit code
    const resetCode = crypto.randomInt(100000, 999999).toString();
    const token = new Token({ userId: user._id, token: resetCode });
    await token.save();

    // Send the code to the user's email
    await sendEmail(
      user.email,
      "Reset Your Password",
      `Your verification code is: ${resetCode}`
    );

    return res.status(200).json({
      message: "Verification code sent to your email.",
      success: true,
    });
  } catch (error) {
    return res
      .status(500)
      .json({
        message: "Internal server error",
        success: false,
        error: error.message,
      });
  }
};

module.exports = forgotPassword;
